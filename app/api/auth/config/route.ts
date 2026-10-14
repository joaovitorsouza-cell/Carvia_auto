import {customerAuthConfig} from '../../../../lib/firebase-config';
export async function GET(){const c=customerAuthConfig();return Response.json(c.enabled?c:{enabled:false,config:null},{headers:{'Cache-Control':'no-store'}});}
