class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if(id === null) {
            localStorage.setItem('id', 0);
        } 
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {      
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));
        
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array();

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if(despesa === null) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);

        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();

        despesasFiltradas = this.recuperarTodosRegistros();
        console.log(despesa);
        console.log(despesasFiltradas);

        //ano
        if(despesa.ano != "") {
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        //mes
        if(despesa.mes != "") {
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }
        //dia
        if(despesa.dia != "") {
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }
        //tipo
        if(despesa.tipo != "") {
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }
        //descricao
        if(despesa.descricao != "") {
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }
        //valor
        if(despesa.valor != "") {
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
        
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if(despesa.validarDados()){
        bd.gravar(despesa);

        document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modal_body').innerHTML = 'Despesa cadastrada com sucesso! 😍';
        document.getElementById('modal_title_div').className = 'modal-header text-success';
        document.getElementById('modal_btn').className = 'btn btn-primary btn-success';
        document.getElementById('modal_btn').innerHTML = 'Continuar';
        
        $('#modalRegistraDespesa').modal('show');

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';

    } else {
        document.getElementById('modal_title').innerHTML = 'Erro no registro';
        document.getElementById('modal_body').innerHTML = 'Existem campos obrigatórios que não foram preenchidos ☹';
        document.getElementById('modal_title_div').className = 'modal-header text-danger';
        document.getElementById('modal_btn').className = 'btn btn-primary btn-danger';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';

        $('#modalRegistraDespesa').modal('show');
    }


}

function modalExcluir() {
    
    document.getElementById('modal_title').innerHTML = 'Remoção de registro';
    document.getElementById('modal_body').innerHTML = 'O registro foi removido com sucesso! ❌';
    document.getElementById('modal_title_div').className = 'modal-header text-warning';
    document.getElementById('modal_btn').className = 'btn btn-warning';
    document.getElementById('modal_btn').innerHTML = 'Continuar';

    $('#modalExcluir').modal('show');

    
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros();
    }
    
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function(d) {
        let row = listaDespesas.insertRow();
        
        row.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break

            case '2': d.tipo = 'Educação'
                break  
            
            case '3': d.tipo = 'Lazer'
                break   

            case '4': d.tipo = 'Saúde'
                break

            case '5': d.tipo = 'Transporte'
                break
        }

        row.insertCell(1).innerHTML = d.tipo;
        row.insertCell(2).innerHTML = d.descricao;
        row.insertCell(3).innerHTML = d.valor;

        //criar botao de exclusao
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`

        btn.onclick = function() {

            let id = this.id.replace('id_despesa_', '');

            bd.remover(id)

            modalExcluir();
            
        }

        row.insertCell(4).append(btn);

        console.log(d);
    })

}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true);
}

