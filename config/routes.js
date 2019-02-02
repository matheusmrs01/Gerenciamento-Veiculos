const express = require('express')

module.exports = function(server){

    const api = express.Router()
    server.use('/api', api)

    const veiculoService = require('../api/veiculo/veiculoService')

    //Rotas referente ao veiculo
    api.post('/create-veiculo', veiculoService.create_veiculo) //ok
    api.get('/find-veiculo/:placa', veiculoService.findOne_veiculo) //ok
    api.get('/find-veiculos', veiculoService.find_veiculos) //ok
    api.get('/find-veiculos/:filtro', veiculoService.find_veiculos_for_filter) //ok
    api.put('/update-veiculo/:placa', veiculoService.update_veiculo) //ok
    api.delete('/delete-veiculo/:placa', veiculoService.delete_veiculo) //ok

    //Rotas referente a revisão
    api.put('/add-revisao/:placa', veiculoService.push_revisao) //ok
    api.get('/gasto-veiculos/:filtro', veiculoService.aggregate_veiculos_filtro) //ok

}
