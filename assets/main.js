(function(){
  var EN=document.documentElement.lang==='en';
  function t(fr,en){return EN?en:fr}

  /* Menu mobile */
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  function setMenu(o){document.body.classList.toggle('menu-open',o);menu.classList.toggle('open',o);var hd0=document.querySelector('header.site');if(o&&hd0){var bt=Math.round(hd0.getBoundingClientRect().bottom);menu.style.height='calc(100vh - '+bt+'px)';menu.style.height='calc(100dvh - '+bt+'px)'}else{menu.style.height=''}burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?t('Fermer le menu','Close menu'):t('Ouvrir le menu','Open menu'));document.body.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  /* En-tête : ombre au défilement */
  var hd=document.querySelector('header.site');
  if(hd){var onS=function(){hd.classList.toggle('scrolled',window.scrollY>6)};onS();window.addEventListener('scroll',onS,{passive:true})}

  /* Sous-menu */
  document.querySelectorAll('.sub-toggle').forEach(function(b){
    var li=b.closest('.has-sub');
    b.addEventListener('click',function(){var o=!li.classList.contains('open');li.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
  });
  document.addEventListener('click',function(e){document.querySelectorAll('.has-sub.open').forEach(function(li){if(!li.contains(e.target)){li.classList.remove('open');li.querySelector('.sub-toggle').setAttribute('aria-expanded','false')}})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.has-sub.open').forEach(function(li){li.classList.remove('open')})});

  /* Lien « Mon compte » : direct vers l'espace si connecté (démo) */
  try{if(sessionStorage.getItem('murith_demo_session')==='1'){document.querySelectorAll('a[data-account]').forEach(function(a){a.href=a.getAttribute('data-account')})}}catch(_){}

  /* Révélations au scroll */
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add('in')})}

  /* Questionnaire en 3 questions */
  var Q=EN?[
    {t:'What kind of funeral do you have in mind?',k:'Funeral',o:[
      ['Simple package','A sober ceremony, no particular arrangements'],
      ['Special requests','Music, venue, programme: precise wishes'],
      ['I don’t know yet','An advisor will help me see clearly']]},
    {t:'How would you prefer to pay?',k:'Payment',o:[
      ['Single payment','Pay everything at once'],
      ['Instalments','Spread the payment over several months'],
      ['To be discussed together','I want to compare both options']]},
    {t:'How would you like to proceed?',k:'Next step',o:[
      ['An appointment','Meet an advisor in Geneva'],
      ['A quote by email','Receive an offer to read at your own pace'],
      ['Documentation','Read first, decide later']]}
  ]:[
    {t:'Quel type de funérailles imaginez-vous ?',k:'Funérailles',o:[
      ['Formule simple','Une cérémonie sobre, sans démarches particulières'],
      ['Demandes particulières','Musique, lieu, déroulé : des souhaits précis'],
      ['Je ne sais pas encore','Un conseiller m’aidera à y voir clair']]},
    {t:'Comment préférez-vous financer ?',k:'Financement',o:[
      ['Versement unique','Tout régler en une seule fois'],
      ['Paiement échelonné','Étaler le paiement sur plusieurs mois'],
      ['À discuter ensemble','Je veux comparer les deux options']]},
    {t:'Comment souhaitez-vous poursuivre ?',k:'Suite',o:[
      ['Un rendez-vous','Rencontrer un conseiller à Genève'],
      ['Un devis par e-mail','Recevoir une offre à consulter tranquillement'],
      ['De la documentation','Lire d’abord, décider ensuite']]}
  ];
  var ans=[null,null,null],step=0,body=document.getElementById('q-body'),bars=document.querySelectorAll('#quiz .progress i');
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function render(){
    bars.forEach(function(b,i){b.classList.toggle('done',i<step||(step===3))});
    if(step<3){
      var q=Q[step];
      body.innerHTML='<div class="q-count">'+t('Question ','Question ')+(step+1)+' / 3</div><h3 class="q-title">'+esc(q.t)+'</h3><div class="opts">'+
        q.o.map(function(o,i){return '<button type="button" class="opt" aria-pressed="'+(ans[step]===i)+'" data-i="'+i+'"><span class="dot"></span><span><b>'+esc(o[0])+'</b><small>'+esc(o[1])+'</small></span></button>'}).join('')+
        '</div><div class="q-nav"><button type="button" class="q-back" '+(step===0?'disabled':'')+'>← '+t('Retour','Back')+'</button><button type="button" class="btn btn-red q-next" '+(ans[step]===null?'disabled style="opacity:.4;pointer-events:none"':'')+'>'+(step===2?t('Voir mon récapitulatif','See my summary'):t('Continuer','Continue'))+' <svg><use href="#i-arrow"/></svg></button></div>';
    }else{
      body.innerHTML='<div class="q-result"><div class="q-count">'+t('Récapitulatif','Summary')+'</div><h3>'+t('Merci, voici votre demande.','Thank you, here is your request.')+'</h3><ul class="recap">'+
        Q.map(function(q,i){return '<li><span>'+q.k+'</span><span>'+esc(q.o[ans[i]][0])+'</span></li>'}).join('')+
        '</ul><a class="btn btn-red" href="contact.html" id="q-go">'+t('Envoyer ma demande','Send my request')+' <svg><use href="#i-arrow"/></svg></a><p class="fine">'+t('Sans engagement. Un conseiller Murith vous recontacte pour établir votre devis personnalisé.','No commitment. A Murith advisor will contact you to prepare your personalised quote.')+'</p><button type="button" class="q-back" id="q-reset" style="margin-top:14px">↺ '+t('Recommencer','Start over')+'</button></div>';
    }
  }
  if(body){
    body.addEventListener('click',function(e){
      var o=e.target.closest('.opt');
      if(o){ans[step]=+o.dataset.i;render();var n=body.querySelector('.q-next');if(n)n.focus();return}
      if(e.target.closest('.q-next')){step++;render();return}
      var bk=e.target.closest('.q-back');
      if(bk&&bk.id==='q-reset'){ans=[null,null,null];step=0;render();return}
      if(bk&&step>0){step--;render();return}
      if(e.target.closest('#q-go')){try{sessionStorage.setItem('murith_quiz',JSON.stringify(Q.map(function(q,i){return q.k+' : '+q.o[ans[i]][0]})))}catch(_){}}
    });
    render();
  }

  /* Formulaire de contact (maquette) */
  var f=document.getElementById('docform');
  if(f){
    try{
      var qz=JSON.parse(sessionStorage.getItem('murith_quiz')||'null');
      if(qz){
        var n=document.getElementById('recapnote');
        n.textContent=t('Votre questionnaire : ','Your questionnaire: ')+qz.join(' · ');n.classList.add('on');
        document.getElementById('sujet').selectedIndex=2;
        document.getElementById('msg').value=t('Mon questionnaire — ','My questionnaire — ')+qz.join(' ; ');
      }
    }catch(_){}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!f.checkValidity()){f.reportValidity();return}
      document.getElementById('formok').style.display='flex';
    });
  }
})();
