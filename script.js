// efek mengetik
var words=["Javanese","Web Developer","Programmer","Networking","IT Support & Educator"],wi=0,ci=0,del=false,tw=document.getElementById("tw");
var still=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function type(){
  var w=words[wi];
  if(still){tw.textContent=words[words.length-1];return}
  if(!del){ci++;tw.textContent=w.slice(0,ci);if(ci===w.length){del=true;return setTimeout(type,1700)}}
  else{ci--;tw.textContent=w.slice(0,ci);if(ci===0){del=false;wi=(wi+1)%words.length}}
  setTimeout(type,del?40:80);
}
type();
// progress bar + menu aktif
var bar=document.getElementById("bar"),links=[].slice.call(document.querySelectorAll("nav a")),secs=links.map(function(a){return document.querySelector(a.getAttribute("href"))});
var hd=document.querySelector("header"),vis=document.querySelector(".visual"),ticking=false;
var heroTxt=document.querySelector(".hero>div:first-child"),tl=document.querySelector(".tl"),tlis=[].slice.call(document.querySelectorAll(".tl>li")),hot=null,touchy=matchMedia("(hover:none)").matches,lastY=0,lastCur=-2;
var totop=document.createElement("button");
totop.className="totop";totop.setAttribute("aria-label","Kembali ke atas");
totop.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="trk" cx="24" cy="24" r="21"/><circle class="fil" cx="24" cy="24" r="21" pathLength="1"/></svg><span>\u2191</span>';
document.body.appendChild(totop);
var fil=totop.querySelector(".fil");
totop.addEventListener("click",function(){scrollTo({top:0,behavior:still?"auto":"smooth"})});
function update(){
  ticking=false;
  var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
  bar.style.transform="scaleX("+(max>0?Math.min(1,h.scrollTop/max):0)+")";
  hd.classList.toggle("sc",h.scrollTop>20);
  var y=h.scrollTop,pr=max>0?Math.min(1,y/max):0;
  if(touchy){var dy=y-lastY;if(y>120&&dy>6)hd.classList.add("hid");else if(dy<-6||y<=120)hd.classList.remove("hid");lastY=y}
  fil.style.strokeDashoffset=(1-pr).toFixed(3);
  totop.classList.toggle("show",y>500);
  if(!still){var hp=Math.min(1,y/520);heroTxt.style.opacity=(1-hp*.85).toFixed(3);heroTxt.style.transform="translate3d(0,"+(-hp*36).toFixed(1)+"px,0)"}
  if(tl){var tr=tl.getBoundingClientRect(),trig=innerHeight*.62;
    tl.style.setProperty("--p",Math.max(0,Math.min(1,(trig-tr.top)/tr.height)).toFixed(3));
    tlis.forEach(function(li){li.classList.toggle("on",li.getBoundingClientRect().top<trig)})}
  if(hot)hot._r=null;
  if(!still)vis.style.transform=innerWidth>820?"translate3d(0,"+(-Math.min(h.scrollTop,700)*.07).toFixed(1)+"px,0)":"";
  var cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<160)cur=i});
  links.forEach(function(a,i){a.classList.toggle("on",i===cur)});
  if(touchy&&cur!==lastCur){lastCur=cur;if(cur>=0){var la=links[cur],nv=la.parentNode;nv.scrollTo({left:la.offsetLeft-nv.offsetLeft-nv.clientWidth/2+la.offsetWidth/2,behavior:still?"auto":"smooth"})}}
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll,{passive:true});update();
// muncul saat di-scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("show");countUp(e.target);io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll(".rv").forEach(function(el){io.observe(el)});
document.getElementById("y").textContent=new Date().getFullYear();

// jeda antar elemen (stagger)
function stagger(list){[].forEach.call(list,function(el,i){el.style.setProperty("--i",i)})}
document.querySelectorAll(".rv .grid,.rv .tl,.rv .facts,.rv .about").forEach(function(c){stagger(c.children)});
stagger(document.querySelectorAll(".hero>div:first-child>*"));
document.querySelectorAll(".card").forEach(function(c){[].forEach.call(c.querySelectorAll(".sk"),function(el,j){el.style.setProperty("--j",j)})});
// angka persen naik saat bar terisi
function countUp(sec){
  if(still)return;
  sec.querySelectorAll(".sk span+span").forEach(function(el){
    var n=parseInt(el.textContent,10);if(isNaN(n))return;
    var j=parseFloat(el.parentNode.style.getPropertyValue("--j"))||0;
    el.textContent="0%";
    setTimeout(function(){
      var t0=performance.now();
      (function f(t){var p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+"%";if(p<1)requestAnimationFrame(f)})(t0);
    },400+j*100);
  });
}
// efek ripple saat dipencet
document.addEventListener("pointerdown",function(e){
  if(still)return;
  var t=e.target.closest(".btn,.links a,.proj,.card");if(!t)return;
  var r=t.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,d=document.createElement("span");
  d.className="ripple";
  d.style.cssText="width:"+s+"px;height:"+s+"px;left:"+(e.clientX-r.left-s/2)+"px;top:"+(e.clientY-r.top-s/2)+"px";
  t.appendChild(d);
  d.addEventListener("animationend",function(){d.remove()});
},{passive:true});
// judul: kata naik satu per satu
document.querySelectorAll(".rv h2").forEach(function(h){
  var txt=h.textContent.trim().split(/\s+/);h.setAttribute("aria-label",txt.join(" "));h.textContent="";
  txt.forEach(function(w,i){
    var o=document.createElement("span"),n=document.createElement("span");
    o.className="w";o.setAttribute("aria-hidden","true");n.style.setProperty("--k",i);n.textContent=w;
    o.appendChild(n);h.appendChild(o);if(i<txt.length-1)h.appendChild(document.createTextNode(" "));
  });
});

// spotlight + tilt 3D pada kartu (mouse), spotlight saat tap (layar sentuh)
function aim(el,e,tilt){
  var r=el._r||(el._r=el.getBoundingClientRect()),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.style.setProperty("--mx",(x*100).toFixed(1)+"%");el.style.setProperty("--my",(y*100).toFixed(1)+"%");
  if(tilt){el.style.setProperty("--rx",((.5-y)*7).toFixed(2)+"deg");el.style.setProperty("--ry",((x-.5)*9).toFixed(2)+"deg")}
}
function unaim(el){el.classList.remove("lit");el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg");el._r=null}
document.addEventListener("pointermove",function(e){
  if(e.pointerType!=="mouse")return;
  var t=e.target.closest(".card,.proj,.facts");
  if(t!==hot){if(hot)unaim(hot);hot=t;if(hot)hot.classList.add("lit")}
  if(hot)aim(hot,e,!still&&!hot.classList.contains("facts"));
},{passive:true});
document.documentElement.addEventListener("mouseleave",function(){if(hot){unaim(hot);hot=null}});
document.addEventListener("pointerdown",function(e){
  if(e.pointerType==="mouse")return;
  var t=e.target.closest(".card,.proj,.facts");if(!t)return;
  t._r=null;aim(t,e,false);t.classList.add("lit");setTimeout(function(){t.classList.remove("lit")},700);
},{passive:true});

// tombol magnetik (mouse)
if(!still&&matchMedia("(hover:hover) and (pointer:fine)").matches){
  document.querySelectorAll(".btn").forEach(function(b){
    b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();
      b.style.setProperty("--bx",((e.clientX-r.left-r.width/2)*.22).toFixed(1)+"px");
      b.style.setProperty("--by",((e.clientY-r.top-r.height/2)*.35).toFixed(1)+"px")});
    b.addEventListener("pointerleave",function(){b.style.setProperty("--bx","0px");b.style.setProperty("--by","0px")});
  });
}

// percikan saat dipencet
var cols=["#22E3FF","#8B5CF6","#FF5CA8","#FFB547","#3DF0A5"];
document.addEventListener("pointerdown",function(e){
  if(still||!e.target.closest(".btn,.links a,.photo,.badge,.totop"))return;
  for(var i=0;i<10;i++)(function(i){
    var p=document.createElement("i"),a=Math.PI*2*i/10+Math.random()*.6,d=42+Math.random()*46;
    p.className="spark";p.style.left=e.clientX+"px";p.style.top=e.clientY+"px";p.style.background=cols[i%cols.length];
    document.body.appendChild(p);
    p.animate([{transform:"translate(-50%,-50%) scale(1)",opacity:1},
      {transform:"translate(calc(-50% + "+(Math.cos(a)*d).toFixed(1)+"px),calc(-50% + "+(Math.sin(a)*d).toFixed(1)+"px)) scale(0)",opacity:0}],
      {duration:550+Math.random()*350,easing:"cubic-bezier(.2,.7,.2,1)"}).onfinish=function(){p.remove()};
  })(i);
},{passive:true});

// foto dan badge memantul saat di-tap
[".photo",".badge"].forEach(function(q){
  var el=document.querySelector(q);if(!el)return;
  el.addEventListener("click",function(){
    if(still)return;
    el.animate([{transform:"scale(1)"},{transform:"scale(.92) rotate(-3deg)",offset:.35},{transform:"scale(1.06) rotate(1.5deg)",offset:.7},{transform:"scale(1)"}],{duration:600,easing:"cubic-bezier(.3,1.4,.5,1)"});
  });
});

// ===== khusus layar sentuh (HP / tablet) =====
if(touchy){
  // kartu yang lewat di tengah layar menyala otomatis
  var fio=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("focus",e.isIntersecting)})},{rootMargin:"-38% 0px -38% 0px"});
  document.querySelectorAll(".card,.proj,.facts").forEach(function(c){fio.observe(c)});

  // getar halus saat menekan tombol
  document.addEventListener("click",function(e){
    if(navigator.vibrate&&e.target.closest(".btn,.links a,.totop,.photo,.badge,.card,.proj"))navigator.vibrate(10);
  },{passive:true});

  // foto dan chip bergeser mengikuti kemiringan HP (gyro)
  if(!still&&window.DeviceOrientationEvent){
    var gx=0,gy=0,gt=false;
    var applyG=function(){gt=false;vis.style.setProperty("--gx",gx.toFixed(3));vis.style.setProperty("--gy",gy.toFixed(3))};
    var gyro=function(e){
      if(e.gamma==null||e.beta==null)return;
      gx=Math.max(-1,Math.min(1,e.gamma/25));gy=Math.max(-1,Math.min(1,(e.beta-50)/25));
      if(!gt){gt=true;requestAnimationFrame(applyG)}
    };
    if(typeof DeviceOrientationEvent.requestPermission==="function"){
      // iPhone: izin diminta saat foto di-tap pertama kali
      var ph=document.querySelector(".photo");
      if(ph)ph.addEventListener("click",function(){
        DeviceOrientationEvent.requestPermission().then(function(r){if(r==="granted")addEventListener("deviceorientation",gyro,{passive:true})}).catch(function(){});
      },{once:true});
    }else addEventListener("deviceorientation",gyro,{passive:true});
  }
}