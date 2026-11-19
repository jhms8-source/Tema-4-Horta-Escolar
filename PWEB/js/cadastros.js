/**
 * =========================================================================
 * CADASTROS: cada cadastro é descrito por DADOS (campos, colunas, regras).
 * O formulário, a validação e a tabela são montados a partir daqui.
 * Para criar um cadastro novo, basta adicionar um bloco neste objeto.
 * =========================================================================
 * Tipos de campo: texto, email, numero, data, hora, select, radio, checkbox, multicheck
 */
const nomeDe = (lista, id, campo, padrao = '—') =>
  CrudStore.db[lista].find((x) => Number(x.id) === Number(id))?.[campo] || padrao;

const negrito = (texto) => `<span class="font-semibold text-hv-forest">${escapeHtml(texto)}</span>`;

const CADASTROS = {
  canteiros: {
    titulo: 'Canteiros', singular: 'canteiro', novo: 'Novo',
    padrao: { situacao: 'Livre', ativo: true },
    busca: (c) => `${c.identificacao} ${c.localizacao} ${c.situacao}`,
    rotulo: (c) => c.identificacao,
    colunas: [
      { titulo: 'Nome', valor: (c) => negrito(c.identificacao) },
      { titulo: 'Local', valor: (c) => escapeHtml(c.localizacao) },
      { titulo: 'Área', valor: (c) => `${escapeHtml(c.area)} m&sup2;` },
      { titulo: 'Situação', valor: (c) => badge(c.situacao, c.situacao === 'Livre' ? 'ok' : 'aviso') }
    ],
    campos: [
      { nome: 'identificacao', rotulo: 'Identificação', tipo: 'texto', placeholder: 'Canteiro D', obrigatorio: true, msg: 'Informe a identificação do canteiro (ex: Canteiro D).' },
      { nome: 'localizacao', rotulo: 'Localização', tipo: 'select', opcoes: ['Pátio', 'Fundos', 'Entrada', 'Estufa'], obrigatorio: true, msg: 'Selecione a localização do canteiro.' },
      { nome: 'area', rotulo: 'Área (m&sup2;)', tipo: 'numero', min: 0.5, step: 0.5, placeholder: '6', obrigatorio: true, msg: 'Informe uma área válida maior que 0 m².' },
      { nome: 'solo', rotulo: 'Tipo de solo', tipo: 'select', opcoes: ['Argiloso', 'Arenoso', 'Humoso', 'Misturado'], obrigatorio: true, msg: 'Selecione o tipo de solo.' },
      { nome: 'situacao', rotulo: 'Situação', tipo: 'radio', opcoes: ['Livre', 'Ocupado'], obrigatorio: true, msg: 'Selecione a situação (Livre ou Ocupado).' },
      { nome: 'ativo', rotulo: 'Canteiro ativo', tipo: 'checkbox' }
    ]
  },

  culturas: {
    titulo: 'Culturas', singular: 'cultura', novo: 'Nova',
    padrao: { ativa: true },
    busca: (c) => `${c.nome} ${c.tipo} ${c.cicloDias}`,
    rotulo: (c) => c.nome,
    colunas: [
      { titulo: 'Nome', valor: (c) => negrito(c.nome) },
      { titulo: 'Ciclo', valor: (c) => `${escapeHtml(c.cicloDias)} dias` },
      { titulo: 'Situação', valor: (c) => (c.ativa ? badge('Ativa', 'ok') : badge('Inativa', 'aviso')) }
    ],
    campos: [
      { nome: 'nome', rotulo: 'Nome da cultura', tipo: 'texto', placeholder: 'Cenoura', obrigatorio: true, msg: 'Informe o nome da cultura.' },
      { nome: 'cicloDias', rotulo: 'Ciclo até a colheita (dias)', tipo: 'numero', min: 1, placeholder: '75', obrigatorio: true, msg: 'Informe o ciclo em dias (mínimo 1 dia).' },
      { nome: 'tipo', rotulo: 'Tipo', tipo: 'select', opcoes: ['Raiz', 'Folhosa', 'Fruto', 'Legume'], obrigatorio: true, msg: 'Selecione o tipo da cultura.' },
      { nome: 'epoca', rotulo: 'Época de plantio', tipo: 'select', opcoes: ['Ano todo', 'Outono / Inverno', 'Primavera / Verão'], obrigatorio: true, msg: 'Selecione a época de plantio.' },
      { nome: 'rega', rotulo: 'Rega', tipo: 'radio', opcoes: ['Diária', 'Dias alternados'], obrigatorio: true, msg: 'Selecione a frequência de rega.' },
      { nome: 'ativa', rotulo: 'Cultura ativa', tipo: 'checkbox' }
    ]
  },

  plantios: {
    titulo: 'Plantios', singular: 'plantio', novo: 'Novo',
    padrao: { tarefa: 'Rega', horario: '08:00', prioridadeTurno: 'Manhã (Rotina)', gerarTarefaAuto: true, voluntariosIds: [] },
    rotulo: (p) => `${nomeDe('canteiros', p.canteiroId, 'identificacao')} · ${nomeDe('culturas', p.culturaId, 'nome')}`,
    busca: (p) => `${nomeDe('canteiros', p.canteiroId, 'identificacao', '')} ${nomeDe('culturas', p.culturaId, 'nome', '')} ${p.tarefa}`,
    colunas: [
      { titulo: 'Canteiro', valor: (p) => negrito(nomeDe('canteiros', p.canteiroId, 'identificacao')) },
      { titulo: 'Cultura', valor: (p) => escapeHtml(nomeDe('culturas', p.culturaId, 'nome')) },
      { titulo: 'Plantio', valor: (p) => formatDateBR(p.dataPlantio) },
      { titulo: 'Colheita prev.', valor: (p) => badge(formatDateBR(p.colheitaPrevista), 'ok') },
      { titulo: 'Mudas', valor: (p) => `${escapeHtml(p.quantidade)} mudas` },
      { titulo: 'Destino', valor: (p) => escapeHtml(p.destino || '—') }
    ],
    campos: [
      {
        nome: 'canteiroId', rotulo: 'Canteiro', tipo: 'select', numerico: true, obrigatorio: true, msg: 'Selecione o canteiro.',
        opcoes: () => CrudStore.db.canteiros.map((c) => ({ valor: c.id, texto: `${c.identificacao} (${c.localizacao})` })),
        // Regra de negócio: um canteiro só pode ter um plantio ativo
        valida: (v, d) => CrudStore.db.plantios.some((p) => Number(p.canteiroId) === Number(v) && Number(p.id) !== Number(d.id))
          ? 'Este canteiro já tem um plantio ativo.' : ''
      },
      {
        nome: 'culturaId', rotulo: 'Cultura', tipo: 'select', numerico: true, obrigatorio: true, msg: 'Selecione a cultura.',
        opcoes: () => CrudStore.db.culturas.map((c) => ({ valor: c.id, texto: `${c.nome} (${c.cicloDias} dias)` }))
      },
      { nome: 'dataPlantio', rotulo: 'Data do plantio', tipo: 'data', meia: true, obrigatorio: true, msg: 'Informe a data do plantio.' },
      { nome: 'colheitaPrevista', rotulo: 'Colheita prevista (plantio + ciclo)', tipo: 'data', meia: true, somenteLeitura: true },
      { nome: 'quantidade', rotulo: 'Quantidade de mudas', tipo: 'numero', min: 1, placeholder: '40', obrigatorio: true, msg: 'Informe a quantidade de mudas.' },
      { nome: 'destino', rotulo: 'Destino da produção', tipo: 'select', opcoes: ['Cantina', 'Doação', 'Vendas voluntárias'], obrigatorio: true, msg: 'Selecione o destino da produção.' },
      {
        nome: 'voluntariosIds', rotulo: 'Voluntários', tipo: 'multicheck', obrigatorio: true, msg: 'Marque pelo menos um voluntário.',
        opcoes: () => CrudStore.db.voluntarios.map((v) => ({ valor: v.id, texto: v.nome }))
      },
      { nome: 'tarefa', rotulo: 'Tarefa inicial', tipo: 'select', meia: true, semVazio: true, opcoes: ['Rega', 'Adubação', 'Capina', 'Colheita'] },
      { nome: 'horario', rotulo: 'Horário', tipo: 'hora', meia: true, obrigatorio: true, msg: 'Informe o horário.' },
      { nome: 'prioridadeTurno', rotulo: 'Prioridade / Turno', tipo: 'radio', opcoes: ['Manhã (Rotina)', 'Tarde (Rotina)', 'Prioritário'], obrigatorio: true, msg: 'Selecione a prioridade ou turno.' },
      { nome: 'gerarTarefaAuto', rotulo: 'Gerar tarefa automática para os voluntários', tipo: 'checkbox' }
    ],
    // Regra de negócio: colheita prevista = data do plantio + ciclo da cultura
    calcular(d) {
      const ciclo = nomeDe('culturas', d.culturaId, 'cicloDias', 0);
      d.colheitaPrevista = d.dataPlantio && ciclo ? somarDias(d.dataPlantio, Number(ciclo)) : '';
    },
    // Recalcula a data na tela quando muda a cultura ou a data do plantio
    aoMudar(form) {
      const d = { culturaId: form.elements.culturaId.value, dataPlantio: form.elements.dataPlantio.value };
      this.calcular(d);
      form.elements.colheitaPrevista.value = d.colheitaPrevista;
    },
    // Marca o canteiro como ocupado e gera as tarefas dos voluntários escalados
    aoSalvar(p, antigo) {
      CrudStore.sincronizarCanteiro(p.canteiroId);
      if (antigo && Number(antigo.canteiroId) !== Number(p.canteiroId)) CrudStore.sincronizarCanteiro(antigo.canteiroId);
      if (!p.gerarTarefaAuto) return;
      const canteiro = nomeDe('canteiros', p.canteiroId, 'identificacao');
      p.voluntariosIds.forEach((vId) => {
        const v = CrudStore.db.voluntarios.find((x) => Number(x.id) === Number(vId));
        if (!v || !v.email) return;
        CrudStore.db.tarefasAluno.unshift({
          id: CrudStore.nextId(CrudStore.db.tarefasAluno),
          voluntarioEmail: v.email, titulo: p.tarefa, canteiro,
          data: formatShortDateBR(p.dataPlantio), horario: p.horario, status: 'Pendente'
        });
      });
    }
  },

  voluntarios: {
    titulo: 'Voluntários', singular: 'voluntário', novo: 'Novo',
    subtitulo: 'Alunos também são registrados automaticamente ao fazerem cadastro ou login no portal.',
    padrao: { turno: 'Manhã', situacao: 'Ativo', aceitouRegras: true },
    busca: (v) => `${v.nome} ${v.email} ${v.situacao}`,
    rotulo: (v) => v.nome,
    colunas: [
      {
        titulo: 'Nome',
        valor: (v) => `<div><div class="font-semibold text-hv-forest">${escapeHtml(v.nome)}</div>
          <div class="text-xs text-[#5D7A42]">${escapeHtml(v.email)} &middot; ${escapeHtml(v.turno)}</div></div>`
      },
      { titulo: 'Situação', valor: (v) => badge(v.situacao, { Ativo: 'ok', Pendente: 'aviso' }[v.situacao] || 'erro') }
    ],
    campos: [
      { nome: 'nome', rotulo: 'Nome completo', tipo: 'texto', placeholder: 'Ana Souza', obrigatorio: true, msg: 'Informe o nome completo.' },
      {
        nome: 'email', rotulo: 'E-mail', tipo: 'email', placeholder: 'ana@escola.com', obrigatorio: true, msg: 'Informe um e-mail válido.',
        valida: (v, d) => CrudStore.db.voluntarios.some((x) => x.email.toLowerCase() === v.toLowerCase() && Number(x.id) !== Number(d.id))
          ? 'Já existe um voluntário com este e-mail.' : ''
      },
      {
        nome: 'turma', rotulo: 'Turma / Série', tipo: 'select', obrigatorio: true, msg: 'Selecione a turma/série.',
        opcoes: ['8º Ano A - Fundamental', '9º Ano A - Fundamental', '9º Ano B - Fundamental', '1º Ano A - Ensino Médio', '1º Ano B - Ensino Médio', '2º Ano A - Ensino Médio', '3º Ano A - Ensino Médio']
      },
      { nome: 'turno', rotulo: 'Turno', tipo: 'radio', opcoes: ['Manhã', 'Tarde'], obrigatorio: true, msg: 'Selecione o turno (Manhã ou Tarde).' },
      { nome: 'situacao', rotulo: 'Situação', tipo: 'select', semVazio: true, opcoes: ['Ativo', 'Pendente', 'Inativo'], obrigatorio: true, msg: 'Selecione a situação.' },
      { nome: 'aceitouRegras', rotulo: 'Aceitou regras da horta', tipo: 'checkbox', obrigatorio: true, msg: 'Confirme o aceite das regras da horta.' }
    ]
  }
};
