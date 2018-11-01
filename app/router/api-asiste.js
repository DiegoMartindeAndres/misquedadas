/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * @module mq2/router/api-asiste
 *
 * @requires express
 * @requires mq2/executor
 * @requires mq2/service/add-asiste
 */

'use strict';

const express = require('express');

const executor      = require('app/executor');
const showAsiste = require('app/service/get-asiste');
const addAsiste = require('app/service/add-asiste');
const removeAsiste = require('app/service/remove-asiste');


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
 * @api {get} /asiste/<que> Obtiene una lista de quien asiste
 * a una quedada por el <que>
 * @apiName GetAsiste
 * @apiGroup Asiste
 * @apiDescription Devuelve una lista de personas que asisten a una
 * quedada por el qué
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/asiste/compras
 *
 * @apiSuccess {String} status `okay` si todo bien
 *                      status  `error' si error
 * @apiSuccess {[]String} array con la quedada concreta.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay",
 *       "asiste": [
            "nombre": "epi",
            "nombre": "blas"
 *       ]
 *     }
 */
router.get('/:QUE', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.params.QUE;
    sender(showAsiste.execute(params), 'asistentes');
  });
});


/**
 * @api {put} api/asiste/ Añade una asistencia a una quedada haciendo un PUT
 * @apiName AddAsiste
 * @apiGroup Asiste
 * @apiDescription Añade una asistencia a una quedada
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/asiste/
 *
 * @apiSuccess {String} status `okay` si todo va bien
 *                            `error` si hay un error
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "okay"
 *     }
 * Se debe recibir en el body una asistencia con el siguiente formato:
 * {
  "que": "compras",
  "nombre": "epi"
  }
 */
router.put('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.body.que;
    params.nombre = req.body.nombre;

      sender(addAsiste.execute(params),'AddAsiste');
  });
});


/**
 * @api {post} /asiste/ Añade una asistencia a una quedada haciendo un POST
 o la elimina si ya existe.
 * @apiName AddAsiste
 * @apiGroup Asiste
 * @apiDescription Añade una asistencia a una quedada
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     post -i http://localhost:18080/apis/asiste/
 *
 * Se debe recibir en la URL el <que> de la quedada y el <nombre> del asistente.
 */
router.post('/', function (req, res) {
    var params = {};
    params.que = req.query.que;
    params.nombre = req.query.nombre;


    Promise.all([showAsiste.execute(params)])
    .catch(
      function(err) {
        //console.log(err); // some coding error in handling happened
        var mensaje = "Error en la base de datos";
        res.render('error',{message:mensaje, error:JSON.stringify(err)});
      })
      .then(values => {
        var asistentes = values[0];
        if (asistentes.includes(params.nombre)){
            // console.log("el asistente: "+params.nombre+" está dentro de la lista: "+asistentes);
            // console.log("lo borro.");

            Promise.all([removeAsiste.execute(params)])
            .catch(
              function(err) {
                //console.log(err); // some coding error in handling happened
                var mensaje = "Error en la base de datos, probablemente no tengas la entrada. Quedada.que="+params.que+" y nombre="+params.nombre;
                res.render('error',{message:mensaje, error:JSON.stringify(err)});
              })
              .then(values => {
                var resultado = values[0];
                if(resultado = []){
                  res.redirect(301,'/quedada/'+params.que);
                } else {
                  res.render('error',{message:"Ha habido un error.", error:resultado});
                }
              });

        } else {
          // console.log("el asistente: "+params.nombre+" NO está dentro de la lista: "+asistentes);
          // console.log("lo añado.");

          Promise.all([addAsiste.execute(params)])
          .catch(
            function(err) {
              //console.log(err); // some coding error in handling happened
              var mensaje = "Error en la base de datos, probablemente tengas duplicada la entrada. Quedada.que="+params.que+" y nombre="+params.nombre;
              res.render('error',{message:mensaje, error:JSON.stringify(err)});
            })
            .then(values => {
              var resultado = values[0];
              if(resultado = []){
                res.redirect(301,'/quedada/'+params.que);
              } else {
                res.render('error',{message:"Ha habido un error.", error:resultado});
              }
            });


        }
      });


    // Promise.all([addAsiste.execute(params),showAsiste.execute(params)])
    // .catch(
    //   function(err) {
    //     //console.log(err); // some coding error in handling happened
    //     var mensaje = "Error en la base de datos, probablemente tengas duplicada la entrada. Quedada.que="+params.que+" y nombre="+params.nombre;
    //     res.render('error',{message:mensaje, error:JSON.stringify(err)});
    //   })
    //   .then(values => {
    //     var resultado = values[0];
    //     if(resultado = []){
    //       res.redirect(301,'/quedada/'+params.que);
    //     } else {
    //       res.render('error',{message:"Ha habido un error.", error:resultado});
    //     }
    //
    //   });


});



/**
 * @api {delete} /asiste/ Elimina una asistencia por el <que> y <nombre>
 * @apiName RemoveAsiste
 * @apiGroup Asiste
 * @apiDescription Elimina una asistencia
 * @apiVersion 0.0.1
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:18080/asiste/
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
router.delete('/', function (req, res) {
  executor.execute(req, res, function (sender) {
    var params = {};
    params.que = req.body.que;
    params.nombre = req.body.nombre;

      sender(removeAsiste.execute(params),'RemoveAsiste');
  });
});



//
// Exports the router
//
module.exports = router;
