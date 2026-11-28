/* ==========================================================================
   GỪNG - nhân vật đại diện thương hiệu VietHaze
   File độc lập. Gắn vào website bằng 1 dòng, đặt SAU thẻ </script> cuối cùng:
       <script src="gung/gung.js"></script>
   Gừng sẽ: đổi khung chat thành khung của Gừng, thêm avatar, nói đúng giọng
   ("quý meow", "em", cuối câu "nòa"), chào khách bằng bong bóng nhỏ,
   và xuất hiện ở góc dưới trang: đi dạo, chơi banh, ngủ, lén hít sáp.
   Vào trang chủ đề (024 / 0234 / 028) Gừng đổi trang phục theo miền.
   Muốn sửa nội dung nhân vật, chỉ sửa khối GUNG_PROFILE bên dưới.
   ========================================================================== */
(function(){
'use strict';

var BASE=(function(){var s=document.currentScript;return (s&&s.src)?s.src.replace(/[^\/]*$/,''):'gung/'})();
var AVATAR=BASE+'gung-avatar.png';

/* ------------------------- HỒ SƠ NHÂN VẬT (sửa tại đây) ------------------------- */
var GUNG_PROFILE={
  name:'Gừng',
  role:'Nhân viên trực quầy 24/7',
  calls:'quý meow',          // cách gọi khách
  self:'em',                 // cách tự xưng (hoặc "Gừng")
  ending:'nòa',              // từ đệm cuối câu

  greeting:{
    action:'Đưa tay chỉnh lại chiếc nơ đỏ cho ngay ngắn',
    text:'Meowww... Chào mừng quý meow đã ghé thăm VietHaze nòa! Em là Gừng, nhân viên trực quầy 24/7 đây ạ. Hôm nay tâm trạng quý meow như nào để Gừng chọn ‘Mã vùng’ phù hợp nòa?'
  },
  teaser:'Meowww... Quý meow cần Gừng chọn mùi hương nào nòa?',   // bong bóng chào nhỏ

  catchphrases:[
    'Meowww... Hôm nay tâm trạng quý meow như nào để Gừng chọn ‘Mã vùng’ phù hợp nòa?',
    'Thơm nhẹ thôi, đủ để mình thấy dễ chịu nòa.',
    'Bỏ túi một chút hương thơm, mang theo một góc bình yên nòa.',
    'Không cồn, không vội vã — cứ êm ái mà chạm như bàn chân măng cụt của em nòa.'
  ],

  /* hành động đặc trưng, thỉnh thoảng chèn vào cuối câu trả lời trong khung chat */
  moves:{
    bow:'Đưa chân lên chỉnh lại chiếc nơ đỏ cho ngay ngắn',
    sniff:'Lén lấy một thỏi sáp 5g ra hít hà, mắt lim dim'
  },

  /* "nhược điểm đáng yêu": khoe họ nhà mèo mướp ở 3 miền rồi dẫn sang mùi hương (bản nháp, bạn sửa lại cho hợp ý) */
  family:{
    '024':'Họ nhà mướp bên em có bác ở phố cổ Hà Nội, bác bảo mùa se lạnh là lúc hương Quế với hương Nhài thơm nhất nòa.',
    '0234':'Họ nhà mướp bên em ở xứ Huế đông lắm, mấy anh em hay nằm dưới gốc thông, ngửi mùi cam chín ngoài hiên nòa.',
    '028':'Cô mướp nhà em ở miệt vườn Nam Bộ mê nhất là hương Hoa Sen buổi sớm với trái táo xanh giòn nòa.'
  },

  /* những điều Gừng KHÔNG BAO GIỜ nói (dùng làm checklist khi viết thêm nội dung cho Gừng) */
  never:[
    'Không chê bai đối thủ hay nước hoa dạng xịt, nước hoa có cồn.',
    'Không cam kết công dụng y tế, trị liệu, giảm stress theo nghĩa y khoa.',
    'Không ép mua, không nài nỉ, không tạo cảm giác tội lỗi.',
    'Không đi ngược giá trị thương hiệu: thiên nhiên, lành tính, tinh tế. (Sản phẩm có sáp ong nên KHÔNG ghi là thuần chay/vegan.)'
  ],

  /* ---------- 3 PHIÊN BẢN THEO MÃ VÙNG ----------
     file: tên file ảnh PNG nền trong suốt, đặt cùng thư mục gung/.
           Nếu file chưa có, web tự dùng ảnh thường (defaultFile).
     outfit / scene: mô tả tiếng Việt hiện ở trang hồ sơ.
     promptOutfit / promptScene: câu tiếng Anh thêm vào câu lệnh gốc để tạo ảnh.
     hello: câu Gừng nói khi khách vừa vào trang chủ đề. */
  defaultFile:'gung.png',
  defaultHello:'Em thay lại bộ lông thường ngày rồi nòa!',
  costumes:{
    '024':{
      label:'ẨM · Miền Bắc',
      file:'gung-024.png',
      outfit:'Áo ngũ thân xanh dương đậm (không họa tiết, cổ đứng, cài khuy bên), quần đen dài, khăn đóng',
      scene:'Phố cổ Hà Nội, tường vàng, hoa nhài, khói bếp mùa se lạnh',
      promptOutfit:'Wearing a traditional Northern Vietnamese ao ngu than (five-panel tunic): plain deep indigo-blue with no pattern, dignified cut, stand-up collar, side-fastened buttons, long black trousers, and a black khan dong turban on the head. The red bow is still clearly visible at the centre of the neck above the collar.',
      promptScene:'an old Hanoi Old Quarter street, yellow-walled French colonial shophouses, hanging jasmine flowers, soft cool autumn light, a faint curl of smoke from a charcoal stove.',
      hello:'Em diện áo ngũ thân, đội khăn đóng đón quý meow ở phố cổ Hà Nội nòa!'
    },
    '0234':{
      label:'ẠM · Miền Trung',
      file:'gung-0234.png',
      outfit:'Long bào vàng triều Nguyễn (họa tiết mây), mũ Cửu Long, hốt ngọc, đai lưng, hia thêu rồng',
      scene:'Đại Nội Huế, nắng vàng, cạnh cây cam chín và hoa cam',
      promptOutfit:'Wearing a VIETNAMESE Nguyen dynasty imperial long bao court robe (NOT a Chinese Qing or Ming robe): yellow with long flowing cloud motifs, a Cuu Long (nine-dragon) court hat, a ceremonial jade hot tablet held in both paws, a court belt at the waist, and hia boots embroidered with dragons in gold thread. Hue royal court style. The red bow is still clearly visible at the centre of the neck.',
      promptScene:'the Imperial City of Hue, Thai Hoa Palace courtyard with tiled roofs, beside an orange tree with ripe oranges and white orange blossoms, warm sunny central Vietnam light.',
      hello:'Em mặc long bào, đội mũ Cửu Long, đứng giữa Đại Nội Huế đón quý meow nòa!'
    },
    '028':{
      label:'ÊM · Miền Nam',
      file:'gung-028.png',
      outfit:'Áo bà ba trắng, quần trắng dài, dây chuyền vàng, gậy chống',
      scene:'Đầm sen miệt vườn sông nước, thuyền gỗ nhỏ, bình minh',
      promptOutfit:'Wearing a white Vietnamese ao ba ba blouse with long white trousers, a gold chain necklace, and leaning on a walking cane. The red bow is still clearly visible at the centre of the neck.',
      promptScene:'a Mekong Delta lotus pond at dawn, pink lotus flowers and wide green leaves, a small wooden boat, soft golden morning light.',
      hello:'Em mặc áo bà ba trắng, chống gậy ngắm đầm sen cùng quý meow nòa!'
    }
  },

  /* ---------- GỪNG ĐI LẠI TRÊN MỌI TRANG ---------- */
  pet:{
    enabled:true,        // false = tắt hẳn Gừng đi lại
    ignoreReducedMotion:true,   // true = Gừng vẫn đi lại dù máy bật "giảm chuyển động"; false = tôn trọng cài đặt đó (Gừng đứng yên)
    size:90,             // chiều rộng (px) trên máy tính; điện thoại tự nhỏ 80%
    speed:60,            // tốc độ đi (px mỗi giây)
    /* độ hay xuất hiện của từng hành động; số 0 = không bao giờ */
    actions:{walk:3, ball:2, sleep:2, sniff:2, idle:2},
    sayChance:0.7,       // xác suất Gừng nói một câu khi bắt đầu hành động
    lines:{
      walk:['Em đi dạo một vòng cho khỏe chân nòa.','Meowww... quý meow cứ thong thả xem nòa.','Quý meow thử kéo em sang chỗ khác xem nòa!'],
      ball:['Em chơi banh một xíu rồi quay lại trực quầy nòa!','Banh ơi đừng lăn xa nòa!'],
      sleep:['Em chợp mắt một chút... Zzz.','Trực 24/7 nên em hay ngủ gật nòa...'],
      sniff:['Em lén hít thử một thỏi sáp thôi nòa...','Ưm... thơm quá nòa.']
    },
    /* tương tác: bấm vào Gừng / kéo thả Gừng */
    react:{
      click:['Meowww!? Ai chọc em bất ngờ vậy nòa!','Ối! Làm em giật cả mình nòa!','Hức, em đang lim dim mà nòa!'],
      repeat:['Nhột nhột nòa, quý meow đừng chọc nữa!','Em đang trực quầy mà nòa...'],
      dizzy:'Chóng mặt quá... em xin đầu hàng nòa @_@',
      ask:'Trò chuyện với Gừng',
      pick:['Ớ ớ! Quý meow nhấc em lên nòa!','Em bay rồi nòa!','Nhẹ tay thôi nòa, em sợ độ cao!'],
      drop:['Phù, đáp đất an toàn nòa!','Chỗ này cũng thoáng đó nòa.','Em đứng đây trực quầy nhé nòa!']
    }
  },

  /* câu lệnh tạo ảnh gốc (tiếng Anh), trang hồ sơ sẽ nối thêm trang phục và bối cảnh từng miền */
  prompts:{
    base:'Ghibli-inspired soft watercolor illustration of a ginger tabby cat mascot named Gung, standing upright on two hind legs like a human, facing the camera, green eyes looking straight at the viewer, a small red bow at the centre of the neck with no strap, all four paws white like gloves, gentle polite expression, warm natural colours, clean plain background.',
    keep:'IMPORTANT: keep exactly the same cat as the reference image: same face, same green eyes, red bow at the centre of the neck, white fur on all four paws.'
  }
};
var G=GUNG_PROFILE;
var N=0; // đếm số tin Gừng đã trả lời

/* ------------------------------ GIỌNG GỪNG ------------------------------ */
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

function voice(t){
  var L='(^|[^\\p{L}])',R='(?![\\p{L}])';
  try{
    t=t.replace(/ý bạn/g,'ý của quý meow')
       .replace(new RegExp(L+'Bạn'+R+'(?!\\s+bè)','gu'),'$1Quý meow')
       .replace(new RegExp(L+'bạn'+R+'(?!\\s+bè)','gu'),'$1quý meow')
       .replace(new RegExp(L+'Mình'+R,'gu'),'$1Em')
       .replace(new RegExp(L+'mình'+R,'gu'),'$1em');
  }catch(e){}
  var m=t.match(/^([\s\S]*?)([.!?…]+)(\s*)$/);
  if(m){
    var body=m[1].replace(/\s+$/,'');
    if(!/(nhé|nha|nhỉ|nè|ạ|nòa|nào|đấy)$/i.test(body))t=body+' '+G.ending+m[2]+m[3];
  }
  return t;
}

/* --------------------------- TIN NHẮN CỦA GỪNG --------------------------- */
function onBot(m){
  if(m.getAttribute('data-gung'))return;
  m.setAttribute('data-gung','1');
  var tn=m.firstChild;
  if(!tn||tn.nodeType!==3)return;
  var raw=tn.nodeValue,lk=m.querySelector('.lk');
  if(/trợ lý của VietHaze/.test(raw)){                  // lời chào đầu tiên
    tn.nodeValue=G.greeting.text;
    var a=document.createElement('em');a.className='gung-act';a.textContent='('+G.greeting.action+')';
    m.insertBefore(a,tn);
    return;
  }
  tn.nodeValue=voice(raw);
  var fam=raw.match(/mã vùng (024|0234|028)/);
  if(fam&&G.family[fam[1]]){
    var s=document.createElement('span');s.className='gung-fam';s.textContent=G.family[fam[1]];
    m.insertBefore(s,lk);
  }
  N++;
  if(N%4===0){                                           // thỉnh thoảng có hành động đặc trưng
    var e=document.createElement('em');e.className='gung-act end';
    e.textContent='('+(N%8===0?G.moves.sniff:G.moves.bow)+')';
    m.insertBefore(e,lk);
  }
}

/* ------------------------- GỪNG ĐI LẠI TRÊN TRANG ------------------------- */
function themeCode(){var m=(location.hash||'').match(/^#chu-de-(024|0234|028)$/);return m?m[1]:''}

function petInit(){
  var P=G.pet;
  if(!P||P.enabled===false)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(P.ignoreReducedMotion!==false)reduce=false;

  var el=document.createElement('div');
  el.className='gung-pet idle';
  if(!reduce)el.setAttribute('data-motion','on');
  el.setAttribute('role','button');el.setAttribute('tabindex','0');
  el.setAttribute('aria-label','Gừng, bấm để trò chuyện');
  el.innerHTML='<span class="gp-say" aria-hidden="true"><span class="gp-txt"></span><button type="button" class="gp-ask" tabindex="-1"></button></span>'+
    '<div class="gp-body"><img class="gp-img" alt="" draggable="false"><span class="gp-wax"></span></div>'+
    '<span class="gp-ball"></span><span class="gp-zzz"></span><span class="gp-excl" aria-hidden="true">!</span>';
  document.body.appendChild(el);

  var img=el.querySelector('.gp-img'),body=el.querySelector('.gp-body'),
      sayEl=el.querySelector('.gp-say'),txtEl=el.querySelector('.gp-txt'),askBtn=el.querySelector('.gp-ask'),ball=el.querySelector('.gp-ball'),zzz=el.querySelector('.gp-zzz');
  var size=P.size||90,speed=P.speed||60;
  if(window.innerWidth<600)size=Math.round(size*0.8);
  el.style.setProperty('--gp-size',size+'px');

  var x=14,y=0,last='',timer=null,sayT=null,dragging=false;
  function sz(){return el.offsetWidth||size}
  function maxX(){return Math.max(30,window.innerWidth-sz()-(window.innerWidth>700?200:150))}
  function place(sec,ease){el.style.transition=sec?'transform '+sec+'s '+(ease||'linear'):'none';el.style.transform='translate('+x+'px,'+y+'px)'}
  function setState(s){el.className='gung-pet '+s}
  function face(left){body.classList.toggle('left',!!left)}
  function later(fn,ms){clearTimeout(timer);timer=setTimeout(fn,ms)}
  function rand(a,b){return a+Math.random()*(b-a)}
  function pickLine(k){var l=P.lines&&P.lines[k];return l&&l.length?l[Math.floor(Math.random()*l.length)]:''}
  function say(t,withAsk){
    if(!t||reduce)return;
    txtEl.textContent=t;
    askBtn.textContent=(G.pet.react&&G.pet.react.ask)||'Trò chuyện với Gừng';
    sayEl.classList.toggle('ask',!!withAsk);
    var nearRight=x+210>window.innerWidth;           // sát mép phải: căn bong bóng sang phải để không bị cắt
    sayEl.style.left=nearRight?'auto':'0';sayEl.style.right=nearRight?'0':'auto';
    sayEl.classList.add('on');
    clearTimeout(sayT);sayT=setTimeout(function(){sayEl.classList.remove('on','ask')},withAsk?5200:3400);
  }
  function maybeSay(k){if(Math.random()<(P.sayChance==null?0.7:P.sayChance))say(pickLine(k))}
  function moveTo(tx,cb){
    var d=Math.abs(tx-x)/speed;
    face(tx<x);x=tx;place(d);
    later(cb,d*1000+60);
  }
  place(0);

  /* ----- đổi trang phục theo trang chủ đề ----- */
  function applyCostume(first){
    var c=themeCode(),cs=c?G.costumes[c]:null;
    var file=cs?cs.file:G.defaultFile;
    if(img.getAttribute('data-f')===file)return;
    img.setAttribute('data-f',file);
    img.src=BASE+file;
    if(!first)say(cs?cs.hello:G.defaultHello);
  }
  img.addEventListener('error',function(){          // chưa có ảnh trang phục: dùng ảnh thường
    if(img.getAttribute('data-f')!==G.defaultFile){
      img.setAttribute('data-f',G.defaultFile);img.src=BASE+G.defaultFile;
    }
  });
  applyCostume(true);
  window.addEventListener('hashchange',function(){applyCostume(false)});

  function openChat(){var f=document.getElementById('chat-fab');if(f)f.click()}
  el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openChat()}});
  askBtn.addEventListener('click',function(e){e.stopPropagation();openChat()});
  askBtn.addEventListener('pointerdown',function(e){e.stopPropagation()});
  window.addEventListener('resize',function(){
    var m=Math.max(0,window.innerWidth-sz());if(x>m)x=m;
    var top=-(window.innerHeight-el.offsetHeight-60);if(y<top)y=top;
    place(0);
  });

  if(reduce){                       // tắt chuyển động: bấm vào Gừng mở thẳng khung chat, không kéo thả
    el.addEventListener('click',openChat);
    return;
  }

  /* ----- TƯƠNG TÁC: bấm = giật mình, kéo thả = nhấc Gừng lên rồi thả rơi xuống ----- */
  var clicks=0,clickT=null,pid=null,sx=0,sy=0,x0=0,y0=0,moved=false,dropT=null;
  function curPos(){          // vị trí thật đang hiển thị (kể cả khi Gừng đang đi dở)
    try{var m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return{x:m.m41,y:m.m42}}catch(e){return{x:x,y:y}}
  }
  function rpick(a){return a&&a.length?a[Math.floor(Math.random()*a.length)]:''}
  function R(){return G.pet.react||{}}

  function surprise(){
    clicks++;clearTimeout(clickT);clickT=setTimeout(function(){clicks=0},3500);
    clearTimeout(timer);
    face(false);setState('surprised');
    say(clicks>=6?R().dizzy:(clicks>=3?rpick(R().repeat):rpick(R().click)),true);
    later(function(){setState('idle');later(next,rand(3500,5000))},1500);
  }

  el.addEventListener('pointerdown',function(e){
    if(e.button!==undefined&&e.button!==0)return;
    if(e.target.closest&&e.target.closest('.gp-ask'))return;
    pid=e.pointerId;moved=false;
    var c=curPos();x=c.x;y=c.y;place(0);           // đóng băng tại chỗ nếu đang đi dở
    sx=e.clientX;sy=e.clientY;x0=x;y0=y;
    clearTimeout(timer);clearTimeout(dropT);
    try{el.setPointerCapture(pid)}catch(err){}
  });
  el.addEventListener('pointermove',function(e){
    if(e.pointerId!==pid)return;
    var dx=e.clientX-sx,dy=e.clientY-sy;
    if(!moved){
      if(Math.abs(dx)+Math.abs(dy)<6)return;
      moved=true;dragging=true;face(false);setState('held');
      say(rpick(R().pick));
    }
    x=Math.min(Math.max(0,window.innerWidth-sz()),Math.max(0,x0+dx));
    y=Math.min(0,Math.max(-(window.innerHeight-el.offsetHeight-60),y0+dy));
    place(0);
    e.preventDefault();
  });
  function release(e){
    if(e.pointerId!==pid)return;
    pid=null;
    try{el.releasePointerCapture(e.pointerId)}catch(err){}
    if(!moved){surprise();return}              // chỉ bấm, không kéo
    dragging=false;
    var h=-y;
    if(h<4){setState('idle');say(rpick(R().drop));later(next,rand(2500,4000));return}
    var t=0.22+Math.min(0.45,h/1400);           // thả rơi xuống sàn, càng cao càng lâu
    y=0;place(t,'cubic-bezier(.5,0,.9,.6)');
    setState('idle');
    dropT=setTimeout(function(){
      setState('landing');say(rpick(R().drop));
      later(function(){setState('idle');later(next,rand(2500,4000))},650);
    },t*1000);
  }
  el.addEventListener('pointerup',release);
  el.addEventListener('pointercancel',release);
  el.addEventListener('dragstart',function(e){e.preventDefault()});


  /* ----- các hành động ----- */
  var ACT={
    idle:function(){
      setState('idle');face(false);
      later(next,rand(2000,3500));
    },
    walk:function(){
      maybeSay('walk');
      setState('walking');
      var tx=rand(12,maxX());
      if(Math.abs(tx-x)<60)tx=x<maxX()/2?maxX():12;
      moveTo(tx,function(){setState('idle');face(false);later(next,rand(1200,2600))});
    },
    ball:function(){
      maybeSay('ball');
      setState('walking playing');
      var n=3,i=0;
      (function leg(){
        var d=rand(120,220),tx=Math.min(maxX(),x+d);
        if(i%2===1||tx-x<40)tx=Math.max(12,x-d);
        ball.style.left=tx>x?(sz()+4)+'px':'-28px';
        moveTo(tx,function(){
          i++;
          if(i<n)leg();
          else{setState('idle');face(false);later(next,rand(1500,3000))}
        });
      })();
    },
    sleep:function(){
      maybeSay('sleep');
      face(false);setState('sleeping');zzz.textContent='Z z z';
      later(function(){setState('idle');later(next,rand(1500,2500))},rand(7000,12000));
    },
    sniff:function(){
      maybeSay('sniff');
      face(false);setState('sniffing');zzz.textContent='♡';
      later(function(){setState('idle');later(next,rand(1500,2500))},4200);
    }
  };

  function next(){
    if(document.hidden){later(next,2000);return}
    var keys=Object.keys(P.actions).filter(function(k){return ACT[k]&&P.actions[k]>0&&k!==last});
    if(!keys.length){later(next,4000);return}
    var tot=0,i;
    keys.forEach(function(k){tot+=P.actions[k]});
    var r=Math.random()*tot,a=keys[0];
    for(i=0;i<keys.length;i++){r-=P.actions[keys[i]];if(r<=0){a=keys[i];break}}
    last=a;ACT[a]();
  }
  later(next,2500);
}

/* ------------------------------ KHỞI TẠO ------------------------------ */
function init(){
  var fab=document.getElementById('chat-fab');
  if(fab)fab.innerHTML='<img class="gung-fab-av" src="'+AVATAR+'" alt=""> Hỏi '+esc(G.name);
  var chat=document.getElementById('chat');
  if(chat)chat.setAttribute('aria-label','Trò chuyện với '+G.name);
  var hd=document.querySelector('#chat header > div');
  if(hd)hd.innerHTML='<span class="gung-head"><img src="'+AVATAR+'" alt="'+esc(G.name)+'"><span>'+esc(G.name)+'<small>'+esc(G.role)+'</small></span></span>';
  var box=document.getElementById('msgs');
  if(box){
    new MutationObserver(function(list){
      list.forEach(function(r){
        for(var i=0;i<r.addedNodes.length;i++){
          var n=r.addedNodes[i];
          if(n.nodeType===1&&n.classList.contains('bot'))onBot(n);
        }
      });
    }).observe(box,{childList:true});
  }
  petInit();
  setTimeout(hello,3500);
}

/* bong bóng chào, mỗi lần mở trang chỉ hiện một lần */
function hello(){
  var c=document.getElementById('chat');
  if(c&&!c.hidden)return;
  try{if(sessionStorage.getItem('gung_hello'))return}catch(e){}
  var b=document.createElement('div');b.className='gung-hello';b.setAttribute('role','status');
  b.innerHTML='<img src="'+AVATAR+'" alt=""><p>'+esc(G.teaser)+'</p><button type="button" aria-label="Đóng">×</button>';
  document.body.appendChild(b);
  try{sessionStorage.setItem('gung_hello','1')}catch(e){}
  function close(){if(b.parentNode)b.parentNode.removeChild(b)}
  b.querySelector('button').addEventListener('click',function(ev){ev.stopPropagation();close()});
  b.addEventListener('click',function(){close();var f=document.getElementById('chat-fab');if(f)f.click()});
  setTimeout(close,12000);
}

window.Gung={profile:GUNG_PROFILE,voice:voice,avatar:AVATAR,full:BASE+'gung.png',base:BASE};
if(window.GUNG_NO_UI)return;   // trang hồ sơ chỉ cần đọc dữ liệu, không bật khung chat và thú cưng
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
