/* AthleteTrack — kemasan UI (animasi & responsif).
   Hanya menambah kelas/atribut paparan; tidak mengubah data, aliran atau API. */
(function(){
  'use strict';
  var kurang=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Muncul bertahap bila di skrin (scroll reveal) ── */
  var SEL='.card,.metric,.pkg-card,.feat-card,.lencana,.inv-card,.podium,.tbl-wrap,.section-title,.section-sub,.profile-hd,.notif-bar,.kad-prestasi';
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(entri){
    var baris=0;
    entri.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.style.setProperty('--d',Math.min(baris++,8)*70+'ms');
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  },{threshold:.08,rootMargin:'0px 0px -4% 0px'}):null;

  function imbas(){
    if(!io||kurang)return;
    document.querySelectorAll('.page.active').forEach(function(pg){
      pg.querySelectorAll(SEL).forEach(function(el){
        if(el.dataset.rv)return;
        // Jangan dedahkan semula elemen bersarang di dalam elemen yang sudah dianimasikan
        if(el.parentElement&&el.parentElement.closest('.rv'))return;
        el.dataset.rv='1';
        el.classList.add('rv');
        io.observe(el);
      });
    });
  }

  /* ── 2. Nombor mengira naik (count-up) pada kad statistik ── */
  var NOMBOR=/^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/;
  function animNombor(el){
    if(kurang||el._anim)return;
    var t=(el.textContent||'').trim();
    if(el.dataset.akhir===t)return;           // nilai sama, tak perlu ulang
    var m=t.match(NOMBOR);
    if(!m)return;
    var tanpa=m[2].replace(/,/g,''),perpuluhan=(tanpa.split('.')[1]||'').length,sasaran=parseFloat(tanpa);
    if(!isFinite(sasaran)||sasaran===0){el.dataset.akhir=t;return;}
    var koma=m[2].indexOf(',')>-1,mula=null,tempoh=900;
    el.dataset.akhir=t;el._anim=true;
    function format(n){
      var s=n.toFixed(perpuluhan);
      return koma?Number(s).toLocaleString('en-US',{minimumFractionDigits:perpuluhan,maximumFractionDigits:perpuluhan}):s;
    }
    function langkah(ts){
      if(mula===null)mula=ts;
      var p=Math.min((ts-mula)/tempoh,1),e=1-Math.pow(1-p,3);
      el.textContent=m[1]+format(sasaran*e)+m[3];
      if(p<1)requestAnimationFrame(langkah);
      else{el.textContent=t;setTimeout(function(){el._anim=false;},0);}
    }
    requestAnimationFrame(langkah);
  }

  /* ── 3. Jadual: label sel untuk paparan telefon + baris masuk bertahap ── */
  function sediaJadual(tbody){
    var tbl=tbody.closest('table');
    if(!tbl||!tbl.closest('.tbl-wrap'))return;
    var th=[].map.call(tbl.querySelectorAll('thead th'),function(x){return (x.textContent||'').trim();});
    var baris=[].slice.call(tbody.children);
    baris.forEach(function(tr,i){
      [].forEach.call(tr.children,function(td,j){
        if(!td.hasAttribute('colspan')&&td.getAttribute('data-label')===null)td.setAttribute('data-label',th[j]||'');
      });
      if(!kurang&&!tbody.dataset.dah&&baris.length>0&&!tr.querySelector('td[colspan]')){
        tr.style.setProperty('--i',Math.min(i,14));
        tr.classList.add('baris-masuk');
      }
    });
    // Animasi baris hanya sekali bagi setiap pemuatan data (bukan setiap kali butang tanda ditekan)
    if(baris.length&&!baris[0].querySelector('td[colspan]')){
      tbody.dataset.dah='1';
      clearTimeout(tbody._t);
      tbody._t=setTimeout(function(){delete tbody.dataset.dah;},1500);
    }
  }

  /* ── 4. Pemerhati perubahan DOM (data dimuat secara dinamik) ── */
  var tunggu=false;
  function jadual(){
    tunggu=false;
    document.querySelectorAll('.page.active tbody').forEach(sediaJadual);
    document.querySelectorAll('.page.active .metric-val,.page.active #dash-hadir-pct').forEach(animNombor);
    imbas();
  }
  function daripadaAnimasi(r){
    var n=r.target.nodeType===3?r.target.parentElement:r.target;
    return !!(n&&n._anim);
  }
  var mo=new MutationObserver(function(rekod){
    if(tunggu)return;
    if(rekod.every(daripadaAnimasi))return;   // abaikan perubahan teks daripada count-up sendiri
    tunggu=true;requestAnimationFrame(jadual);
  });
  function mula(){
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
    jadual();
  }

  /* ── 5. Pasang pada go(): paparkan semula animasi bagi setiap halaman ── */
  if(typeof window.go==='function'){
    var asal=window.go;
    window.go=function(id){
      var r=asal.apply(this,arguments);
      document.querySelectorAll('.page:not(.active) [data-rv]').forEach(function(el){
        // reset supaya animasi main semula bila halaman dibuka lagi
        el.classList.remove('rv','in');delete el.dataset.rv;
        if(io)io.unobserve(el);
      });
      document.querySelectorAll('.page.active .metric-val').forEach(function(el){delete el.dataset.akhir;});
      document.querySelectorAll('tbody').forEach(function(tb){delete tb.dataset.dah;});
      requestAnimationFrame(jadual);
      return r;
    };
  }

  /* ── 6. Riak (ripple) pada butang ── */
  document.addEventListener('pointerdown',function(e){
    var b=e.target.closest&&e.target.closest('.btn,.hero-btn-pri,.hero-btn-sec');
    if(!b||b.disabled||kurang)return;
    var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2;
    var s=document.createElement('span');
    s.className='ripple';
    s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
    b.appendChild(s);
    setTimeout(function(){s.remove();},700);
  },{passive:true});

  /* ── 7. Bayang topbar bila skrol ── */
  var skrolTunggu=false;
  window.addEventListener('scroll',function(){
    if(skrolTunggu)return;
    skrolTunggu=true;
    requestAnimationFrame(function(){
      document.body.classList.toggle('skrol',window.scrollY>6);
      skrolTunggu=false;
    });
  },{passive:true});

  /* ── 8. Menu telefon: ketik di luar sidebar / tekan Esc untuk tutup ── */
  document.addEventListener('click',function(e){
    var pg=document.querySelector('.page.nav-buka');
    if(!pg)return;
    if(e.target.closest('.sidebar')||e.target.closest('.nav-togol'))return;
    pg.classList.remove('nav-buka');
    e.stopPropagation();e.preventDefault();
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    var pg=document.querySelector('.page.nav-buka');
    if(pg)pg.classList.remove('nav-buka');
    document.querySelectorAll('.modal-bg.open').forEach(function(m){
      if(typeof window.closeModal==='function')window.closeModal(m.id);else m.classList.remove('open');
    });
  });
  // Pulihkan kedudukan skrol apabila saiz skrin berubah (putar telefon) — tutup menu terbuka
  window.addEventListener('resize',function(){
    if(window.innerWidth>760){
      var pg=document.querySelector('.page.nav-buka');
      if(pg)pg.classList.remove('nav-buka');
    }
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mula);else mula();
})();
