document.addEventListener('DOMContentLoaded', () => {
    buscarListaDeEspera();

    document.querySelector('.primary_btn').addEventListener('click', () => {
        applyFilters();
        closeFilter();
    });

    document.querySelector('.secondary_btn').addEventListener('click', () => {
        clearFilters();
        closeFilter();
    });
});

function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    }
}

async function buscarListaDeEspera() {
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/aguardando");
        const respostaDadosEventos = await resposta.json();

        const cards = document.getElementById("participantsContainer");
        cards.innerHTML = '';

        if (respostaDadosEventos.length === 0) {
            cards.innerHTML = "<p>Não há colaboradores participando no momento.</p>";
            return;
        }

        cards.innerHTML = respostaDadosEventos.map(itemEvento => renderParticipantAguardando(itemEvento)).join('');
        attachCardClickEvent();
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
    }
}

async function buscarListaDeEsperaReprovados() {
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/reprovado");
        const respostaDadosEventos = await resposta.json();

        const cards = document.getElementById("participantsContainer");
        cards.innerHTML = '';

        if (respostaDadosEventos.length === 0) {
            cards.innerHTML = "<p>Não há colaboradores reprovados.</p>";
            return;
        }

        cards.innerHTML = respostaDadosEventos.map(itemEvento => renderParticipant(itemEvento)).join('');
        attachCardClickEvent();
    } catch (error) {
        console.error('Erro ao buscar participantes reprovados:', error);
    }
}

async function buscarListaDeEsperaAprovados() {
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/aprovado");
        const respostaDadosEventos = await resposta.json();

        const cards = document.getElementById("participantsContainer");
        cards.innerHTML = '';

        if (respostaDadosEventos.length === 0) {
            cards.innerHTML = "<p>Não há colaboradores aprovados.</p>";
            return;
        }

        cards.innerHTML = respostaDadosEventos.map(itemEvento => renderParticipant(itemEvento)).join('');
        attachCardClickEvent();
    } catch (error) {
        console.error('Erro ao buscar participantes aprovados:', error);
    }
}

function renderParticipantAguardando(itemEvento) {
    const { fkUsuario, evento, tipo_stand, id_inscricao } = itemEvento;

    const participantName = fkUsuario?.nomeResp || "Nome não disponível";
    const participantPhone = fkUsuario?.telefone || "Telefone não disponível";
    const participantNiche = evento?.nome || "Evento não informado";
    const participantNomeFantasia = fkUsuario?.nomeFantasia || "Nome fantasia não informado";

    const valorInscricao = evento?.financeiro?.valor_inscricao ?? 0;
    const valorStand = tipo_stand?.valor ?? 0;

    const participantAmountPaid = (valorInscricao + valorStand) || "Valor não disponível";


    return `
    <div class="participante_separation_div">
    <a href="dadosColaborador.html?id=${fkUsuario.idColaborador}" class="card-link" data-id="${fkUsuario.idColaborador}">
    <div class="participante_div">
            <div class="participante_img">
                <span>${participantName}</span> <span>${participantNomeFantasia}</span>
            </div>
            <div class="participante_info">
                <p><b>Telefone:</b> ${participantPhone}</p>
                <p><b>Evento:</b> ${participantNiche}</p>
                <p><b>Valor a pagar:</b> R$ ${participantAmountPaid}</p>
            </div>
        </div>
        </a>
        <div class="separation_btns">
            <button class="btn btn-danger" onclick="atualizarStatusInscricao(${id_inscricao}, 5)">Recusar</button>
            <button class="btn btn-primary" onclick="atualizarStatusInscricao(${id_inscricao}, 4)">Aprovar</button>
        </div>
    </div>
    `;
}



function renderParticipant(itemEvento) {
    const { fkUsuario, evento, tipo_stand } = itemEvento;

    const participantName = fkUsuario?.nomeResp || "Nome não disponível";
    const participantPhone = fkUsuario?.telefone || "Telefone não disponível";
    const participantNiche = evento?.nome || "Evento não informado";
    const participantNomeFantasia = fkUsuario?.nomeFantasia || "Nome fantasia não informado";

    const valorInscricao = evento?.financeiro?.valor_inscricao ?? 0;
    const valorStand = tipo_stand?.valor ?? 0;

    const participantAmountPaid = (valorInscricao + valorStand) || "Valor não disponível";


    return `
    <a href="dadosColaborador.html?id=${fkUsuario.idColaborador}" class="card-link" data-id="${fkUsuario.idColaborador}">
    <div class="participante_separation_div">
        <div class="participante_div">
            
            <div class="participante_img">
                <span>${participantName}</span> <span>${participantNomeFantasia}</span>
            </div>
            <div class="participante_info">
                <p><b>Telefone:</b> ${participantPhone}</p>
                <p><b>Evento:</b> ${participantNiche}</p>
                <p><b>Valor pago:</b> R$ ${participantAmountPaid}</p>
            </div>
        </div>
    </div>
    </a>
    `;
}

async function atualizarStatusInscricao(idInscricao, novoStatus) {
    try {
        const getUrl = `http://localhost:8080/inscricao/buscar-por-id?id=${idInscricao}`;
        const getResponse = await fetch(getUrl);

        if (!getResponse.ok) {
            console.error('Erro ao buscar inscrição.');
            return;
        }

        const inscricao = await getResponse.json();

        inscricao.status = {
            id_Status: novoStatus,
            status: novoStatus === 2 ? 'Aprovado' : 'Reprovado'
        };

        const patchUrl = `http://localhost:8080/inscricao/update-status?id=${idInscricao}`;
        const patchResponse = await fetch(patchUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inscricao)
        });

        if (patchResponse.ok) {
            console.log('Status atualizado com sucesso!');
            buscarListaDeEspera();
        } else {
            console.error('Erro ao atualizar o status da inscrição.');
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição PATCH:', error);
    }
}



function attachCardClickEvent() {
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const collaboratorId = link.getAttribute('data-id');
            sessionStorage.setItem('currentCollaboratorId', collaboratorId);
            window.location.href = link.getAttribute('href');
        });
    });
}

function applyFilters() {
    const statusSelect = document.getElementById('statusSelect').value;

    if (statusSelect === '1') {
        buscarListaDeEspera();
    } else if (statusSelect === '2') {
        buscarListaDeEsperaReprovados();
    } else if (statusSelect === '3') {
        buscarListaDeEsperaAprovados();
    }
}

function clearFilters() {
    document.getElementById('statusSelect').value = '1';
    buscarListaDeEspera();
}

function closeFilter() {
    document.getElementById('filterMain').style.display = 'none';
}

function openFilter() {
    document.getElementById('filterMain').style.display = 'block';
}
