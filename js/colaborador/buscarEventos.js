async function buscarEventos() {
    try {
        const resposta = await fetch("http://localhost:8080/evento/futuros");
        const respostaDadosEventos = await resposta.json();

        console.log("Resposta: ", respostaDadosEventos);

        const cards = document.getElementById("cards_eventos");

        cards.innerHTML = '';

        cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
            const [year, month, day] = itemEvento.dataEvento; 
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;

            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;

            const titulo = truncateText(itemEvento.nome, 15);

            const truncatedAddress = truncateText(fullAddress, 40);
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
        console.error('Erro ao buscar eventos:', error);
    }
}

function truncateText(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'; 
    }
    return description; 
}
window.onload = buscarEventos;
