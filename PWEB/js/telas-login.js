/**
 * =========================================================================
 * 5. TELAS DE AUTENTICAÇÃO (LOGIN ALUNO, CADASTRO E LOGIN PROFESSOR)
 * =========================================================================
 */
function renderLoginAlunoScreen() {
  const d = UIState.draft || {};
  return `
    <div class="min-h-screen bg-hv-sage flex flex-col items-center justify-center px-4 py-8">
      <div class="hv-card w-full max-w-[400px] p-7 sm:p-8 shadow-sm">
        <div class="flex justify-center mb-6">
          ${renderLogo(44, false)}
        </div>

        <form id="form-login-aluno" novalidate class="space-y-4">
          <div>
            <label for="login-aluno-email" class="block text-[13px] font-semibold text-hv-forest mb-1.5">E-mail</label>
            <input
              id="login-aluno-email"
              name="email"
              type="email"
              value="${escapeHtml(d.email || '')}"
              placeholder="voce@escola.com"
              class="hv-input w-full px-3.5 py-2.5 text-[14px] ${UIState.fieldErrors.email ? 'hv-input-error' : ''}"
            />
            ${renderFieldError('email')}
          </div>

          <div>
            <label for="login-aluno-senha" class="block text-[13px] font-semibold text-hv-forest mb-1.5">Senha</label>
            ${renderPasswordField({
              id: 'login-aluno-senha',
              name: 'senha',
              placeholder: '••••••••',
              hasError: Boolean(UIState.fieldErrors.senha)
            })}
            ${renderFieldError('senha')}
            <div class="flex justify-end mt-1.5">
              <button type="button" onclick="openForgotModal(false)" class="text-xs font-semibold text-hv-green hover:underline cursor-pointer">
                Esqueci minha senha
              </button>
            </div>
          </div>

          <button type="submit" class="hv-btn w-full py-2.5 px-4 bg-hv-amber hover:bg-hv-amberHover text-hv-forest font-bold text-[15px] cursor-pointer">
            Logar
          </button>
        </form>

        <div class="my-5 border-t border-hv-border"></div>

        <p class="text-center text-xs text-[#5D7A42] mb-2.5">Ainda não tem conta?</p>
        <button
          type="button"
          onclick="goToAuthView('cadastro')"
          class="hv-btn w-full py-2.5 px-4 bg-white hover:bg-hv-softRow text-hv-forest font-semibold text-[14px] border border-hv-green cursor-pointer"
        >
          Cadastre-se
        </button>
      </div>

      <div class="mt-5 text-center">
        <button
          type="button"
          onclick="goToAuthView('login_adm')"
          class="text-xs font-semibold text-hv-green hover:text-hv-forest underline underline-offset-2 cursor-pointer"
        >
          Sou professor &middot; Área do professor
        </button>
      </div>
    </div>
  `;
}

function renderCadastroScreen() {
  const d = UIState.draft || {};
  return `
    <div class="min-h-screen bg-hv-sage flex flex-col items-center justify-center px-4 py-8">
      <div class="hv-card w-full max-w-[420px] p-7 sm:p-8 shadow-sm">
        <div class="text-center mb-5">
          ${renderLeafMark(48)}
          <h1 class="text-[22px] font-bold text-hv-forest mt-3">Criar conta</h1>
          <p class="text-xs text-[#5D7A42] mt-0.5">Você entra como voluntário(a)</p>
        </div>

        <form id="form-cadastro-aluno" novalidate class="space-y-3.5">
          <div>
            <label for="cad-nome" class="block text-[13px] font-semibold text-hv-forest mb-1">Nome completo</label>
            <input
              id="cad-nome"
              name="nome"
              type="text"
              value="${escapeHtml(d.nome || '')}"
              placeholder="Ana Souza"
              class="hv-input w-full px-3.5 py-2.5 text-[14px] ${UIState.fieldErrors.nome ? 'hv-input-error' : ''}"
            />
            ${renderFieldError('nome')}
          </div>

          <div>
            <label for="cad-email" class="block text-[13px] font-semibold text-hv-forest mb-1">E-mail</label>
            <input
              id="cad-email"
              name="email"
              type="email"
              value="${escapeHtml(d.email || '')}"
              placeholder="voce@escola.com"
              class="hv-input w-full px-3.5 py-2.5 text-[14px] ${UIState.fieldErrors.email ? 'hv-input-error' : ''}"
            />
            ${renderFieldError('email')}
          </div>

          <div>
            <label for="cad-senha" class="block text-[13px] font-semibold text-hv-forest mb-1">Senha</label>
            ${renderPasswordField({
              id: 'cad-senha',
              name: 'senha',
              placeholder: '••••••••',
              hasError: Boolean(UIState.fieldErrors.senha)
            })}
            ${renderFieldError('senha')}
          </div>

          <div>
            <label for="cad-confirmar" class="block text-[13px] font-semibold text-hv-forest mb-1">Confirmar senha</label>
            ${renderPasswordField({
              id: 'cad-confirmar',
              name: 'confirmar',
              placeholder: '••••••••',
              hasError: Boolean(UIState.fieldErrors.confirmar)
            })}
            ${renderFieldError('confirmar')}
          </div>

          <div>
            <label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                id="cad-regras"
                name="regras"
                type="checkbox"
                ${d.regras ? 'checked' : ''}
                class="hv-checkbox rounded"
              />
              <span class="text-xs font-medium text-hv-forest">Li e aceito as regras da horta</span>
            </label>
            ${renderFieldError('regras')}
          </div>

          <button type="submit" class="hv-btn w-full py-2.5 px-4 bg-hv-amber hover:bg-hv-amberHover text-hv-forest font-bold text-[15px] cursor-pointer mt-1">
            Criar conta
          </button>
        </form>

        <div class="mt-5 text-center">
          <button
            type="button"
            onclick="goToAuthView('login_aluno')"
            class="text-xs font-semibold text-hv-green hover:text-hv-forest cursor-pointer"
          >
            Já tenho conta &middot; <span class="underline">Entrar</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderLoginAdmScreen() {
  const d = UIState.draft || {};
  return `
    <div class="min-h-screen bg-hv-forest flex flex-col items-center justify-center px-4 py-8">
      <div class="hv-card w-full max-w-[400px] p-7 sm:p-8 shadow-xl">
        <div class="flex flex-col items-center mb-6">
          ${renderLogo(44, false)}
          <span class="mt-3 inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-hv-amber text-hv-forest">
            Área do professor
          </span>
        </div>

        <form id="form-login-adm" novalidate class="space-y-4">
          <div>
            <label for="login-adm-email" class="block text-[13px] font-semibold text-hv-forest mb-1.5">E-mail institucional</label>
            <input
              id="login-adm-email"
              name="email"
              type="email"
              value="${escapeHtml(d.email || '')}"
              placeholder="prof@escola.com"
              class="hv-input w-full px-3.5 py-2.5 text-[14px] ${UIState.fieldErrors.email ? 'hv-input-error' : ''}"
            />
            ${renderFieldError('email')}
          </div>

          <div>
            <label for="login-adm-senha" class="block text-[13px] font-semibold text-hv-forest mb-1.5">Senha</label>
            ${renderPasswordField({
              id: 'login-adm-senha',
              name: 'senha',
              placeholder: '••••••••',
              hasError: Boolean(UIState.fieldErrors.senha)
            })}
            ${renderFieldError('senha')}
            <div class="flex justify-end mt-1.5">
              <button type="button" onclick="openForgotModal(true)" class="text-xs font-semibold text-hv-green hover:underline cursor-pointer">
                Esqueci minha senha
              </button>
            </div>
          </div>

          <button type="submit" class="hv-btn w-full py-2.5 px-4 bg-hv-green hover:bg-hv-greenHover text-white font-bold text-[15px] cursor-pointer">
            Entrar como professor
          </button>
        </form>

        <div class="my-5 border-t border-hv-border"></div>

        <div class="text-center">
          <button
            type="button"
            onclick="goToAuthView('login_aluno')"
            class="text-xs font-semibold text-hv-green hover:text-hv-forest cursor-pointer"
          >
            Sou aluno &middot; <span class="underline">Voltar ao login de aluno</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

