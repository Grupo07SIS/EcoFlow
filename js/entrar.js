async function entrar() {
    var emailVar = document.getElementById('email').value;
    var senhaVar = document.getElementById('senha').value;

    try {
        // Step 1: Check if the user is an organizador
        const organizadorResponse = await fetch("http://localhost:8080/organizador", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (organizadorResponse.status === 204) {
            // No organizer found, proceed to check colaborador
            console.log("No organizer found (status 204), checking colaborador...");
            checkColaborador(emailVar, senhaVar); // Call colaborador check function
        } else if (organizadorResponse.ok) {
            const organizadorData = await organizadorResponse.json();
            const organizadorUser = organizadorData.find(user => user.email === emailVar && user.senha === senhaVar);

            // If an organizador is found, log in as organizador
            if (organizadorUser) {
                console.log("Organizador found: ", organizadorUser);

                // Save organizador details in sessionStorage
                sessionStorage.setItem('ID_ORGANIZADOR', organizadorUser.id_organizador);
                sessionStorage.setItem('EMAIL_ORGANIZADOR', organizadorUser.email);
                sessionStorage.setItem('CNPJ_ORGANIZADOR', organizadorUser.cnpj);
                sessionStorage.setItem('NOME_RESP_ORGANIZADOR', organizadorUser.nome_resp);
                sessionStorage.setItem('CPF_RESP_ORGANIZADOR', organizadorUser.cpf_resp);
                sessionStorage.setItem('TELEFONE_ORGANIZADOR', organizadorUser.telefone);
                sessionStorage.setItem('IMAGEM_PERFIL_ORGANIZADOR', organizadorUser.imagemPerfil);

                // Store address data
                const endereco = organizadorUser.endereco;
                sessionStorage.setItem('LOGRADOURO_ORGANIZADOR', endereco.logradouro);
                sessionStorage.setItem('NUMERO_ORGANIZADOR', endereco.numero);
                sessionStorage.setItem('COMPLEMENTO_ORGANIZADOR', endereco.complemento);
                sessionStorage.setItem('CIDADE_ORGANIZADOR', endereco.cidade);
                sessionStorage.setItem('ESTADO_ORGANIZADOR', endereco.estado);
                sessionStorage.setItem('CEP_ORGANIZADOR', endereco.cep);

                // Proceed to the login endpoint for organizador
                const loginResponse = await fetch("http://localhost:8080/organizador/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login: emailVar,
                        senha: senhaVar
                    })
                });

                if (loginResponse.ok) {
                    window.location.href = 'index.html';
                } else {
                    alert("Erro ao tentar login como organizador.");
                    return; // Early return on error
                }
            } else {
                alert("Usuário organizador não encontrado.");
            }
        } else {
            alert("Erro ao verificar organizador.");
        }
    } catch (error) {
        console.log("Erro ao tentar login: ", error);
        alert("Erro ao tentar login. Por favor, tente novamente mais tarde.");
    }
}

// Function to check colaborador if no organizer is found
async function checkColaborador(emailVar, senhaVar) {
    try {
        const colaboradorResponse = await fetch("http://localhost:8080/colaborador", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (colaboradorResponse.ok) {
            const colaboradorData = await colaboradorResponse.json();
            const colaboradorUser = colaboradorData.find(user => user.email === emailVar && user.senha === senhaVar);

            if (colaboradorUser) {
                console.log("Colaborador found: ", colaboradorUser);

                // Save colaborador details in sessionStorage
                sessionStorage.setItem('ID_COLABORADOR', colaboradorUser.idColaborador);
                sessionStorage.setItem('EMAIL_COLABORADOR', colaboradorUser.email);
                sessionStorage.setItem('CNPJ_COLABORADOR', colaboradorUser.cnpj);
                sessionStorage.setItem('NOME_RESP_COLABORADOR', colaboradorUser.nomeResp);
                sessionStorage.setItem('CPF_RESP_COLABORADOR', colaboradorUser.cpfResp);
                sessionStorage.setItem('TELEFONE_COLABORADOR', colaboradorUser.telefone);
                sessionStorage.setItem('BANNER_IMG_COLABORADOR', colaboradorUser.bannerImg);
                sessionStorage.setItem('WPP_COMERCIAL_COLABORADOR', colaboradorUser.wppComercial);
                sessionStorage.setItem('PROPOSITO_COLABORADOR', colaboradorUser.proposito);

                // Store address data
                const endereco = colaboradorUser.endereco;
                sessionStorage.setItem('LOGRADOURO_COLABORADOR', endereco.logradouro);
                sessionStorage.setItem('NUMERO_COLABORADOR', endereco.numero);
                sessionStorage.setItem('COMPLEMENTO_COLABORADOR', endereco.complemento);
                sessionStorage.setItem('CIDADE_COLABORADOR', endereco.cidade);
                sessionStorage.setItem('ESTADO_COLABORADOR', endereco.estado);
                sessionStorage.setItem('CEP_COLABORADOR', endereco.cep);

                // Store product and social media data
                const tipoProduto = colaboradorUser.tipoProduto;
                sessionStorage.setItem('TIPO_PRODUTO_COLABORADOR', tipoProduto.tipo);

                const midiasSociais = colaboradorUser.midiasSociais;
                sessionStorage.setItem('INSTAGRAM_COLABORADOR', midiasSociais.instagram);
                sessionStorage.setItem('FACEBOOK_COLABORADOR', midiasSociais.facebook);
                sessionStorage.setItem('SITE_COLABORADOR', midiasSociais.site);

                // Proceed to the login endpoint for colaborador
                const loginColabResponse = await fetch("http://localhost:8080/colaborador/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login: emailVar,
                        senha: senhaVar
                    })
                });

                if (loginColabResponse.ok) {
                    console.log("Login as colaborador successful.");
                    window.location.href = 'index-colaborador.html';
                } else {
                    alert("Erro ao tentar login como colaborador.");
                }
            } else {
                alert("Usuário colaborador não encontrado. Verifique suas credenciais.");
            }
        } else {
            alert("Erro ao verificar colaborador.");
        }
    } catch (error) {
        console.log("Erro ao tentar login como colaborador: ", error);
        alert("Erro ao tentar login como colaborador. Por favor, tente novamente mais tarde.");
    }
}
