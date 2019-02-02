const _ = require('lodash')
const veiculoRevisao = require('./veiculo')

const Veiculo = veiculoRevisao.veiculo
const Revisao = veiculoRevisao.revisao

const placaRegex = /^[a-zA-Z]{3}[0-9]{4}$/


//Funções referente a veiculo

//Função responsavel por listar os erros referente ao banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

//função de criação de veiculo, cria o veiculo sem revisão
const create_veiculo = (req, res, next) => {
    const placa = req.body.placa.toUpperCase() || ''
    const marca = req.body.marca.toUpperCase() || ''
    const modelo = req.body.modelo.toUpperCase() || ''
    const cor = req.body.cor.toUpperCase() || ''
    const ano_fabricacao = req.body.ano_fabricacao.toUpperCase() || ''

    if (!placa.match(placaRegex)) {
        return res.status(400).send({ errors: ['O formato da placa esta invalido!'] })
    }
    else {
        Veiculo.findOne({ placa }, (erro, veiculo) => {
            if (erro) {
                return sendErrorsFromDB(res, erro)
            }
            else if (veiculo) {
                return res.status(400).send({ errors: ['Veiculo ja cadastrado'] })
            }
            else {
                const newVeiculo = new Veiculo({ placa, marca, modelo, cor, ano_fabricacao })
                newVeiculo.save(err => {
                    if (err) {
                        return sendErrorsFromDB(res, err)
                    }
                    else {
                        return res.status(200).send({ message: ['Veiculo criado com sucesso!'] })
                    }
                })
            }
        })
    }

}

//Fução que realiza o update do veiculo, dados que devem ser passados: Marca, modelo, cor e ano
const update_veiculo = (req, res, next) => {
    const placa = req.params.placa.toUpperCase()
    const marc = req.body.marca || ''
    const model = req.body.modelo || ''
    const corr = req.body.cor || ''
    const ano_fabricaca = req.body.ano_fabricacao || ''
    
    if(marc && model && corr && ano_fabricaca){
        Veiculo.findOneAndUpdate({placa}, {$set: {
            marca: marc.toUpperCase(), 
            modelo: model.toUpperCase(), 
            cor: corr.toUpperCase(), 
            ano_fabricacao: ano_fabricaca.toUpperCase()
        }
    }, (erro, veiculo) =>{
        if(erro){
            return sendErrorsFromDB(res, err)
        }
        else{
            return res.send({ veiculo })
        }
    })
    }
    else{
        return res.status(400).send({ erros: "Os campos de marca, modelo, cor e ano fabricação devem ser preechidos!" })
    }
}

//Função que lista todos os veiculos
const find_veiculos = (req, res, next) => {
    Veiculo.find((erro, veiculos) => {
        if (erro) {
            return sendErrorsFromDB(res, err)
        }
        else {
            return res.send({ veiculos })
        }
    })
}

//Função que procura os veiculos por filtro (marca e cor)
const find_veiculos_for_filter = (req, res, next) => {
    const filtro = req.params.filtro.toUpperCase()
    Veiculo.find({ $or: [{ 'marca': filtro }, { 'cor': filtro }] }, (erro, veiculos) => {
        if (erro) {
            return sendErrorsFromDB(res, err)
        }
        else {
            return res.send({ veiculos })
        }
    })
}

//Função que busca apenas um veiculo, com uma determinada placa
const findOne_veiculo = (req, res, next) => {
    const placa = req.params.placa.toUpperCase()
    Veiculo.findOne({ placa }, (erro, veiculo) => {
        if (erro) {
            return sendErrorsFromDB(res, erro)
        }
        else {
            return res.send({ veiculo })
        }
    })
}

//Função que deleta um determinado veiculo
const delete_veiculo = (req, res, next) => {
    const plac = req.params.placa.toUpperCase()
    Veiculo.findOneAndDelete({placa: plac}, (erro) =>{
        if(erro){
            return sendErrorsFromDB(res, erro)
        }
        else{
            return res.status(200).send({ message: ['Veiculo deletado com sucesso!'] })
        }
    })

}

//Funções referente a revisão

//Função que adiciona revisão, pegando a placa do carro como referencia 
const push_revisao = (req, res, next) => {
    const placa = req.params.placa.toUpperCase()
    const valor = req.body.valor || ''
    const data = req.body.data || ''
    
    if(valor && data ){
        const newRevisao = new Revisao({data, valor})
        Veiculo.findOneAndUpdate({placa}, {$push: {revisoes: newRevisao}}, (erro, veiculo) =>{
        if(erro){
            return sendErrorsFromDB(res, erro)
        }
        else{
            return res.send({ veiculo })
        }
    })
    }
    else if (valor){
        const newRevisao = new Revisao({valor})
        Veiculo.findOneAndUpdate({placa}, {$push: {revisoes: newRevisao}}, (erro, veiculo) =>{
        if(erro){
            return sendErrorsFromDB(res, err)
        }
        else{
            return res.send({ veiculo })
        }
    })
    }
    else{
        return res.status(400).send({ erros: "Pelo menos o campo de valor deve ser preenchido!" })
    }
}

//Função que agrega os valores dependendo do filtro, filtro podendo ser a placa ou a marca
const aggregate_veiculos_filtro = (req, res, next) => {
    const filtro = req.params.filtro.toUpperCase()
    Veiculo.aggregate([
        {
            $match: {$or: [{'placa': filtro}, {'marca': filtro}]}
        },
        {
            $project: {
                revisoes: {$sum: "$revisoes.valor"}
            }
        },
        {
            $group: {
                _id: null,
                valor: {
                    $sum: '$revisoes'
                }
            }
        },
        {
            $project: {_id: 0, valor: 1}
        }
    ], function(erro, result){
        if(erro){
            return sendErrorsFromDB(res, erro)
        }
        else{
            return res.json(_.defaults(result))
        }
    })
}

module.exports = { create_veiculo, update_veiculo, find_veiculos, find_veiculos_for_filter, findOne_veiculo, delete_veiculo, push_revisao, aggregate_veiculos_filtro }