import {getDb} from '../../../db';
import {catalogProducts,storeSettings} from '../../../db/schema';
import {products as examples} from '../../../lib/catalog';
import {eq,desc} from 'drizzle-orm';
export async function GET(){const db=getDb();const rows=await db.select().from(catalogProducts).where(eq(catalogProducts.active,true)).orderBy(desc(catalogProducts.createdAt));const settings=await db.select().from(storeSettings);const configured=settings.some(s=>s.key==='catalogConfigured'&&s.value==='true');return Response.json({products:configured?rows.map(({stockActor,stockReason,revision,minStock,...p})=>p):examples.map(p=>({...p,imageUrl:'',active:true})),demo:!configured,whatsapp:settings.find(s=>s.key==='whatsapp')?.value||''},{headers:{'Cache-Control':'no-store'}});}
