let originalData = {};

const idColaborador = sessionStorage.getItem('ID_COLABORADOR');
const cnpj = sessionStorage.getItem('CNPJ_COLABORADOR');
const cpfResp = sessionStorage.getItem('CPF_RESP_COLABORADOR');
const proposito = sessionStorage.getItem('PROPOSITO_COLABORADOR');
const bannerImg = sessionStorage.getItem('BANNER_IMG_COLABORADOR');
const wppComercial = sessionStorage.getItem('WPP_COMERCIAL_COLABORADOR');
const logradouro = sessionStorage.getItem('LOGRADOURO_COLABORADOR');
const numero = sessionStorage.getItem('NUMERO_COLABORADOR');
const complemento = sessionStorage.getItem('COMPLEMENTO_COLABORADOR');
const cidade = sessionStorage.getItem('CIDADE_COLABORADOR');
const estado = sessionStorage.getItem('ESTADO_COLABORADOR');
const cep = sessionStorage.getItem('CEP_COLABORADOR');
const tipoProduto = sessionStorage.getItem('TIPO_PRODUTO_COLABORADOR');
const instagram = sessionStorage.getItem('INSTAGRAM_COLABORADOR');
const facebook = sessionStorage.getItem('FACEBOOK_COLABORADOR');
const site = sessionStorage.getItem('SITE_COLABORADOR');
const senha = sessionStorage.getItem('SENHA_COLABORADOR');
const permissao = sessionStorage.getItem('PERMISSAO_COLABORADOR');
const nomeFantasia = sessionStorage.getItem('NOME_FANTASIA_COLABORADOR');
const razaoSocial = sessionStorage.getItem('RAZAO_SOCIAL_COLABORADOR');
const tipoEmpresa = sessionStorage.getItem('TIPO_EMPRESA_COLABORADOR');
const inscEstadual = sessionStorage.getItem('INSC_ESTADUAL_COLABORADOR');
const rgResp = sessionStorage.getItem('RG_RESP_COLABORADOR');
const idEndereco = sessionStorage.getItem('ID_ENDERECO_COLABORADOR');
const idMidia = sessionStorage.getItem('ID_MIDIAS_SOCIAIS_COLABORADOR');
const idProduto = sessionStorage.getItem('ID_TIPO_PRODUTO_COLABORADOR');

async function valorDados() {
    console.log("CHEGOU");

    const nomeColaborador = sessionStorage.getItem('NOME_RESP_COLABORADOR') || 'Nome do colaborador';
    const telefoneColaborador = sessionStorage.getItem('TELEFONE_COLABORADOR') || '0000000000';
    const emailColaborador = sessionStorage.getItem('EMAIL_COLABORADOR') || '@gahsjjc.com';

    const nomeColaboradorNavBar = document.getElementById('nomeDoColaborador');
    const nomeDaMarca = document.getElementById('nome');
    const telefoneDoColaborador = document.getElementById('telefone');
    const emailNavBar = document.getElementById('email');

    originalData = {
        nome: nomeColaborador,
        telefone: telefoneColaborador,
        email: emailColaborador
    };

    nomeColaboradorNavBar.innerText = nomeFantasia;
    nomeDaMarca.value = nomeColaborador;
    telefoneDoColaborador.value = telefoneColaborador;
    emailNavBar.value = emailColaborador;
}

function editarPerfil() {
    document.getElementById('nome').disabled = false;
    document.getElementById('telefone').disabled = false;
    document.getElementById('email').disabled = false;

    document.getElementById('cancelar-btn').style.display = 'inline';
    document.getElementById('salvar-btn').style.display = 'inline';
    document.getElementById('editar-btn').style.display = 'none';
}

async function salvarPerfil() {
    const nomeResp = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    const data = {
        idColaborador: parseInt(idColaborador),
        email: email,
        senha: senha,
        cnpj: cnpj,
        nomeResp: nomeResp,
        cpfResp: cpfResp,
        telefone: telefone,
        permissao: parseInt(permissao),
        nomeFantasia: nomeFantasia || "Fantasia Padrão",
        razaoSocial: razaoSocial || "Razão Social Padrão",
        tipoEmpresa: tipoEmpresa || "Tipo Empresa Padrão",
        inscEstadual: inscEstadual || "Inscrição Estadual Padrão",
        rgResp: rgResp || "RG Padrão",
        bannerImg: bannerImg,
        wppComercial: wppComercial,
        proposito: proposito,
        endereco: {
            id_endereco_usuario: idEndereco,
            logradouro: logradouro,
            numero: parseInt(numero),
            complemento: complemento,
            cidade: cidade,
            estado: estado,
            cep: cep
        },
        tipoProduto: {
            id_tipo_produto: idProduto,
            tipo: tipoProduto
        },
        midiasSociais: {
            id_midias_sociais: idMidia,
            instagram: instagram,
            facebook: facebook,
            site: site
        }
    };

    try {
        const response = await fetch(`http://localhost:8080/colaborador?id=${idColaborador}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Perfil atualizado com sucesso!');
            sessionStorage.setItem('NOME_RESP_COLABORADOR', nomeResp);
            sessionStorage.setItem('TELEFONE_COLABORADOR', telefone);
            sessionStorage.setItem('EMAIL_COLABORADOR', email);
            cancelarEdicao();
        } else {
            const errorMessage = await response.text();
            console.error('Erro no servidor:', errorMessage);
            console.log('Erro ao atualizar o perfil.');
        }
    } catch (error) {
        console.error('Erro ao realizar o PATCH:', error);
    }
}

function voltar() {
    document.getElementById('nome').value = originalData.nome;
    document.getElementById('telefone').value = originalData.telefone;
    document.getElementById('email').value = originalData.email;

    cancelarEdicao();
}

function cancelarEdicao() {
    document.getElementById('nome').disabled = true;
    document.getElementById('telefone').disabled = true;
    document.getElementById('email').disabled = true;

    document.getElementById('cancelar-btn').style.display = 'none';
    document.getElementById('salvar-btn').style.display = 'none';
    document.getElementById('editar-btn').style.display = 'inline';
}


async function buscarEventosIncricao() {
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/aprovado");
        const inscricoes = await resposta.json();

        const currentColaboradorId = sessionStorage.getItem('ID_COLABORADOR');
        if (!currentColaboradorId) {
            console.error("Colaborador ID not found in session storage.");
            return;
        }

        const today = new Date();
        const futureDate = new Date();
        futureDate.setMonth(today.getMonth() + 6);

        const filteredInscricoes = inscricoes.filter(inscricao => {
            if (!inscricao.fkUsuario || inscricao.fkUsuario.idColaborador != currentColaboradorId) return false;

            const eventDate = new Date(inscricao.evento.dataEvento);
            return eventDate >= today && eventDate <= futureDate;
        });

        if (!filteredInscricoes || filteredInscricoes.length === 0) {
            console.log("Nenhum evento futuro encontrado.");
            document.querySelector(".listagem_evento").innerHTML = "<p>Nenhum evento futuro encontrado.</p>";
            return;
        }

        const cards = document.querySelector(".listagem_evento");
        if (!cards) {
            console.error("Elemento '.listagem_evento' não encontrado!");
            return;
        }

        cards.innerHTML = '';

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        cards.innerHTML = filteredInscricoes.map(inscricao => {
            const evento = inscricao.evento;
            if (evento) {
                const eventDate = new Date(evento.dataEvento);
                const formattedDate = `${eventDate.getDate()} de ${monthNames[eventDate.getMonth()]} de ${eventDate.getFullYear()}`;

                const enderecoEvento = evento.enderecoEvento || {};
                const fullAddress = `${enderecoEvento.logradouro || 'Logradouro'}, ${enderecoEvento.numero || 'N°'} - ${enderecoEvento.cidade || 'Cidade'}`;

                const titulo = truncateText(evento.nome, 15);
                const truncatedAddress = truncateText(fullAddress, 40);
                let imagem = "../../assets/Rectangle 20.png";
                if (evento.banner_evento && evento.banner_evento !== "YmFubmVyMS5qcGc=" && evento.banner_evento !== "YmFubmVyMi5qcGc=") {
                    imagem = `data:image/png;base64,${evento.banner_evento}`;
                }

                return `
        <a href="detalhamento-evento-colaborador.html?id=${evento.id_evento}" 
           style="text-decoration:none" 
           class="card-link" 
           data-id="${evento.id_evento}">
            <div class="card_evento">
                <div class="imagem_evento">
                    <img src="${imagem}" alt="Imagem do Evento">
                </div>
                <div class="desc_evento">
                    <h5>${titulo}</h5>
                    <span>${formattedDate}</span>
                    <span>${truncatedAddress}</span>
                </div>
            </div>
        </a>`;
            }
        }).join('');

        const cardLinks = document.querySelectorAll('.card-link');
        cardLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const eventId = link.getAttribute('data-id');
                sessionStorage.setItem('currentEventId', eventId);
                window.location.href = link.getAttribute('href');
            });
        });

    } catch (error) {
        console.error('Erro ao buscar eventos futuros:', error);
        document.querySelector(".listagem_evento").innerHTML = "<p>Erro ao carregar eventos futuros. Tente novamente mais tarde.</p>";
    }
}

async function buscarEventosIncricaoPassados() {
    console.log("CHEGOU EVENTO");
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/aprovado");

        if (!resposta.ok) {
            throw new Error(`Erro no servidor: ${resposta.statusText}`);
        }

        const inscricoes = await resposta.json();

        const currentColaboradorId = sessionStorage.getItem('ID_COLABORADOR');
        if (!currentColaboradorId) {
            console.error("Colaborador ID not found in session storage.");
            return;
        }

        const today = new Date();

        const filteredInscricoes = inscricoes.filter(inscricao => {
            if (!inscricao.fkUsuario || inscricao.fkUsuario.idColaborador != currentColaboradorId) return false;

            const eventDate = new Date(inscricao.evento.dataEvento);
            return eventDate < today;
        });

        const cards = document.querySelector(".listagem_evento");
        if (!cards) {
            console.error("Elemento '.listagem_evento' não encontrado!");
            return;
        }

        cards.innerHTML = '';

        if (!filteredInscricoes || filteredInscricoes.length === 0) {
            console.log("Nenhum evento passado encontrado.");
            cards.innerHTML = "<p>Você não participou de nenhum evento no momento.</p>";
            return;
        }

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        cards.innerHTML = filteredInscricoes.map(inscricao => {
            const evento = inscricao.evento;
            if (evento) {
                const eventDate = new Date(evento.dataEvento);
                const formattedDate = `${eventDate.getDate()} de ${monthNames[eventDate.getMonth()]} de ${eventDate.getFullYear()}`;

                const enderecoEvento = evento.enderecoEvento || {};
                const fullAddress = `${enderecoEvento.logradouro || 'Logradouro'}, ${enderecoEvento.numero || 'N°'} - ${enderecoEvento.cidade || 'Cidade'}`;

                const titulo = truncateText(evento.nome, 15);
                const truncatedAddress = truncateText(fullAddress, 40);
                let imagem = "../../assets/Rectangle 20.png";
                if (evento.banner_evento && evento.banner_evento !== "YmFubmVyMS5qcGc=" && evento.banner_evento !== "YmFubmVyMi5qcGc=") {
                    imagem = `data:image/png;base64,${evento.banner_evento}`;
                }

                return `
                <a href="detalhamento-evento-colaborador.html?id=${evento.id_evento}" 
                   style="text-decoration:none" 
                   class="card-link" 
                   data-id="${evento.id_evento}">
                    <div class="card_evento">
                        <div class="imagem_evento">
                            <img src="${imagem}" alt="Imagem do Evento">
                        </div>
                        <div class="desc_evento">
                            <h5>${titulo}</h5>
                            <span>${formattedDate}</span>
                            <span>${truncatedAddress}</span>
                        </div>
                    </div>
                </a>`;
            }
        }).join('');

        const cardLinks = document.querySelectorAll('.card-link');
        cardLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const eventId = link.getAttribute('data-id');
                sessionStorage.setItem('currentEventId', eventId);
                window.location.href = link.getAttribute('href');
            });
        });

    } catch (error) {
        console.error('Erro ao buscar eventos passados:', error.message);
        document.querySelector(".listagem_evento").innerHTML = "<p>Você não participou de nenhum evento no momento.</p>";
    }
}

function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}

window.onload = function () {
    buscarEventosIncricao();
    valorDados();
};

