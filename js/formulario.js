const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputServico = document.querySelector("#servico");
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
for (let i = 0; i < sevicos.length; i++) {
  const opcao = document.createElement("option");
  opcao.value = sevicos[i].preco;
  opcao.textContent = `${sevicos[i].nome} — R$ ${sevicos[i].preco}`;

  inputServico.appendChild(opcao);
}