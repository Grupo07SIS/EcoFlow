function entrar() {
    var emailVar = document.getElementById('email').value;
    var senhaVar = document.getElementById('senha').value;

    // if (emailVar === "" || senhaVar === "") {
    //     document.getElementById('cardErro').style.display = "block";
    //     document.getElementById('mensagem_erro').innerHTML = "Preencha todos os campos!";

    //     setTimeout(function () {
    //         document.getElementById('cardErro').style.display = 'none';
    //     }, 3000);

    //     return false;
    // }

    fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailVar,
            senha: senhaVar
        })
    }).then(function (resposta) {
        console.log("Status da resposta:", resposta.status);

        if (resposta.ok) {
            return resposta.json();
        } else {
            console.log("Erro ao tentar realizar o login:", resposta.statusText);
            throw new Error("Erro ao tentar realizar o login.");
        }
    }).then(function (json) {
        console.log("Dados do usuário logado:", json);

        sessionStorage.ID_USUARIO = json.idUsuario;
        sessionStorage.NOME_USUARIO = json.nomeResp;
        sessionStorage.EMAIL_USUARIO = json.email;

        setTimeout(function () {
            window.location = "index.html";
        }, 1000); // Redirect after 1 second (for demonstration)

    }).catch(function (erro) {
        console.error("Erro durante o login:", erro);
        finalizarAguardar("Erro durante o login. Verifique suas credenciais ou tente novamente mais tarde.");
    });

    return false;
}
