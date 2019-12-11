/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * Obtiene la imagen de un usuario
 * @module mq2/service/get-imagenUsuario
 *
 * @requires lodash
 * @requires module:mq2/args
 * @requires module:mq2/db
 * @requires module:mq2/logger
 */

'use strict';

const _      = require('lodash');

const args   = require('app/args');
const db     = require('app/db');
const logger = require('app/logger').getLogger('mq2.service');


/**
 * Muestra la imagen de un usuario
 * @type {string}
 */
 const SQL_GET_ASISTE = [
   'SELECT imagen FROM usuario WHERE nombre={usuario}'
 ].join('\n');

 /**
  *
  * @param parametros de momento
  * @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
  */
 module.exports.execute = function (usr) {
   return db.getConnection()
     .then(function (conn) {
       const usuario = _preparePattern(usr);

       var sqlStatement = SQL_GET_ASISTE;
       var params = {};
       params.usuario = usuario;

       return conn.query(sqlStatement, params)
         .then(function (databases) {
           if (args.isVerbose()) {
             logger.debug('Your databases: ', JSON.stringify(databases));
           }

           var result = [];
           _.forEach(databases, function (db) {
             const name = _.values(db)[0];
             result.push(name);
           });
           //console.log("Resultado de consulta de asistencia");
           //console.log(result);
           return result;
         })
         .finally(function () {
           // release the db connection
           conn.release();
         });
     });
 };


 /**
  * Prepare the pattern and replace all '
  * @param {string|null} pattern the like pattern
  * @return {string|null}
  * @private
  */
 function _preparePattern(pattern) {
   if (!pattern) {
     return null;
   }
   return pattern.replace(/\*/g, '%');
 }
