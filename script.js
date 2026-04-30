(() => {
"use strict";
const $ = s => document.querySelector(s);
const fmt = n => n.toFixed(6);
function hexRgba(hex,a){let c=hex.replace("#","");if(c.length===3)c=c.split("").map(ch=>ch+ch).join("");const n=parseInt(c,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}

const FLUIDS={agua:{viscosity:.001,color:"#4a90d9"},oleo_motor:{viscosity:.2,color:"#c9a227"},glicerina:{viscosity:1.5,color:"#8e6bbf"},mel:{viscosity:10,color:"#d4872c"},ar:{viscosity:.000018,color:"#98b8d4"}};
const OILS={diesel:{rho:850,mu:0.005},hidraulico:{rho:870,mu:0.1},motor:{rho:890,mu:0.3},pesado:{rho:920,mu:1.5}};

/* ====== SINGLE EXPERIMENT MODE ====== */

/* ====== NEWTON ====== */
const ui={fluid:$("#fluid-select"),mu:$("#viscosity"),y:$("#distance"),v:$("#velocity"),A:$("#area"),muVal:$("#viscosity-val"),yVal:$("#distance-val"),vVal:$("#velocity-val"),aVal:$("#area-val"),tauOut:$("#stress-result"),forceOut:$("#force-result"),tauSub:$("#stress-subbed"),forceSub:$("#force-subbed"),canvas:$("#fluidCanvas"),labelTop:$("#label-top"),dimTau:$("#dim-tau-check"),dimForce:$("#dim-force-check")};
const ctx=ui.canvas.getContext("2d");
let fluidColor="#4a90d9",particles=[],rafN=null;

function recalcN(){
    const mu=parseFloat(ui.mu.value),y=parseFloat(ui.y.value),v=parseFloat(ui.v.value),A=parseFloat(ui.A.value);
    ui.muVal.textContent=`${mu.toFixed(6)} Pa·s`;ui.yVal.textContent=`${y.toFixed(6)} m`;
    ui.vVal.textContent=`${v.toFixed(6)} m/s`;ui.aVal.textContent=`${A.toFixed(6)} m²`;
    const tau=y>0?mu*(v/y):0,force=tau*A;
    ui.tauOut.textContent=fmt(tau);ui.forceOut.textContent=fmt(force);
    ui.tauSub.textContent=`τ = ${mu.toFixed(6)} × (${v.toFixed(6)} / ${y.toFixed(6)})`;
    ui.forceSub.textContent=`F = ${fmt(tau)} × ${A.toFixed(6)}`;
    ui.dimTau.textContent=`${mu.toFixed(6)} Pa·s × (${v.toFixed(6)} m/s ÷ ${y.toFixed(6)} m) = ${fmt(tau)} Pa`;
    ui.dimForce.textContent=`${fmt(tau)} Pa × ${A.toFixed(6)} m² = ${fmt(force)} N`;
}
ui.fluid.addEventListener("change",e=>{const k=e.target.value;if(k==="custom"){ui.mu.disabled=false;fluidColor="#4a90d9";}else{const d=FLUIDS[k];if(!d)return;ui.mu.value=d.viscosity;ui.mu.disabled=true;fluidColor=d.color;}recalcN();initP();});
[ui.mu,ui.y,ui.v,ui.A].forEach(el=>el.addEventListener("input",()=>{if(el===ui.mu)fluidColor="#4a90d9";recalcN();}));

class NP{constructor(w,h){this.w=w;this.x=Math.random()*w;this.t=Math.random();}
update(s,bY,g){this.x+=s*3*this.t;if(this.x>this.w)this.x-=this.w;this.y=bY-this.t*g;}
draw(c,col){c.beginPath();c.arc(this.x,this.y,2.5,0,Math.PI*2);c.fillStyle=col;c.globalAlpha=.45;c.fill();c.globalAlpha=1;}}
function initP(){particles=[];const c=Math.min(250,Math.floor(ui.canvas.width*ui.canvas.height/600));for(let i=0;i<c;i++)particles.push(new NP(ui.canvas.width,ui.canvas.height));}
function resizeN(){const b=ui.canvas.parentElement;ui.canvas.width=b.clientWidth;ui.canvas.height=b.clientHeight;initP();}

function renderN(){
    const W=ui.canvas.width,H=ui.canvas.height;ctx.clearRect(0,0,W,H);
    const v=parseFloat(ui.v.value),dist=parseFloat(ui.y.value);
    const m=28,us=H-m*2,gF=((dist-.01)/.19)*.6+.4,gap=us*gF,bY=H-m,tY=bY-gap;
    const gr=ctx.createLinearGradient(0,tY,0,bY);gr.addColorStop(0,hexRgba(fluidColor,.18));gr.addColorStop(1,hexRgba(fluidColor,.04));ctx.fillStyle=gr;ctx.fillRect(0,tY,W,gap);
    ctx.fillStyle="#3b4252";ctx.fillRect(0,bY,W,12);ctx.fillStyle="#a0aec0";ctx.fillRect(0,tY-12,W,12);
    if(ui.labelTop)ui.labelTop.style.top=`${tY-32}px`;
    const pX=44;ctx.beginPath();ctx.moveTo(pX,bY);ctx.lineTo(pX,tY);ctx.strokeStyle="rgba(255,255,255,.2)";ctx.lineWidth=1.5;ctx.stroke();
    if(v>0){const mX=pX+50+v*10;ctx.beginPath();ctx.moveTo(pX,bY);ctx.lineTo(mX,tY);ctx.strokeStyle="#f59e0b";ctx.lineWidth=2;ctx.stroke();
    for(let i=1;i<=5;i++){const r=i/6,ly=bY-gap*r,lx=pX+(mX-pX)*r;ctx.beginPath();ctx.moveTo(pX,ly);ctx.lineTo(lx,ly);ctx.strokeStyle="rgba(245,158,11,.50)";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx-4,ly-3);ctx.lineTo(lx-4,ly+3);ctx.closePath();ctx.fillStyle="rgba(245,158,11,.55)";ctx.fill();}}
    ctx.fillStyle="rgba(245,158,11,.85)";ctx.font='500 12px "Inter",sans-serif';ctx.fillText(`μ = ${parseFloat(ui.mu.value).toFixed(6)} Pa·s`,pX+12,bY-gap/2+4);
    particles.forEach(p=>{p.update(v,bY,gap);p.draw(ctx,fluidColor);});
    if(v>0){const aY=tY-26,aX=W/2-30,aL=40+v*9;ctx.beginPath();ctx.moveTo(aX,aY);ctx.lineTo(aX+aL,aY);ctx.strokeStyle="#60a5fa";ctx.lineWidth=2.5;ctx.stroke();ctx.beginPath();ctx.moveTo(aX+aL+1,aY);ctx.lineTo(aX+aL-8,aY-5);ctx.lineTo(aX+aL-8,aY+5);ctx.closePath();ctx.fillStyle="#60a5fa";ctx.fill();ctx.fillStyle="rgba(255,255,255,.8)";ctx.font='500 12px "Inter",sans-serif';const lb=`v = ${v.toFixed(1)} m/s`;ctx.fillText(lb,aX+aL/2-ctx.measureText(lb).width/2,aY-9);ctx.lineWidth=1.5;ctx.strokeStyle="rgba(0,0,0,.25)";const off=(Date.now()/(1000/v*2))%30;for(let x=-30;x<W;x+=30){ctx.beginPath();ctx.moveTo(x+off,tY-12);ctx.lineTo(x+off+8,tY);ctx.stroke();}}
    rafN=requestAnimationFrame(renderN);
}

/* ====== RESIZE ====== */
let rT;window.addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(()=>{resizeN();},80);});

/* ====== INIT ====== */
recalcN();
requestAnimationFrame(()=>{resizeN();renderN();});
})();
