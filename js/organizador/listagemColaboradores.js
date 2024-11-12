window.onload = () => {
    const nicho = getNichoFromUrl();
    console.log("Nicho recebido: ", nicho);
    if (nicho) {
        fetchCollaboratorsByNiche(`/${nicho}/fila`);
    } else {
        console.error("Nenhum nicho foi encontrado na URL.");
    }
};

function getNichoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('nicho');
}

async function fetchCollaboratorsByNiche(endpoint) {
    try {
        const response = await fetch(`http://localhost:8080${endpoint}`);
        const collaboratorsData = await response.json();
        displayCollaborators(collaboratorsData);
        console.log('Colaboradores:', collaboratorsData);
    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
    }
}

function displayCollaborators(collaborators) {
    const container = document.getElementById("collaboratorContainer");

    if (collaborators.length === 0) {
        container.innerHTML = "<p>Não há colaboradores cadastrados.</p>";
    } else {
        container.innerHTML = collaborators.map((collab) => {
            const email = collab.email;
            const image = collab.bannerImg ? `data:image/png;base64,${collab.bannerImg}` : '../assets/default-image.png';
            const niche = getNichoFromUrl();
            const nomeFantasia = collab.nomeFantasia;
            const telefone = collab.telefone;

            return `
                <div class="orgs">
                    <img class="photo0" src="${image}" />
                    <div class="allCards">
                        <div class="cards1">
                            <span><b>Nome da Marca:</b> ${nomeFantasia}</span>
                            <span><b>Telefone:</b> ${telefone}</span>
                            <span><b>Email:</b> ${email}</span>
                            <span><b>Nicho:</b> ${niche}</span>
                        </div>
                    </div>
                    <a href="dadosColaborador.html?id=${collab.idColaborador}"> ver_mais </a>
                </div>
            `;
        }).join('');
    }
}


