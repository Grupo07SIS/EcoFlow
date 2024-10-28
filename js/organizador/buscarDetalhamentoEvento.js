function editarEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');  

    if (eventId) {
        window.location.href = `evento-update.html?id=${eventId}`;
    } else {
        console.error('No Event ID found');
    }
}

async function buscarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    console.log('Evento ID:', eventId);

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
        console.log(eventoHorario);


        document.getElementById('event_image').src = evento.banner_evento || "../../assets/Rectangle 20.png"; 
        // document.getElementById('event_image').src = "../../assets/Rectangle 20.png";

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

async function deletarEvento() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popup-message').innerText = "Você realmente quer apagar este evento?";

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    document.getElementById('confirm').onclick = async function () {
        try {
            const eventDeleteUrl = `http://localhost:8080/evento?id=${eventId}`;
            const response = await fetch(eventDeleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deletado: true })
            });

            if (response.ok) {
                console.log('Evento deletado com sucesso');
                window.location.href = `meus-eventos.html`;
            } else {
                console.error('Erro ao marcar o evento como deletado');
                document.getElementById('popup-message').innerText = 'Erro ao tentar deletar o evento. Por favor, tente novamente.';
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição de deleção:', error);
            document.getElementById('popup-message').innerText = 'Ocorreu um erro. Por favor, tente novamente.';
        }
    };

    document.getElementById('cancel').onclick = function () {
        document.getElementById('popup').style.display = 'none';
        console.log('A exclusão foi cancelada pelo usuário');
    };
}



async function desfazerDelecao(eventId) {
    try {
        const undoDeleteUrl = `http://localhost:8080/evento/desfazer`;
        const response = await fetch(undoDeleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_evento: eventId, deletado: false })
        });

        if (response.ok) {
            alert('Deleção cancelada.');
            buscarDetalhesEvento();  
        } else {
            console.error('Erro ao desfazer a exclusão do evento');
            alert('Erro ao desfazer a exclusão. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição de desfazer deleção:', error);
        alert('Erro ao desfazer a exclusão. Por favor, tente novamente.');
    }
}

window.onload = buscarDetalhesEvento();
