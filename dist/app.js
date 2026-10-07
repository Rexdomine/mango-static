'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const moods = {
  soulful:{label:'Soulful', title:'SOUL', bg:'#f5eedc', ink:'#101719', accent:'#ff8a00', second:'#174e3c', line:'Warm chords. A feeling that stays.'},
  playful:{label:'Playful', title:'BOUNCE', bg:'#ffc247', ink:'#101719', accent:'#174e3c', second:'#ff8a00', line:'Good energy. A little mischief.'},
  electric:{label:'Electric', title:'VOLTAGE', bg:'#101719', ink:'#f5eedc', accent:'#ff8a00', second:'#00b8b0', line:'A little voltage. A different kind of energy.'}
};
const settings = {
 houseparty:{label:'House party', title:'HOUSE PARTY', line:'For good company and whoever is holding the aux.', pattern:'orbit'},
 celebration:{label:'Wedding / owambe', title:'OWAMBE ENERGY', line:'For the owambe, the big day, and the joy in between.', pattern:'burst'},
 friends:{label:'Out with friends', title:'WITH MY PEOPLE', line:'For your people, good gist and songs you all know.', pattern:'paired'},
 onthemove:{label:'On the move', title:'SOUNDTRACK IN MOTION', line:'For the road, the commute, and your next stop.', pattern:'waves'},
 home:{label:'At home', title:'MY OWN LITTLE WORLD', line:'For your own space, at your own pace.', pattern:'nested'},
 afterhours:{label:'After hours', title:'AFTER HOURS', line:'For low lights and one more track.', pattern:'night'},
 // Preserve earlier invitation links without crowding the new setting choices.
 rooftop:{label:'Rooftop', title:'ABOVE THE CITY', line:'For wide skies and city lights.', pattern:'orbit', legacy:true},
 coast:{label:'By the water', title:'BY THE WATER', line:'For salt air and a slower horizon.', pattern:'waves', legacy:true}
};
const energies = {drift:{label:'Easy drift', title:'LET IT DRIFT', line:'Leave room to breathe.', count:5},groove:{label:'Locked in', title:'IN THE POCKET', line:'Find the groove. Stay a while.', count:9},lift:{label:'Full release', title:'ALL THE WAY UP', line:'A little more lift. A little less gravity.', count:15}};
const state={mood:'soulful',setting:'houseparty',energy:'groove',nickname:'',track:'',format:'portrait'};
let step=0, ready=false, renderReady=false;
const canvas=$('#frequency-card'), ctx=canvas.getContext('2d');
const images={};
const imageReady=Promise.all(['wordmark','wordmark-dark','mascot-badge','mascot'].map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve()};im.onerror=reject;im.src=`assets/${name}.${name.startsWith('wordmark')?'svg':'png'}`;})));
const isLocalPreview=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
$('#local-invite-note').hidden=!isLocalPreview;
const params=new URLSearchParams(location.search);
const requestedSetting=params.get('setting');
if(Object.hasOwn(settings,requestedSetting)&&settings[requestedSetting].legacy){
 const option=settings[requestedSetting],label=document.createElement('label'),input=document.createElement('input'),copy=document.createElement('span'),title=document.createElement('b'),hint=document.createElement('small');
 label.className='choice legacy-choice';input.type='radio';input.name='setting';input.value=requestedSetting;title.textContent=option.label;hint.textContent='From your earlier invitation';copy.append(title,hint);label.append(input,copy);$('.settings-choices').append(label);
}
for(const [key,options] of Object.entries({mood:moods,setting:settings,energy:energies})){
 if(Object.hasOwn(options,params.get(key))){state[key]=params.get(key);$(`input[name="${key}"][value="${state[key]}"]`).checked=true;}
}
function setStep(n){step=n;$$('.step-panel').forEach((p,i)=>p.hidden=i!==n);$$('.step').forEach((b,i)=>{b.classList.toggle('active',i===n);if(i===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});$('#step-count').textContent=`${n+1} OF 3`;$('#back').hidden=n===0;$('#next').hidden=n===2;$('#make-card').hidden=n!==2;$('#next').innerHTML=n===0?'Next: the setting <span aria-hidden="true">＋</span>':'Next: the energy <span aria-hidden="true">＋</span>';}
$$('.step').forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.step))));
$('#next').addEventListener('click',()=>{setStep(Math.min(2,step+1));$(`.step-panel[data-panel="${step}"] input`).focus()});
$('#back').addEventListener('click',()=>setStep(Math.max(0,step-1)));
$('#frequency-form').addEventListener('input',e=>{const el=e.target;if(Object.hasOwn(state,el.name)){state[el.name]=el.value;renderCard();if(ready)$('#card-status').textContent='Card updated. Save again to keep your new choices.'}});
$('#frequency-form').addEventListener('submit',e=>{e.preventDefault();ready=true;$('#export-tools').hidden=false;$('#preview-tag').textContent='YOUR SIGNAL, READY';$('#card-status').textContent='Your frequency card is ready to save or share.';renderCard();$('#export-tools').scrollIntoView({behavior:'smooth',block:'nearest'});$('#download').focus({preventScroll:true})});
function text(s,x,y,size,color,weight=400,max=936,align='left'){
 ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`${weight} ${size}px Lato`;while(ctx.measureText(s).width>max&&size>16){size--;ctx.font=`${weight} ${size}px Lato`;}ctx.fillText(s,x,y);
}
function rule(y,color){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(70,y);ctx.lineTo(1010,y);ctx.stroke()}
function renderCard(){
 if(!renderReady)return;
 const m=moods[state.mood],s=settings[state.setting],e=energies[state.energy];const H={portrait:1350,story:1920,square:1080}[state.format];canvas.height=H;canvas.width=1080;
 ctx.fillStyle=m.bg;ctx.fillRect(0,0,1080,H);
 const story=H===1920;const top=story?230:60;const y=H===1080?680:H===1350?925:1340;const artTop=top+240;const artH=y-75-artTop;const cy=artTop+artH/2;
 ctx.save();ctx.beginPath();ctx.rect(0,artTop,1080,artH);ctx.clip();
 // Abstract signal patterns: the setting determines geometry; energy determines density.
 if(s.pattern==='orbit'){
  ctx.strokeStyle=m.accent;ctx.lineWidth=state.energy==='lift'?20:13;
  for(let i=0;i<e.count;i++){ctx.beginPath();ctx.ellipse(540,cy,150+i*56,110+i*44,-.25,Math.PI*.13,Math.PI*1.9);ctx.stroke()}
 }else if(s.pattern==='waves'){
  ctx.strokeStyle=m.accent;ctx.lineWidth=Math.min(state.energy==='lift'?20:13,artH/e.count*.45);
  for(let i=0;i<e.count;i++){ctx.beginPath();const yy=artTop+20+i*artH/e.count;ctx.moveTo(-60,yy);ctx.bezierCurveTo(220,yy-130,620,yy+130,1140,yy);ctx.stroke()}
 }else if(s.pattern==='burst'){
  ctx.strokeStyle=m.accent;ctx.lineWidth=state.energy==='lift'?18:12;
  for(let i=0;i<e.count*3;i++){const angle=i*Math.PI*2/(e.count*3);ctx.beginPath();ctx.moveTo(540+Math.cos(angle)*180,cy+Math.sin(angle)*180);ctx.lineTo(540+Math.cos(angle)*760,cy+Math.sin(angle)*760);ctx.stroke()}
 }else if(s.pattern==='paired'){
  ctx.strokeStyle=m.accent;ctx.lineWidth=state.energy==='lift'?13:9;
  for(let i=0;i<e.count;i++){for(const x of [310,770]){ctx.beginPath();ctx.ellipse(x,cy,140+i*38,100+i*32,0,0,Math.PI*2);ctx.stroke()}}
 }else if(s.pattern==='nested'){
  ctx.strokeStyle=m.accent;ctx.lineWidth=state.energy==='lift'?14:10;
  for(let i=0;i<e.count;i++){const w=300+i*80,h=200+i*52;ctx.beginPath();ctx.roundRect(540-w/2,cy-h/2,w,h,40);ctx.stroke()}
 }else{
  ctx.strokeStyle=m.second;ctx.lineWidth=state.energy==='lift'?18:10;
  for(let i=0;i<e.count;i++){ctx.save();ctx.translate(540,cy);ctx.rotate(i*.15);ctx.strokeRect(-160-i*32,-160-i*32,320+i*64,320+i*64);ctx.restore()}
 }
 ctx.fillStyle=m.bg;ctx.beginPath();ctx.arc(540,cy,151,0,Math.PI*2);ctx.fill();ctx.strokeStyle=m.ink;ctx.lineWidth=2;ctx.stroke();
 const badge=images['mascot-badge'];ctx.drawImage(badge,420,cy-119,240,238);
 ctx.restore();
 // Quiet brand band and typography keep the original artwork legible.
 const logo=images[state.mood==='electric'?'wordmark':'wordmark-dark'];ctx.drawImage(logo,70,top,230,230*logo.naturalHeight/logo.naturalWidth);
 text('FREQUENCY CARD',1010,top+28,24,m.ink,900,500,'right');text('PASS THE FREQUENCY / 001',1010,top+66,17,m.ink,400,530,'right');
 ctx.fillStyle=m.bg;ctx.fillRect(0,y-50,1080,H-y+50);
 const name=state.nickname.trim();text(name?`${name.toUpperCase()}'S FREQUENCY`:'THIS IS MY FREQUENCY',70,y-18,22,m.ink,900);
 text(m.title,67,y+100,126,m.ink,900);text(s.title+' / '+e.title,70,y+147,26,m.ink,900);
 text(m.line,70,y+202,26,m.ink);text(s.line+' '+e.line,70,y+244,23,m.ink);
 if(state.track.trim())text('ON REPEAT: '+state.track.trim(),70,y+289,23,m.ink,400);
 const bottom=story?H-155:H-40;rule(bottom-48,m.ink);text('MANGO STATIC',70,bottom,22,m.ink,900);text('FIND YOUR FREQUENCY.',1010,bottom,19,m.ink,900,500,'right');
 if(!$('#share-fallback').hidden)$('#invite-url').value=inviteUrl();
 const desc=`${name?name+'’s card: ':''}${m.label} / ${s.label} / ${e.label}${state.track.trim()?' · On repeat: '+state.track.trim():''}`;
 canvas.setAttribute('aria-label',`Mango Static Frequency Card. ${desc}. ${m.line} ${s.line} ${e.line}`);$('#card-description').textContent=`${m.label} / ${s.label} / ${e.label}`;
}
Promise.all([document.fonts.load('900 24px Lato'),document.fonts.load('400 24px Lato'),imageReady]).then(()=>{renderReady=true;renderCard()}).catch(()=>{$('#card-description').textContent='Card artwork could not load. Please reload the page.';$('#make-card').disabled=true});
$$('.format').forEach(b=>b.addEventListener('click',()=>{state.format=b.dataset.format;$$('.format').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',String(el===b))});renderCard();$('#card-status').textContent=`${b.textContent} selected.`}));
function inviteUrl(){const u=new URL(location.href);u.search='';for(const k of ['mood','setting','energy'])u.searchParams.set(k,state[k]);u.hash='tune';return u.href}
function blob(){return new Promise((resolve,reject)=>{if(!renderReady){reject(new Error('Artwork is still loading.'));return}canvas.toBlob(b=>b?resolve(b):reject(new Error('Image could not be created.')),'image/png')})}
function saveFile(data,name){const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function filename(){return `mango-static-${state.mood}-${state.setting}-${state.energy}-${state.format}.png`}
$('#download').addEventListener('click',async()=>{try{saveFile(await blob(),filename());$('#card-status').textContent='Image download started. Your invitation link is available separately.'}catch{$('#card-status').textContent='The image could not be saved. Please try again.'}});
function fallback(message){$('#share-fallback').hidden=false;$('#invite-url').value=inviteUrl();$('#card-status').textContent=message}
$('#share').addEventListener('click',async()=>{
 const button=$('#share');button.disabled=true;
 try{const file=new File([await blob()],filename(),{type:'image/png'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
 await navigator.share({files:[file],title:'My Mango Static Frequency',text:'This is my vibe. Find yours with Mango Static.',url:inviteUrl()});$('#card-status').textContent='Card handed to your device’s share menu.';
 }else fallback('File sharing is not available in this browser. Save the image and use the invitation link below.');
 }catch(e){if(e.name==='AbortError')$('#card-status').textContent='Sharing cancelled. Your card is still here.';else fallback('Sharing did not complete. You can still save your card and copy its invitation.')}finally{button.disabled=false}
});
$('#copy-invite').addEventListener('click',async()=>{try{if(!navigator.clipboard?.writeText)throw new Error();await navigator.clipboard.writeText(inviteUrl());$('#card-status').textContent=isLocalPreview?'Invitation copied. In this local preview, it opens on this computer only.':'Invite copied. Send it to your people so they can make their own card.'}catch{fallback('Copy the invitation from the field below.');$('#invite-url').focus();$('#invite-url').select()}});
const brief=$('#brief-dialog'),submission=$('#submit-dialog');
function openDialog(d){d.showModal();document.body.style.overflow='hidden'}
for(const d of [brief,submission]){d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('close',()=>document.body.style.overflow='');d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})}
$('#open-brief').addEventListener('click',()=>openDialog(brief));$('#open-submit').addEventListener('click',()=>{showSaved();openDialog(submission)});$('#brief-to-submit').addEventListener('click',()=>{brief.close();showSaved();openDialog(submission)});
const briefText=`MANGO STATIC — PASS THE FREQUENCY\nTRANSMISSION 001 / SMALL GATHERING. BIG PARTY ENERGY.\n\nA small get-together turning into a proper party. Start soulful, build the percussion, finish with energy.\n\n01 / START WITH SOUL\nLet people settle in. Warm chords, good gist, a little head-nodding.\n\n02 / FIND THE PULSE\nLet percussion lead the build. Afro house and Afrobeats can be starting points.\n\n03 / LET IT GO\nNow the room is ready. Bring a joyful lift, an electronic touch, or that unexpected track. Make it yours.\n\nNo fixed length or BPM. Share a link to your own interpretation hosted on a service you choose, with your DJ name for credit. Mango Static retains editorial selection; a submission will not guarantee a feature.\n\nSUBMISSION STATUS\nThe submission form saves in your browser only. Nothing is sent to Rex or published. Shared submission collection is not yet connected.\n`;
$('#save-brief').addEventListener('click',()=>saveFile(new Blob([briefText],{type:'text/plain;charset=utf-8'}),'mango-static-transmission-001-brief.txt'));
const storageKey='mango-static-local-submissions-v1';
function readSaved(){try{const rows=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.id==='string'&&typeof r.name==='string'&&typeof r.url==='string'&&/^https?:\/\//i.test(r.url)):[]}catch{return []}}
function showSaved(){const box=$('#saved-submissions');box.replaceChildren();const rows=readSaved();if(!rows.length)return;const h=document.createElement('h3');h.textContent='Saved on this device';box.append(h);rows.forEach(r=>{const row=document.createElement('div');row.className='saved-row';const info=document.createElement('div'),name=document.createElement('b'),link=document.createElement('a'),remove=document.createElement('button');name.textContent=r.name;link.textContent=r.url;link.href=r.url;link.target='_blank';link.rel='noopener noreferrer';info.append(name,link);remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove local submission by ${r.name}`);remove.addEventListener('click',()=>{try{localStorage.setItem(storageKey,JSON.stringify(readSaved().filter(x=>x.id!==r.id)));showSaved();$('#dj-status').textContent='Local submission removed.'}catch{$('#dj-status').textContent='Could not remove the local submission. Browser storage is unavailable.'}});row.append(info,remove);box.append(row)})}
$('#mix-url').addEventListener('input',()=>$('#mix-url').setCustomValidity(''));
$('#dj-name').addEventListener('input',()=>$('#dj-name').setCustomValidity(''));
$('#dj-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#dj-name'),url=$('#mix-url');if(!name.value.trim()){name.setCustomValidity('Please enter the name to credit.');name.reportValidity();return}let parsed;try{parsed=new URL(url.value);if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname.includes('.')||parsed.username||parsed.password)throw new Error()}catch{url.setCustomValidity('Use a complete http or https link to your interpretation.');url.reportValidity();return}
 try{const rows=readSaved();if(rows.some(r=>r.url===parsed.href&&r.name===name.value.trim())){$('#dj-status').textContent='That interpretation is already saved on this device.';return}rows.push({id:crypto.randomUUID(),name:name.value.trim(),url:parsed.href,createdAt:new Date().toISOString()});localStorage.setItem(storageKey,JSON.stringify(rows));$('#dj-form').reset();showSaved();$('#dj-status').textContent='Saved on this device. Nothing has been sent to Rex or published.'}catch{$('#dj-status').textContent='Your browser could not save this submission. Nothing was sent. Keep a copy of your link and try again.'}});
