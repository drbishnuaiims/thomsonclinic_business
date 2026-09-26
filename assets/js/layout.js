(() => {
  'use strict';
  const root = document.documentElement;
  const page = document.body.dataset.page || 'index.html';
  const isNested = page.startsWith('pages/');
  const prefix = isNested ? '../' : '';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  async function loadComponent(target, file) {
    const mount = $(target);
    if (!mount) return;
    try { const response = await fetch(`${prefix}components/${file}`); if (!response.ok) throw new Error(response.status); mount.innerHTML = await response.text(); }
    catch (error) { console.error(`Unable to load ${file}`, error); mount.innerHTML = '<p class="component-error">Navigation is unavailable. Please refresh the page.</p>'; }
  }
  function repairLinks() { $$('[data-link]').forEach(link => { link.href = `${prefix}${link.dataset.link}`; }); }
  function setActiveNav() { $$('[data-nav]').forEach(link => { if (link.dataset.nav === page) link.setAttribute('aria-current', 'page'); }); }
  function setupTheme() {
    const saved = localStorage.getItem('website-theme') || 'system';
    const apply = theme => { root.dataset.theme = theme === 'system' ? '' : theme; root.dataset.themePreference = theme; localStorage.setItem('website-theme', theme); $$('[data-theme-choice]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.themeChoice === theme))); };
    apply(saved);
    const button = $('[data-theme-button]'), popover = $('[data-theme-popover]');
    if (!button || !popover) return;
    const close = () => { popover.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', () => { const open = popover.hidden; popover.hidden = !open; button.setAttribute('aria-expanded', String(open)); if (open) $('[data-theme-choice][aria-checked="true"]', popover)?.focus(); });
    $$('[data-theme-choice]', popover).forEach(choice => choice.addEventListener('click', () => { apply(choice.dataset.themeChoice); close(); button.focus(); }));
    document.addEventListener('click', e => { if (!e.target.closest('.theme-wrap')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  function setupMobileMenu() {
    const button = $('[data-menu-button]'), menu = $('[data-mobile-menu]'), backdrop = $('[data-mobile-backdrop]'); if (!button || !menu) return;
    const close = () => { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); button.setAttribute('aria-expanded', 'false'); backdrop.hidden = true; document.body.classList.remove('modal-open'); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 250); };
    const open = () => { backdrop.hidden = false; menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); menu.setAttribute('aria-hidden', 'false'); button.setAttribute('aria-expanded', 'true'); document.body.classList.add('modal-open'); $('[data-menu-close]', menu).focus(); };
    button.addEventListener('click', open); $('[data-menu-close]', menu).addEventListener('click', close); backdrop.addEventListener('click', close); $$('a', menu).forEach(a => a.addEventListener('click', close)); document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  function setupSearch() {
    const dialog = $('[data-search-dialog]'), backdrop = $('[data-search-backdrop]'), input = $('[data-search-input]'), results = $('[data-search-results]'); if (!dialog || !input) return;
    let entries = [], selected = 0, visible = [];
    const stored = () => { try { return JSON.parse(localStorage.getItem('website-recent-searches') || '[]'); } catch { return []; } };
    fetch(`${prefix}data/search-index.json`).then(r => r.ok ? r.json() : Promise.reject()).then(data => entries = data).catch(() => { results.innerHTML = '<p class="search-empty">Search is temporarily unavailable.</p>'; });
    const render = query => { const q = query.trim().toLowerCase(); visible = q ? entries.filter(e => `${e.title} ${e.description} ${e.category} ${e.keywords}`.toLowerCase().includes(q)) : stored().map(t => entries.find(e => e.title === t)).filter(Boolean); selected = 0; if (!visible.length) { results.innerHTML = `<p class="search-empty">${q ? 'No pages match that search.' : 'Start typing to search this site.'}</p>`; return; } results.innerHTML = visible.map((e,i) => `<div class="search-result ${i===0?'is-selected':''}" role="option" aria-selected="${i===0}" data-result="${i}"><strong>${e.title}</strong><small>${e.category}</small><p>${e.description}</p></div>`).join(''); };
    const close = () => { dialog.classList.remove('is-open'); backdrop.hidden = true; setTimeout(() => dialog.hidden = true, 220); document.body.classList.remove('modal-open'); };
    const open = () => { dialog.hidden = false; backdrop.hidden = false; document.body.classList.add('modal-open'); requestAnimationFrame(() => dialog.classList.add('is-open')); input.value = ''; render(''); setTimeout(() => input.focus(), 20); };
    const go = index => { const entry = visible[index]; if (!entry) return; const history = [entry.title,...stored().filter(t => t !== entry.title)].slice(0,5); localStorage.setItem('website-recent-searches', JSON.stringify(history)); window.location.href = `${prefix}${entry.url}`; };
    $$('[data-open-search]').forEach(b => b.addEventListener('click', open)); $('[data-close-search]').addEventListener('click', close); backdrop.addEventListener('click', close); input.addEventListener('input', () => render(input.value)); results.addEventListener('click', e => { const item = e.target.closest('[data-result]'); if (item) go(Number(item.dataset.result)); });
    document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dialog.hidden) open(); } if (e.key === 'Escape' && !dialog.hidden) close(); if (dialog.hidden || !visible.length) return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length; $$('[data-result]', results).forEach((item,i) => { item.classList.toggle('is-selected', i === selected); item.setAttribute('aria-selected', String(i === selected)); }); } if (e.key === 'Enter' && document.activeElement === input) go(selected); });
  }
  function setupForm() { const form = $('[data-contact-form]'); if (!form) return; form.addEventListener('submit', e => { e.preventDefault(); let valid = true; $$('input,textarea', form).forEach(field => { const error = field.parentElement.querySelector('.field-error'); let message = ''; if (!field.value.trim()) message = 'This field is required.'; else if (field.type === 'email' && !field.validity.valid) message = 'Enter a valid email address.'; error.textContent = message; field.setAttribute('aria-invalid', String(Boolean(message))); valid &&= !message; }); const status = $('[data-form-status]', form); if (valid) { status.textContent = 'Thanks — your message is ready, but this demo form has not sent it to a server.'; status.className = 'form-status success'; form.reset(); } else { status.textContent = 'Please correct the highlighted fields.'; status.className = 'form-status'; $(' [aria-invalid="true"]', form)?.focus(); } }); }
  async function init() { await Promise.all([loadComponent('#global-header','header.html'),loadComponent('#global-footer','footer.html')]); repairLinks(); setActiveNav(); setupTheme(); setupMobileMenu(); setupSearch(); setupForm(); }
  document.addEventListener('DOMContentLoaded', init);
})();
