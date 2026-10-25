// Shared behaviour for every page. The PROJECTS / ARTICLES lists below drive the home grid,
// the Ctrl+K search, and the previous/next links on project pages, so a new project is added here once.
(function () {
  "use strict";
  var ROOT = document.documentElement.getAttribute("data-root") || "";

  var PROJECTS = [
    { slug: "healthcare-fpa", cat: ["FP&A", "Consolidation", "Power BI"], isNew: true, featured: true,
      title: "Multi-Country Healthcare FP&A Pack", kicker: "FP&A · Multi-currency · Power BI",
      img: "assets/img/healthcare-fpa/overall-summary.webp",
      q: "Did we grow, or did the currencies move? And why is cash behind revenue?",
      sum: "A 13-page monthly management pack for an 18-clinic group in 8 countries: consolidation with FX translation, constant-currency growth, an insurance revenue-to-cash bridge, doctor productivity and a scenario page for pricing, hiring and new-clinic decisions.",
      tags: ["IAS 21 translation", "Variance analysis", "Revenue cycle", "Scenarios"] },
    { slug: "python-eda", cat: ["Python", "Data analysis"], isNew: true,
      title: "Auditing a Dataset with Python", kicker: "Python · Data cleaning · Storytelling",
      img: "assets/img/python-eda/row-reconciliation.webp",
      q: "Can these 10,841 rows be trusted, and what do they actually say?",
      sum: "Treating a messy file the way an auditor treats a trial balance: reconcile every row, investigate why values are missing before filling them, test the patterns, and separate significant from material.",
      tags: ["pandas", "Reconciliation", "Statistics", "Materiality"] },
    { slug: "consolidation", cat: ["Consolidation", "Power BI"],
      title: "Individual & Consolidated Financial Statements", kicker: "Group reporting · IFRS 10",
      img: "assets/img/consolidation/executive-summary.png",
      q: "Can one model give both the entity view and the group view, and prove the link?",
      sum: "One Power BI model for stand-alone entity statements and the consolidated group, with intercompany eliminations, investment elimination and non-controlling interest.",
      tags: ["IFRS 10", "Eliminations", "NCI"] },
    { slug: "fpa-dashboard", cat: ["FP&A", "Power BI"],
      title: "FP&A & Financial Performance Dashboard", kicker: "Budget vs actual · What-if",
      img: "assets/img/fpa-dashboard/summary.png",
      q: "Are we on budget, which products make money, and what if growth slows?",
      sum: "A six-page monthly performance pack from revenue to EBITDA: sales, customers, product profitability, receivables ageing and a what-if model that recalculates the P&L.",
      tags: ["Budget vs actual", "EBITDA bridge", "AR ageing"] },
    { slug: "financial-reporting", cat: ["Power BI", "Reporting"],
      title: "Financial Statements from the Database", kicker: "3 statements · SQL",
      img: "assets/img/financial-reporting/income-statement.png",
      q: "Why rebuild the statements in Excel every month?",
      sum: "Income statement, balance sheet and indirect cash flow built straight from the accounting database with SQL, refreshing automatically and checking themselves.",
      tags: ["SQL", "Indirect cash flow", "Controls"] },
    { slug: "five-year-model", cat: ["Excel", "Modelling"],
      title: "Integrated 5-Year Financial Model & Valuation", kicker: "Excel · 3-statement · DCF",
      img: "assets/img/five-year-model/dashboard.png",
      q: "How fast can the business grow, and will it fund itself?",
      sum: "A linked three-statement model with supporting schedules, scenarios, sensitivity tables and DCF valuation, summarised on one executive page. Downloadable.",
      tags: ["3-statement", "DCF", "Scenarios"] },
    { slug: "hr-analytics", cat: ["Power BI", "People cost"],
      title: "Workforce & Attrition Analytics", kicker: "People cost · Power BI",
      img: "assets/img/hr-analytics/overview.png",
      q: "Where is turnover concentrated, and what does it mean for payroll planning?",
      sum: "Headcount, demographics, performance reviews and attrition for a 1,470-person workforce, built as input for headcount and payroll budgets.",
      tags: ["Headcount", "Attrition", "Payroll planning"] }
  ];
  var ARTICLES = [
    { href: "articles/end-to-end-power-bi-for-finance.html", title: "My Approach to Building End-to-End Power BI Solutions for Finance", meta: "Power BI · 5 min", img: "assets/img/insights/powerbi-hero.svg?v=3",
      sum: "From checking the raw data and designing the model to DAX, review and secure deployment." },
    { href: "articles/ai-finding-answers-faster.html", title: "How AI Can Help Finance Teams Find Answers Faster", meta: "AI in finance · 4 min", img: "assets/img/insights/answers-hero.svg?v=3",
      sum: "Payment terms, renewal clauses, the support behind a balance: finding it faster, with evidence attached." },
    { href: "articles/excel-power-query-power-bi.html", title: "Excel, Power Query or Power BI? Choosing the Right Tools for AI-Powered FP&A", meta: "FP&A tools · 6 min", img: "assets/img/insights/tools-hero.svg?v=3",
      sum: "Which tool does which job across modelling, preparation and reporting, and where Python and AI fit." },
    { href: "articles/automating-financial-reporting.html", title: "Automating Financial Reporting with AI", meta: "AI in finance · 4 min", img: "assets/img/insights/automating-hero.svg?v=3",
      sum: "AI builds the tool on dummy data, Python runs it on real data, Power Automate does the admin." }
  ];
  var SECTIONS = [["Projects", "index.html#work"], ["How I work", "index.html#how"], ["Insights", "index.html#insights"],
    ["Experience", "index.html#experience"], ["Contact", "index.html#contact"], ["Download CV (PDF)", "assets/files/Jamil-Ur-Rehman-CV.pdf?v=4"]];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  // ---------- theme
  var th = $("#th");
  function setTheme(v) {
    document.documentElement.setAttribute("data-theme", v);
    if (th) { th.setAttribute("aria-pressed", String(v === "light")); th.textContent = v === "light" ? "☾ Dark" : "☀ Light"; }
    try { localStorage.setItem("theme", v); } catch (e) {}
  }
  try { var saved = localStorage.getItem("theme"); if (saved) setTheme(saved); else setTheme("light"); } catch (e) { setTheme("light"); }
  if (th) th.addEventListener("click", function () { setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"); });

  // ---------- scroll progress
  var prog = $("#prog");
  if (prog) addEventListener("scroll", function () {
    var d = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (d > 0 ? scrollY / d * 100 : 0) + "%";
  }, { passive: true });

  // ---------- reveal on scroll
  var io = null;
  if ("IntersectionObserver" in window && motion) io = new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: 0.08 });
  function reveal() { $$(".rv:not(.in)").forEach(function (n) { io ? io.observe(n) : n.classList.add("in"); }); }

  // ---------- count-up numbers: <strong data-count="85" data-suffix="%">
  function countUp() {
    var els = $$("[data-count]");
    if (!els.length) return;
    function run(el) {
      var end = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "";
      var dec = (String(end).split(".")[1] || "").length, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1100), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      motion ? requestAnimationFrame(step) : (el.textContent = pre + end.toLocaleString("en-US") + suf);
    }
    if (!("IntersectionObserver" in window)) return els.forEach(run);
    var o = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { run(x.target); o.unobserve(x.target); } }); }, { threshold: 0.4 });
    els.forEach(function (e) { o.observe(e); });
  }

  // ---------- home: project filter + grid, articles
  var grid = $("#grid"), fl = $("#fl");
  function card(p) {
    var cls = "card rv" + (p.featured ? " feat" : "");
    return '<a class="' + cls + '" href="' + ROOT + "projects/" + p.slug + '.html" data-cat="' + esc(p.cat.join("|")) + '">' +
      (p.isNew ? '<span class="new">New</span>' : "") +
      '<div class="shot"><img src="' + ROOT + p.img + '" alt="' + esc(p.title) + ' preview" loading="lazy"></div>' +
      '<div class="cb"><small>' + esc(p.kicker) + "</small><h3>" + esc(p.title) + '</h3><p class="q">' + esc(p.q) + "</p><p>" + esc(p.sum) + "</p>" +
      "<div>" + p.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + '</div><b class="go">Read the case study →</b></div></a>';
  }
  if (grid) {
    grid.innerHTML = PROJECTS.map(card).join("");
    var cats = ["All"];
    PROJECTS.forEach(function (p) { p.cat.forEach(function (c) { if (cats.indexOf(c) < 0) cats.push(c); }); });
    fl.innerHTML = cats.map(function (c, i) { return '<button type="button" aria-pressed="' + (i === 0) + '" data-f="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") +
      '<span class="count" id="pcount">' + PROJECTS.length + " projects</span>";
    fl.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var f = b.getAttribute("data-f"), n = 0;
      $$("button", fl).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $$(".card", grid).forEach(function (c) {
        var show = f === "All" || c.getAttribute("data-cat").split("|").indexOf(f) >= 0;
        c.hidden = !show; if (show) n++;
        c.classList.toggle("feat", show && f === "All" && c === grid.firstElementChild);
      });
      $("#pcount").textContent = n + (n === 1 ? " project" : " projects");
    });
  }
  var alist = $("#alist");
  if (alist) alist.innerHTML = ARTICLES.map(function (a) {
    return '<a class="acard rv" href="' + ROOT + a.href + '"><img src="' + ROOT + a.img + '" alt="" loading="lazy"><div><small>' + esc(a.meta) +
      "</small><h3>" + esc(a.title) + "</h3><p>" + esc(a.sum) + "</p></div></a>";
  }).join("");

  // ---------- home: "how I work" tabs
  $$("[data-how]").forEach(function (box) {
    var tabs = $$("[role=tab]", box), panels = $$("[role=tabpanel]", box);
    function pick(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = i !== j; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(i); });
      t.addEventListener("keydown", function (e) {
        var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); pick((i + k + tabs.length) % tabs.length, true); }
      });
    });
  });

  // ---------- project pages: page tour (tab bar + viewer)
  $$("[data-tour]").forEach(function (tour) {
    var tabs = $$(".tabs button", tour), panels = $$(".tpanel", tour), pos = $(".tpos", tour), i = 0;
    function show(n, focus) {
      i = (n + tabs.length) % tabs.length;
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = i !== j; });
      if (pos) pos.textContent = (i + 1) + " of " + tabs.length + " · " + tabs[i].textContent;
      var strip = tabs[i].parentNode;   // scroll only the tab strip, never the page
      strip.scrollLeft = tabs[i].offsetLeft - strip.clientWidth / 2 + tabs[i].offsetWidth / 2;
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, j) {
      t.addEventListener("click", function () { show(j); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1, true); }
      });
    });
    $$("[data-step]", tour).forEach(function (b) { b.addEventListener("click", function () { show(i + parseInt(b.getAttribute("data-step"), 10)); }); });
    show(0);
  });

  // ---------- dashboard viewer: next / back, keyboard, swipe, autoplay, thumbnails jump to a page
  $$("[data-viewer]").forEach(function (v) {
    var thumbs = $$(".vt", v), img = $(".vstage img", v), i = 0, timer = null;
    var num = $(".vnum", v), ttl = $(".vtitle", v), dsc = $(".vdesc", v), bar = $(".vprog i", v), play = $("[data-play]", v);
    if (!thumbs.length) return;
    function show(n, scroll) {
      i = (n + thumbs.length) % thumbs.length;
      var t = thumbs[i];
      img.classList.add("fade");
      var pre = new Image();
      pre.onload = pre.onerror = function () { img.src = pre.src; img.alt = t.getAttribute("data-alt"); img.classList.remove("fade"); };
      pre.src = t.getAttribute("data-src");
      num.textContent = String(i + 1).padStart(2, "0") + " / " + String(thumbs.length).padStart(2, "0") + (t.getAttribute("data-group") ? " · " + t.getAttribute("data-group") : "");
      ttl.textContent = t.getAttribute("data-title");
      dsc.textContent = t.getAttribute("data-desc");
      bar.style.width = ((i + 1) / thumbs.length * 100) + "%";
      thumbs.forEach(function (x, j) { x.setAttribute("aria-current", String(i === j)); });
      new Image().src = thumbs[(i + 1) % thumbs.length].getAttribute("data-src");   // warm the next page
      if (scroll) { var top = $(".vstage", v).getBoundingClientRect().top; if (top < 70 || top > innerHeight * 0.5) scrollTo({ top: scrollY + top - 84, behavior: motion ? "smooth" : "auto" }); }
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; if (play) { play.setAttribute("aria-pressed", "false"); play.textContent = "▶ Play tour"; } } }
    $(".vnav.prev", v).addEventListener("click", function () { stop(); show(i - 1); });
    $(".vnav.next", v).addEventListener("click", function () { stop(); show(i + 1); });
    thumbs.forEach(function (t, j) { t.addEventListener("click", function () { stop(); show(j, true); }); });
    if (play) play.addEventListener("click", function () {
      if (timer) return stop();
      play.setAttribute("aria-pressed", "true"); play.textContent = "❚❚ Pause";
      timer = setInterval(function () { show(i + 1); }, 4500);
    });
    var full = $("[data-full]", v);
    if (full) full.addEventListener("click", function () { img.click(); });
    document.addEventListener("keydown", function (e) {
      if (/input|textarea/i.test(document.activeElement.tagName) || (document.querySelector("dialog[open]"))) return;
      var r = v.getBoundingClientRect();
      if (r.bottom < 80 || r.top > innerHeight * 0.6) return;   // only when the viewer is on screen
      if (e.key === "ArrowRight") { stop(); show(i + 1); }
      if (e.key === "ArrowLeft") { stop(); show(i - 1); }
    });
    var x0 = null;
    $(".vstage", v).addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    $(".vstage", v).addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) { stop(); show(i + (dx < 0 ? 1 : -1)); }
    });
    show(0);
  });

  // ---------- segmented toggles: <div data-seg> buttons[data-show=id] switch panels
  $$("[data-seg]").forEach(function (seg) {
    var bs = $$("button", seg);
    bs.forEach(function (b) {
      b.addEventListener("click", function () {
        bs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); var p = document.getElementById(x.getAttribute("data-show")); if (p) p.hidden = x !== b; });
      });
    });
  });

  // ---------- section rail scrollspy
  var rail = $(".rail");
  if (rail && "IntersectionObserver" in window) {
    var links = $$("a[href^='#']", rail);
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
        $$(".pipe a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) spy.observe(t); });
  }

  // ---------- previous / next project
  var pn = $("#pn"), me = document.body.getAttribute("data-project");
  if (pn && me) {
    var k = PROJECTS.map(function (p) { return p.slug; }).indexOf(me);
    var prev = PROJECTS[(k - 1 + PROJECTS.length) % PROJECTS.length], next = PROJECTS[(k + 1) % PROJECTS.length];
    pn.innerHTML = '<a href="' + prev.slug + '.html"><small>← Previous project</small><b>' + esc(prev.title) + "</b></a>" +
      '<a href="' + next.slug + '.html"><small>Next project →</small><b>' + esc(next.title) + "</b></a>";
  }

  // ---------- scenario simulator (Ravaan): sliders scale linear EBITDA sensitivities
  $$("[data-sim]").forEach(function (sim) {
    var base = parseFloat(sim.getAttribute("data-base")), rev = parseFloat(sim.getAttribute("data-rev"));
    var ins = $$("input[type=range]", sim);
    function fmt(v) { return (v < 0 ? "−" : "+") + "AED " + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 }) + "K"; }
    function calc() {
      var total = 0, rows = [], max = 1;
      ins.forEach(function (x) {
        var pct = parseFloat(x.value), per = parseFloat(x.getAttribute("data-per")), sign = parseFloat(x.getAttribute("data-sign"));
        var eff = pct * per * sign; total += eff; rows.push(eff); max = Math.max(max, Math.abs(eff));
        $("output[for=" + x.id + "]", sim).textContent = (pct > 0 ? "+" : "") + pct + "%";
      });
      $$(".bars div", sim).forEach(function (d, j) {
        var bar = $("i", d), w = Math.abs(rows[j]) / Math.max(max, 600) * 50;
        bar.className = rows[j] < 0 ? "neg" : "";
        bar.style.left = rows[j] < 0 ? (50 - w) + "%" : "50%"; bar.style.width = w + "%";
        $("em", d).textContent = fmt(rows[j]);
      });
      var e = base + total;
      $("[data-out=ebitda]", sim).textContent = "AED " + (e / 1000).toFixed(2) + "M";
      $("[data-out=delta]", sim).textContent = fmt(total) + " vs today";
      $("[data-out=delta]", sim).style.color = total < 0 ? "var(--neg)" : "var(--pos)";
      $("[data-out=margin]", sim).textContent = (e / rev * 100).toFixed(1) + "%";
    }
    ins.forEach(function (x) { x.addEventListener("input", calc); });
    var reset = $("[data-reset]", sim);
    if (reset) reset.addEventListener("click", function () { ins.forEach(function (x) { x.value = 0; }); calc(); });
    calc();
  });

  // ---------- lightbox for any image marked data-zoom
  var lb = document.createElement("dialog");
  lb.id = "lb";
  lb.innerHTML = '<figure><img alt=""><figcaption><span></span><button type="button">Close ✕</button></figcaption></figure>';
  document.body.appendChild(lb);
  document.addEventListener("click", function (e) {
    var z = e.target.closest && e.target.closest("img[data-zoom]");
    if (!z || !lb.showModal) return;
    $("img", lb).src = z.currentSrc || z.src; $("img", lb).alt = z.alt; $("span", lb).textContent = z.alt;
    lb.showModal();
  });
  lb.addEventListener("click", function () { lb.close(); });

  // ---------- Ctrl+K command palette
  var items = PROJECTS.map(function (p) { return { t: p.title, k: "Project", h: ROOT + "projects/" + p.slug + ".html", s: p.cat.join(" ") + " " + p.tags.join(" ") }; })
    .concat(ARTICLES.map(function (a) { return { t: a.title, k: "Insight", h: ROOT + a.href, s: a.meta }; }))
    .concat(SECTIONS.map(function (x) { return { t: x[0], k: "Go to", h: ROOT + x[1], s: "" }; }));
  var cmd = document.createElement("dialog"), sel = 0, shown = [];
  cmd.id = "cmd";
  cmd.setAttribute("aria-label", "Search the portfolio");
  cmd.innerHTML = '<input type="search" placeholder="Search projects, insights, sections…" aria-label="Search"><ul role="listbox"></ul><div class="hint">↑ ↓ to move · Enter to open · Esc to close</div>';
  document.body.appendChild(cmd);
  var inp = $("input", cmd), ul = $("ul", cmd);
  function draw() {
    var q = inp.value.trim().toLowerCase();
    shown = items.filter(function (x) { return !q || (x.t + " " + x.k + " " + x.s).toLowerCase().indexOf(q) >= 0; });
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    ul.innerHTML = shown.length ? shown.map(function (x, i) {
      return '<li><a role="option" href="' + x.h + '" aria-selected="' + (i === sel) + '"><span>' + esc(x.t) + "</span><small>" + x.k + "</small></a></li>";
    }).join("") : '<li class="mut" style="padding:14px">No match.</li>';
  }
  function openCmd() { if (!cmd.showModal) return; inp.value = ""; sel = 0; draw(); cmd.showModal(); inp.focus(); }
  inp.addEventListener("input", function () { sel = 0; draw(); });
  cmd.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); draw(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    if (e.key === "Enter" && shown[sel]) { e.preventDefault(); location.href = shown[sel].h; cmd.close(); }
    var a = $("[aria-selected=true]", ul); if (a) a.scrollIntoView({ block: "nearest" });
  });
  cmd.addEventListener("click", function (e) { if (e.target === cmd) cmd.close(); if (e.target.closest("a")) cmd.close(); });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmd.open ? cmd.close() : openCmd(); }
    else if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName) && !cmd.open) { e.preventDefault(); openCmd(); }
  });
  $$("[data-cmd]").forEach(function (b) { b.addEventListener("click", openCmd); });

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  reveal(); countUp();
})();
