import {Miniflare} from 'miniflare';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
await build({entryPoints:['tests/api-worker.ts'],bundle:true,format:'esm',platform:'browser',external:['cloudflare:workers'],outfile:'.sites-runtime/carvia-api-test.mjs'});
const mf=new Miniflare({modules:true,scriptPath:'.sites-runtime/carvia-api-test.mjs',compatibilityDate:'2026-05-15',d1Databases:['DB'],bindings:{STORE_OWNER_EMAIL:'owner@example.test'}});
try{
const db=await mf.getD1Database('DB');
for(const path of fs.readdirSync('drizzle').filter(p=>p.endsWith('.sql')).sort()){for(const statement of fs.readFileSync('drizzle/'+path,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(statement).run();}
const headers={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@example.test','Origin':'https://carvia.test','Content-Type':'application/json'};
async function call(path,method='GET',body,head=headers){const r=await mf.dispatchFetch('https://carvia.test'+path,{method,headers:head,body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
assert.equal((await call('/api/admin/products','GET',undefined,{})).status,401);
assert.equal((await call('/api/admin/products','GET',undefined,{...headers,'oai-authenticated-user-email':'client@test'})).status,403);
const item={name:'Filtro',code:'0001',category:'Filtros',brand:'Marca',price:2990,stock:5,minStock:2,kind:'filter',description:'Descrição',images:['https://example.com/a.jpg'],vehicles:[{make:'Fiat',model:'Teste',yearFrom:2000,yearTo:2005,engine:'1.0'}],active:true};
assert.equal((await call('/api/admin/products','POST',item,{...headers,Origin:'https://evil.test'})).status,403);
assert.equal((await call('/api/admin/products','POST',item)).status,200);
assert.equal((await call('/api/admin/products','POST',item)).status,400);
const first=(await call('/api/admin/products')).data.products[0];
let history=(await call('/api/admin/stock')).data.movements;assert.equal(history.length,1);assert.equal(history[0].delta,5);
assert.equal((await call('/api/admin/stock','POST',{id:first.id,delta:-6,reason:'Venda'})).status,409);
assert.equal((await call('/api/admin/stock','POST',{id:first.id,delta:-3,reason:'Venda balcão'})).data.stock,2);
assert.equal((await call('/api/admin/products','PUT',{...first,name:'Stale'})).status,409);
const current=(await call('/api/admin/products')).data.products[0];assert.equal(current.stock,2);
const cat=(await call('/api/catalog')).data;assert.equal(cat.demo,false);assert.equal(cat.products[0].images.length,1);assert(!('stockActor' in cat.products[0]));
const row={codigo:'0001',nome:'Filtro importado',categoria:'Filtros',preco:'31,50',estoque:'7'};
let preview=(await call('/api/admin/import','POST',{rows:[row],mode:'skip'})).data.preview;
assert.equal(preview[0].action,'Ignorar');
assert.equal((await call('/api/admin/import','POST',{rows:[row],mode:'skip',confirm:true,expected:preview})).data.saved,0);
preview=(await call('/api/admin/import','POST',{rows:[row],mode:'update'})).data.preview;
assert.equal((await call('/api/admin/import','POST',{rows:[row],mode:'update',confirm:true,expected:preview})).data.saved,1);
assert.equal((await call('/api/admin/products')).data.products[0].stock,7);
assert.equal((await call('/api/admin/import','POST',{rows:[row,row],mode:'update'})).status,400);
assert.equal((await call('/api/admin/import','POST',{rows:[row],mode:'update',confirm:true,expected:preview})).status,409);
history=(await call('/api/admin/stock')).data.movements;assert.deepEqual(history.map(m=>m.delta),[5,-3,5]);
const client={...headers,'oai-authenticated-user-id':'clientA','oai-authenticated-user-email':'clientA@test'};
await db.prepare("INSERT INTO orders(id,user_id,items,total,status,created_at) VALUES ('orderA','clientA','[]',10,'aguardando_pagamento','2026-01-01'),('orderB','clientB','[]',20,'aguardando_pagamento','2026-01-01')").run();
assert.equal((await call('/api/orders','GET',undefined,client)).data.orders.length,1);
assert.equal((await call('/api/orders?id=orderB','GET',undefined,client)).status,404);
assert.equal((await call('/api/orders','GET',undefined,{...client,Authorization:'Bearer forged'})).status,401);
assert.equal((await call('/api/customer/profile','PUT',{name:'Cliente A',phone:'63999999999'},client)).status,200);
assert.equal((await call('/api/customer/profile','GET',undefined,client)).data.profile.name,'Cliente A');
assert.notEqual((await call('/api/customer/profile','GET',undefined,{...client,'oai-authenticated-user-id':'clientB'})).data.profile.name,'Cliente A');
assert.equal((await call('/api/checkout','POST',{items:[{id:first.id,quantity:1}]},client)).status,503);
await db.prepare("INSERT INTO staff(email,role) VALUES('manager@test','manager')").run();
assert.equal((await call('/api/admin/stock','GET',undefined,{...headers,'oai-authenticated-user-email':'manager@test'})).status,200);
console.log('APIs + D1: permissões, origem, duplicados, concorrência, estoque, importação, perfil, isolamento de pedidos e bloqueio de pagamentos: OK');
}finally{await mf.dispose()}
