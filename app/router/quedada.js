/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* @module mq2/router/quedada
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
const showAsiste = require('app/service/get-asiste');
const showCoordenada = require('app/service/get-coordenadasQuedada.js');
const removeQuedada = require('app/service/remove-quedada');
const addQuedada = require('app/service/add-quedada');
const showSitios = require('app/service/get-sitios');
const showSitiosBorrables = require('app/service/get-sitiosBorrables');

const _ = require('lodash');

const configUtil      = require('../config-util');
var def = require('../../misquedadas-2.json');

//
// Router: /quedada
//
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  //console.log("Está autenticado?: ",req.isAuthenticated());


  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}


//
// Exports the router
//
module.exports = function (app,passport) {
  //
  // Endpoints...
  //


  router.get('/',isLoggedIn, function (req, res) {

    // Ejecutamos todas las promesas de búsquedas en la BBDD...
    Promise.all([showQuedadas.execute()])
    .catch(
      function(err) {
        //console.log(err.message); // some coding error in handling happened
        res.render('error',{message:err.messagge, error:err});
      })
      .then(values => {

        if (values[0][0]){
          var primeraQue = values[0][0];
          //console.log(primeraQue);
          res.redirect(301,'/quedada/'+primeraQue);
        } else {
          res.render('error',{message:"Parece que no tienes ninguna quedada en la BBDD.", error:""});
        }
      });

    });


    router.get('/nuevo', isLoggedIn, function (req, res) {
      var usuario = req.session.passport.user;
      // Ejecutamos todas las promesas de búsquedas en la BBDD...
      Promise.all([showSitios.execute(), showQuedadas.execute(),showSitiosBorrables.execute()])
      .catch(
        function(err) {
          //console.log(err.message); // some coding error in handling happened
          res.render('error',{message:err.messagge, error:err});
        })
        .then(values => {
          var sitios = values[0];
          var quedadas = values[1];
          var sitiosBorrables = values[2];
          //console.log(sitios); // some coding error in handling happened
          res.render('nuevoQuedada',{sitios:sitios,quedadas:quedadas,sitiosBorrables:sitiosBorrables,user:usuario});
        });
      });



      // ---------------REVISAR ESTE COMENTARIO-------------------
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
      // ---------------REVISAR ESTE COMENTARIO-------------------
      router.get('/:QUE', isLoggedIn, function (req, res) {
        var usuario = req.session.passport.user;
        var params = {};
        params.que = req.params.QUE;
        // Ejecutamos todas las promesas de búsquedas en la BBDD...
        Promise.all([showQuedadas.execute(), showQuedada.execute(params), showAsiste.execute(params),showCoordenada.execute(params) ])
        .catch(
          function(err) {
            //console.log(err.message); // some coding error in handling happened
            res.render('error',{message:err.messagge, error:err});
          })
          .then(values => {
            var quedadas = values[0];
            var datosQuedada = values[1];
            var asistentes = values[2];
            var arrayCoordenada = _.split(values[3][0].coordenadas, ',');
            var lat = _.trim(arrayCoordenada[0]);
            var lng = _.trim(arrayCoordenada[1]);

            var asiste = asistentes.includes(usuario);
            //console.log(quedadas,datosQuedada,asistentes,coordenada,asiste);
            res.render('quedadas',{quedadas:quedadas, quedada:datosQuedada[0], asistentes:asistentes, lat:lat, lng:lng , user:usuario, asiste:asiste, GoogleMapsAPIkey:def.GoogleMapsAPIkey});
          });
        });


        /**
        * @api {post} /quedada/ Añade una quedada haciendo un post

        * @apiName AddQuedadas
        * @apiGroup Quedadas
        * @apiDescription Añade una quedada
        * @apiVersion 0.0.1
        * @apiExample {curl} Example usage:
        *     curl -i http://localhost:18080/quedada/que=cumpleaños&dia=28-02-2018&hora=20:35&direccion=escuela
        *
        */
        router.post('/', isLoggedIn, function (req, res) {

          var params = {};
          params.que = req.body.que;
          params.direccion = req.body.direccion;
          params.dia = req.body.dia;
          params.hora = req.body.hora;

          Promise.all([showQuedadas.execute()])
          .catch(
            function(err) {
              //console.log(err); // some coding error in handling happened
              var mensaje = "Error en la base de datos";
              res.render('error',{message:mensaje, error:JSON.stringify(err)});
            })
            .then(values => {
              var quedadas = values[0];
              if (quedadas.includes(params.que)){
                var mensaje = "Estás tratando de añadir una quedada que ya existe. quedada.que="+params.que;
                //console.log(mensaje);
                res.render('error',{message:mensaje, error:JSON.stringify(err)});
              } else {
                // console.log("el sitio: "+params.direccion+" NO está dentro de la lista: "+sitios);
                // console.log("lo añado.");

                    Promise.all([addQuedada.execute(params)])
                    .catch(
                      function(err) {
                        //console.log(err); // some coding error in handling happened
                        var mensaje = "Error en la base de datos, probablemente tengas duplicada la entrada. quedada.que="+params.que;
                        res.render('error',{message:mensaje, error:JSON.stringify(err)});
                      })
                      .then(values => {
                        var resultado = values[0];
                        //console.log("ENTRO!!! resultado: "+resultado);
                        if(resultado = []){
                          res.redirect(301,'/quedada/'+params.que);
                        } else {
                          res.render('error',{message:"Ha habido un error.", error:resultado});
                        }
                      });


                  }
                });
              });

              /**
              * @api {delete} /quedada/<que> Elimina una quedada por el <que>
              * @apiName RemoveQuedada
              * @apiGroup Quedada
              * @apiDescription Elimina una quedada
              * @apiVersion 0.0.1
              * @apiExample {curl} Example usage:
              *     delete http://localhost:8080/quedada/cumple
              *
              */
              router.delete('/:QUE', isLoggedIn, function (req, res) {

                var params = {};
                params.que = req.params.QUE;

                // Ejecutamos todas las promesas de búsquedas en la BBDD...
                Promise.all([removeQuedada.execute(params)])
                .catch(
                  function(err) {
                    //console.log(err.message); // some coding error in handling happened
                    res.render('error',{message:err.messagge, error:err});
                  })
                  .then(values => {
                    var quedadas = values[0];
                    //console.log(quedadas); // some coding error in handling happened
                    res.redirect(301,'/quedada/');
                  });
                });
              app.use('/quedada', router);
            };
