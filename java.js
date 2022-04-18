let nameLogin;
let promiseNome;
let chamada = [{ name: "" }]
let intervalo;
let listaChat;
let tamanhoChat;
let i;
let cortedaLista = ""
let corpo;
let nomeRemetente;
function telaMensagem() {
    document.querySelector(".login").classList.add("off")
    document.querySelector(".login").querySelector("img").classList.add("off")
    document.querySelector(".login").querySelector("input").classList.add("off")
    document.querySelector(".login").querySelector("button").classList.add("off")
    document.querySelector(".principal").classList.remove("off")
    getMensagens()
    timerMensagem()
}
function timerMensagem() {
    console.log("chamou o timer")
    let timerAtualizar = setInterval(getMensagens, 2000)
}
function minhasMensagens() {
    console.log("entrou nas MinhasMensagens")
    i = 0
    let novaMensagem;
    while (i < tamanhoChat) {
        cortedaLista = listaChat[i]
        if (listaChat[i].to == "todos" || listaChat[i].to == "Todos" || listaChat[i].from == `${nameLogin}`) {
            novaMensagem = [
                `<li>
                    <div class="texto ${listaChat[i].type}">
                        <span class="light">(${listaChat[i].time}) </span><span> <b>${listaChat[i].from}</b> para <b> ${listaChat[i].to}</b>: ${listaChat[i].text}</span>
                    </div>
                </li>
                `
            ]
            corpo.innerHTML += novaMensagem
            let ultimaMensagem = document.querySelector("ul").lastElementChild
            ultimaMensagem.scrollIntoView()
        }
        i++
    }

}
function atualizarMensagem(chat) {
    console.log("sucesso na promiseMensagem")
    listaChat = chat.data
    tamanhoChat = listaChat.length
    corpo = document.querySelector("ul")
    minhasMensagens()
}
function erroMensagem(falha) {
    let statusCode = falha.response.erro
    Offline()
    retornarTelaInicial()
}
function getMensagens() {
    console.log("entrou no getMensagens")
    promiseMensagem = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promiseMensagem.then(atualizarMensagem)
    promiseMensagem.catch(erroMensagem)
}
function sideBar() {
    document.querySelector(".side-bar").classList.remove("off")
    document.querySelector(".out").classList.remove("off")
    document.querySelector(".principal").classList.add("principal-back")
    usuarios()
}
function voltaParaTelaMensagem(){
    document.querySelector(".side-bar").classList.add("off")
    document.querySelector(".out").classList.add("off")
    document.querySelector(".principal").classList.remove("principal-back")
}
function usuarios() {
    listaUsuario = document.querySelector(".usuarios")
    console.log("entrou em usuarios")
    let m = 0
    let novosUsuarios;
    console.log(chamada)
    console.log(chamada.length)
    while (m < chamada.length) {
        novosUsuarios = [
            `<li>
                        <div class="itens nomes">
                            <ion-icon name="person-circle"></ion-icon>
                            <span class="remetente" onclick="remetente(this)">${chamada[m].name}</span>
                            <ion-icon class="checkmark" name="checkmark"></ion-icon>
                        </div>
                    </li>
                    `
        ]
        listaUsuario.innerHTML += novosUsuarios
        m++
    }
}
function remetente(elemento){
    let divpai = elemento.parentNode
    divpai.querySelector(".checkmark").classList.add("aparece")
    nomeRemetente = elemento.innerHTML
    console.log(nomeRemetente)
    alert("remetente selecionado")
}
function comecar(){
    promiseNome = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promiseNome.then(listaNome)
    console.log("continuou")
}
function listaNome(resposta) {
    nameLogin = document.querySelector("input").value
    let nomeUsuario = { "name": `${nameLogin}` }
    chamada = resposta.data
    console.log(chamada)
    promiseRegistrar = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario)
    promiseRegistrar.then(nomePostado)
    promiseRegistrar.catch(erroPostado)
}
function nomePostado() {
    timerOnline()
    telaMensagem()
    timerMensagem()
}
function erroPostado(falha) {
    let statusCode = falha.response.status
    alert(`erro do tipo ${statusCode}`)
    console.log(`erro do tipo ${statusCode}`)
    if (statusCode == 400) {
        alert("Usuário já existente, escolha outro nome para o seu usuário")
        document.querySelector("input").value = ""
    }
}
function timerOnline() {
    intervalo = setInterval(online, 4999)
    console.log("entrou no timer")
}
function online() {
    console.log("chamou a funcao online")
    nameLogin = document.querySelector("input").value
    let nomeUsuario = { "name": `${nameLogin}` }
    promiseOnline = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario)
    promiseOnline.then(verificacao)
    promiseOnline.catch(caiu)
    function verificacao(usuario) {
        console.log("tudo certo")
    }
    function caiu(erro) {
        clearInterval(intervalo)
        let statusCode = erro.response.erro
        alert(statusCode)
        retornarTelaInicial()
    }
}

function enviar() {
    let textoMensagem = document.querySelector(".mensagem").value
    let estado = "message"
    let visibilidadeMensagem = "todos"
    if(nomeRemetente!== undefined){
        visibilidadeMensagem = nomeRemetente
    }
    console.log("definiu menagens")
    let mensagemTexto = {
        from: `${nameLogin}`,
        to: `${visibilidadeMensagem}`,
        text: `${textoMensagem}`,
        type: `${estado}`
    }
    console.log(mensagemTexto)
    promiseEnviar = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemTexto)
    promiseEnviar.then(statusOnline)
    promiseEnviar.catch(erroStatus)
    function statusOnline(sucesso) {
        console.log("mensagem enviada")
        document.querySelector(".mensagem").value = ""
    }
    function erroStatus(erro) {
        statusCode = erro.response.status
        alert(statusCode)
    }
}

function Offline() {
    clearInterval(intervalo)
}
function retornarTelaInicial() {
    window.location.reload()
}