/**
 * =========================================================================
 * 6. LAYOUT AUTENTICADO (MENU LATERAL + TOPBAR COM E-MAIL E OPÇÃO SAIR)
 * =========================================================================
 */
function renderAuthenticatedShell(innerHtml) {
  const isAdm = UIState.session.perfil === 'adm';
  const menuOptions = isAdm
    ? [
        { key: 'inicio', label: 'Início' },
        { key: 'canteiros', label: 'Canteiros' },
        { key: 'culturas', label: 'Culturas' },
        { key: 'plantios', label: 'Plantios' },
        { key: 'voluntarios', label: 'Voluntários' }
      ]
    : [
        { key: 'inicio', label: 'Início' },
        { key: 'meu_plantio', label: 'Meu plantio' },
        { key: 'minhas_tarefas', label: 'Minhas tarefas' }
      ];

  const sidebarLinks = menuOptions
    .map((opt) => {
      const isActive = UIState.activeMenu === opt.key;
      const classes = isActive
        ? 'bg-hv-green text-white font-semibold'
        : 'text-[#DCEBC9] hover:bg-white/10 hover:text-white font-medium';
      return `
        <button
          type="button"
          onclick="selectMenu('${opt.key}')"
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[14px] text-left transition cursor-pointer ${classes}"
        >
          ${getMenuIcon(opt.key)}
          <span>${escapeHtml(opt.label)}</span>
        </button>
      `;
    })
    .join('');

  const profileBadge = isAdm
    ? `<span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-hv-amber text-hv-forest">Professor</span>`
    : `<span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-hv-badgePos text-hv-forest">Aluno</span>`;

  const routeFeedback = UIState.lastDeleteRoute
    ? `
      <div class="mb-4 flex items-center justify-between gap-2 px-4 py-2.5 rounded-[14px] bg-white border border-hv-border text-xs text-hv-forest">
        <div>
          Rota de exclusão executada: <code class="font-mono font-bold bg-hv-sage px-1.5 py-0.5 rounded">${escapeHtml(UIState.lastDeleteRoute)}</code>
        </div>
        <button type="button" onclick="clearRouteFeedback()" class="font-semibold text-hv-green hover:underline cursor-pointer">Fechar</button>
      </div>
    `
    : '';

  return `
    <div class="min-h-screen flex bg-hv-sage">
      ${UIState.mobileSidebarOpen
        ? `<div onclick="toggleSidebar(false)" class="fixed inset-0 z-30 bg-black/40 lg:hidden"></div>`
        : ''
      }

      <!-- Menu Lateral Fixo (#27500A) -->
      <aside class="fixed inset-y-0 left-0 z-40 w-[236px] bg-hv-forest text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${UIState.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
        <div>
          <div class="h-16 px-5 flex items-center justify-between border-b border-white/10">
            ${renderLogo(32, true)}
            <button type="button" onclick="toggleSidebar(false)" class="lg:hidden p-1 text-white/80 hover:text-white" aria-label="Fechar menu">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <nav class="p-3 space-y-1">
            ${sidebarLinks}
          </nav>
        </div>

        <div class="p-3">
          <div class="p-3.5 rounded-[14px] bg-white/5 border border-white/10 text-[11px] text-hv-leaf">
            <div class="font-semibold text-white mb-0.5 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-hv-badgePos"></span>
              Cookies de sessão ativos
            </div>
            <p class="truncate opacity-85" title="${escapeHtml(CookieAuth.debugString())}">
              ${escapeHtml(CookieAuth.debugString())}
            </p>
          </div>
        </div>
      </aside>

      <!-- Coluna Principal -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Barra Superior Branca (#FFFFFF) -->
        <header class="h-16 bg-white border-b border-hv-border px-4 sm:px-7 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div class="flex items-center gap-3">
            <button
              type="button"
              onclick="toggleSidebar(true)"
              class="lg:hidden p-2 rounded-[10px] border border-hv-border text-hv-forest hover:bg-hv-sage"
              aria-label="Abrir menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <span class="text-xs font-medium text-[#5D7A42] hidden sm:inline">
              Gestão de Horta Escolar
            </span>
          </div>

          <div class="flex items-center gap-2.5 sm:gap-3.5">
            ${profileBadge}
            <span class="text-xs sm:text-[13px] font-medium text-hv-forest truncate max-w-[150px] sm:max-w-none">
              ${escapeHtml(UIState.session.email)}
            </span>
            <button
              type="button"
              onclick="logoutUser()"
              class="hv-btn px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold bg-white hover:bg-hv-softRow text-hv-forest border border-hv-border cursor-pointer"
            >
              Sair
            </button>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-7 max-w-[1040px] w-full mx-auto">
          ${routeFeedback}
          ${innerHtml}
        </main>
      </div>
    </div>
  `;
}

