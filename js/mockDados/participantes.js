// Mock de dados dos participantes
const participants = [
    {
        name: 'EcoFood',
        phone: '(11) 00000-0000',
        niche: 'Alimentos',
        amountPaid: 'R$ 0000.00',
        imgSrc: '../assets/Group 2.png'
    },
    {
        name: 'EcoCream',
        phone: '(11) 00000-0000',
        niche: 'Beleza',
        amountPaid: 'R$ 0000.00',
        imgSrc: '../assets/Group 2.png'
    }
    // Adicione mais participantes conforme necessário
];

// Função para criar HTML dos participantes
function createParticipantHTML(participant) {
    return `
        <div class="participante_separation_div">
            <div class="participante_div">
                <div class="participante_img">
                    <img src="${participant.imgSrc}" alt="">
                </div>
                <div class="participante_info">
                    <span>${participant.name}</span>
                    <p><b>Telefone:</b> ${participant.phone}</p>
                    <p><b>Nicho:</b> ${participant.niche}</p>
                    <p><b>Valor a pago:</b> ${participant.amountPaid}</p>
                </div>
            </div>
            <div class="separation_btns">
                <button class="btn btn-danger">Recusar</button>
                <button class="btn btn-primary">Aprovar</button>
            </div>
        </div>
    `;
}

// Função para renderizar todos os participantes
function renderParticipants() {
    const participantContainer = document.getElementById('participantsContainer');
    participantContainer.innerHTML = participants.map(createParticipantHTML).join('');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    renderParticipants();
});
