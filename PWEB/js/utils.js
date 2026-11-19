/**
 * =========================================================================
 * 3. UTILITÁRIOS DE FORMATAÇÃO, VALIDAÇÃO, SENHA E LOGOTIPO SVG
 * =========================================================================
 */
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function formatDateBR(isoDate) {
  if (!isoDate || !isoDate.includes('-')) return isoDate || '—';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function formatShortDateBR(isoDate) {
  if (!isoDate || !isoDate.includes('-')) return isoDate || '—';
  const [, m, d] = isoDate.split('-');
  return `${d}/${m}`;
}

function deriveNameFromEmail(email) {
  const prefix = String(email || '').split('@')[0] || 'Aluno';
  return prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'Aluno';
}

// Renderiza input de senha com botão de "olhinho" para mostrar/ocultar caracteres
function renderPasswordField({ id, name, placeholder = '••••••••', hasError = false }) {
  return `
    <div class="relative">
      <input
        id="${id}"
        name="${name}"
        type="password"
        placeholder="${escapeHtml(placeholder)}"
        class="hv-input w-full pl-3.5 pr-11 py-2.5 text-[14px] ${hasError ? 'hv-input-error' : ''}"
      />
      <button
        type="button"
        onclick="togglePasswordVisibility('${id}', this)"
        aria-label="Mostrar ou ocultar senha"
        title="Mostrar ou ocultar senha"
        class="absolute inset-y-0 right-0 px-3.5 flex items-center text-[#5D7A42] hover:text-hv-forest transition cursor-pointer"
      >
        <svg data-eye-open class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg data-eye-closed class="w-4 h-4 hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      </button>
    </div>
  `;
}

// Alterna o tipo do campo entre password e text
function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input || !btnEl) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  const openIcon = btnEl.querySelector('[data-eye-open]');
  const closedIcon = btnEl.querySelector('[data-eye-closed]');
  if (openIcon && closedIcon) {
    openIcon.classList.toggle('hidden', isHidden);
    closedIcon.classList.toggle('hidden', !isHidden);
  }
}

// Logotipo HortaViva (círculo verde + folha inclinada + título)
function renderLogo(size = 44, lightText = false) {
  const textColor = lightText ? 'text-white' : 'text-hv-forest';
  const fontSize = size >= 44 ? 'text-[26px]' : 'text-[20px]';
  return `
    <div class="inline-flex items-center gap-3 select-none">
      <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="shrink-0">
        <circle cx="24" cy="24" r="24" fill="#3B6D11" />
        <path d="M33.8 14.2C25.5 13.8 16.5 18.2 14.3 26.8C13.6 29.5 14.1 32.1 15.3 33.9C17.1 35.1 19.7 35.6 22.4 34.9C31 32.7 35.4 23.7 35 15.4C34.9 14.7 34.5 14.3 33.8 14.2Z" fill="#B8D688" />
        <path d="M15.6 33.6C20.2 28.9 25.4 23.7 31.2 18.4" stroke="#3B6D11" stroke-width="2.2" stroke-linecap="round" />
      </svg>
      <span class="font-extrabold tracking-tight leading-none ${textColor} ${fontSize}">HortaViva</span>
    </div>
  `;
}

function renderLeafMark(size = 50) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="mx-auto">
      <circle cx="24" cy="24" r="24" fill="#3B6D11" />
      <path d="M33.8 14.2C25.5 13.8 16.5 18.2 14.3 26.8C13.6 29.5 14.1 32.1 15.3 33.9C17.1 35.1 19.7 35.6 22.4 34.9C31 32.7 35.4 23.7 35 15.4C34.9 14.7 34.5 14.3 33.8 14.2Z" fill="#B8D688" />
      <path d="M15.6 33.6C20.2 28.9 25.4 23.7 31.2 18.4" stroke="#3B6D11" stroke-width="2.2" stroke-linecap="round" />
    </svg>
  `;
}

function getMenuIcon(key) {
  const map = {
    inicio: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    canteiros: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 6h16M12 4v16"/></svg>`,
    culturas: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21V11m0 0c0-4 3-7 7-7 0 4-3 7-7 7zm0 0c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/></svg>`,
    plantios: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    voluntarios: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    colheitas: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`,
    meu_plantio: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21V11m0 0c0-4 3-7 7-7 0 4-3 7-7 7zm0 0c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/></svg>`,
    minhas_tarefas: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`
  };
  return map[key] || '';
}

// Etiqueta colorida usada nas tabelas (tipo: ok, aviso ou erro)
function badge(texto, tipo = 'ok') {
  const cores = {
    ok: 'bg-hv-badgePos text-hv-forest',
    aviso: 'bg-hv-badgeWarn text-hv-warnText',
    erro: 'bg-red-100 text-red-700'
  };
  return `<span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${cores[tipo]}">${escapeHtml(texto)}</span>`;
}

// Soma dias a uma data ISO (AAAA-MM-DD) e devolve outra data ISO
function somarDias(isoDate, dias) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const nova = new Date(y, m - 1, d + dias);
  return `${nova.getFullYear()}-${String(nova.getMonth() + 1).padStart(2, '0')}-${String(nova.getDate()).padStart(2, '0')}`;
}
