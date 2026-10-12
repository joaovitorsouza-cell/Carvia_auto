import {roleFor} from '../../../lib/admin';
export async function GET(req:Request){const role=req.headers.get('oai-authenticated-user-id')?await roleFor(req.headers.get('oai-authenticated-user-email')):null;return Response.json({canManage:!!role},{headers:{'Cache-Control':'no-store'}});}
