(function(){
  var PHONE='5545991542530', reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,c){return (c||document).querySelector(s);}, $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s));};
  function url(t){return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(t);}
  window.__wa=url;
  $$('.js-wa').forEach(function(a){a.href=url(a.dataset.msg||'Olá! Vim pelo site e gostaria de agendar uma consulta com o Dr. Fernando.');});
  $$('.grow path').forEach(function(p){p.style.setProperty('--len',Math.ceil(p.getTotalLength()));});

  /* ===== header: dropdowns + drawer ===== */
  var dds=$$('.dd');
  function closeAll(except){dds.forEach(function(d){if(d!==except){d.classList.remove('open');var b=$('button',d);if(b)b.setAttribute('aria-expanded','false');}});}
  dds.forEach(function(d){
    var b=$('button',d),t=null;
    b.addEventListener('click',function(e){e.stopPropagation();var o=!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));});
    d.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches){clearTimeout(t);closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true');}});
    d.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover)').matches){t=setTimeout(function(){d.classList.remove('open');b.setAttribute('aria-expanded','false');},160);}});
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.dd'))closeAll();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();closeDrawer();}});
  var drawer=$('#drawer'),burger=$('#burger');
  function closeDrawer(){if(drawer){drawer.classList.remove('open');document.body.style.overflow='';if(burger)burger.setAttribute('aria-expanded','false');}}
  if(burger&&drawer){burger.addEventListener('click',function(){drawer.classList.add('open');document.body.style.overflow='hidden';burger.setAttribute('aria-expanded','true');});
    $('#drawerX').addEventListener('click',closeDrawer);$$('a',drawer).forEach(function(a){a.addEventListener('click',closeDrawer);});}

  /* ===== body map: hot points <-> list ===== */
  $$('.body').forEach(function(b){
    var scope=b.closest('[data-bodyscope]')||document;
    $$('.hp',b).forEach(function(h){
      var k=h.dataset.k,item=$('[data-k="'+k+'"].mitem',scope);
      function on(v){h.classList.toggle('hot',v);if(item)item.classList.toggle('hot',v);}
      h.addEventListener('mouseenter',function(){on(true);});h.addEventListener('mouseleave',function(){on(false);});
      h.addEventListener('click',function(){location.href=h.dataset.href;});
      h.addEventListener('keydown',function(e){if(e.key==='Enter')location.href=h.dataset.href;});
      if(item){item.addEventListener('mouseenter',function(){on(true);});item.addEventListener('mouseleave',function(){on(false);});}
    });
  });

  /* ===== manifesto light-up ===== */
  var man=$('#manif'),words=[];
  if(man){(function split(el){[].slice.call(el.childNodes).forEach(function(n){
    if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w))f.appendChild(document.createTextNode(w));else{var s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s);}});el.replaceChild(f,n);}
    else if(n.nodeType===1)split(n);});})(man);words=$$('.w',man);}
  function light(){if(!man)return;var r=man.getBoundingClientRect(),vh=innerHeight;var p=reduce?1:Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.3)));var n=Math.round(p*words.length);words.forEach(function(w,i){w.classList.toggle('on',i<n);});}

  /* ===== root diagram ===== */
  var rd=$('#rd');
  if(rd){
    var D={
      lombar:{n:'Coluna lombar',s:['Trava ao levantar da cadeira','Dor que desce pela perna','Formigamento até o pé','Piora depois de muito tempo sentado'],c:['Hérnia de disco','Nervo ciático comprimido','Desgaste das facetas','Articulação sacroilíaca'],l:[[2,3],[0,1],[0,1],[2,3,0]],t:'<b>Como é tratada:</b> avaliação clínica e leitura dos exames, medicação e fisioterapia orientada e, quando indicado, bloqueios de coluna.',ctx:'dor na coluna lombar',p:'dor-lombar.html',pn:'dor lombar'},
      ombro:{n:'Ombro',s:['Acorda de madrugada com dor','Dói para vestir a camisa','O braço perdeu força','Fica cada vez mais rígido'],c:['Tendinite do manguito rotador','Bursite','Lesão de tendão','Ombro congelado'],l:[[0,1],[0,1],[2],[3]],t:'<b>Como é tratado:</b> exame físico e ultrassom no consultório, infiltração guiada quando indicada e bloqueio de nervo para liberar a reabilitação.',ctx:'dor no ombro',p:'dor-no-ombro.html',pn:'dor no ombro'},
      joelho:{n:'Joelho',s:['Dói para descer escada','Incha depois de caminhar','Rigidez pela manhã','Sensação de falseio'],c:['Artrose','Desgaste da cartilagem','Lesão de menisco','Instabilidade ligamentar'],l:[[0,1],[0,2],[0],[2,3]],t:'<b>Como é tratado:</b> avaliação com ultrassom, infiltração articular quando indicada e protocolo para artrose com fortalecimento.',ctx:'dor no joelho',p:'dor-no-joelho.html',pn:'dor no joelho'},
      cotovelo:{n:'Cotovelo',s:['Dói para segurar a xícara','Dói ao torcer um pano','Fraqueza para apertar a mão'],c:['Cotovelo de tenista','Cotovelo de golfista','Tendinite','Bursite'],l:[[0,2],[0,1],[0,1,2]],t:'<b>Como é tratado:</b> exame físico e ultrassom no consultório, infiltração guiada quando indicada e orientação de carga e fortalecimento.',ctx:'dor no cotovelo',p:'dor-no-cotovelo.html',pn:'dor no cotovelo'}
    };
    var svg=$('#rdsvg'),symsEl=$('#syms'),causesEl=$('#causes'),cur='lombar',active=-1,regs=$$('.reg');
    var render=function(k){
      cur=k;active=-1;var d=D[k];
      regs.forEach(function(r){r.setAttribute('aria-selected',String(r.dataset.r===k));});
      $('#rdreg').textContent=d.n;
      symsEl.innerHTML=d.s.map(function(x,i){return '<button type="button" class="sym" data-i="'+i+'">'+x+'</button>';}).join('');
      causesEl.innerHTML=d.c.map(function(x,i){return '<span class="cause" data-i="'+i+'">'+x+'</span>';}).join('');
      $('#rdtreat').innerHTML=d.t+'<br><a class="rd__more" href="'+d.p+'">Ler tudo sobre '+d.pn+' →</a>';
      $('#rdcta').href=url('Olá! Vim pelo site. Tenho '+d.ctx+' e gostaria de agendar uma avaliação com o Dr. Fernando.');
      $$('.sym',symsEl).forEach(function(b){
        b.addEventListener('mouseenter',function(){focusSym(+b.dataset.i);});
        b.addEventListener('focus',function(){focusSym(+b.dataset.i);});
        b.addEventListener('click',function(){focusSym(+b.dataset.i,true);});
      });
      symsEl.onmouseleave=function(){if(!symsEl.dataset.lock)focusSym(-1);};
      draw(true);
    };
    var draw=function(animate){
      var R=rd.getBoundingClientRect();svg.setAttribute('viewBox','0 0 '+R.width+' '+R.height);
      var d=D[cur],ss=$$('.sym',symsEl),cs=$$('.cause',causesEl),out='';
      d.l.forEach(function(links,i){var a=ss[i].getBoundingClientRect();
        links.forEach(function(j){var b=cs[j].getBoundingClientRect();
          var x1=a.left+a.width/2-R.left,y1=a.bottom-R.top,x2=b.left+b.width/2-R.left,y2=b.top-R.top,my=(y1+y2)/2;
          out+='<path data-s="'+i+'" data-c="'+j+'" d="M'+x1+' '+y1+' C '+x1+' '+(my+20)+', '+x2+' '+(my-20)+', '+x2+' '+y2+'"/>';});});
      svg.innerHTML=out;
      if(animate&&!reduce){$$('path',svg).forEach(function(p,i){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1) '+(i*60)+'ms, opacity .3s';p.style.strokeDashoffset=0;});}
      focusSym(active);
    };
    var focusSym=function(i,lock){
      active=i;symsEl.dataset.lock=lock&&i>=0?'1':'';
      var linked=i>=0?D[cur].l[i]:null;
      $$('.sym',symsEl).forEach(function(s,k){s.classList.toggle('on',k===i);});
      $$('.cause',causesEl).forEach(function(c,k){c.classList.toggle('dim',!!linked&&linked.indexOf(k)<0);});
      $$('path',svg).forEach(function(p){var on=i<0||+p.dataset.s===i;p.classList.toggle('dim',!on);p.classList.toggle('hl',i>=0&&on);});
    };
    regs.forEach(function(r){r.addEventListener('click',function(){render(r.dataset.r);});});
    window.addEventListener('resize',function(){draw(false);});
    render('lombar');
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){draw(false);});
  }

  /* ===== method stem ===== */
  var stem=$('#stem'),fg,SL=0,sts=[];
  if(stem){var ssvg=$('#stemsvg'),bg=$('#stbg');fg=$('#stfg');sts=$$('.st',stem);
    var stemPath=function(){var h=stem.offsetHeight,w=120,c=w/2;ssvg.setAttribute('viewBox','0 0 '+w+' '+h);
      var d='M'+c+' 0';var seg=h/6;for(var i=1;i<=6;i++){var x=c+(i%2?18:-18);d+=' Q '+x+' '+(seg*i-seg/2)+', '+c+' '+(seg*i);}
      bg.setAttribute('d',d);fg.setAttribute('d',d);SL=fg.getTotalLength();fg.style.strokeDasharray=SL;};
    stemPath();window.addEventListener('resize',function(){stemPath();growStem();});}
  function growStem(){if(!stem)return;var r=stem.getBoundingClientRect(),vh=innerHeight;var p=reduce?1:Math.min(1,Math.max(0,(vh*.7-r.top)/r.height));fg.style.strokeDashoffset=SL*(1-p);sts.forEach(function(s){s.classList.toggle('lit',p>=parseFloat(s.dataset.at));});}

  /* ===== depth gauge (condition pages) ===== */
  var gauge=$('.gauge'),gl=[],gs=[],gfill=null;
  if(gauge){gl=$$('li:not(.fill)',gauge);gs=gl.map(function(li){return document.getElementById($('a',li).getAttribute('href').slice(1));});gfill=$('.fill',gauge);}
  function depth(){if(!gauge)return;var idx=0;gs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.6)idx=i;});
    gl.forEach(function(li,i){li.classList.toggle('on',i===idx);li.classList.toggle('past',i<idx);});
    var a=$('a',gl[idx]),first=$('a',gl[0]);if(gfill&&a){gfill.style.height=(a.offsetTop-first.offsetTop)+'px';}
    var lbl=$('#gaugeNow');if(lbl)lbl.textContent=$('b',a).textContent;}

  function onScroll(){light();growStem();depth();}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',depth);onScroll();

  /* ===== self-check ===== */
  var cl=$('#chkList');
  if(cl){var CK=['A dor está aí há mais de 6 semanas','Ela acorda você à noite','Você toma anti-inflamatório quase toda semana','Já parou fisioterapia ou academia por causa da dor','Deixou de fazer algo de que gosta','Ela vai e volta, sempre no mesmo lugar'];
    var cn=$('#chkN'),cm=$('#chkMsg'),cb=$$('#chkBar i'),cc=$('#chkCta');
    cl.innerHTML=CK.map(function(t,i){return '<button type="button" class="ci" aria-pressed="false" data-i="'+i+'"><span class="box"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'+t+'</button>';}).join('');
    var ck=function(){var on=$$('.ci[aria-pressed="true"]',cl),n=on.length;cn.textContent=n;cb.forEach(function(b,i){b.classList.toggle('on',i<n);});
      cm.textContent=n===0?'Marque os sinais ao lado.':n<=2?'Vale observar. Se a dor continuar nas próximas semanas, procure uma avaliação.':'A sua dor está pedindo uma avaliação. Quanto antes a causa aparece, mais simples costuma ser o tratamento.';
      var list=on.map(function(b){return '• '+CK[+b.dataset.i].toLowerCase();}).join('\n');
      cc.href=url('Olá! Vim pelo site. Fiz o teste de sinais e marquei '+n+' de 6'+(n?':\n'+list:'')+'\nGostaria de agendar uma avaliação com o Dr. Fernando.');};
    $$('.ci',cl).forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));ck();});});ck();}

  /* ===== ultrasound simulator ===== */
  var uImg=$('#usImg');
  if(uImg){
    var U={
      ombro:{t:'OMBRO · CORTE LONGITUDINAL',l:[
        {k:'skin',n:'Pele',s:'superfície',h:20,d:'A primeira linha clara da imagem. É onde o transdutor encosta, com gel.'},
        {k:'fat',n:'Subcutâneo',s:'gordura',h:34,d:'Camada de gordura logo abaixo da pele. Aparece com textura escura e irregular.'},
        {k:'mus',n:'Deltoide',s:'músculo',h:56,d:'O músculo que cobre o ombro. As fibras aparecem como linhas finas e paralelas.'},
        {k:'bursa',n:'Bursa subacromial',s:'bursa',h:[8,26],d:'Uma bolsa fina que reduz o atrito. Na bursite, ela enche de líquido e aparece como uma faixa preta.',key:1},
        {k:'ten',n:'Tendão supraespinal',s:'manguito rotador',h:[36,48],d:'O tendão mais atingido na dor do ombro. Quando inflamado, fica mais grosso e escuro.',key:1},
        {k:'bone',n:'Úmero',s:'osso',h:40,d:'O osso reflete todo o som: aparece como uma linha muito branca, com sombra embaixo.'}],flag:['Bursa: onde aparece a bursite','Tendão: onde costuma estar a dor no ombro']},
      joelho:{t:'JOELHO · REGIÃO ACIMA DA PATELA',l:[
        {k:'skin',n:'Pele',s:'superfície',h:20,d:'A primeira linha clara da imagem, onde o transdutor encosta.'},
        {k:'fat',n:'Subcutâneo',s:'gordura',h:32,d:'Camada de gordura sob a pele, com textura escura e irregular.'},
        {k:'ten',n:'Tendão do quadríceps',s:'tendão',h:[36,46],d:'O tendão que liga a coxa à patela. Fica espesso e escuro quando está sobrecarregado.',key:1},
        {k:'bursa',n:'Recesso suprapatelar',s:'espaço articular',h:[8,40],d:'Quando o joelho incha, é aqui que o líquido aparece, como uma área preta.',key:1},
        {k:'cart',n:'Cartilagem',s:'cobertura do osso',h:12,d:'Camada fina e escura sobre o osso. Na artrose, vai ficando mais fina e irregular.'},
        {k:'bone',n:'Fêmur',s:'osso',h:40,d:'A linha branca do osso da coxa, com sombra logo abaixo.'}],flag:['Onde aparece o líquido do joelho inchado','Tendão sobrecarregado']},
      cotovelo:{t:'COTOVELO · FACE LATERAL',l:[
        {k:'skin',n:'Pele',s:'superfície',h:20,d:'A primeira linha clara, onde o transdutor encosta.'},
        {k:'fat',n:'Subcutâneo',s:'gordura',h:26,d:'Camada fina de gordura no cotovelo.'},
        {k:'mus',n:'Extensores',s:'músculos do antebraço',h:44,d:'Os músculos que levantam o punho e os dedos.'},
        {k:'ten',n:'Tendão extensor comum',s:'origem do cotovelo de tenista',h:[34,48],d:'É aqui que nasce o cotovelo de tenista. O tendão fica espesso, escuro e às vezes com pequenas falhas.',key:1},
        {k:'bone',n:'Epicôndilo lateral',s:'osso',h:44,d:'A saliência óssea da parte de fora do cotovelo, onde o tendão se prende.'}],flag:['Origem do cotovelo de tenista','Origem do cotovelo de tenista']}
    };
    var uL=$('#usLbls'),flag=$('#flag'),probe=$('#probe'),pIn=$('#probeIn'),uReg=uImg.dataset.start||'ombro',uMode=0,uSel=-1;
    var uTabs=$$('.usx__tab'),mBtns=$$('.mode button');
    uTabs.forEach(function(x){x.setAttribute('aria-selected',String(x.dataset.u===uReg));});
    var hOf=function(l){return Array.isArray(l.h)?l.h[uMode]:l.h;};
    var placeFlag=function(){var d=U[uReg],keyName=uMode?(uReg==='joelho'||uReg==='ombro'?'bursa':'ten'):'ten';if(uReg==='cotovelo')keyName='ten';
      var idx=d.l.findIndex(function(l){return l.k===keyName;}),el=$$('.ly',uImg)[idx];if(!el)return;
      flag.textContent=uReg==='cotovelo'?d.flag[0]:(keyName==='bursa'?d.flag[0]:d.flag[1]);
      flag.style.top=(el.offsetTop+el.offsetHeight/2)+'px';flag.style.right=(uL.offsetWidth+12)+'px';};
    var uPick=function(i){uSel=i;var l=U[uReg].l[i];
      $$('.ly',uImg).forEach(function(n){n.classList.toggle('sel',+n.dataset.i===i);});
      $$('.lb',uL).forEach(function(n){n.classList.toggle('sel',+n.dataset.i===i);});
      $('#infoK').textContent=(uMode?'Com dor · ':'Saudável · ')+l.s;$('#infoT').textContent=l.n;$('#infoP').textContent=l.d;};
    var uRender=function(){var d=U[uReg];$('#usTitle').textContent=d.t;
      $$('.ly',uImg).forEach(function(n){n.remove();});uL.innerHTML='';
      d.l.forEach(function(l,i){
        var ly=document.createElement('div');ly.className='ly t-'+l.k+(l.k==='bursa'&&uMode?' fluid':'')+(l.k==='ten'&&uMode?' sick':'');ly.style.height=Math.max(hOf(l)*1.7,32)+'px';ly.dataset.i=i;uImg.insertBefore(ly,probe);
        var lb=document.createElement('button');lb.type='button';lb.className='lb'+(l.key?' key':'');lb.style.height=Math.max(hOf(l)*1.7,32)+'px';lb.dataset.i=i;lb.innerHTML='<b>'+l.n+'</b><span>'+l.s+'</span>';lb.setAttribute('aria-label',l.n);if(Math.max(hOf(l)*1.7,32)<46)lb.classList.add('thin');uL.appendChild(lb);
        [ly,lb].forEach(function(el){el.addEventListener('click',function(){uPick(i);});el.addEventListener('mouseenter',function(){uPick(i);});});});
      var keyIdx=(uMode&&uReg!=='cotovelo')?d.l.findIndex(function(l){return l.k==='bursa';}):d.l.findIndex(function(l){return l.k==='ten';});
      uPick(uSel>=0&&uSel<d.l.length?uSel:keyIdx);setTimeout(placeFlag,520);};
    uTabs.forEach(function(t){t.addEventListener('click',function(){uReg=t.dataset.u;uSel=-1;uTabs.forEach(function(x){x.setAttribute('aria-selected',String(x===t));});uRender();});});
    mBtns.forEach(function(b){b.addEventListener('click',function(){uMode=+b.dataset.m;mBtns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});uSel=-1;uRender();});});
    pIn.addEventListener('input',function(){probe.style.left=pIn.value+'%';});
    if(!reduce){var dir=1,auto=setInterval(function(){var v=+pIn.value+dir*.6;if(v>90||v<10)dir*=-1;pIn.value=v;probe.style.left=v+'%';},40);pIn.addEventListener('pointerdown',function(){clearInterval(auto);});}
    window.addEventListener('resize',placeFlag);uRender();
  }

  /* ===== myths ===== */
  var myEl=$('#myths');
  if(myEl){var MY=[
      ['Dor é coisa da idade.','Mito','mito','O desgaste aparece com os anos, mas dor persistente tem causa que dá para investigar e tratar. Idade não é diagnóstico.'],
      ['Repouso total é o melhor remédio para dor nas costas.','Mito','mito','Na maioria das dores lombares, manter-se ativo dentro do que o corpo tolera ajuda a recuperar mais rápido do que ficar parado.'],
      ['Se a ressonância mostra hérnia, a dor vem dela.','Nem sempre','dep','Alterações em exames de imagem são comuns em pessoas sem dor nenhuma. O exame precisa conversar com o que o médico encontra na consulta.'],
      ['Toda hérnia de disco termina em cirurgia.','Mito','mito','A maior parte das hérnias melhora com tratamento sem cirurgia. A cirurgia fica para casos selecionados.'],
      ['Infiltração só alivia por uns dias.','Depende','dep','Com indicação certa e reabilitação junto, ela abre espaço para tratar a causa. Sozinha, sem plano, tende a durar menos.'],
      ['Ultrassom é exame de barriga e gestação.','Mito','mito','No consultório ortopédico, ele mostra tendões, músculos e articulações em movimento, na hora da consulta.']];
    var myBar=$('#myBar'),myN=$('#myN'),rootSvg='<svg viewBox="0 0 90 60" aria-hidden="true"><path d="M45 0 C 44 18, 48 26, 40 40 S 30 56, 20 60"/><path d="M44 20 C 56 24, 64 34, 80 40"/><path d="M42 32 C 34 36, 26 38, 12 36"/></svg>';
    myEl.innerHTML=MY.map(function(m,i){return '<button type="button" class="mc" aria-expanded="false"><span class="mc__top"><span class="mc__idx"><span>Crença 0'+(i+1)+'</span><em>“ ”</em></span><span class="mc__q"><s>'+m[0]+'</s></span></span><span class="mc__soil" aria-hidden="true"></span><span class="mc__root"><span style="display:block;overflow:hidden"><span class="mc__in" style="display:grid"><span class="mc__v v-'+m[2]+'">'+m[1]+'</span><p>'+m[3]+'</p>'+rootSvg+'</span></span></span></button>';}).join('');
    var myCount=function(){var n=$$('.mc[aria-expanded="true"]',myEl).length;myBar.style.width=(n/MY.length*100)+'%';myN.textContent=n+' de '+MY.length+' descobertos';};
    $$('.mc',myEl).forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true'));myCount();});});}

  /* ===== history builder ===== */
  var hsEl=$('#hsSteps');
  if(hsEl){var HQ=[
      {k:'onde',t:'Onde dói?',m:0,o:['Coluna lombar','Pescoço','Ombro','Cotovelo','Joelho','Quadril','Outro lugar']},
      {k:'tempo',t:'Desde quando?',m:0,o:['Menos de 1 mês','1 a 3 meses','3 meses a 1 ano','Mais de 1 ano']},
      {k:'piora',t:'O que piora a dor?',m:1,o:['Ficar muito tempo sentado','Caminhar ou subir escada','Levantar o braço','Carregar peso','Deitar à noite','Treinar']},
      {k:'tentou',t:'O que você já tentou?',m:1,o:['Anti-inflamatório','Fisioterapia','Infiltração','Academia ou alongamento','Repouso','Ainda nada']},
      {k:'exames',t:'Que exames você já tem?',m:1,o:['Raio-X','Ressonância','Ultrassom','Tomografia','Nenhum']}];
    var HS={},fdl=$('#fichaDl'),LBL={onde:'Onde',tempo:'Desde',piora:'Piora com',tentou:'Já tentei',exames:'Exames'};
    hsEl.innerHTML=HQ.map(function(q,i){return '<div class="hq" role="group" aria-labelledby="hq'+i+'"><div class="hq__t" id="hq'+i+'"><span>0'+(i+1)+'</span>'+q.t+(q.m?' <small style="font-weight:400;color:var(--ink-3)">(pode marcar mais de um)</small>':'')+'</div><div class="hq__o">'+q.o.map(function(o){return '<button type="button" class="ho" aria-pressed="false" data-k="'+q.k+'" data-v="'+o+'">'+o+'</button>';}).join('')+'</div></div>';}).join('');
    var ficha=function(){var lines=[];fdl.innerHTML=HQ.map(function(q){var v=HS[q.k]||[];if(v.length)lines.push(LBL[q.k]+': '+v.join(', '));return '<div><dt>'+LBL[q.k]+'</dt><dd'+(v.length?'':' class="empty"')+'>'+(v.length?v.join(', '):'a responder')+'</dd></div>';}).join('');
      var txt='Olá! Vim pelo site e preparei a ficha da minha dor:\n'+(lines.length?lines.join('\n'):'(ainda em branco)')+'\nGostaria de agendar uma consulta com o Dr. Fernando.';$('#fichaSend').href=url(txt);return txt;};
    $$('.ho',hsEl).forEach(function(b){b.addEventListener('click',function(){
      var q=HQ.filter(function(x){return x.k===b.dataset.k;})[0],cur=HS[q.k]||[];
      if(q.m){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));cur=on?cur.concat(b.dataset.v):cur.filter(function(v){return v!==b.dataset.v;});
        if(b.dataset.v==='Ainda nada'||b.dataset.v==='Nenhum'){if(on){cur=[b.dataset.v];$$('.ho[data-k="'+q.k+'"]',hsEl).forEach(function(x){if(x!==b)x.setAttribute('aria-pressed','false');});}}
        else{var none=$('.ho[data-k="'+q.k+'"][data-v="Ainda nada"],.ho[data-k="'+q.k+'"][data-v="Nenhum"]',hsEl);if(none&&on){none.setAttribute('aria-pressed','false');cur=cur.filter(function(v){return v!=='Ainda nada'&&v!=='Nenhum';});}}}
      else{$$('.ho[data-k="'+q.k+'"]',hsEl).forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});cur=[b.dataset.v];}
      HS[q.k]=cur;ficha();});});
    $('#fichaCopy').addEventListener('click',function(){var t=ficha(),btn=this;
      function ok(){btn.textContent='Ficha copiada';setTimeout(function(){btn.textContent='Copiar texto da ficha';},1800);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){btn.textContent='Selecione e copie a ficha ao lado';});}else{btn.textContent='Selecione e copie a ficha ao lado';}});
    ficha();}

  /* ===== map ===== */
  var mapEl=$('#map');
  if(mapEl){var g=$('#mapg'),st={x:0,y:0,k:1},host=location.hostname||'';
    var useGoogle=/github\.io$/.test(host)||(host&&!/claude|anthropic|localhost|127\.0\.0\.1/.test(host)&&location.protocol.indexOf('http')===0);
    if(useGoogle){mapEl.innerHTML='<iframe title="Mapa do Dom Medical Center" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Dom+Medical+Center,+R.+Visconde+de+Guarapuava,+1717+-+Centro,+Cascavel+-+PR&z=17&output=embed"></iframe>';$('.mapc__ui').hidden=true;$('#mapTag').textContent='Google Maps';}
    else{var ap=function(){g.setAttribute('transform','translate('+st.x+' '+st.y+') translate(450 320) scale('+st.k+') translate(-450 -320)');},drag=null;
      mapEl.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,ox:st.x,oy:st.y};mapEl.setPointerCapture(e.pointerId);});
      mapEl.addEventListener('pointermove',function(e){if(!drag)return;var r=mapEl.getBoundingClientRect(),f=900/r.width;st.x=drag.ox+(e.clientX-drag.x)*f;st.y=drag.oy+(e.clientY-drag.y)*f;ap();});
      mapEl.addEventListener('pointerup',function(){drag=null;});
      mapEl.addEventListener('wheel',function(e){e.preventDefault();st.k=Math.min(2.4,Math.max(.6,st.k*(e.deltaY<0?1.12:.9)));ap();},{passive:false});
      $('#zin').addEventListener('click',function(){st.k=Math.min(2.4,st.k*1.2);ap();});
      $('#zout').addEventListener('click',function(){st.k=Math.max(.6,st.k/1.2);ap();});
      $('#zre').addEventListener('click',function(){st={x:0,y:0,k:1};ap();});ap();}}

  /* ===== pre-chat ===== */
  var pre=$('#pre');
  if(pre){var s={reg:pre.dataset.reg||'na coluna lombar',dur:'há alguns meses',eva:'6'},nm=$('#nm'),eva=$('#eva'),evo=$('#evo'),send=$('#send');
    $$('.opt[data-k="reg"]',pre).forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.v===s.reg));});
    var build=function(){var n=nm.value.trim();send.href=url('Olá! '+(n?'Sou '+n+'. ':'')+'Vim pelo site. Tenho dor '+s.reg+' '+s.dur+', nota '+s.eva+' de 10. Gostaria de agendar uma consulta com o Dr. Fernando.');};
    $$('.opt',pre).forEach(function(b){b.addEventListener('click',function(){s[b.dataset.k]=b.dataset.v;$$('.opt[data-k="'+b.dataset.k+'"]',pre).forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});build();});});
    eva.addEventListener('input',function(){s.eva=eva.value;evo.textContent=eva.value;build();});
    nm.addEventListener('input',build);pre.addEventListener('submit',function(e){e.preventDefault();});build();}

  /* ===== treatments filter ===== */
  var tf=$('#tfilter');
  if(tf){var bs=$$('button',tf),cards=$$('.fold[data-regs]'),out=$('output',tf);
    var apply=function(k){bs.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===k));});var n=0;
      cards.forEach(function(c){var on=k==='todas'||c.dataset.regs.split(' ').indexOf(k)>=0;c.classList.toggle('hide',!on);if(on)n++;});
      out.textContent=n+(n===1?' tratamento':' tratamentos');};
    bs.forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.f);});});apply('todas');}

  /* ===== growth rings ===== */
  var rings=$('#rings');
  if(rings){var RG=JSON.parse($('#ringsData').textContent),rs=$$('.ring',rings),rb=$$('.rings__step button'),card=$('#ringCard');
    var pick=function(i){rs.forEach(function(r,k){r.classList.toggle('on',k===i);});rb.forEach(function(b,k){b.setAttribute('aria-pressed',String(k===i));});
      var d=RG[i];card.innerHTML='<small>Ciclo '+(i+1)+' de '+RG.length+' · '+d.k+'</small><b>'+d.t+'</b><p>'+d.p+'</p>'+(d.todo?'<span class="todo">'+d.todo+'</span>':'');};
    rs.forEach(function(r,i){r.addEventListener('click',function(){pick(i);});r.addEventListener('mouseenter',function(){pick(i);});});
    rb.forEach(function(b,i){b.addEventListener('click',function(){pick(i);});});pick(RG.length-1);}

  /* ===== elevator ===== */
  var lift=$('#lift');
  if(lift){var LF=JSON.parse($('#liftData').textContent),lb=$$('.lift__panel button',lift),img=$('#liftImg'),cap=$('#liftCap'),disp=$('#liftN'),info=$('#liftInfo'),cur=0,timer=null;
    var go=function(i){lb.forEach(function(b,k){b.setAttribute('aria-pressed',String(k===i));});var d=LF[i];
      clearInterval(timer);var from=parseInt(disp.textContent,10),to=parseInt(d.f,10);if(reduce||isNaN(to)||String(to)!==String(d.f)||to>20){disp.textContent=d.f;}else{if(isNaN(from))from=0;var step=from<to?1:-1;if(from===to){disp.textContent=to;}else{timer=setInterval(function(){from+=step;disp.textContent=from;if(from===to)clearInterval(timer);},110);}}
      info.innerHTML='<small>Passo '+(i+1)+' de '+LF.length+'</small><b>'+d.t+'</b><p>'+d.p+'</p>';
      if(img.getAttribute('src')!==d.img){img.style.opacity=0;setTimeout(function(){img.src=d.img;img.alt=d.alt;img.style.opacity=1;},220);}cap.textContent=d.cap;};
    lb.forEach(function(b,i){b.addEventListener('click',function(){go(i);});});go(0);}

  /* ===== what to bring checklist ===== */
  var bag=$('#bag');
  if(bag){var bi=$$('.ci',bag),bb=$('#bagBar'),bn=$('#bagN');
    var upd=function(){var n=$$('.ci[aria-pressed="true"]',bag).length;bb.style.width=(n/bi.length*100)+'%';bn.textContent=n+' de '+bi.length+' prontos';};
    bi.forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));upd();});});upd();}

  /* ===== hero roots: from the word "raiz" down to each region ===== */
  var hz=$('#hz'),hzs=$('#hzRoots'),rw=$('#raizWord');
  function heroRoots(){if(!hz||!hzs||!rw)return;var terms=$$('.term__node',hz);
    if(innerWidth<981||!terms.length){hzs.innerHTML='';return;}
    var R=hz.getBoundingClientRect(),w=rw.getBoundingClientRect();hzs.setAttribute('viewBox','0 0 '+R.width+' '+R.height);
    var lead=$('.hero2__grid > div',hz),col=$('.col',hz),gr=$('.ground2',hz);
    var lr=lead.getBoundingClientRect(),cr=col.getBoundingClientRect(),g=gr.getBoundingClientRect();
    var textR=Math.max(w.right,$('.hero2__lead',hz).getBoundingClientRect().right,$('.hero2__meta',hz).getBoundingClientRect().right);
    var gx=(Math.min(textR+24,cr.left-80)+cr.left-70)/2-R.left;gx=Math.max(gx,w.right-R.left+30);
    var sx=w.right-R.left-w.width*.06,sy=w.bottom-R.top-w.height*.22,gy=g.top-R.top;
    var out='',n=terms.length;terms.forEach(function(t,i){var b=t.getBoundingClientRect();var ex=b.left+b.width/2-R.left,ey=b.top+b.height/2-R.top;
      var off=(i-(n-1)/2)*7,x0=gx+off;
      out+='<path d="M'+sx.toFixed(1)+' '+sy.toFixed(1)+' C '+(sx+40).toFixed(1)+' '+(sy+20).toFixed(1)+', '+x0.toFixed(1)+' '+(sy+30).toFixed(1)+', '+x0.toFixed(1)+' '+(sy+120).toFixed(1)+' L '+x0.toFixed(1)+' '+(gy-60).toFixed(1)+' C '+x0.toFixed(1)+' '+(gy+20).toFixed(1)+', '+ex.toFixed(1)+' '+(ey-70).toFixed(1)+', '+ex.toFixed(1)+' '+ey.toFixed(1)+'"/>';});
    hzs.innerHTML=out;
    if(!reduce&&!hzs.dataset.done){hzs.dataset.done=1;$$('path',hzs).forEach(function(p,i){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 2.2s cubic-bezier(.2,.8,.2,1) '+(600+i*180)+'ms';p.style.strokeDashoffset=0;});}}
  heroRoots();window.addEventListener('resize',heroRoots);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(heroRoots);window.addEventListener('load',heroRoots);

  /* ===== personas: side list with sliding indicator ===== */
  var pz=$('#pz');
  if(pz){var PZ=JSON.parse($('#pzData').textContent),its=$$('.pz__it',pz),ind=$('.pz__ind',pz),pi=0,pt=null;
    var pzGo=function(i,user){pi=i;its.forEach(function(b,k){b.setAttribute('aria-selected',String(k===i));});var b=its[i];ind.style.top=b.offsetTop+'px';ind.style.height=b.offsetHeight+'px';
      var d=PZ[i];$('#pzQ').textContent=d.q;$('#pzOn').textContent=d.on;$('#pzWr').textContent=d.wr;$('#pzTr').textContent=d.tr;var c=$('#pzCta');c.textContent=d.cta+' →';c.href=url(d.msg);
      clearTimeout(pt);if(!reduce&&!user)pt=setTimeout(function(){pzGo((pi+1)%PZ.length);},7000);};
    its.forEach(function(b,i){b.addEventListener('click',function(){pzGo(i,true);});});
    pz.addEventListener('mouseenter',function(){clearTimeout(pt);pz.classList.add('paused');});
    pz.addEventListener('mouseleave',function(){pz.classList.remove('paused');pzGo(pi);});
    window.addEventListener('resize',function(){var b=its[pi];ind.style.top=b.offsetTop+'px';ind.style.height=b.offsetHeight+'px';});
    pzGo(0);}

  /* ===== symptoms -> appointment card ===== */
  var symc=$('#symc');
  if(symc){var tk=$('#tkt'),ctx=tk?tk.dataset.ctx:'dor';
    var symUp=function(){var on=$$('button[aria-pressed="true"]',symc),n=on.length;$('#symN').textContent=n;
      var tn=$('#tktN');if(tn)tn.textContent=n?n+(n>1?' marcados':' marcado'):'nenhum marcado';
      var list=on.map(function(b){return '• '+b.dataset.s;}).join('\n');
      var m='Olá! Vim pelo site. Tenho '+ctx+(n?' e marquei estes sintomas:\n'+list+'\n':' ')+'Gostaria de agendar uma avaliação com o Dr. Fernando.';
      var tb=$('#tktBtn');if(tb)tb.href=url(m);};
    $$('button',symc).forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));symUp();});});symUp();}

  /* ===== reveal helpers ===== */
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.4});$$('.hand,.mark').forEach(function(el){io.observe(el);});}
  else{$$('.hand,.mark').forEach(function(el){el.classList.add('in');});}

  /* ===== cross-page anchors: land below the sticky header after layout settles ===== */
  if(location.hash&&location.hash.length>1){var tgt=document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(tgt){var jump=function(){tgt.scrollIntoView({block:'start'});};setTimeout(jump,60);window.addEventListener('load',function(){setTimeout(jump,120);});if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setTimeout(jump,30);});}}
})();
