/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * @module mq2/router/api-quedada
 *
 * @requires express
 * @requires mq2/executor
 * @requires mq2/service/get-quedadas
 */

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showQuedadas = require('app/service/get-quedadas');
const showQuedada = require('app/service/get-quedada');
const addQuedada = require('app/service/add-quedada');
const removeQuedada = require('app/service/remove-quedada');

//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});

//
// Endpoints...
//

/**
 * @api {get} /quedada Obtiene todas las quedadas
 * @apiName GetQuedadas
 * @apiGroup Quedadas
 * @apiDescription Devuelve una lista de quedadas por el qué
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/quedada
 *
 * @apiSuccess {String} status `okay` si todo bien
 *                      status  `error' si error
 * @apiSuccess {[]String} array de quedadas.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "quedadas": [
 *          "cena del viernes",
 *          "compras",
 *          "ver han solo"
 *       ]
 *     }
 */
router.get('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    sender(showQuedadas.execute(), 'quedadas');
  });
});


/**
 * @api {get} /quedada/<que> Obtiene una quedada por el <que>
 * @apiName GetQuedada
 * @apiGroup Quedadas
 * @apiDescription Devuelve una quedada por el qué
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/quedada/compras
 *
 * @apiSuccess {String} status `okay` si todo bien
 *                      status  `error' si error
 * @apiSuccess {[]String} array con la quedada concreta.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "quedada": [
            "que": "pruebas",
            "dia": "2018-05-17",
            "hora": "18:30",
            "direccion": "sol"

 *       ]
 *     }
 */
router.get('/:QUE', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.params.QUE;
    sender(showQuedada.execute(params), 'quedada');
  });
});


/**
 * @api {put} /quedada/ Añade una quedada haciendo un PUT
 * @apiName AddQuedadas
 * @apiGroup Quedadas
 * @apiDescription Añade una quedada
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/quedada/
 *
 * @apiSuccess {String} status `okay` si todo va bien
 *                            `error` si hay un error
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay"
 *     }
 * Se debe recibir en el body una quedada con el siguiente formato:
 * {
  "que": "nombre",
  "dia": "2018-05-17",
  "hora": "18:30",
  "direccion": "sol"
  }
 */
router.put('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.body.que;
    params.dia = req.body.dia;
    params.hora = req.body.hora;
    params.direccion = req.body.direccion;

      sender(addQuedada.execute(params),'AddQuedada');
  });
});


/**
 * @api {delete} /quedada/<que> Elimina una quedada por el <que>
 * @apiName RemoveQuedadas
 * @apiGroup Quedadas
 * @apiDescription Elimina una quedada
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/quedada/
 *
 * @apiSuccess {String} status `okay` si todo va bien
 *                            `error` si hay un error
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay"
 *     }
 */
router.delete('/:QUE', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.params.QUE;

      sender(removeQuedada.execute(params),'RemoveQuedada');
  });
});



//
// Exports the router
//
module.exports = router;
