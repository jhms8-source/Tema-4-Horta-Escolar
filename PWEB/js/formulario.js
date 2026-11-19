/**
 * =========================================================================
 * 8. FORMULÁRIO GENÉRICO (CREATE & UPDATE) + VALIDAÇÃO FRONT-END
 * O mesmo formulário serve para Novo (vazio) e Atualizar (preenchido).
 * Tudo é montado a partir da descrição em cadastros.js.
 * =========================================================================
 */
const ROTULO_CLASSE = 'block text-[13px] font-semibold text-hv-forest mb-1.5';
const CAIXA_CLASSE = 'p-3 rounded-[12px] bg-hv-softRow border border-hv-border';
const TIPOS_INPUT = { texto: 'text', email: 'email', numero: 'number', data: 'date', hora: 'time' };

function opcoesDoCampo(campo) {
  const lista = typeof campo.opcoes === 'function' ? campo.opcoes() : campo.opcoes || [];
  return lista.map((o) => (typeof o === 'string' ? { valor: o, texto: o } : o));
}

// Desenha UM campo, de qualquer tipo
function renderCampo(campo, d) {
  const { nome, tipo } = campo;
  const valor = d[nome] ?? '';
  const comErro = UIState.fieldErrors[nome];
  const classeInput = `hv-input w-full px-3.5 py-2.5 text-sm ${comErro ? 'hv-input-error' : ''} ${campo.somenteLeitura ? 'opacity-70 cursor-not-allowed' : ''}`;
  const opcoes = ['select', 'radio', 'multicheck'].includes(tipo) ? opcoesDoCampo(campo) : [];
  const obrig = campo.obrigatorio ? ' <span class="text-red-600" aria-hidden="true">*</span>' : '';
  const titulo = (tag) => (tag === 'label'
    ? `<label for="f-${nome}" class="${ROTULO_CLASSE}">${campo.rotulo}${obrig}</label>`
    : `<span class="${ROTULO_CLASSE}">${campo.rotulo}${obrig}</span>`);
  let corpo;

  if (tipo === 'select') {
    corpo = `${titulo('label')}
      <select id="f-${nome}" name="${nome}" class="${classeInput}">
        ${campo.semVazio ? '' : '<option value="">Selecione...</option>'}
        ${opcoes.map((o) => `<option value="${escapeHtml(o.valor)}" ${String(valor) === String(o.valor) ? 'selected' : ''}>${escapeHtml(o.texto)}</option>`).join('')}
      </select>`;
  } else if (tipo === 'radio') {
    corpo = `${titulo('span')}
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 ${CAIXA_CLASSE}">
        ${opcoes.map((o) => `
          <label class="inline-flex items-center gap-2 text-sm text-hv-forest cursor-pointer">
            <input type="radio" name="${nome}" value="${escapeHtml(o.valor)}" ${String(valor) === String(o.valor) ? 'checked' : ''} class="hv-radio" />
            <span>${escapeHtml(o.texto)}</span>
          </label>`).join('')}
      </div>`;
  } else if (tipo === 'multicheck') {
    corpo = `${titulo('span')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 ${CAIXA_CLASSE} ${comErro ? 'border-red-500 bg-red-50' : ''} max-h-40 overflow-y-auto">
        ${opcoes.map((o) => `
          <label class="flex items-center gap-2 text-sm text-hv-forest cursor-pointer select-none">
            <input type="checkbox" name="${nome}" value="${escapeHtml(o.valor)}" ${Array.isArray(valor) && valor.map(Number).includes(Number(o.valor)) ? 'checked' : ''} class="hv-checkbox rounded" />
            <span class="truncate">${escapeHtml(o.texto)}</span>
          </label>`).join('')}
      </div>`;
  } else if (tipo === 'checkbox') {
    corpo = `<label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
        <input id="f-${nome}" name="${nome}" type="checkbox" ${valor ? 'checked' : ''} class="hv-checkbox rounded" />
        <span class="text-sm font-medium text-hv-forest">${campo.rotulo}${obrig}</span>
      </label>`;
  } else {
    corpo = `${titulo('label')}
      <input id="f-${nome}" name="${nome}" type="${TIPOS_INPUT[tipo]}" value="${escapeHtml(valor)}"
        ${campo.min !== undefined ? `min="${campo.min}"` : ''} ${campo.step ? `step="${campo.step}"` : ''}
        ${campo.placeholder ? `placeholder="${escapeHtml(campo.placeholder)}"` : ''} ${campo.somenteLeitura ? 'readonly tabindex="-1"' : ''}
        class="${classeInput}" />`;
  }

  return `<div class="${campo.meia ? '' : 'sm:col-span-2'}">${corpo}${renderFieldError(nome)}</div>`;
}

function renderAdmCrudForm(entity) {
  const cad = CADASTROS[entity];
  const isEdit = UIState.editingId !== null;
  const existente = isEdit ? CrudStore.db[entity].find((r) => Number(r.id) === Number(UIState.editingId)) : null;
  const d = UIState.draft || existente || cad.padrao || {};

  return `
    <div class="max-w-[540px] mx-auto">
      <h1 class="text-2xl sm:text-[26px] font-bold text-hv-forest tracking-tight mb-5">${isEdit ? 'Atualizar' : cad.novo} ${cad.singular}</h1>

      <div class="hv-card p-6 sm:p-7 shadow-xs">
        <form id="adm-crud-form" data-entity="${entity}" onchange="aoMudarForm(this)" novalidate class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${cad.campos.map((campo) => renderCampo(campo, d)).join('')}

          <p class="sm:col-span-2 text-xs text-[#5D7A42]"><span class="text-red-600">*</span> Campo obrigatório</p>

          <div class="sm:col-span-2 pt-3 flex items-center gap-3 border-t border-hv-border/70">
            <button type="submit" class="hv-btn px-6 py-2.5 bg-hv-green hover:bg-hv-greenHover text-white font-semibold text-sm cursor-pointer">Salvar</button>
            <button type="button" onclick="cancelCrudForm()" class="hv-btn px-6 py-2.5 bg-white hover:bg-hv-softRow text-hv-forest font-semibold text-sm border border-hv-border cursor-pointer">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function aoMudarForm(form) {
  CADASTROS[form.dataset.entity].aoMudar?.(form);
}

// Lê os campos do formulário já no formato certo (texto, número, boolean, lista)
function lerFormulario(form, cad) {
  const fd = new FormData(form);
  const dados = { id: UIState.editingId };
  cad.campos.forEach(({ nome, tipo }) => {
    if (tipo === 'checkbox') dados[nome] = form.elements[nome].checked;
    else if (tipo === 'multicheck') dados[nome] = fd.getAll(nome).map(Number);
    else dados[nome] = String(fd.get(nome) ?? '').trim();
  });
  return dados;
}

// Validação de cada campo, de acordo com o que está descrito em cadastros.js
function validarCampos(cad, dados) {
  const erros = {};
  cad.campos.forEach((campo) => {
    const v = dados[campo.nome];
    const vazio = campo.tipo === 'checkbox' ? !v : campo.tipo === 'multicheck' ? v.length === 0 : v === '';
    const nomeCampo = campo.rotulo.replace(/&sup2;/g, '²').toLowerCase();

    if (campo.obrigatorio && vazio) {
      erros[campo.nome] = campo.msg || `Preencha o campo ${nomeCampo}.`;
    } else if (!vazio && campo.tipo === 'email' && !isValidEmail(v)) {
      erros[campo.nome] = 'Informe um e-mail válido.';
    } else if (!vazio && campo.tipo === 'numero' && campo.min !== undefined && Number(v) < campo.min) {
      erros[campo.nome] = campo.msg || `O valor mínimo é ${campo.min}.`;
    } else if (!vazio && campo.valida) {
      const msg = campo.valida(v, dados);
      if (msg) erros[campo.nome] = msg;
    }
  });
  return erros;
}

// Valida e grava (Create/Update). Em caso de erro, volta ao formulário com os dados preenchidos
function handleCrudSubmit(form) {
  const entity = form.getAttribute('data-entity');
  const cad = CADASTROS[entity];
  const dados = lerFormulario(form, cad);
  cad.calcular?.(dados);

  const erros = validarCampos(cad, dados);
  if (Object.keys(erros).length > 0) {
    UIState.draft = dados;
    UIState.fieldErrors = erros;
    render();
    return;
  }

  const registro = { id: dados.id };
  cad.campos.forEach(({ nome, tipo, numerico }) => {
    registro[nome] = tipo === 'numero' || numerico ? Number(dados[nome]) : dados[nome];
  });

  const antigo = CrudStore.db[entity].find((r) => Number(r.id) === Number(UIState.editingId));
  const salvo = CrudStore.upsert(entity, registro);
  cad.aoSalvar?.(salvo, antigo ? { ...antigo } : null);
  CrudStore.persist();

  UIState.mode = 'list';
  UIState.editingId = null;
  UIState.draft = null;
  UIState.fieldErrors = {};
  showToast('Registro salvo com sucesso!', 'success');
  render();
}
