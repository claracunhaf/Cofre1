
const MAX_TENTATIVAS = 7;
const MIN_SENHA = 1;
const MAX_SENHA = 50;

let senhaSecreta;
let tentativasUsadas = 0;
let jogoEncerrado = false;

const painelCofre = document.getElementById("painel-cofre");
const imgCofre = document.getElementById("img-cofre");

const spanTentativas = document.getElementById("tentativas-restantes");
const boxTentativas = document.querySelector(".painel-tentativas");
const progressoTentativas = document.getElementById("progresso-tentativas");
const pontosTentativas = progressoTentativas.querySelectorAll(".ponto");

const alertaPoucasTentativas = document.getElementById("alerta-poucas-tentativas");
const inputSenha = document.getElementById("input-senha");

const btnTentar = document.getElementById("btn-tentar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");

const mensagemFeedback = document.getElementById("mensagem-feedback");

const overlayVitoria = document.getElementById("overlay-vitoria");
const textoTentativasUsadas = document.getElementById("texto-tentativas-usadas");

function iniciarJogo() {
    senhaSecreta = Math.floor(Math.random() * MAX_SENHA) + MIN_SENHA;

    tentativasUsadas = 0;
    jogoEncerrado = false;

    atualizarTentativas();

    imgCofre.src = "imagens/cofre-fechado.png";
    imgCofre.alt = "Cofre fechado";
    imgCofre.classList.remove("animar-abertura");

    painelCofre.classList.remove("cofre-aberto");
    boxTentativas.classList.remove("status-perigo");

    alertaPoucasTentativas.className = "alerta-oculto";

    inputSenha.value = "";
    inputSenha.disabled = false;

    btnTentar.disabled = false;

    mensagemFeedback.textContent = "Aguardando seu primeiro palpite.";
    mensagemFeedback.className = "mensagem";

    overlayVitoria.classList.add("oculto");

    inputSenha.focus();
}

function atualizarTentativas() {
    const tentativasRestantes = MAX_TENTATIVAS - tentativasUsadas;

    spanTentativas.textContent = tentativasRestantes;

    pontosTentativas.forEach((ponto, indice) => {
        const tentativaDisponivel = indice < tentativasRestantes;

        ponto.classList.toggle("ativo", tentativaDisponivel);
        ponto.classList.toggle("gasto", !tentativaDisponivel);
    });

    if (tentativasRestantes <= 2 && tentativasRestantes > 0) {
        boxTentativas.classList.add("status-perigo");

        alertaPoucasTentativas.textContent =
            `Restam apenas ${tentativasRestantes} tentativas. Escolha com cuidado.`;

        alertaPoucasTentativas.className = "alerta-visivel";
    } else {
        boxTentativas.classList.remove("status-perigo");
        alertaPoucasTentativas.className = "alerta-oculto";
    }
}

function verificarSenha() {
    if (jogoEncerrado) {
        return;
    }

    const valorDigitado = inputSenha.value;
    const palpite = Number(valorDigitado);

    if (
        valorDigitado.trim() === "" ||
        !Number.isInteger(palpite) ||
        palpite < MIN_SENHA ||
        palpite > MAX_SENHA
    ) {
        mostrarMensagem(
            "Digite um número inteiro entre 1 e 50.",
            "msg-erro"
        );

        inputSenha.value = "";
        inputSenha.focus();

        return;
    }

    tentativasUsadas++;

    atualizarTentativas();

    if (palpite === senhaSecreta) {
        desbloquearCofre();
        return;
    }

    if (MAX_TENTATIVAS - tentativasUsadas === 0) {
        encerrarJogo();
        return;
    }

    if (palpite < senhaSecreta) {
        mostrarMensagem("A senha secreta é maior.", "msg-dica");
    } else {
        mostrarMensagem("A senha secreta é menor.", "msg-dica");
    }

    inputSenha.value = "";
    inputSenha.focus();
}

function mostrarMensagem(texto, classe) {
    mensagemFeedback.textContent = texto;
    mensagemFeedback.className = `mensagem ${classe}`;
}

function encerrarJogo() {
    jogoEncerrado = true;

    inputSenha.disabled = true;
    btnTentar.disabled = true;

    alertaPoucasTentativas.className = "alerta-oculto";

    mostrarMensagem(
        `Suas tentativas acabaram. A senha era ${senhaSecreta}.`,
        "msg-erro"
    );
}

function desbloquearCofre() {
    jogoEncerrado = true;

    inputSenha.disabled = true;
    btnTentar.disabled = true;

    alertaPoucasTentativas.className = "alerta-oculto";

    imgCofre.src = "imagens/Cofre-Aberto.png";
    imgCofre.alt = "Cofre aberto";
    imgCofre.classList.add("animar-abertura");

    painelCofre.classList.add("cofre-aberto");

    mostrarMensagem("A senha foi descoberta!", "msg-sucesso");

    const palavraTentativa =
        tentativasUsadas === 1 ? "tentativa" : "tentativas";

    textoTentativasUsadas.textContent =
        `Você descobriu a senha ${senhaSecreta} em ${tentativasUsadas} ${palavraTentativa}.`;

    overlayVitoria.classList.remove("oculto");

    btnJogarNovamente.focus();
}

btnTentar.addEventListener("click", verificarSenha);

inputSenha.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        verificarSenha();
    }
});

btnReiniciar.addEventListener("click", iniciarJogo);

btnJogarNovamente.addEventListener("click", iniciarJogo);

iniciarJogo();
