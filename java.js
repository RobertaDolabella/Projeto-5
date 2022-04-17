let nameLogin;
let nomeUsuario;
let horario;
let estado;
let promiseNome;
let chamada =[{name: ""}]
let intervalo;
function telaMensagem() {
    document.querySelector(".login").classList.add("off")
    document.querySelector(".principal").classList.remove("off")
}
function sideBar() {
    document.querySelector(".side-bar").classList.remove("off")
    document.querySelector(".principal").classList.add("principal-back")
}
function comecar(){
    promiseNome = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promiseNome.then(listaNome)
    console.log("continuou")
}
function listaNome(resposta){
    nomeUsuario = {"name":`${nameLogin}`}
    nameLogin = document.querySelector("input").value
    chamada = resposta.data
    console.log(chamada)
    promiseRegistrar = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",nomeUsuario)
        promiseRegistrar.then(nomePostado)
        promiseRegistrar.catch(erro)
}
function nomePostado(){
    console.log("vai entrar no timer")
    getMensagens()
    timer()
}
function erro(falha){
    let statusCode = falha.response.status
    alert(`erro do tipo ${statusCode}`)
    console.log(`erro do tipo ${statusCode}`)
    if(statusCode == 400){
    alert("Usuário já existente, escolha outro nome para o seu usuário")
    document.querySelector("input").value = ""
    }
}
function timer(){
    intervalo = setInterval(online, 4999)
    console.log("entrou no timer")
}
function online(){
    console.log("chamou a funcao online")
    promiseOnline = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario)
    promiseOnline.then(verificacao)
    promiseOnline.catch(caiu)
        function verificacao(usuario){
            console.log("tudo certo")
            estado = "entrou na sala..."
        }
        function caiu(erro){
            clearInterval(intervalo)
            let statusCode = erro.response.status
            alert(statusCode)
        }   
}
function getMensagens(){    
    promiseMensagem = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promiseMensagem.then(entrounaSala)
    promiseMensagem.catch(erroMensagem)
}
function entrounaSala(sucesso){
    console.log("entrounaSala executando")
    let visibilidadeMensagem = "todos"
    let textoMensagem = "entrou na sala"
    estado = "status"
    console.log("definiu menagens")
    let mensagem = [{
        from: `${nameLogin}`,
        to: `${visibilidadeMensagem}`,
        text: `${textoMensagem}`,
        type: `${estado}`
    }]
    console.log(mensagem)
    promiseEntrou = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem);
    promiseEntrou.then(statusOnline)
    promiseEntrou.catch(erroStatus)
    function statusOnline(sucesso){
        console.log("mensagem enviada")
        telaMensagem()
    }
    function erroStatus(erro){
        statusCode = erro.response.status
        alert(statusCode)
    }
}
function erroMensagem(falha){
    statusCode = falha.response.status
    console.log(statusCode)
}
