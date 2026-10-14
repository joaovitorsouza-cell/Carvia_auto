import {validateProduct} from './product-validation';
import {parseVehicles} from './vehicles';
export const importHeaders=['codigo','nome','marca','codigo_fabricante','categoria','preco','estoque','estoque_minimo','descricao','fotos','veiculos','ativo'];
export function importProduct(row:Record<string,unknown>){
 const t=(k:string)=>String(row[k]??'').trim();
 const decimal=t('preco');if(!/^\d+([.,]\d{1,2})?$/.test(decimal))throw Error('Preço: informe 149,90 ou 149.90, sem símbolo de moeda.');
 const quantity=(key:string,optional=false)=>{const s=t(key);if(optional&&!s)return 0;if(!/^\d+$/.test(s))throw Error('Confira '+key+': use um número inteiro.');return Number(s)};
 const active=t('ativo').toLowerCase();if(active&&!['sim','não','nao','true','false','1','0'].includes(active))throw Error('Ativo: use sim ou não.');
 return validateProduct({code:t('codigo'),name:t('nome'),brand:t('marca'),manufacturerCode:t('codigo_fabricante'),category:t('categoria'),price:Math.round(Number(decimal.replace(',','.'))*100),stock:quantity('estoque'),minStock:quantity('estoque_minimo',true),description:t('descricao'),images:t('fotos')?t('fotos').split(';').map(s=>s.trim()):[],vehicles:parseVehicles(t('veiculos')),active:!['não','nao','false','0'].includes(active),kind:'disc'});
}
export function previewImport(rows:Record<string,unknown>[],existing:{code:string;id:string;revision:number}[],mode:'skip'|'update'){
 const seen=new Set<string>();return rows.map((row,index)=>{try{const data=importProduct(row);if(seen.has(data.code))throw Error('Código repetido nesta planilha.');seen.add(data.code);const old=existing.find(p=>p.code===data.code);return {line:index+2,data,action:old?(mode==='skip'?'Ignorar':'Atualizar'):'Cadastrar',id:old?.id,revision:old?.revision,error:''};}catch(e){return {line:index+2,data:null,action:'Corrigir',error:(e as Error).message};}});
}
