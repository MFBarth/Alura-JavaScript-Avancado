class NegociacaoController {

    constructor(){

        let $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $("#valor");
        
        this._listaNegociacoes = new Bind (
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona','esvazia');

        this._mensagem = new Bind(
            new Mensagem(), 
            new MensagemView($('#mensagemView')), 
            'texto');
    }

    adiciona(event) {
        
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());        
        this._mensagem.texto = 'Negociação adicionada com sucesso';
        this._limpaNegociacao();
    }

    apaga(){

        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações Apagadas com Sucesso!';
    }

    importaNegociacao() {
        
        let service = new NegociacaoService();

        Promise.all([
            service.obetemNegociacoesDaSemana(),
            service.obetemNegociacoesDaSemanaAnterior(),
            service.obetemNegociacoesDaSemanaRetrasada()
        ]).then(negociacoes => {
            
            negociacoes
            .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
            .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            
            this._mensagem.texto = 'Negociações importadas com sucesso.';

        }).catch(erro => this._mensagem.texto = erro);
    }

    _criaNegociacao(){
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }

    _limpaNegociacao(){

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }
}