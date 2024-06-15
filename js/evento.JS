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
