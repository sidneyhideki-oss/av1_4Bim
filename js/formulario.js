const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputEmail = document.querySelector("#email");
const inputServico = document.querySelector("#servico");
const inputQuantidade = document.querySelector("#quantidade");
const resultado = document.querySelector("#resultado");
const totalOrcamento = document.querySelector("#total-orcamento");
const botaoCalcular = document.querySelector("#calcular-orcamento");
const CHAVE_SOLICITACAO = "marketon-solicitacao-servico";
const EMAIL_DESTINO = "marketon@gmail.com";

const servicos = [
  { nome: "Formatação", preco: 120 },
  { nome: "Limpeza", preco: 80 },
  { nome: "Instalação", preco: 50 },
];

for (const servico of servicos) {
  const opcao = document.createElement("option");
  opcao.value = servico.nome;
  opcao.textContent = `${servico.nome} — ${servico.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
  inputServico.appendChild(opcao);
}

const formatarMoeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function atualizarOrcamento() {
  const servicoSelecionado = servicos.find(
    (servico) => servico.nome === inputServico.value,
  );
  const quantidade = Number(inputQuantidade.value);

  if (!servicoSelecionado || !Number.isInteger(quantidade) || quantidade < 1) {
    totalOrcamento.textContent = "Selecione um serviço";
    return null;
  }

  const valorTotal = servicoSelecionado.preco * quantidade;
  totalOrcamento.textContent = formatarMoeda(valorTotal);
  return { servicoSelecionado, quantidade, valorTotal };
}

inputServico.addEventListener("change", atualizarOrcamento);
inputQuantidade.addEventListener("input", atualizarOrcamento);
botaoCalcular.addEventListener("click", () => {
  const orcamento = atualizarOrcamento();
  if (!orcamento) inputQuantidade.reportValidity();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  inputNome.setCustomValidity(
    inputNome.value.trim() ? "" : "Informe o nome do cliente.",
  );

  if (!formulario.reportValidity()) {
    return;
  }

  const orcamento = atualizarOrcamento();
  if (!orcamento) {
    return;
  }

  const solicitacao = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    servico: orcamento.servicoSelecionado.nome,
    quantidade: orcamento.quantidade,
    valorTotal: orcamento.valorTotal,
    data: new Date().toISOString(),
  };

  let mensagem = `Solicitação preparada. Revise os dados e confirme o envio no seu aplicativo de e-mail. Total: ${formatarMoeda(solicitacao.valorTotal)}.`;

  try {
    localStorage.setItem(CHAVE_SOLICITACAO, JSON.stringify(solicitacao));
    mensagem += " A solicitação também foi salva neste navegador.";
  } catch {
    mensagem += " Não foi possível salvar a solicitação neste navegador.";
  }

  resultado.textContent = mensagem;
  resultado.classList.remove("d-none", "alert-danger");
  resultado.classList.add("alert-success");

  const assunto = `Solicitação de serviço - ${solicitacao.nome}`;
  const corpo = [
    "Nova solicitação de serviço",
    "",
    `Nome: ${solicitacao.nome}`,
    `E-mail para contato: ${solicitacao.email}`,
    `Serviço: ${solicitacao.servico}`,
    `Quantidade: ${solicitacao.quantidade}`,
    `Valor unitário: ${formatarMoeda(orcamento.servicoSelecionado.preco)}`,
    `Valor total: ${formatarMoeda(solicitacao.valorTotal)}`,
  ].join("\n");

  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
});