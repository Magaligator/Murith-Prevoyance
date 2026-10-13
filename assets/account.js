(function(){
  var KEY='murith_demo_session';
  function $(s,c){return (c||document).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
  function has(){try{return sessionStorage.getItem(KEY)==='1'}catch(_){return false}}
  var body=document.body,mode=body.getAttribute('data-acct');

  /* toast */
  var tt;
  function toast(msg){
    var t=$('#toast');if(!t||!msg)return;
    t.textContent=msg;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},3600);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-toast]');
    if(b&&b.tagName!=='FORM'&&!b.hasAttribute('data-save')){e.preventDefault();toast(b.getAttribute('data-toast'))}
  });

  /* ---------- page de connexion ---------- */
  if(mode==='login'){
    if(has()){location.replace(body.getAttribute('data-next'))}
    var f=$('#loginform');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!f.checkValidity()){f.reportValidity();return}
      try{sessionStorage.setItem(KEY,'1')}catch(_){}
      location.href=body.getAttribute('data-next');
    });
    $$('[data-pw]').forEach(function(b){b.addEventListener('click',function(){
      var i=$('#'+b.getAttribute('data-pw'));var show=i.type==='password';i.type=show?'text':'password';b.setAttribute('aria-pressed',show);
    })});
    var fb=$('#forgot-btn'),fp=$('#forgot');
    if(fb)fb.addEventListener('click',function(){fp.hidden=!fp.hidden;fb.setAttribute('aria-expanded',!fp.hidden);if(!fp.hidden)$('#fe').focus()});
    var ff=$('#forgotform');
    if(ff)ff.addEventListener('submit',function(e){e.preventDefault();if(!ff.checkValidity()){ff.reportValidity();return}toast(ff.getAttribute('data-toast'));fp.hidden=true;fb.setAttribute('aria-expanded','false')});
  }

  /* ---------- tableau de bord ---------- */
  if(mode==='dash'){
    if(!has()){location.replace(body.getAttribute('data-login'));return}
    $$('[data-logout]').forEach(function(b){b.addEventListener('click',function(){
      try{sessionStorage.removeItem(KEY)}catch(_){}
      location.href=body.getAttribute('data-login');
    })});

    var panels=$$('.panel'),links=$$('.acct-nav a');
    function show(id){
      if(!$('#'+id)||!$('#'+id).classList.contains('panel'))id='overview';
      panels.forEach(function(p){p.hidden=p.id!==id});
      links.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+id?'true':'false')});
    }
    function route(){show((location.hash||'#overview').slice(1))}
    window.addEventListener('hashchange',function(){route();window.scrollTo({top:0,behavior:'smooth'})});
    route();

    /* filtre paiements */
    $$('.chip-b').forEach(function(c){c.addEventListener('click',function(){
      $$('.chip-b').forEach(function(x){x.setAttribute('aria-pressed',x===c)});
      var f=c.getAttribute('data-f');
      $$('#paytable tbody tr').forEach(function(r){r.hidden=!(f==='all'||r.getAttribute('data-s')===f)});
    })});

    /* enregistrement local des formulaires (démo) */
    function load(form){
      var k='murith_demo_'+form.id;
      try{var d=JSON.parse(localStorage.getItem(k)||'null');if(d){Object.keys(d).forEach(function(n){var el=form.elements[n];if(el&&el.type!=='checkbox'&&el.type!=='password')el.value=d[n]})}}catch(_){}
    }
    $$('form[data-save]').forEach(function(form){
      load(form);
      form.addEventListener('submit',function(e){
        e.preventDefault();
        if(!form.checkValidity()){form.reportValidity();return}
        var d={};Array.prototype.forEach.call(form.elements,function(el){if(el.name&&el.type!=='password')d[el.name]=el.value});
        try{localStorage.setItem('murith_demo_'+form.id,JSON.stringify(d))}catch(_){}
        if(form.id==='msgform'){
          var th=$('#thread'),m=document.createElement('div');m.className='msg me';
          var s=document.createElement('small');s.textContent=form.getAttribute('data-me');m.appendChild(s);
          m.appendChild(document.createTextNode(form.elements.message.value));th.appendChild(m);form.reset();
        }
        toast(form.getAttribute('data-toast'));
      });
    });

    /* personnes à informer */
    var pl=$('#persons');
    if(pl){
      pl.addEventListener('click',function(e){var b=e.target.closest('[data-del]');if(b){b.closest('li').remove();toast(pl.getAttribute('data-removed'))}});
      $('#addperson').addEventListener('click',function(){
        var n=$('#pn'),r=$('#pr'),p=$('#pp');
        if(!n.value.trim()||!p.value.trim()){n.reportValidity();return}
        var li=document.createElement('li'),d=document.createElement('div'),b=document.createElement('b'),s=document.createElement('small'),x=document.createElement('button');
        b.textContent=n.value.trim();s.textContent=(r.value.trim()?r.value.trim()+' · ':'')+p.value.trim();
        d.appendChild(b);d.appendChild(document.createElement('br'));d.appendChild(s);
        x.type='button';x.className='icon-btn';x.setAttribute('data-del','');x.setAttribute('aria-label',pl.getAttribute('data-del-label'));
        x.innerHTML='<svg><use href="#i-trash"/></svg>';
        li.appendChild(d);li.appendChild(x);pl.appendChild(li);n.value=r.value=p.value='';toast(pl.getAttribute('data-added'));
      });
    }
  }
})();
