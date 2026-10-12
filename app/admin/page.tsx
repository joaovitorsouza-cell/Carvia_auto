import {requireChatGPTUser} from '../chatgpt-auth';
import {roleFor} from '../../lib/admin';
import AdminClient from './AdminClient';
export const dynamic='force-dynamic';
export default async function Admin(){const user=await requireChatGPTUser('/admin');const role=await roleFor(user.email);if(!role)return <main className="access-denied"><h1>Acesso restrito</h1><p>Somente administradores e gerentes autorizados podem acessar o painel.</p><a className="primary" href="/">Voltar à loja</a></main>;return <AdminClient role={role} name={user.displayName}/>;}
