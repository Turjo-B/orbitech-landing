const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes={};
function element(){const classes=new Set();return {innerHTML:'',textContent:'',attrs:{},hidden:false,classList:{add:k=>classes.add(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k),contains:k=>classes.has(k)},getAttribute(k){return this.attrs[k]},setAttribute(k,v){this.attrs[k]=v}}}
const context={window:{},console,document:{readyState:'loading',getElementById:id=>nodes[id] ||= element(),addEventListener(){}}};
vm.runInNewContext(fs.readFileSync('assets/js/content.config.js','utf8'),context);
let source=fs.readFileSync('assets/js/app.js','utf8').replace('  function boot() {','  window.checkToolkit = {render:renderTechStack,init:initTechStack};\n  function boot() {');
vm.runInNewContext(source,context);
context.window.checkToolkit.render();
const groups=context.window.ORBITECH.software.techStack;
assert.equal(nodes['stack-count'].textContent,32);
assert.equal((nodes['tech-stack'].innerHTML.match(/<article/g)||[]).length,4);
assert.equal((nodes['tech-stack'].innerHTML.match(/stack-group__item/g)||[]).length,32);
assert.equal((nodes['stack-filters'].innerHTML.match(/<button/g)||[]).length,5);
for(const g of groups){assert(g.description);for(const tool of g.items)assert(nodes['tech-stack'].innerHTML.includes(tool));}
const buttons=['all','0','1','2','3'].map(id=>{const b=element();b.attrs['data-stack']=id;return b;});
const cards=['0','1','2','3'].map(id=>{const c=element();c.attrs['data-stack-group']=id;return c;});
let click;
nodes['stack-filters'].addEventListener=(name,fn)=>click=fn;
nodes['stack-filters'].contains=b=>buttons.includes(b);
nodes['stack-filters'].querySelectorAll=()=>buttons;
nodes['tech-stack'].querySelectorAll=()=>cards;
context.window.checkToolkit.init();
for(let i=1;i<buttons.length;i++){
 click({target:{closest:()=>buttons[i]}});
 assert.deepEqual(cards.map(c=>!c.hidden),cards.map((c,j)=>j===i-1));
 assert.equal(buttons.filter(b=>b.attrs['aria-pressed']==='true').length,1);
 assert(nodes['tech-stack'].classList.contains('is-filtered'));
}
click({target:{closest:()=>buttons[0]}});
assert(cards.every(c=>!c.hidden));assert(!nodes['tech-stack'].classList.contains('is-filtered'));
click({target:{closest:()=>null}});
assert.deepEqual(Array.from(context.window.ORBITECH.software.featuredWork,p=>p.title),['MoneyBag','DesiTrip','EVENT-EKHANE','Aid-Link']);
console.log('PASS: 32 tools rendered once across four cards, five filters, exclusive selection, reset, accessible pressed states, and selected projects preserved.');
