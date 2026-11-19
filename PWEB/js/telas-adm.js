/**
 * =========================================================================
 * 7. TELAS DO ADMINISTRADOR (PAINEL + LISTAGEM GENÉRICA DOS CADASTROS)
 * =========================================================================
 */
function renderAdmDashboard() {
  const livres = CrudStore.db.canteiros.filter((c) => c.situacao === 'Livre').length;
  const ocupados = CrudStore.db.canteiros.filter((c) => c.situacao === 'Ocupado').length;
  const plantios = CrudStore.db.plantios.length;
  const voluntarios = CrudStore.db.voluntarios.length;

  const proximas = CrudStore.db.plantios
    .slice()
    .sort((a, b) => String(a.colheitaPrevista).localeCompare(String(b.colheitaPrevista)))
    .map((p) => {
      const cant = CrudStore.db.canteiros.find((c) => Number(c.id) === Number(p.canteiroId))?.identificacao || 'Canteiro';
      const cult = CrudStore.db.culturas.find((c) => Number(c.id) === Number(p.culturaId))?.nome || 'Cultura';
      return {
        texto: `${cant} · ${cult}`,
        data: formatShortDateBR(p.colheitaPrevista)
      };
    });

  const proximasListHtml = proximas.length
    ? proximas
        .map(
          (item) => `
          <div class="flex items-center justify-between py-2.5 px-3.5 rounded-[12px] bg-hv-softRow border border-hv-border/60">
            <span class="text-[14px] font-semibold text-hv-forest">${escapeHtml(item.texto)}</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hv-badgePos text-hv-forest">
              ${escapeHtml(item.data)}
            </span>
          </div>
        `
        )
        .join('')
    : `<p class="text-sm text-[#5D7A42]">Nenhum plantio cadastrado no momento.</p>`;

  return `
    <div>
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight">Painel</h1>
        <button
          type="button"
          onclick="resetDemoData()"
          class="text-xs font-semibold text-hv-green hover:underline cursor-pointer"
        >
          Restaurar dados iniciais
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div onclick="selectMenu('canteiros')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Livres</p>
          <p class="text-3xl font-extrabold text-hv-forest mt-1.5">${livres}</p>
          <p class="text-xs text-[#5D7A42] mt-1">Canteiros prontos para plantio</p>
        </div>

        <div onclick="selectMenu('canteiros')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Ocupados</p>
          <p class="text-3xl font-extrabold text-hv-forest mt-1.5">${ocupados}</p>
          <p class="text-xs text-[#5D7A42] mt-1">Canteiros cultivados no momento</p>
        </div>

        <div onclick="selectMenu('plantios')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Plantios</p>
          <p class="text-3xl font-extrabold text-hv-forest mt-1.5">${plantios}</p>
          <p class="text-xs text-[#5D7A42] mt-1">Plantios em andamento</p>
        </div>

        <div onclick="selectMenu('voluntarios')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Voluntários</p>
          <p class="text-3xl font-extrabold text-hv-forest mt-1.5">${voluntarios}</p>
          <p class="text-xs text-[#5D7A42] mt-1">Estudantes participantes</p>
        </div>
      </div>

      <div class="hv-card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[16px] font-bold text-hv-forest">Próximas colheitas</h2>
          <button type="button" onclick="selectMenu('plantios')" class="text-xs font-semibold text-hv-green hover:underline cursor-pointer">
            Gerenciar plantios &rarr;
          </button>
        </div>
        <div class="space-y-2.5">
          ${proximasListHtml}
        </div>
      </div>
    </div>
  `;
}

// Listagem genérica (Read) com Atualizar, Remover e Novo, montada a partir de cadastros.js
function renderAdmCrudList(entity) {
  const cad = CADASTROS[entity];
  const q = UIState.searchQuery.toLowerCase().trim();
  const registros = CrudStore.db[entity].filter((r) => !q || cad.busca(r).toLowerCase().includes(q));

  const linhas = registros.length
    ? registros.map((r) => `
        <tr class="border-b border-hv-border/60 last:border-b-0 hover:bg-hv-softRow transition">
          ${cad.colunas.map((col) => `<td class="px-4 py-3.5 text-[14px] text-hv-forest whitespace-nowrap">${col.valor(r)}</td>`).join('')}
          <td class="px-4 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-2">
              <button type="button" onclick="openEditForm('${entity}', ${Number(r.id)})"
                class="hv-btn px-3 py-1.5 text-xs font-semibold bg-white hover:bg-hv-softRow text-hv-forest border border-hv-border cursor-pointer">Atualizar</button>
              <button type="button" onclick="openDeleteModal({ entity: '${entity}', id: ${Number(r.id)}, label: '${escapeHtml(cad.rotulo(r)).replace(/'/g, "\\'")}' })"
                class="hv-btn px-3 py-1.5 text-xs font-semibold bg-white hover:bg-red-50 text-red-700 border border-red-200 cursor-pointer">Remover</button>
            </div>
          </td>
        </tr>`).join('')
    : `<tr><td colspan="${cad.colunas.length + 1}" class="px-4 py-8 text-center text-sm text-[#5D7A42]">Nenhum registro encontrado.</td></tr>`;

  return `
    <div>
      <div class="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight">${cad.titulo}</h1>
          ${cad.subtitulo ? `<p class="text-xs text-[#5D7A42] mt-0.5">${cad.subtitulo}</p>` : ''}
        </div>
        <button type="button" onclick="openCreateForm('${entity}')"
          class="hv-btn px-5 py-2 bg-hv-amber hover:bg-hv-amberHover text-hv-forest font-bold text-sm cursor-pointer">Novo</button>
      </div>

      <div class="mb-4 relative">
        <span class="absolute inset-y-0 left-3.5 flex items-center text-[#7E9962] pointer-events-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
          </svg>
        </span>
        <input type="text" id="crud-search-input" value="${escapeHtml(UIState.searchQuery)}" oninput="onSearchChange(this.value)"
          placeholder="Pesquisar por..." class="hv-input w-full pl-10 pr-4 py-2.5 text-sm" />
      </div>

      <div class="hv-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-hv-softRow border-b border-hv-border">
                ${[...cad.colunas.map((c) => c.titulo), 'Ações'].map((t, i, a) =>
                  `<th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#5D7A42] ${i === a.length - 1 ? 'text-right' : ''}">${t}</th>`).join('')}
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
