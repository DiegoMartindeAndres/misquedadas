/*
* misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
*
* Copyright (c) 2018
*/

/**
* Obtiene las quedadas por el QUE
* @module mq2/service/get-quedada
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

const moment = require('moment');
moment.locale('es');


/**
* Muestra una quedada concreta
* @type {string}
*/
const SQL_GET_QUEDADA = [
  "SELECT * FROM quedada WHERE que={que}"
].join('\n');

/**
*
* @param parametros de momento
* @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
*/
module.exports.execute = function (parametros) {
  return db.getConnection()
  .then(function (conn) {
    const que = _preparePattern(parametros.que);

    var sqlStatement = SQL_GET_QUEDADA;
    var params = {};
    params.que = que;

    return conn.query(sqlStatement, params)
    .then(function (databases) {
      if (args.isVerbose()) {
        logger.debug('Your databases: ', JSON.stringify(databases));
      }

      //console.log(databases);
      var objeto = {};
      if (databases[0]){
        objeto.que = databases[0].que;

        //Formato fecha
        var dia = moment(databases[0].dia).format('YYYY-MM-DD');
        var hora = moment("2013-02-08 " + databases[0].hora).format('HH:mm');
        var fecha = moment(dia +' '+ hora);



        if(moment().isBefore(fecha)){
          var restante = "Quedan " + fecha.fromNow(true) + " para este evento";
        } else{
          var restante = "Este evento ya ha acabado...";
        }
        objeto.dia = fecha.format('dddd DD MMMM YYYY').toUpperCase();

        objeto.hora = fecha.format('HH:mm');

        objeto.restante = restante;

        objeto.direccion = databases[0].direccion;
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
