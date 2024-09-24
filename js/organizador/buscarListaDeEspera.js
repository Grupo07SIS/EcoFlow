async function buscarListaDeEspera() {
    try {
        const resposta = await fetch("http://localhost:8080/subscription/waiting");
        const respostaDadosEventos = await resposta.json();

        console.log("Resposta Dados Eventos: ", respostaDadosEventos);

        const cards = document.getElementById("participantsContainer");

        // Clear the container before adding new content
        cards.innerHTML = '';

        // Map over the returned data and generate the HTML for each participant
        cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
            // Log the itemEvento to check its structure
            console.log("Item Evento:", itemEvento);
            console.log("fkDados:", itemEvento.fkUsuario?.fkDados); // Adjusted to check for nested fkDados

            // Correct destructuring
            const { fkUsuario, fkEvento } = itemEvento;
            const fkDados = fkUsuario?.fkDados; // Extract fkDados from fkUsuario

            // Participant info
            const participantName = fkUsuario?.nomeResp || "Nome não disponível";
            const participantPhone = fkDados?.telefone || "Telefone não disponível";
            const participantNiche = fkEvento?.nome || "Evento não informado";
            const participantAmountPaid = fkEvento?.fkFinanceiro?.valorInscricao || "Valor não disponível";
            const participantImgSrc = fkUsuario?.imagemLogo || "../assets/default-image.png";

            return `
            <div class="participante_separation_div">
                <div class="participante_div">
                    <div class="participante_img">
                        <img src="${participantImgSrc}" alt="Imagem do participante">
                    </div>
                    <div class="participante_info">
                        <span>${participantName}</span>
                        <p><b>Telefone:</b> ${participantPhone}</p>
                        <p><b>Evento:</b> ${participantNiche}</p>
                        <p><b>Valor a pagar:</b> R$ ${participantAmountPaid}</p>
                    </div>
                </div>
                <div class="separation_btns">
                    <button class="btn btn-danger">Recusar</button>
                    <button class="btn btn-primary">Aprovar</button>
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarListaDeEspera();
});
