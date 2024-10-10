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
            <a href="detalhamento-evento-colaborador.html?id=${itemEvento.id_evento}" 
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

async function buscarEventos() {
    try {
        const resposta = await fetch("http://localhost:8080/evento");
        const respostaDadosEventos = await resposta.json();
        console.log("Resposta: ", respostaDadosEventos);

        const cards = document.getElementById("listagem_eventos");
        cards.innerHTML = '';  // Clear current events

        cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
            const [year, month, day] = itemEvento.dataEvento; // Ensure correct date parsing
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;

            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;
            const titulo = truncateText(itemEvento.nome, 15);
            const truncatedAddress = truncateText(fullAddress, 40);

            return `
            <a href="detalhamento-evento-colaborador.html?id=${itemEvento.id_evento}" 
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
        }).join('');  // Join the mapped items into a string

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
        console.error('Erro ao buscar eventos:', error);
    }
}

// Function to apply the filters when "Apply Filter" button is clicked
function applyFilters() {
    const startDate = document.querySelector('#dataInicio').value;
    const endDate = document.querySelector('#dataFim').value;

    buscarEventosFiltrados(startDate, endDate);  // Corrected call
}

// Function to clear the filters and fetch all events when "Clear Filter" button is clicked
function clearFilters() {
    document.querySelector('#dataInicio').value = '';
    document.querySelector('#dataFim').value = '';

    buscarEventos();  // Call function to fetch all events when filters are cleared
}


// Initially fetch all events on page load
console.log("Antes de buscar");
buscarEventos();
console.log("Depois de buscar");
