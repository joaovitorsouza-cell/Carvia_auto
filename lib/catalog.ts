export type Product={id:string;name:string;brand:string;code:string;category:string;price:number;stock:number;kind:string;description:string;imageUrl?:string;active?:boolean};
export const products = [
{id:'cv001',name:'Disco de freio ventilado',brand:'Linha de exemplo',code:'CV-FR001',category:'Freios',price:14990,stock:12,kind:'disc',description:'Disco ventilado para o sistema de frenagem. Verifique medidas e aplicação antes de comprar.'},
{id:'cv002',name:'Filtro de óleo blindado',brand:'Linha de exemplo',code:'CV-FL002',category:'Filtros',price:2990,stock:20,kind:'filter',description:'Filtro de reposição. A aplicação deve ser conferida pelo código do fabricante.'},
{id:'cv003',name:'Amortecedor dianteiro',brand:'Linha de exemplo',code:'CV-SU003',category:'Suspensão',price:23990,stock:8,kind:'shock',description:'Amortecedor dianteiro unitário. Confira lado, medidas e compatibilidade.'},
{id:'cv004',name:'Kit de pastilhas de freio',brand:'Linha de exemplo',code:'CV-FR004',category:'Freios',price:8990,stock:10,kind:'pads',description:'Jogo de pastilhas. Consulte a aplicação exata do veículo.'},
{id:'cv005',name:'Vela de ignição',brand:'Linha de exemplo',code:'CV-MO005',category:'Motor',price:2490,stock:24,kind:'spark',description:'Vela unitária. Confirme grau térmico e especificação do motor.'},
{id:'cv006',name:'Correia de acessórios',brand:'Linha de exemplo',code:'CV-MO006',category:'Motor',price:5990,stock:14,kind:'belt',description:'Correia para acessórios. Comprimento e número de canais dependem da aplicação.'},
{id:'cv007',name:'Terminal de direção',brand:'Linha de exemplo',code:'CV-DI007',category:'Direção',price:6990,stock:10,kind:'shock',description:'Terminal unitário. Verifique rosca, lado e aplicação.'},
{id:'cv008',name:'Filtro de ar do motor',brand:'Linha de exemplo',code:'CV-FL008',category:'Filtros',price:4490,stock:15,kind:'air',description:'Elemento filtrante. Confira dimensões e código original.'}
];
export const money=(v:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v/100);
