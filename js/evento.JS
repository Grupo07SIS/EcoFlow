async function cadastrarEvento(){
    var dadosEventoJson = sessionStorage.getItem('dadosEvento')
    var dadosEvento = JSON.parse(dadosEventoJson);
    var {
        nomeEvento,
        temaEvento,
        dataEvento,
        capacidadeMax,
        descricaoEvento,
        logradouro,
        numero,
        cep,
        complemento,
        cidade,
        estado,
        orcamentoTotal,
        metaLucro,
        aluguelLocal,
        valorInfra,
        valorInscricao,
        valorFuncionarios,
        qtdMaxColaboradores
    } = dadosEvento;

    console.log(dadosEvento);

    const evento = {
            "nome": nomeEvento,
            "tema": temaEvento,
            "descricao": descricaoEvento,
            "capacidadeMax": capacidadeMax,
            "fkFinanceiro": {
                "idFinanceiro": 1,
                "orcamentoTotal": orcamentoTotal,
                "aluguelLocal": aluguelLocal,
                "valorFuncionario": valorFuncionarios,
                "valorInfra": valorInfra,
                "ticketMedio": 100.0,
                "valorInscricao": valorInscricao,
                "qtdMaxColaboradores": qtdMaxColaboradores,
                "gastoTotal": 500.0
            },
            "fkEndereco": {
                "idEnderecoEvento": 1,
                "cep": cep,
                "logradouro": logradouro,
                "numero": numero,
                "complemento": complemento,
                "cidade": cidade,
                "estado": estado
            },
            "data": dataEvento
        }
    
    const respostaCadastro = await fetch("http://localhost:8080/eventos", {
        method: "POST",
        body: JSON.stringify(evento),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if(respostaCadastro.status == 201){console.log("Cadastrado")}
}


async function buscarDados(){
    const busca = await fetch("http://localhost:8080/eventos/id?id=1")
    const buscaDados = await busca.json()
    console.log("Resposta",buscaDados)
    const data = document.getElementById("db-info")
    data.innerHTML = `
    <h1>${buscaDados.nome}</h1>
            <div class="style_info">
                <i class="bi bi-calendar"></i>
                <p>${buscaDados.data[2]}/${buscaDados.data[1]}/${buscaDados.data[0]}</p>
            </div>
            <div class="style_info">
                <i class="bi bi-geo-alt"></i>
                <p>${buscaDados.fkEndereco.logradouro}, ${buscaDados.fkEndereco.numero}, ${buscaDados.fkEndereco.cidade} - ${buscaDados.fkEndereco.estado}</p>
            </div>
            <div class="map_live">
                Google Maps Here
            </div>
            <div class="desc_event">
                <h2>Descrição do Evento</h2>
                <p>${buscaDados.descricao}</p>
    `
    sessionStorage.setItem('dadosGetEvento', JSON.stringify(buscaDados))
}


async function alterarEvento(){
    var dadosEventoJson = sessionStorage.getItem('dadosEventoUpdate')
    var dadosEvento = JSON.parse(dadosEventoJson);
    var {
        nomeEvento,
        temaEvento,
        dataEvento,
        capacidadeMax,
        descricaoEvento,
        logradouro,
        numero,
        cep,
        complemento,
        cidade,
        estado,
        orcamentoTotal,
        metaLucro,
        aluguelLocal,
        valorInfra,
        valorInscricao,
        valorFuncionarios,
        qtdMaxColaboradores
    } = dadosEvento;

    console.log(dadosEvento);

    const evento = {
            "nome": nomeEvento,
            "tema": temaEvento,
            "descricao": descricaoEvento,
            "capacidadeMax": capacidadeMax,
            "fkFinanceiro": {
                "idFinanceiro": 1,
                "orcamentoTotal": orcamentoTotal,
                "aluguelLocal": aluguelLocal,
                "valorFuncionario": valorFuncionarios,
                "valorInfra": valorInfra,
                "ticketMedio": 100.0,
                "valorInscricao": valorInscricao,
                "qtdMaxColaboradores": qtdMaxColaboradores,
                "gastoTotal": 500.0
            },
            "fkEndereco": {
                "idEnderecoEvento": 1,
                "cep": cep,
                "logradouro": logradouro,
                "numero": numero,
                "complemento": complemento,
                "cidade": cidade,
                "estado": estado
            },
            "data": dataEvento
        }
    
    const respostaCadastro = await fetch("http://localhost:8080/eventos/update?id=1", {
        method: "PATCH",
        body: JSON.stringify(evento),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if(respostaCadastro.status == 200){console.log("Alterado")}
}


async function deletarEvento(){
    const existingHeaders = {"Content-type": "application/json; charset=UTF-8"};
    const userAgent = "insomnia/8.6.1";
    const headers = {
    ...existingHeaders,
    "User-Agent": userAgent
    };
    const deletar = await fetch("http://localhost:8080/eventos?id=1", {
      method: "DELETE",
      headers: headers
    });
    if(deletar.status == 204){
      console.log("Evento excluído com sucesso!");
    } else {
      console.error("Erro ao excluir evento:", deletar.status);
    }
  }