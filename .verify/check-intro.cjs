const fs=require('fs'),vm=require('vm'),assert=require('assert');
const {createCanvas,loadImage}=require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
function classes(){const set=new Set();return {add:x=>set.add(x),remove:x=>set.delete(x),contains:x=>set.has(x)}}
const canvas=createCanvas(1440,900);canvas.clientWidth=1440;canvas.clientHeight=900;
function el(){return {style:{},classList:classes(),setAttribute(){},focus(){},addEventListener(){},removeEventListener(){}}}
const identity=el(),caption=el(),progress=el(),skip=el(),main=el(),hero=el();
const target={left:340,top:138,width:760,height:196.1579};hero.getBoundingClientRect=()=>({...target,top:target.top+18});
const nodes={'.intro__canvas':canvas,'.intro__identity':identity,'.intro__caption':caption,'.intro__progress':progress,'.intro__skip':skip};
const root={...el(),querySelector:s=>nodes[s],contains:()=>false,hasAttribute:()=>false,parentNode:{removeChild(){}}};
let reduced=false,light=false,played=false,timer=0;
const window={innerWidth:1440,innerHeight:900,devicePixelRatio:1,sessionStorage:{getItem:()=>played?'1':null,setItem:()=>played=true},matchMedia:q=>({matches:q.includes('reduce')?reduced:q.includes('820')?light:false,addEventListener(){},removeEventListener(){}}),addEventListener(){},removeEventListener(){},getComputedStyle:()=>({transform:'matrix(1, 0, 0, 1, 0, 18)'}),setTimeout:()=>++timer,clearTimeout(){}};
const document={readyState:'loading',body:el(),documentElement:el(),hidden:false,createElement:()=>createCanvas(1,1),querySelector:s=>s==='.hero__logo'?hero:null,getElementById:id=>({intro:root,main,'hero-title':hero})[id],addEventListener(){},removeEventListener(){},dispatchEvent(){}};
const context={window,document,navigator:{hardwareConcurrency:8,deviceMemory:8},requestAnimationFrame:()=>1,cancelAnimationFrame(){},CustomEvent:function(){},console,Math};
let source=fs.readFileSync('assets/js/intro.js','utf8').replace('  function boot() {','  window.TestSequence = IntroSequence;\n  function boot() {');vm.runInNewContext(source,context);
assert(window.__orbitechShouldPlayIntro());reduced=true;assert(!window.__orbitechShouldPlayIntro());reduced=false;light=true;assert(!window.__orbitechShouldPlayIntro());light=false;
const seq=new window.TestSequence(root);seq.start();assert(main.inert);assert(played);assert(!window.__orbitechShouldPlayIntro());
assert.equal(seq.logoTarget.top,target.top);assert.equal(seq.DURATION,5200);
(async()=>{
 const logo=await loadImage('assets/img/orbitech-logo.png');
 for(let ms=0;ms<=5200;ms+=100){
   seq.travel+=seq.speedAt(ms)*.1;seq.draw(ms,100);seq.updateChrome(ms);
   const ctx=canvas.getContext('2d');const t=Math.max(0,Math.min(1,(ms-3300)/1500));const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
   const iw=547.2,w=iw+(target.width-iw)*e;const x=720+(target.left+target.width/2-720)*e;const y=432+(target.top+target.height/2-432)*e;
   ctx.save();ctx.globalAlpha=Number(identity.style.opacity);ctx.drawImage(logo,x-w/2,y-w*438/1697/2,w,w*438/1697);ctx.restore();
   if(ms<4200){ctx.fillStyle='#a3b4ce';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(caption.textContent||'',720,775)}
   const small=createCanvas(800,500);small.getContext('2d').drawImage(canvas,0,0,800,500);fs.writeFileSync(`.verify/orbit-${String(ms).padStart(4,'0')}.png`,small.toBuffer('image/png'));
 }
 assert.equal(identity.style.opacity,1);assert(identity.style.transform.includes('scale(1.3889)'));assert.equal(progress.style.transform,'scaleX(1.0000)');
 seq.requestSkip();assert(seq.dismissed);assert(!main.inert);assert(hero.classList.contains('is-landed'));assert(!document.body.classList.contains('is-intro-locked'));
 seq.requestSkip();
 console.log('PASS: reduced-motion, small-device and session gates; native canvas frames; target position compensation; completed progress; immediate skip; focus/scroll cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1});
