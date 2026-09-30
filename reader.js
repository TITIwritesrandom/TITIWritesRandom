const reader = document.getElementById('reader');
const slug = new URLSearchParams(location.search).get('slug');

async function load(){
  if(!isConfigured()){message('Setup needed','Connect Supabase before reading database content.');return;}
  const {data,error}=await sb.from('writings').select('title,date_label,body').eq('slug',slug).eq('published',true).maybeSingle();
  if(error||!data){message('This page is empty','Return to the writings.');return;}
  document.title=`${data.title} — TITIwritesRandom`;
  const paragraphs=String(data.body||'').split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  reader.innerHTML=`<article class="writing-page"><p class="eyebrow">${esc(data.date_label||'from the archive')}</p><h1>${esc(data.title)}</h1><div class="rule"></div><div class="writing-body">${paragraphs}</div></article>`;
}
function message(title,text){reader.innerHTML=`<div class="not-found"><p class="eyebrow">TITIwritesRandom</p><h1>${esc(title)}</h1><p class="muted">${esc(text)}</p><a href="writings.html" class="back-link">Return to writings</a></div>`;}
function isConfigured(){return window.SUPABASE_CONFIG && !window.SUPABASE_CONFIG.url.includes('YOUR-PROJECT') && !window.SUPABASE_CONFIG.publishableKey.includes('YOUR_SUPABASE');}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
load();
