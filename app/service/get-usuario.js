/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* Obtiene un usuario por el nombre
* @module mq2/service/get-usuario
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
* Muestra un usuario por el nombre
* @type {string}
*/
const SQL_GET_USUARIO = [
  'SELECT * FROM usuario WHERE nombre={nombre}'
].join('\n');

/**
*
* @param parametros de momento
* @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
*/
module.exports.execute = function (parametros) {
  return db.getConnection()
  .then(function (conn) {
    const nombre = _preparePattern(parametros.nombre);

    var sqlStatement = SQL_GET_USUARIO;
    var params = {};
    params.nombre = nombre;

    return conn.query(sqlStatement, params)
    .then(function (databases) {
      if (args.isVerbose()) {
        logger.debug('Your usuario: ', JSON.stringify(databases));
      }

      //console.log(databases);
      var objeto = {};
      if (databases[0]){
        objeto.nombre = databases[0].nombre;
        objeto.clave = databases[0].clave;
        objeto.edad = databases[0].edad;
        objeto.imagen = databases[0].imagen;
      }
      var result = [objeto];
      // _.forEach(databases, function (db) {
      //   const name = _.values(db)[0];
      //   result.push(name);
      // });
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
