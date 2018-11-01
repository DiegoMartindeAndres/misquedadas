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
const showSitios = require('app/service/get-sitios');
const addSitio = require('app/service/add-sitio');
const removeSitio = require('app/service/remove-sitio');

const _ = require('lodash');
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



  /**
  * @api {post} /sitio Añade un nuevo sitio
  * @apiName AddSitio
  * @apiGroup Sitio
  * @apiDescription Añade un sitio
  * @apiVersion 0.0.1
  * @apiExample {curl} Example usage:
  *     post -i http://localhost:18080/sitio/direccion=casa azul&lat=40.942132&lng=-4.103217
  *
  * Si existe el sitio por <direccion> se manda error, si no se añade y se
  * redirecciona a /quedada/nuevo
  */
  router.post('/', isLoggedIn, function (req, res) {
    var params = {};
    params.direccion = req.body.direccion;
    params.coordenadas = req.body.lat + ", " + req.body.lng;

    //console.log(params);
    Promise.all([showSitios.execute()])
    .catch(
      function(err) {
        //console.log(err); // some coding error in handling happened
        var mensaje = "Error en la base de datos";
        res.render('error',{message:mensaje, error:JSON.stringify(err)});
      })
      .then(values => {
        var sitios = values[0];
        if (sitios.includes(params.direccion)){
          var mensaje = "Estás tratando de añadir un sitio que ya existe. sitio.direccion="+params.direccion;
          //console.log(mensaje);
          res.render('error',{message:mensaje, error:JSON.stringify(err)});
        } else {
          // console.log("el sitio: "+params.direccion+" NO está dentro de la lista: "+sitios);
          // console.log("lo añado.");

          Promise.all([addSitio.execute(params)])
          .catch(
            function(err) {
              //console.log(err); // some coding error in handling happened
              var mensaje = "Error en la base de datos, probablemente tengas duplicada la entrada. sitio.direccion="+params.direccion;
              res.render('error',{message:mensaje, error:JSON.stringify(err)});
            })
            .then(values => {
              var resultado = values[0];
              if(resultado = []){
                res.redirect(301,'/quedada/nuevo');
              } else {
                res.render('error',{message:"Ha habido un error.", error:resultado});
              }
            });


          }
        });
      });


        router.get('/nuevo', isLoggedIn, function (req, res) {
          var usuario = req.session.passport.user;
          // Ejecutamos todas las promesas de búsquedas en la BBDD...
          Promise.all([showSitios.execute()])
          .catch(
            function(err) {
              //console.log(err.message); // some coding error in handling happened
              res.render('error',{message:err.messagge, error:err});
            })
            .then(values => {
              var sitios = values[0];
              //console.log(sitios); // some coding error in handling happened
              res.render('nuevoSitio',{sitios:sitios,user:usuario, GoogleMapsAPIkey:def.GoogleMapsAPIkey});
            });
          });

          /**
          * @api {delete} /sitio/<direccion> Elimina un sitio por la direccion
          * @apiName RemoveSitio
          * @apiGroup Sitio
          * @apiDescription Elimina un sitio
          * @apiVersion 0.0.1
          * @apiExample {curl} Example usage:
          *     delete http://localhost:8080/sitio/sol
          *
          */
          router.delete('/:DIRECCION', isLoggedIn, function (req, res) {

            var params = {};
            params.direccion = req.params.DIRECCION;

            // Ejecutamos todas las promesas de búsquedas en la BBDD...
            Promise.all([removeSitio.execute(params)])
            .catch(
              function(err) {
                //console.log(err.message); // some coding error in handling happened
                res.render('error',{message:err.messagge, error:err});
              })
              .then(values => {
                var sitios = values[0];
                //console.log(sitios); // some coding error in handling happened
                res.redirect(301,'/quedada/nuevo');
              });


            });


          app.use('/sitio', router);
        };
