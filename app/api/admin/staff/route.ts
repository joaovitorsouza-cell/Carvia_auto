import {authorize,ownerEmail} from '../../../../lib/admin';
import {getDb} from '../../../../db';
import {staff} from '../../../../db/schema';
import {eq} from 'drizzle-orm';
export async function GET(req:Request){const a=await authorize(req,true);if(a.error)return a.error;return Response.json({staff:await getDb().select().from(staff),owner:ownerEmail()},{headers:{'Cache-Control':'no-store'}});}
async function write(req:Request,remove=false){const a=await authorize(req,true);if(a.error)return a.error;try{const body:any=await req.json();if(typeof body?.email!=='string'||body.email.length>254||!/^\S+@\S+\.\S+$/.test(body.email))throw Error('Informe um e-mail válido.');const email=body.email.trim().toLowerCase();if(email===ownerEmail()||email===req.headers.get('oai-authenticated-user-email')?.trim().toLowerCase())return Response.json({error:'Você não pode alterar o proprietário ou o seu próprio acesso.'},{status:400});if(remove)await getDb().delete(staff).where(eq(staff.email,email));else{if(!['admin','manager'].includes(body.role))throw Error('Cargo inválido.');await getDb().insert(staff).values({email,role:body.role}).onConflictDoUpdate({target:staff.email,set:{role:body.role}});}return Response.json({ok:true});}catch(e){return Response.json({error:(e as Error).message},{status:400});}}
export const PUT=(r:Request)=>write(r);export const DELETE=(r:Request)=>write(r,true);
