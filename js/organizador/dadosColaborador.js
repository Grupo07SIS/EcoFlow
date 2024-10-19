document.addEventListener('DOMContentLoaded', () => {
  // Get the collaborator ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const collaboratorId = urlParams.get('id');

  if (collaboratorId) {
      fetchCollaboratorData(collaboratorId);
  } else {
      console.error("No collaborator ID provided.");
  }
});

// Function to fetch collaborator data by ID
async function fetchCollaboratorData(id) {
  try {
      const response = await fetch(`http://localhost:8080/colaborador/id?id=${id}`);
      if (!response.ok) {
          throw new Error('Erro na requisição');
      }

      const collaborator = await response.json();
      populateCollaboratorDetails(collaborator);
  } catch (error) {
      console.error('Erro ao buscar dados do colaborador:', error);
  }
}

// Function to populate the collaborator's details into the HTML
function populateCollaboratorDetails(collaborator) {
  // Store elements in constants
  const nomeFantasiaElement = document.getElementById('nomeFantasia');
  const nomeRespElement = document.getElementById('nomeResp');
  const cpfRespElement = document.getElementById('cpfResp');
  const rgRespElement = document.getElementById('rgResp');
  const emailElement = document.getElementById('email');
  const cnpjElement = document.getElementById('cnpj');
  const telefoneElement = document.getElementById('telefone');
  const tipoEmpresaElement = document.getElementById('tipoEmpresa');
  const cepElement = document.getElementById('cep');
  const logradouroElement = document.getElementById('logradouro');
  const numeroElement = document.getElementById('numero');
  const complementoElement = document.getElementById('complemento');
  const cidadeElement = document.getElementById('cidade');
  const estadoElement = document.getElementById('estado');
  const inscricaoEstadualElement = document.getElementById('inscricaoEstadual');
  const propositoElement = document.getElementById('proposito');
  const nichoElement = document.getElementById('nicho');
  const wppComercialElement = document.getElementById('wppComercial');
  const siteElement = document.getElementById('site');
  const imagemMarcaElement = document.getElementById('imagem_marca');

  // Assign values to the elements
  nomeFantasiaElement.innerHTML = collaborator.nomeFantasia || 'Nome Fantasia não disponível';
  nomeRespElement.innerHTML = collaborator.nomeResp || 'Nome do Responsável não disponível';
  cpfRespElement.innerHTML = collaborator.cpfResp || 'CPF não disponível';
  rgRespElement.innerHTML = collaborator.rgResp || 'RG não disponível';
  emailElement.innerHTML = collaborator.email || 'Email não disponível';
  cnpjElement.innerHTML = collaborator.cnpj || 'CNPJ não disponível';
  telefoneElement.innerHTML = collaborator.telefone || 'Telefone não disponível';
  tipoEmpresaElement.innerHTML = collaborator.tipoEmpresa || 'Tipo Empresa não disponível';
  cepElement.innerHTML = collaborator.endereco.cep || 'CEP não disponível';
  logradouroElement.innerHTML = collaborator.endereco.logradouro || 'Logradouro não disponível';
  numeroElement.innerHTML = collaborator.endereco.numero || 'Número não disponível';
  complementoElement.innerHTML = collaborator.endereco.complemento || 'Complemento não disponível';
  cidadeElement.innerHTML = collaborator.endereco.cidade || 'Cidade não disponível';
  estadoElement.innerHTML = collaborator.endereco.estado || 'Estado não disponível';
  inscricaoEstadualElement.innerHTML = collaborator.inscEstadual || 'Inscrição Estadual não disponível';
  propositoElement.innerHTML = collaborator.proposito || 'Propósito não disponível';
  nichoElement.innerHTML = collaborator.tipoProduto?.tipo || 'Nicho não disponível';
  wppComercialElement.innerHTML = collaborator.wppComercial || 'Whatsapp não disponível';
  siteElement.innerHTML = collaborator.midiasSociais?.site || 'Site não disponível';

  // Set image if available
  if (collaborator.bannerImg) {
      imagemMarcaElement.src = `data:image/png;base64,${collaborator.bannerImg}`;
  }
}
