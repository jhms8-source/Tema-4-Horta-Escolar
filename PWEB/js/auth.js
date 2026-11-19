/**
 * =========================================================================
 * 1. GERENCIADOR DE SESSÃO COM COOKIES REAIS (document.cookie)
 * =========================================================================
 * Grava, consulta e remove os cookies de autenticação do usuário no navegador.
 */
const CookieAuth = {
  KEYS: ['hortaviva_logado', 'hortaviva_usuario', 'hortaviva_perfil', 'hortaviva_nome'],

  // Cria ou atualiza um cookie com expiração em dias
  set(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  },

  // Lê o valor de um cookie pelo nome
  get(name) {
    const prefix = `${name}=`;
    const parts = document.cookie.split(';');
    for (let i = 0; i < parts.length; i++) {
      const item = parts[i].trim();
      if (item.indexOf(prefix) === 0) {
        return decodeURIComponent(item.substring(prefix.length));
      }
    }
    return null;
  },

  // Remove um cookie expirando sua validade imediatamente
  remove(name) {
    document.cookie = `${name}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  },

  // Registra a sessão ativa nos cookies
  login({ email, perfil, nome }) {
    this.set('hortaviva_logado', 'true', 7);
    this.set('hortaviva_usuario', email, 7);
    this.set('hortaviva_perfil', perfil, 7);
    this.set('hortaviva_nome', nome || deriveNameFromEmail(email), 7);
  },

  // Limpa todos os cookies da sessão (opção Sair)
  logout() {
    this.KEYS.forEach((key) => this.remove(key));
  },

  // Recupera os dados da sessão se houver login ativo nos cookies
  getSession() {
    const logado = this.get('hortaviva_logado');
    const email = this.get('hortaviva_usuario');
    const perfil = this.get('hortaviva_perfil');
    const nome = this.get('hortaviva_nome');
    if (logado === 'true' && email && perfil) {
      return {
        logado: true,
        email,
        perfil,
        nome: nome || deriveNameFromEmail(email)
      };
    }
    return null;
  },

  // Formata string de exibição dos cookies ativos no rodapé do menu
  debugString() {
    const email = this.get('hortaviva_usuario') || '';
    const perfil = this.get('hortaviva_perfil') || '';
    return `hortaviva_logado=true; hortaviva_usuario=${email}; hortaviva_perfil=${perfil}`;
  }
};

