async function buscarEventos() {
    const resposta = await fetch("http://localhost:8080/eventos");
    const respostaDadosEventos = await resposta.json();

    console.log("Resposta: ", respostaDadosEventos);

    const cards = document.getElementById("cards_eventos");

    cards.innerHTML = respostaDadosEventos.map((itemEvento) => {
        const [year, month, day] = itemEvento.data;
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const formattedDate = `${day} de ${monthNames[month - 1]} ${year}`;
    
        const fullAddress = `${itemEvento.fkEndereco.logradouro}, ${itemEvento.fkEndereco.numero} - ${itemEvento.fkEndereco.cidade}`;
    
        return ` 
        <a href="detalhamentoEvento.html?id=${itemEvento.idEvento}" class="card-link">
        <div class="cardItem">
            <img class="img-background" src="../assets/Mask Group.png" alt="">
            <div class="titulo">
                <span>${itemEvento.nome}</span>
            </div>
            <div class="organizedDtas">
                <div class="dataEvento">
                    <img src="../assets/Schedule.png" alt=""> <span>${formattedDate}</span>
                </div>
                <div class="dataLocal">
                    <img src="../assets/Location.png" alt=""> <span>${fullAddress}</span>
                </div>
            </div>
        </div>
        </a>
        `;
    }).join('');

}

console.log("Antes de buscar")
buscarEventos();
console.log("Depois de buscar")
