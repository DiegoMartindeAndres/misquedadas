/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * @module mq2/router/api-sitio
 *
 * @requires express
 * @requires mq2/executor
 * @requires mq2/service/get-sitios
 * @requires mq2/service/add-sitio
 * @requires mq2/service/remove-sitio
 */

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showSitios = require('app/service/get-sitios');
const addSitio = require('app/service/add-sitio');
const removeSitio = require('app/service/remove-sitio');

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
 * @api {get} /sitio Obtiene todos los sitios
 * @apiName GetSitios
 * @apiGroup Sitios
 * @apiDescription Devuelve una lista de sitios por la direccion
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/api/sitio
 *
 * @apiSuccess {String} status `okay` si todo bien
 *                      status  `error' si error
 * @apiSuccess {[]String} array de quedadas.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "sitios": [
 *          "sol",
 *          "castellana 10",
 *          "la casa azul"
 *       ]
 *     }
 */
router.get('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    sender(showSitios.execute(), 'sitios');
  });
});


/**
 * @api {put} /sitio/ Añade un sitio haciendo un PUT
 * @apiName AddSitio
 * @apiGroup Sitio
 * @apiDescription Añade un sitio
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     put http://localhost:18080/api/sitio/
 *
 * @apiSuccess {String} status `okay` si todo va bien
 *                            `error` si hay un error
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay"
 *     }
 * Se debe recibir en el body un sitio con el siguiente formato:
 * {
							  "direccion": "casa azul",
							  "coordenadas": "40.942132, -4.103217"
							}
 */
router.put('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.direccion = req.body.direccion;
    params.coordenadas = req.body.coordenadas;
      sender(addSitio.execute(params),'AddSitio');
  });
});


/**
 * @api {delete} /api/sitio/<direccion> Elimina un sitio por la direccion
 * @apiName RemoveSitio
 * @apiGroup Sitio
 * @apiDescription Elimina un sitio
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     delete http://localhost:8080/sitio/sol
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
router.delete('/:DIRECCION', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.direccion = req.params.DIRECCION;

      sender(removeSitio.execute(params),'RemoveSitio');
  });
});

//
// Exports the router
//
module.exports = router;
