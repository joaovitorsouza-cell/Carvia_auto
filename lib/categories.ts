/** Shared departments and part types for the storefront and management panel. */
export const categoryGroups = [
 {name:'Óleos e lubrificantes',items:['Óleo lubrificante','Óleo de motor','Óleo de câmbio','Óleo de direção hidráulica','Fluido de freio','Graxas','Aditivos para óleo']},
 {name:'Filtros',items:['Filtro de óleo','Filtro de ar','Filtro de combustível','Filtro de cabine','Filtro hidráulico','Kits de filtros']},
 {name:'Correias e tensores',items:['Correia dentada','Correia de acessórios','Correia do alternador','Tensores e polias','Kit de correia dentada']},
 {name:'Juntas e retentores',items:['Junta do cabeçote','Jogo de juntas','Junta da tampa de válvulas','Junta do cárter','Juntas de admissão e escape','Retentores','Anéis de vedação']},
 {name:'Motor',items:['Pistões','Anéis de pistão','Camisas de cilindro','Bronzinas de biela','Bronzinas de mancal','Válvulas e guias','Comando de válvulas','Bomba de óleo','Coxins do motor','Tuchos e balancins','Kits de motor']},
 {name:'Freios',items:['Pastilhas de freio','Sapatas de freio','Discos de freio','Tambores de freio','Cilindro mestre','Cilindro de roda','Servo-freio','Pinças de freio','Cabos de freio','Mangueiras de freio','Sensores ABS']},
 {name:'Suspensão',items:['Amortecedores','Molas','Bandejas e balanças','Pivôs','Buchas de suspensão','Bieletas','Batentes e coifas','Rolamentos de roda','Cubos de roda','Kits de suspensão']},
 {name:'Direção',items:['Caixa de direção','Bomba de direção hidráulica','Terminais de direção','Barras axiais','Barras de direção','Mangueiras de direção']},
 {name:'Arrefecimento',items:['Radiadores','Bomba d’água','Válvula termostática','Mangueiras de arrefecimento','Reservatório de expansão','Tampas de reservatório','Ventoinhas','Aditivo para radiador']},
 {name:'Transmissão',items:['Kit de embreagem','Disco de embreagem','Platô de embreagem','Rolamento de embreagem','Cabos e atuadores de embreagem','Juntas homocinéticas','Semieixos','Coifas de transmissão','Peças de câmbio']},
 {name:'Ignição e injeção',items:['Velas de ignição','Cabos de vela','Bobinas de ignição','Bomba de combustível','Bicos injetores','Sonda lambda','Sensores do motor','Corpo de borboleta','Reguladores de pressão']},
 {name:'Elétrica',items:['Baterias','Alternadores','Motor de partida','Lâmpadas automotivas','Faróis e lanternas','Fusíveis e relés','Interruptores','Chicotes e conectores','Buzinas']},
 {name:'Acessórios',items:['Palhetas','Braços do limpador','Retrovisores','Tapetes','Calotas','Antenas','Maçanetas','Fechaduras','Cabos de capô','Itens de segurança']},
 {name:'Climatização',items:['Compressor de ar-condicionado','Condensador','Evaporador','Motor do ventilador interno','Mangueiras de ar-condicionado']},
 {name:'Escape',items:['Escapamentos','Silenciosos','Catalisadores','Coxins e suportes de escape','Abraçadeiras de escape']},
 {name:'Limpeza e ferramentas',items:['Limpeza automotiva','Ceras e polidores','Desengraxantes','Limpa-contato','Ferramentas','Fixadores e parafusos']}
] as const;
export const categoryNames:string[] = categoryGroups.flatMap(g=>[g.name,...g.items]);
export function normalizeSearch(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();}
export function categoryMatches(productCategory:string,selected:string){if(selected==='Todas')return true;const value=normalizeSearch(productCategory),target=normalizeSearch(selected);if(value===target)return true;const group=categoryGroups.find(g=>normalizeSearch(g.name)===target);return !!group?.items.some(item=>normalizeSearch(item)===value);}
