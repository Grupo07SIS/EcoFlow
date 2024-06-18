// colocar @CrossOrigin no back antes do @GetMapping
async function gerarGrafico() {
  // const resposta = await fetch("http://localhost:8080/dashboar/grafico-inscritos");
  // if (!resposta.ok){
  //   throw new Error (`HTTP error! Status: ${resposta.status}`)
  // }
  // const respostaDados = await resposta.json();
  // console.log(respostaDados)

  const resposta = await fetch ("http://localhost:8080/dashboard/grafico-inscritos?startDate=2000-01-01&endDate=2024-06-20")
  const respostaDados = await resposta.json()
  console.log("Resposta:", respostaDados)

  const inscritos = respostaDados.inscritos
  const vagasAbertas = respostaDados.vagasAbertas

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Vagas Abertas', 'Vagas Preenchidas'],
      datasets: [{
        label: ['Vagas Abertas', 'Vagas Preenchidas'],
        data: [vagasAbertas,inscritos],
        borderWidth: 1,
        backgroundColor: [
          'rgba(22, 57, 21, 1)',
          'rgba(199, 83, 12, 1)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      }
    }
  })

  document.getElementById("valor_gasto").innerHTML = "000.00"
}

// Possivel cod para barra lucro de evento

// resposta.json().then(function (resposta) {
//   console.log("Dados recebidos: ", JSON.stringify(resposta));
//   var porcentagem = document.getElementById("porcentage");
//   porcentagem.innerHTML = ${resposta[0].Uso_DIsco} %;
//   var bar = document.querySelector(".lucro_alcancado");
//       var porcentagemUso = parseFloat(resposta[0].Uso_DIsco);
//       // Check if the value is more than 60%
//       if (porcentagemUso > 60) {
//           bar.style.backgroundColor = "#FFE500";
//       }
//       // Check if the value is more than 80%
//       if (porcentagemUso > 80) {
//           bar.style.backgroundColor = "#ff7800";
//       }
//       // Set the width based on the value
//       bar.style.width = ${porcentagemUso}%;
// });