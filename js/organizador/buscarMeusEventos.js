async function fetchUpcomingEvents() {
    try {
        const resposta = await fetch("http://localhost:8080/evento");
        const respostaDadosEventos = await resposta.json();
        displayEvents(respostaDadosEventos);
    } catch (error) {
        console.error('Erro ao buscar eventos futuros:', error);
    }
}

async function fetchPastEvents() {
    try {
        const resposta = await fetch("http://localhost:8080/eventos/eventsBefore");
        const respostaDadosEventos = await resposta.json();
        displayEvents(respostaDadosEventos);
    } catch (error) {
        console.error('Erro ao buscar eventos passados:', error);
    }
}

function displayEvents(events) {
    const listagemEventos = document.getElementById("listagem_eventos");

    if (events.length === 0) {
        listagemEventos.innerHTML = "<p>Não há eventos cadastrados.</p>";
    } else {
        listagemEventos.innerHTML = events.map((itemEvento) => {
            const [year, month, day] = itemEvento.data;
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[parseInt(month, 10) - 1]} de ${year}`;
            const fullAddress = `${itemEvento.fkEndereco.logradouro}, ${itemEvento.fkEndereco.numero} - ${itemEvento.fkEndereco.cidade}, ${itemEvento.fkEndereco.estado}`;

            return `
            <a href="detalhamentoEvento.html?id=${itemEvento.idEvento}" class="card-link" data-id="${itemEvento.idEvento}">
                <div class="card_evento">
                    <div class="imagem_evento">
                        <img src="../assets/listagem_evento.png" alt="Imagem do Evento">
                    </div>
                    <div class="desc_evento">
                        <h5>${itemEvento.nome}</h5>
                        <span>${formattedDate}</span>
                        <span>${fullAddress}</span>
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

function filtrarEventos(tipo) {
    console.log('Filtrar eventos:', tipo); 
    if (tipo === 'upcoming') {
        fetchUpcomingEvents();
    } else if (tipo === 'past') {
        fetchPastEvents();
    }
}

window.onload = () => {
    fetchUpcomingEvents(); 
};
