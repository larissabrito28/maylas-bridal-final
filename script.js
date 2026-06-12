// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// CONFIG FIREBASE

const firebaseConfig = {
    apiKey: "AIzaSyDKqUt7ETARoGgHvPknJc4_vQquUq-w3Nk",
    authDomain: "maylas.firebaseapp.com",
    projectId: "maylas",
    storageBucket: "maylas.firebasestorage.app",
    messagingSenderId: "380946945069",
    appId: "1:380946945069:web:7f365ec4559548db91d4a4",
    measurementId: "G-C9NJBHLLNZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// VARIÁVEIS

let carrinho = [];
let favoritos = [];
let pedidos = [];
let total = 0;
let frete = 0;
let usuarioAtual = null;
let vestidoModalAtual = null;

// LOADER

window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");

        if(loader){
            loader.classList.add("loader-hidden");
        }
    }, 2000);
});

// TOAST

function mostrarToast(texto){
    const toast = document.getElementById("toast");

    if(!toast){
        alert(texto);
        return;
    }

    toast.innerHTML = texto;
    toast.classList.add("toast-show");

    setTimeout(() => {
        toast.classList.remove("toast-show");
    }, 3000);
}

// ESTOQUE

let estoque = {
    "New Moon": 5,
    "Ariel Lace": 3,
    "Aurora Lace": 4,
    "Celestia": 2,
    "Queen Garden": 3,
    "Princess Bride": 5,
    "Angel Bride": 4,
    "Midnight Pearl": 2
};

// DETALHES DOS VESTIDOS

const vestidosDetalhes = {
    "New Moon":{
        categoria:"Noiva Celestial",
        preco:4900,
        descricao:"Vestido etéreo inspirado na lua nova, com brilho suave e elegância celestial.",
        imagens:["imagens/vestido1.jpeg","imagens/vestido1-1.jpeg"]
    },

    "Ariel Lace":{
        categoria:"Sereia da Lua",
        preco:3500,
        descricao:"Silhueta sereia delicada com toque romântico e inspiração lunar.",
        imagens:["imagens/vestido2.jpeg","imagens/vestido2-2.jpeg"]
    },

    "Aurora Lace":{
        categoria:"Renda Vintage",
        preco:4500,
        descricao:"Renda clássica e sofisticada para uma noiva elegante e atemporal.",
        imagens:["imagens/vestido3.jpeg"]
    },

    "Celestia":{
        categoria:"Cisney Rendado",
        preco:3100,
        descricao:"Modelo leve e refinado com detalhes rendados e presença celestial.",
        imagens:["imagens/vestido4.jpeg"]
    },

    "Queen Garden":{
        categoria:"Luxo fatal",
        preco:5800,
        descricao:"Vestido imponente inspirado em jardins reais e romantismo dramático.",
        imagens:["imagens/vestido5.jpeg"]
    },

    "Princess Bride":{
        categoria:"Romântico Clássico",
        preco:4700,
        descricao:"Modelo princesa com saia volumosa e delicadeza clássica.",
        imagens:["imagens/vestido6.jpeg"]
    },

    "Angel Bride":{
        categoria:"Anjo floral",
        preco:4000,
        descricao:"Vestido delicado com inspiração angelical e acabamento floral.",
        imagens:["imagens/vestido7.jpeg"]
    },

    "Midnight Pearl":{
        categoria:"Noiva Mística",
        preco:4500,
        descricao:"Elegância misteriosa inspirada no brilho das pérolas sob a meia-noite.",
        imagens:["imagens/vestido8.jpeg","imagens/vestido8-8.jpeg"]
    }
};

// LOGIN

onAuthStateChanged(auth, (user) => {
    if(user){
        usuarioAtual = user.email;

        document.getElementById("mensagemLogin").innerHTML =
        `Conta conectada: ${usuarioAtual} ✦`;

        document.getElementById("perfilEmail").innerHTML =
        `Cliente conectada: ${usuarioAtual}`;

        carregarCarrinho();
        carregarFavoritos();
        carregarPedidos();
    }else{
        usuarioAtual = null;

        document.getElementById("mensagemLogin").innerHTML =
        "Nenhuma conta conectada.";

        document.getElementById("perfilEmail").innerHTML =
        "Entre na sua conta para ver seu perfil.";
    }
});

window.cadastro = function(){
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();

    createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
        document.getElementById("mensagemLogin").innerHTML =
        "Conta criada com sucesso ✦";

        mostrarToast("Conta criada com sucesso ✦");
    })
    .catch((error) => {
        document.getElementById("mensagemLogin").innerHTML =
        "Erro: " + error.code;
    });
};

window.login = function(){
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();

    signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
        document.getElementById("mensagemLogin").innerHTML =
        "Conta conectada ✦";

        mostrarToast("Conta conectada ✦");
    })
    .catch((error) => {
        document.getElementById("mensagemLogin").innerHTML =
        "Erro: " + error.code;
    });
};

window.sair = function(){
    signOut(auth).then(() => {
        usuarioAtual = null;
        carrinho = [];
        favoritos = [];
        pedidos = [];
        total = 0;
        frete = 0;

        atualizarCarrinho();
        atualizarFavoritos();
        atualizarPedidos();

        document.getElementById("mensagemLogin").innerHTML =
        "Você saiu da conta ✦";

        document.getElementById("perfilEmail").innerHTML =
        "Entre na sua conta para ver seu perfil.";

        mostrarToast("Você saiu da conta ✦");
    });
};

// ESTOQUE NA TELA

function atualizarEstoque(){
    Object.keys(estoque).forEach(nome => {
        let ids = [
            "estoque-" + nome,
            "estoque-card-" + nome
        ];

        ids.forEach(id => {
            let elemento = document.getElementById(id);

            if(elemento){
                if(estoque[nome] > 0){
                    elemento.innerHTML = `Disponível: ${estoque[nome]} unidade(s)`;
                    elemento.style.color = "#9fe6a0";
                }else{
                    elemento.innerHTML = "Esgotado";
                    elemento.style.color = "#ff8f8f";
                }
            }
        });
    });
}

// CARRINHO

window.adicionarCarrinho = function(nome, preco){
    if(estoque[nome] <= 0){
        mostrarToast("Este vestido está esgotado ✦");
        return;
    }

    carrinho.push({
        nome:nome,
        preco:preco
    });

    total += preco;
    estoque[nome]--;

    atualizarCarrinho();
    atualizarEstoque();
    salvarCarrinho();

    mostrarToast("Vestido adicionado ao carrinho ✦");
};

function atualizarCarrinho(){
    const lista = document.getElementById("listaCarrinho");
    const totalTexto = document.getElementById("total");

    lista.innerHTML = "";

    carrinho.forEach((item, index) => {
        let li = document.createElement("li");

        li.innerHTML =
        `${item.nome} ✦ R$ ${item.preco.toLocaleString("pt-BR")}
        <button onclick="removerCarrinho(${index})" class="remover-btn">
            Remover
        </button>`;

        lista.appendChild(li);
    });

    totalTexto.innerHTML =
    `Total: R$ ${total.toLocaleString("pt-BR")}`;
}

window.removerCarrinho = function(index){
    estoque[carrinho[index].nome]++;
    total -= carrinho[index].preco;

    carrinho.splice(index, 1);

    atualizarCarrinho();
    atualizarEstoque();
    salvarCarrinho();

    mostrarToast("Item removido do carrinho ✦");
};

window.esvaziarCarrinho = function(){
    carrinho.forEach(item => {
        estoque[item.nome]++;
    });

    carrinho = [];
    total = 0;
    frete = 0;

    atualizarCarrinho();
    atualizarEstoque();
    salvarCarrinho();

    const resultadoFrete = document.getElementById("resultadoFrete");

    if(resultadoFrete){
        resultadoFrete.innerHTML = "";
    }

    mostrarToast("Carrinho esvaziado ✦");
};

function salvarCarrinho(){
    if(usuarioAtual){
        localStorage.setItem(
            "carrinho_" + usuarioAtual,
            JSON.stringify(carrinho)
        );
    }
}

function carregarCarrinho(){
    let dados = localStorage.getItem("carrinho_" + usuarioAtual);

    if(dados){
        carrinho = JSON.parse(dados);

        total = carrinho.reduce((soma, item) => {
            return soma + item.preco;
        }, 0);

        atualizarCarrinho();
    }
}

// FAVORITOS

window.favoritar = function(nome){
    if(!favoritos.includes(nome)){
        favoritos.push(nome);
        mostrarToast("Adicionado aos favoritos ✦");
    }else{
        mostrarToast("Este vestido já está nos favoritos ✦");
    }

    salvarFavoritos();
    atualizarFavoritos();
};

function salvarFavoritos(){
    if(usuarioAtual){
        localStorage.setItem(
            "favoritos_" + usuarioAtual,
            JSON.stringify(favoritos)
        );
    }
}

function carregarFavoritos(){
    let dados = localStorage.getItem("favoritos_" + usuarioAtual);

    if(dados){
        favoritos = JSON.parse(dados);
        atualizarFavoritos();
    }
}

function atualizarFavoritos(){
    const area = document.getElementById("listaFavoritos");

    area.innerHTML = "";

    favoritos.forEach((item, index) => {
        let li = document.createElement("li");

        li.innerHTML =
        `${item} ✦
        <button onclick="removerFavorito(${index})" class="remover-btn">
            Remover
        </button>`;

        area.appendChild(li);
    });
}

window.removerFavorito = function(index){
    favoritos.splice(index, 1);

    atualizarFavoritos();
    salvarFavoritos();

    mostrarToast("Item removido dos favoritos ✦");
};

window.compartilharDesejos = function(){
    if(favoritos.length === 0){
        mostrarToast("Sua lista de desejos está vazia ✦");
        return;
    }

    let texto = "Minha lista de desejos Maylas Bridal:%0A%0A";

    favoritos.forEach(item => {
        texto += `✦ ${item}%0A`;
    });

    window.open(`https://wa.me/?text=${texto}`, "_blank");
};

// PEDIDOS

function salvarPedidos(){
    if(usuarioAtual){
        localStorage.setItem(
            "pedidos_" + usuarioAtual,
            JSON.stringify(pedidos)
        );
    }
}

function carregarPedidos(){
    let dados = localStorage.getItem("pedidos_" + usuarioAtual);

    if(dados){
        pedidos = JSON.parse(dados);
        atualizarPedidos();
    }
}

function atualizarPedidos(){
    const area = document.getElementById("listaPedidos");

    area.innerHTML = "";

    pedidos.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = item;
        area.appendChild(li);
    });
}

// FRETE

window.calcularFrete = function(){
    let cep = document.getElementById("cep").value.trim();

    if(cep.length < 8){
        mostrarToast("Digite um CEP válido com 8 números.");
        return;
    }

    let primeiroNumero = cep.charAt(0);

    if(primeiroNumero === "0" || primeiroNumero === "1"){
        frete = 35;
    }else if(primeiroNumero === "2" || primeiroNumero === "3"){
        frete = 45;
    }else{
        frete = 65;
    }

    document.getElementById("resultadoFrete").innerHTML =
    `Frete estimado: R$ ${frete.toLocaleString("pt-BR")}`;
};

// CHECKOUT

window.finalizarPedido = function(){
    if(carrinho.length === 0){
        mostrarToast("Seu pedido está vazio ✦");
        return;
    }

    const area = document.getElementById("checkoutLista");
    const totalArea = document.getElementById("checkoutTotal");
    const freteArea = document.getElementById("checkoutFrete");

    area.innerHTML = "";

    carrinho.forEach(item => {
        let p = document.createElement("p");

        p.innerHTML =
        `✦ ${item.nome} — R$ ${item.preco.toLocaleString("pt-BR")}`;

        area.appendChild(p);
    });

    let totalFinal = total + frete;

    totalArea.innerHTML =
    `Total dos vestidos: R$ ${total.toLocaleString("pt-BR")}`;

    freteArea.innerHTML =
    `Frete: R$ ${frete.toLocaleString("pt-BR")} | Total final: R$ ${totalFinal.toLocaleString("pt-BR")}`;

    document.getElementById("checkoutModal").style.display = "flex";
};

window.fecharCheckout = function(){
    document.getElementById("checkoutModal").style.display = "none";
};

window.copiarPix = function(){
    let chave = document.getElementById("chavePix").innerText;

    navigator.clipboard.writeText(chave).then(() => {
        mostrarToast("Chave Pix copiada ✦");
    });
};

window.confirmarCheckout = function(){
    let nome = document.getElementById("nomeCliente").value.trim();
    let totalFinal = total + frete;

    let mensagem =
    "Olá! Vim pelo Maylas Bridal e gostaria de finalizar meu pedido:%0A%0A";

    carrinho.forEach(item => {
        mensagem +=
        `• ${item.nome} - R$ ${item.preco.toLocaleString("pt-BR")}%0A`;
    });

    mensagem += `%0AFrete: R$ ${frete.toLocaleString("pt-BR")}`;
    mensagem += `%0ATotal final: R$ ${totalFinal.toLocaleString("pt-BR")}`;
    mensagem += `%0AChave Pix: maylasbridal@pix.com`;

    if(nome !== ""){
        mensagem += `%0ACliente: ${nome}`;
    }

    if(usuarioAtual){
        mensagem += `%0AConta: ${usuarioAtual}`;
    }

    pedidos.push(
        `Pedido ✦ Total: R$ ${totalFinal.toLocaleString("pt-BR")}`
    );

    salvarPedidos();
    atualizarPedidos();

    window.open(
        `https://wa.me/5511987595486?text=${mensagem}`,
        "_blank"
    );

    fecharCheckout();
};

// MODAL

window.abrirDetalhes = function(nome){
    vestidoModalAtual = nome;

    const vestido = vestidosDetalhes[nome];

    document.getElementById("modalNome").innerHTML = nome;
    document.getElementById("modalCategoria").innerHTML = vestido.categoria;
    document.getElementById("modalPreco").innerHTML =
    "R$ " + vestido.preco.toLocaleString("pt-BR");
    document.getElementById("modalDescricao").innerHTML = vestido.descricao;
    document.getElementById("modalImagem").src = vestido.imagens[0];
    document.getElementById("modalEstoque").innerHTML =
    estoque[nome] > 0 ? `Disponível: ${estoque[nome]} unidade(s)` : "Esgotado";

    const miniaturas = document.getElementById("miniaturas");

    miniaturas.innerHTML = "";

    vestido.imagens.forEach(imagem => {
        let img = document.createElement("img");
        img.src = imagem;

        img.onclick = function(){
            document.getElementById("modalImagem").src = imagem;
        };

        miniaturas.appendChild(img);
    });

    document.getElementById("modalVestido").style.display = "flex";
};

window.fecharModal = function(){
    document.getElementById("modalVestido").style.display = "none";
};

window.adicionarModalCarrinho = function(){
    const vestido = vestidosDetalhes[vestidoModalAtual];

    adicionarCarrinho(
        vestidoModalAtual,
        vestido.preco
    );

    fecharModal();
};

// PESQUISA

const pesquisa = document.getElementById("pesquisa");

pesquisa.addEventListener("keyup", function(){
    let texto = pesquisa.value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let conteudo = card.innerText.toLowerCase();

        if(conteudo.includes(texto)){
            card.style.display = "block";
        }else{
            card.style.display = "none";
        }
    });
});

// ANIMAÇÕES

const elementosAnimados =
document.querySelectorAll(
".card, .faq-item, .login-box, .carrinho, .favoritos, .historico"
);

function animarElementos(){
    elementosAnimados.forEach(elemento => {
        const topo = elemento.getBoundingClientRect().top;
        const visivel = window.innerHeight - 80;

        if(topo < visivel){
            elemento.classList.add("mostrar");
        }
    });
}

window.addEventListener("scroll", animarElementos);

animarElementos();
atualizarEstoque();