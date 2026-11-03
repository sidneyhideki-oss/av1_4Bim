const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputServico = document.querySelector("#servico");
const inputQuantidade = document.querySelector("#quantidade");
const resultado = document.querySelector("#resultado");

const sevicos =[
  { nome: "Formatação", preco: 120 },
  { nome: "Limpeza", preco: 80 },
  { nome: "Instalação", preco: 50 }
];


for (let i = 0; i < sevicos.length; i++) {
  const opcao = document.createElement("option");
  opcao.value = sevicos[i].preco;
  opcao.textContent = `${sevicos[i].nome} — R$ ${sevicos[i].preco}`;

  inputServico.appendChild(opcao);
}
formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = inputNome.value.trim();
  const preco = Number(inputServico.value);
  const quantidadeString = inputQuantidade.value.trim();
  const quantidade = Number(quantidadeString);

  resultado.classList.remove("d-none", "alert-success", "alert-warning");

  if (
    nome === "" ||
    quantidadeString === "" ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    resultado.textContent = "Preencha todos os campos corretamente!";
    resultado.classList.add("alert-warning");
    return;
  }

  const total = calcularTotal(preco, quantidade);

  resultado.textContent = `Olá ${nome}! O orçamento é de R$ ${total.toFixed(2)}.`;

  resultado.classList.add("alert-success");
});

function calcularTotal(preco, quantidade) {
  return preco * quantidade;
}

const formCadastro = document.querySelector("#formCadastro");
const novoNome = document.querySelector("#novoNome");
const novoPreco = document.querySelector("#novoPreco");
const avisoCadastro = document.querySelector("#avisoCadastro");

formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = novoNome.value.trim();
    const precoTexto = novoPreco.value.trim();
    const preco = Number(precoTexto);

    avisoCadastro.classList.remove(
        "d-none", "alert-success", "alert-warning"
    );

    if (nome === "" || precoTexto === "" || !Number.isFinite(preco) || preco <= 0) {
        avisoCadastro.textContent = "Informe nome e preço válidos.";
        avisoCadastro.classList.add("alert-warning");
        return;
    }

    avisoCadastro.textContent = "Serviço cadastrado!";
    avisoCadastro.classList.add("alert-success");
});
