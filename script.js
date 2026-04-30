(() => {
"use strict";
const $ = s => document.querySelector(s);
const fmt = n => Math.abs(n)>=1000?n.toFixed(1):Math.abs(n)>=1?n.toFixed(3):n.toFixed(4);
function hexRgba(hex,a){let c=hex.replace("#","");if(c.length===3)c=c.split("").map(ch=>ch+ch).join("");const n=parseInt(c,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}

const FLUIDS={agua:{viscosity:.001,color:"#4a90d9"},oleo_motor:{viscosity:.2,color:"#c9a227"},glicerina:{viscosity:1.5,color:"#8e6bbf"},mel:{viscosity:10,color:"#d4872c"},ar:{viscosity:.000018,color:"#98b8d4"}};
const OILS={diesel:{rho:850,mu:0.005},hidraulico:{rho:870,mu:0.1},motor:{rho:890,mu:0.3},pesado:{rho:920,mu:1.5}};

/* ====== TAB SWITCHING ====== */
let activeExp="newton";
document.querySelectorAll(".experiment-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
        if(btn.dataset.exp===activeExp)return;
        document.querySelectorAll(".experiment-tab").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".experiment").forEach(e=>e.classList.remove("active"));
        document.getElementById("exp-"+btn.dataset.exp)?.classList.add("active");
        activeExp=btn.dataset.exp;
        if(activeExp==="newton"){resizeN();cancelAnimationFrame(rafD);renderN();}
        else{resizeD();cancelAnimationFrame(rafN);renderD();}
        if(window.MathJax&&MathJax.typeset)MathJax.typeset();
    });
});

/* ====== NEWTON ====== */
const ui={fluid:$("#fluid-select"),mu:$("#viscosity"),y:$("#distance"),v:$("#velocity"),A:$("#area"),muVal:$("#viscosity-val"),yVal:$("#distance-val"),vVal:$("#velocity-val"),aVal:$("#area-val"),tauOut:$("#stress-result"),forceOut:$("#force-result"),tauSub:$("#stress-subbed"),forceSub:$("#force-subbed"),canvas:$("#fluidCanvas"),labelTop:$("#label-top"),dimTau:$("#dim-tau-check"),dimForce:$("#dim-force-check")};
const ctx=ui.canvas.getContext("2d");
let fluidColor="#4a90d9",particles=[],rafN=null;

function recalcN(){
    const mu=parseFloat(ui.mu.value),y=parseFloat(ui.y.value),v=parseFloat(ui.v.value),A=parseFloat(ui.A.value);
    ui.muVal.textContent=`${mu.toFixed(4)} Pa·s`;ui.yVal.textContent=`${y.toFixed(2)} m`;
    ui.vVal.textContent=`${v.toFixed(1)} m/s`;ui.aVal.textContent=`${A.toFixed(1)} m²`;
    const tau=mu*(v/y),force=tau*A;
    ui.tauOut.textContent=fmt(tau);ui.forceOut.textContent=fmt(force);
    ui.tauSub.textContent=`τ = ${mu.toFixed(4)} × (${v.toFixed(1)} / ${y.toFixed(2)})`;
    ui.forceSub.textContent=`F = ${fmt(tau)} × ${A.toFixed(1)}`;
    ui.dimTau.textContent=`${mu.toFixed(4)} Pa·s × (${v.toFixed(1)} m/s ÷ ${y.toFixed(2)} m) = ${fmt(tau)} Pa`;
    ui.dimForce.textContent=`${fmt(tau)} Pa × ${A.toFixed(1)} m² = ${fmt(force)} N`;
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
    ctx.fillStyle="rgba(245,158,11,.85)";ctx.font='500 12px "Inter",sans-serif';ctx.fillText(`μ = ${parseFloat(ui.mu.value).toFixed(4)} Pa·s`,pX+12,bY-gap/2+4);
    particles.forEach(p=>{p.update(v,bY,gap);p.draw(ctx,fluidColor);});
    if(v>0){const aY=tY-26,aX=W/2-30,aL=40+v*9;ctx.beginPath();ctx.moveTo(aX,aY);ctx.lineTo(aX+aL,aY);ctx.strokeStyle="#60a5fa";ctx.lineWidth=2.5;ctx.stroke();ctx.beginPath();ctx.moveTo(aX+aL+1,aY);ctx.lineTo(aX+aL-8,aY-5);ctx.lineTo(aX+aL-8,aY+5);ctx.closePath();ctx.fillStyle="#60a5fa";ctx.fill();ctx.fillStyle="rgba(255,255,255,.8)";ctx.font='500 12px "Inter",sans-serif';const lb=`v = ${v.toFixed(1)} m/s`;ctx.fillText(lb,aX+aL/2-ctx.measureText(lb).width/2,aY-9);ctx.lineWidth=1.5;ctx.strokeStyle="rgba(0,0,0,.25)";const off=(Date.now()/(1000/v*2))%30;for(let x=-30;x<W;x+=30){ctx.beginPath();ctx.moveTo(x+off,tY-12);ctx.lineTo(x+off+8,tY);ctx.stroke();}}
    rafN=requestAnimationFrame(renderN);
}

/* ====== DAM / OIL SPREADING ====== */
const dm={
    oilA:$("#oil-a-select"),oilB:$("#oil-b-select"),
    muA:$("#oil-a-mu"),rhoA:$("#oil-a-rho"),volA:$("#oil-a-vol"),
    muB:$("#oil-b-mu"),rhoB:$("#oil-b-rho"),volB:$("#oil-b-vol"),
    muAv:$("#oil-a-mu-val"),rhoAv:$("#oil-a-rho-val"),volAv:$("#oil-a-vol-val"),
    muBv:$("#oil-b-mu-val"),rhoBv:$("#oil-b-rho-val"),volBv:$("#oil-b-vol-val"),
    play:$("#sim-play"),reset:$("#sim-reset"),timeOut:$("#sim-time"),
    speed:$("#sim-speed"),speedVal:$("#sim-speed-val"),
    canvas:$("#damCanvas"),timeLabel:$("#dam-time-label"),
    rA:$("#dam-rA"),rB:$("#dam-rB"),areaA:$("#dam-areaA"),areaB:$("#dam-areaB"),
    vA:$("#dam-vA"),vB:$("#dam-vB"),ratio:$("#dam-ratio"),ratioLabel:$("#dam-ratio-label"),
    rAs:$("#dam-rA-sub"),rBs:$("#dam-rB-sub"),aAs:$("#dam-aA-sub"),aBs:$("#dam-aB-sub"),
    dimR:$("#dim-dam-r"),dimA:$("#dim-dam-a"),dimV:$("#dim-dam-v"),
};
let dCtx=dm.canvas?dm.canvas.getContext("2d"):null;
let rafD=null,simTime=0,simRunning=false,lastFrame=0;
const RHO_W=1000,G=9.81,KS=0.01;

function spreadRadius(drho,V,mu,t){
    if(t<=0||drho<=0)return 0;
    return KS*Math.sqrt(drho*G*V*t/mu);
}

function getOilParams(side){
    const mu=parseFloat(side==="A"?dm.muA.value:dm.muB.value);
    const rho=parseFloat(side==="A"?dm.rhoA.value:dm.rhoB.value);
    const vol=parseFloat(side==="A"?dm.volA.value:dm.volB.value);
    return {mu,rho,vol,nu:mu/rho,drho:RHO_W-rho};
}

function recalcD(){
    const a=getOilParams("A"),b=getOilParams("B");
    dm.muAv.textContent=`${a.mu.toFixed(4)} Pa·s`;dm.rhoAv.textContent=`${a.rho.toFixed(0)} kg/m³`;dm.volAv.textContent=`${a.vol.toFixed(2)} m³`;
    dm.muBv.textContent=`${b.mu.toFixed(4)} Pa·s`;dm.rhoBv.textContent=`${b.rho.toFixed(0)} kg/m³`;dm.volBv.textContent=`${b.vol.toFixed(2)} m³`;
    dm.speedVal.textContent=`${parseFloat(dm.speed.value).toFixed(1)}×`;
    const rA=spreadRadius(a.drho,a.vol,a.mu,simTime),rB=spreadRadius(b.drho,b.vol,b.mu,simTime);
    const AA=Math.PI*rA*rA,AB=Math.PI*rB*rB;
    const vAv=simTime>0?rA/(2*simTime):0,vBv=simTime>0?rB/(2*simTime):0;
    dm.rA.textContent=fmt(rA);dm.rB.textContent=fmt(rB);
    dm.areaA.textContent=fmt(AA);dm.areaB.textContent=fmt(AB);
    dm.vA.textContent=fmt(vAv);dm.vB.textContent=fmt(vBv);
    const rat=rB>0?rA/rB:0;dm.ratio.textContent=rat>0?rat.toFixed(3):"--";
    dm.ratioLabel.textContent=rat>=1?"A espalha mais":"B espalha mais";
    dm.rAs.textContent=`rA = ${KS} × √(${a.drho.toFixed(0)} × 9.81 × ${a.vol.toFixed(2)} × ${simTime.toFixed(1)} / ${a.mu.toFixed(4)})`;
    dm.rBs.textContent=`rB = ${KS} × √(${b.drho.toFixed(0)} × 9.81 × ${b.vol.toFixed(2)} × ${simTime.toFixed(1)} / ${b.mu.toFixed(4)})`;
    dm.aAs.textContent=`AA = π × ${fmt(rA)}² = ${fmt(AA)} m²`;
    dm.aBs.textContent=`AB = π × ${fmt(rB)}² = ${fmt(AB)} m²`;
    dm.timeOut.textContent=`${simTime.toFixed(1)} s`;dm.timeLabel.textContent=`t = ${simTime.toFixed(1)} s`;
    if(dm.dimR)dm.dimR.textContent=`rA = ${fmt(rA)} m, rB = ${fmt(rB)} m (t=${simTime.toFixed(1)}s)`;
    if(dm.dimA)dm.dimA.textContent=`AA = ${fmt(AA)} m², AB = ${fmt(AB)} m²`;
    if(dm.dimV)dm.dimV.textContent=`vA = ${fmt(vAv)} m/s, vB = ${fmt(vBv)} m/s`;
}

// Oil presets
function applyOilPreset(side,key){
    const d=OILS[key];if(!d)return;
    if(side==="A"){dm.muA.value=d.mu;dm.rhoA.value=d.rho;dm.muA.disabled=true;dm.rhoA.disabled=true;}
    else{dm.muB.value=d.mu;dm.rhoB.value=d.rho;dm.muB.disabled=true;dm.rhoB.disabled=true;}
    recalcD();
}
dm.oilA.addEventListener("change",e=>{if(e.target.value==="custom"){dm.muA.disabled=false;dm.rhoA.disabled=false;}else applyOilPreset("A",e.target.value);});
dm.oilB.addEventListener("change",e=>{if(e.target.value==="custom"){dm.muB.disabled=false;dm.rhoB.disabled=false;}else applyOilPreset("B",e.target.value);});
[dm.muA,dm.rhoA,dm.volA,dm.muB,dm.rhoB,dm.volB,dm.speed].forEach(el=>el.addEventListener("input",()=>{fixedMaxRadius=computeFixedScale();recalcD();}));

// Play/Pause
dm.play.addEventListener("click",()=>{
    simRunning=!simRunning;
    dm.play.textContent=simRunning?"⏸ Pausar":"▶ Iniciar";
    dm.play.classList.toggle("active",simRunning);
    if(simRunning){
        fixedMaxRadius=computeFixedScale();
        lastFrame=performance.now();
        if(activeExp==="barragem")renderD();
    }
});
dm.reset.addEventListener("click",()=>{
    simTime=0;simRunning=false;
    dm.play.textContent="▶ Iniciar";dm.play.classList.remove("active");
    fixedMaxRadius=computeFixedScale();
    recalcD();
});

// Canvas
function resizeD(){if(!dm.canvas)return;const b=dm.canvas.parentElement;dm.canvas.width=b.clientWidth;dm.canvas.height=b.clientHeight;}

function computeFixedScale(){
    // Compute scale so that the faster oil reaches the canvas edge at ~30s
    const a=getOilParams("A"),b=getOilParams("B");
    const tRef=30;
    const rAref=spreadRadius(a.drho,a.vol,a.mu,tRef);
    const rBref=spreadRadius(b.drho,b.vol,b.mu,tRef);
    const bigRef=Math.max(rAref,rBref,0.01);
    return bigRef;
}
let fixedMaxRadius=1;

function renderD(){
    if(!dCtx)return;
    const W=dm.canvas.width,H=dm.canvas.height;
    const now=performance.now();
    if(simRunning){
        const dt=(now-lastFrame)/1000*parseFloat(dm.speed.value);
        simTime+=dt;
        recalcD();
    }
    lastFrame=now;
    dCtx.clearRect(0,0,W,H);
    // Water background
    const wg=dCtx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.6);
    wg.addColorStop(0,"#1a3a5c");wg.addColorStop(1,"#0f1724");dCtx.fillStyle=wg;dCtx.fillRect(0,0,W,H);
    // Subtle water waves
    const t=Date.now()/1000;
    dCtx.strokeStyle="rgba(100,160,220,.08)";dCtx.lineWidth=1;
    for(let i=0;i<8;i++){dCtx.beginPath();for(let x=0;x<W;x+=3){const y=H/2+Math.sin(x*.02+t+i*.8)*20+i*30-120;if(x===0)dCtx.moveTo(x,y);else dCtx.lineTo(x,y);}dCtx.stroke();}
    // Oil patches — same center, larger drawn first (behind)
    const a=getOilParams("A"),b=getOilParams("B");
    const rA=spreadRadius(a.drho,a.vol,a.mu,simTime),rB=spreadRadius(b.drho,b.vol,b.mu,simTime);
    const cx=W/2, cy=H/2;
    const maxPx=Math.min(W,H)*0.44;
    const scale=maxPx/fixedMaxRadius;
    const pxA=Math.min(rA*scale, maxPx*1.05);
    const pxB=Math.min(rB*scale, maxPx*1.05);
    // Auto-pause when larger reaches edge
    if(simRunning && (rA>=fixedMaxRadius || rB>=fixedMaxRadius)){
        simRunning=false; dm.play.textContent="▶ Iniciar"; dm.play.classList.remove("active");
    }
    // Determine which is larger to draw it first (behind)
    const bigger  = pxA>=pxB ? {px:pxA,r:rA,label:"A",col:"231,76,60"}  : {px:pxB,r:rB,label:"B",col:"52,152,219"};
    const smaller = pxA>=pxB ? {px:pxB,r:rB,label:"B",col:"52,152,219"} : {px:pxA,r:rA,label:"A",col:"231,76,60"};
    // Draw BIGGER circle first (behind)
    if(bigger.px>0.5){
        dCtx.fillStyle=`rgba(${bigger.col},0.12)`;
        dCtx.beginPath();dCtx.arc(cx,cy,bigger.px,0,Math.PI*2);dCtx.fill();
        dCtx.strokeStyle=`rgba(${bigger.col},0.9)`;dCtx.lineWidth=3;
        dCtx.beginPath();dCtx.arc(cx,cy,bigger.px,0,Math.PI*2);dCtx.stroke();
    }
    // Draw SMALLER circle on top
    if(smaller.px>0.5){
        dCtx.fillStyle=`rgba(${smaller.col},0.18)`;
        dCtx.beginPath();dCtx.arc(cx,cy,smaller.px,0,Math.PI*2);dCtx.fill();
        dCtx.strokeStyle=`rgba(${smaller.col},0.9)`;dCtx.lineWidth=3;
        dCtx.beginPath();dCtx.arc(cx,cy,smaller.px,0,Math.PI*2);dCtx.stroke();
    }
    // Center dot
    dCtx.fillStyle="#fff";dCtx.beginPath();dCtx.arc(cx,cy,3,0,Math.PI*2);dCtx.fill();
    // Radius lines — A goes right, B goes left
    dCtx.font='600 12px "Inter",sans-serif';
    if(pxA>8){
        dCtx.strokeStyle="rgba(231,76,60,.9)";dCtx.lineWidth=1.5;dCtx.setLineDash([5,3]);
        dCtx.beginPath();dCtx.moveTo(cx,cy);dCtx.lineTo(cx+pxA,cy);dCtx.stroke();dCtx.setLineDash([]);
        // Arrowhead
        dCtx.fillStyle="rgba(231,76,60,.9)";
        dCtx.beginPath();dCtx.moveTo(cx+pxA,cy);dCtx.lineTo(cx+pxA-6,cy-4);dCtx.lineTo(cx+pxA-6,cy+4);dCtx.closePath();dCtx.fill();
        dCtx.fillStyle="rgba(255,200,200,.95)";
        dCtx.fillText(`rA = ${fmt(rA)} m`,cx+pxA*0.35,cy-12);
    }
    if(pxB>8){
        dCtx.strokeStyle="rgba(52,152,219,.9)";dCtx.lineWidth=1.5;dCtx.setLineDash([5,3]);
        dCtx.beginPath();dCtx.moveTo(cx,cy);dCtx.lineTo(cx-pxB,cy);dCtx.stroke();dCtx.setLineDash([]);
        dCtx.fillStyle="rgba(52,152,219,.9)";
        dCtx.beginPath();dCtx.moveTo(cx-pxB,cy);dCtx.lineTo(cx-pxB+6,cy-4);dCtx.lineTo(cx-pxB+6,cy+4);dCtx.closePath();dCtx.fill();
        dCtx.fillStyle="rgba(180,220,255,.95)";
        const tw=dCtx.measureText(`rB = ${fmt(rB)} m`).width;
        dCtx.fillText(`rB = ${fmt(rB)} m`,cx-pxB*0.35-tw*0.5,cy-12);
    }
    // Scale
    dCtx.fillStyle="rgba(255,255,255,.3)";dCtx.font='400 10px "Inter",sans-serif';
    dCtx.fillText(`Escala: 1px ≈ ${(1/scale).toFixed(3)} m`,10,H-10);
    rafD=requestAnimationFrame(renderD);
}

/* ====== RESIZE ====== */
let rT;window.addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(()=>{if(activeExp==="newton")resizeN();else resizeD();},80);});

/* ====== INIT ====== */
recalcN();applyOilPreset("A","diesel");applyOilPreset("B","motor");
fixedMaxRadius=computeFixedScale();recalcD();
requestAnimationFrame(()=>{resizeN();renderN();resizeD();renderD();});
})();
