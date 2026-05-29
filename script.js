// FIREBASE

import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
}

from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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

// INICIAR FIREBASE

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

// CARRINHO

let carrinho = [];
let total = 0;

// ADICIONAR AO CARRINHO

window.adicionarCarrinho =
function(nome, preco){

carrinho.push({
nome:nome,
preco:preco
});

total += preco;

atualizarCarrinho();

}

// ATUALIZAR

function atualizarCarrinho(){

const lista =
document.getElementById("listaCarrinho");

const totalTexto =
document.getElementById("total");

lista.innerHTML = "";

carrinho.forEach(item => {

let li =
document.createElement("li");

li.innerHTML =
`${item.nome} ✦ R$ ${item.preco.toLocaleString('pt-BR')}`;

lista.appendChild(li);

});

totalTexto.innerHTML =
`Total: R$ ${total.toLocaleString('pt-BR')}`;

}

// LOGIN

window.login = function(){

    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();

    if(email === "" || !email.includes("@")){
        alert("Digite um email válido, exemplo: teste@gmail.com");
        return;
    }

    if(senha.length < 6){
        alert("A senha precisa ter no mínimo 6 caracteres.");
        return;
    }

    signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
        alert("Login realizado ✦");
    })
    .catch((error) => {
        alert("Erro: " + error.code);
    });
}

window.cadastro = function(){

    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();

    if(email === "" || !email.includes("@")){
        alert("Digite um email válido, exemplo: teste@gmail.com");
        return;
    }

    if(senha.length < 6){
        alert("A senha precisa ter no mínimo 6 caracteres.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
        alert("Conta criada ✦");
    })
    .catch((error) => {
        alert("Erro: " + error.code);
    });
}

// PESQUISA

const pesquisa =
document.getElementById("pesquisa");

pesquisa.addEventListener(
"keyup",

function(){

let texto =
pesquisa.value.toLowerCase();

let cards =
document.querySelectorAll(".card");

cards.forEach(card => {

let conteudo =
card.innerText.toLowerCase();

if(
conteudo.includes(texto)
){

card.style.display =
"block";

}

else{

card.style.display =
"none";

}

});

});