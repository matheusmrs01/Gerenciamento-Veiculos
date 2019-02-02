const mongoose = require('mongoose')

module.export = mongoose.connect('mongodb://localhost/db_veiculo', { useNewUrlParser: true })

//Alterando as mensagens que vem nos erros
mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."