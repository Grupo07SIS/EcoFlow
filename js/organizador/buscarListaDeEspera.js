document.addEventListener('DOMContentLoaded', () => {
    buscarListaDeEspera(); 

    // Apply filters on "Aplicar Filtro" button click
    document.querySelector('.primary_btn').addEventListener('click', () => {
        applyFilters();
        closeFilter(); 
    });

    // Clear filters on "Limpar Filtro" button click
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

// Fetch and render participants "Aguardando"
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

        // Render participants and attach click event listeners
        cards.innerHTML = respostaDadosEventos.map(itemEvento => renderParticipantAguardando(itemEvento)).join('');
        attachCardClickEvent();  // Attach event listeners after rendering cards
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
    }
}

// Fetch and render participants "Reprovados"
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
        attachCardClickEvent();  // Attach event listeners after rendering cards
    } catch (error) {
        console.error('Erro ao buscar participantes reprovados:', error);
    }
}

// Fetch and render participants "Aprovados"
async function buscarListaDeEsperaAprovados() {
    try {
        const resposta = await fetch("http://localhost:8080/inscricao/futuro");
        const respostaDadosEventos = await resposta.json();

        const cards = document.getElementById("participantsContainer");
        cards.innerHTML = '';

        if (respostaDadosEventos.length === 0) {
            cards.innerHTML = "<p>Não há colaboradores aprovados.</p>";
            return;
        }

        cards.innerHTML = respostaDadosEventos.map(itemEvento => renderParticipant(itemEvento)).join('');
        attachCardClickEvent();  // Attach event listeners after rendering cards
    } catch (error) {
        console.error('Erro ao buscar participantes aprovados:', error);
    }
}

// Render participants waiting for approval
function renderParticipantAguardando(itemEvento) {
    const { fkUsuario, evento } = itemEvento;
    const participantName = fkUsuario?.nomeResp || "Nome não disponível";
    const participantPhone = fkUsuario?.telefone || "Telefone não disponível";
    const participantNiche = evento?.nome || "Evento não informado";
    const participantAmountPaid = evento?.financeiro?.valor_inscricao || "Valor não disponível";
    const participantImgSrc = fkUsuario?.bannerImg ? `data:image/png;base64,${fkUsuario.bannerImg}` : "../assets/default-image.png";
    const titulo = truncateText(participantNiche, 15);

    return `
    <a href="dadosColaborador.html?id=${fkUsuario.idColaborador}" class="card-link" data-id="${fkUsuario.idColaborador}">
    <div class="participante_separation_div">
        <div class="participante_div">
            <div class="participante_img">
                <img src="${participantImgSrc}" alt="Imagem do participante">
            </div>
            <div class="participante_info">
                <span>${participantName}</span>
                <p><b>Telefone:</b> ${participantPhone}</p>
                <p><b>Evento:</b> ${titulo}</p>
                <p><b>Valor a pagar:</b> R$ ${participantAmountPaid}</p>
            </div>
        </div>
        <div class="separation_btns">
            <button class="btn btn-danger">Recusar</button>
            <button class="btn btn-primary">Aprovar</button>
        </div>
    </div>
    </a>
    `;
}

// Generic participant card rendering for "Reprovados" and "Aprovados"
function renderParticipant(itemEvento) {
    const { fkUsuario, evento } = itemEvento;
    const participantName = fkUsuario?.nomeResp || "Nome não disponível";
    const participantPhone = fkUsuario?.telefone || "Telefone não disponível";
    const participantNiche = evento?.nome || "Evento não informado";
    const participantAmountPaid = evento?.financeiro?.valor_inscricao || "Valor não disponível";
    const participantImgSrc = fkUsuario?.bannerImg ? `data:image/png;base64,${fkUsuario.bannerImg}` : "../assets/default-image.png";
    const titulo = truncateText(participantNiche, 15);

    return `
    <a href="dadosColaborador.html?id=${fkUsuario.idColaborador}" class="card-link" data-id="${fkUsuario.idColaborador}">
    <div class="participante_separation_div">
        <div class="participante_div">
            <div class="participante_img">
                <img src="${participantImgSrc}" alt="Imagem do participante">
            </div>
            <div class="participante_info">
                <span>${participantName}</span>
                <p><b>Telefone:</b> ${participantPhone}</p>
                <p><b>Evento:</b> ${titulo}</p>
                <p><b>Valor pago:</b> R$ ${participantAmountPaid}</p>
            </div>
        </div>
    </div>
    </a>
    `;
}

// Attach click event listeners to the rendered cards
function attachCardClickEvent() {
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const collaboratorId = link.getAttribute('data-id');
            sessionStorage.setItem('currentCollaboratorId', collaboratorId); // Store collaborator ID in session storage
            window.location.href = link.getAttribute('href'); // Navigate to the next page
        });
    });
}

// Apply selected filter based on user input
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

// Clear filters and reset to default state
function clearFilters() {
    document.getElementById('statusSelect').value = '1'; 
    buscarListaDeEspera(); 
}

// Close the filter panel
function closeFilter() {
    document.getElementById('filterMain').style.display = 'none'; 
}

// Open the filter panel
function openFilter() {
    document.getElementById('filterMain').style.display = 'block'; 
}
