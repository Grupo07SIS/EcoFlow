function editarEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');  // Get the event ID from the URL

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


        // document.getElementById('event_image').src = evento.banner_evento || "../../assets/Rectangle 20.png"; 
        document.getElementById('event_image').src = "../../assets/Rectangle 20.png";

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
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');  

    // Exibe a confirmação para o usuário antes de fazer a requisição
    const confirmed = confirm("Você realmente quer apagar este evento?");

    if (confirmed) {
        try {
            // Agora faz a requisição de deletar somente após a confirmação
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
                // Redireciona para a página de "Meus Eventos" ou mostra a mensagem de sucesso
                window.location.href = `meus-eventos.html`;
            } else {
                console.error('Erro ao marcar o evento como deletado');
                alert('Erro ao tentar deletar o evento. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição de deleção:', error);
            alert('Ocorreu um erro. Por favor, tente novamente.');
        }
    } else {
        console.log('A exclusão foi cancelada pelo usuário');
        // Se necessário, você pode adicionar lógica para desfazer outras ações aqui
    }
}


// Função para desfazer a deleção do evento
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
            buscarDetalhesEvento();  // Recarregar os detalhes do evento
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
