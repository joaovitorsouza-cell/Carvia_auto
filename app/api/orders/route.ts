import {env} from 'cloudflare:workers';
import {customerFor} from '../../../lib/customer-auth';
import {getDb} from '../../../db';
import {orders} from '../../../db/schema';
import {eq,and,desc} from 'drizzle-orm';
export async function GET(req:Request){
 const user=(await customerFor(req))?.id;if(!user)return Response.json({error:'Entre para consultar seus pedidos.'},{status:401});
 const db=getDb(),id=new URL(req.url).searchParams.get('id');
 if(id){const [order]=await db.select().from(orders).where(and(eq(orders.id,id),eq(orders.userId,user)));if(!order)return Response.json({error:'Pedido não encontrado.'},{status:404});
 const config=env as unknown as Record<string,string>;
 if(config.MERCADO_PAGO_ACCESS_TOKEN){try{const res=await fetch('https://api.mercadopago.com/v1/payments/search?external_reference='+encodeURIComponent(id),{headers:{Authorization:'Bearer '+config.MERCADO_PAGO_ACCESS_TOKEN}});if(res.ok){const data=await res.json() as {results:Array<{status:string;transaction_amount:number;currency_id:string;external_reference:string}>};const paid=data.results?.find(p=>p.status==='approved'&&p.external_reference===id&&p.currency_id==='BRL'&&Math.round(p.transaction_amount*100)===order.total);if(paid){order.status='pago';await db.update(orders).set({status:'pago'}).where(eq(orders.id,id));}}}catch{}}
 return Response.json({orders:[order]},{headers:{'Cache-Control':'no-store'}});}
 return Response.json({orders:await db.select().from(orders).where(eq(orders.userId,user)).orderBy(desc(orders.createdAt)).limit(50)},{headers:{'Cache-Control':'no-store'}});
}
