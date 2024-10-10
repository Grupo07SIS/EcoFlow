const isOrganizador = sessionStorage.getItem('ID_ORGANIZADOR') !== null;
let originalData = {};

// Function to get user data from sessionStorage
function obterDados() {
    return {
        id_organizador: parseInt(sessionStorage.getItem('ID_ORGANIZADOR')),
        email: sessionStorage.getItem('EMAIL_ORGANIZADOR'),
        senha: sessionStorage.getItem('SENHA_ORGANIZADOR'),
        cnpj: sessionStorage.getItem('CNPJ_ORGANIZADOR'),
        nome_resp: sessionStorage.getItem('NOME_RESP_ORGANIZADOR'),
        cpf_resp: sessionStorage.getItem('CPF_RESP_ORGANIZADOR'),
        telefone: sessionStorage.getItem('TELEFONE_ORGANIZADOR'),
        imagemPerfil: sessionStorage.getItem('IMAGEM_PERFIL_ORGANIZADOR'),
        permissao: parseInt(sessionStorage.getItem('PERMISSAO_ORGANIZADOR')),

        // Address details
        endereco: {
            id_endereco_usuario: parseInt(sessionStorage.getItem('ID_ENDERECO_ORGANIZADOR')),
            logradouro: sessionStorage.getItem('LOGRADOURO_ORGANIZADOR'),
            numero: parseInt(sessionStorage.getItem('NUMERO_ORGANIZADOR')),
            complemento: sessionStorage.getItem('COMPLEMENTO_ORGANIZADOR'),
            cidade: sessionStorage.getItem('CIDADE_ORGANIZADOR'),
            estado: sessionStorage.getItem('ESTADO_ORGANIZADOR'),
            cep: sessionStorage.getItem('CEP_ORGANIZADOR')
        }
    };
}

// Function to load profile data into the form fields
async function carregarPerfil() {
    const dados = obterDados();

    const nomePerfil = document.getElementById('nomeUsuario');
    const telefoneCampo = document.getElementById('telefone');
    const cnpjCampo = document.getElementById('cnpj');
    const emailCampo = document.getElementById('email');

    originalData = {
        telefone: dados.telefone,
        cnpj: dados.cnpj,
        email: dados.email,
    };

    // Fill fields with session data
    nomePerfil.innerHTML = dados.nome_resp;
    telefoneCampo.value = dados.telefone;
    cnpjCampo.value = dados.cnpj;
    emailCampo.value = dados.email;
}

// Function to enable editing
function editarPerfil() {
    document.getElementById('telefone').disabled = false;
    document.getElementById('email').disabled = false;

    document.getElementById('salvar-btn').style.display = 'inline';   // Show 'Salvar'
    document.getElementById('editar-btn').style.display = 'none';     // Hide 'Editar'
}

// Function to save profile
async function salvarPerfil() {
    const dados = obterDados();
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    // Construct the data to be sent in the PATCH request
    const data = {
        id_organizador: dados.id_organizador,
        email: email,
        senha: dados.senha,
        cnpj: dados.cnpj,
        nome_resp: dados.nome_resp,
        cpf_resp: dados.cpf_resp,
        telefone: telefone,
        permissao: dados.permissao,
        endereco: {
            id_endereco_usuario: dados.endereco.id_endereco_usuario,
            logradouro: dados.endereco.logradouro,
            numero: dados.endereco.numero,
            complemento: dados.endereco.complemento,
            cidade: dados.endereco.cidade,
            estado: dados.endereco.estado,
            cep: dados.endereco.cep
        },
        imagemPerfil: dados.imagemPerfil
    };

    const url = `http://localhost:8080/organizador?id=${dados.id_organizador}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Erro no servidor:', response.status, errorMessage);
        } else {
            console.log('Perfil atualizado com sucesso!');
            sessionStorage.setItem('TELEFONE_ORGANIZADOR', telefone);
            sessionStorage.setItem('EMAIL_ORGANIZADOR', email);
            cancelarEdicao();
        }
    } catch (error) {
        console.error('Erro ao realizar o PATCH:', error.message);
    }
}

// Function to cancel the edit and disable fields
function cancelarEdicao() {
    document.getElementById('telefone').disabled = true;
    document.getElementById('email').disabled = true;

    document.getElementById('salvar-btn').style.display = 'none';     // Hide 'Salvar'
    document.getElementById('editar-btn').style.display = 'inline';   // Show 'Editar'
}

// Load profile data when the page loads
window.onload = function () {
    carregarPerfil();
};
