async function buscarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    try {
        const resposta = await fetch(`http://localhost:8080/eventos/${eventId}`);
        const evento = await resposta.json();

        console.log("Resposta: ", evento);

        // Extracting data
        const [year, month, day] = evento.data;
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month - 1]} de ${year}`;

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

        geocode(fullAddress);
    } catch (error) {
        console.error('Erro ao buscar os detalhes do evento:', error);
    }
}

function geocode(address) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                // Initialize Leaflet map
                var map = L.map('map').setView([lat, lon], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Add a marker to the map
                var marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup("Localização encontrada: " + address).openPopup();
            } else {
                alert('Endereço não encontrado');
            }
        })
        .catch(error => {
            alert('Erro ao buscar o endereço');
            console.error(error);
        });
}


window.onload = buscarDetalhesEvento;