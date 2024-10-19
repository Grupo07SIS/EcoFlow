async function cadastrarEvento() {
    var dadosEventoJson = sessionStorage.getItem('dadosEvento')
    var dadosEvento = JSON.parse(dadosEventoJson);
    var {
        nomeEvento,
        temaEvento,
        dataEvento,
        capacidadeMax,
        descricaoEvento,
        logradouro,
        numero,
        cep,
        complemento,
        cidade,
        estado,
        orcamentoTotal,
        metaLucro,
        aluguelLocal,
        valorInfra,
        valorInscricao,
        valorFuncionarios,
        qtdMaxColaboradores
    } = dadosEvento;

    console.log(dadosEvento);

    const evento = {
        "nome": nomeEvento,
        "tema": temaEvento,
        "descricao": descricaoEvento,
        "capacidadeMax": 10,
        "fkFinanceiro": {
            "idFinanceiro": 2,
            "orcamentoTotal": 100,
            "aluguelLocal": 100,
            "valorFuncionario": 100,
            "valorInfra": 100,
            "ticketMedio": 100.0,
            "valorInscricao": 100,
            "qtdMaxColaboradores": 10,
            "gastoTotal": 500.0
        },
        "fkEndereco": {
            "idEnderecoEvento": 2,
            "cep": "03132090",
            "logradouro": "Rua Imbituba",
            "numero": "140",
            "complemento": "NA",
            "cidade": "Sao Paulo",
            "estado": "SP"
        },
        "data": dataEvento
    }
    console.log(evento)
    const respostaCadastro = await fetch("http://localhost:8080/evento", {
        method: "POST",
        body: JSON.stringify(evento),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');

    if (respostaCadastro.status == 201) {
        console.log("Cadastrado")
        popupMessage.textContent = "Evento criado com sucesso!";
        popup.style.backgroundColor = "green";
    }
    else {
        console.error('Erro ao cadastrar o evento:', respostaCadastro.status);
        popupMessage.textContent = "Erro ao cadastrar o evento.";
        popup.style.backgroundColor = "red";
    }
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
        if (respostaCadastro.status === 201) {
            window.location.href = 'index.html';
        }
    }, 3000);
}


async function buscarDados() {
    const eventId = sessionStorage.getItem('currentEventId');

    try {
        const resposta = await fetch(`http://localhost:8080/evento/id?id=${eventId}`);
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

        geocode(fullAddress);
        sessionStorage.setItem('dadosGetEvento', JSON.stringify(evento));
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

async function alterarEvento() {
    const eventId = sessionStorage.getItem('currentEventId');
    var dadosEventoJson = sessionStorage.getItem('dadosEventoUpdate');
    var dadosEvento = JSON.parse(dadosEventoJson);

    var {
        nomeEvento,
        temaEvento,
        dataEvento,
        capacidadeMax,
        descricaoEvento,
        logradouro,
        numero,
        cep,
        complemento,
        cidade,
        estado,
        orcamentoTotal,
        metaLucro,
        aluguelLocal,
        valorInfra,
        valorInscricao,
        valorFuncionarios,
        qtdMaxColaboradores
    } = dadosEvento;

    console.log(dadosEvento);

    const evento = {
        "nome": nomeEvento,
        "tema": temaEvento,
        "descricao": descricaoEvento,
        "capacidadeMax": capacidadeMax,
        "fkFinanceiro": {
            "idFinanceiro": 1,
            "orcamentoTotal": orcamentoTotal,
            "aluguelLocal": aluguelLocal,
            "valorFuncionario": valorFuncionarios,
            "valorInfra": valorInfra,
            "ticketMedio": 100.0,
            "valorInscricao": valorInscricao,
            "qtdMaxColaboradores": qtdMaxColaboradores,
            "gastoTotal": 500.0
        },
        "fkEndereco": {
            "idEnderecoEvento": 1,
            "cep": cep,
            "logradouro": logradouro,
            "numero": numero,
            "complemento": complemento,
            "cidade": cidade,
            "estado": estado
        },
        "data": dataEvento
    };

    try {
        const respostaCadastro = await fetch(`http://localhost:8080/evento/update?id=${eventId}`, {
            method: "PATCH",
            body: JSON.stringify(evento),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');

        if (respostaCadastro.status === 200) {
            console.log("Alterado com sucesso");

            // Update popup message for success
            popupMessage.textContent = "Evento alterado com sucesso!";
            popup.style.backgroundColor = "green";
        } else {
            console.error('Erro ao alterar o evento:', respostaCadastro.status);

            // Update popup message for error
            popupMessage.textContent = "Erro ao alterar o evento.";
            popup.style.backgroundColor = "red";
        }

        // Show popup
        popup.classList.add('show');

        // Hide popup after 3 seconds and redirect to index.html on success
        setTimeout(() => {
            popup.classList.remove('show');
            if (respostaCadastro.status === 200) {
                window.location.href = 'index.html';
            }
        }, 3000);

    } catch (error) {
        console.error('Erro na requisição:', error);

        // Update popup message for exception
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = "Erro na requisição.";
        popup.style.backgroundColor = "red";
        popup.classList.add('show');

        // Hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
}


async function deletarEvento() {
    const eventId = sessionStorage.getItem('currentEventId');
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "User-Agent": "insomnia/8.6.1"
    };

    try {
        const deletar = await fetch(`http://localhost:8080/evento?id=${eventId}`, {
            method: "DELETE",
            headers: headers
        });

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');

        if (deletar.status === 204) {
            console.log("Evento excluído com sucesso!");

            // Update popup message for success
            popupMessage.textContent = "Evento excluído com sucesso!";
            popup.style.backgroundColor = "green";
        } else if (deletar.status === 404) {
            console.error("Evento não encontrado:", deletar.status);

            // Update popup message for error
            popupMessage.textContent = "EEvento excluído com sucesso!";
            popup.style.backgroundColor = "green";
        } else if (deletar.status === 500) {
            console.error("Erro ao excluir evento:", deletar.status);

            // Update popup message for error
            popupMessage.textContent = "Erro ao excluir o evento.";
            popup.style.backgroundColor = "red";
        }

        // Show popup
        popup.classList.add('show');

        // Hide popup after 3 seconds and redirect on success
        setTimeout(() => {
            popup.classList.remove('show');
            if (deletar.status === 204) {
                window.location.href = 'meus-eventos.html';
            }
        }, 3000);

    } catch (error) {
        console.error('Erro na requisição:', error);

        // Update popup message for exception
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = "Erro na requisição.";
        popup.style.backgroundColor = "red";
        popup.classList.add('show');

        // Hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
}
