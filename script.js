/* BG CANVAS — animated floating red particles */
(function(){
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let W, H;
  function resize(){ W = c.width = innerWidth; H = c.height = innerHeight; }
  resize(); addEventListener('resize', resize);

  const pts = Array.from({length:55}, () => ({
    x: Math.random() * 1920, y: Math.random() * 1080,
    vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25,
    r: Math.random()*1.2+.3,
    o: Math.random()*.35+.05,
  }));

  let t = 0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t += .004;

    // Orb 1 — right side
    const g1 = ctx.createRadialGradient(W*.78+Math.sin(t)*.04*W, H*.25+Math.cos(t*.8)*.04*H, 0, W*.78, H*.25, W*.45);
    g1.addColorStop(0,'rgba(192,21,42,0.1)');
    g1.addColorStop(1,'rgba(192,21,42,0)');
    ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

    // Orb 2 — bottom left
    const g2 = ctx.createRadialGradient(W*.15+Math.cos(t*.7)*.04*W, H*.8+Math.sin(t)*.04*H, 0, W*.15, H*.8, W*.35);
    g2.addColorStop(0,'rgba(192,21,42,0.07)');
    g2.addColorStop(1,'rgba(192,21,42,0)');
    ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

    // Particles
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(192,21,42,${p.o})`;
      ctx.fill();
    });

    // Connections
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(192,21,42,${.12*(1-d/110)})`;
          ctx.lineWidth=.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* CURSOR */
const dot = document.getElementById('c-dot');
const ring = document.getElementById('c-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { 
  mx=e.clientX; my=e.clientY; 
  dot.style.left=mx+'px'; dot.style.top=my+'px'; 
});
(function loop(){ 
  rx+=(mx-rx)*.11; ry+=(my-ry)*.11; 
  ring.style.left=rx+'px'; ring.style.top=ry+'px'; 
  requestAnimationFrame(loop); 
})();
document.querySelectorAll('a,button,.proj-row,.chip,.soc').forEach(el => {
  el.addEventListener('mouseenter',()=>ring.classList.add('big'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
});

/* NAV */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('s', scrollY>60);
});

/* HERO PARALLAX */
window.addEventListener('scroll',()=>{
  const y = scrollY;
  const hc = document.querySelector('.hero-content');
  if(hc && y < innerHeight){ 
    hc.style.transform=`translateY(${y*.09}px)`; 
    hc.style.opacity=1-y/650; 
  }
});

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('go');
    e.target.querySelectorAll('.s-bar').forEach(b=>{
      setTimeout(()=>b.style.width=b.dataset.w+'%', 250);
    });
  });
},{threshold:.13});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* COUNTERS */
const cobs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, t=parseInt(el.dataset.t)||0;
    if(!t) return;
    let v=0; const inc=t/60;
    const id=setInterval(()=>{ 
      v=Math.min(v+inc,t); 
      el.textContent=Math.round(v); 
      if(v>=t)clearInterval(id); 
    },18);
    cobs.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-t]').forEach(el=>cobs.observe(el));

/* FORM HANDLER */
function sendMsg(e){
  e.preventDefault();
  const btn=document.getElementById('sbtn-t');
  btn.textContent='Sending…';
  setTimeout(()=>btn.textContent='Message Sent ✓',1400);
  setTimeout(()=>{ 
    btn.textContent='Send Message →'; 
    e.target.reset(); 
  },4200);
}