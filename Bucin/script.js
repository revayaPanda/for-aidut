/* =====================
   GLOBAL STATE
===================== */
let step = 0;

const chat = document.getElementById("chat");
const giftBtn = document.getElementById("giftBtn");
const notif = document.getElementById("notif");
const container = document.getElementById("container");
const blackout = document.getElementById("blackout");

const fireCanvas = document.getElementById("fireCanvas");
const loveCanvas = document.getElementById("loveCanvas");
const fireCtx = fireCanvas.getContext("2d");
const loveCtx = loveCanvas.getContext("2d");

/* =====================
   CHAT CONTENT
===================== */
const messages = [
  { side:"right", text:"y" },
  { side:"left",  text:"aku tau kamu capek, kesel, dan mungkin males nanggepin aku…" },
  { side:"left",  text:"maybe i dont deserve to be forgiven," },
  { side:"left",  text:"but i really wanna gift you something…" },
  { side:"left",  text:"as a token of apology from me"},
  { side:"left",  text:"here" },
  { side:"right", text:"???" }
];


/* =====================
   UTIL
===================== */
function vibrate(){
  if (navigator.vibrate) navigator.vibrate([40,20,40]);
}

/* =====================
   SEND CHAT
===================== */
function sendChat(){
  if(step >= messages.length) return;

  notif.play();
  vibrate();

  const msg = messages[step];
  chat.innerHTML += `<div class="bubble ${msg.side}">${msg.text}</div>`;
  chat.scrollTop = chat.scrollHeight;

  step++;

  // unlock gift
  if(step === messages.length){
    giftBtn.disabled = false;
    giftBtn.innerText = "🎁 Buka Kado";
  }
}

/* =====================
   OPEN GIFT (CINEMATIC)
===================== */
function openGift(){
  if(giftBtn.disabled) return;

  notif.play();
  vibrate();

  // fade out chat
  container.style.transition = "all 1.5s ease";
  container.style.opacity = "0";
  container.style.transform = "scale(.9)";

  setTimeout(()=>{
    container.style.display = "none";
    blackout.style.display = "flex";

    resizeCanvas();
    startFireworks();
    drawHeart();
  },1500);

  // cinematic ending panjang
  setTimeout(()=>{
    blackout.classList.add("fade-out");
  },22000);
}

/* =====================
   CANVAS RESIZE
===================== */
function resizeCanvas(){
  fireCanvas.width = loveCanvas.width = window.innerWidth;
  fireCanvas.height = loveCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

/* =====================
   LOVE HEART (DEPTH 2D)
===================== */
let angle = 0;

function drawHeart(){
  loveCtx.clearRect(0,0,loveCanvas.width,loveCanvas.height);

  const scale = Math.min(loveCanvas.width, loveCanvas.height) / 420;
  const text = "I LOVE YOU DUT";
  const layers = 8;
  const points = 60;

  loveCtx.save();
  loveCtx.translate(loveCanvas.width/2, loveCanvas.height/2);
  loveCtx.rotate(angle);
  loveCtx.scale(scale, scale);

  for(let z=-layers; z<=layers; z++){
    loveCtx.globalAlpha = 1 - Math.abs(z)*0.1;
    loveCtx.font = "18px monospace";
    loveCtx.fillStyle = "#ff7eb9";
    loveCtx.textAlign = "center";
    loveCtx.shadowColor = "#ff4fa0";
    loveCtx.shadowBlur = 18;

    for(let i=0;i<points;i++){
      const t = (i/points)*Math.PI*2;
      const x = 16*Math.pow(Math.sin(t),3)*14;
      const y = -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*14;
      loveCtx.fillText(text, x, y);
    }
  }

  loveCtx.restore();
  angle += 0.006;
  requestAnimationFrame(drawHeart);
}

/* =====================
   FIREWORKS
===================== */
let particles = [];

function createFirework(){
  const x = Math.random()*fireCanvas.width;
  const y = Math.random()*fireCanvas.height/2;

  for(let i=0;i<50;i++){
    particles.push({
      x,y,
      angle:Math.random()*Math.PI*2,
      speed:Math.random()*4+2,
      life:80
    });
  }
}

function animateFireworks(){
  fireCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);

  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += Math.cos(p.angle)*p.speed;
    p.y += Math.sin(p.angle)*p.speed;
    p.life--;

    fireCtx.beginPath();
    fireCtx.arc(p.x,p.y,3,0,Math.PI*2);
    fireCtx.fillStyle = "#ff7eb9";
    fireCtx.fill();

    if(p.life<=0) particles.splice(i,1);
  }

  requestAnimationFrame(animateFireworks);
}

function startFireworks(){
  setInterval(createFirework,800);
  animateFireworks();
}
