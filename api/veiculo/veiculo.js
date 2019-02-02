const mongoose = require('mongoose')

var revisaoSchema = new mongoose.Schema({
    data_revisao: { type: Date, default: Date.now },
    valor: { type: Number, min: 0, required: [true, 'Informe o Valor da Revisão!'] }
})

var veiculoSchema = new mongoose.Schema({
    placa: { type: String, minlength: 7, maxlength: 7, required: true},
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    cor: { type: String, required: true },
    ano_fabricacao: { type: Number, required: true },
    data_cadastro: { type: Date, default: Date.now },
    revisoes: [revisaoSchema]
})

const veiculo = mongoose.model('veiculo', veiculoSchema)
const revisao = mongoose.model('revisao', revisaoSchema)

module.exports = {veiculo, revisao}
