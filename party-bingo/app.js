'use strict';
const PREFIX='sf-party-bingo-2026-v1:';
const $=id=>document.getElementById(id);
let player=null, marks=new Set([12]), saveOK=true;
const memory={};
function read(key){try{return localStorage.getItem(PREFIX+key)}catch(e){saveOK=false;return null}}
function write(key,value){try{localStorage.setItem(PREFIX+key,value);return true}catch(e){return false}}
const lines=[];
for(let r=0;r<5;r++)lines.push(Array.from({length:5},(_,c)=>r*5+c));
for(let c=0;c<5;c++)lines.push(Array.from({length:5},(_,r)=>r*5+c));
lines.push([0,6,12,18,24],[4,8,12,16,20]);
function persist(){memory[player]=[...marks];saveOK=write(player,JSON.stringify([...marks]));}
function load(name){player=name;let arr=memory[name];if(!arr){try{arr=JSON.parse(read(name)||'[]')}catch(e){arr=[]}}
marks=new Set(Array.isArray(arr)?arr.filter(n=>Number.isInteger(n)&&n>=0&&n<25):[]);marks.add(12);persist();write('selected',name);$('picker').hidden=true;$('game').hidden=false;$('player').textContent=name+'’s card';
$('board').replaceChildren(...CARDS[name].map((text,i)=>{const b=document.createElement('button');b.type='button';b.className='square'+(i===12?' free':'');b.textContent=text;b.dataset.index=i;b.setAttribute('aria-label',text);if(i===12)b.setAttribute('aria-disabled','true');b.onclick=()=>{if(i===12)return;marks.has(i)?marks.delete(i):marks.add(i);persist();paint();};return b;}));paint();}
function paint(){const wins=lines.filter(line=>line.every(i=>marks.has(i)));const winCells=new Set(wins.flat());document.querySelectorAll('.square').forEach((b,i)=>{b.setAttribute('aria-pressed',String(marks.has(i)));b.classList.toggle('winner',winCells.has(i));});$('count').textContent=(marks.size-1)+' / 24 spotted';$('save').textContent=saveOK?'Saved on this phone':'Not saved: browser storage blocked';$('win').hidden=!wins.length;$('win').textContent=wins.length===1?'BINGO. Go claim the glory.':'BINGO × '+wins.length+'. Overachiever.';}
Object.keys(CARDS).forEach(name=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>load(name);$('names').append(b);});
$('switch').onclick=()=>{$('game').hidden=true;$('picker').hidden=false;$('names').querySelector('button').focus();};
$('reset').onclick=()=>{$('confirm').returnValue='';$('confirm').showModal();};
$('confirm').onclose=()=>{if($('confirm').returnValue==='reset'){marks=new Set([12]);persist();paint();}};
window.addEventListener('storage',e=>{if(e.key===null){Object.keys(memory).forEach(k=>delete memory[k]);}else if(e.key.startsWith(PREFIX)){delete memory[e.key.slice(PREFIX.length)];}if(player&&(e.key===null||e.key===PREFIX+player)){try{const arr=JSON.parse(e.newValue||'[]');marks=new Set(Array.isArray(arr)?arr.filter(n=>Number.isInteger(n)&&n>=0&&n<25):[]);marks.add(12);memory[player]=[...marks];paint();}catch(err){}}});
const selected=read('selected');if(Object.hasOwn(CARDS,selected))load(selected);
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(()=>navigator.serviceWorker.ready).then(()=>{$('offline').textContent='Ready for offline play.';}).catch(()=>{$('offline').textContent='Keep this tab open if you lose reception.';});}else{$('offline').textContent='Keep this tab open if you lose reception.';}
