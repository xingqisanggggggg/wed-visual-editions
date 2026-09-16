const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('editions.js','utf8');
const list=source.slice(source.indexOf('const projects='),source.indexOf('const mobile='));
const context={};vm.createContext(context);vm.runInContext(list+';this.projects=projects',context);
const paths=[...new Set(context.projects.flatMap(p=>p.pages))];
paths.forEach(p=>assert.ok(fs.existsSync(p),`Missing image ${p}`));
assert.equal(context.projects.length,4);context.projects.forEach(p=>assert.equal(p.cover,p.pages[0]));
const current=source.match(/function currentIndices\([^\n]+/)[0];
const next=source.match(/function nextPage\([^\n]+/)[0];
for(const mobile of [false,true])for(const project of context.projects.filter(p=>p.no!=='03')){
 const env={active:{p:project},page:0,mobile:()=>mobile};vm.createContext(env);vm.runInContext(current+'\n'+next,env);const visited=new Set([0]);let turns=0;
 do{env.page=vm.runInContext('nextPage(1)',env);const ids=vm.runInContext('currentIndices(page,active.p)',env);ids.forEach(i=>{assert.ok(i>=0&&i<project.pages.length);visited.add(i)});assert.equal(ids.length,env.page===0||mobile?1:2);assert.ok(++turns<20)}while(env.page!==0);
 assert.equal(visited.size,project.pages.length);const last=vm.runInContext('nextPage(-1)',env);assert.ok(last>0);env.page=last;assert.equal(vm.runInContext('nextPage(1)',env),0);
 console.log(`${project.slug} / ${mobile?'mobile':'desktop'}: all images reachable, correct spread size, loop and reverse boundary PASS`);
}
assert.ok(!source.includes('END OF EDITION'));
console.log(`${paths.length} original image paths exist; no generated end page; syntax checked separately.`);
