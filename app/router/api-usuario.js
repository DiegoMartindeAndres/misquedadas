/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * @module mq2/router/api-usuario
 *
 * @requires express
 * @requires mq2/executor
 * @requires mq2/service/get-usuarios
 */

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showUsuarios = require('app/service/get-usuarios');
const showUsuario = require('app/service/get-usuario');
const showImagenUsuario = require('app/service/get-imagenUsuario');

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
 * @api {get} /usuario Obtiene todos los usuarios
 * @apiName GetUsuarios
 * @apiGroup Usuarios
 * @apiDescription Devuelve una lista de usuarios por el nombre
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/usuario
 *
 * @apiSuccess {String} status  `okay' si todo bien
 *                      status  `error' si hay un error
 * @apiSuccess {[]String} array de usuarios.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "usuarios": [
 *          "epi",
 *          "blas",
 *          "carmen"
 *       ]
 *     }
 */
router.get('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    sender(showUsuarios.execute(), 'usuarios');
  });
});


/**
 * @api {get} /usuario/<nombre> Obtiene un usuario por el <nombre>
 * @apiName GetUsuario
 * @apiGroup Usuarios
 * @apiDescription Devuelve un usuario por el nombre
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/usuario/epi
 *
 * @apiSuccess {String} status always `okay`
 *                      status  `error' si hay un error
 * @apiSuccess {[]String} array con un solo usuario.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "usuario": [
            "nombre": "ana",
            "clave": "ana0000",
            "edad": "16",
            "imagen": "ana.jpg"

 *       ]
 *     }
 */
router.get('/:NOMBRE', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.nombre = req.params.NOMBRE;
    sender(showUsuario.execute(params), 'usuario');
  });
});


/**
 * @api {get} /usuario/<nombre>/imagen Obtiene la URL la imagen de
 * un usuario por el <nombre>
 * @apiName GetImagenUsuario
 * @apiGroup Usuarios
 * @apiDescription Devuelve la URL de la imagen de un usuario por el nombre
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/usuario/epi/imagen
 *
 * @apiSuccess {String} status always `okay`
 *                      status  `error' si hay un error
 * @apiSuccess {[]String} array con una sola URL de imagen de usuario.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "imagen": [
            "imagen": "usuario.jpg"
 *       ]
 *     }
 */
router.get('/:NOMBRE/imagen', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.nombre = req.params.NOMBRE;
    sender(showImagenUsuario.execute(params), 'imagen');
  });
});




//
// Exports the router
//
module.exports = router;
