function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}


async function fetchUpcomingEvents() {
    try {
        const resposta = await fetch("http://localhost:8080/evento/futuros");
        const respostaDadosEventos = await resposta.json();
        displayEvents(respostaDadosEventos);
    } catch (error) {
        console.error('Erro ao buscar eventos futuros:', error);
    }
}

async function fetchPastEvents() {
    try {
        const resposta = await fetch("http://localhost:8080/evento/passados");
        const respostaDadosEventos = await resposta.json();
        displayEvents(respostaDadosEventos);
    } catch (error) {
        console.error('Erro ao buscar eventos passados:', error);
        const listagemEventos = document.getElementById("listagem_eventos");
        listagemEventos.innerHTML = "<p>Não foi nenhum evento que você já criou.</p>";
    }
}

function displayEvents(events) {
    const listagemEventos = document.getElementById("listagem_eventos");

    if (events.length === 0) {
        listagemEventos.innerHTML = "<p>Não há eventos cadastrados.</p>";
    } else {
        listagemEventos.innerHTML = events.map((itemEvento) => {
            const [year, month, day] = itemEvento.dataEvento;
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[parseInt(month, 10) - 1]} de ${year}`;
            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}, ${itemEvento.enderecoEvento.estado}`;

            const titulo = truncateText(itemEvento.nome, 15);
            const truncatedAddress = truncateText(fullAddress, 40);

            return `
            <a href="detalhamentoEvento.html?id=${itemEvento.id_evento}" class="card-link" data-id="${itemEvento.id_evento}">
                <div class="card_evento">
                    <div class="imagem_evento">
                        <img src="../assets/listagem_evento.png" alt="Imagem do Evento">
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
}

async function buscarEventosFiltrados(dataInicio, dataFim) {
    try {
        const url = new URL("http://localhost:8080/evento/search");
        if (dataFim) {
            url.searchParams.append('dataAntes',dataFim);
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
        cards.innerHTML = '';  // Clear current cards

        if (searchResults.length === 0) {
            cards.innerHTML = '<p>Nenhum evento encontrado com os critérios selecionados.</p>';
            return;
        }

        cards.innerHTML = searchResults.map((itemEvento) => {
            const [year, month, day] = itemEvento.dataEvento // Split date string
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month - 1]} de ${year}`;

            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;
            const titulo = truncateText(itemEvento.nome, 15);
            const truncatedAddress = truncateText(fullAddress, 40);

            return `
            <a href="detalhamentoEvento.html?id=${itemEvento.id_evento}" 
               style="text-decoration:none" 
               class="card-link" 
               data-id="${itemEvento.id_evento}">
                <div class="card_evento">
                    <div class="imagem_evento">
                        <img src="../assets/listagem_evento.png" alt="Imagem do Evento">
                    </div>
                    <div class="desc_evento">
                        <h5>${titulo}</h5>
                        <span>${formattedDate}</span>
                        <span>${truncatedAddress}</span>
                    </div>
                </div>
            </a>
            `;
        }).join('');  // Join the mapped items into a single string

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
        console.error('Erro ao buscar eventos filtrados:', error);
        alert("Erro ao buscar eventos filtrados.");
    }
}


function filtrarEventos(tipo) {
    console.log('Filtrar eventos:', tipo); 
    if (tipo === 'upcoming') {
        fetchUpcomingEvents();
    } else if (tipo === 'past') {
        fetchPastEvents();
    }
}

function applyFilters() {
    const startDate = document.querySelector('#dataInicio').value;
    const endDate = document.querySelector('#dataFim').value;

    buscarEventosFiltrados(startDate, endDate);  

    const offcanvasElement = document.getElementById('offcanvasBottom');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();  
    }
}


function clearFilters() {
    document.querySelector('#dataInicio').value = '';
    document.querySelector('#dataFim').value = '';

    fetchUpcomingEvents();  

    const offcanvasElement = document.getElementById('offcanvasBottom');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide(); 
    }
}



window.onload = () => {
    fetchUpcomingEvents(); 
};
