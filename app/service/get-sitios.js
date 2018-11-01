/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * Obtiene los sitios por la direccion
 * @module mq2/service/get-sitios
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
 * Muestra todos los sitios por la direccion
 * @type {string}
 */
const SQL_GET_SITIO_ALL = [
  'SELECT direccion FROM sitio ORDER BY direccion'
].join('\n');

/**
 *
 * @return {promise} the promise resolve callback has the parameter, that has all databases from mysql server.
 */
module.exports.execute = function () {
  return db.getConnection()
    .then(function (conn) {
      var sqlStatement = SQL_GET_SITIO_ALL;
      var params = {};
      return conn.query(sqlStatement, params)
        .then(function (sitios) {
          if (args.isVerbose()) {
            logger.debug('Your sitios: ', JSON.stringify(quedadas));
          }
          var result = [];
          _.forEach(sitios, function (db) {
            const name = _.values(db)[0];
            result.push(name);
          });
          return result;
        })
        .finally(function () {
          // release the db connection
          conn.release();
        });
    });
};
