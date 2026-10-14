import * as products from '../app/api/admin/products/route';
import * as stock from '../app/api/admin/stock/route';
import * as importer from '../app/api/admin/import/route';
import * as catalog from '../app/api/catalog/route';
import * as orders from '../app/api/orders/route';
import * as profile from '../app/api/customer/profile/route';
import * as checkout from '../app/api/checkout/route';
export default {async fetch(req:Request){const routes:Record<string,any>={'/api/admin/products':products,'/api/admin/stock':stock,'/api/admin/import':importer,'/api/catalog':catalog,'/api/orders':orders,'/api/customer/profile':profile,'/api/checkout':checkout};const handler=routes[new URL(req.url).pathname]?.[req.method];return handler?handler(req):new Response('Not found',{status:404})}};
