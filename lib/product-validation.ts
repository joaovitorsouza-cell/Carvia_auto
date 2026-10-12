export function validateProduct(body:any){
 if(!body||typeof body!=='object')throw Error('Dados inválidos.');
 const text=(key:string,max:number,required=true)=>{const v=body[key];if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error('Confira o campo '+key+'.');return v.trim();};
 const name=text('name',120),brand=text('brand',80,false),code=text('code',60),category=text('category',60),description=text('description',2000,false),imageUrl=text('imageUrl',2048,false);
 if(!Number.isSafeInteger(body.price)||body.price<1||body.price>100000000)throw Error('Informe um preço válido.');
 if(!Number.isSafeInteger(body.stock)||body.stock<0||body.stock>1000000)throw Error('Informe um estoque válido.');
 if(typeof body.active!=='boolean')throw Error('Disponibilidade inválida.');
 if(imageUrl){let u;try{u=new URL(imageUrl)}catch{throw Error('Informe um endereço de imagem válido.')}if(u.protocol!=='https:'||u.username||u.password)throw Error('Use uma imagem com endereço HTTPS.');}
 const kinds=['disc','filter','shock','pads','spark','belt','air'];if(!kinds.includes(body.kind))throw Error('Ilustração inválida.');
 return {name,brand,code,category,price:body.price,stock:body.stock,kind:body.kind,description,imageUrl,active:body.active};
}
export function whatsappDigits(input:unknown){if(typeof input!=='string')throw Error('Número inválido.');const value=input.replace(/[\s()+.-]/g,'');if(value&&!/^\d{10,15}$/.test(value))throw Error('Informe país e DDD. Exemplo: 5563999999999.');return value;}
