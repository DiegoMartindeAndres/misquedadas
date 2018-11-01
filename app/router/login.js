/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* @module mq2/router/login
*
* @requires express
* @requires mq2/executor
* @requires mq2/service/get-quedadas
*/

'use strict';

const express = require('express');


//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});








//
// Exports the router
//

module.exports = function (app,passport) {

  //
  // Endpoints...
  //

  router.get('/', function (req, res) {
    res.render('login',{message:"", error:""});
  });

  router.post('/', passport.authenticate('local-login', {
      successRedirect : '/quedada', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  // router.post('/', function (req, res) {
  //   //console.log(passport);
  //   var nombre = req.body.nombre;
  //   var clave = req.body.clave;
  //   console.log(nombre);
  //   console.log(clave);
  //   res.render('login',{message:"nombre: "+nombre+" clave: "+clave, error:""});
  // });

  app.use('/login', router);

};
