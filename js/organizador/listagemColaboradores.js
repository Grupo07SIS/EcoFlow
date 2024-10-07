async function fetchCollaborators() {
    try {
        const response = await fetch("http://localhost:8080/usuarios/userPermission?permission=2");
        const collaboratorsData = await response.json();
        console.log(collaboratorsData); 
        displayCollaborators(collaboratorsData);
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
            const image = collab.imagemLogo ? `data:image/png;base64,${collab.imagemLogo}` : '../assets/default-image.png';

            // Check if fkDados exists before trying to access its properties
            if (!collab.fkDados) {
                return `
                    <div class="orgs">
                        <img class="photo0" src="${image}" />
                        <div class="allCards">
                            <div class="cards1">
                                <span><b>Email:</b> ${email}</span>
                                <span><b>Nicho:</b> Nicho não informado</span>
                            </div>
                        </div>
                        <h3 class="ver_mais" onclick="viewDetails(${collab.idUsuario})">Ver mais >></h3>
                    </div>
                `;
            }

            const { nomeFantasia, telefone } = collab.fkDados;
            const niche = collab.fkDados.fkTipoProducao ? collab.fkDados.fkTipoProducao.tipo : 'Nicho não informado';

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
                    <h3 class="ver_mais" onclick="viewDetails(${collab.idUsuario})">Ver mais >></h3>
                </div>
            `;
        }).join('');
    }
}

function viewDetails(id) {
    localStorage.setItem('selectedCollaboratorId', id);
    window.location.href = 'dadosColaborador.html';
}

window.onload = () => {
    fetchCollaborators(); 
};
