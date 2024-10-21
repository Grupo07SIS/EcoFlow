async function entrar() {
    var emailVar = document.getElementById('email').value;
    var senhaVar = document.getElementById('senha').value;

    try {
        const organizadorResponse = await fetch("http://localhost:8080/organizador", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (organizadorResponse.status === 204) {
            console.log("No organizer found (status 204), checking colaborador...");
            checkColaborador(emailVar, senhaVar); 
        } else if (organizadorResponse.ok) {
            const organizadorData = await organizadorResponse.json();
            const organizadorUser = organizadorData.find(user => user.email === emailVar && user.senha === senhaVar);

            if (organizadorUser) {
                console.log("Organizador found: ", organizadorUser);

                sessionStorage.setItem('ID_ORGANIZADOR', organizadorUser.id_organizador);
                sessionStorage.setItem('EMAIL_ORGANIZADOR', organizadorUser.email);
                sessionStorage.setItem('CNPJ_ORGANIZADOR', organizadorUser.cnpj);
                sessionStorage.setItem('NOME_RESP_ORGANIZADOR', organizadorUser.nome_resp);
                sessionStorage.setItem('SENHA_ORGANIZADOR', organizadorUser.senha);
                sessionStorage.setItem('CPF_RESP_ORGANIZADOR', organizadorUser.cpf_resp);
                sessionStorage.setItem('TELEFONE_ORGANIZADOR', organizadorUser.telefone);
                sessionStorage.setItem('IMAGEM_PERFIL_ORGANIZADOR', organizadorUser.imagemPerfil);
                sessionStorage.setItem('PERMISSAO_ORGANIZADOR', organizadorUser.permissao);  

                const endereco = organizadorUser.endereco;  
                    sessionStorage.setItem('ID_ENDERECO_ORGANIZADOR', endereco.id_endereco_usuario);
                    sessionStorage.setItem('LOGRADOURO_ORGANIZADOR', endereco.logradouro);
                    sessionStorage.setItem('NUMERO_ORGANIZADOR', endereco.numero);
                    sessionStorage.setItem('COMPLEMENTO_ORGANIZADOR', endereco.complemento);
                    sessionStorage.setItem('CIDADE_ORGANIZADOR', endereco.cidade);
                    sessionStorage.setItem('ESTADO_ORGANIZADOR', endereco.estado);
                    sessionStorage.setItem('CEP_ORGANIZADOR', endereco.cep);


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
                    return;
                }
            } else {
                checkColaborador(emailVar, senhaVar);
            }
        } else {
            alert("Erro ao verificar organizador.");
        }
    } catch (error) {
        console.log("Erro ao tentar login: ", error);
        alert("Erro ao tentar login. Por favor, tente novamente mais tarde.");
    }
}

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

                sessionStorage.setItem('ID_COLABORADOR', colaboradorUser.idColaborador);
                sessionStorage.setItem('EMAIL_COLABORADOR', colaboradorUser.email);
                sessionStorage.setItem('SENHA_COLABORADOR', colaboradorUser.senha);
                sessionStorage.setItem('CNPJ_COLABORADOR', colaboradorUser.cnpj);
                sessionStorage.setItem('NOME_RESP_COLABORADOR', colaboradorUser.nomeResp);
                sessionStorage.setItem('CPF_RESP_COLABORADOR', colaboradorUser.cpfResp);
                sessionStorage.setItem('TELEFONE_COLABORADOR', colaboradorUser.telefone);
                sessionStorage.setItem('PERMISSAO_COLABORADOR', colaboradorUser.permissao);
                sessionStorage.setItem('NOME_FANTASIA_COLABORADOR', colaboradorUser.nomeFantasia);
                sessionStorage.setItem('RAZAO_SOCIAL_COLABORADOR', colaboradorUser.razaoSocial);
                sessionStorage.setItem('TIPO_EMPRESA_COLABORADOR', colaboradorUser.tipoEmpresa);
                sessionStorage.setItem('INSC_ESTADUAL_COLABORADOR', colaboradorUser.inscEstadual);
                sessionStorage.setItem('RG_RESP_COLABORADOR', colaboradorUser.rgResp);
                sessionStorage.setItem('BANNER_IMG_COLABORADOR', colaboradorUser.bannerImg);
                sessionStorage.setItem('WPP_COMERCIAL_COLABORADOR', colaboradorUser.wppComercial);
                sessionStorage.setItem('PROPOSITO_COLABORADOR', colaboradorUser.proposito);

                const endereco = colaboradorUser.endereco;
                sessionStorage.setItem('ID_ENDERECO_COLABORADOR', endereco.id_endereco_usuario);
                sessionStorage.setItem('LOGRADOURO_COLABORADOR', endereco.logradouro);
                sessionStorage.setItem('NUMERO_COLABORADOR', endereco.numero);
                sessionStorage.setItem('COMPLEMENTO_COLABORADOR', endereco.complemento);
                sessionStorage.setItem('CIDADE_COLABORADOR', endereco.cidade);
                sessionStorage.setItem('ESTADO_COLABORADOR', endereco.estado);
                sessionStorage.setItem('CEP_COLABORADOR', endereco.cep);

                const tipoProduto = colaboradorUser.tipoProduto;
                sessionStorage.setItem('ID_TIPO_PRODUTO_COLABORADOR', tipoProduto.id_tipo_produto);
                sessionStorage.setItem('TIPO_PRODUTO_COLABORADOR', tipoProduto.tipo);

                const midiasSociais = colaboradorUser.midiasSociais;
                sessionStorage.setItem('ID_MIDIAS_SOCIAIS_COLABORADOR', midiasSociais.id_midias_sociais); 
                sessionStorage.setItem('INSTAGRAM_COLABORADOR', midiasSociais.instagram);
                sessionStorage.setItem('FACEBOOK_COLABORADOR', midiasSociais.facebook);
                sessionStorage.setItem('SITE_COLABORADOR', midiasSociais.site);

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

