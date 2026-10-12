import {authorize} from '../../../../lib/admin';
import {whatsappDigits} from '../../../../lib/product-validation';
import {getDb} from '../../../../db';
import {storeSettings} from '../../../../db/schema';
export async function GET(req:Request){const a=await authorize(req,true);if(a.error)return a.error;return Response.json({settings:await getDb().select().from(storeSettings)},{headers:{'Cache-Control':'no-store'}});}
export async function PUT(req:Request){const a=await authorize(req,true);if(a.error)return a.error;try{const body:any=await req.json();const value=whatsappDigits(body?.whatsapp);await getDb().insert(storeSettings).values({key:'whatsapp',value}).onConflictDoUpdate({target:storeSettings.key,set:{value}});return Response.json({ok:true});}catch(e){return Response.json({error:(e as Error).message},{status:400});}}
