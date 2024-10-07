async function valorDados() {
    console.log("CHEGOU");

    // Retrieving data from sessionStorage
    const nomeColaborador = sessionStorage.getItem('NOME_RESP_COLABORADOR') || "Nome do colaborador";
    const nomeMarca = sessionStorage.getItem('PROPOSITO_COLABORADOR') || "Nome da marca";
    const telefoneColaborador = sessionStorage.getItem('TELEFONE_COLABORADOR') || "0000000000";
    const emailColaborador = sessionStorage.getItem('EMAIL_COLABORADOR') || "email@exemplo.com";

    // Grabbing HTML elements
    const nomeNavBar = document.getElementById('nomeDoColaborador');
    const nomeDaMarca = document.getElementById('marca');
    const telefoneDoColaborador = document.getElementById('Telefone');
    const emailNavBar = document.getElementById('Email');

    // Updating elements with sessionStorage data
    nomeNavBar.innerHTML = nomeColaborador;
    nomeDaMarca.innerHTML = nomeMarca;
    telefoneDoColaborador.innerHTML = `Telefone: ${telefoneColaborador}`;
    emailNavBar.innerHTML = `Email: ${emailColaborador}`;
}

// Correct usage of window.onload
window.onload = valorDados;
