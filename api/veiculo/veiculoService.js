const _ = require('lodash')
const Veiculo = require('./veiculo')


const placaRegex = /^[a-zA-Z]{3}[0-9]{4}$/

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

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

const update_veiculo = (req, res, next) => {

}

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

module.exports = { create_veiculo, update_veiculo, find_veiculos, find_veiculos_for_filter, findOne_veiculo, delete_veiculo }