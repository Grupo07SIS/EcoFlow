const idUsuario = sessionStorage.getItem('ID_USUARIO');

async function carregarPerfil() {

    const nomeSS = sessionStorage.getItem('NOME_RESPONSAVEL') || "Nome não disponível";
    const cnpjSS = sessionStorage.getItem('CNPJ_USUARIO') || "CNPJ não disponível";
    const telefoneSS = sessionStorage.getItem('TELEFONE') || "Telefone não disponível";
    const razaoSocialSS = sessionStorage.getItem('RAZAO_SOCIAL') || "Razão social não disponível";
    const propositoSS = sessionStorage.getItem('PROPOSITO') || "Propósito não disponível";

    const nomeNavBar = document.getElementById('userName');
    const emailNavBar = document.getElementById('nomeEmpresa');

    if (!idUsuario) {
        console.log("Usuário não está logado.");
        alert("Usuário não está logado.");
        window.location.href = 'login.html';
        return;
    }

    // Pre-filling the page with data from sessionStorage
    document.getElementById('nomeUsuario').textContent = nomeSS;
    document.getElementById('nomeDaEmpresa').textContent = razaoSocialSS;
    document.getElementById('cnpj').textContent = cnpjSS;
    document.getElementById('telefone').textContent = telefoneSS;
    document.getElementById('razaoSocial').textContent = razaoSocialSS;
    document.getElementById('proposito').textContent = propositoSS;

    try {

            document.getElementById('nomeUsuario').textContent =  nomeSS;
            document.getElementById('nomeDaEmpresa').textContent =  razaoSocialSS;
            document.getElementById('cnpj').textContent = cnpjSS;
            document.getElementById('telefone').textContent =  telefoneSS;
            document.getElementById('razaoSocial').textContent =  razaoSocialSS;
            document.getElementById('proposito').textContent =  propositoSS;
        } catch (error) {
        console.log("Erro ao tentar buscar os detalhes do usuário: ", error);
        alert("Erro ao tentar carregar os detalhes do perfil. Tente novamente mais tarde.");
    }
}

function enableEditing() {
    const fields = ['cnpj', 'telefone', 'razaoSocial', 'proposito'];

    fields.forEach(field => {
        const span = document.getElementById(field);
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.innerText;
        input.id = field + 'Input';
        span.replaceWith(input);
    });

    const editarBtn = document.getElementById('editarInfoBtn');
    editarBtn.innerText = 'Salvar';
    editarBtn.onclick = saveChanges;
}

async function saveChanges() {
    const fields = ['cnpj', 'telefone', 'razaoSocial', 'proposito'];

    let updatedData = {};
    fields.forEach(field => {
        const input = document.getElementById(field + 'Input');
        updatedData[field] = input.value;
    });
    

    const usuario = {
        "idUsuario": idUsuario, 
        "cnpj": updatedData.cnpj,
        "fkDados": {
            "telefone": updatedData.telefone,
            "razaoSocial": updatedData.razaoSocial,
            "proposito": updatedData.proposito
        }
    };

    try {
        const resposta = await fetch('http://localhost:8080/usuarios', {
            method: 'PATCH',
            body: JSON.stringify(usuario),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');

        if (resposta.status === 200) {
            console.log("Perfil atualizado com sucesso!");

            
            popupMessage.textContent = "Perfil atualizado com sucesso!";
            popup.style.backgroundColor = "green";
        } else {
            console.error('Erro ao atualizar perfil:', resposta.status);

            
            popupMessage.textContent = "Erro ao atualizar perfil.";
            popup.style.backgroundColor = "red";
        }

       
        popup.classList.add('show');

        
        setTimeout(() => {
            popup.classList.remove('show');
            if (resposta.status === 200) {
                location.reload(); 
            }
        }, 3000);

    } catch (error) {
        console.error('Erro na requisição:', error);

        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = "Erro na requisição.";
        popup.style.backgroundColor = "red";
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
}


window.onload = carregarPerfil;
