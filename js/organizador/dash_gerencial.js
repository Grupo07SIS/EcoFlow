let chartInstance; 

window.onload = () => gerarGrafico();

function aplicar() {
  const startDate = document.getElementById('start').value || '1999-01-01';
  const endDate = document.getElementById('end').value || new Date().toISOString().split('T')[0];

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  resetChart();  
  clearKPI();   

  gerarGrafico(startDate, endDate); 

  closeFilter(); 
}

async function gerarGrafico(startDate = '1999-01-01', endDate = new Date().toISOString().split('T')[0]) {
  const urlParams = `?startDate=${startDate}&endDate=${endDate}`;

  try {
    const resposta = await fetch(`http://localhost:8080/dashboard/grafico-inscritos${urlParams}`);
    const respostaDados = await resposta.json();
    console.log("Resposta:", respostaDados);

    const inscritos = respostaDados.inscritos;
    const vagasAbertas = respostaDados.vagasAbertas;

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Vagas Abertas', 'Vagas Preenchidas'],
        datasets: [{
          data: [vagasAbertas, inscritos],
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
    });

    const resposta_gasto = await fetch(`http://localhost:8080/dashboard/kpi-gasto-total${urlParams}`);
    const respostaDados_gasto = await resposta_gasto.json();
    document.getElementById("valor_gasto").innerHTML = respostaDados_gasto;

    const resposta_lucro_alcancado = await fetch(`http://localhost:8080/dashboard/kpi-lucro-alcancado${urlParams}`);
    const respostaDados_la = await resposta_lucro_alcancado.json();
    const lucroAlcancado = parseFloat(respostaDados_la || 0); 
    console.log("Lucro Alcancado:", lucroAlcancado);

    const resposta_orcamento = await fetch(`http://localhost:8080/dashboard/kpi-orcamento${urlParams}`);
    const respostaDados_orcamento = await resposta_orcamento.json();
    const orcamento = parseFloat(respostaDados_orcamento.orcamento || 0); 
    document.getElementById("orcamento").innerHTML = respostaDados_orcamento;

    if (orcamento === 0 || lucroAlcancado > orcamento) {
      document.getElementById('alcando').innerText = '0%';
      document.getElementById('meta').innerHTML = '100%';
    } else {
      const porcentagemAlcancada = (lucroAlcancado / orcamento) * 100;

      const progressoElement = document.getElementById('lucro_alcancado');
      progressoElement.style.width = `${porcentagemAlcancada}%`;
      document.getElementById('meta').innerHTML = '100%';
      document.getElementById('alcando').innerText = porcentagemAlcancada.toFixed(2) + '%';
    }


    const resposta_lucro = await fetch(`http://localhost:8080/dashboard/kpi-lucro${urlParams}`);
    const respostaDados_lucro = await resposta_lucro.json();
    document.getElementById("valor_lucro").innerHTML = respostaDados_lucro;

    const resposta_inscritos = await fetch(`http://localhost:8080/dashboard/kpi-colaboradores${urlParams}`);
    const respostaDados_inscritos = await resposta_inscritos.json();
    document.getElementById("colaboradores").innerHTML = respostaDados_inscritos;

    const resposta_reprovados = await fetch(`http://localhost:8080/dashboard/kpi-reprovados${urlParams}`);
    const respostaDados_reprovados = await resposta_reprovados.json();
    document.getElementById("colab_reprovados").innerHTML = respostaDados_reprovados;

    const resposta_aprovados = await fetch(`http://localhost:8080/dashboard/kpi-avaliacao${urlParams}`);
    const respostaDados_aprovados = await resposta_aprovados.json();
    document.getElementById("colab_aprovados").innerHTML = respostaDados_aprovados;

    ajustarTamanhoDasBolhas();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function resetChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }
}

function clearKPI() {
  document.getElementById("valor_gasto").innerHTML = '0';
  document.getElementById("orcamento").innerHTML = '0';
  document.getElementById("valor_lucro").innerHTML = '0';
  document.getElementById("colaboradores").innerHTML = '0';
  document.getElementById("colab_reprovados").innerHTML = '0';
  document.getElementById("colab_aprovados").innerHTML = '0';
  document.getElementById('lucro_alcancado').style.width = '0%';
  document.getElementById('alcando').innerText = '0%';
}

function closeFilter() {
  const filterPanel = document.getElementById('offcanvasBottom');
  const offcanvas = bootstrap.Offcanvas.getInstance(filterPanel);
  offcanvas.hide();
}

function limpar() {
  document.getElementById('start').value = '';
  document.getElementById('end').value = '';

  gerarGrafico(); 

  closeFilter(); 
}

async function ajustarTamanhoDasBolhas() {
  const resposta_alimento_colab = await fetch(`http://localhost:8080/alimento/fila`);
  const respostaDados_alimento_colab = await resposta_alimento_colab.json();
  const totalColaboradoresNaFilaAlimento = respostaDados_alimento_colab.length || 0;

  const resposta_moda_colab = await fetch(`http://localhost:8080/moda/fila`);
  const respostaDados_moda_colab = await resposta_moda_colab.json();
  const totalColaboradoresNaFilaModa = respostaDados_moda_colab.length || 0;

  const resposta_beleza_colab = await fetch(`http://localhost:8080/beleza/fila`);
  const respostaDados_beleza_colab = await resposta_beleza_colab.json();
  const totalColaboradoresNaFilaBeleza = respostaDados_beleza_colab.length || 0;

  const resposta_pets_colab = await fetch(`http://localhost:8080/pets/fila`);
  const respostaDados_pets_colab = await resposta_pets_colab.json();
  const totalColaboradoresNaFilaPets = respostaDados_pets_colab.length || 0;

  const categories = [
    { id: "bolha_alimento", count: totalColaboradoresNaFilaAlimento, labelId: "dado_bolha_alimento" },
    { id: "bolha_moda", count: totalColaboradoresNaFilaModa, labelId: "dado_bolha_moda" },
    { id: "bolha_beleza", count: totalColaboradoresNaFilaBeleza, labelId: "dado_bolha_beleza" },
    { id: "bolha_pets", count: totalColaboradoresNaFilaPets, labelId: "dado_bolha_pets" }
  ];

  categories.sort((a, b) => b.count - a.count);

  const colors = [
    { color: 'rgba(22, 57, 21, 1)', isDark: true },  
    { color: 'rgba(15, 147, 51, 1)', isDark: true },   
    { color: 'rgba(140, 204, 157, 1)', isDark: false },
    { color: 'rgba(200, 150, 100, 1)', isDark: false } 
  ];

  let previousCount = null;
  let previousClass = null;

  categories.forEach((category, index) => {
    const labelElement = document.getElementById(category.labelId);
    labelElement.innerText = category.count;
    labelElement.style.fontWeight = 'bold';

    const bubbleElement = document.getElementById(category.id);
    bubbleElement.classList.remove('bolha_geral_1', 'bolha_geral_2', 'bolha_geral_3', 'bolha_geral_4');

    if (category.count === 0) {
      bubbleElement.classList.add('bolha_geral_4');
    } else if (category.count === previousCount) {
      bubbleElement.classList.add(previousClass);
    } else {
      if (index === 0) {
        bubbleElement.classList.add('bolha_geral_1'); 
        previousClass = 'bolha_geral_1';
      } else if (index === 1) {
        bubbleElement.classList.add('bolha_geral_2');
        previousClass = 'bolha_geral_2';
      } else if (index === 2) {
        bubbleElement.classList.add('bolha_geral_3');
        previousClass = 'bolha_geral_3';
      } else {
        bubbleElement.classList.add('bolha_geral_4'); 
        previousClass = 'bolha_geral_4';
      }
    }

    previousCount = category.count;

    bubbleElement.style.backgroundColor = colors[index].color;

    if (colors[index].isDark) {
      labelElement.style.color = 'white';
    } else {
      labelElement.style.color = 'black';  
    }
  });
}
