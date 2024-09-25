async function gerarGrafico() {
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

  // KPI valor gasto
  const resposta_gasto = await fetch ("http://localhost:8080/dashboard/kpi-gasto-total?startDate=2000-01-01&endDate=2024-06-20")
  const respostaDados_gasto = await resposta_gasto.json()
  console.log("Resposta valor gasto:", respostaDados_gasto, "Deus é TOP!")
  document.getElementById("valor_gasto").innerHTML = respostaDados_gasto

  // KPI orçamento
  const resposta_orcamento = await fetch ("http://localhost:8080/dashboard/kpi-orcamento?startDate=2000-01-01&endDate=2024-06-20")
  const respostaDados_orcamento = await resposta_orcamento.json()
  console.log("Resposta orçamento:", respostaDados_orcamento, "Deus > nome que não deve ser dito")
  document.getElementById("orcamento").innerHTML = respostaDados_orcamento

  // KPI valor lucro
  const resposta_lucro = await fetch ("http://localhost:8080/dashboard/kpi-valor-lucro?startDate=2000-01-01&endDate=2024-06-20")
  const respostaDados_lucro = await resposta_lucro.json()
  console.log("Resposta orçamento:", respostaDados_lucro, "Jesus é luz")
  document.getElementById("valor_lucro").innerHTML = respostaDados_lucro

  //  KPI número de colaboradores incritos 
  document.getElementById("colaboradores").innerHTML = inscritos

  // KPI colaboradores reprovados
  const resposta_reprovados = await fetch ("http://localhost:8080/dashboard/kpi-reprovados?startDate=2000-01-01&endDate=2024-06-20")
  const respostaDados_reprovados = await resposta_reprovados.json()
  console.log("Resposta orçamento:", respostaDados_reprovados, "Deus tudinho, di@bo nadinha")
  document.getElementById("colab_reprovados").innerHTML = respostaDados_reprovados

  // KPI média de avaliações
  document.getElementById("media_avaliacoes").innerHTML = 8.76
 

}