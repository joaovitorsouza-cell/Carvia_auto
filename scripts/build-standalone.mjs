import {build} from 'esbuild';
import fs from 'node:fs';
const result=await build({entryPoints:['standalone/entry.tsx'],bundle:true,write:false,minify:true,format:'iife',platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const image='data:image/png;base64,'+fs.readFileSync('public/brand/carvia-empresa.png').toString('base64');
const js=result.outputFiles[0].text.replaceAll('/brand/carvia-empresa.png',image).replaceAll('</script','<\\/script');
const css=fs.readFileSync('app/globals.css','utf8').replace(/@import[^;]+;/g,'')+'\n.standalone-note{padding:14px;background:#fff2cb;text-align:center;font:13px Arial;line-height:1.6}.standalone-note a{text-decoration:underline;font-weight:bold}';
fs.mkdirSync('standalone/dist',{recursive:true});
fs.writeFileSync('standalone/dist/index.html','<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Carvia — demonstração</title><style>'+css+'</style></head><body><div id="root"></div><script>'+js+'</script></body></html>');
console.log('standalone/dist/index.html gerado');
