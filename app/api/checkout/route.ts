import {env} from 'cloudflare:workers';
import {catalogProducts} from '../../../db/schema';
import {getDb} from '../../../db';
import {orders} from '../../../db/schema';
import {eq} from 'drizzle-orm';
export async function POST(req:Request){
 const user=req.headers.get('oai-authenticated-user-id');
 if(!user)return Response.json({error:'Entre na sua conta para continuar.'},{status:401});
 if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Origem inválida.'},{status:403});
 const config=env as unknown as Record<string,string>;
 if(config.SALES_ENABLED!=='true'||!config.MERCADO_PAGO_ACCESS_TOKEN)return Response.json({error:'Esta loja está em configuração. Produtos e preços são exemplos; pagamentos ainda não estão habilitados.'},{status:503});
 let body:any;try{body=await req.json()}catch{return Response.json({error:'Carrinho inválido.'},{status:400})}
 if(!body||!Array.isArray(body.items)||!body.items.length||body.items.length>20)return Response.json({error:'Carrinho inválido.'},{status:400});
 const db=getDb();const products=await db.select().from(catalogProducts).where(eq(catalogProducts.active,true));const seen=new Set();const items=[];
 for(const line of body.items){if(!line||typeof line!=="object")return Response.json({error:"Carrinho inválido."},{status:400});const p=products.find(p=>p.id===line.id);if(!p||seen.has(line.id)||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>p.stock)return Response.json({error:'Confira os produtos e quantidades do carrinho.'},{status:400});seen.add(line.id);items.push({id:p.id,title:p.name,quantity:line.quantity,unit_price:p.price/100,currency_id:'BRL'});}
 const id=crypto.randomUUID(),total=items.reduce((s,p)=>s+Math.round(p.unit_price*100)*p.quantity,0);
 await db.insert(orders).values({id,userId:user,items:JSON.stringify(items),total,status:'aguardando_pagamento',createdAt:new Date().toISOString()});
 const origin=new URL(req.url).origin;
 try{const response=await fetch('https://api.mercadopago.com/checkout/preferences',{method:'POST',headers:{Authorization:'Bearer '+config.MERCADO_PAGO_ACCESS_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({items,external_reference:id,back_urls:{success:origin+'/?order='+id,failure:origin+'/?order='+id,pending:origin+'/?order='+id},auto_return:'approved'})});
 const result=await response.json() as {id:string;init_point:string};if(!response.ok||!result.init_point)throw Error();
 const target=new URL(result.init_point);if(target.protocol!=='https:'||!/(^|\.)mercadopago\.(com|com\.br)$/.test(target.hostname))throw Error();
 await db.update(orders).set({preferenceId:result.id}).where(eq(orders.id,id));return Response.json({url:result.init_point});
 }catch{await db.update(orders).set({status:'falha_checkout'}).where(eq(orders.id,id));return Response.json({error:'Não foi possível abrir o pagamento. Tente novamente.'},{status:502});}
}
