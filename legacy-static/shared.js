/* ════════════════════════════════════════════════════════════
   FERRARI CLUB ESPAÑA — SHARED JS
   nav · menu · transitions · reveal · counters · parallax ·
   magnetic · race mode · sound · active nav
════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const gsap = window.gsap;
const ST   = window.ScrollTrigger;
if(gsap && ST) gsap.registerPlugin(ST);

/* ── Skip link ──────────────────────────────────────────── */
(function(){
  const a = document.createElement('a');
  a.className = 'skip-link';
  a.href = '#main-content';
  a.textContent = 'Saltar al contenido principal';
  document.body.insertBefore(a, document.body.firstChild);
  if(!document.getElementById('main-content')){
    const main = document.querySelector('main');
    if(main && !main.id) main.id = 'main-content';
  }
})();

/* ── Page transition IN (reveal current page) ──────────── */
(function pageIn(){
  const pt = document.getElementById('pt');
  if(!pt) return;
  if(gsap){
    gsap.set(pt,{scaleY:1,transformOrigin:'top'});
    gsap.to(pt,{scaleY:0,duration:.7,ease:'power4.out',transformOrigin:'top',delay:.05});
  } else {
    pt.style.transition = 'transform .6s';
    pt.style.transform  = 'scaleY(0)';
    pt.style.transformOrigin = 'top';
  }
})();

/* ── Nav scroll class ───────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll',()=>{
  nav?.classList.toggle('sc', window.scrollY > 60);
},{passive:true});

/* ── Page transition OUT (intercept internal links) ─────── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if(!link) return;
  const href = link.getAttribute('href');
  if(!href) return;
  if(href.startsWith('#') || href.startsWith('mailto:') ||
     href.startsWith('tel:') || href.startsWith('http') ||
     link.target === '_blank' || e.ctrlKey || e.metaKey) return;
  e.preventDefault();
  const pt = document.getElementById('pt');
  if(gsap && pt){
    gsap.set(pt,{scaleY:0,transformOrigin:'bottom',pointerEvents:'all'});
    gsap.to(pt,{scaleY:1,duration:.5,ease:'power4.in',
      transformOrigin:'bottom',
      onComplete:()=>{ window.location.href = href; }
    });
  } else {
    window.location.href = href;
  }
});

/* ── Fullscreen Menu ────────────────────────────────────── */
const mbtn  = document.getElementById('mbtn');
const menu  = document.getElementById('menu');
const items = menu ? Array.from(menu.querySelectorAll('.mi')) : [];
const previews = menu ? menu.querySelectorAll('.mp') : [];
let menuOpen = false;

if(mbtn) mbtn.addEventListener('click',()=> menuOpen ? closeMenu() : openMenu());
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && menuOpen) closeMenu(); });

items.forEach((item,i)=>{
  item.addEventListener('mouseenter',()=>{
    previews.forEach(p=>p.classList.remove('on'));
    const target = document.getElementById('mp'+i);
    if(target) target.classList.add('on');
  });
});

function openMenu(){
  menuOpen = true;
  mbtn?.classList.add('open');
  mbtn?.setAttribute('aria-expanded','true');
  menu?.classList.add('open');
  document.body.style.overflow = 'hidden';
  if(gsap && items.length){
    gsap.fromTo(items,
      {x:-80,opacity:0},
      {x:0,opacity:1,duration:.6,ease:'power3.out',stagger:.07,delay:.15}
    );
  } else {
    items.forEach(it=>{ it.style.opacity='1'; it.style.transform='none'; });
  }
}
function closeMenu(){
  menuOpen = false;
  mbtn?.classList.remove('open');
  mbtn?.setAttribute('aria-expanded','false');
  if(gsap && items.length){
    gsap.to(items,{x:-55,opacity:0,duration:.3,stagger:.04,ease:'power2.in',
      onComplete:()=>{
        menu?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  } else {
    menu?.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Reveal on scroll (IntersectionObserver) ───────────── */
(function initReveal(){
  const els = document.querySelectorAll('[data-r],[data-stagger]');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(el=>{ el.classList.add('in'); el.style.opacity='1'; el.style.transform='none'; });
    return;
  }
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
  els.forEach(el=>obs.observe(el));
})();

/* ── GSAP ScrollTrigger extras ──────────────────────────── */
if(gsap && ST){

  /* Stat counters */
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count,10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const obj = {val:0};
    ST.create({
      trigger:el,start:'top 85%',once:true,
      onEnter:()=>{
        /* Years (>1900) look wrong animating — just display them */
        if(target > 1900){ el.textContent = prefix + target + suffix; return; }
        gsap.to(obj,{
          val:target,duration:2.2,ease:'power2.out',
          onUpdate:()=>{ el.textContent = prefix + Math.round(obj.val) + suffix; }
        });
      }
    });
  });

  /* Parallax */
  document.querySelectorAll('[data-par]').forEach(el=>{
    const speed = parseFloat(el.dataset.par) || .15;
    gsap.fromTo(el,
      {yPercent:-(speed*100)},
      {yPercent:(speed*100),ease:'none',
       scrollTrigger:{trigger:el.closest('section')||el,start:'top bottom',end:'bottom top',scrub:true}
      }
    );
  });

}

/* ── 3D Card Tilt + Dynamic Shadow ──────────────────────── */
(function(){
  if(window.matchMedia('(pointer:coarse)').matches)return;
  const cards=document.querySelectorAll('.mcard,.news-card,.mem-card,.evp-card');
  cards.forEach(card=>{
    card.style.willChange='transform';
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const sx=x*28, sy=y*20;
      card.style.transform=`perspective(900px) rotateY(${x*14}deg) rotateX(${-y*10}deg) scale3d(1.025,1.025,1.025)`;
      card.style.boxShadow=`${-sx}px ${-sy}px 40px rgba(204,0,0,.12),0 20px 60px rgba(0,0,0,.6)`;
      card.style.transition='transform .08s ease-out';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
      card.style.boxShadow='';
      card.style.transition='transform .5s ease-out,box-shadow .5s ease-out';
    });
  });
})();

/* ── Magnetic buttons ───────────────────────────────────── */
document.querySelectorAll('[data-mag]').forEach(el=>{
  if(!gsap) return;
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    gsap.to(el,{
      x:(e.clientX-(r.left+r.width/2))*.35,
      y:(e.clientY-(r.top+r.height/2))*.35,
      duration:.35,ease:'power2.out'
    });
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'});
  });
});

/* ── Active nav link ────────────────────────────────────── */
(function markActive(){
  const path = location.pathname.replace(/\/$/,'') || '/';
  document.querySelectorAll('.nav-link,.nav-drop-item,.mi').forEach(a=>{
    const href = (a.getAttribute('href')||'').replace(/\/$/,'');
    if(!href) return;
    if(href === path || (href !== '' && href !== '/' && path.startsWith(href))){
      a.classList.add('active');
    }
  });
})();

/* ── Race Mode ──────────────────────────────────────────── */
(function initRace(){
  const btn = document.getElementById('race-btn');
  const canvas = document.getElementById('race-canvas');
  if(!btn || !canvas) return;

  const ctx = canvas.getContext('2d');
  let on = false, raf = null;
  const trail = [];

  function resize(){
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  window.addEventListener('mousemove',e=>{
    if(!on) return;
    trail.push({x:e.clientX,y:e.clientY,t:Date.now(),vx:0,vy:0});
    if(trail.length > 2){
      const p = trail[trail.length-2];
      trail[trail.length-1].vx = e.clientX - p.x;
      trail[trail.length-1].vy = e.clientY - p.y;
    }
    if(trail.length > 80) trail.shift();
  },{passive:true});

  function drawRace(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const now = Date.now();
    const alive = trail.filter(p=>now - p.t < 400);
    trail.length = 0;
    alive.forEach(p=>trail.push(p));
    if(alive.length < 2){ raf=requestAnimationFrame(drawRace); return; }
    for(let i=1;i<alive.length;i++){
      const p=alive[i-1],c=alive[i];
      const age=(now-c.t)/400;
      const alpha=(1-age)*.9;
      const w=Math.max(.5,(1-age)*4);
      const speed=Math.hypot(c.vx,c.vy);
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(c.x,c.y);
      ctx.strokeStyle=`rgba(204,0,0,${alpha})`;
      ctx.lineWidth=w;
      ctx.lineCap='round';
      ctx.stroke();
      if(speed > 18){
        ctx.beginPath();
        ctx.moveTo(c.x,c.y);
        ctx.lineTo(c.x - c.vx*2.5, c.y - c.vy*2.5);
        ctx.strokeStyle=`rgba(255,80,80,${alpha*.35})`;
        ctx.lineWidth=w*.4;
        ctx.stroke();
      }
    }
    raf=requestAnimationFrame(drawRace);
  }

  btn.addEventListener('click',()=>{
    on = !on;
    btn.classList.toggle('on',on);
    canvas.classList.toggle('on',on);
    btn.textContent = on ? '■ RACE ON' : '▶ RACE';
    if(on) raf=requestAnimationFrame(drawRace);
    else {
      cancelAnimationFrame(raf);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      trail.length=0;
    }
  });
})();

/* ── Sound button (visual toggle) ──────────────────────── */
(function initSound(){
  const btn = document.getElementById('sound-btn');
  if(!btn) return;
  let on = false;
  btn.addEventListener('click',()=>{
    on = !on;
    btn.innerHTML = on ? '♪ SOUND ON' : '♪ SOUND';
    btn.style.color = on ? 'var(--white)' : '';
    btn.style.borderColor = on ? 'var(--w30)' : '';
  });
})();

/* ── Scroll to top ──────────────────────────────────────── */
(function initSTT(){
  const btn = document.createElement('button');
  btn.id = 'stt';
  btn.setAttribute('aria-label','Volver al inicio de la página');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 14V4M4 9l5-5 5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);
  window.addEventListener('scroll',()=>{
    btn.classList.toggle('vis', window.scrollY > 400);
  },{passive:true});
  btn.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();

/* ── Konami code (home only) ────────────────────────────── */
(function konami(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
                'b','a'];
  let i=0;
  document.addEventListener('keydown',e=>{
    if(e.key === seq[i]) i++; else i=0;
    if(i===seq.length){
      i=0;
      /* Ferrari red flash easter egg */
      const flash=document.createElement('div');
      flash.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(204,0,0,.18);pointer-events:none;animation:konamiFlash .8s ease-out forwards';
      const style=document.createElement('style');
      style.textContent='@keyframes konamiFlash{0%{opacity:1}100%{opacity:0}}';
      document.head.appendChild(style);
      document.body.appendChild(flash);
      setTimeout(()=>{flash.remove();style.remove();},850);
      if(window.gsap){
        const logo=document.querySelector('.nav-logo');
        if(logo)window.gsap.fromTo(logo,{scale:1},{scale:1.08,duration:.25,yoyo:true,repeat:3,ease:'power2.inOut'});
      }
    }
  });
})();

})();
