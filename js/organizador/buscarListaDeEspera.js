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
        const resposta = await fetch("http://localhost:8080/inscricao/aprovado");
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
    const { fkUsuario, evento, tipo_stand, id_inscricao } = itemEvento;

    const participantName = fkUsuario?.nomeResp || "Nome não disponível";
    const participantPhone = fkUsuario?.telefone || "Telefone não disponível";
    const participantNiche = evento?.nome || "Evento não informado";

    // Pegando o valor da inscrição e do stand corretamente
    const valorInscricao = evento?.financeiro?.valor_inscricao ?? 0;
    const valorStand = tipo_stand?.valor ?? 0;

    // Soma dos valores da inscrição e do stand
    const participantAmountPaid = (valorInscricao + valorStand) || "Valor não disponível";

    const participantImgSrc = fkUsuario?.bannerImg ? `data:image/png;base64,${fkUsuario.bannerImg}` : "../assets/default-image.png";

    return `
    <div class="participante_separation_div">
    <a href="dadosColaborador.html?id=${fkUsuario.idColaborador}" class="card-link" data-id="${fkUsuario.idColaborador}">
    <div class="participante_div">
            <div class="participante_img">
                <img src="${participantImgSrc}" alt="Imagem do participante">
            </div>
            <div class="participante_info">
                <span>${participantName}</span>
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

    const valorInscricao = evento?.financeiro?.valor_inscricao ?? 0;
    const valorStand = tipo_stand?.valor ?? 0; 

    const participantAmountPaid = (valorInscricao + valorStand) || "Valor não disponível";

    const participantImgSrc = fkUsuario?.bannerImg ? `data:image/png;base64,${fkUsuario.bannerImg}` : "../assets/default-image.png";

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
                <p><b>Evento:</b> ${participantNiche}</p>
                <p><b>Valor pago:</b> R$ ${participantAmountPaid}</p>
            </div>
        </div>
    </div>
    </a>
    `;
}

// Função para atualizar o status da inscrição
async function atualizarStatusInscricao(idInscricao, novoStatus) {
    try {
      // Passo 1: Buscar a inscrição pelo ID
      const getUrl = `http://localhost:8080/inscricao/buscar-por-id?id=${idInscricao}`;
      const getResponse = await fetch(getUrl);
  
      if (!getResponse.ok) {
        console.error('Erro ao buscar inscrição.');
        return;
      }
  
      // Obter os dados da inscrição
      const inscricao = await getResponse.json();
  
      // Passo 2: Atualizar o status
      inscricao.status = {
        id_Status: novoStatus, // 4 para "aprovado", 5 para "reprovado"
        status: novoStatus === 4 ? 'aprovado' : 'reprovado'
      };
  
      // Passo 3: Fazer o PATCH com os dados atualizados
      const patchUrl = `http://localhost:8080/inscricao/update-status?id=${idInscricao}`;
      const patchResponse = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscricao)
      });
  
      if (patchResponse.ok) {
        console.log('Status atualizado com sucesso!');
        // Atualiza a lista para refletir as mudanças
        buscarListaDeEspera();
      } else {
        console.error('Erro ao atualizar o status da inscrição.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição PATCH:', error);
    }
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
