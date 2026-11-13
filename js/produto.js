const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputPreco = document.querySelector("#preco");
const inputFoto = document.querySelector("#foto");
const previa = document.querySelector("#previa");
const buscaProdutos = document.querySelector("#busca-produtos");
const listaProdutos = document.querySelector("#lista-produtos");
const totalProdutos = document.querySelector("#total-produtos");
const mensagem = document.querySelector("#mensagem");
const CHAVE_PRODUTOS = "produtos";
const TAMANHO_MAXIMO_IMAGEM = 500 * 1024;
const TIPOS_IMAGEM_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

let fotoBase64 = "";
let produtos = carregarProdutos();

function carregarProdutos() {
  try {
    const dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS) || "[]");
    if (!Array.isArray(dadosSalvos)) return [];

    return dadosSalvos
      .filter((produto) =>
        produto &&
        typeof produto.nome === "string" &&
        typeof produto.foto === "string" &&
        Number.isFinite(Number(produto.preco)),
      )
      .map((produto, indice) => ({
        ...produto,
        id: produto.id || `produto-legado-${indice}`,
        preco: Number(produto.preco),
      }));
  } catch {
    return [];
  }
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mostrarMensagem(texto, tipo = "success") {
  mensagem.textContent = texto;
  mensagem.className = `alert alert-${tipo} mt-3 mb-0`;
}

function salvarProdutos(novosProdutos) {
  try {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novosProdutos));
    produtos = novosProdutos;
    return true;
  } catch {
    mostrarMensagem(
      "Não foi possível salvar. Remova algumas imagens ou escolha arquivos menores.",
      "danger",
    );
    return false;
  }
}

function criarCardProduto(produto) {
  const coluna = document.createElement("div");
  coluna.className = "col-12";

  const card = document.createElement("article");
  card.className = "content-card h-100";

  const imagem = document.createElement("img");
  imagem.src = produto.foto;
  imagem.alt = `Foto de ${produto.nome}`;
  imagem.className = "img-fluid w-100";
  imagem.style.height = "180px";
  imagem.style.objectFit = "cover";

  const corpo = document.createElement("div");
  corpo.className = "card-body d-flex flex-column";

  const nome = document.createElement("h3");
  nome.className = "h5";
  nome.textContent = produto.nome;

  const preco = document.createElement("p");
  preco.className = "summary-value mb-3";
  preco.textContent = formatarMoeda(produto.preco);

  const remover = document.createElement("button");
  remover.type = "button";
  remover.className = "btn-outline-danger mt-auto";
  remover.textContent = "Remover produto";
  remover.setAttribute("aria-label", `Remover ${produto.nome} do catálogo`);
  remover.addEventListener("click", () => removerProduto(produto.id));

  corpo.append(nome, preco, remover);
  card.append(imagem, corpo);
  coluna.append(card);
  return coluna;
}

function mostrarProdutos() {
  const termo = buscaProdutos.value.trim().toLocaleLowerCase("pt-BR");
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLocaleLowerCase("pt-BR").includes(termo),
  );

  listaProdutos.replaceChildren();
  totalProdutos.textContent = `${produtos.length} ${produtos.length === 1 ? "produto cadastrado" : "produtos cadastrados"}`;

  if (produtosFiltrados.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "form-text mb-0 catalog-empty";
    vazio.textContent = produtos.length
      ? "Nenhum produto encontrado para essa pesquisa."
      : "Nenhum produto cadastrado. Adicione o primeiro ao catálogo.";
    listaProdutos.append(vazio);
    return;
  }

  for (const produto of produtosFiltrados) {
    listaProdutos.append(criarCardProduto(produto));
  }
}

function removerProduto(id) {
  const produto = produtos.find((item) => item.id === id);
  if (!produto || !window.confirm(`Remover “${produto.nome}” do catálogo?`)) {
    return;
  }

  if (salvarProdutos(produtos.filter((item) => item.id !== id))) {
    mostrarProdutos();
    mostrarMensagem(`Produto “${produto.nome}” removido do catálogo.`);
  }
}

inputFoto.addEventListener("change", () => {
  const arquivo = inputFoto.files[0];
  fotoBase64 = "";
  previa.removeAttribute("src");
  previa.classList.add("d-none");

  if (!arquivo) return;

  if (!TIPOS_IMAGEM_PERMITIDOS.includes(arquivo.type)) {
    mostrarMensagem("Selecione uma imagem JPEG, PNG ou WEBP.", "danger");
    inputFoto.value = "";
    return;
  }

  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
    mostrarMensagem("A imagem deve ter no máximo 500 KB.", "danger");
    inputFoto.value = "";
    return;
  }

  const leitor = new FileReader();
  leitor.addEventListener("load", () => {
    fotoBase64 = leitor.result;
    previa.src = fotoBase64;
    previa.classList.remove("d-none");
  });
  leitor.addEventListener("error", () => {
    mostrarMensagem("Não foi possível carregar essa imagem. Tente outro arquivo.", "danger");
    inputFoto.value = "";
  });
  leitor.readAsDataURL(arquivo);
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = inputNome.value.trim();
  const preco = Number(inputPreco.value);

  if (!nome || !Number.isFinite(preco) || preco <= 0 || !fotoBase64) {
    mostrarMensagem("Informe um nome, um preço válido e selecione uma imagem.", "danger");
    return;
  }

  const produto = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    nome,
    preco,
    foto: fotoBase64,
  };

  if (!salvarProdutos([...produtos, produto])) return;

  formulario.reset();
  fotoBase64 = "";
  previa.removeAttribute("src");
  previa.classList.add("d-none");
  mostrarProdutos();
  mostrarMensagem(`“${nome}” foi adicionado ao catálogo.`);
});

buscaProdutos.addEventListener("input", mostrarProdutos);
mostrarProdutos();