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
                sessionStorage.setItem('EMAIL_USUARIO', userData.email);
                sessionStorage.setItem('SENHA_USUARIO', userData.senha);
                sessionStorage.setItem('NOME_RESPONSAVEL', userData.nomeResp);
                sessionStorage.setItem('CNPJ_USUARIO', userData.cnpj);
                sessionStorage.setItem('CPF_RESPONSAVEL', userData.cpfResp);
                sessionStorage.setItem('IMAGEM_LOGO', userData.imagemLogo);
                
                if (userData.fkPermissao) {
                    sessionStorage.setItem('ID_PERMISSAO', userData.fkPermissao.idPermissao);
                    sessionStorage.setItem('TIPO_USUARIO', userData.fkPermissao.tipoUsuario);
                }
                
                if (userData.fkDados) {
                    const dados = userData.fkDados;
                    sessionStorage.setItem('NOME_FANTASIA', dados.nomeFantasia);
                    sessionStorage.setItem('RAZAO_SOCIAL', dados.razaoSocial);
                    sessionStorage.setItem('TIPO_EMPRESA', dados.tipoEmpresa);
                    sessionStorage.setItem('INSCRICAO_ESTADUAL', dados.inscricaoEstadual);
                    sessionStorage.setItem('RG_RESPONSAVEL', dados.rgResp);
                    sessionStorage.setItem('TELEFONE', dados.telefone);
                    sessionStorage.setItem('WPP_COMERCIAL', dados.wppComercial);
                    sessionStorage.setItem('PROPOSITO', dados.proposito);

                    // Store address data
                    if (dados.fkEnderecoUsuario) {
                        const endereco = dados.fkEnderecoUsuario;
                        sessionStorage.setItem('LOGRADOURO', endereco.logradouro);
                        sessionStorage.setItem('NUMERO', endereco.numero);
                        sessionStorage.setItem('COMPLEMENTO', endereco.complemento);
                        sessionStorage.setItem('CIDADE', endereco.cidade);
                        sessionStorage.setItem('ESTADO', endereco.estado);
                        sessionStorage.setItem('CEP', endereco.cep);
                    }

                    if (dados.fkMidiasSociais) {
                        const midias = dados.fkMidiasSociais;
                        sessionStorage.setItem('INSTAGRAM', midias.instagram);
                        sessionStorage.setItem('FACEBOOK', midias.facebook);
                        sessionStorage.setItem('SITE', midias.site);
                    }

                    if (dados.fkTipoProducao) {
                        sessionStorage.setItem('TIPO_PRODUCAO', dados.fkTipoProducao.tipo);
                    }
                }

                console.log("Dados do usuário armazenados na sessão.");
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
