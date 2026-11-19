/**
 * =========================================================================
 * 4. ESTADO DA INTERFACE E FEEDBACK VISUAL (TOASTS E MODAIS)
 * =========================================================================
 */
const UIState = {
  session: null,
  authView: 'login_aluno',
  activeMenu: 'inicio',
  mode: 'list',
  editingId: null,
  searchQuery: '',
  draft: null,
  fieldErrors: {},
  lastDeleteRoute: null,
  mobileSidebarOpen: false
};

// Exibe notificação flutuante no canto inferior direito
function showToast(message, variant = 'success') {
  const box = document.getElementById('toast-container');
  if (!box) return;

  const palette = {
    success: 'bg-hv-forest text-white border-hv-green',
    warning: 'bg-hv-amber text-hv-forest border-amber-500',
    error: 'bg-red-700 text-white border-red-900'
  };

  const el = document.createElement('div');
  el.className = `pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-[14px] border shadow-lg text-sm font-medium transition-all duration-200 ${palette[variant] || palette.success}`;
  el.innerHTML = `
    <span class="mt-0.5 shrink-0">
      ${variant === 'error'
        ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/></svg>'
        : '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
      }
    </span>
    <span class="leading-snug">${escapeHtml(message)}</span>
  `;
  box.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 220);
  }, 3800);
}

// Abre modal de confirmação antes de chamar /excluirNomeCadastro
function openDeleteModal({ entity, id, label }) {
  const routePreview = `${ROTAS_EXCLUSAO[entity]}?id=${id}`;

  const root = document.getElementById('modal-container');
  root.innerHTML = `
    <div class="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="hv-card w-full max-w-md p-6 shadow-2xl">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-hv-forest">Confirmar remoção</h3>
            <p class="text-xs text-[#5D7A42]">Deseja realmente excluir este registro?</p>
          </div>
        </div>

        <p class="text-sm text-hv-forest mb-3">
          Registro selecionado: <strong>${escapeHtml(label)}</strong> (ID: #${Number(id)})
        </p>

        <div class="bg-hv-sage border border-hv-border rounded-[12px] px-3.5 py-2 text-xs text-hv-forest font-mono mb-5">
          Rota acionada: <strong>${escapeHtml(routePreview)}</strong>
        </div>

        <div class="flex items-center justify-end gap-2.5">
          <button type="button" onclick="executeDelete('${entity}', ${Number(id)})" class="hv-btn px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer">
            Remover
          </button>
          <button type="button" data-foco onclick="closeModal()" class="hv-btn px-4 py-2 text-sm font-semibold bg-white border border-hv-border text-hv-forest hover:bg-hv-softRow cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
  // Foco no botão seguro (Cancelar), padrão do Windows para ações destrutivas
  root.querySelector('[data-foco]')?.focus();
}

// Executa a exclusão confirmada e atualiza a tela
function executeDelete(entity, id) {
  const executedRoute = CrudStore.deleteById(entity, id);
  UIState.lastDeleteRoute = executedRoute;
  closeModal();
  showToast(`Registro excluído (${executedRoute}).`, 'success');
  render();
}

// Modal de recuperação de senha ("Esqueci minha senha")
function openForgotModal(isAdm = false) {
  const root = document.getElementById('modal-container');
  root.innerHTML = `
    <div class="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="hv-card w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-lg font-bold text-hv-forest mb-1">Esqueci minha senha</h3>
        <p class="text-xs text-[#5D7A42] mb-4">
          Informe seu e-mail para enviarmos o link de redefinição de senha.
        </p>
        <form id="forgot-password-form" novalidate class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-hv-forest mb-1.5">E-mail</label>
            <input type="email" id="forgot-email-input" data-foco placeholder="${isAdm ? 'prof@escola.com' : 'voce@escola.com'}" class="hv-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div class="flex items-center justify-end gap-2.5">
            <button type="submit" class="hv-btn px-4 py-2 text-sm font-semibold bg-hv-green hover:bg-hv-greenHover text-white cursor-pointer">
              Enviar link
            </button>
            <button type="button" onclick="closeModal()" class="hv-btn px-4 py-2 text-sm font-semibold bg-white border border-hv-border text-hv-forest hover:bg-hv-softRow cursor-pointer">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  root.querySelector('[data-foco]')?.focus();

  document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = document.getElementById('forgot-email-input').value.trim();
    if (!isValidEmail(emailVal)) {
      showToast('Digite um endereço de e-mail válido.', 'error');
      return;
    }
    closeModal();
    showToast(`Link de recuperação enviado para ${emailVal}.`, 'success');
  });
}

function closeModal() {
  const root = document.getElementById('modal-container');
  if (root) root.innerHTML = '';
}

// Esc fecha a janela aberta (padrão do Windows)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function renderFieldError(fieldName) {
  const msg = UIState.fieldErrors[fieldName];
  if (!msg) return '';
  return `<p class="mt-1 text-xs font-medium text-red-600">${escapeHtml(msg)}</p>`;
}

