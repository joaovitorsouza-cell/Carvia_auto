import {createRemoteJWKSet,jwtVerify} from 'jose';
import {customerAuthConfig} from './firebase-config';
const keys=createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
export type CustomerIdentity={id:string;email:string;name:string;verified:boolean;provider:'firebase'|'sites'};
export async function customerFor(req:Request):Promise<CustomerIdentity|null>{
 const header=req.headers.get('authorization');
 if(header){const {config,enabled}=customerAuthConfig();if(!enabled||!header.startsWith('Bearer ')||header.length>12000)return null;try{const {payload}=await jwtVerify(header.slice(7),keys,{issuer:'https://securetoken.google.com/'+config.projectId,audience:config.projectId,algorithms:['RS256'],requiredClaims:['exp','iat','sub','auth_time']});const now=Math.floor(Date.now()/1000);if(!payload.sub||payload.sub.length>128||typeof payload.iat!=='number'||payload.iat>now||typeof payload.auth_time!=='number'||payload.auth_time>now||typeof payload.email!=='string')return null;return {id:'firebase:'+config.projectId+':'+payload.sub,email:payload.email,name:typeof payload.name==='string'?payload.name:'',verified:payload.email_verified===true,provider:'firebase'};}catch{return null;}}
 const id=req.headers.get('oai-authenticated-user-id'),email=req.headers.get('oai-authenticated-user-email');return id&&email?{id,email,name:'',verified:true,provider:'sites'}:null;
}
