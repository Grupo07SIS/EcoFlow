// async function entrar() {
//     var emailVar = document.getElementById('email').value;
//     var senhaVar = document.getElementById('senha').value;

//     // if (emailVar === "" || senhaVar === "") {
//     //     document.getElementById('cardErro').style.display = "block";
//     //     document.getElementById('mensagem_erro').innerHTML = "Preencha todos os campos!";

//     //     setTimeout(function () {
//     //         document.getElementById('cardErro').style.display = 'none';
//     //     }, 3000);

//     //     return false;
//     // }

//     fetch("http://localhost:8080/usuarios/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             email: emailVar,
//             senha: senhaVar
//         })
//     }).then(function (resposta) {
//         console.log("Status da resposta:", resposta.status);

//         if (resposta.ok) {
//             return resposta.json();
//         } else {
//             console.log("Erro ao tentar realizar o login:", resposta.statusText);
//             throw new Error("Erro ao tentar realizar o login.");
//         }
//     }).then(function (json) {
//         console.log("Dados do usuário logado:", json);

//         sessionStorage.ID_USUARIO = json.idUsuario;
//         sessionStorage.NOME_USUARIO = json.nomeResp;
//         sessionStorage.EMAIL_USUARIO = json.email;

//         setTimeout(function () {
//             window.location = "index.html";
//         }, 1000); // Redirect after 1 second (for demonstration)

//     }).catch(function (erro) {
//         console.error("Erro durante o login:", erro);
//         finalizarAguardar("Erro durante o login. Verifique suas credenciais ou tente novamente mais tarde.");
//     });

// }
async function entrar() {
    var emailVar = document.getElementById('email').value;
    var senhaVar = document.getElementById('senha').value;

    try {
        const resposta = await fetch("http://localhost:8080/usuarios/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: emailVar,
                senha: senhaVar
            })
        });

        if (resposta.ok) {
            const respostaTexto = resposta.text();
            console.log("Login bem-sucedido: ", respostaTexto);
            
            window.location.href = 'index.html';
        } else if (resposta.status === 404) {
            console.log("Usuário não encontrado");
            alert("Usuário não encontrado. Verifique suas credenciais e tente novamente.");
        } else {
            const respostaTexto = resposta.text();
            console.log("Erro de login: ", respostaTexto);
            alert("Erro ao tentar login: " + respostaTexto);
        }
    } catch (error) {
        console.log("Erro ao tentar login: ", error);
        alert("Erro ao tentar login. Por favor, tente novamente mais tarde.");
    }
}



