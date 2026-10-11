# قرارداد دادهٔ پلن روزانه — نسخه 2

این سند قرارداد پایدار دادهٔ PLAN است. رابط کاربری و اعتبارسنجی به این ساختار وابسته‌اند. برای افزودن روز تازه، فقط یک شیء به plans در data/plans.js اضافه کن؛ فایل برنامه را برای هر روز تغییر نده.

## الگوی رکورد روزانه

این نمونه، قالب است نه تحلیل واقعی. مقادیر متنی نمونه را با اطلاعاتی که از منبع معتبر بررسی شده‌اند جایگزین کن. برای چارت فقط OHLC تأییدشده وارد کن؛ آرایهٔ candles خالی یعنی چارت عمداً بدون کندل می‌ماند.

    {
      date: "YYYY-MM-DD",
      title: "پلن روز معاملاتی",
      status: "draft",
      timezone: "Asia/Baku",
      session: "London / New York",
      bias: "conditional",
      biasNote: "جهت فقط بعد از تأیید ساختار",
      dayType: "نامشخص",
      regime: "نامشخص",
      headline: "خلاصهٔ یک‌جمله‌ای و مشروط",
      thesis: "زمینهٔ تایم‌فریم بالا، جایگاه قیمت، نقدینگی، خبر و شرط تغییر دیدگاه.",
      assets: [
        {
          symbol: "XAUUSD",
          name: "Gold / XAUUSD",
          bias: "conditional",
          referencePrice: "قیمت بررسی‌شده",
          referenceAt: "YYYY-MM-DD HH:mm Asia/Baku",
          referenceSource: "نام منبع یا پلتفرم",
          summary: "ساختار فعلی، ناحیهٔ نزدیک و عامل ابطال",
          charts: [
            {
              timeframe: "M15",
              candles: [
                { time: "YYYY-MM-DDTHH:mm:ss+04:00", open: 0, high: 0, low: 0, close: 0, volume: null }
              ],
              markers: [
                { time: "همان مقدار time یک کندل", direction: "bullish", label: "تأیید" }
              ]
            }
          ],
          levels: [
            { name: "سطح کلیدی", type: "swing", price: "قیمت عددی", timeframe: "H1", importance: "high", reaction: "شرط واکنش", color: "#e7bd79", style: "dashed" }
          ],
          zones: [
            { name: "ناحیهٔ تقاضا", low: 0, high: 0, type: "demand", timeframe: "H1", description: "مبنای ساختاری", condition: "شرط معتبر ماندن" }
          ],
          liquidity: [
            { name: "نقدینگی بالای سقف", price: "قیمت یا بازه", timeframe: "M15", description: "چرایی اهمیت", condition: "تعریف سویپ معتبر" }
          ]
        }
      ],
      timeframes: [
        { tf: "D1", bias: "neutral", read: "زمینه و ساختار اصلی" },
        { tf: "H4", bias: "neutral", read: "سوینگ‌ها و محدودهٔ مهم" },
        { tf: "H1", bias: "conditional", read: "سناریوی داخل روز" },
        { tf: "M15", bias: "neutral", read: "ساختار تصمیم و شرط تأیید" },
        { tf: "M5", bias: "neutral", read: "تریگر دقیق؛ بدون تأیید ورود نداریم" }
      ],
      levels: [
        { name: "سطح روز", symbol: "XAUUSD", type: "PDH / PDL / Swing / EQH / EQL / FVG / OB", price: "قیمت دقیق", timeframe: "H1", importance: "high", reaction: "واکنش مورد انتظار و شرط ابطال" }
      ],
      zones: [],
      liquidity: [],
      scenarios: [
        {
          name: "سناریوی صعودی مشروط",
          direction: "bullish",
          timeframe: "M15 → M5",
          enabled: true,
          logic: "منطق ساختاری سناریو",
          trigger: "شرط قابل مشاهدهٔ فعال‌سازی",
          confirmation: "تأیید ساختار/کندل/بازپس‌گیری سطح",
          invalidation: "سطح یا رویداد ابطال",
          entry: "ورود مشروط یا عدم ورود تا تأیید",
          entryPrice: "قیمت/بازهٔ مشروط",
          stopLoss: "حد ضرر ساختاری با هزینه‌ها",
          targets: "TP1 / TP2 / هدف نهایی و دلیل",
          management: "مدیریت موقعیت و خروج جزئی",
          riskNote: "اسپرد، کمیسیون، لغزش و خبر"
        }
      ],
      avoid: [
        "عدم معامله در وسط رنج، پیش از خبر پرریسک یا با تأیید ناقص"
      ],
      events: [
        { time: "HH:MM", name: "نام رویداد و ارز", impact: "high", description: "فقط دادهٔ تأییدشده", condition: "برنامهٔ پرهیز یا واکنش" }
      ],
      sessions: [
        { name: "London", time: "HH:MM–HH:MM", description: "زمینه و برنامهٔ سشن" },
        { name: "New York", time: "HH:MM–HH:MM", description: "هم‌پوشانی، خبر و سناریو" }
      ],
      risk: {
        perTrade: "مقدار/درصد مجاز",
        dailyLimit: "حد زیان روزانه",
        maxTrades: "حداکثر تعداد ورود",
        costs: "اسپرد + کمیسیون + لغزش",
        rules: ["قواعد ریسک روز"]
      },
      qualityGates: [
        { item: "قیمت، منبع و زمان ثبت بررسی شد", done: false },
        { item: "تقویم خبر و زمان محلی بررسی شد", done: false },
        { item: "تریگر، تأیید و ابطال روشن است", done: false },
        { item: "حد ضرر و هزینه‌ها بررسی شد", done: false }
      ],
      review: {
        prompt: "پس از جلسه، اجرا را بدون قضاوت احساسی ثبت کن.",
        questions: ["آیا ورود با شرط تعریف‌شده منطبق بود؟", "آیا ریسک واقعی از ریسک برنامه بیشتر شد؟", "چه چیزی در تحلیل درست یا نادرست بود؟"]
      },
      sources: [
        { name: "نام منبع", url: "https://example.com", checkedAt: "YYYY-MM-DD HH:mm Asia/Baku" }
      ],
      notes: "عدم قطعیت‌ها، اصلاحیه‌ها و موارد نیازمند تأیید"
    }

## قرارداد چارت

- هر asset می‌تواند چند chart در آرایهٔ charts داشته باشد؛ timeframe باید یکتا و روشن باشد.
- هر candle شامل time و مقادیر عددی open/high/low/close است. زمان‌ها باید صعودی و بدون تکرار باشند.
- high باید از open، close و low کوچک‌تر نباشد؛ low باید از open، close و high بزرگ‌تر نباشد.
- time می‌تواند ISO 8601 همراه offset باشد یا timestamp عددی. برای دادهٔ روزانه، ISO همراه منطقهٔ زمانی را ترجیح بده.
- همهٔ قیمت‌ها باید از منبع مشخص استخراج شوند. کندل‌ها برای نمایش تاریخچه هستند و دادهٔ زنده نیستند.
- levels می‌توانند در سطح نماد یا در سطح پلن ثبت شوند. سطح پلن با فیلد symbol فقط روی نماد متناظر نمایش داده می‌شود.
- قیمت سطح برای رسم چارت باید قابل تبدیل به عدد باشد. اگر قیمت متنی است، در جدول دیده می‌شود ولی روی مقیاس قیمت رسم نمی‌شود.
- zones دارای low و high عددی روی چارت نمایش داده می‌شوند. برای عرضه type برابر supply و برای تقاضا type برابر demand بگذار.
- markers باید زمان دقیق یکی از کندل‌های همان چارت را داشته باشند.

## مقادیر مجاز پیشنهادی

- status: draft، ready، archived
- bias: bullish، bearish، neutral، conditional، mixed
- direction: bullish، bearish، neutral
- importance: high، medium، low
- impact خبر: high، medium، low
- style سطح: dashed، solid
- type ناحیه: supply، demand

## قواعد کیفیت و نگهداری

1. یک تاریخ فقط یک بار ثبت شود. قبل از افزودن، آرشیو را بررسی کن.
2. ابتدا draft بماند؛ ready فقط پس از تکمیل همهٔ کنترل‌های لازم.
3. هر سناریو trigger و invalidation لازم دارد. بدون آن‌ها برنامهٔ اجرایی کامل نیست.
4. هیچ قیمت، خبر، کندل، احتمال یا هدفی را حدس نزن. «نامشخص» از عدد ساختگی بهتر است.
5. تمام زمان‌های رویداد و زمان بررسی را با منطقهٔ زمانی روشن ثبت کن.
6. اگر پلن اصلاح شد، زمان و دلیل اصلاح را در notes ثبت کن؛ سابقهٔ تصمیم را پنهانی بازنویسی نکن.
7. اسکریپت scripts/validate-plans.mjs را اجرا کن. خطای اعتبارسنجی باید قبل از commit رفع شود.
