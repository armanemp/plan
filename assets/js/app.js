(function(){
  "use strict";
  const $ = id => document.getElementById(id);
  const book = window.PLAN_BOOK || {version:2,timezone:"Asia/Baku",plans:[]};
  const plans = Array.isArray(book.plans) ? book.plans.slice() : [];
  const errors = [];
  const state = {date:null,assetIndex:0,timeframe:null,query:"",chartGeometry:null};
  const palette = {bg:"#0c1116",grid:"#243039",text:"#84939d",muted:"#52616b",green:"#65dfb4",red:"#f07d87",amber:"#e7bd79",blue:"#8fb9f4",zone:"#4a806a"};
  const num = value => { if(typeof value==="number" && Number.isFinite(value)) return value; if(typeof value==="string" && value.trim()!==""){const n=Number(value.replace(/,/g,""));return Number.isFinite(n)?n:null;} return null; };
  const list = value => Array.isArray(value) ? value : [];
  const str = (value,fallback="ثبت نشده") => value===null || value===undefined || String(value).trim()==="" ? fallback : String(value);
  const esc = value => String(value===null||value===undefined?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const faNumber = value => new Intl.NumberFormat("fa-IR").format(value);
  const dateLabel = value => {if(!value)return "—";const d=new Date(value+"T12:00:00");return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Baku"}).format(d);};
  const dateShort = value => {if(!value)return "—";const d=new Date(value+"T12:00:00");return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat("fa-IR",{month:"short",day:"numeric",timeZone:"Asia/Baku"}).format(d);};
  const biasLabel = value => ({bullish:"صعودی",bearish:"نزولی",neutral:"خنثی",conditional:"مشروط",mixed:"ترکیبی"}[value]||"مشروط");
  const directionLabel = value => ({bullish:"صعودی",bearish:"نزولی",neutral:"خنثی"}[value]||"مشروط");
  const statusLabel = value => ({draft:"پیش‌نویس",ready:"آماده پس از بازبینی",archived:"بایگانی‌شده"}[value]||"پیش‌نویس");
  const impactLabel = value => ({high:"زیاد",medium:"متوسط",low:"کم"}[value]||"نامشخص");
  const importanceLabel = value => ({high:"بالا",medium:"متوسط",low:"پایین"}[value]||"—");
  const byDate = plans.filter(p=>p&&typeof p.date==="string").sort((a,b)=>b.date.localeCompare(a.date));
  const planByDate = date => byDate.find(p=>p.date===date)||null;
  const activePlan = () => planByDate(state.date)||byDate[0]||null;
  const activeAsset = () => {const p=activePlan();return p&&list(p.assets)[state.assetIndex]||null;};
  const chartFor = (asset,tf) => {const charts=list(asset&&asset.charts);return charts.find(c=>c&&c.timeframe===tf)||charts[0]||null;};
  const assetLevels = (p,a) => list(a&&a.levels).concat(list(p&&p.levels).filter(l=>!l.symbol||l.symbol===(a&&a.symbol)));
  const assetZones = (p,a) => list(a&&a.zones).concat(list(p&&p.zones).filter(z=>!z.symbol||z.symbol===(a&&a.symbol)));
  const qualityMissing = p => list(p&&p.qualityGates).filter(g=>g&&g.done!==true);
  const setText = (id,value) => {const el=$(id);if(el)el.textContent=value;};
  const setHtml = (id,value) => {const el=$(id);if(el)el.innerHTML=value;};
  const empty = text => '<div class="empty-inline">'+esc(text)+'</div>';
  function validateBook(){
    if(book.version!==2)errors.push("نسخهٔ داده باید 2 باشد.");
    if(!Array.isArray(book.plans))errors.push("plans باید آرایه باشد.");
    const seen=new Set();
    byDate.forEach(p=>{
      if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date))errors.push("تاریخ نامعتبر: "+p.date);
      if(seen.has(p.date))errors.push("تاریخ تکراری: "+p.date);seen.add(p.date);
      if(!["draft","ready","archived"].includes(p.status))errors.push("وضعیت نامعتبر در "+p.date);
      list(p.assets).forEach(a=>{
        list(a.charts).forEach(c=>{
          let previous=-Infinity;
          list(c.candles).forEach(k=>{
            const time=typeof k.time==="number"?k.time:Date.parse(k.time);
            const vals=[num(k.open),num(k.high),num(k.low),num(k.close)];
            if(!Number.isFinite(time)||time<=previous)errors.push("زمان کندل‌ها باید معتبر و صعودی باشد: "+p.date+" / "+a.symbol+" / "+c.timeframe);
            previous=time;
            if(vals.some(v=>v===null)||vals[1]<Math.max(vals[0],vals[3],vals[2])||vals[2]>Math.min(vals[0],vals[3]))errors.push("OHLC ناسازگار است: "+p.date+" / "+a.symbol+" / "+c.timeframe);
          });
        });
      });
    });
  }
  function initHeader(){
    const now=new Date();
    setText("todayDate",new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric",timeZone:book.timezone||"Asia/Baku"}).format(now));
    const select=$("planSelect");
    if(byDate.length){select.disabled=false;select.innerHTML=byDate.map(p=>'<option value="'+esc(p.date)+'">'+esc(dateLabel(p.date))+' — '+esc(p.title||"پلن روزانه")+'</option>').join("");}
    else{select.disabled=true;select.innerHTML='<option value="">هنوز پلنی ثبت نشده</option>';}
  }
  function render(){
    const p=activePlan();
    $("emptyState").hidden=!!p;
    $("workspace").hidden=!p;
    if(!p)return;
    if(!list(p.assets).length){setText("planTitle",str(p.title,"پلن روزانه"));setText("planHeadline","برای این روز هنوز نمادی ثبت نشده است.");return;}
    if(state.assetIndex>=p.assets.length)state.assetIndex=0;
    const a=activeAsset();
    const charts=list(a.charts);
    const selectedChart=charts.find(c=>c.timeframe===state.timeframe);
    if(!selectedChart)state.timeframe=(charts[0]&&charts[0].timeframe)||null;
    const chart=chartFor(a,state.timeframe);
    $("planSelect").value=p.date;
    setText("planDate",dateLabel(p.date));setText("planSession",str(p.session,"جلسه ثبت نشده"));setText("planTimezone",str(p.timezone,book.timezone||"Asia/Baku"));
    setText("planTitle",str(p.title,"پلن معاملاتی"));setText("planHeadline",str(p.headline,"برداشت روز ثبت نشده است."));
    const status=$("planStatus");status.textContent=statusLabel(p.status);status.className="state-badge state-"+(p.status||"draft");
    const missing=qualityMissing(p);
    const banner=$("readinessBanner");banner.hidden=p.status==="ready"&&missing.length===0;
    if(!banner.hidden)banner.textContent=p.status==="ready"&&missing.length?"وضعیت آماده ثبت شده، اما "+faNumber(missing.length)+" کنترل کیفیت هنوز کامل نیست. پیش از اجرا آن‌ها را بازبینی کن.":"این پلن پیش‌نویس است. قیمت، خبر، شرط فعال‌سازی و ابطال را پیش از هر تصمیم دوباره بررسی کن.";
    setText("planSourceState",list(p.sources).length+" منبع ثبت‌شده · بررسی مجدد پیش از جلسه");
    setText("summaryBias",biasLabel(p.bias));setText("summaryBiasNote",str(p.biasNote,"فقط پس از تأیید ساختار"));
    setText("summaryRegime",str(p.regime,"ثبت نشده"));setText("summaryDayType",str(p.dayType,"نوع روز نامشخص"));
    setText("summaryAssets",faNumber(list(p.assets).length));const highEvents=list(p.events).filter(e=>e.impact==="high");
    setText("summaryEvents",faNumber(highEvents.length));setText("summaryEventsNote",list(p.events).length?faNumber(p.events.length)+" رویداد ثبت‌شده":"تقویم تکمیل نشده");
    setText("summaryQuality",missing.length?"نیازمند بازبینی":"کنترل‌ها تکمیل");setText("qualityNote",missing.length?faNumber(missing.length)+" مورد باز مانده":"این وضعیت تضمین سود نیست");
    renderAssetTabs(p);renderTimeframes(p);renderChart(a,p,chart);renderThesis(p);renderPrimaryScenario(p);renderNextEvent(p);
    renderScenarios(p);renderStructure(p,a);renderRisk(p);renderCalendar(p);renderHistory();
  }
  function renderAssetTabs(p){
    setHtml("assetTabs",list(p.assets).map((a,i)=>'<button type="button" class="asset-tab" role="tab" aria-selected="'+(i===state.assetIndex)+'" data-asset-index="'+i+'">'+esc(a.symbol||a.name||("Asset "+(i+1)))+'</button>').join(""));
    const a=activeAsset();if(!a)return;
    setText("symbolAvatar",str(a.symbol,"—").slice(0,4));setText("chartSymbol",str(a.name,a.symbol||"نماد"));setText("chartSubtitle",str(a.summary,"تحلیل و دادهٔ تأییدشده برای این نماد."));
    const b=$("chartBias");b.textContent=biasLabel(a.bias);b.className="bias-pill bias-"+(a.bias||"neutral");
    setText("chartReferencePrice",str(a.referencePrice,"ثبت نشده"));setText("chartReferenceTime",str(a.referenceAt||a.referenceSource,"منبع/زمان ثبت نشده"));
    const charts=list(a.charts);
    setHtml("timeframeTabs",charts.map(c=>'<button type="button" class="tf-tab" data-timeframe="'+esc(c.timeframe)+'" aria-pressed="'+(c.timeframe===state.timeframe)+'" '+(!list(c.candles).length?'disabled':'')+'>'+esc(c.timeframe)+'</button>').join(""));
  }
  function renderChart(a,p,chart){
    const candles=list(chart&&chart.candles);const canvas=$("priceChart");
    $("chartEmpty").hidden=candles.length>0;
    setText("chartDataStrip", "");
    $("chartDataStrip").innerHTML='<span>کندل‌ها: '+esc(faNumber(candles.length))+'</span><span>آخرین زمان: '+esc(candles.length?formatTime(candles[candles.length-1].time):"—")+'</span><span>تایم‌فریم: '+esc(chart&&chart.timeframe||"—")+'</span>';
    const levels=assetLevels(p,a).filter(l=>num(l.price)!==null);
    const zones=assetZones(p,a).filter(z=>num(z.low)!==null&&num(z.high)!==null);
    const marks=list(chart&&chart.markers);
    state.chartGeometry={candles,levels,zones,marks};
    drawChart(canvas,candles,levels,zones,marks);
    setText("chartReferenceTime",str(a.referenceAt||a.referenceSource,candles.length?"آخرین کندل: "+formatTime(candles[candles.length-1].time):"منبع/زمان ثبت نشده"));
  }
  function formatTime(value){
    const d=typeof value==="number"?new Date(value<1e12?value*1000:value):new Date(value);
    if(Number.isNaN(d.getTime()))return String(value||"—");
    return new Intl.DateTimeFormat("fa-IR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Baku"}).format(d);
  }
  function drawChart(canvas,candles,levels,zones,markers){
    const rect=canvas.getBoundingClientRect();const dpr=Math.max(1,window.devicePixelRatio||1);
    const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle=palette.bg;ctx.fillRect(0,0,w,h);
    const pad={left:18,right:66,top:22,bottom:32};const plotW=w-pad.left-pad.right,plotH=h-pad.top-pad.bottom;
    ctx.strokeStyle=palette.grid;ctx.lineWidth=1;ctx.setLineDash([]);
    for(let i=0;i<=6;i++){const y=pad.top+plotH*i/6;ctx.beginPath();ctx.moveTo(pad.left,y+.5);ctx.lineTo(w-pad.right,y+.5);ctx.stroke();}
    for(let i=0;i<=6;i++){const x=pad.left+plotW*i/6;ctx.beginPath();ctx.moveTo(x+.5,pad.top);ctx.lineTo(x+.5,h-pad.bottom);ctx.stroke();}
    if(!candles.length){ctx.fillStyle=palette.text;ctx.font="10px Tahoma";ctx.textAlign="left";for(let i=0;i<=6;i++){const y=pad.top+plotH*i/6;ctx.fillText("—",w-pad.right+12,y+3);}return;}
    const allPrices=[];
    candles.forEach(c=>{allPrices.push(Number(c.high),Number(c.low));});
    levels.forEach(l=>allPrices.push(Number(l.price)));
    zones.forEach(z=>allPrices.push(Number(z.low),Number(z.high)));
    let min=Math.min.apply(null,allPrices.filter(Number.isFinite)),max=Math.max.apply(null,allPrices.filter(Number.isFinite));
    if(!Number.isFinite(min)||!Number.isFinite(max)){min=0;max=1;}
    const spread=max-min||Math.max(Math.abs(max)*.002,1);min-=spread*.08;max+=spread*.08;
    const yPrice=price=>pad.top+(max-price)/(max-min)*plotH;
    const xAt=i=>pad.left+plotW*(i+.5)/candles.length;
    const step=plotW/candles.length,candleW=Math.max(2,Math.min(11,step*.58));
    zones.forEach(z=>{const top=yPrice(Math.max(Number(z.low),Number(z.high))),bottom=yPrice(Math.min(Number(z.low),Number(z.high)));ctx.fillStyle=z.type==="supply"?"rgba(240,125,135,.09)":"rgba(101,223,180,.09)";ctx.fillRect(pad.left,top,plotW,Math.max(1,bottom-top));ctx.strokeStyle=z.type==="supply"?"rgba(240,125,135,.35)":"rgba(101,223,180,.35)";ctx.setLineDash([3,4]);ctx.strokeRect(pad.left,top,plotW,Math.max(1,bottom-top));ctx.setLineDash([]);});
    levels.forEach(l=>{const y=yPrice(Number(l.price));if(y<pad.top||y>h-pad.bottom)return;ctx.strokeStyle=l.color||palette.amber;ctx.lineWidth=l.importance==="high"?1.3:1;ctx.setLineDash(l.style==="solid"?[]:[4,4]);ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(w-pad.right,y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=l.color||palette.amber;ctx.fillRect(w-pad.right+3,y-8,pad.right-6,16);ctx.fillStyle="#0c1116";ctx.font="9px monospace";ctx.textAlign="center";ctx.fillText(String(l.label||l.name||l.price).slice(0,10),w-pad.right/2,y+3);});
    candles.forEach((c,i)=>{const x=xAt(i),o=yPrice(Number(c.open)),cl=yPrice(Number(c.close)),hi=yPrice(Number(c.high)),lo=yPrice(Number(c.low)),up=Number(c.close)>=Number(c.open),color=up?palette.green:palette.red;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,hi);ctx.lineTo(x,lo);ctx.stroke();const top=Math.min(o,cl),bodyH=Math.max(1,Math.abs(cl-o));ctx.fillRect(x-candleW/2,top,candleW,bodyH);});
    markers.forEach(m=>{const index=candles.findIndex(c=>String(c.time)===String(m.time));if(index<0)return;const c=candles[index],up=m.direction==="bullish";const y=yPrice(up?Number(c.low):Number(c.high))+(up?11:-11);ctx.fillStyle=up?palette.green:palette.red;ctx.beginPath();ctx.moveTo(xAt(index),y+(up?5:-5));ctx.lineTo(xAt(index)-4,y+(up?-3:3));ctx.lineTo(xAt(index)+4,y+(up?-3:3));ctx.closePath();ctx.fill();});
    ctx.fillStyle=palette.text;ctx.font="10px monospace";ctx.textAlign="left";
    for(let i=0;i<=6;i++){const price=max-(max-min)*i/6;ctx.fillText(price.toFixed(price>=100?2:5).replace(/0+$/,"").replace(/\.$/,""),w-pad.right+7,pad.top+plotH*i/6+3);}
    ctx.textAlign="center";ctx.fillStyle=palette.muted;
    [0,Math.floor((candles.length-1)/3),Math.floor((candles.length-1)*2/3),candles.length-1].forEach(i=>{const x=xAt(i);ctx.fillText(String(formatTime(candles[i].time)).replace(/\u200e/g,""),x,h-11);});
    state.chartGeometry={candles,levels,zones,markers,plot:{left:pad.left,top:pad.top,width:plotW,height:plotH,min,max,w,h,dpr}};
  }
  function renderThesis(p){
    setText("planThesis",str(p.thesis,"برداشت اصلی روز ثبت نشده است."));
    setText("thesisDayType","نوع روز: "+str(p.dayType,"نامشخص"));setText("thesisRegime","رژیم: "+str(p.regime,"ثبت نشده"));
  }
  function renderPrimaryScenario(p){
    const s=list(p.scenarios).find(x=>x.enabled!==false)||list(p.scenarios)[0];
    if(!s){setHtml("primaryScenario",empty("سناریویی ثبت نشده است."));return;}
    setHtml("primaryScenario",'<h4 class="scenario-priority-title">'+esc(s.name||"سناریوی شرطی")+'</h4><div class="scenario-priority-meta"><span>'+esc(directionLabel(s.direction))+'</span><span>'+esc(s.timeframe||"TF ثبت نشده")+'</span></div><p class="scenario-priority-trigger"><b>تریگر:</b> '+esc(s.trigger||"ثبت نشده")+'</p>');
  }
  function renderNextEvent(p){
    const events=list(p.events).slice().sort((a,b)=>String(a.time||"99:99").localeCompare(String(b.time||"99:99")));
    const e=events[0];if(!e){setHtml("nextEvent",empty("رویدادی ثبت نشده است."));return;}
    setHtml("nextEvent",'<div class="event-card-mini"><span class="event-card-time">'+esc(e.time||"—")+'</span><div><strong>'+esc(e.name||"رویداد اقتصادی")+'</strong><p>'+esc(e.description||e.condition||"جزئیات ثبت نشده")+'</p><span class="impact-tag impact-'+esc(e.impact||"low")+'">اهمیت '+esc(impactLabel(e.impact))+'</span></div></div>');
  }
  function renderScenarios(p){
    const scenarios=list(p.scenarios);setText("scenarioCount",faNumber(scenarios.length));
    setHtml("scenariosGrid",scenarios.length?scenarios.map((s,i)=>{
      const dir=s.direction||"neutral",klass=dir==="bullish"?"bullish":dir==="bearish"?"bearish":"neutral",arrow=dir==="bullish"?"↗":dir==="bearish"?"↘":"↔";
      const fields=[["تأیید",s.confirmation],["ابطال",s.invalidation],["ورود",s.entry],["مدیریت",s.management],["ریسک خاص",s.riskNote]];
      return '<article class="scenario-card '+klass+(s.enabled===false?' disabled-scenario':'')+'"><div class="scenario-card-head"><div class="scenario-card-title"><span class="direction-icon">'+arrow+'</span><div><h3>'+esc(s.name||"سناریو "+(i+1))+'</h3><p>'+esc(s.timeframe||"تایم‌فریم ثبت نشده")+' · '+esc(directionLabel(dir))+'</p></div></div><span class="scenario-state">'+(s.enabled===false?"غیرفعال":"مشروط")+'</span></div><div class="scenario-trigger"><b>شرط فعال‌سازی:</b> '+esc(s.trigger||"ثبت نشده")+'</div><div class="scenario-fields">'+fields.filter(x=>x[1]).map(x=>'<div class="scenario-field"><span>'+esc(x[0])+'</span><p>'+esc(x[1])+'</p></div>').join("")+'</div><div class="scenario-prices"><div class="scenario-price"><span>ورود</span><strong>'+esc(s.entryPrice||"مشروط")+'</strong></div><div class="scenario-price"><span>حد ضرر</span><strong>'+esc(s.stopLoss||"ثبت نشده")+'</strong></div><div class="scenario-price"><span>اهداف</span><strong>'+esc(s.targets||"ثبت نشده")+'</strong></div></div></article>';
    }).join(""):empty("برای این روز سناریویی ثبت نشده است."));
    const avoid=list(p.avoid);$("avoidPanel").hidden=!avoid.length;
    if(avoid.length)setHtml("avoidPanel",'<h3>شرایط عدم معامله</h3><ul>'+avoid.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>');
  }
  function renderTimeframes(p){
    const frames=list(p.timeframes);
    setHtml("timeframesGrid",frames.length?frames.map(f=>'<article class="timeframe-card"><div class="timeframe-top"><strong>'+esc(f.tf||"TF")+'</strong><span class="trend-pill '+esc(f.bias||"neutral")+'">'+esc(biasLabel(f.bias))+'</span></div><p>'+esc(f.read||"خوانش ثبت نشده")+'</p></article>').join(""):empty("تحلیل چندتایم‌فریمی ثبت نشده است."));
  }
  function renderStructure(p,a){
    const levels=assetLevels(p,a);$("levelsEmpty").hidden=levels.length>0;
    setHtml("levelsBody",levels.map(l=>'<tr><td>'+esc(l.name||"سطح")+'</td><td>'+esc(str(l.price,"—"))+'</td><td>'+esc(l.type||"—")+'</td><td>'+esc(l.timeframe||"—")+'</td><td><span class="importance '+esc(l.importance||"low")+'">'+esc(importanceLabel(l.importance))+'</span></td><td>'+esc(l.reaction||l.description||"دلیل واکنش ثبت نشده")+'</td></tr>').join(""));
    const zones=assetZones(p,a);
    setHtml("zonesList",zones.length?zones.map(z=>'<article class="stack-card"><div class="stack-card-head"><div><h4>'+esc(z.name||"ناحیه")+'</h4><p>'+esc(z.description||"توضیح ثبت نشده")+'</p></div><span class="stack-meta">'+esc(z.timeframe||"—")+'</span></div><div class="stack-foot">'+esc(z.range||((z.low!==undefined&&z.high!==undefined)?z.low+" — "+z.high:""))+' · '+esc(z.condition||"شرط واکنش ثبت نشده")+'</div></article>').join(""):empty("ناحیه‌ای ثبت نشده است."));
    const liq=list(a.liquidity).concat(list(p.liquidity).filter(x=>!x.symbol||x.symbol===a.symbol));
    setHtml("liquidityList",liq.length?liq.map(l=>'<article class="stack-card"><div class="stack-card-head"><div><h4>'+esc(l.name||"نقدینگی")+'</h4><p>'+esc(l.description||"توضیح ثبت نشده")+'</p></div><span class="stack-meta">'+esc(l.timeframe||"—")+'</span></div><div class="stack-foot">'+esc(l.price||"سطح ثبت نشده")+' · '+esc(l.condition||"شرط سویپ ثبت نشده")+'</div></article>').join(""):empty("نقدینگی یا سویپی ثبت نشده است."));
  }
  function renderRisk(p){
    const r=p.risk||{};
    const tiles=[["ریسک هر معامله",r.perTrade],["حد زیان روزانه",r.dailyLimit],["حداکثر معاملات",r.maxTrades],["هزینه‌ها",r.costs]];
    setHtml("riskGrid",tiles.map(t=>'<div class="risk-tile"><span>'+esc(t[0])+'</span><strong>'+esc(t[1]||"ثبت نشده")+'</strong><small>باید پیش از اجرا تأیید شود</small></div>').join(""));
    setHtml("riskRules",list(r.rules).length?list(r.rules).map((rule,i)=>'<div class="stack-card risk-rule"><span class="rule-index">'+String(i+1).padStart(2,"0")+'</span><p>'+esc(rule)+'</p></div>').join(""):empty("قاعدهٔ اجرایی ثبت نشده است."));
    setHtml("qualityChecks",list(p.qualityGates).length?list(p.qualityGates).map((g,i)=>'<label class="check-item"><input type="checkbox" disabled '+(g.done===true?'checked':'')+'><span>'+esc(g.item||("کنترل "+(i+1)))+'</span></label>').join(""):empty("کنترل کیفیت ثبت نشده است."));
    setText("reviewPrompt",str(p.review&&p.review.prompt,"پس از جلسه، نتیجه را بدون قضاوت احساسی ثبت کن."));
    setHtml("reviewQuestions",list(p.review&&p.review.questions).map(q=>'<li>'+esc(q)+'</li>').join(""));
  }
  function renderCalendar(p){
    const events=list(p.events);
    setHtml("eventsList",events.length?events.slice().sort((a,b)=>String(a.time||"").localeCompare(String(b.time||""))).map(e=>'<article class="stack-card"><div class="stack-card-head"><div><h4>'+esc(e.name||"رویداد")+'</h4><p>'+esc(e.description||"جزئیات ثبت نشده")+'</p></div><span class="event-time">'+esc(e.time||"—")+'</span></div><div class="stack-foot"><span class="impact-tag impact-'+esc(e.impact||"low")+'">اهمیت '+esc(impactLabel(e.impact))+'</span> '+esc(e.condition||"برنامهٔ واکنش ثبت نشده")+'</div></article>').join(""):empty("رویدادی ثبت نشده است."));
    const sessions=list(p.sessions);
    setHtml("sessionsList",sessions.length?sessions.map(s=>'<article class="stack-card"><div class="stack-card-head"><h4>'+esc(s.name||"سشن")+'</h4><span class="stack-meta">'+esc(s.time||"—")+'</span></div><p>'+esc(s.description||"برنامه ثبت نشده")+'</p></article>').join(""):empty("برنامهٔ سشن‌ها ثبت نشده است."));
    const sources=list(p.sources);
    setHtml("sourcesList",sources.length?sources.map(s=>'<div class="source-item">'+(s.url?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.name||"منبع")+'</a>':esc(s.name||"منبع"))+'<small>'+esc(s.checkedAt||"زمان بررسی ثبت نشده")+'</small></div>').join(""):empty("منبع و زمان بررسی ثبت نشده است."));
  }
  function renderHistory(){
    const query=state.query.trim().toLowerCase();
    const filtered=byDate.filter(p=>!query||[p.date,p.title,p.headline,p.thesis,...list(p.assets).map(a=>a.symbol+" "+a.name)].join(" ").toLowerCase().includes(query));
    setHtml("historyList",filtered.length?filtered.map(p=>'<article class="history-item"><div class="history-date">'+esc(p.date)+'</div><div><strong>'+esc(p.title||"پلن روزانه")+'</strong><p>'+esc(p.headline||"بدون خلاصهٔ روز")+' · '+esc(list(p.assets).map(a=>a.symbol).join("، ")||"بدون نماد")+'</p></div><button class="history-open" type="button" data-open-date="'+esc(p.date)+'">باز کردن ←</button></article>').join(""):empty(query?"نتیجه‌ای در آرشیو پیدا نشد.":"آرشیو هنوز خالی است."));
  }
  function bindEvents(){
    $("planSelect").addEventListener("change",e=>{state.date=e.target.value;state.assetIndex=0;state.timeframe=null;render();});
    $("assetTabs").addEventListener("click",e=>{const b=e.target.closest("[data-asset-index]");if(!b)return;state.assetIndex=Number(b.dataset.assetIndex)||0;state.timeframe=null;render();});
    $("timeframeTabs").addEventListener("click",e=>{const b=e.target.closest("[data-timeframe]");if(!b||b.disabled)return;state.timeframe=b.dataset.timeframe;render();});
    $("historyList").addEventListener("click",e=>{const b=e.target.closest("[data-open-date]");if(!b)return;state.date=b.dataset.openDate;state.assetIndex=0;state.timeframe=null;render();window.scrollTo({top:0,behavior:"smooth"});});
    $("searchInput").addEventListener("input",e=>{state.query=e.target.value;renderHistory();});
    $("printButton").addEventListener("click",()=>window.print());
    $("archiveJump").addEventListener("click",()=>{const history=$("history");if(history)history.scrollIntoView({behavior:"smooth",block:"start"});});
    $("resetChart").addEventListener("click",()=>{const a=activeAsset(),chart=chartFor(a,state.timeframe);if(chart)renderChart(a,activePlan(),chart);});
    const canvas=$("priceChart");
    canvas.addEventListener("pointermove",e=>{
      const g=state.chartGeometry;if(!g||!g.candles.length||!g.plot)return;
      const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,p=g.plot;
      if(x<p.left||x>p.left+p.width||y<p.top||y>p.top+p.height){$("chartTooltip").hidden=true;return;}
      const i=Math.max(0,Math.min(g.candles.length-1,Math.floor((x-p.left)/(p.width/g.candles.length))));
      const c=g.candles[i];$("chartTooltip").hidden=false;
      $("chartTooltip").innerHTML="T "+esc(formatTime(c.time))+"<br>O "+esc(c.open)+"　H "+esc(c.high)+"<br>L "+esc(c.low)+"　C "+esc(c.close);
    });
    canvas.addEventListener("pointerleave",()=>$("chartTooltip").hidden=true);
    let resizeFrame=0;
    window.addEventListener("resize",()=>{if(resizeFrame)return;resizeFrame=window.requestAnimationFrame(()=>{resizeFrame=0;const p=activePlan(),a=activeAsset();if(p&&a)renderChart(a,p,chartFor(a,state.timeframe));});});
    document.querySelectorAll(".section-nav-link").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".section-nav-link").forEach(x=>x.classList.remove("active"));link.classList.add("active");}));
  }
  validateBook();
  if(errors.length){$("emptyState").hidden=false;$("emptyState").innerHTML='<div class="empty-copy"><span class="status-label"><i></i> DATA VALIDATION</span><h2>ساختار داده نیاز به اصلاح دارد</h2><p>'+errors.map(esc).join("<br>")+'</p><a class="doc-link" href="docs/DAILY-PLAN-SPEC.md">استاندارد داده <span>←</span></a></div>';}
  initHeader();bindEvents();
  if(byDate.length){state.date=byDate[0].date;render();}else{renderHistory();}
})();