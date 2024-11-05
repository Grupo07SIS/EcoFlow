async function buscarEventos() {
    try {
        const resposta = await fetch("http://localhost:8080/evento/futuros");
        const respostaDadosEventos = await resposta.json();

        console.log("Resposta: ", respostaDadosEventos);

        const cards = document.getElementById("cards_eventos");
        const today = new Date(); 
        const futureDate = new Date();
        futureDate.setMonth(today.getMonth() + 6); 

        const filteredEventos = respostaDadosEventos.filter((itemEvento) => {
            const eventDate = new Date(itemEvento.dataEvento);
            return eventDate >= today && eventDate <= futureDate;
        });

        cards.innerHTML = filteredEventos.map((itemEvento) => {
            const eventDate = new Date(itemEvento.dataEvento);
            const day = eventDate.getDate();
            const month = eventDate.getMonth();
            const year = eventDate.getFullYear();
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const formattedDate = `${day} de ${monthNames[month]} de ${year}`;

            const fullAddress = `${itemEvento.enderecoEvento.logradouro}, ${itemEvento.enderecoEvento.numero} - ${itemEvento.enderecoEvento.cidade}`;

            const titulo = truncateText(itemEvento.nome, 15);
            const truncatedAddress = truncateText(fullAddress, 40);

            let imagem = "../../assets/Rectangle 20.png";
            if (itemEvento.banner_evento && itemEvento.banner_evento !== "YmFubmVyMS5qcGc=" && itemEvento.banner_evento !== "YmFubmVyMi5qcGc=") {
                imagem = `data:image/png;base64,${itemEvento.banner_evento}`;
            }

            return `
            <a href="detalhamentoEvento.html?id=${itemEvento.id_evento}" class="card-link" data-id="${itemEvento.id_evento}">
                <div class="cardItem">
                    <img class="img-background" src="${imagem}" alt="">
                    <div class="titulo">
                        <span>${titulo}</span>
                    </div>
                    <div class="organizedDtas">
                        <div class="dataEvento">
                            <img src="../assets/Schedule.png" alt=""> <span>${formattedDate}</span>
                        </div>
                        <div class="dataLocal">
                            <img src="../assets/Location.png" alt=""> <span>${truncatedAddress}</span>
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

console.log("Antes de buscar");
buscarEventos();
console.log("Depois de buscar");
