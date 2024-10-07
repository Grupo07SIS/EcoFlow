async function buscarDados() {
    // Get the collaborator ID from localStorage
    const collabId = localStorage.getItem('selectedCollaboratorId');
    
    if (!collabId) {
      console.error('No collaborator ID found in localStorage');
      return;
    }
  
    try {
      // Fetch the collaborator data from the backend using the ID
      const response = await fetch(`http://localhost:8080/usuarios/${collabId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching collaborator data: ${response.statusText}`);
      }
  
      // Parse the JSON response
      const collaborator = await response.json();
  
      // Update the HTML elements with the collaborator data
      document.getElementById('imagem_marca').src = collaborator.imagemLogo ? `data:image/png;base64,${collaborator.imagemLogo}` : '../assets/default-image.png';
      document.getElementById('nomeFantasia').innerText = collaborator.fkDados.nomeFantasia;
      document.getElementById('nomeResp').innerText = collaborator.nomeResp;
      document.getElementById('cpfResp').innerText = collaborator.cpfResp;
      document.getElementById('rgResp').innerText = collaborator.fkDados.rgResp;
      document.getElementById('email').innerText = collaborator.email;
      document.getElementById('cnpj').innerText = collaborator.cnpj;
      document.getElementById('telefone').innerText = collaborator.fkDados.telefone;
      document.getElementById('tipoEmpresa').innerText = collaborator.fkDados.tipoEmpresa;
      document.getElementById('cep').innerText = collaborator.fkDados.fkEnderecoUsuario.cep;
      document.getElementById('logradouro').innerText = collaborator.fkDados.fkEnderecoUsuario.logradouro;
      document.getElementById('numero').innerText = collaborator.fkDados.fkEnderecoUsuario.numero;
      document.getElementById('complemento').innerText = collaborator.fkDados.fkEnderecoUsuario.complemento;
      document.getElementById('cidade').innerText = collaborator.fkDados.fkEnderecoUsuario.cidade;
      document.getElementById('estado').innerText = collaborator.fkDados.fkEnderecoUsuario.estado;
      document.getElementById('inscricaoEstadual').innerText = collaborator.fkDados.inscricaoEstadual;
      document.getElementById('proposito').innerText = collaborator.fkDados.proposito;
      document.getElementById('nicho').innerText = collaborator.fkDados.fkTipoProducao.tipo;
      document.getElementById('wppComercial').innerText = collaborator.fkDados.wppComercial;
      document.getElementById('site').innerText = collaborator.fkDados.fkMidiasSociais.site;
  
    } catch (error) {
      console.error(`Failed to fetch collaborator data: ${error.message}`);
    }
  }
  
  window.onload = buscarDados;
  