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

    // Call your bubble size adjustment function
    ajustarTamanhoDasBolhas();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function resetChart() {
  // If a chart exists, destroy it before creating a new one
  if (chartInstance) {
    chartInstance.destroy();
  }
}

function clearKPI() {
  // Reset all the KPI values to a default state (e.g., empty strings or "0")
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

// Clear filter inputs and reset the graph
function limpar() {
  document.getElementById('start').value = '';
  document.getElementById('end').value = '';

  gerarGrafico(); // Reset to default graph with no filters

  closeFilter(); // Close the filter panel
}

async function ajustarTamanhoDasBolhas() {
  // Fetch data for each category
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

  // Create an array to sort the categories by number of collaborators
  const categories = [
    { id: "bolha_alimento", count: totalColaboradoresNaFilaAlimento, labelId: "dado_bolha_alimento" },
    { id: "bolha_moda", count: totalColaboradoresNaFilaModa, labelId: "dado_bolha_moda" },
    { id: "bolha_beleza", count: totalColaboradoresNaFilaBeleza, labelId: "dado_bolha_beleza" },
    { id: "bolha_pets", count: totalColaboradoresNaFilaPets, labelId: "dado_bolha_pets" }
  ];

  // Sort categories by count in descending order
  categories.sort((a, b) => b.count - a.count);

  // Define colors for each bolha and their darkness (true means dark background)
  const colors = [
    { color: 'rgba(22, 57, 21, 1)', isDark: true },   // Dark green
    { color: 'rgba(15, 147, 51, 1)', isDark: true },   // Darker green
    { color: 'rgba(140, 204, 157, 1)', isDark: false },// Lighter green
    { color: 'rgba(200, 150, 100, 1)', isDark: false } // Brownish light
  ];

  // Apply styles dynamically based on their order and check for duplicates
  let previousCount = null;
  let previousClass = null;

  categories.forEach((category, index) => {
    // Update the count in the bubble and apply bold font
    const labelElement = document.getElementById(category.labelId);
    labelElement.innerText = category.count;
    labelElement.style.fontWeight = 'bold';

    // Get the bubble element and remove any existing size class
    const bubbleElement = document.getElementById(category.id);
    bubbleElement.classList.remove('bolha_geral_1', 'bolha_geral_2', 'bolha_geral_3', 'bolha_geral_4'); // Remove old size classes

    if (category.count === 0) {
      bubbleElement.classList.add('bolha_geral_4');
    } else if (category.count === previousCount) {
      bubbleElement.classList.add(previousClass);
    } else {
      if (index === 0) {
        bubbleElement.classList.add('bolha_geral_1'); // Largest
        previousClass = 'bolha_geral_1';
      } else if (index === 1) {
        bubbleElement.classList.add('bolha_geral_2');
        previousClass = 'bolha_geral_2';
      } else if (index === 2) {
        bubbleElement.classList.add('bolha_geral_3');
        previousClass = 'bolha_geral_3';
      } else {
        bubbleElement.classList.add('bolha_geral_4'); // Smallest
        previousClass = 'bolha_geral_4';
      }
    }

    // Save the current count for comparison with the next one
    previousCount = category.count;

    // Apply the background color to the bubble
    bubbleElement.style.backgroundColor = colors[index].color;

    if (colors[index].isDark) {
      labelElement.style.color = 'white';
    } else {
      labelElement.style.color = 'black';  // Black font for light background
    }
  });
}
