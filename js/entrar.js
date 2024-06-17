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
            const jsonResponse = await resposta.json();
            console.log("Login bem-sucedido: ", jsonResponse);


            if (jsonResponse.length > 0) {
                const userData = jsonResponse[0];
                console.log("User Data: ", userData);

   
                sessionStorage.setItem('ID_USUARIO', userData.idUsuario);
                sessionStorage.setItem('NOME_USUARIO', userData.nomeResp);
                sessionStorage.setItem('EMAIL_USUARIO', userData.email);

                console.log("ID_USUARIO:", sessionStorage.getItem('ID_USUARIO'));
                console.log("NOME_USUARIO:", sessionStorage.getItem('NOME_USUARIO'));
                console.log("EMAIL_USUARIO:", sessionStorage.getItem('EMAIL_USUARIO'));

                window.location.href = 'index.html';
            } else {
                console.error("JSON response does not contain user data");
                alert("Erro ao tentar login. Por favor, tente novamente mais tarde.");
            }
        } else if (resposta.status === 404) {
            console.log("Usuário não encontrado");
            alert("Usuário não encontrado. Verifique suas credenciais e tente novamente.");
        } else {
            const respostaTexto = await resposta.text();
            console.log("Erro de login: ", respostaTexto);
            alert("Erro ao tentar login: " + respostaTexto);
        }
    } catch (error) {
        console.log("Erro ao tentar login: ", error);
        alert("Erro ao tentar login. Por favor, tente novamente mais tarde.");
    }
}
