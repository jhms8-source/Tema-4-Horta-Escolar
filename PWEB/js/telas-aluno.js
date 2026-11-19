/**
 * =========================================================================
 * 9. TELAS DO ALUNO (INÍCIO, MEU PLANTIO, MINHAS TAREFAS)
 * =========================================================================
 */
function getStudentPlantios() {
  const email = UIState.session.email.toLowerCase();
  const vol = CrudStore.db.voluntarios.find((v) => v.email.toLowerCase() === email);
  if (!vol) return [];
  return CrudStore.db.plantios.filter(
    (p) => Array.isArray(p.voluntariosIds) && p.voluntariosIds.map(Number).includes(Number(vol.id))
  );
}

function getStudentTasks() {
  const email = UIState.session.email.toLowerCase();
  return CrudStore.db.tarefasAluno.filter((t) => t.voluntarioEmail.toLowerCase() === email);
}

function renderAlunoInicio() {
  const plantios = getStudentPlantios();
  const tasks = getStudentTasks();
  const pendentes = tasks.filter((t) => t.status === 'Pendente').length;
  const primeiroCanteiro =
    plantios.length > 0
      ? CrudStore.db.canteiros.find((c) => Number(c.id) === Number(plantios[0].canteiroId))?.identificacao || 'Canteiro atribuído'
      : 'Aguardando vínculo';

  return `
    <div>
      <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight mb-1">
        Olá, ${escapeHtml(UIState.session.nome)}!
      </h1>
      <p class="text-sm text-[#5D7A42] mb-6">
        Acompanhe seu canteiro atribuído e suas tarefas na horta escolar.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div onclick="selectMenu('meu_plantio')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Canteiro atribuído</p>
          <p class="text-2xl font-extrabold text-hv-forest mt-1.5">${escapeHtml(primeiroCanteiro)}</p>
          <p class="text-xs font-semibold text-hv-green mt-2">Abrir Meu plantio &rarr;</p>
        </div>

        <div onclick="selectMenu('minhas_tarefas')" class="hv-card p-5 cursor-pointer hover:border-hv-green transition">
          <p class="text-xs font-semibold uppercase tracking-wider text-[#5D7A42]">Tarefas pendentes</p>
          <p class="text-2xl font-extrabold text-hv-forest mt-1.5">${pendentes}</p>
          <p class="text-xs font-semibold text-hv-green mt-2">Abrir Minhas tarefas &rarr;</p>
        </div>
      </div>

      <div class="hv-card p-5 sm:p-6">
        <h2 class="text-[16px] font-bold text-hv-forest mb-3">Orientações aos voluntários</h2>
        <ul class="space-y-2 text-sm text-hv-forest list-disc pl-5">
          <li>Realizar a rega nos horários indicados em <strong>Minhas tarefas</strong>.</li>
          <li>Clicar no cartão da tarefa para atualizar o status entre <strong>Pendente</strong> e <strong>Concluída</strong>.</li>
          <li>Manter as ferramentas limpas e organizadas após o uso no canteiro.</li>
        </ul>
      </div>
    </div>
  `;
}

function renderAlunoMeuPlantio() {
  const plantios = getStudentPlantios();

  const cards = plantios.length
    ? plantios
        .map((p) => {
          const cant = CrudStore.db.canteiros.find((c) => Number(c.id) === Number(p.canteiroId))?.identificacao || 'Canteiro B';
          const cult = CrudStore.db.culturas.find((c) => Number(c.id) === Number(p.culturaId))?.nome || 'Alface';
          const vols = (p.voluntariosIds || [])
            .map((id) => {
              const v = CrudStore.db.voluntarios.find((vol) => Number(vol.id) === Number(id));
              return v ? v.nome.split(' ')[0] : null;
            })
            .filter(Boolean)
            .join(', ');

          return `
            <div class="hv-card p-6">
              <div class="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-hv-border/70">
                <h2 class="text-lg font-bold text-hv-forest">${escapeHtml(cant)}</h2>
                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-hv-badgePos text-hv-forest">
                  Ativo
                </span>
              </div>

              <div class="space-y-3 text-[14px]">
                <div class="flex items-center justify-between">
                  <span class="text-[#5D7A42] font-medium">Cultura</span>
                  <span class="font-bold text-hv-forest">${escapeHtml(cult)}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#5D7A42] font-medium">Plantio</span>
                  <span class="font-semibold text-hv-forest">${formatDateBR(p.dataPlantio)}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#5D7A42] font-medium">Colheita prevista</span>
                  <span class="font-semibold text-hv-forest">${formatDateBR(p.colheitaPrevista)}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#5D7A42] font-medium">Quantidade</span>
                  <span class="font-semibold text-hv-forest">${escapeHtml(p.quantidade)} mudas</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#5D7A42] font-medium">Voluntários</span>
                  <span class="font-semibold text-hv-forest">${escapeHtml(vols || '—')}</span>
                </div>
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="hv-card p-6 text-center">
        <h2 class="text-base font-bold text-hv-forest mb-1">Nenhum plantio vinculado ainda</h2>
        <p class="text-sm text-[#5D7A42]">
          Seu perfil já está disponível. Assim que o professor vincular você a um canteiro em <strong>Plantios</strong>, ele aparecerá aqui.
        </p>
      </div>
    `;

  return `
    <div class="max-w-[580px]">
      <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight mb-5">Meu plantio</h1>
      <div class="space-y-4">
        ${cards}
      </div>
    </div>
  `;
}

function renderAlunoMinhasTarefas() {
  const tasks = getStudentTasks();

  const cards = tasks.length
    ? tasks
        .map((t) => {
          const done = t.status === 'Concluída';
          const badge = done
            ? `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-hv-badgePos text-hv-forest">Concluída</span>`
            : `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-hv-badgeWarn text-hv-warnText">Pendente</span>`;

          return `
            <div
              onclick="toggleStudentTask(${Number(t.id)})"
              role="button"
              tabindex="0"
              class="hv-card p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-hv-green transition select-none"
              title="Clique para alternar o status entre Pendente e Concluída"
            >
              <div>
                <h2 class="text-[16px] font-bold text-hv-forest ${done ? 'line-through opacity-75' : ''}">
                  ${escapeHtml(t.titulo)} &middot; ${escapeHtml(t.canteiro)}
                </h2>
                <p class="text-xs font-medium text-[#5D7A42] mt-1">
                  ${escapeHtml(t.data)} &middot; ${escapeHtml(t.horario)}
                </p>
              </div>
              <div class="shrink-0">
                ${badge}
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="hv-card p-6 text-center">
        <h2 class="text-base font-bold text-hv-forest mb-1">Nenhuma tarefa agendada</h2>
        <p class="text-sm text-[#5D7A42]">
          Quando o professor atribuir uma tarefa ao seu canteiro, ela aparecerá aqui.
        </p>
      </div>
    `;

  return `
    <div class="max-w-[640px]">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
        <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight">Minhas tarefas</h1>
        <span class="text-xs text-[#5D7A42]">Clique no cartão para alternar o status</span>
      </div>
      <div class="space-y-3.5">
        ${cards}
      </div>
    </div>
  `;
}

