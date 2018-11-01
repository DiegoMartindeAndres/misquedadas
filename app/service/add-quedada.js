/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * @module mq2/service/add-quedada
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
 * Statement for all databases.
 * @type {string}
 */
const SQL_ADD_QUEDADA = [
  'INSERT INTO quedada VALUES ({que}, {dia}, {hora}, {direccion})'
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
      const dia = _preparePattern(parametros.dia);
      const hora = _preparePattern(parametros.hora);
      const direccion = _preparePattern(parametros.direccion);
      var sqlStatement = SQL_ADD_QUEDADA;
      var params = {};
      params.que = que;
      params.dia = dia;
      params.hora = hora;
      params.direccion = direccion;

      return conn.query(sqlStatement, params)
        .then(function (databases) {
          if (args.isVerbose()) {
            logger.debug('Your databases: ', JSON.stringify(databases));
          }
          var result = [];
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
