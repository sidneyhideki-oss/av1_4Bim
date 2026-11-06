const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputEmail = document.querySelector("#email");
const inputServico = document.querySelector("#servico");
const resultado = document.querySelector("#resultado");
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

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  inputNome.setCustomValidity(
    inputNome.value.trim() ? "" : "Informe o nome do cliente.",
  );

  if (!formulario.reportValidity()) {
    return;
  }

  const servicoSelecionado = servicos.find(
    (servico) => servico.nome === inputServico.value,
  );

  if (!servicoSelecionado) {
    return;
  }

  const solicitacao = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    servico: servicoSelecionado.nome,
    preco: servicoSelecionado.preco,
    data: new Date().toISOString(),
  };

  let mensagem = `Seu aplicativo de e-mail será aberto com a solicitação pronta. Revise os dados e pressione Enviar para concluir. Valor: ${solicitacao.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}.`;

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
    `Valor: ${solicitacao.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`,
  ].join("\n");

  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
});