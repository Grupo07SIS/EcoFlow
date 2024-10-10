async function buscarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    try {
        const resposta = await fetch(`http://localhost:8080/evento/id?id=${eventId}`);
        const evento = await resposta.json();

        console.log("Resposta: ", evento);

        const eventDate = new Date(evento.dataEvento); 
        const day = eventDate.getDate();
        const month = eventDate.getMonth();
        const year = eventDate.getFullYear();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month]} de ${year}`;

        const horaInicio = new Date(evento.hora_inicio);
        const horaFim = new Date(evento.hora_fim);
        const formattedHoraInicio = horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedHoraFim = horaFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const fullAddress = `${evento.enderecoEvento.logradouro}, ${evento.enderecoEvento.numero} - ${evento.enderecoEvento.cidade}`;

        var eventoNome = document.getElementById('event_name');
        var eventoData = document.getElementById('event_date');
        var eventoLocal = document.getElementById('event_location');
        var eventoDescricao = document.getElementById('event_description');
        var eventoHorario = document.getElementById('event_time');
        eventoNome.innerHTML = evento.nome;
        eventoDescricao.innerHTML = evento.descricao;
        eventoData.innerHTML = formattedDate.toString();
        eventoLocal.innerHTML = fullAddress.toString();
        eventoHorario = `De ${formattedHoraInicio} até ${formattedHoraFim}`;
        var eventoHour = eventoHorario.toString();


        document.getElementById('event_image').src = "../../assets/Rectangle 20.png"; 

        geocode(fullAddress);
    } catch (error) {
        console.error('Erro ao buscar os detalhes do evento:', error);
    }
}


function geocode(address) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);
    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            if (data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                
                var map = L.map('map').setView([lat, lon], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                
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
