async function buscarEventos() {
    try {
        const resposta = await fetch("http://localhost:8080/evento");
        const respostaDadosEventos = await resposta.json();

        console.log("Resposta: ", respostaDadosEventos);

        const cards = document.getElementById("cards-eventos");

        cards.innerHTML = '';

        cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
            const [year, month, day] = itemEvento.dataEvento; 
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;

            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;

            const titulo = truncateText(itemEvento.nome, 15);

            const truncatedAddress = truncateText(fullAddress, 40);

            // Properly wrap the returned HTML inside backticks
            return `
            <a href="detalhamento-evento-colaborador.html?id=${itemEvento.id_evento}" style="text-decoration:none a:hover:none" class="card-link" data-id="${itemEvento.id_evento}">
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
        }).join(''); // Don't forget to join the mapped items into a string

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

console.log("Antes de buscar");
buscarEventos();
console.log("Depois de buscar");
