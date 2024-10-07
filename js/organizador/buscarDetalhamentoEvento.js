async function buscarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = sessionStorage.getItem('eventoID') || urlParams.get('id');

    try {
        // Fetch the event details using the provided event ID
        const resposta = await fetch(`http://localhost:8080/evento/id?id=${eventId}`);
        const evento = await resposta.json();

        console.log("Resposta: ", evento);

        // Format the event date
        const eventDate = new Date(evento.dataEvento); 
        const day = eventDate.getDate();
        const month = eventDate.getMonth();
        const year = eventDate.getFullYear();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month]} de ${year}`;

        // Format start and end time
        const horaInicio = new Date(evento.hora_inicio);
        const horaFim = new Date(evento.hora_fim);
        const formattedHoraInicio = horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedHoraFim = horaFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Build the full address
        const fullAddress = `${evento.enderecoEvento.logradouro}, ${evento.enderecoEvento.numero} - ${evento.enderecoEvento.cidade}`;

        console.log("Endereço completo: ", fullAddress);

        // Updating DOM elements
        document.getElementById('event_name').textContent = evento.nome;
        document.getElementById('event_date').textContent = formattedDate;
        document.getElementById('event_location').textContent = fullAddress;
        document.getElementById('event_description').textContent = evento.descricao;
        document.getElementById('event_time').textContent = `De ${formattedHoraInicio} até ${formattedHoraFim}`;

        // Handle event banner image
        document.getElementById('event_image').src = evento.banner_evento || "../../assets/Rectangle 20.png"; 

        // Geocode the address and display the map
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
