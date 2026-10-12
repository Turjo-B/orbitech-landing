// Regression checks for the intro's landing geometry and scroll-unlock ordering.
// Run with: node scripts/check-intro-handoff.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function element() {
  const values = new Set();
  return { style: {}, classList: { add: x => values.add(x), remove: x => values.delete(x), contains: x => values.has(x) },
    setAttribute() {}, removeEventListener() {}, focus() {} };
}
const identity = element(), heroLogo = element(), main = element(), skip = element();
const canvas = {clientWidth: 1440, clientHeight: 900, getContext: () => ({setTransform() {}})};
const root = {...element(), querySelector: s => ({'.intro__canvas':canvas,'.intro__identity':identity,'.intro__skip':skip})[s], contains: () => false};
let rect = {left:340,top:132,width:760,height:196};
heroLogo.getBoundingClientRect = () => ({...rect});
const document = {readyState:'loading',body:element(),documentElement:element(),querySelector:()=>heroLogo,
  getElementById:()=>main,addEventListener(){},removeEventListener(){},dispatchEvent(){}};
const window = {innerWidth:1440,innerHeight:900,devicePixelRatio:1,removeEventListener(){},setTimeout(){}};
const context = {window,document,console,cancelAnimationFrame(){},CustomEvent:function(){}};
let source = fs.readFileSync('assets/js/intro.js','utf8');
source = source.replace('  function boot() {','  window.TestSequence = IntroSequence;\n  function boot() {');
vm.runInNewContext(source,context);
const sequence = new window.TestSequence(root);
sequence.main = main;
assert.equal(sequence.DURATION,3300);
sequence.resize();
sequence.positionIdentity(sequence.DURATION);
assert.equal(sequence.logoTarget.top,132);
// Fonts finishing loading may change vertical layout after the first measurement.
rect.top=164; rect.width=740; rect.height=191;
sequence.positionIdentity(sequence.DURATION);
assert.equal(sequence.logoTarget.top,164);
assert.equal(sequence.logoTarget.width,740);
assert(identity.style.transform.includes('scale(1.3523)'));
// Final alignment must use the layout AFTER scroll is unlocked.
document.body.classList.add('is-intro-locked');
const remove = document.body.classList.remove;
document.body.classList.remove = value => {remove(value); if(value==='is-intro-locked') rect.left=332;};
main.inert=true;
sequence.dismiss(false);
assert.equal(sequence.logoTarget.left,332);
assert.equal(main.inert,false);
assert(document.documentElement.classList.contains('hero-in'));
assert(root.classList.contains('is-dismissed'));
assert(heroLogo.classList.contains('is-landed'));
sequence.dismiss(false); // teardown is idempotent
const css=fs.readFileSync('assets/css/orbitech.css','utf8');
assert(css.includes('scrollbar-gutter: stable'));
assert(!/html\.intro-pending[^\n]+translateY/.test(css));
assert(css.includes('transition: opacity 650ms var(--ease-out);'));
console.log('PASS: live logo measurements, late font geometry, alignment after scroll unlock, synchronous hero reveal, stationary content, and repeat-safe teardown.');
