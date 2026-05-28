'use strict';

// ── Filtering ─────────────────────────────────────────────
const chips       = document.querySelectorAll('.s-chip');
const cards       = document.querySelectorAll('.s-card');
const emptyMsg    = document.querySelector('.s-empty');
const activeFilters = new Set();

function applyFilters() {
  let visible = 0;
  cards.forEach(card => {
    const envs = card.dataset.envs.split(' ');
    const show = activeFilters.size === 0 || [...activeFilters].some(f => envs.includes(f));
    card.hidden = !show;
    if (show) visible++;
  });
  emptyMsg.hidden = visible > 0;
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    if (activeFilters.has(f)) {
      activeFilters.delete(f);
      chip.setAttribute('aria-pressed', 'false');
    } else {
      activeFilters.add(f);
      chip.setAttribute('aria-pressed', 'true');
    }
    applyFilters();
  });
});

// ── Modal ─────────────────────────────────────────────────
const modal         = document.getElementById('session-modal');
const backdrop      = modal.querySelector('.s-modal__backdrop');
const closeBtn      = modal.querySelector('.s-modal__close');
const modalEnv      = document.getElementById('modal-env');
const modalTitle    = document.getElementById('modal-title');
const modalDuration = document.getElementById('modal-duration');
const modalDesc     = document.getElementById('modal-desc');
const modalNotices  = document.getElementById('modal-notices');
const modalDownload = document.getElementById('modal-download');
const modalConfirm  = document.getElementById('modal-confirm');

let lastFocused = null;

function openModal(btn) {
  lastFocused = btn;
  modalEnv.textContent      = btn.dataset.env;
  modalTitle.textContent    = btn.dataset.title;
  modalDuration.textContent = btn.dataset.duration;
  modalDesc.textContent     = btn.dataset.desc;
  modalNotices.innerHTML    = btn.dataset.notices
    .split('|')
    .map(n => `<li>${n}</li>`)
    .join('');
  modalDownload.hidden = false;
  modalConfirm.hidden  = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.s-download').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn));
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// Focus trap
modal.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = [...modal.querySelectorAll('button:not([hidden])')];
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});

// Download confirmation
modalDownload.addEventListener('click', () => {
  modalDownload.hidden = true;
  modalConfirm.hidden  = false;
});
