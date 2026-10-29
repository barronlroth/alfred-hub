/* Reinoso + Delboy — dependency-free, responsive family storybook. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const ui = {
    en: {skip:'Skip to story',chapters:'Chapters',illustration:'Historical illustration',begin:'Open the storybook',related:"How we’re related",sources:'Sources & context',share:'Share',previous:'Previous chapter',next:'Next chapter',close:'Close',language:'Language',book:'The storybook',context:'Historical context',album:'The family album',story:'Story',of:'of',home:'Opening',sourceHeading:'Follow the evidence',contextHeading:'A little more context',certainty:'What we know — and what we don’t',relationHeading:'The family thread',relationIntro:'Read from Alicia Reinoso Delboy toward the people in this story. This is a condensed family connection, not a complete genealogical chart.',noRelation:'This chapter supplies historical context, not a claim of family participation in every event.',method:'About this storybook',creditHeading:'A setting, not a portrait',creditText:'The historical scenes in this storybook are AI-generated illustrations. They evoke places and periods; they are not archival photographs, exact reconstructions, or verified likenesses of named family members.',creditArt:'Art direction: illustrated historical settings, generated with OpenAI. Family photographs, when present, are labeled separately and retain their own source credits.',archive:'Archive photograph',archiveTitle:'Preserved family photograph',archiveEmpty:'This edition has no archival photographs attached yet. The scene above is an illustration, not a family photograph.',archiveHint:'Tap a photograph to look closer. Swipe the album to see more.',viewPhoto:'Enlarge photograph',archiveSource:'View family source',copied:'Link copied — ready to share',shareHeading:'Share this chapter',shareText:'Copy this link to return to this exact chapter and language.',shareCancel:'Sharing cancelled',loadError:'The storybook could not be loaded. Please reload the page.',retry:'Reload',sourceNote:'Some family records require an Ancestry or FamilySearch account. A historical biography documents a life, not every link to our family.',progress:'Story chapters',restart:'Return to the opening',missingImage:'Illustration unavailable',chapterLabel:'Chapter'},
    es: {skip:'Ir a la historia',chapters:'Capítulos',illustration:'Ilustración histórica',begin:'Abrir el libro familiar',related:'Nuestro parentesco',sources:'Fuentes y contexto',share:'Compartir',previous:'Capítulo anterior',next:'Capítulo siguiente',close:'Cerrar',language:'Idioma',book:'El libro familiar',context:'Contexto histórico',album:'El álbum familiar',story:'Historia',of:'de',home:'Inicio',sourceHeading:'Seguir la evidencia',contextHeading:'Un poco más de contexto',certainty:'Lo que sabemos y lo que no',relationHeading:'El hilo familiar',relationIntro:'Lee desde Alicia Reinoso Delboy hacia las personas de esta historia. Es un parentesco resumido, no un árbol genealógico completo.',noRelation:'Este capítulo aporta contexto histórico; no afirma que la familia participara en cada hecho.',method:'Sobre este libro familiar',creditHeading:'Un ambiente, no un retrato',creditText:'Las escenas históricas de este libro son ilustraciones generadas con IA. Evocan lugares y épocas: no son fotografías de archivo, reconstrucciones exactas ni rostros verificados de familiares identificados.',creditArt:'Dirección artística: ambientes históricos ilustrados, generados con OpenAI. Las fotografías familiares, cuando se incluyen, llevan una etiqueta distinta y conservan sus propias fuentes.',archive:'Fotografía de archivo',archiveTitle:'Fotografía familiar conservada',archiveEmpty:'Esta edición todavía no incluye fotografías de archivo. La escena de arriba es una ilustración, no una fotografía familiar.',archiveHint:'Toca una fotografía para ampliarla. Desliza el álbum para ver más.',viewPhoto:'Ampliar fotografía',archiveSource:'Ver la fuente familiar',copied:'Enlace copiado: listo para compartir',shareHeading:'Compartir este capítulo',shareText:'Copia este enlace para volver al mismo capítulo e idioma.',shareCancel:'Se canceló el envío',loadError:'No se pudo cargar el libro familiar. Vuelve a cargar la página.',retry:'Volver a cargar',sourceNote:'Algunos documentos requieren una cuenta de Ancestry o FamilySearch. Una biografía histórica documenta una vida, no cada vínculo con nuestra familia.',progress:'Capítulos de la historia',restart:'Volver al inicio',missingImage:'Ilustración no disponible',chapterLabel:'Capítulo'}
  };
  const alt = {
    cover:{en:'Illustrated Arequipa cathedral and Misti beneath a luminous dusk sky',es:'Ilustración de la catedral de Arequipa y el Misti bajo el cielo del atardecer'},
    voyage:{en:'Historical illustration of a sailing warship at sea, evoking the Amazonas voyage',es:'Ilustración histórica de una nave de guerra a vela en el mar que evoca el viaje de la Amazonas'},
    court:{en:'Illustrated courtyard and colonial architecture in the Andes',es:'Ilustración de un patio y arquitectura colonial en los Andes'},
    poet:{en:'Illustrated literary setting in colonial Lima, not a portrait of Juan Dávalos',es:'Ambiente literario ilustrado en la Lima colonial, no un retrato de Juan Dávalos'},
    bishop:{en:'Illustrated eighteenth-century ecclesiastical setting, not an ancestor’s portrait',es:'Ambiente eclesiástico ilustrado del siglo XVIII, no un retrato de un antepasado'},
    independence:{en:'Illustrated Andean landscape evoking the independence era',es:'Paisaje andino ilustrado que evoca la época de la independencia'},
    'new-york':{en:'Illustrated New York harbor in the early twentieth century',es:'Ilustración del puerto de Nueva York a principios del siglo XX'},
    'family-threads':{en:'Illustrated interweaving family threads, a visual metaphor rather than a genealogical document',es:'Ilustración de hilos familiares entrelazados: una metáfora visual, no un documento genealógico'},
    switzerland:{en:'Illustrated Swiss lakeside setting, not a reconstruction of Arturo’s school or an identified town',es:'Ambiente suizo ilustrado, no una reconstrucción de la escuela de Arturo ni una ciudad identificada'},
    bordeaux:{en:'Illustration evoking the French connection of the Delboy family',es:'Ilustración que evoca la conexión francesa de la familia Delboy'},
    'lima-1903':{en:'Illustrated Lima streets around 1903, not an archival photograph',es:'Ilustración de las calles de Lima hacia 1903, no una fotografía de archivo'}
  };
  const periods = {en:{},es:{'1540s–1900s':'Décadas de 1540–1900','1690 / by 1839':'1690 / ya en 1839','1540s–1560s':'Décadas de 1540–1560','Around 1600':'Hacia 1600','18th century':'Siglo XVIII'}};
  const relations = {
    'Reinoso / Moscoso ancestors':{en:'Reinoso / Moscoso ancestors',es:'Antepasados Reinoso / Moscoso'},'Moscoso ancestors':{en:'Moscoso ancestors',es:'Antepasados Moscoso'},
    'Their son / Su hijo: Juan Manuel':{en:'Their son: Juan Manuel',es:'Su hijo: Juan Manuel'},
    'Gaspar José, brother of Manuel / hermano de Manuel':{en:'Gaspar José, brother of Manuel',es:'Gaspar José, hermano de Manuel'},
    'His brother / Su hermano: Ulises Delboy':{en:'His brother: Ulises Delboy',es:'Su hermano: Ulises Delboy'},
    'His father / Su padre: José Miguel Reinoso':{en:'His father: José Miguel Reinoso',es:'Su padre: José Miguel Reinoso'},
    'His parents / Sus padres: José Matías + Isabel':{en:'His parents: José Matías + Isabel',es:'Sus padres: José Matías + Isabel'},
    'Her mother / Su madre: Alicia Delboy':{en:'Her mother: Alicia Delboy',es:'Su madre: Alicia Delboy'},
    'Her grandfather / Su abuelo: Mariano Emilio Delboy':{en:'Her grandfather: Mariano Emilio Delboy',es:'Su abuelo: Mariano Emilio Delboy'},
    'A later Alicia / Otra Alicia':{en:'A later Alicia',es:'Otra Alicia'}
  };
  let data, index=0, lang='en', photos=[], modalType=null, restoreFocus=null, statusTimer;
  const t=(key)=>ui[lang][key] || key;
  const local=(v)=>typeof v==='string'?v:(v?.[lang] ?? v?.en ?? v?.es ?? '');
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const safeLink=(s)=>{try {const u=new URL(s);return u.protocol==='https:'?u.href:null;}catch{return null;}};
  function externalLink(text,url){const a=node('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function stateFromURL(){const u=new URL(location.href);lang=u.searchParams.get('lang')==='es'?'es':'en';let id;try{id=decodeURIComponent(u.hash.slice(1));}catch{id='home';}const n=data.slides.findIndex(s=>s.id===id);index=n<0?0:n;}
  function href(i=index,l=lang){const u=new URL(location.href);u.searchParams.set('lang',l);u.hash=data.slides[i].id;return u.pathname+u.search+u.hash;}
  function navigate(i,{language=lang,replace=false,focus=false}={}){
    i=Math.max(0,Math.min(data.slides.length-1,i));const changed=i!==index;
    const wasLang=lang;index=i;lang=language;
    const url=href();if(location.pathname+location.search+location.hash!==url)history[replace?'replaceState':'pushState']({},'',url);
    render();if(changed){window.scrollTo({top:0,behavior:'instant'});if(focus)$('#story-title').focus({preventScroll:true});}else if(wasLang!==lang){/* preserve reading position as well as chapter */}
  }
  function render(){
    const s=data.slides[index];document.documentElement.lang=lang;document.title=local(s.title)+' | Reinoso + Delboy';
    document.querySelector('meta[name=description]').content=local(data.description);
    document.querySelectorAll('[data-ui]').forEach(e=>e.textContent=t(e.dataset.ui));
    document.querySelectorAll('[data-lang]').forEach(e=>{e.setAttribute('aria-pressed',String(e.dataset.lang===lang));e.setAttribute('aria-label',e.dataset.lang==='en'?'English':'Español');});
    $('.languages').setAttribute('aria-label',t('language'));$('.wordmark').href=href(0);$('.wordmark').setAttribute('aria-label','Reinoso + Delboy — '+t('home'));
    $('#progress').setAttribute('aria-label',t('progress'));$('#previous').setAttribute('aria-label',t('previous'));$('#next').setAttribute('aria-label',index===data.slides.length-1?t('restart'):t('next'));$('#dialog-close').setAttribute('aria-label',t('close'));
    const spread=$('.spread');spread.dataset.kind=s.kind;spread.dataset.slide=s.id;spread.classList.remove('changed');void spread.offsetWidth;spread.classList.add('changed');
    $('#chapter-label').textContent=s.number?`${t('story')} ${String(s.number).padStart(2,'0')} / 10`:local(s.branch);
    let period=local(s.period);if(period.includes(' / ')){const parts=period.split(' / ');if(s.id==='connections'||s.id==='alicia'||s.id==='album')period=parts[lang==='es'?1:0];}$('#period').textContent=periods[lang][period]||period;
    const h=$('#story-title');h.replaceChildren();if(s.kind==='cover'){
      ['Reinoso.',...(lang==='en'?['A family,','many worlds.']:['Una familia,','muchos mundos.'])].forEach((line,i)=>{if(i)h.append(document.createElement('br'));h.append(document.createTextNode(line));});
    }else h.textContent=local(s.title);
    $('#story-body').textContent=local(s.body);
    const img=$('#scene-image');const asset=s.image.split('/').pop().replace('.webp','');img.alt=local(alt[asset]||{en:'Historical illustration',es:'Ilustración histórica'});if(img.getAttribute('src')!==s.image)img.src=s.image;
    $('#story-extra').replaceChildren();$('#visual-extra').replaceChildren();$('#story-actions').hidden=s.kind!=='cover';
    if(s.stat){const stat=node('div','stat');stat.append(node('span','stat-value',s.stat.value),node('span','stat-label',local(s.stat.label)));$('#story-extra').append(stat);}
    if(s.events){const box=node('section','timeline');box.setAttribute('aria-label',t('context'));const ol=node('ol');s.events.forEach(ev=>{const li=node('li');li.append(node('time','',ev.year),node('p','',local(ev.label)));ol.append(li);});box.append(ol);$('#visual-extra').append(box);}
    if(s.kind==='archive')renderAlbum();
    const insetPhoto=s.archiveIds?.map(id=>photos.find(p=>p.id===id)).find(Boolean);
    spread.dataset.hasArchive=String(Boolean(insetPhoto));
    if(insetPhoto){const fig=node('figure','archive-inset');const button=node('button');button.type='button';button.setAttribute('aria-label',t('viewPhoto')+': '+photoCaption(insetPhoto));button.addEventListener('click',()=>openDialog('photo:'+photos.indexOf(insetPhoto),button));const image=node('img');image.src=insetPhoto.src;image.alt=local(insetPhoto.alt)||photoCaption(insetPhoto);button.append(image);const caption=node('figcaption');caption.append(node('span','archive-badge',t('archive')),node('span','',photoCaption(insetPhoto)),node('small','',local(insetPhoto.credit)||''));fig.append(button,caption);$('#visual-extra').append(fig);}
    $('#related-button').hidden=s.kind==='timeline';$('#related-button').nextElementSibling.hidden=s.kind==='timeline';
    $('#previous').disabled=index===0;$('#progress-label').textContent=s.number?local(s.branch):s.kind==='archive'?t('album'):s.kind==='timeline'?t('context'):t('book');
    $('#page-count').textContent=`${String(index+1).padStart(2,'0')} / ${data.slides.length}`;
    const progress=$('#progress');progress.replaceChildren();data.slides.forEach((slide,i)=>{const a=node('a',i<index?'past':'');a.href=href(i);a.dataset.go=i;a.setAttribute('aria-label',`${i+1}. ${local(slide.title)}`);a.title=local(slide.title);if(i===index)a.setAttribute('aria-current','step');progress.append(a);});
    const next=data.slides[index+1];if(next){const preload=new Image();preload.src=next.image;}
    if(modalType)renderDialog(modalType);
    window.dispatchEvent(new CustomEvent('storybook:change',{detail:{id:s.id,index,lang}}));
  }
  function photoCaption(p){return local(p.caption||p.description||p.title)||t('archiveTitle');}
  function renderAlbum(){
    if(!photos.length){$('#story-extra').append(node('p','archive-empty',t('archiveEmpty')));return;}
    $('#story-extra').append(node('p','archive-instruction',t('archiveHint')));
    const albumControls=node('div','album-controls');
    const albumPrevious=node('button','album-arrow','←'),albumNext=node('button','album-arrow','→');albumPrevious.type=albumNext.type='button';albumPrevious.setAttribute('aria-label',lang==='es'?'Fotografía anterior':'Previous photograph');albumNext.setAttribute('aria-label',lang==='es'?'Fotografía siguiente':'Next photograph');
    const albumCount=node('span','album-count',`1 / ${photos.length}`);albumControls.append(albumPrevious,albumCount,albumNext);$('#story-extra').append(albumControls);
    const gallery=node('section','archive-gallery');gallery.setAttribute('aria-label',t('album'));let albumIndex=0;
    const moveAlbum=delta=>{albumIndex=Math.max(0,Math.min(photos.length-1,albumIndex+delta));gallery.scrollTo({left:albumIndex*gallery.clientWidth,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});};albumPrevious.addEventListener('click',()=>moveAlbum(-1));albumNext.addEventListener('click',()=>moveAlbum(1));gallery.addEventListener('scroll',()=>{albumIndex=Math.round(gallery.scrollLeft/gallery.clientWidth);albumCount.textContent=`${albumIndex+1} / ${photos.length}`;albumPrevious.disabled=albumIndex===0;albumNext.disabled=albumIndex===photos.length-1;},{passive:true});albumPrevious.disabled=true;
    photos.forEach((p,i)=>{const fig=node('figure','archive-item');const button=node('button');button.type='button';button.setAttribute('aria-label',t('viewPhoto')+': '+photoCaption(p));button.addEventListener('click',()=>openDialog('photo:'+i,button));const img=node('img');img.src=p.src;img.alt=local(p.alt)||photoCaption(p);img.loading='eager';img.decoding='async';button.append(img);const caption=node('figcaption');caption.append(node('span','archive-badge',t('archive')),node('strong','',photoCaption(p)));const credit=local(p.credit||p.provenance||p.attribution);if(credit)caption.append(node('span','',credit+' '));const source=safeLink(p.sourceUrl||p.source_url||p.url);if(source)caption.append(externalLink(t('archiveSource'),source));fig.append(button,caption);gallery.append(fig);});$('#visual-extra').append(gallery);
  }
  function openDialog(type,trigger=document.activeElement){restoreFocus=trigger;modalType=type;renderDialog(type);if(!$('#story-dialog').open)$('#story-dialog').showModal();$('#dialog-close').focus();}
  function renderDialog(type){
    const s=data.slides[index],box=$('#dialog-content');box.replaceChildren();let title;
    if(type==='chapters'){
      title=t('chapters');const ol=node('ol','chapter-list');data.slides.forEach((slide,i)=>{const li=node('li'),a=node('a');a.href=href(i);a.dataset.go=i;a.setAttribute('aria-current',String(i===index));a.append(node('span','chapter-number',slide.number?String(slide.number).padStart(2,'0'):slide.kind==='cover'?'◌':slide.kind==='timeline'?'↔':'▧'),node('span','',local(slide.title)),node('span','','↗'));li.append(a);ol.append(li);});box.append(ol);
    }else if(type==='sources'){
      title=t('sourceHeading');if(s.context)box.append(node('h3','',t('contextHeading')),node('p','',local(s.context)));
      box.append(node('h3','',t('certainty')),node('p','note',local(s.certainty)));
      const list=node('ol','sources');s.sourceIds.forEach(id=>{const source=data.sources[id];if(!source)return;const li=node('li');const url=safeLink(source.url);if(url)li.append(externalLink(local(source.title),url));else li.textContent=local(source.title);if(source.accessNote)li.append(node('p','source-access',local(source.accessNote)));list.append(li);});box.append(list,node('p','note',t('sourceNote')),node('h3','',t('method')),node('p','',local(data.methodology)));
    }else if(type==='related'){
      title=t('relationHeading');box.append(node('p','',s.relation.length?t('relationIntro'):t('noRelation')));if(data.relationNotice)box.append(node('p','note',local(data.relationNotice)));const chain=node('ol','relation-chain');s.relation.forEach(r=>chain.append(node('li','',relations[r]?local(relations[r]):local(r))));box.append(chain,node('h3','',t('certainty')),node('p','note',local(s.certainty)));
    }else if(type==='art'){
      title=t('creditHeading');box.append(node('p','',t('creditText')),node('p','note',t('creditArt')),node('h3','',t('method')),node('p','',local(data.methodology)));
    }else if(type==='share'){
      title=t('shareHeading');const input=node('input','share-url');input.type='text';input.readOnly=true;input.value=location.href;input.setAttribute('aria-label',t('shareHeading'));input.addEventListener('focus',()=>input.select());box.append(node('p','',t('shareText')),input);
    }else if(type.startsWith('photo:')){
      const p=photos[Number(type.split(':')[1])];if(!p)return;title=t('archive');const img=node('img','full-photo');img.src=p.src;img.alt=local(p.alt)||photoCaption(p);box.append(img,node('p','',photoCaption(p)));if(local(p.basis))box.append(node('p','note',local(p.basis)));const credit=local(p.credit||p.provenance||p.attribution);if(credit)box.append(node('p','note',credit));box.append(node('p','note',lang==='es'?'Fotografía compartida por la familia y reutilizada con autorización familiar. No se ha establecido la titularidad de los derechos; no se afirma que sea de dominio público.':'Family-shared photograph reused with family authorization. Copyright ownership has not been established; no public-domain status is claimed.'));const source=safeLink(p.sourceUrl||p.source_url||p.url);if(source)box.append(externalLink(t('archiveSource'),source));
    }
    $('#dialog-title').textContent=title;
  }
  function closeDialog(){if($('#story-dialog').open)$('#story-dialog').close();}
  $('#story-dialog').addEventListener('close',()=>{modalType=null;if(restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true});});
  $('#story-dialog').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...e.currentTarget.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}});
  $('#dialog-close').addEventListener('click',closeDialog);
  $('#story-dialog').addEventListener('click',e=>{if(e.target===$('#story-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  $('#chapters-button').addEventListener('click',()=>openDialog('chapters'));
  $('#sources-button').addEventListener('click',()=>openDialog('sources'));
  $('#related-button').addEventListener('click',()=>openDialog('related'));
  $('#art-credit').addEventListener('click',()=>openDialog('art'));
  $('#begin').addEventListener('click',()=>navigate(1,{focus:true}));
  $('#previous').addEventListener('click',()=>navigate(index-1));
  $('#next').addEventListener('click',()=>navigate(index===data.slides.length-1?0:index+1));
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>navigate(index,{language:b.dataset.lang})));
  document.addEventListener('click',e=>{const a=e.target.closest('a[data-go],a.wordmark');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const i=a.matches('.wordmark')?0:Number(a.dataset.go);closeDialog();navigate(i,{focus:true});});
  window.addEventListener('popstate',()=>{if(!data)return;closeDialog();stateFromURL();render();window.scrollTo({top:0,behavior:'instant'});});
  window.addEventListener('hashchange',()=>{if(!data)return;stateFromURL();render();window.scrollTo({top:0,behavior:'instant'});});
  document.addEventListener('keydown',e=>{if(!data||$('#story-dialog').open||e.altKey||e.ctrlKey||e.metaKey||e.target.matches('input,textarea,select,[contenteditable=true]'))return;let n;if(['ArrowRight','PageDown'].includes(e.key))n=index+1;if(['ArrowLeft','PageUp'].includes(e.key))n=index-1;if(e.key==='Home')n=0;if(e.key==='End')n=data.slides.length-1;if(n!==undefined){e.preventDefault();navigate(n,{focus:true});}});
  let touch=null;
  $('#main').addEventListener('touchstart',e=>{if(e.touches.length!==1||e.target.closest('button,a,.archive-gallery')){touch=null;return;}touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  $('#main').addEventListener('touchend',e=>{if(!touch||!data||$('#story-dialog').open)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.8)navigate(index+(dx<0?1:-1));},{passive:true});
  $('#main').addEventListener('touchcancel',()=>touch=null,{passive:true});
  function announce(text){clearTimeout(statusTimer);$('#status').textContent=text;$('#status').classList.add('visible');statusTimer=setTimeout(()=>$('#status').classList.remove('visible'),3500);}
  $('#share-button').addEventListener('click',async()=>{const payload={title:local(data.slides[index].title),url:location.href};if(navigator.share){try{await navigator.share(payload);return;}catch(e){if(e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(payload.url);announce(t('copied'));}catch{openDialog('share');}});
  async function loadArchive(){
    for(const path of ['assets/archive/archive-manifest.json','archive-manifest.json']){
      try{const response=await fetch(path);if(!response.ok)continue;const manifest=await response.json();const items=Array.isArray(manifest)?manifest:(manifest.images||manifest.items||manifest.photos||manifest.assets||[]);if(!Array.isArray(items))continue;
        photos=items.filter(p=>p&&p.public!==false&&!p.private&&!p.living).map(p=>{let src=p.src||p.path||p.file||p.localPath||p.local_path;if(typeof src!=='string')return null;src=src.replace(/^\.\//,'').replace(/^\/reinoso-family\//,'');if(!src.startsWith('assets/')){if(!src.includes('/')&&!src.includes('..'))src='assets/archive/'+src;else return null;}if(src.includes('..')||src.includes('\\')||/[?#]/.test(src))return null;return {...p,src,title:p.title||{en:p.title_en,es:p.title_es},caption:p.caption||((p.title_en||p.title_es)?{en:p.title_en,es:p.title_es}:undefined),alt:p.alt||{en:p.alt_en,es:p.alt_es},basis:p.basis||{en:p.basis_en,es:p.basis_es},sourceUrl:p.sourceUrl||p.sourceURL||p.source_url||p.url,credit:p.credit||(typeof p.provenance==='string'&&p.provenance.includes('lbrei')?{en:'Family collection shared by lbrei on Ancestry',es:'Colección familiar compartida por lbrei en Ancestry'}:p.provenance)};}).filter(Boolean);break;
      }catch{/* An absent optional album must never prevent the storybook loading. */}
    }
    if(data&&(data.slides[index].kind==='archive'||data.slides[index].archiveIds?.length))render();
  }
  async function init(){try{const response=await fetch('content.json');if(!response.ok)throw new Error('content HTTP '+response.status);data=await response.json();if(!data.slides?.length)throw new Error('Empty content');stateFromURL();navigate(index,{replace:true});document.documentElement.dataset.ready='true';loadArchive();}catch(error){console.error('Storybook:',error);const p=node('p','load-error',t('loadError'));const retry=node('button','',t('retry'));retry.addEventListener('click',()=>location.reload());p.append(document.createElement('br'),retry);$('#story-extra').append(p);}}
  init();
})();
