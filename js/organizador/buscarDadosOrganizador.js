function obterDadosUsuario() {
    const usuario = {
        idUsuario: parseInt(sessionStorage.getItem('ID_USUARIO')),
        email: sessionStorage.getItem('EMAIL_USUARIO'),
        senha: sessionStorage.getItem('SENHA_USUARIO'),
        cnpj: sessionStorage.getItem('CNPJ_USUARIO'),
        categoria: sessionStorage.getItem('CATEGORIA_USUARIO'),
        nomeResp: sessionStorage.getItem('NOME_RESPONSAVEL'),
        cpfResp: sessionStorage.getItem('CPF_RESPONSAVEL'), 
        imagemLogo: sessionStorage.getItem('IMAGEM_LOGO'),
        fkPermissao: {
            idPermissao: parseInt(sessionStorage.getItem('ID_PERMISSAO')),
            tipoUsuario: sessionStorage.getItem('TIPO_USUARIO')
        },
        fkDados: {
            idDadosComplementares: parseInt(sessionStorage.getItem('ID_DADOS_COMPLEMENTARES')), // Assuming you want this as well
            nomeFantasia: sessionStorage.getItem('NOME_FANTASIA'),
            razaoSocial: sessionStorage.getItem('RAZAO_SOCIAL'),
            tipoEmpresa: sessionStorage.getItem('TIPO_EMPRESA'),
            inscricaoEstadual: sessionStorage.getItem('INSCRICAO_ESTADUAL'),
            rgResp: sessionStorage.getItem('RG_RESPONSAVEL'),
            telefone: sessionStorage.getItem('TELEFONE'),
            wppComercial: sessionStorage.getItem('WPP_COMERCIAL'),
            proposito: sessionStorage.getItem('PROPOSITO'),
            fkPermissao: { // This might be redundant unless you are storing it differently
                idPermissao: parseInt(sessionStorage.getItem('ID_PERMISSAO')),
                tipoUsuario: sessionStorage.getItem('TIPO_USUARIO')
            },
            fkEnderecoUsuario: {
                idEnderecoUsuario: parseInt(sessionStorage.getItem('ID_ENDERECO_USUARIO')), // Assuming you want this too
                logradouro: sessionStorage.getItem('LOGRADOURO'),
                numero: parseInt(sessionStorage.getItem('NUMERO')),
                complemento: sessionStorage.getItem('COMPLEMENTO'),
                cidade: sessionStorage.getItem('CIDADE'),
                estado: sessionStorage.getItem('ESTADO'),
                cep: sessionStorage.getItem('CEP')
            },
            fkMidiasSociais: {
                idMidiasSociais: parseInt(sessionStorage.getItem('ID_MIDIAS_SOCIAIS')), // Assuming you want this
                instagram: sessionStorage.getItem('INSTAGRAM'),
                facebook: sessionStorage.getItem('FACEBOOK'),
                site: sessionStorage.getItem('SITE')
            },
            fkTipoProducao: {
                idTipoProducao: parseInt(sessionStorage.getItem('ID_TIPO_PRODUCAO')), // Assuming you want this too
                tipo: sessionStorage.getItem('TIPO_PRODUCAO')
            }
        }
    };

    return usuario;
}

// Uso da função
const dadosUsuario = obterDadosUsuario();

async function carregarPerfil() {
    const nomeSS = dadosUsuario.nomeResponsavel || "Nome não disponível";
    const cnpjSS = dadosUsuario.cnpj || "CNPJ não disponível";
    const telefoneSS = dadosUsuario.fkDados.telefone || "Telefone não disponível";
    const razaoSocialSS = dadosUsuario.fkDados.razaoSocial || "Razão social não disponível";
    const propositoSS = dadosUsuario.fkDados.proposito || "Propósito não disponível";

    const nomeNavBar = document.getElementById('userName');
    const emailNavBar = document.getElementById('nomeEmpresa');

    if (!dadosUsuario.idUsuario) {
        console.log("Usuário não está logado.");
        alert("Usuário não está logado.");
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = nomeSS;
    document.getElementById('nomeDaEmpresa').textContent = razaoSocialSS;
    document.getElementById('cnpj').textContent = cnpjSS;
    document.getElementById('telefone').textContent = telefoneSS;
    document.getElementById('razaoSocial').textContent = razaoSocialSS;
    document.getElementById('proposito').textContent = propositoSS;

    try {
        document.getElementById('nomeUsuario').textContent = nomeSS;
        document.getElementById('nomeDaEmpresa').textContent = razaoSocialSS;
        document.getElementById('cnpj').textContent = cnpjSS;
        document.getElementById('telefone').textContent = telefoneSS;
        document.getElementById('razaoSocial').textContent = razaoSocialSS;
        document.getElementById('proposito').textContent = propositoSS;
    } catch (error) {
        console.log("Erro ao tentar buscar os detalhes do usuário: ", error);
        alert("Erro ao tentar carregar os detalhes do perfil. Tente novamente mais tarde.");
    }
}

function enableEditing() {
    const fields = ['cnpj', 'telefone', 'razaoSocial', 'proposito'];

    fields.forEach(field => {
        const span = document.getElementById(field);
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.innerText;
        input.id = field + 'Input';
        span.replaceWith(input);
    });

    const editarBtn = document.getElementById('editarInfoBtn');
    editarBtn.innerText = 'Salvar';
    editarBtn.onclick = saveChanges;
}

async function saveChanges() {
    const fields = ['cnpj', 'telefone', 'razaoSocial', 'proposito'];

    let updatedData = {};
    fields.forEach(field => {
        const input = document.getElementById(field + 'Input');
        updatedData[field] = input.value;
    });

    const usuario = {
        idUsuario: dadosUsuario.idUsuario,  // Ensure this is included if necessary
        email: dadosUsuario.email,
        senha: dadosUsuario.senha,
        cnpj: updatedData.cnpj,
        categoria: dadosUsuario.categoria,
        cpfResp: dadosUsuario.cpfResp, // Match the original naming
        nomeResp: dadosUsuario.nomeResp,
        imagemLogo: dadosUsuario.imagemLogo,
        fkPermissao: {
            idPermissao: dadosUsuario.fkPermissao.idPermissao,
            tipoUsuario: dadosUsuario.fkPermissao.tipoUsuario
        },
        fkDados: {
            idDadosComplementares: dadosUsuario.fkDados.idDadosComplementares || 0, // Optional if this ID is needed
            nomeFantasia: dadosUsuario.fkDados.nomeFantasia,
            razaoSocial: updatedData.razaoSocial,
            tipoEmpresa: dadosUsuario.fkDados.tipoEmpresa,
            inscricaoEstadual: dadosUsuario.fkDados.inscricaoEstadual,
            rgResp: dadosUsuario.fkDados.rgResp,
            telefone: updatedData.telefone,
            wppComercial: dadosUsuario.fkDados.wppComercial,
            proposito: updatedData.proposito,
            fkEnderecoUsuario: {
                idEnderecoUsuario: dadosUsuario.fkDados.fkEnderecoUsuario.idEnderecoUsuario || 0, // Optional if this ID is needed
                logradouro: dadosUsuario.fkDados.fkEnderecoUsuario.logradouro,
                numero: dadosUsuario.fkDados.fkEnderecoUsuario.numero,
                complemento: dadosUsuario.fkDados.fkEnderecoUsuario.complemento,
                cidade: dadosUsuario.fkDados.fkEnderecoUsuario.cidade,
                estado: dadosUsuario.fkDados.fkEnderecoUsuario.estado,
                cep: dadosUsuario.fkDados.fkEnderecoUsuario.cep
            },
            fkMidiasSociais: {
                idMidiasSociais: dadosUsuario.fkDados.fkMidiasSociais.idMidiasSociais || 0, // Optional if this ID is needed
                instagram: dadosUsuario.fkDados.fkMidiasSociais.instagram,
                facebook: dadosUsuario.fkDados.fkMidiasSociais.facebook,
                site: dadosUsuario.fkDados.fkMidiasSociais.site
            },
            fkTipoProducao: {
                idTipoProducao: dadosUsuario.fkDados.fkTipoProducao.idTipoProducao || 0, // Optional if this ID is needed
                tipo: dadosUsuario.fkDados.fkTipoProducao.tipo
            }
        }
    };

    console.log(JSON.stringify(usuario));

    try {
        const resposta = await fetch(`http://localhost:8080/usuarios?id=${dadosUsuario.idUsuario}`, {
            method: 'PATCH',
            body: JSON.stringify(usuario),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });        

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');

        if (resposta.ok) {  
            console.log("Perfil atualizado com sucesso!");

            popupMessage.textContent = "Perfil atualizado com sucesso!";
            popup.style.backgroundColor = "green";

            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            const errorMessage = await resposta.text();
            console.error('Erro ao atualizar perfil:', resposta.status, errorMessage, usuario);

            popupMessage.textContent = "Erro ao atualizar perfil: " + errorMessage;
            popup.style.backgroundColor = "red";

            popup.classList.add('show');
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }

    } catch (error) {
        console.error('Erro na requisição:', error);

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = "Erro na requisição: " + error.message;
        popup.style.backgroundColor = "red";
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
}

window.onload = carregarPerfil;
