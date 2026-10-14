export type Vehicle={make:string;model:string;yearFrom:number;yearTo:number;engine:string};
export type VehicleFilter={make:string;model:string;year:string;engine:string};
export const blankVehicleFilter:VehicleFilter={make:'',model:'',year:'',engine:''};
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function vehicleMatches(v:Vehicle,f:VehicleFilter){return (!f.make||norm(v.make)===norm(f.make))&&(!f.model||norm(v.model)===norm(f.model))&&(!f.year||Number(f.year)>=v.yearFrom&&Number(f.year)<=v.yearTo)&&(!f.engine||norm(v.engine)===norm(f.engine));}
export function productMatchesVehicle(vehicles:Vehicle[]|undefined,f:VehicleFilter){return !Object.values(f).some(Boolean)||(vehicles||[]).some(v=>vehicleMatches(v,f));}
export function vehicleLabel(v:Vehicle){return `${v.make} ${v.model} · ${v.yearFrom===v.yearTo?v.yearFrom:v.yearFrom+'–'+v.yearTo} · ${v.engine}`;}
export function parseVehicles(value:string):Vehicle[]{if(!value.trim())return [];return value.split(';').map(part=>{const [make,model,years,engine,...extra]=part.split('|').map(x=>x.trim());if(extra.length||!make||!model||!engine||!/^\d{4}(-\d{4})?$/.test(years||''))throw Error('Aplicação: use Marca|Modelo|Ano inicial-Ano final|Motor; separe veículos com ponto e vírgula.');const [from,to]=years.split('-').map(Number);return {make,model,yearFrom:from,yearTo:to||from,engine};});}
