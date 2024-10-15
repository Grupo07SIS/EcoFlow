async function buscarEventos() {
    try {
        // Fetch upcoming events from the backend
        const resposta = await fetch("http://localhost:8080/evento/futuros");
        const respostaDadosEventos = await resposta.json();

        console.log("Resposta: ", respostaDadosEventos);

        // Select the container where event cards will be displayed
        const cards = document.getElementById("cards_eventos");

        // Clear existing card items
        cards.innerHTML = '';

        // Generate card items for each event
        cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
            // The `dataEvento` is an array: [year, month, day]
            const [year, month, day] = itemEvento.dataEvento; 
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;

            // The address information is inside `enderecoEvento`
            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;

            // Truncate long addresses for display
            const titulo = truncateText(itemEvento.nome, 15);

            const truncatedAddress = truncateText(fullAddress, 40);
            // Generate each card dynamically with event data
            return `
            <a href="detalhamento-evento-colaborador.html?id=${itemEvento.id_evento}" class="card-link" data-id="${itemEvento.id_evento}">
                <div class="cardItem">
                    <div class="dataCalendarioEvento">
                        <span>${monthNames[month - 1]} ${day}</span>
                    </div>
                    <img class="img-background" src="../../assets/Mask Group.png" alt="Imagem do Evento">
                    <div class="titulo"  style="width:100%">
                        <span>${titulo}</span>
                    </div>
                    <div class="organizedDtas">
                        <div class="dataEvento">
                            <img src="../../assets/Schedule.png" alt=""> 
                            <span>${formattedDate}</span>
                        </div>
                        <div class="dataLocal">
                            <img src="../../assets/Location.png" alt=""> 
                            <span>${truncatedAddress}</span>
                        </div>
                    </div>
                </div>
            </a>
            `;
        }).join(''); // Join the array of HTML strings

        // Add click event listeners to each generated card link
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

function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'; 
    }
    return description; 
}

// Call buscarEventos on page load
window.onload = buscarEventos;
