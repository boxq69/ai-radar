(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const A="https://freeserp.ai/api.php",I={project:"AI Radar",agent:"AIRadar/1.0"},f=["AI Agents & Autonomous","AI Automation & Workflows","Code & Dev Tools","AI Infrastructure & API","AI Chatbot & Assistant","LLM & Prompt Tools","AI Search & Answers","Image Generation","Video Generation","Voice & Text-to-Speech","Data & Analytics","Design & UI","Research & Science","AI Website Builder","No-code / App Builder"],E=[{value:"went_live",label:"Newest"},{value:"dr",label:"Authority"},{value:"relevance",label:"Relevance"},{value:"first_seen",label:"First seen"}];function v(t,e){const a=new URLSearchParams;return Object.entries({...I,...e}).forEach(([o,s])=>{s==null||s===""||a.set(o,String(s))}),`${t}?${a.toString()}`}function q(t){return new Promise(e=>setTimeout(e,t))}async function g(t,e=1e4){const a=new AbortController,o=setTimeout(()=>a.abort(),e);try{const s=await fetch(t,{signal:a.signal});if(!s.ok){const l=new Error(`HTTP ${s.status}`);throw l.status=s.status,l}const i=await s.json();if(!i.ok)throw new Error(i.error||"FreeSerp request failed");return i}finally{clearTimeout(o)}}function _(t){return t?.status===502||t?.status===503||t?.name==="AbortError"}async function y(t){const e=[A];let a;for(const s of e)try{return await g(v(s,t))}catch(i){if(a=i,_(i)){await q(300);try{return await g(v(s,t))}catch(l){a=l}}}const o=a?.status?` (${a.status})`:"";throw new Error(`Could not reach FreeSerp${o}. Check your connection and try again.`)}function M({q:t="",niche:e="",sort:a="went_live",order:o="desc",drMin:s="",fromDate:i="",toDate:l="",size:$=12,from:S=0}={}){return y({index:"sites",ai_startups:1,q:t||void 0,ai_categories:e||void 0,sort:a,order:a==="relevance"?void 0:o,dr_min:s||void 0,from_date:i||void 0,to_date:l||void 0,size:$,from:S})}function P(){return y({stats:1})}function k(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}const p=10,h=3,r={query:"",niche:"",sort:"went_live",drMin:"",window:"90",from:0,total:0,results:[],stats:null,loading:!1,error:"",compare:[],booted:!1},c=document.querySelector("#app");function n(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function m(t){return t==null?"—":new Intl.NumberFormat("en").format(t)}function w(t,e=180){return t?t.length>e?`${t.slice(0,e).trim()}…`:t:"No summary available."}function D(t){return t?{fromDate:k(Number(t)),toDate:""}:{fromDate:"",toDate:""}}function L(t){return r.compare.some(e=>e.domain===t)}function R(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`}function C(){const t=(location.hash||"#search").slice(1),e=(a,o)=>`<a href="#${a}" class="${t===a?"active":""}">${o}</a>`;return`
    <header class="nav" id="top-nav">
      <div class="shell nav-inner">
        <a class="logo" href="#search">
          <span class="logo-mark" aria-hidden="true"></span>
          AI Radar
        </a>
        <nav class="nav-links" aria-label="Primary">
          ${e("search","Search")}
          ${e("compare","Compare")}
          ${e("plan","Plan")}
          <a class="btn btn-primary btn-sm nav-cta" href="#search">Start searching <span class="btn-icon">→</span></a>
        </nav>
      </div>
    </header>
  `}function N(){return`
    <section class="hero shell" id="search">
      <div class="trust">Live FreeSerp index · AI startups</div>
      <h1>AI search, <em>clarified</em></h1>
      <p class="hero-lead">
        Discover newly live AI products with clean filters, domain authority,
        and side-by-side comparison.
      </p>

      <form class="search-wrap" id="search-form">
        <div class="search-box">
          ${R()}
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Search AI sites — chatbots, tools, startups…"
            value="${n(r.query)}"
            autocomplete="off"
          />
          <button class="btn btn-primary" type="submit">
            Search <span class="btn-icon">→</span>
          </button>
        </div>
      </form>

      <div class="stats-row" aria-live="polite">
        <span><strong>${n(m(r.stats?.ai_startups?.total))}</strong> AI startups</span>
        <span><strong>${n(m(r.stats?.new?.last_7d))}</strong> new sites / 7d</span>
        <span><strong>${n(m(r.stats?.totals?.real_sites))}</strong> live sites indexed</span>
      </div>
    </section>
  `}function T(){return`
    <div class="shell">
      <div class="toolbar">
        <div class="chips" aria-label="Niches">
          ${["",...f.slice(0,5)].map(e=>{const a=e||"All";return`<button type="button" class="chip ${r.niche===e?"active":""}" data-action="set-niche" data-niche="${n(e)}">${n(a)}</button>`}).join("")}
        </div>
        <div class="controls">
          <select id="niche" aria-label="All niches">
            <option value="">More niches</option>
            ${f.map(e=>`<option value="${n(e)}" ${r.niche===e?"selected":""}>${n(e)}</option>`).join("")}
          </select>
          <select id="sort" aria-label="Sort">
            ${E.map(e=>`<option value="${e.value}" ${r.sort===e.value?"selected":""}>${e.label}</option>`).join("")}
          </select>
          <select id="drMin" aria-label="Min DR">
            <option value="" ${r.drMin===""?"selected":""}>Any DR</option>
            <option value="5" ${r.drMin==="5"?"selected":""}>DR 5+</option>
            <option value="10" ${r.drMin==="10"?"selected":""}>DR 10+</option>
            <option value="20" ${r.drMin==="20"?"selected":""}>DR 20+</option>
          </select>
          <select id="window" aria-label="Went live">
            <option value="" ${r.window===""?"selected":""}>Any time</option>
            <option value="30" ${r.window==="30"?"selected":""}>30 days</option>
            <option value="90" ${r.window==="90"?"selected":""}>90 days</option>
            <option value="180" ${r.window==="180"?"selected":""}>180 days</option>
          </select>
        </div>
      </div>
    </div>
  `}function F(t){const e=L(t.domain),a=(t.ai_categories||[]).slice(0,2),o=t.title||t.domain;return`
    <article class="result">
      <div class="result-main">
        <h3>${n(o)}</h3>
        <a class="domain" href="${n(t.url)}" target="_blank" rel="noopener noreferrer">${n(t.domain)}</a>
        <p>${n(w(t.ai_summary))}</p>
        <div class="meta">
          ${a.map(s=>`<span class="niche">${n(s)}</span>`).join("")}
          <span>Live ${n(t.went_live||"—")}</span>
          <span>${n(t.ai_source||"stack n/a")}</span>
        </div>
      </div>
      <div class="result-side">
        <div
          class="dr ${t.dr==null?"is-empty":""}"
          title="Domain Rating (0–100) from FreeSerp. New domains are often unscored yet."
        >
          <strong>${t.dr==null?"n/a":n(t.dr)}</strong>
          <small>DR</small>
        </div>
        <button
          class="btn btn-sm ${e?"btn-primary":"btn-ghost"}"
          data-action="compare-toggle"
          data-domain="${n(t.domain)}"
          ${!e&&r.compare.length>=h?"disabled":""}
        >
          ${e?"Selected":"Compare"}
        </button>
      </div>
    </article>
  `}function j(){const t=Math.floor(r.from/p)+1,e=Math.max(1,Math.ceil((r.total||0)/p));let a="";return r.error?a=`
      <div class="state error">
        ${n(r.error)}
        <div style="margin-top:1rem">
          <button class="btn btn-ghost btn-sm" data-action="retry">Try again</button>
        </div>
      </div>`:r.loading?a='<div class="state"><div class="spinner"></div>Searching FreeSerp…</div>':r.results.length?a=r.results.map(F).join(""):a='<div class="state">No AI sites matched. Broaden the niche or date window.</div>',`
    <div class="shell" style="padding-bottom:1rem">
      <div class="panel">
        <div class="panel-head">
          <div>
            ${r.loading||r.error?"Results":`<strong>${m(r.total)}</strong> matches`}
          </div>
          <div>${r.loading||r.error?"":`Page ${t} of ${m(Math.min(e,1e3))}`}</div>
        </div>
        ${a}
        <div class="pager">
          <button class="btn btn-ghost btn-sm" data-action="page" data-dir="-1" ${r.from<=0||r.loading?"disabled":""}>Previous</button>
          <button class="btn btn-ghost btn-sm" data-action="page" data-dir="1" ${r.from+p>=r.total||r.loading?"disabled":""}>Next</button>
        </div>
      </div>
    </div>
  `}function O(){return`
    <section class="section shell">
      <h2 class="section-title">Search that stays <em>focused</em></h2>
      <p class="section-lead">Minimal surface, sharp controls — query first, then filter and compare.</p>
      <div class="feature-grid">
        <article class="feature">
          <h3>Precision niches</h3>
          <p>Uses FreeSerp <code>ai_startups=1</code> so you get real AI products, not AI-flavoured noise.</p>
        </article>
        <article class="feature">
          <h3>Authority signal</h3>
          <p>Every result shows Domain Rating, live date, and builder stack at a glance.</p>
        </article>
        <article class="feature">
          <h3>Fast compare</h3>
          <p>Pin up to three sites and review summaries side by side before you dig deeper.</p>
        </article>
      </div>
    </section>
  `}function x(){const t=r.compare;return t.length?`
    <section class="section shell" id="compare">
      <div style="display:flex;justify-content:space-between;gap:1rem;align-items:end;flex-wrap:wrap">
        <div>
          <h2 class="section-title">Compare <em>side by side</em></h2>
          <p class="section-lead" style="margin-bottom:0">Snapshot of your selected AI sites.</p>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="clear-compare">Clear</button>
      </div>
      <div class="compare-table-wrap" style="margin-top:1.25rem">
        <table class="compare-table">
          <tbody>
            ${[["Site",a=>`<strong>${n(a.title||a.domain)}</strong><br><a href="${n(a.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">${n(a.domain)}</a>`],["Summary",a=>n(w(a.ai_summary,260))],["Niches",a=>n((a.ai_categories||[]).join(", ")||"—")],["DR",a=>a.dr==null?"—":String(a.dr)],["Went live",a=>n(a.went_live||"—")],["Stack",a=>n(a.ai_source||"—")],["TLD",a=>n(a.tld||"—")]].map(([a,o])=>`
                <tr>
                  <th>${n(a)}</th>
                  ${t.map(s=>`<td>${o(s)}</td>`).join("")}
                </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `:`
      <section class="section shell" id="compare">
        <h2 class="section-title">Compare <em>side by side</em></h2>
        <p class="section-lead">Select up to ${h} results from search to open a clean comparison table.</p>
        <div class="panel"><div class="state">Nothing selected yet.</div></div>
      </section>
    `}function H(){return`
    <section class="section shell" id="plan">
      <h2 class="section-title">Site <em>plan</em></h2>
      <p class="section-lead">Short product brief — goal, audience, and structure.</p>
      <div class="plan-grid">
        <div class="plan-card">
          <h3>Goal</h3>
          <p>Help founders and scouts discover newly live AI products quickly, using FreeSerp Main with genuine AI-startup filtering.</p>
          <h3 style="margin-top:1.1rem">Audience</h3>
          <ul>
            <li>Founders researching niche competitors</li>
            <li>Investors scanning fresh AI launches</li>
            <li>Builders looking for stack inspiration</li>
          </ul>
        </div>
        <div class="plan-card">
          <h3>Pages & structure</h3>
          <div class="structure">
            <div><strong>Search</strong><span>Hero query + filters + ranked result list</span></div>
            <div><strong>Compare</strong><span>Side-by-side table for up to 3 sites</span></div>
            <div><strong>Plan</strong><span>Goal, audience, information architecture</span></div>
          </div>
        </div>
      </div>
    </section>
  `}function B(){return r.compare.length?`
    <div class="compare-bar visible" role="status">
      <div class="picks">
        <strong>${r.compare.length}/${h}</strong>
        ${r.compare.map(t=>n(t.domain)).join(" · ")}
      </div>
      <div style="display:flex;gap:0.45rem">
        <button class="btn btn-ghost btn-sm" data-action="clear-compare">Clear</button>
        <a class="btn btn-primary btn-sm" href="#compare">Open compare</a>
      </div>
    </div>
  `:""}function G(){return'<footer class="footer" aria-hidden="true"></footer>'}function u(){c.innerHTML=`
    ${C()}
    <main>
      ${N()}
      ${T()}
      ${j()}
      ${O()}
      ${x()}
      ${H()}
    </main>
    ${G()}
    ${B()}
  `,z(),J()}function U(t){return r.compare.find(e=>e.domain===t)||r.results.find(e=>e.domain===t)}function W(t){const e=r.compare.findIndex(a=>a.domain===t);if(e>=0)r.compare.splice(e,1);else if(r.compare.length<h){const a=U(t);a&&r.compare.push(a)}u()}function b(){const t=document.querySelector("#niche"),e=document.querySelector("#sort"),a=document.querySelector("#drMin"),o=document.querySelector("#window");t&&(r.niche=t.value),e&&(r.sort=e.value),a&&(r.drMin=a.value),o&&(r.window=o.value)}async function V(){try{r.stats=await P()}catch{r.stats=null}}async function d({resetPage:t=!1}={}){t&&(r.from=0),r.loading=!0,r.error="",u();const{fromDate:e,toDate:a}=D(r.window);try{const o=await M({q:r.query,niche:r.niche,sort:r.sort,drMin:r.drMin,fromDate:e,toDate:a,size:p,from:r.from});r.results=o.results||[],r.total=o.total||0}catch(o){r.results=[],r.total=0,r.error=o.message||"Search failed."}finally{r.loading=!1,u()}}function z(){const t=document.querySelector("#search-form");t?.addEventListener("submit",e=>{e.preventDefault(),r.query=String(new FormData(t).get("q")||"").trim(),b(),d({resetPage:!0})}),["niche","sort","drMin","window"].forEach(e=>{document.querySelector(`#${e}`)?.addEventListener("change",()=>{b(),d({resetPage:!0})})}),c.querySelectorAll('[data-action="set-niche"]').forEach(e=>{e.addEventListener("click",()=>{r.niche=e.dataset.niche||"",d({resetPage:!0})})}),c.querySelectorAll('[data-action="compare-toggle"]').forEach(e=>{e.addEventListener("click",()=>W(e.dataset.domain))}),c.querySelectorAll('[data-action="page"]').forEach(e=>{e.addEventListener("click",()=>{r.from=Math.max(0,r.from+Number(e.dataset.dir)*p),d().then(()=>{document.querySelector(".panel")?.scrollIntoView({behavior:"smooth",block:"start"})})})}),c.querySelectorAll('[data-action="clear-compare"]').forEach(e=>{e.addEventListener("click",()=>{r.compare=[],u()})}),c.querySelectorAll('[data-action="retry"]').forEach(e=>{e.addEventListener("click",()=>d())})}function J(){const t=document.querySelector("#top-nav");if(!t)return;const e=()=>t.classList.toggle("scrolled",window.scrollY>8);e(),window.addEventListener("scroll",e,{passive:!0})}window.addEventListener("hashchange",()=>{u(),document.querySelector(location.hash||"#search")?.scrollIntoView({behavior:"smooth"})});async function K(){u(),await Promise.all([V(),d()]),r.booted=!0}K();
