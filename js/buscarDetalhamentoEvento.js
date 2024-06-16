async function buscarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    try {
        const resposta = await fetch(`http://localhost:8080/eventos/id?id=${eventId}`);
        const evento = await resposta.json();

        console.log("Resposta: ", evento);

        // Extracting data
        const [year, month, day] = evento.data;
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;

        const fullAddress = `${evento.fkEndereco.logradouro}, ${evento.fkEndereco.numero} - ${evento.fkEndereco.cidade}`;

        // Updating DOM elements
        document.getElementById('event_name').textContent = evento.nome;
        document.getElementById('event_date').textContent = formattedDate;
        document.getElementById('event_location').textContent = fullAddress;
        document.getElementById('event_description').textContent = evento.descricao;

        // Update collaborator info if available
        if (evento.colaboradores && evento.colaboradores.length > 0) {
            const collaborator = evento.colaboradores[0]; // Example, assuming you want to display the first collaborator
            document.getElementById('collaborator_name').textContent = collaborator.nome;
            document.getElementById('collaborator_phone').textContent = collaborator.telefone;
            document.getElementById('collaborator_email').textContent = collaborator.email;
            document.getElementById('collaborator_niche').textContent = collaborator.nicho;
        }

        // Initialize the map
        initMap(evento.fkEndereco.latitude, evento.fkEndereco.longitude);
    } catch (error) {
        console.error('Erro ao buscar os detalhes do evento:', error);
    }
}

function initMap(lat, lng) {
    const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });
    const marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

document.addEventListener('DOMContentLoaded', buscarDetalhesEvento);
