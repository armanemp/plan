/* قرارداد داده v2؛ فقط قیمت/خبر تأییدشده وارد شود. راهنما: docs/DAILY-PLAN-SPEC.md */
window.PLAN_BOOK = {
  version: 2,
  timezone: "Asia/Baku",
  plans: [
    {
      date: "2026-10-12",
      title: "پلن بازار — دوشنبه ۱۲ اکتبر",
      status: "draft",
      timezone: "Asia/Baku",
      session: "آسیا / لندن / نیویورک",
      bias: "conditional",
      biasNote: "هیچ جهت اجرایی بدون شکست و بازآزمایی سطح تأیید نمی‌شود",
      dayType: "احتمال نوسان نامنظم",
      regime: "بازگشت از افت هفتگی؛ زیر مقاومت‌های جمعه",
      headline: "طلا نزدیک سقف جمعه بسته شده، اما تا شکست 4207.69 تأیید صعود نداریم؛ تعطیلی بانک‌ها و اوراق آمریکا می‌تواند نقدشوندگی را کم کند.",
      thesis: "جمعه طلا پس از افت تا کف دوماهه در اوایل هفته، با خرید در افت به 4194.46 برگشت و نزدیک سقف روز/هفته بسته شد. این بازیابی به‌تنهایی تغییر روند را ثابت نمی‌کند. برای XAUUSD مرز تصمیم اولیه 4207.69 در بالا و 4130.52 در پایین است. EURUSD و GBPUSD نیز در محدودهٔ روز جمعه بسته شده‌اند؛ بهتر است در این روز کم‌داده فقط شکست و بازآزمایی تأییدشده بررسی شود. داده‌های چارت این رکورد روزانه‌اند، نه قیمت زنده؛ برای ورود دقیق باید چارت M15/M5 و هزینهٔ واقعی بروکر بررسی شود.",
      assets: [
        {
          symbol: "XAUUSD",
          name: "Gold / XAUUSD",
          bias: "conditional",
          referencePrice: "4194.46 USD",
          referenceAt: "2026-10-09 close · بررسی 2026-10-11",
          referenceSource: "Investing.com · Historical Data",
          summary: "بازیابی تند از کف هفتگی و بسته‌شدن نزدیک سقف جمعه؛ تا عبور و تثبیت بالای 4207.69، صعود تأیید نشده است.",
          charts: [
            {
              timeframe: "D1",
              candles: [
                { time: "2026-10-05T00:00:00+04:00", open: 4144.15, high: 4170.51, low: 4122.90, close: 4139.89, volume: null },
                { time: "2026-10-06T00:00:00+04:00", open: 4141.35, high: 4184.46, low: 4104.32, close: 4164.35, volume: null },
                { time: "2026-10-07T00:00:00+04:00", open: 4164.65, high: 4170.12, low: 4066.06, close: 4111.05, volume: null },
                { time: "2026-10-08T00:00:00+04:00", open: 4110.40, high: 4146.30, low: 4103.13, close: 4134.93, volume: null },
                { time: "2026-10-09T00:00:00+04:00", open: 4134.70, high: 4207.69, low: 4130.52, close: 4194.46, volume: null }
              ],
              markers: []
            }
          ],
          levels: [
            { name: "سقف جمعه / مقاومت", type: "Weekly high", price: "4207.69", timeframe: "D1", importance: "high", reaction: "شکست با بسته‌شدن M15 و بازآزمایی حفظ‌شده؛ نفوذ سایه‌ای کافی نیست.", color: "#e7bd79", style: "dashed" },
            { name: "کف جمعه / حمایت", type: "Friday low", price: "4130.52", timeframe: "D1", importance: "high", reaction: "از دست‌رفتن با بسته‌شدن M15 می‌تواند مسیر بررسی کف‌های قبلی را باز کند.", color: "#8fb9f4", style: "dashed" },
            { name: "کف پنج‌شنبه", type: "Daily swing low", price: "4103.13", timeframe: "D1", importance: "medium", reaction: "حمایت روزانهٔ بعدی؛ فقط در صورت شکست 4130.52 مرتبط می‌شود.", color: "#8fb9f4", style: "dashed" },
            { name: "کف چهارشنبه", type: "Daily swing low", price: "4066.06", timeframe: "D1", importance: "medium", reaction: "کف مهم هفته؛ هدف تضمین‌شده نیست و نیازمند ادامهٔ فشار فروش است.", color: "#8fb9f4", style: "dashed" },
            { name: "حمایت روانی گزارش‌شده", type: "Round number / context", price: "4000", timeframe: "D1", importance: "low", reaction: "سطح گرد و زمینه‌ای؛ برای تصمیم کوتاه‌مدت جایگزین ساختار intraday نیست.", color: "#8fb9f4", style: "dashed" }
          ],
          zones: [],
          liquidity: [
            { name: "نقدینگی بالای سقف جمعه", price: "4207.69", timeframe: "D1", description: "سقف روز جمعه و بیشینهٔ بازهٔ پنج‌روزهٔ ثبت‌شده.", condition: "سویپ بدون تثبیت را شکست معتبر حساب نکن؛ بسته‌شدن و بازآزمایی را ببین." },
            { name: "نقدینگی زیر کف جمعه", price: "4130.52", timeframe: "D1", description: "کف روز جمعه؛ سطح تصمیم برای سناریوی نزولی.", condition: "شکست و بازگشت سریع به بالای سطح، ادامهٔ نزول را تأیید نمی‌کند." }
          ]
        },
        {
          symbol: "EURUSD",
          name: "Euro / US Dollar",
          bias: "conditional",
          referencePrice: "1.1201",
          referenceAt: "2026-10-09 close · بررسی 2026-10-11",
          referenceSource: "ChartExchange · Historical Prices",
          summary: "بسته‌شدن درون محدودهٔ جمعه؛ بین 1.1186 و 1.1243 هنوز مزیت جهتی واضحی از دادهٔ روزانه دیده نمی‌شود.",
          charts: [
            {
              timeframe: "D1",
              candles: [
                { time: "2026-10-05T00:00:00+04:00", open: 1.1253, high: 1.1256, low: 1.1160, close: 1.1217, volume: null },
                { time: "2026-10-06T00:00:00+04:00", open: 1.1217, high: 1.1277, low: 1.1202, close: 1.1253, volume: null },
                { time: "2026-10-07T00:00:00+04:00", open: 1.1253, high: 1.1255, low: 1.1164, close: 1.1200, volume: null },
                { time: "2026-10-08T00:00:00+04:00", open: 1.1200, high: 1.1227, low: 1.1170, close: 1.1213, volume: null },
                { time: "2026-10-09T00:00:00+04:00", open: 1.1212, high: 1.1243, low: 1.1186, close: 1.1201, volume: null }
              ],
              markers: []
            }
          ],
          levels: [
            { name: "سقف جمعه", type: "Daily high", price: "1.1243", timeframe: "D1", importance: "high", reaction: "بسته‌شدن M15 بالای سطح و بازآزمایی حفظ‌شده، شرط بررسی سناریوی صعودی است.", color: "#e7bd79", style: "dashed" },
            { name: "سقف سه‌شنبه", type: "Swing high", price: "1.1277", timeframe: "D1", importance: "medium", reaction: "مقاومت روزانهٔ بالاتر؛ فقط پس از عبور از 1.1243 مطرح می‌شود.", color: "#e7bd79", style: "dashed" },
            { name: "کف جمعه", type: "Daily low", price: "1.1186", timeframe: "D1", importance: "high", reaction: "بسته‌شدن M15 زیر سطح و بازآزمایی ناموفق شرط سناریوی نزولی است.", color: "#8fb9f4", style: "dashed" },
            { name: "کف چهارشنبه", type: "Swing low", price: "1.1164", timeframe: "D1", importance: "medium", reaction: "حمایت پایین‌تر در صورت شکست کف جمعه.", color: "#8fb9f4", style: "dashed" },
            { name: "کف دوشنبه", type: "Daily low", price: "1.1160", timeframe: "D1", importance: "low", reaction: "کف ابتدای هفتهٔ قبل؛ فقط در ادامهٔ شکست نزولی اهمیت دارد.", color: "#8fb9f4", style: "dashed" }
          ],
          zones: [],
          liquidity: [
            { name: "بالای محدودهٔ جمعه", price: "1.1243", timeframe: "D1", description: "بالاترین قیمت جمعه.", condition: "تثبیت بالای سطح لازم است؛ سایهٔ تنها، شکست محسوب نمی‌شود." },
            { name: "زیر محدودهٔ جمعه", price: "1.1186", timeframe: "D1", description: "پایین‌ترین قیمت جمعه.", condition: "پس از شکست، بازآزمایی و ساختار M5 را بررسی کن." }
          ]
        },
        {
          symbol: "GBPUSD",
          name: "British Pound / US Dollar",
          bias: "conditional",
          referencePrice: "1.3233",
          referenceAt: "2026-10-09 close · بررسی 2026-10-11",
          referenceSource: "ChartExchange · Historical Prices",
          summary: "قیمت جمعه داخل محدودهٔ هفتگی 1.3183 تا 1.3285 بسته شد؛ سخنرانی‌های اعضای MPC می‌توانند محرک نوسان باشند.",
          charts: [
            {
              timeframe: "D1",
              candles: [
                { time: "2026-10-05T00:00:00+04:00", open: 1.3242, high: 1.3244, low: 1.3189, close: 1.3218, volume: null },
                { time: "2026-10-06T00:00:00+04:00", open: 1.3218, high: 1.3285, low: 1.3200, close: 1.3266, volume: null },
                { time: "2026-10-07T00:00:00+04:00", open: 1.3266, high: 1.3268, low: 1.3192, close: 1.3213, volume: null },
                { time: "2026-10-08T00:00:00+04:00", open: 1.3213, high: 1.3249, low: 1.3183, close: 1.3228, volume: null },
                { time: "2026-10-09T00:00:00+04:00", open: 1.3228, high: 1.3251, low: 1.3204, close: 1.3233, volume: null }
              ],
              markers: []
            }
          ],
          levels: [
            { name: "سقف جمعه", type: "Daily high", price: "1.3251", timeframe: "D1", importance: "medium", reaction: "سطح نزدیک؛ شکست آن به‌تنهایی برای روند کافی نیست.", color: "#e7bd79", style: "dashed" },
            { name: "سقف سه‌شنبه", type: "Weekly swing high", price: "1.3285", timeframe: "D1", importance: "high", reaction: "عبور و بازآزمایی حفظ‌شده شرط قوی‌تر برای ادامهٔ صعود است.", color: "#e7bd79", style: "dashed" },
            { name: "کف جمعه", type: "Daily low", price: "1.3204", timeframe: "D1", importance: "medium", reaction: "از دست‌رفتن با تأیید M15، مسیر کف‌های قبلی را مطرح می‌کند.", color: "#8fb9f4", style: "dashed" },
            { name: "کف پنج‌شنبه", type: "Swing low", price: "1.3183", timeframe: "D1", importance: "high", reaction: "کف مهم هفته؛ هدف فقط در صورت شکست و ادامهٔ فشار فروش.", color: "#8fb9f4", style: "dashed" }
          ],
          zones: [],
          liquidity: [
            { name: "نقدینگی بالای سقف هفتگی", price: "1.3285", timeframe: "D1", description: "سقف ثبت‌شده در سه‌شنبه.", condition: "سویپ و برگشت را از شکست و تثبیت جدا کن." },
            { name: "نقدینگی زیر کف هفتگی", price: "1.3183", timeframe: "D1", description: "کف ثبت‌شده در پنج‌شنبه.", condition: "فقط شکست تأییدشده و retest ناموفق، ادامهٔ نزول را تقویت می‌کند." }
          ]
        }
      ],
      timeframes: [
        { tf: "D1", bias: "conditional", read: "دادهٔ OHLC روزانه تا جمعه 9 اکتبر ثبت شده؛ سطح‌ها از همین بازه استخراج شده‌اند." },
        { tf: "H4", bias: "conditional", read: "کندل‌های H4 در این رکورد موجود نیست؛ ساختار دقیق را پیش از جلسه از چارت بروکر بررسی کن." },
        { tf: "H1", bias: "conditional", read: "محدودهٔ داخل روز و سطوح اجرایی هنوز تأیید نشده‌اند." },
        { tf: "M15", bias: "neutral", read: "شرط شکست/بازآزمایی باید با کندل بسته‌شدهٔ M15 تأیید شود؛ داده در این رکورد نیست." },
        { tf: "M5", bias: "neutral", read: "تریگر و حد ضرر دقیق فقط پس از دیدن ساختار M5 و اسپرد بروکر تعیین می‌شود." }
      ],
      levels: [],
      zones: [],
      liquidity: [],
      scenarios: [
        {
          name: "طلا — شکست صعودی",
          direction: "bullish",
          timeframe: "D1 context → M15/M5 trigger",
          enabled: true,
          logic: "قیمت جمعه نزدیک سقف روز بسته شد و دو روز متوالی بازیابی داشت؛ با این حال مقاومت 4207.69 هنوز شکسته نشده است.",
          trigger: "بسته‌شدن M15 بالای 4207.69 و بازآزمایی موفق سطح؛ فقط با اسپرد عادی.",
          confirmation: "ساختار صعودی M15 و تریگر M5 پس از retest؛ ورود روی سایهٔ شکست ممنوع.",
          invalidation: "بازگشت زیر 4207.69 و از دست‌رفتن کف retest؛ سطح دقیق M5 پیش از ورود ثبت شود.",
          entry: "بعد از retest تأییدشده؛ قیمت ورود عددی تا بررسی چارت intraday ثبت نمی‌شود.",
          entryPrice: "مشروط به retest",
          stopLoss: "زیر کف ساختاری M5 + هزینه‌ها؛ عدد هنوز تعیین نشده",
          targets: "هدف روزانهٔ بالاتر فقط پس از شکست معتبر؛ هدف عددی بدون ساختار intraday تعیین نمی‌شود",
          management: "ریسک ثابت؛ اگر شکست سریعاً برگشت و سطح حفظ نشد، سناریو لغو شود.",
          riskNote: "تعطیلی بانک‌های آمریکا و کانادا می‌تواند نقدشوندگی و اسپرد را غیرعادی کند."
        },
        {
          name: "طلا — شکست نزولی",
          direction: "bearish",
          timeframe: "D1 context → M15/M5 trigger",
          enabled: true,
          logic: "اگر بازیابی جمعه شکست بخورد و حمایت 4130.52 از دست برود، کف‌های روزانهٔ پایین‌تر به‌عنوان سطوح بررسی مطرح می‌شوند.",
          trigger: "رد شدن واضح از مقاومت و سپس بسته‌شدن M15 زیر 4130.52؛ بازآزمایی زیر سطح باید ناموفق بماند.",
          confirmation: "ساختار نزولی M15 و تریگر M5 پس از retest؛ ورود پیش از بسته‌شدن کندل ممنوع.",
          invalidation: "بازپس‌گیری و تثبیت بالای 4130.52 پس از شکست؛ حد دقیق را با سقف retest M5 تعیین کن.",
          entry: "پس از retest ناموفق زیر 4130.52؛ ورود مستقیم روی کندل خبر یا سایه ممنوع.",
          entryPrice: "مشروط به retest زیر 4130.52",
          stopLoss: "بالای سقف ساختاری retest M5 + هزینه‌ها؛ عدد هنوز تعیین نشده",
          targets: "سطوح تاریخی بعدی: 4103.13 سپس 4066.06؛ رسیدن تضمین‌شده نیست",
          management: "اگر قیمت سطح 4130.52 را سریع پس گرفت، از ادامهٔ سناریو صرف‌نظر کن.",
          riskNote: "قبل از اجرا اسپرد، لغزش و باز بودن بازار نقدی/آتی را بررسی کن."
        },
        {
          name: "فارکس — شکست محدوده، نه پیش‌بینی",
          direction: "neutral",
          timeframe: "M15/M5",
          enabled: true,
          logic: "EURUSD و GBPUSD هر دو داخل محدوده‌های روزانهٔ اخیر بسته شده‌اند و دوطرفه‌بودن حرکت محتمل است.",
          trigger: "تا زمانی که قیمت از سطح کلیدی نماد عبور نکند و بازآزمایی ندهد، ورود نداریم.",
          confirmation: "بسته‌شدن M15 بیرون محدوده، retest، سپس تریگر M5.",
          invalidation: "بازگشت به داخل محدوده پس از شکست؛ این وضعیت برای ورود تعقیبی مناسب نیست.",
          entry: "در میانهٔ محدوده ورود نداریم؛ فقط پس از شکست و retest.",
          entryPrice: "بدون شکست، ورود نداریم",
          stopLoss: "پس از شکل‌گیری retest روی M5 تعیین شود",
          targets: "EURUSD: 1.1243 / 1.1186؛ GBPUSD: 1.3285 / 1.3183",
          management: "در زمان سخنرانی‌های بانک مرکزی، گسترش اسپرد و لغزش را در نظر بگیر.",
          riskNote: "این روز برای معاملهٔ اجباری نیست؛ نبودن تریگر یعنی عدم معامله."
        }
      ],
      avoid: [
        "از ورود در میانهٔ محدودهٔ روزانه بدون شکست و بازآزمایی خودداری کن.",
        "اگر اسپرد XAUUSD به‌علت تعطیلی بازارهای آمریکا/کانادا غیرعادی است، معامله را کنار بگذار.",
        "قبل از تعیین عدد دقیق ورود، حد ضرر و اندازهٔ پوزیشن، چارت M15/M5 بروکر و هزینه‌ها باید بررسی شوند.",
        "داده‌های کندل این صفحه تا جمعه 9 اکتبر هستند؛ آن‌ها را قیمت زندهٔ دوشنبه فرض نکن."
      ],
      events: [
        { time: "13:30", name: "سخنرانی Sarah Breeden — MPC عضو بانک انگلستان", description: "زمان منبع Forex Factory برابر 10:30 لندن (GMT+1) است؛ برای باکو سه ساعت اضافه شده. قبل از جلسه دوباره تأیید کن.", condition: "در صورت معاملهٔ GBP، از بازکردن پوزیشن تازه درست پیش از سخنرانی خودداری کن." },
        { time: "16:50", name: "سخنرانی Catherine Mann — MPC عضو بانک انگلستان", description: "زمان منبع Forex Factory برابر 13:50 لندن (GMT+1) است؛ تبدیل‌شده به وقت باکو.", condition: "واکنش GBP را پس از انتشار/سخنرانی و تثبیت ساختار بسنج؛ حرکت اولیه را تعقیب نکن." },
        { time: "20:10", name: "سخنرانی Beth Hammack — عضو فدرال رزرو", description: "زمان منبع Forex Factory برابر 17:10 لندن (GMT+1) است؛ تبدیل‌شده به وقت باکو. زمان‌بندی را دوباره بررسی کن.", condition: "برای XAUUSD و جفت‌های USD، ریسک خبر و احتمال گسترش اسپرد را لحاظ کن." },
        { name: "تعطیلی بانکی آمریکا و کانادا", description: "Forex Factory برای دوشنبه 12 اکتبر Bank Holiday برای USD و CAD نشان می‌دهد؛ بازار اوراق آمریکا نیز به‌مناسبت تعطیلی بسته است.", condition: "نقدشوندگی ممکن است کمتر باشد؛ قیمت‌گذاری و اسپرد بروکر را پیش از ورود کنترل کن." },
        { name: "تعطیلی بانکی ژاپن", description: "تقویم Forex Factory تعطیلی JPY را برای تمام روز نشان می‌دهد.", condition: "برای جفت‌های ین، ساعت و نقدشوندگی محلی را جداگانه بررسی کن." }
      ],
      sessions: [
        { name: "آسیا", time: "پیش از لندن", description: "به‌علت تعطیلی ژاپن، نقدشوندگی جفت‌های JPY را جداگانه بررسی کن؛ از نبود دادهٔ تازه نتیجهٔ جهتی نگیر." },
        { name: "لندن", time: "از شروع سشن", description: "محدودهٔ جمعه و سطوح D1 را علامت بزن؛ پیش از سخنرانی‌های GBP وارد معاملهٔ تعقیبی نشو." },
        { name: "نیویورک", time: "بعدازظهر/شب باکو", description: "تعطیلی بانکی و اوراق آمریکا را لحاظ کن؛ باز بودن یک بازار به معنی نقدشوندگی عادی همهٔ ابزارها نیست." }
      ],
      risk: {
        perTrade: "عدد شخصی هنوز ثبت نشده",
        dailyLimit: "عدد شخصی هنوز ثبت نشده",
        maxTrades: "پیش از جلسه تعیین شود",
        costs: "اسپرد + کمیسیون + لغزش بروکر",
        rules: [
          "تا ثبت ریسک مجاز حساب و حد زیان روزانه، این پلن draft باقی می‌ماند.",
          "حد ضرر باید پشت ساختار M5 قرار بگیرد و هزینهٔ معامله در فاصلهٔ مؤثر لحاظ شود.",
          "پس از دو تلاش ناموفق یا رسیدن به حد زیان شخصی، معامله را متوقف کن.",
          "در صورت اسپرد غیرعادی یا نزدیک‌شدن سخنرانی، ورود جدید را به بعد از تثبیت موکول کن."
        ]
      },
      qualityGates: [
        { item: "قیمت‌های روزانه تا جمعه و منبع آن بررسی شد", done: true },
        { item: "تقویم رویدادها و تبدیل ساعت به باکو بررسی شد", done: true },
        { item: "تریگر، تأیید و ابطال برای هر سناریو روشن است", done: true },
        { item: "چارت M15/M5 و اسپرد بروکر برای ورود دقیق بررسی شد", done: false },
        { item: "ریسک حساب، حد زیان روزانه و اندازهٔ پوزیشن مشخص شد", done: false }
      ],
      review: {
        prompt: "پس از جلسه، نتیجهٔ اجرای پلن را ثبت کن؛ پیش‌بینی اولیه را بی‌صدا بازنویسی نکن.",
        questions: [
          "آیا شکست و بازآزمایی دقیقاً مطابق شرط ثبت‌شده رخ داد؟",
          "آیا اسپرد و لغزش با فرض برنامه سازگار بود؟",
          "کدام سناریو فعال نشد و آیا از معاملهٔ بی‌شرط اجتناب شد؟"
        ]
      },
      sources: [
        { name: "XAUUSD historical OHLC — Investing.com", url: "https://www.investing.com/currencies/xau-usd-historical-data", checkedAt: "2026-10-11 19:00 Asia/Baku" },
        { name: "EURUSD historical OHLC — ChartExchange", url: "https://chartexchange.com/symbol/forex-eurusd/historical/", checkedAt: "2026-10-11 19:00 Asia/Baku" },
        { name: "GBPUSD historical OHLC — ChartExchange", url: "https://chartexchange.com/symbol/forex-gbpusd/historical/", checkedAt: "2026-10-11 19:00 Asia/Baku" },
        { name: "Economic calendar — Forex Factory", url: "https://www.forexfactory.com/calendar?range=oct11.2026-oct12.2026", checkedAt: "2026-10-11 19:00 Asia/Baku" },
        { name: "Gold market context — Reuters, 9 October 2026", url: "https://www.reuters.com/world/india/gold-rises-softer-dollar-easing-yields-fed-outlook-focus-2026-10-09/", checkedAt: "2026-10-11 19:00 Asia/Baku" },
        { name: "Week ahead for FX and bonds — WSJ, 9 October 2026", url: "https://www.wsj.com/economy/central-banking/week-ahead-for-fx-bonds-u-s-inflation-data-in-focus-2e3de315", checkedAt: "2026-10-11 19:00 Asia/Baku" }
      ],
      notes: "این نسخه بر پایهٔ OHLC روزانه تا جمعه 9 اکتبر 2026 است، نه قیمت زنده. ساعت‌های رویداد از تقویمی با منطقهٔ Europe/London (GMT+1) به Asia/Baku (UTC+4) تبدیل شده‌اند و باید دوباره تأیید شوند. ورود، حد ضرر عددی و اندازهٔ پوزیشن تا بررسی چارت M15/M5 و مشخص‌شدن ریسک حساب تعیین نشده؛ به همین دلیل status برابر draft است."
    }
  ]
};
