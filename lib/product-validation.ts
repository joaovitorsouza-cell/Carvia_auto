import type {Vehicle} from './vehicles';
export function validateProduct(body:any){
 if(!body||typeof body!=='object')throw Error('Dados inválidos.');
 const labels:Record<string,string>={name:'nome',brand:'marca',code:'código',category:'categoria',description:'descrição',manufacturerCode:'código do fabricante'};
 const text=(key:string,max:number,required=true)=>{const v=body[key]??'';if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('Confira o campo '+(labels[key]||key)+'.');return v.trim();};
 const name=text('name',120),brand=text('brand',80,false),code=text('code',60),category=text('category',60),description=text('description',2000,false),manufacturerCode=text('manufacturerCode',80,false);
 if(!Number.isSafeInteger(body.price)||body.price<1||body.price>100000000)throw Error('Informe um preço válido.');
 for(const field of ['stock','minStock']){const value=body[field]??0;if(!Number.isSafeInteger(value)||value<0||value>1000000)throw Error('Informe '+(field==='stock'?'estoque':'estoque mínimo')+' válido.');}
 if(typeof body.active!=='boolean')throw Error('Disponibilidade inválida.');
 const images=body.images??(body.imageUrl?[body.imageUrl]:[]);if(!Array.isArray(images)||images.length>8)throw Error('Informe no máximo 8 fotos.');
 for(const image of images){if(typeof image!=='string'||image.length>2048)throw Error('Informe uma imagem válida.');let u;try{u=new URL(image)}catch{throw Error('Informe um endereço de imagem válido.')}if(u.protocol!=='https:'||u.username||u.password)throw Error('Use uma imagem com endereço HTTPS.');}
 const vehicles:Vehicle[]=body.vehicles??[];if(!Array.isArray(vehicles)||vehicles.length>50)throw Error('Informe no máximo 50 aplicações.');
 for(const v of vehicles){if(!v||['make','model','engine'].some(k=>typeof (v as any)[k]!=='string'||!(v as any)[k].trim()||(v as any)[k].length>80)||!Number.isInteger(v.yearFrom)||!Number.isInteger(v.yearTo)||v.yearFrom<1900||v.yearTo>2100||v.yearTo<v.yearFrom)throw Error('Informe aplicações com marca, modelo, motor e intervalo de anos válido (1900 a 2100).');}
 const kinds=['disc','filter','shock','pads','spark','belt','air'];if(!kinds.includes(body.kind))throw Error('Ilustração inválida.');
 return {name,brand,code,category,price:body.price as number,stock:body.stock as number,minStock:(body.minStock??0) as number,kind:body.kind as string,description,manufacturerCode,images:[...new Set(images)] as string[],imageUrl:images[0]||'',vehicles:vehicles.map(v=>({...v,make:v.make.trim(),model:v.model.trim(),engine:v.engine.trim()})),active:body.active as boolean};
}
export function whatsappDigits(input:unknown){if(typeof input!=='string')throw Error('Número inválido.');const value=input.replace(/[\s()+.-]/g,'');if(value&&!/^\d{10,15}$/.test(value))throw Error('Informe país e DDD. Exemplo: 5563999999999.');return value;}
