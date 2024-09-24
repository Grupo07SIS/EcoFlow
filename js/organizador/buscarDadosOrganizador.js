async function carregarPerfil() {
    const idUsuario = sessionStorage.getItem('ID_USUARIO');

    if (!idUsuario) {
        console.log("Usuário não está logado.");
        alert("Usuário não está logado.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (resposta.ok) {
            const dadosUsuario = await resposta.json();
            console.log("Dados do usuário: ", dadosUsuario);

            // Preenchendo os elementos da página com os dados do usuário
            document.getElementById('nomeUsuario').textContent = dadosUsuario.nomeResp || "Nome não disponível";
            document.getElementById('nomeDaEmpresa').textContent = dadosUsuario.fkDados.razaoSocial || "Empresa não disponível";
            document.getElementById('cnpj').textContent = dadosUsuario.cnpj || "CNPJ não disponível";
            document.getElementById('telefone').textContent = dadosUsuario.fkDados.telefone || "Telefone não disponível";
            document.getElementById('razaoSocial').textContent = dadosUsuario.fkDados.razaoSocial || "Razão Social não disponível";
            document.getElementById('proposito').textContent = dadosUsuario.fkDados.proposito || "Propósito não disponível";

        } else {
            console.log("Erro ao carregar os detalhes do usuário.");
            alert("Erro ao carregar os detalhes do usuário.");
        }
    } catch (error) {
        console.log("Erro ao tentar buscar os detalhes do usuário: ", error);
        alert("Erro ao tentar carregar os detalhes do perfil. Tente novamente mais tarde.");
    }
}

window.onload = carregarPerfil;
