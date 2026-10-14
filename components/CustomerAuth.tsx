'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {initializeApp,getApps} from 'firebase/app';
import {getAuth,onAuthStateChanged,type User,type Auth} from 'firebase/auth';
type Context={auth:Auth|null;user:User|null;ready:boolean;configured:boolean;configError:string;request:(url:string,init?:RequestInit)=>Promise<Response>};
const CustomerContext=createContext<Context|null>(null);
export function CustomerAuthProvider({children}:{children:React.ReactNode}){const[auth,setAuth]=useState<Auth|null>(null),[user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[configured,setConfigured]=useState(false),[configError,setConfigError]=useState('');
useEffect(()=>{let live=true,unsubscribe:(()=>void)|undefined;fetch('/api/auth/config').then(async r=>{if(!r.ok)throw Error();return await r.json() as any}).then(d=>{if(!live)return;if(!d.enabled){setReady(true);return;}const app=getApps().find(a=>a.name==='carvia-customer')||initializeApp(d.config,'carvia-customer');const a=getAuth(app);a.languageCode='pt-BR';setAuth(a);setConfigured(true);unsubscribe=onAuthStateChanged(a,u=>{if(live){setUser(u);setReady(true)}},()=>{if(live){setReady(true);setConfigError('Não foi possível carregar sua sessão.')}})}).catch(()=>{if(live){setReady(true);setConfigError('Não foi possível carregar o acesso da loja. Atualize a página.')}});return()=>{live=false;unsubscribe?.()}},[]);
async function request(url:string,init:RequestInit={}){const headers=new Headers(init.headers);if(auth?.currentUser)headers.set('Authorization','Bearer '+await auth.currentUser.getIdToken());return fetch(url,{...init,headers});}
return <CustomerContext.Provider value={{auth,user,ready,configured,configError,request}}>{children}</CustomerContext.Provider>}
export function useCustomerAuth(){const context=useContext(CustomerContext);if(!context)throw Error('CustomerAuthProvider ausente');return context;}
