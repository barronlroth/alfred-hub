(() => {
const $ = s => document.querySelector(s);
const PEOPLE = window.PEOPLE, ACTS = window.ACTS, HOST = window.HOST;
const ROUND_SECS = 20;
const ACT_NAMES = {1:"ACT ONE",2:"ACT TWO",3:"ACT THREE"};

// ---------- AUDIO ----------
let AC = null;
function ac(){ if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume(); return AC; }
function tone(freq, dur, type="sine", vol=.25, when=0, slideTo=null){
  const a=ac(), o=a.createOscillator(), g=a.createGain(), t=a.currentTime+when;
  o.type=type; o.frequency.setValueAtTime(freq,t); if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.02);
}
function noise(dur, vol=.3, when=0, filt=1200, q=.7){
  const a=ac(), n=a.sampleRate*dur, b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
  const s=a.createBufferSource(), f=a.createBiquadFilter(), g=a.createGain(), t=a.currentTime+when;
  s.buffer=b; f.type="bandpass"; f.frequency.value=filt; f.Q.value=q;
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f).connect(g).connect(a.destination); s.start(t);
}
const SFX = {
  ding(){ [880,1108,1318,1760].forEach((f,i)=>tone(f,.5,"triangle",.22,i*.08)); },
  buzzer(){ tone(110,.9,"sawtooth",.35); tone(116,.9,"square",.18); },
  airhorn(){ for(let k=0;k<3;k++){ const w=k*.32, d=k===2?.9:.25; [440,554,659].forEach(f=>{tone(f,d,"sawtooth",.12,w,f*.97);}); } },
  whoosh(){ noise(.5,.4,0,600,.5); },
  drumroll(sec=1.6){ for(let t=0;t<sec;t+=.045) noise(.06,.18+t/sec*.25,t,350,1.2); noise(.6,.6,sec,180,.6); tone(80,.5,"sine",.5,sec); },
  tick(){ tone(1600,.03,"square",.05); },
  applause(sec=2.5){ for(let t=0;t<sec;t+=.02) noise(.05,Math.random()*.12*(1-t/sec)+.02,t,2500+Math.random()*2500,1.5); },
  sad(){ [392,370,349,330].forEach((f,i)=>tone(f,i===3?1:.38,"triangle",.25,i*.4,i===3?300:null)); },
  fanfare(){ [523,659,784,1046,784,1046].forEach((f,i)=>tone(f,.28,"square",.12,i*.14)); },
};

let curClip = null;
function stopClip(){ if(curClip){ curClip.onended=null; curClip.pause(); curClip=null; } document.body.classList.add("silent"); }
function playClip(key){
  stopClip();
  return new Promise(res=>{
    const a = new Audio(`audio/${key}.mp3`);
    curClip = a; document.body.classList.remove("silent");
    let done=false; const fin=()=>{ if(done) return; done=true; if(curClip===a){curClip=null;} document.body.classList.add("silent"); res(); };
    a.onended = fin; a.onerror = ()=>setTimeout(fin, 1500);
    a._fin = fin;
    a.play().catch(()=>setTimeout(fin,1500));
  });
}
function skipClip(){ if(curClip){ const f=curClip._fin; curClip.pause(); f&&f(); } }
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const RIGHTS = Object.keys(HOST).filter(k=>k.startsWith("right"));
const WRONGS = Object.keys(HOST).filter(k=>k.startsWith("wrong"));
let lastR=null,lastW=null;
const pickFresh=(arr,last)=>{ let k; do{ k=pick(arr);}while(arr.length>1&&k===last); return k; };

// ---------- STATE ----------
const S = { phase:"title", steps:[], i:-1, score:0, streak:0, best:0, results:[], round:0, total:0, cur:null, t0:0, pts:1000, busy:false, mode:"full" };

function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function buildSteps(mode){
  const steps=[{type:"host",key:"intro"},{type:"host",key:"rules"}];
  let n=0;
  for(const act of [1,2,3]){
    let ps=shuffle(PEOPLE.filter(p=>p.act===act));
    if(mode==="quick") ps=ps.slice(0,5);
    steps.push({type:"act",act});
    ps.forEach(p=>steps.push({type:"round",p,act,n:++n}));
  }
  steps.push({type:"end"});
  S.total=n; return steps;
}

function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active", s.id===id)); }
function hud(){
  $("#hud-round").textContent = `${S.round}/${S.total}`;
  $("#hud-score").textContent = S.score.toLocaleString();
  $("#hud-streak").textContent = S.streak; $("#hud-streak").classList.toggle("fire", S.streak>=3);
}
function mood(m){ document.body.classList.remove("hype","doom"); if(m) document.body.classList.add(m); }

// preload
const imgCache = {};
function preload(p){ if(imgCache[p.id]) return imgCache[p.id];
  const face=new Image(); face.src=`face/${p.id}.jpg`; const full=new Image(); full.src=`img/${p.id}.jpg`;
  const au=new Audio(); au.preload="auto"; au.src=`audio/reveal-${p.id}.mp3`;
  return imgCache[p.id]={face,full}; }

async function start(mode){
  ac(); SFX.fanfare();
  Object.assign(S,{mode,score:0,streak:0,best:0,results:[],round:0,i:-1});
  S.steps = buildSteps(mode);
  S.steps.filter(s=>s.type==="round").slice(0,4).forEach(s=>preload(s.p));
  $("#hud").classList.remove("hidden"); hud();
  next();
}

async function next(){
  if(S.busy) return;
  S.i++; const st=S.steps[S.i]; if(!st) return;
  const ahead=S.steps.slice(S.i+1,S.i+4).filter(s=>s.type==="round"); ahead.forEach(s=>preload(s.p));
  if(st.type==="host") return hostStep(st);
  if(st.type==="act") return actStep(st);
  if(st.type==="round") return roundStep(st);
  if(st.type==="end") return endStep();
}

async function hostStep(st){
  S.phase="host"; mood(null); show("scr-host");
  $("#host-line").textContent = HOST[st.key].toUpperCase();
  sync();
  S.busy=true; await playClip(st.key); S.busy=false;
  await sleep(400); if(S.steps[S.i]===st) next();
}
async function actStep(st){
  S.phase="act"; const A=ACTS[st.act]; mood(st.act===3?"doom":null);
  $("#act-title").textContent=A.title; $("#act-title").style.color=A.color; $("#act-sub").textContent=A.sub;
  $("#hud-act").textContent=`${A.title} · ${A.sub}`; $("#hud-act").style.color=A.color;
  show("scr-act"); const el=$("#scr-act"); el.style.display="none"; el.offsetHeight; el.style.display="";
  SFX.whoosh(); SFX.drumroll(1.2);
  sync();
  S.busy=true; await sleep(1400); await playClip("act"+st.act); S.busy=false;
  await sleep(300); if(S.steps[S.i]===st) next();
}

// pixelated reveal
let raf=null;
function drawPix(img, res){
  const c=$("#pix"), x=c.getContext("2d");
  const t=document.createElement("canvas"); t.width=t.height=res;
  const tx=t.getContext("2d"); tx.drawImage(img,0,0,res,res);
  x.imageSmoothingEnabled=false; x.clearRect(0,0,720,720); x.drawImage(t,0,0,720,720);
}
function roundStep(st){
  S.phase="guess"; S.cur=st; S.round=st.n; mood(st.act===3?"doom":null); hud();
  const {face,full}=preload(st.p);
  const fr=$("#frame"); fr.classList.remove("revealed","shake");
  $("#full").src=full.src; $("#stamp").className="stamp";
  $("#reveal-name").textContent=""; $("#reveal-tag").textContent=""; $("#gain").textContent=""; $("#gain").className="gain";
  $("#pts").textContent="1000"; $("#timer-bar").style.transform="scaleX(1)";
  show("scr-round"); SFX.whoosh();
  S.t0=performance.now(); S.pts=1000; let lastTick=-1;
  const go=()=>{
    if(S.phase!=="guess") return;
    const el=(performance.now()-S.t0)/1000, f=Math.min(1,el/ROUND_SECS);
    const res=Math.round(5*Math.pow(160/5,f*f*.9+f*.1));
    if(face.complete&&face.naturalWidth) drawPix(face, f>=1?720:res);
    S.pts=Math.max(100, Math.round((1000-900*f)/10)*10);
    $("#pts").textContent=S.pts; $("#timer-bar").style.transform=`scaleX(${1-f})`;
    const sec=Math.floor(el); if(sec!==lastTick && f<1){ lastTick=sec; SFX.tick(); if(sec%5===0) syncLite(); }
    raf=requestAnimationFrame(go);
  };
  cancelAnimationFrame(raf); go(); sync();
}
function revealName(p){
  $("#frame").classList.add("revealed");
  const n=$("#reveal-name"); n.textContent=p.name.toUpperCase(); n.classList.remove("pop"); n.offsetWidth; n.classList.add("pop");
  $("#reveal-tag").textContent=`“${p.tag}”`;
}
async function judge(kind){
  if(S.phase!=="guess") return;
  S.phase="judged"; cancelAnimationFrame(raf);
  const st=S.cur, p=st.p, stamp=$("#stamp");
  let gained=0;
  if(kind==="right"){
    S.streak++; S.best=Math.max(S.best,S.streak);
    const bonus=S.streak>=3?Math.min(250,(S.streak-2)*50):0;
    gained=S.pts+bonus; S.score+=gained;
    S.results.push({id:p.id,ok:true});
    stamp.textContent="CORRECT!"; stamp.className="stamp right on";
    flash("g"); SFX.ding(); SFX.applause(2.5); mood("hype");
    confetti({particleCount:220,spread:110,origin:{y:.6},colors:["#ffd400","#ff2d95","#00e5ff","#39ff14"]});
    setTimeout(()=>confetti({particleCount:120,angle:60,spread:70,origin:{x:0,y:.7}}),250);
    setTimeout(()=>confetti({particleCount:120,angle:120,spread:70,origin:{x:1,y:.7}}),400);
    $("#gain").textContent=`+${gained}${bonus?` (🔥+${bonus})`:""}`; $("#gain").className="gain plus";
  } else {
    S.streak=0; S.results.push({id:p.id,ok:false});
    stamp.textContent= kind==="pass"?"PASS?!":"WRONG!"; stamp.className=`stamp ${kind==="pass"?"pass":"wrong"} on`;
    $("#frame").classList.add("shake"); flash("r"); SFX.buzzer(); mood("doom");
    if(kind==="wrong"){ const x=$("#xslam"); x.classList.remove("on"); x.offsetWidth; x.classList.add("on"); }
    $("#gain").textContent="+0"; $("#gain").className="gain zero";
  }
  hud(); sync();
  S.busy=true;
  const reaction = kind==="right" ? (lastR=pickFresh(RIGHTS,lastR)) : kind==="pass" ? "pass" : (lastW=pickFresh(WRONGS,lastW));
  await playClip(reaction);
  if(S.phase!=="judged"||S.cur!==st){S.busy=false;return;}
  setTimeout(()=>stamp.classList.add("fade"),100);
  SFX.drumroll(1.1); await sleep(1300);
  if(S.cur!==st){S.busy=false;return;}
  const fr=$("#frame"); drawPix(imgCache[p.id].face,720);
  revealName(p); SFX.fanfare(); if(kind!=="right") SFX.sad();
  S.phase="revealed"; sync();
  await playClip("reveal-"+p.id);
  S.busy=false; sync();
}
function flash(c){ const f=$("#flash"); f.className=""; f.offsetWidth; f.className=c; }

function endStep(){
  S.phase="end"; mood("hype"); $("#hud").classList.add("hidden"); show("scr-end");
  const ok=S.results.filter(r=>r.ok).length, pct=ok/Math.max(1,S.results.length);
  $("#end-score").textContent=S.score.toLocaleString();
  const key = pct>=.75?"end_great":pct>=.45?"end_mid":"end_bad";
  $("#end-grade").textContent = pct>=.9?"CERTIFIED WHITE GUY SAVANT":pct>=.75?"QUEEN OF BEIGE MEN":pct>=.45?"MID. EXTREMELY MID.":pct>=.25?"FACE BLIND (CLINICAL)":"SHE THINKS THEY'RE ALL CHRIS";
  const chris=S.results.filter(r=>r.id.startsWith("chris-")||r.id.endsWith("hemsworth"));
  const chrisOk=chris.filter(r=>r.ok).length;
  $("#end-stats").textContent=`${ok}/${S.results.length} identified · best streak ${S.best} · Chris accuracy ${chris.length?Math.round(chrisOk/chris.length*100):0}%`;
  $("#end-wall").innerHTML=S.results.map(r=>`<img src="face/${r.id}.jpg" class="${r.ok?"":"miss"}">`).join("");
  SFX.fanfare(); SFX.applause(4);
  if(pct>=.75){ let k=0; const iv=setInterval(()=>{confetti({particleCount:80,spread:160,origin:{x:Math.random(),y:Math.random()*.4}}); if(++k>12) clearInterval(iv);},300); }
  sync(); playClip(key);
}

// ---------- CONTROLS ----------
function cmd(c, arg){
  ac();
  switch(c){
    case "start": if(S.phase==="title"||S.phase==="end") start(arg||"full"); break;
    case "next":
      if(S.phase==="title") return start("full");
      if(S.phase==="end") return;
      if(S.phase==="guess") return; // must judge first
      if(S.phase==="revealed"){ stopClip(); S.busy=false; next(); return; }
      if(S.busy){ skipClip(); return; }
      break;
    case "correct": judge("right"); break;
    case "wrong": judge("wrong"); break;
    case "pass": judge("pass"); break;
    case "airhorn": SFX.airhorn(); break;
    case "roast": if(!curClip) playClip(pickFresh(WRONGS,lastW)); break;
    case "applause": SFX.applause(3); break;
    case "again": S.phase="title"; $("#hud").classList.add("hidden"); show("scr-title"); mood(null); sync(); break;
  }
}
document.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  if(k===" "||k==="enter"||k==="arrowright"){ e.preventDefault(); cmd("next"); }
  else if(k==="c"||k==="y") cmd("correct");
  else if(k==="x"||k==="n") cmd("wrong");
  else if(k==="p") cmd("pass");
  else if(k==="a") cmd("airhorn");
  else if(k==="r") cmd("roast");
  else if(k==="q") cmd("start","quick");
});
$("#btn-start").onclick=()=>cmd("start","full");
$("#btn-quick").onclick=()=>cmd("start","quick");
$("#btn-again").onclick=()=>cmd("again");

// ---------- REMOTE (PeerJS) ----------
const ALPH="ABCDEFGHJKLMNPQRSTUVWXYZ";
let code=sessionStorage.getItem("wtfitg-code");
if(!code){ code=Array.from({length:4},()=>ALPH[Math.floor(Math.random()*ALPH.length)]).join(""); sessionStorage.setItem("wtfitg-code",code); }
$("#room-code").textContent=code;
const remoteURL=new URL("remote?room="+code, location.href).href;
try{ const q=qrcode(0,"M"); q.addData(remoteURL); q.make(); $("#qr").innerHTML=q.createSvgTag({cellSize:6,margin:0,scalable:true}); }catch(e){}
const conns=new Set();
function stateMsg(){
  const st=S.cur, p=st&&st.p;
  return {type:"state",phase:S.phase,round:S.round,total:S.total,score:S.score,streak:S.streak,busy:S.busy,
    name:p?p.name:null,tag:p?p.tag:null,img:p?`face/${p.id}.jpg`:null,pts:S.pts,
    upcoming:(()=>{const s=S.steps.slice(S.i+1).find(x=>x.type==="round");return s?s.p.name:null;})()};
}
function sync(){ const m=stateMsg(); conns.forEach(c=>{ try{c.send(m);}catch(e){} }); }
function syncLite(){ conns.forEach(c=>{ try{c.send({type:"pts",pts:S.pts});}catch(e){} }); }
let peer;
function connectPeer(){
  peer=new Peer("wtfitg-"+code,{debug:0});
  peer.on("open",()=>{ $("#peer-status").textContent="remote ready · "+remoteURL.replace(/^https?:\/\//,""); });
  peer.on("connection",c=>{
    c.on("open",()=>{ conns.add(c); $("#peer-status").textContent="📱 REMOTE CONNECTED"; $("#peer-status").classList.add("ok"); c.send(stateMsg()); });
    c.on("data",d=>{ if(d&&d.cmd) cmd(d.cmd,d.arg); if(d&&d.cmd==="hello") c.send(stateMsg()); });
    c.on("close",()=>{ conns.delete(c); if(!conns.size){ $("#peer-status").textContent="remote disconnected, rescan"; $("#peer-status").classList.remove("ok"); } });
  });
  peer.on("disconnected",()=>{ try{peer.reconnect();}catch(e){} });
  peer.on("error",e=>{
    if(e.type==="unavailable-id"){ code=Array.from({length:4},()=>ALPH[Math.floor(Math.random()*ALPH.length)]).join(""); sessionStorage.setItem("wtfitg-code",code); location.reload(); }
    else $("#peer-status").textContent="remote error: "+e.type+" (keyboard still works)";
  });
}
if(window.Peer) connectPeer(); else $("#peer-status").textContent="remote unavailable · use keyboard";
window.__S=S; window.__cmd=cmd;
})();
