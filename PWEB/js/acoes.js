/**
 * =========================================================================
 * 10. AÇÕES, VALIDAÇÕES FRONT-END E BINDING DE EVENTOS
 * =========================================================================
 */
function goToAuthView(view) {
  UIState.authView = view;
  UIState.draft = null;
  UIState.fieldErrors = {};
  render();
}

function selectMenu(key) {
  UIState.activeMenu = key;
  UIState.mode = 'list';
  UIState.editingId = null;
  UIState.searchQuery = '';
  UIState.draft = null;
  UIState.fieldErrors = {};
  UIState.mobileSidebarOpen = false;
  render();
}

function toggleSidebar(open) {
  UIState.mobileSidebarOpen = Boolean(open);
  render();
}

function clearRouteFeedback() {
  UIState.lastDeleteRoute = null;
  render();
}

function onSearchChange(value) {
  UIState.searchQuery = value;
  render();
  const input = document.getElementById('crud-search-input');
  if (input) {
    input.focus();
    input.setSelectionRange(value.length, value.length);
  }
}

function openCreateForm(entity) {
  UIState.activeMenu = entity;
  UIState.mode = 'form';
  UIState.editingId = null;
  UIState.draft = null;
  UIState.fieldErrors = {};
  render();
}

function openEditForm(entity, id) {
  UIState.activeMenu = entity;
  UIState.mode = 'form';
  UIState.editingId = Number(id);
  UIState.draft = null;
  UIState.fieldErrors = {};
  render();
}

function cancelCrudForm() {
  UIState.mode = 'list';
  UIState.editingId = null;
  UIState.draft = null;
  UIState.fieldErrors = {};
  render();
}

function toggleStudentTask(taskId) {
  const task = CrudStore.db.tarefasAluno.find((t) => Number(t.id) === Number(taskId));
  if (!task) return;
  task.status = task.status === 'Pendente' ? 'Concluída' : 'Pendente';
  CrudStore.persist();
  showToast(`Status alterado para ${task.status}.`, 'success');
  render();
}

function logoutUser() {
  CookieAuth.logout();
  UIState.session = null;
  UIState.authView = 'login_aluno';
  UIState.activeMenu = 'inicio';
  UIState.mode = 'list';
  UIState.editingId = null;
  UIState.draft = null;
  UIState.fieldErrors = {};
  UIState.lastDeleteRoute = null;
  showToast('Sessão encerrada e cookies removidos.', 'success');
  render();
}

function resetDemoData() {
  CrudStore.reset();
  UIState.lastDeleteRoute = null;
  showToast('Dados iniciais restaurados com sucesso.', 'success');
  render();
}

// Associa os eventos de envio dos formulários de Login, Cadastro e CRUD
function bindFormListeners() {
  const formAluno = document.getElementById('form-login-aluno');
  if (formAluno) {
    formAluno.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-aluno-email').value.trim();
      const senha = document.getElementById('login-aluno-senha').value;
      const errors = {};

      if (!email || !isValidEmail(email)) errors.email = 'Digite um endereço de e-mail válido.';
      if (!senha || senha.length < 4) errors.senha = 'Digite sua senha (mínimo 4 caracteres).';

      if (Object.keys(errors).length > 0) {
        UIState.draft = { email };
        UIState.fieldErrors = errors;
        render();
        return;
      }

      const volRecord = CrudStore.registerStudentOnAuth({ email });
      const nome = volRecord ? volRecord.nome : deriveNameFromEmail(email);

      CookieAuth.login({ email, perfil: 'aluno', nome });
      UIState.session = CookieAuth.getSession() || { logado: true, email, perfil: 'aluno', nome };
      UIState.activeMenu = 'inicio';
      UIState.draft = null;
      UIState.fieldErrors = {};
      showToast(`Login realizado! ${nome} registrado(a) como voluntário(a).`, 'success');
      render();
    });
  }

  const formCadastro = document.getElementById('form-cadastro-aluno');
  if (formCadastro) {
    formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('cad-nome').value.trim();
      const email = document.getElementById('cad-email').value.trim();
      const senha = document.getElementById('cad-senha').value;
      const confirmar = document.getElementById('cad-confirmar').value;
      const regras = document.getElementById('cad-regras').checked;
      const errors = {};

      if (!nome || nome.length < 3) errors.nome = 'Informe seu nome completo.';
      if (!email || !isValidEmail(email)) errors.email = 'Informe um e-mail válido.';
      if (!senha || senha.length < 4) errors.senha = 'A senha deve ter pelo menos 4 caracteres.';
      if (senha !== confirmar) errors.confirmar = 'As senhas digitadas não coincidem.';
      if (!regras) errors.regras = 'Você precisa aceitar as regras da horta para continuar.';

      if (Object.keys(errors).length > 0) {
        UIState.draft = { nome, email, regras };
        UIState.fieldErrors = errors;
        render();
        return;
      }

      CrudStore.registerStudentOnAuth({ email, nome });

      CookieAuth.login({ email, perfil: 'aluno', nome });
      UIState.session = CookieAuth.getSession() || { logado: true, email, perfil: 'aluno', nome };
      UIState.activeMenu = 'inicio';
      UIState.draft = null;
      UIState.fieldErrors = {};
      showToast('Conta criada! Você entrou como voluntário(a).', 'success');
      render();
    });
  }

  const formAdm = document.getElementById('form-login-adm');
  if (formAdm) {
    formAdm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-adm-email').value.trim();
      const senha = document.getElementById('login-adm-senha').value;
      const errors = {};

      if (!email || !isValidEmail(email)) errors.email = 'Digite um e-mail institucional válido.';
      if (!senha || senha.length < 4) errors.senha = 'Digite a senha do professor.';

      if (Object.keys(errors).length > 0) {
        UIState.draft = { email };
        UIState.fieldErrors = errors;
        render();
        return;
      }

      CookieAuth.login({ email, perfil: 'adm', nome: 'Professor' });
      UIState.session = CookieAuth.getSession() || { logado: true, email, perfil: 'adm', nome: 'Professor' };
      UIState.activeMenu = 'inicio';
      UIState.draft = null;
      UIState.fieldErrors = {};
      showToast(`Sessão do professor iniciada (${email}).`, 'success');
      render();
    });
  }

  const crudForm = document.getElementById('adm-crud-form');
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCrudSubmit(crudForm);
    });
  }
}

