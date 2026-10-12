import {env} from 'cloudflare:workers';
import {getDb} from '../db';
import {staff} from '../db/schema';
import {eq} from 'drizzle-orm';
export type StoreRole='admin'|'manager';
export function ownerEmail(){return ((env as unknown as Record<string,string>).STORE_OWNER_EMAIL||'').trim().toLowerCase();}
export async function roleFor(email:string|null){if(!email)return null;const normalized=email.trim().toLowerCase();const owner=ownerEmail();if(owner&&normalized===owner)return 'admin' as StoreRole;const [row]=await getDb().select().from(staff).where(eq(staff.email,normalized));return row&&(row.role==='admin'||row.role==='manager')?row.role as StoreRole:null;}
export async function authorize(req:Request,adminOnly=false){if(!req.headers.get('oai-authenticated-user-id'))return {error:Response.json({error:'Entre na sua conta.'},{status:401}),role:null};const role=await roleFor(req.headers.get('oai-authenticated-user-email'));if(!role||(adminOnly&&role!=='admin'))return {error:Response.json({error:'Você não tem permissão para esta ação.'},{status:403}),role:null};if(req.method!=='GET'&&req.headers.get('origin')!==new URL(req.url).origin)return {error:Response.json({error:'Origem inválida.'},{status:403}),role:null};return {error:null,role};}
