import {env} from 'cloudflare:workers';
export function customerAuthConfig(){const v=env as unknown as Record<string,string>;const projectId=v.FIREBASE_PROJECT_ID||'',apiKey=v.FIREBASE_API_KEY||'',authDomain=v.FIREBASE_AUTH_DOMAIN||'',appId=v.FIREBASE_APP_ID||'';return {enabled:!!(projectId&&apiKey&&authDomain&&appId),config:{projectId,apiKey,authDomain,appId}};}
