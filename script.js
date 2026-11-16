
let cartas = [];

let pontosJogador = 0;
let pontosComputador = 0;
let rodada = 1;
let cartaJogador = null;
let atributoEscolhido = null;
let finalizada = false;

const atributos = ["forca", "velocidade", "defesa"];

const nomesAtributos = {
    forca: "Força",
    velocidade: "Velocidade",
    defesa: "Defesa"
};

async function carregarCartas() {
    try {
        const resposta = await fetch("./cartas.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar o JSON.");
        }

        cartas = await resposta.json();

        mostrarCartas();

        document.getElementById("resultado").textContent =
            "Escolha uma carta!";
    } catch (erro) {
        console.error(erro);

        document.getElementById("resultado").textContent =
            "Não foi possível carregar as cartas.";
    }
}

// MOSTRAR AS CARTAS
function mostrarCartas() {

    const area = document.getElementById("cartas");

    area.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {

        const botao = document.createElement("button");
        botao.className = "carta";

        const imagem = document.createElement("img");
        imagem.src = cartas[i].imagem;
        imagem.alt = cartas[i].nome;

        imagem.onerror = function() {
            this.style.display = "none";
        };

        const nome = document.createElement("h3");
        nome.textContent = cartas[i].nome;

        const forca = document.createElement("p");
        forca.textContent = "Força: " + cartas[i].forca;

        const velocidade = document.createElement("p");
        velocidade.textContent = "Velocidade: " + cartas[i].velocidade;

        const defesa = document.createElement("p");
        defesa.textContent = "Defesa: " + cartas[i].defesa;

        botao.appendChild(imagem);
        botao.appendChild(nome);
        botao.appendChild(forca);
        botao.appendChild(velocidade);
        botao.appendChild(defesa);

        botao.addEventListener("click", function() {
            jogar(i);
        });

        area.appendChild(botao);
    }
}

// PREPARAR A RODADA
function prepararRodada() {

    cartaJogador = null;
    atributoEscolhido = null;
    finalizada = false;

    document.getElementById("atributos").innerHTML = "";

    if (rodada % 2 === 1) {

        document.getElementById("mensagem").textContent =
            "Sua vez! Escolha uma carta e depois um atributo.";

    } else {

        let sorteio = Math.floor(Math.random() * atributos.length);

        atributoEscolhido = atributos[sorteio];

        document.getElementById("mensagem").textContent =
            "O computador escolheu o atributo: " +
            nomesAtributos[atributoEscolhido] +
            ". Escolha sua carta!";
    }

}

// ESCOLHER CARTA
function jogar(indice) {

    if (finalizada || cartaJogador !== null) {
        return;
    }

    cartaJogador = cartas[indice];

    if (rodada % 2 === 1) {

        mostrarAtributos();

    } else {

        compararCartas();

    }
}

// MOSTRAR ATRIBUTOS PARA O JOGADOR
function mostrarAtributos() {

    const area = document.getElementById("atributos");

    document.getElementById("mensagem").textContent =
        "Você escolheu " + cartaJogador.nome +
        ". Agora escolha um atributo!";

    area.innerHTML = "";

    for (let i = 0; i < atributos.length; i++) {

        const atributo = atributos[i];

        const botao = document.createElement("button");

        botao.className = "botao";

        botao.textContent = nomesAtributos[atributo];

        botao.addEventListener("click", function() {

            atributoEscolhido = atributo;

            compararCartas();

        });

        area.appendChild(botao);
    }
}

// COMPARAR CARTAS
function compararCartas() {

    finalizada = true;

    let sorteio = Math.floor(Math.random() * cartas.length);

    while (cartas.length > 1 && cartas[sorteio] === cartaJogador) {
        sorteio = Math.floor(Math.random() * cartas.length);
    }

    const cartaComputador = cartas[sorteio];

    const valorJogador = Number(cartaJogador[atributoEscolhido]);
    const valorComputador = Number(cartaComputador[atributoEscolhido]);

    let mensagem =
        "Sua carta: " + cartaJogador.nome +
        "\nCarta do computador: " + cartaComputador.nome +
        "\n\nAtributo: " + nomesAtributos[atributoEscolhido] +
        "\nSeu valor: " + valorJogador +
        "\nValor do computador: " + valorComputador +
        "\n\n";

    if (valorJogador > valorComputador) {

        pontosJogador++;

        mensagem += "Você venceu a rodada!";

    } else if (valorJogador < valorComputador) {

        pontosComputador++;

        mensagem += "O computador venceu a rodada!";

    } else {

        mensagem += "Empate!";
    }

    document.getElementById("pontosJogador").textContent =
        pontosJogador;

    document.getElementById("pontosComputador").textContent =
        pontosComputador;

    document.getElementById("mensagem").textContent = mensagem;

    const area = document.getElementById("atributos");

    area.innerHTML = "";

    const proxima = document.createElement("button");

    proxima.className = "botao";

    proxima.textContent = "Próxima rodada";

    proxima.addEventListener("click", function() {

        rodada++;

        prepararRodada();

    });

    area.appendChild(proxima);
}

// REINICIAR JOGO
function reiniciarJogo() {

    pontosJogador = 0;
    pontosComputador = 0;
    rodada = 1;

    document.getElementById("pontosJogador").textContent = 0;
    document.getElementById("pontosComputador").textContent = 0;

    prepararRodada();
}

// BOTÃO REINICIAR
document.getElementById("reiniciar").addEventListener(
    "click",
    reiniciarJogo
);

// INICIAR JOGO
carregarCartas();
prepararRodada();
