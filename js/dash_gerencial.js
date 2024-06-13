function gerarGrafico(){
const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Green', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 5],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  document.getElementById("valor_gasto").innerHTML = "1000,00"
}

