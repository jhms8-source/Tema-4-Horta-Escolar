/**
 * =========================================================================
 * 11. RENDERIZAÇÃO PRINCIPAL E INICIALIZAÇÃO
 * =========================================================================
 */
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  if (!UIState.session || !UIState.session.logado) {
    if (UIState.authView === 'cadastro') {
      app.innerHTML = renderCadastroScreen();
    } else if (UIState.authView === 'login_adm') {
      app.innerHTML = renderLoginAdmScreen();
    } else {
      app.innerHTML = renderLoginAlunoScreen();
    }
    bindFormListeners();
    return;
  }

  let content = '';
  if (UIState.session.perfil === 'adm') {
    if (UIState.activeMenu === 'inicio') {
      content = renderAdmDashboard();
    } else if (UIState.mode === 'form') {
      content = renderAdmCrudForm(UIState.activeMenu);
    } else {
      content = renderAdmCrudList(UIState.activeMenu);
    }
  } else {
    if (UIState.activeMenu === 'meu_plantio') {
      content = renderAlunoMeuPlantio();
    } else if (UIState.activeMenu === 'minhas_tarefas') {
      content = renderAlunoMinhasTarefas();
    } else {
      content = renderAlunoInicio();
    }
  }

  app.innerHTML = renderAuthenticatedShell(content);
  bindFormListeners();
}

// Inicializa o armazenamento CRUD e restaura a sessão ativa via cookies ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
  CrudStore.init();
  const activeCookieSession = CookieAuth.getSession();
  if (activeCookieSession && activeCookieSession.logado) {
    UIState.session = activeCookieSession;
  }
  render();
});
