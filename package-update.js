const p=JSON.parse(fs.readFileSync('package.json','utf8'));
p.devDependencies['@vitejs/plugin-react']='^4.3.4';
fs.writeFileSync('package.json',JSON.stringify(p,null,2));
const fs=require('fs');
console.log('updated vite=' + p.devDependencies.vite);
