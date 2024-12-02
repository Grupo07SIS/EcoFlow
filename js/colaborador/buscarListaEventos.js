function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}

async function buscarEventosFiltrados(dataInicio, dataFim) {
    try {
        const url = new URL("http://localhost:8080/evento/search");
        if (dataFim) {
            url.searchParams.append('dataAntes', dataFim);
        }
        if (dataInicio) {
            url.searchParams.append('dataDepois', dataInicio);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const searchResults = await response.json();
        const cards = document.getElementById("listagem_eventos");
        cards.innerHTML = '';

        if (searchResults.length === 0) {
            cards.innerHTML = '<p>Nenhum evento encontrado com os critérios selecionados.</p>';
            return;
        }

        const today = new Date();
        const filteredEvents = searchResults.filter((itemEvento) => {
            const eventDate = new Date(itemEvento.dataEvento);
            const startDate = dataInicio ? new Date(dataInicio) : today;
            const endDate = dataFim ? new Date(dataFim) : null;
            return eventDate >= startDate && (!endDate || eventDate <= endDate);
        });

        renderEventCards(filteredEvents, cards);
    } catch (error) {
        console.error('Erro ao buscar eventos filtrados:', error);
        alert("Erro ao buscar eventos filtrados.");
    }
}

async function buscarEventos() {
    try {
        const resposta = await fetch("http://localhost:8080/evento/futuros");
        const respostaDadosEventos = await resposta.json();
        console.log("Resposta: ", respostaDadosEventos);

        const cards = document.getElementById("listagem_eventos");
        cards.innerHTML = '';

        const today = new Date();
        const futureDate = new Date();
        futureDate.setMonth(today.getMonth() + 6);

        const filteredEvents = respostaDadosEventos.filter((itemEvento) => {
            const eventDate = new Date(itemEvento.dataEvento);
            return eventDate >= today && eventDate <= futureDate;
        });

        renderEventCards(filteredEvents, cards);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
    }
}

function renderEventCards(events, container) {
    container.innerHTML = events.map((itemEvento) => {
        const eventDate = new Date(itemEvento.dataEvento);
        const day = eventDate.getDate();
        const month = eventDate.getMonth();
        const year = eventDate.getFullYear();

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month]} de ${year}`;

        const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;
        const titulo = truncateText(itemEvento.nome, 15);
        const truncatedAddress = truncateText(fullAddress, 40);
        let imagem = "../../assets/sem_imagem.jfif";
        if (itemEvento.banner_evento && itemEvento.banner_evento !== "YmFubmVyMS5qcGc=" && itemEvento.banner_evento !== "YmFubmVyMi5qcGc=") {
            imagem = `data:image/png;base64,${itemEvento.banner_evento}`;
        }

        return `
        <a href="detalhamento-evento-colaborador.html?id=${itemEvento.id_evento}" 
           style="text-decoration:none" 
           class="card-link" 
           data-id="${itemEvento.id_evento}">
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
        </a>
        `;
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
}

function applyFilters() {
    const startDate = document.querySelector('#dataInicio').value;
    const endDate = document.querySelector('#dataFim').value;

    buscarEventosFiltrados(startDate, endDate); 
}

function clearFilters() {
    document.querySelector('#dataInicio').value = '';
    document.querySelector('#dataFim').value = '';

    buscarEventos(); 
}

console.log("Antes de buscar");
buscarEventos();
console.log("Depois de buscar");
