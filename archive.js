const list = document.getElementById('writing-list');

async function loadWritings() {
  if (!isConfigured()) {
    list.innerHTML = '<p class="setup-state">Connect Supabase in <code>config.js</code> to load the archive.</p>';
    return;
  }
  const { data, error } = await sb.from('writings').select('title,slug,date_label').eq('published', true).order('created_at', {ascending:false});
  if (error) { list.innerHTML = '<p class="setup-state">The archive could not be loaded yet.</p>'; return; }
  list.innerHTML = data.length ? data.map((w,i)=>`
    <a class="writing-row" href="writing.html?slug=${encodeURIComponent(w.slug)}">
      <span class="writing-number">${String(i+1).padStart(2,'0')}</span>
      <span><span class="writing-name">${esc(w.title)}</span>${w.date_label?`<small class="archive-date">${esc(w.date_label)}</small>`:''}</span>
      <span class="writing-arrow">↗</span>
    </a>`).join('') : '<p class="empty-state">Nothing has been written yet.</p>';
}
function isConfigured(){return window.SUPABASE_CONFIG && !window.SUPABASE_CONFIG.url.includes('YOUR-PROJECT') && !window.SUPABASE_CONFIG.publishableKey.includes('YOUR_SUPABASE');}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
loadWritings();
