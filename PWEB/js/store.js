/**
 * =========================================================================
 * 2. ARMAZENAMENTO FRONT-END CRUD (EM MEMÓRIA + localStorage)
 * =========================================================================
 * Gerencia Canteiros, Culturas, Plantios, Voluntários, Colheitas e Tarefas.
 */
// Rotas de exclusão: /excluirNomeCadastro?id=CHAVE_PRIMARIA (usadas no modal e no deleteById)
const ROTAS_EXCLUSAO = {
  canteiros: '/excluirCanteiro',
  culturas: '/excluirCultura',
  plantios: '/excluirPlantio',
  voluntarios: '/excluirVoluntario'
};

const STORAGE_KEY = 'hortaviva_frontend_crud_v4';

function buildInitialDatabase() {
  return {
    canteiros: [
      { id: 1, identificacao: 'Canteiro A', localizacao: 'Pátio', area: 6, solo: 'Humoso', situacao: 'Livre', ativo: true },
      { id: 2, identificacao: 'Canteiro B', localizacao: 'Fundos', area: 8, solo: 'Humoso', situacao: 'Ocupado', ativo: true },
      { id: 3, identificacao: 'Canteiro C', localizacao: 'Entrada', area: 4, solo: 'Arenoso', situacao: 'Livre', ativo: true },
      { id: 4, identificacao: 'Canteiro D', localizacao: 'Estufa', area: 10, solo: 'Argiloso', situacao: 'Ocupado', ativo: true }
    ],
    culturas: [
      { id: 1, nome: 'Alface', cicloDias: 45, tipo: 'Folhosa', epoca: 'Ano todo', rega: 'Diária', ativa: true },
      { id: 2, nome: 'Tomate', cicloDias: 90, tipo: 'Fruto', epoca: 'Primavera / Verão', rega: 'Dias alternados', ativa: true },
      { id: 3, nome: 'Cenoura', cicloDias: 75, tipo: 'Raiz', epoca: 'Outono / Inverno', rega: 'Diária', ativa: true }
    ],
    voluntarios: [
      { id: 1, nome: 'Ana Souza', email: 'ana@escola.com', turma: '2º Ano A - Ensino Médio', turno: 'Manhã', situacao: 'Ativo', aceitouRegras: true },
      { id: 2, nome: 'Bruno Lima', email: 'bruno@escola.com', turma: '1º Ano B - Ensino Médio', turno: 'Tarde', situacao: 'Pendente', aceitouRegras: true },
      { id: 3, nome: 'Carla Dias', email: 'carla@escola.com', turma: '2º Ano A - Ensino Médio', turno: 'Manhã', situacao: 'Ativo', aceitouRegras: true }
    ],
    plantios: [
      {
        id: 1,
        canteiroId: 2,
        culturaId: 1,
        dataPlantio: '2026-11-12',
        colheitaPrevista: '2026-12-27',
        quantidade: 40,
        destino: 'Cantina',
        voluntariosIds: [1, 3],
        tarefa: 'Rega',
        horario: '08:00',
        prioridadeTurno: 'Manhã (Rotina)',
        gerarTarefaAuto: true
      },
      {
        id: 2,
        canteiroId: 4,
        culturaId: 2,
        dataPlantio: '2026-10-04',
        colheitaPrevista: '2027-01-02',
        quantidade: 24,
        destino: 'Doação',
        voluntariosIds: [1],
        tarefa: 'Adubação',
        horario: '09:30',
        prioridadeTurno: 'Prioritário',
        gerarTarefaAuto: true
      }
    ],
    tarefasAluno: [
      { id: 1, voluntarioEmail: 'ana@escola.com', titulo: 'Rega', canteiro: 'Canteiro B', data: '18/11', horario: '08:00', status: 'Pendente' },
      { id: 2, voluntarioEmail: 'ana@escola.com', titulo: 'Adubação', canteiro: 'Canteiro B', data: '20/11', horario: '15:00', status: 'Pendente' },
      { id: 3, voluntarioEmail: 'ana@escola.com', titulo: 'Capina', canteiro: 'Canteiro B', data: '12/11', horario: '08:00', status: 'Concluída' }
    ]
  };
}

const CrudStore = {
  db: null,

  // Carrega os dados do localStorage ou inicializa a base padrão
  init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.db = JSON.parse(raw);
      } else {
        this.db = buildInitialDatabase();
        this.persist();
      }
    } catch (e) {
      this.db = buildInitialDatabase();
    }
  },

  // Salva o estado atual no localStorage
  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (e) {
      // Mantém em memória se o armazenamento local não estiver disponível
    }
  },

  // Restaura os registros de demonstração iniciais
  reset() {
    this.db = buildInitialDatabase();
    this.persist();
  },

  // Gera a próxima chave primária (ID) sequencial
  nextId(list) {
    if (!list || list.length === 0) return 1;
    return Math.max(...list.map((item) => Number(item.id) || 0)) + 1;
  },

  // Insere novo registro (Create) ou atualiza existente (Update)
  upsert(collectionName, record) {
    const list = this.db[collectionName];
    if (!list) return null;

    if (record.id) {
      const idx = list.findIndex((item) => Number(item.id) === Number(record.id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...record, id: Number(record.id) };
        this.persist();
        return list[idx];
      }
    }

    const created = { ...record, id: this.nextId(list) };
    list.push(created);
    this.persist();
    return created;
  },

  // Registra automaticamente o aluno na lista de Voluntários do ADM ao fazer login ou cadastro
  registerStudentOnAuth({ email, nome }) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;

    const existing = this.db.voluntarios.find((v) => v.email.toLowerCase() === normalizedEmail);
    if (existing) {
      if (nome && nome.trim()) {
        existing.nome = nome.trim();
      }
      if (existing.situacao === 'Pendente') {
        existing.situacao = 'Ativo';
      }
      this.persist();
      return existing;
    }

    const displayName = (nome && nome.trim()) ? nome.trim() : deriveNameFromEmail(normalizedEmail);
    return this.upsert('voluntarios', {
      nome: displayName,
      email: normalizedEmail,
      turma: '2º Ano A - Ensino Médio',
      turno: 'Manhã',
      situacao: 'Ativo',
      aceitouRegras: true
    });
  },

  // Remove registro (Delete) e dispara rota /excluirNomeCadastro?id=CHAVE_PRIMARIA
  // Mantém a situação do canteiro coerente: Ocupado se tem plantio, Livre se não tem
  sincronizarCanteiro(canteiroId) {
    const canteiro = this.db.canteiros.find((c) => Number(c.id) === Number(canteiroId));
    if (!canteiro) return;
    canteiro.situacao = this.db.plantios.some((p) => Number(p.canteiroId) === Number(canteiroId)) ? 'Ocupado' : 'Livre';
    this.persist();
  },

  deleteById(collectionName, id) {
    const route = `${ROTAS_EXCLUSAO[collectionName] || '/excluirRegistro'}?id=${encodeURIComponent(id)}`;

    try {
      window.history.pushState({ route }, '', route);
    } catch (err) {
      try {
        window.history.replaceState({ route }, '', `#${route}`);
      } catch (e) {}
    }

    if (this.db[collectionName]) {
      const removido = this.db[collectionName].find((item) => Number(item.id) === Number(id));
      this.db[collectionName] = this.db[collectionName].filter((item) => Number(item.id) !== Number(id));
      this.persist();
      // Ao remover um plantio, o canteiro volta a ficar livre
      if (collectionName === 'plantios' && removido) this.sincronizarCanteiro(removido.canteiroId);
    }

    return route;
  }
};

