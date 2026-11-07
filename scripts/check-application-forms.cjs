const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.strictEqual(new Set(ids).size, ids.length, 'IDs must be unique');
for (const id of [...html.matchAll(/\b(?:for|aria-describedby)="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/))) {
  assert(ids.includes(id), `Missing referenced ID: ${id}`);
}
assert.match(html, /id="application-form" data-team="Data services"/);
assert.match(html, /id="software-application-form" data-team="Software"/);
assert.match(html, /id="app-languages" name="languages"\s+required/);
assert.doesNotMatch(html, /id="software-app-languages" name="languages"\s+required/);
assert.match(html, /id="software-application-panel" hidden/);
const app = fs.readFileSync('assets/js/app.js', 'utf8');
const selectorCode = app.slice(app.indexOf('    var teamChoices ='), app.indexOf("    document.querySelectorAll('#application-form, #software-application-form')"));
assert(selectorCode.includes('choice.addEventListener'), 'Team selector must be initialized');
const panels = { 'data-application-panel': { hidden: false }, 'software-application-panel': { hidden: true } };
const choices = ['data', 'software'].map(value => ({ value, checked: value === 'data', addEventListener(event, handler) { this.change = handler; } }));
vm.runInNewContext(selectorCode, { document: { querySelectorAll: () => choices, getElementById: id => panels[id] } });
choices[0].checked = false;
choices[1].checked = true;
choices[1].change();
assert.strictEqual(panels['data-application-panel'].hidden, true);
assert.strictEqual(panels['software-application-panel'].hidden, false);
choices[1].checked = false;
choices[0].checked = true;
choices[0].change();
assert.strictEqual(panels['data-application-panel'].hidden, false);
assert.strictEqual(panels['software-application-panel'].hidden, true);

const context = { console };
vm.createContext(context);
vm.runInContext(fs.readFileSync('backend/Code.gs', 'utf8'), context);
context.CONFIG.SEND_NOTIFICATIONS = false;
context.CONFIG.SEND_ACKNOWLEDGEMENT = false;
let saved;
context.appendRow_ = (tab, columns, row) => { saved = { columns, row }; return 2; };
context.jsonResponse = value => value;
const base = { fullName: 'Test', email: 'test@example.com', country: 'Bangladesh', skills: 'Development' };
assert.strictEqual(context.handleApplication({ ...base, team: 'Software' }).ok, true);
assert.strictEqual(saved.row.team, 'Software');
assert.strictEqual(saved.columns[saved.columns.length - 1].key, 'team');
assert.strictEqual(context.handleApplication({ ...base, team: 'Data services' }).ok, false);
assert.strictEqual(context.handleApplication({ ...base, team: 'Data services', languages: 'English' }).ok, true);
context.logError_ = () => {};
context.saveUpload_ = () => { throw new Error('Drive unavailable'); };
saved = null;
assert.strictEqual(context.handleApplication({ ...base, team: 'Software', file: { data: 'dGVzdA==' } }).ok, false);
assert.strictEqual(saved, null, 'An upload failure must not be accepted');
const postStart = app.indexOf('  function postJSON(');
const postEnd = app.indexOf('\n  function setStatus(', postStart);
const postContext = { fetch: () => Promise.resolve({ ok: true, text: () => Promise.resolve('{"ok":false}') }) };
vm.runInNewContext(app.slice(postStart, postEnd), postContext);
postContext.postJSON('https://example.com', {}).then(
  () => { throw new Error('Rejected backend response was accepted'); },
  () => console.log('PASS: rejected backend response is reported as an error.')
).catch(err => { console.error(err); process.exitCode = 1; });
console.log('PASS: team switching, distinct form IDs and team-specific backend validation.');
