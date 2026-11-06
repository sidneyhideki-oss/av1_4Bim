const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputIdade = document.querySelector("#idade");
const inputEmail = document.querySelector("#email");
const inputTelefone = document.querySelector("#telefone");
const resultado = document.querySelector("#resultado");
const botaoApagar = document.querySelector("#apagar-dados");
const CHAVE_ARMAZENAMENTO = "techfix-cadastro";

try {
  const cadastroSalvo = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) || "null");
  if (cadastroSalvo) {
    inputNome.value = cadastroSalvo.nome || "";
    inputIdade.value = cadastroSalvo.idade || "";
    inputEmail.value = cadastroSalvo.email || "";
    inputTelefone.value = cadastroSalvo.telefone || "";
  }
} catch {
  // Se o armazenamento estiver indisponível, o formulário ainda pode ser usado.
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  inputNome.setCustomValidity(
    inputNome.value.trim() ? "" : "Informe seu nome.",
  );

  if (!formulario.reportValidity()) {
    return;
  }

  const cadastro = {
    nome: inputNome.value.trim(),
    idade: inputIdade.value,
    email: inputEmail.value.trim(),
    telefone: inputTelefone.value.trim(),
  };

  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(cadastro));
  } catch {
    resultado.textContent = "Não foi possível salvar os dados neste navegador.";
    resultado.classList.remove("d-none", "alert-success");
    resultado.classList.add("alert-danger");
    return;
  }

  resultado.textContent = `Cadastro de ${cadastro.nome} salvo neste navegador.`;
  resultado.classList.remove("d-none", "alert-danger");
  resultado.classList.add("alert-success");
});

botaoApagar.addEventListener("click", () => {
  try {
    localStorage.removeItem(CHAVE_ARMAZENAMENTO);
    formulario.reset();
    resultado.textContent = "Os dados salvos foram apagados.";
    resultado.classList.remove("d-none", "alert-danger");
    resultado.classList.add("alert-success");
  } catch {
    resultado.textContent = "Não foi possível apagar os dados deste navegador.";
    resultado.classList.remove("d-none", "alert-success");
    resultado.classList.add("alert-danger");
  }
});
