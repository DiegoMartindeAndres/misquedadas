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

const showUsuario = require('app/service/get-usuario');

const _ = require('lodash');

//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});

//
// Pruebas
//

router.get('/', function (req, res) {
  var params = {};
  params.nombre = req.query.nombre;

  // Buscar por el usuario o mandar el error
  Promise.all([showUsuario.execute(params)])
  .catch(
    function(err) {
      console.log(err); // some coding error in handling happened
      res.render('error',{message:err.messagge, error:err});
      //done(err,null);
    })
    .then(values => {
      console.log(values[0][0]); // some coding error in handling happened
      console.log(_.isEmpty(values[0][0]));
      if (_.isEmpty(values[0][0])) {
        res.render('error',{message:"no existe el usuario", error:"no existe usuario."});
        //done("No existe usuario.",null);
      } else {
        res.render('usuario',{usuario:values[0][0]});
        //done(null,values[0]);
      }
    });

});


//
// Exports the router
//
module.exports = router;
