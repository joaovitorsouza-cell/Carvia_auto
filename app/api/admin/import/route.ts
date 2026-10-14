import {authorize} from '../../../../lib/admin';
import {getDb} from '../../../../db';
import {catalogProducts,storeSettings} from '../../../../db/schema';
import {previewImport} from '../../../../lib/import-products';
import {eq,and,sql} from 'drizzle-orm';
export async function POST(req:Request){const a=await authorize(req);if(a.error)return a.error;try{const text=await req.text();if(text.length>1000000)return Response.json({error:'Planilha muito grande.'},{status:413});const b=JSON.parse(text);if(!Array.isArray(b.rows)||!b.rows.length||b.rows.length>100||!['skip','update'].includes(b.mode))return Response.json({error:'Importe de 1 a 100 linhas e escolha atualizar ou ignorar.'},{status:400});const db=getDb(),existing=await db.select().from(catalogProducts),preview=previewImport(b.rows,existing,b.mode);if(preview.some(p=>p.error))return Response.json({error:'Corrija os erros antes de importar.',preview},{status:400});if(!b.confirm)return Response.json({preview});
 if(!Array.isArray(b.expected))return Response.json({error:'Gere a prévia antes de confirmar.'},{status:400});
 for(const p of preview){const expected=b.expected.find((e:any)=>e.line===p.line);if(!expected||expected.action!==p.action||expected.id!==p.id||expected.revision!==p.revision)return Response.json({error:'O catálogo mudou desde a prévia. Gere outra prévia antes de salvar.'},{status:409});}
 const actor=req.headers.get('oai-authenticated-user-email')||'';const tasks:any[]=[];
 for(const p of preview){if(!p.data||p.action==='Ignorar')continue;const data={...p.data,stockActor:actor,stockReason:'Importação de planilha'};tasks.push(p.id?db.update(catalogProducts).set({...data,revision:sql`${catalogProducts.revision}+1`}).where(and(eq(catalogProducts.id,p.id),eq(catalogProducts.revision,p.revision!))).returning({id:catalogProducts.id}):db.insert(catalogProducts).values({...data,id:crypto.randomUUID(),createdAt:new Date().toISOString()}).returning({id:catalogProducts.id}));}
 if(!tasks.length)return Response.json({saved:0,skipped:preview.length,conflicts:0});
 tasks.push(db.insert(storeSettings).values({key:'catalogConfigured',value:'true'}).onConflictDoUpdate({target:storeSettings.key,set:{value:'true'}}));
 const results=await db.batch(tasks as any);const saved=results.slice(0,-1).reduce((n:any,r:any)=>n+r.length,0);return Response.json({saved,skipped:preview.filter(p=>p.action==='Ignorar').length,conflicts:tasks.length-1-saved});
 }catch(e){return Response.json({error:/unique|constraint/i.test((e as Error).message)?'Um código já foi cadastrado. Gere novamente a prévia.':'Não foi possível importar. Confira os dados da planilha.'},{status:400});}}
