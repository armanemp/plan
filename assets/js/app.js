(() => {
  "use strict";
  const book = window.PLAN_BOOK && Array.isArray(window.PLAN_BOOK.plans) ? window.PLAN_BOOK : {version:1,timezone:"Asia/Baku",plans:[]};
  const $ = (id) => document.getElementById(id);
  const text = (value, fallback = "ثبت نشده") => value === undefined || value === null || value === "" ? fallback : String(value);
  const list = (value) => Array.isArray(value) ? value : [];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const fa = (value) => value === undefined || value === null || value === "" ? "—" : escapeHtml(value);
  const dateFa = (iso) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return fa(iso);
    const [y,m,d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat("fa-IR-u-ca-gregory",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(y,m-1,d,12)));
  };
  const todayIso = () => {
    const parts = new Intl.DateTimeFormat("en-CA",{timeZone:book.timezone || "Asia/Baku",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
    const v = Object.fromEntries(parts.map(p => [p.type,p.value]));
    return v.year+"-"+v.month+"-"+v.day;
  };
  const biasLabel = (v) => ({bullish:"صعودی",bearish:"نزولی",neutral:"خنثی",conditional:"مشروط",mixed:"ترکیبی"}[v] || text(v,"خنثی"));
  const biasClass = (v) => ["bullish","bearish"].includes(v) ? "bias-"+v : "bias-neutral";
  const trendClass = (v) => ["bullish","bearish"].includes(v) ? v : "neutral";
  const statusLabel = (v) => ({ready:"آمادهٔ مطالعه",draft:"پیش‌نویس",archived:"بایگانی‌شده"}[v] || "وضعیت نامشخص");
  const importanceLabel = (v) => ({high:"زیاد",medium:"متوسط",low:"کم"}[v] || text(v));
  const emptyInline = (message) => '<div class="empty-inline">'+escapeHtml(message || "اطلاعاتی ثبت نشده است.")+"</div>";
  const setHtml = (id, html) => { $(id).innerHTML = html; };
  const normalize = (s) => String(s ?? "").toLocaleLowerCase("fa").replace(/[\u200c\s]/g,"");
  const sortedPlans = list(book.plans).filter(p => p && /^\d{4}-\d{2}-\d{2}$/.test(String(p.date || ""))).slice().sort((a,b)=>b.date.localeCompare(a.date));
  let selectedDate = null;
  let selectedAsset = 0;
  let query = "";

  function renderHeader(){
    $("todayDate").textContent = dateFa(todayIso());
    $("suggestedDate").textContent = dateFa(todayIso());
    $("planCount").textContent = sortedPlans.length ? sortedPlans.length+" پلن ثبت‌شده" : "هنوز پلنی ثبت نشده";
    const select = $("planSelect");
    select.innerHTML = sortedPlans.length ? sortedPlans.map(p=>'<option value="'+escapeHtml(p.date)+'">'+escapeHtml(dateFa(p.date))+" · "+escapeHtml(p.title || "پلن روزانه")+"</option>").join("") : '<option value="">هنوز پلنی ثبت نشده</option>';
    select.disabled = !sortedPlans.length;
  }
  function activePlan(){
    return sortedPlans.find(p=>p.date===selectedDate) || sortedPlans[0] || null;
  }
  function renderAssetTabs(p){
    const assets = list(p.assets);
    selectedAsset = Math.min(selectedAsset,Math.max(0,assets.length-1));
    setHtml("assetTabs",assets.map((a,i)=>'<button type="button" class="asset-tab" role="tab" aria-selected="'+(i===selectedAsset)+'" data-asset="'+i+'">'+escapeHtml(a.symbol || a.name || ("نماد "+(i+1)))+"</button>").join(""));
    const a = assets[selectedAsset];
    if(!a){
      $("instrumentTitle").textContent="نمادی ثبت نشده";
      $("instrumentBias").textContent="خنثی";
      $("instrumentBias").className="bias-badge bias-neutral";
      $("instrumentNotes").textContent="نمادها و تحلیل هرکدام را در فایل داده اضافه کن.";
      $("instrumentRefPrice").textContent="ثبت نشده";
      return;
    }
    $("instrumentTitle").textContent=text(a.name,a.symbol || "نماد");
    $("instrumentBias").textContent=biasLabel(a.bias);
    $("instrumentBias").className="bias-badge "+biasClass(a.bias);
    $("instrumentNotes").textContent=text(a.summary,"برای این نماد توضیحی ثبت نشده است.");
    $("instrumentRefPrice").textContent=text(a.referencePrice,"ثبت نشده");
  }
  function renderTimeframes(p){
    const tfs=list(p.timeframes);
    setHtml("timeframesGrid",tfs.length?tfs.map(t=>'<article class="timeframe-card"><div class="timeframe-top"><strong>'+fa(t.tf)+'</strong><span class="tf-trend '+trendClass(t.bias)+'">'+biasLabel(t.bias)+'</span></div><p>'+fa(t.read)+'</p></article>').join(""):emptyInline("تحلیل تایم‌فریم‌ها ثبت نشده است."));
  }
  function renderLevels(p){
    const rows=list(p.levels);
    $("levelsEmpty").hidden=rows.length>0;
    $("levelsBody").innerHTML=rows.map(l=>'<tr><td><span class="level-name">'+fa(l.name)+'</span><br><span class="level-tag">'+fa(l.type,"سطح")+'</span></td><td>'+fa(l.price)+'</td><td><span class="importance '+(l.importance||"medium")+'">'+importanceLabel(l.importance)+'</span></td><td>'+fa(l.timeframe)+'</td><td>'+fa(l.reaction)+'</td></tr>').join("");
  }
  function renderStack(id,items,kind){
    if(!items.length){setHtml(id,emptyInline("برای این بخش موردی ثبت نشده است."));return;}
    setHtml(id,items.map(item=>{
      const title=kind==="event"?text(item.name,"رویداد"):text(item.name,"");
      const meta=kind==="event"?'<span class="event-time">'+fa(item.time,"زمان نامشخص")+'</span>':'<span class="stack-meta">'+fa(item.range || item.price || item.timeframe,"")+'</span>';
      const badge=kind==="event"?'<span class="event-impact impact-'+(item.impact||"low")+'">'+importanceLabel(item.impact)+'</span>':(item.tag?'<span class="stack-meta">'+fa(item.tag)+'</span>':"");
      return '<article class="stack-card"><div class="stack-card-head"><div><h4>'+escapeHtml(title)+'</h4><p>'+fa(item.description || item.reason || item.details)+'</p></div><div>'+meta+badge+'</div></div>'+(item.condition?'<div class="stack-foot">شرط / نکته: '+fa(item.condition)+'</div>':"")+'</article>';
    }).join(""));
  }
  function renderScenarios(p){
    const scenarios=list(p.scenarios);
    setHtml("scenariosGrid",scenarios.length?scenarios.map((s,i)=>{
      const dir=s.direction || "neutral",rows=[["شرط فعال‌سازی",s.trigger],["تأیید لازم",s.confirmation],["ابطال سناریو",s.invalidation],["مدیریت پس از ورود",s.management],["هدف‌ها",s.targets],["ممنوعیت / ریسک",s.riskNote]].filter(r=>r[1]);
      const cells=[["ورود",s.entry],["حد ضرر",s.stopLoss],["اهداف",s.targets]].map(c=>'<div class="trade-cell"><span>'+escapeHtml(c[0])+'</span><strong>'+fa(c[1])+'</strong></div>').join("");
      return '<article class="scenario-card scenario-'+(dir==="bullish"?"bullish":dir==="bearish"?"bearish":"neutral")+'"><div class="scenario-head"><div class="scenario-title-wrap"><div class="scenario-icon">'+(dir==="bullish"?"↗":dir==="bearish"?"↘":"↔")+'</div><div><h3>'+fa(s.name,"سناریو "+(i+1))+'</h3><p>'+biasLabel(dir)+' · '+fa(s.timeframe,"تایم‌فریم ثبت نشده")+'</p></div></div><span class="status-badge '+(s.enabled===false?"status-archived":"status-ready")+'">'+(s.enabled===false?"غیرفعال":"مشروط")+'</span></div><div class="scenario-condition"><b>منطق:</b> '+fa(s.logic,"منطق سناریو ثبت نشده است.")+'</div><div class="scenario-body">'+rows.map(r=>'<div class="scenario-row"><span>'+escapeHtml(r[0])+'</span><p>'+fa(r[1])+'</p></div>').join("")+'</div><div class="scenario-trade">'+cells+'</div></article>';
    }).join(""):emptyInline("سناریویی ثبت نشده است. تا مشخص شدن شرط ورود و ابطال، از حدس‌زدن خودداری کن."));
    const avoid=list(p.avoid);
    $("avoidList").hidden=!avoid.length;
    if(avoid.length)setHtml("avoidList",'<h3>چه زمانی معامله نکنیم؟</h3><ul>'+avoid.map(x=>"<li>"+escapeHtml(x)+"</li>").join("")+"</ul>");
  }
  function renderEvents(p){
    renderStack("eventsList",list(p.events),"event");
    renderStack("sessionsGrid",list(p.sessions),"session");
  }
  function renderRisk(p){
    const r=p.risk || {};
    const tiles=[["ریسک هر معامله",r.perTrade,"از سرمایه؛ نه از حدس"],["حد زیان روزانه",r.dailyLimit,"در صورت رسیدن، توقف"],["حداکثر معاملات",r.maxTrades,"با احتساب ورودهای مجدد"],["هزینهٔ معامله",r.costs,"اسپرد، کمیسیون و لغزش"]];
    setHtml("riskTiles",tiles.map(t=>'<article class="risk-tile"><span>'+escapeHtml(t[0])+'</span><strong>'+fa(t[1])+'</strong><small>'+escapeHtml(t[2])+'</small></article>').join(""));
    const rules=list(r.rules);
    setHtml("riskRules",rules.length?rules.map((v,i)=>'<article class="stack-card risk-rule"><span class="rule-marker">'+String(i+1).padStart(2,"0")+'</span><p>'+escapeHtml(v)+'</p></article>').join(""):emptyInline("قواعد ریسک روزانه ثبت نشده است."));
    const checks=list(p.checklist);
    setHtml("checklistGrid",checks.length?checks.map((v,i)=>'<label class="check-item"><input type="checkbox" data-check="'+i+'"><span>'+escapeHtml(v)+'</span></label>').join(""):emptyInline("چک‌لیست پیش از معامله ثبت نشده است."));
    const review=p.review || {};
    setHtml("reviewPanel",'<div><h3>یادداشت پس از جلسه</h3><p>'+fa(review.prompt,"پس از پایان روز، کیفیت اجرای پلن و خطاهای تصمیم‌گیری را ثبت کن.")+'</p></div><div><ul>'+list(review.questions || ["آیا شرط ورود دقیقاً رعایت شد؟","آیا ریسک طبق برنامه باقی ماند؟","چه چیزی باید فردا تغییر کند؟"]).map(q=>"<li>"+escapeHtml(q)+"</li>").join("")+"</ul></div>");
  }
  function renderHistory(){
    const visible=sortedPlans.filter(p=>normalize([p.date,p.title,p.headline,...list(p.assets).flatMap(a=>[a.name,a.symbol,a.summary])].join(" ")).includes(normalize(query)));
    setHtml("historyList",visible.length?visible.map(p=>'<article class="history-item"><div class="history-date">'+escapeHtml(p.date)+'</div><div><strong>'+fa(p.title,"پلن روزانه")+'</strong><p>'+fa(p.headline,"بدون خلاصهٔ روز")+'</p></div><button type="button" class="history-open" data-open-date="'+escapeHtml(p.date)+'">مشاهدهٔ پلن ←</button></article>').join(""):emptyInline(query?"نتیجه‌ای در آرشیو پیدا نشد.":"آرشیو هنوز خالی است."));
  }
  function renderPlan(p){
    $("emptyState").hidden=!!p;
    $("workspace").hidden=!p;
    if(!p)return;
    selectedDate=p.date;
    $("planSelect").value=p.date;
    $("planTitle").textContent=text(p.title,"پلن معاملاتی");
    $("planDate").textContent=dateFa(p.date);
    $("planMeta").textContent=[text(p.session,"جلسه ثبت نشده"),"زمان: "+(p.timezone || book.timezone || "Asia/Baku")].join(" · ");
    $("planStatus").textContent=statusLabel(p.status);
    $("planStatus").className="status-badge "+(p.status==="ready"?"status-ready":p.status==="archived"?"status-archived":"status-draft");
    const missing=list(p.qualityGates).filter(g=>!g.done);
    $("readinessBanner").hidden=p.status==="ready" && missing.length===0;
    if(!$("readinessBanner").hidden)$("readinessBanner").textContent=p.status==="ready"&&missing.length?"وضعیت آماده ثبت شده، اما "+missing.length+" کنترل کیفیت هنوز تکمیل نشده است. پیش از اتکا به این پلن، موارد را بررسی کن.":"این پلن پیش‌نویس است؛ تا تأیید قیمت‌ها، زمان خبر و شرط ابطال، آن را برنامهٔ نهایی تلقی نکن.";
    $("headline").textContent=text(p.headline,"برداشت اصلی روز ثبت نشده است.");
    $("thesis").textContent=text(p.thesis,"خلاصهٔ تحلیلی روز ثبت نشده است.");
    $("dayType").textContent="نوع روز: "+text(p.dayType);
    $("marketRegime").textContent="رژیم بازار: "+text(p.regime);
    $("metricBias").textContent=biasLabel(p.bias);
    $("metricBiasNote").textContent=text(p.biasNote,"فقط در صورت تحقق شرط");
    $("metricQuality").textContent=text(p.quality,"ثبت نشده");
    $("metricFocus").textContent=list(p.assets).length+" نماد";
    $("metricEvents").textContent=list(p.events).filter(e=>e.impact==="high").length+" خبر مهم";
    $("metricEventsNote").textContent=list(p.events).length?list(p.events).length+" رویداد ثبت‌شده":"تقویم خبر تکمیل نشده";
    renderAssetTabs(p);renderTimeframes(p);renderLevels(p);
    renderStack("zonesGrid",list(p.zones),"zone");renderStack("liquidityGrid",list(p.liquidity),"liquidity");
    renderScenarios(p);renderEvents(p);renderRisk(p);renderHistory();
  }
  function render(){
    const p=activePlan();renderPlan(p);renderHistory();
  }
  $("planSelect").addEventListener("change",e=>{selectedDate=e.target.value;selectedAsset=0;render();});
  $("searchInput").addEventListener("input",e=>{query=e.target.value;renderHistory();});
  $("assetTabs").addEventListener("click",e=>{const b=e.target.closest("[data-asset]");if(!b)return;selectedAsset=Number(b.dataset.asset)||0;const p=activePlan();if(p)renderAssetTabs(p);});
  $("historyList").addEventListener("click",e=>{const b=e.target.closest("[data-open-date]");if(!b)return;selectedDate=b.dataset.openDate;selectedAsset=0;render();window.scrollTo({top:0,behavior:"smooth"});});
  $("printButton").addEventListener("click",()=>window.print());
  document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(a=>a.classList.remove("active"));link.classList.add("active");}));
  renderHeader();
  if(sortedPlans.length){selectedDate=sortedPlans[0].date;render();}else{renderPlan(null);renderHistory();}
})();