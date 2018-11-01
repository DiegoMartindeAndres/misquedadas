/*
 * misquedadas2 - https://github.com/DiegoMartindeAndres/misquedadas.git
 *
 * Copyright (c) 2018
 */

/**
 * The application of express.
 *
 * @module mq2/application
 *
 * @requires body-parser
 * @requires express
 * @requires q
 * @requires module:mq2/info
 * @requires module:mq2/config-util
 * @requires module:mq2/logger
 * @requires module:mq2/middleware
 * @requires module:mq2/router/mysql
 */

'use strict';

const bodyParser      = require('body-parser');
const express         = require('express');
const Q               = require('q');
// Necesario para el passport
var passport = require('passport');

var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
// fin de lo necesario para el passport

const info            = require('app/info');
const configUtil      = require('app/config-util');
const logger          = require('app/logger').getLogger('mq2');

const middleware      = require('app/middleware');

const routerMySQL       = require('app/router/api-mysql');
const routerAPIQuedada  = require('app/router/api-quedada');
const routerAPIUsuario  = require('app/router/api-usuario');
const routerAPIAsiste   = require('app/router/api-asiste');
const routerAPISitio    = require('app/router/api-sitio');

//quitar
const routerAPIPruebaUsuario = require('app/router/usuario');

const routerQuedada     = './router/quedada.js';
const routerSitio     = './router/sitio.js';
const routerLogin     = './router/login.js';

const path = require('path');

const methodOverride = require('method-override');

const app = express();

const DEFAULT_HOST    = 'localhost';



/**
 * starts the application.
 *
 * @param {object} settings
 * @return {promise} the promise resolve callback is returns after the application is listening.
 */
module.exports.start = function (settings) {

  // add the config instance under "config".
  app.set('settings', settings);
  // set the application title
  app.set('title', info.getAppTitle());

  var viewsPath = path.normalize(__dirname + '/views' );
  //console.log(viewsPath);
  app.set('views', viewsPath);
  app.set('view engine', 'ejs');

  // Middlewares...

  app.use(middleware.measureTime());

  // Necesario para hacer funcionar el passport
  require('./configPassport')(passport);

  app.use(cookieParser());
  //app.use(bodyParser());
  app.use(bodyParser.json());
  //Prueba para ver si funciona con dos parsers
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(methodOverride('_method'));

  app.use(express.static(path.join(__dirname, 'public')));
  // Routers...

  app.use('/mysql', routerMySQL);


  app.use(session({ secret: 'i<3ftel-LaMejorAsignaturaDelMundo',
                   saveUninitialized:true,
                    resave: true })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session



  // TODO Add here your routers
  //Estas rutas del API REST no llevan autentificación
  //(probar a ver que pasa si se puede hacer)
  app.get('/', function(req, res) {
      res.redirect('/quedada');
  });

  app.use('/api/quedada', routerAPIQuedada);
  app.use('/api/usuario', routerAPIUsuario);
  app.use('/api/asiste', routerAPIAsiste);
  app.use('/api/sitio', routerAPISitio);

  //------
  //prueba
  //------
  app.use('/usuario', routerAPIPruebaUsuario);

  //Estas rutas tienes que estar logeado
  require(routerLogin)(app,passport);
  require(routerQuedada)(app,passport);
  require(routerSitio)(app,passport);

  // Endpoints...

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/login');
  });

  // Error en las páginas.
  app.get('*', function(req, res){
      res.status(404).render('404');
  });

  /**
   * @api {get} /about About
   * @apiName GetAbout
   * @apiGroup System
   * @apiDescription Shows the information about the application
   * @apiVersion 0.0.1
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:18080/about
   *
   * @apiSuccess {String} name the application name
   * @apiSuccess {String} title the title of the application
   * @apiSuccess {String} version the version of the application
   * @apiSuccess {String} vendor the author / company of the application
   * @apiSuccess {String} description a short description.
   *
   * @apiSuccessExample {json} Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "name": "dummy-rest",
   *       "title": "Dummy Rest Interface",
   *       "version": "0.0.1",
   *       "vendor": "Dummy <dummy@example.com>",
   *       "description": "This is a dummy service",
   *       "build": "20161004-133401"
   *     }
   */
  app.get('/about', function about(req, res) {
    res.send({
      name: info.getAppName(),
      title: info.getAppTitle(),
      version: info.getAppVersion(),
      vendor: info.getAppVendor(),
      description: info.getAppDescription(),
      build: info.getBuildTimestamp()
    });
  });

  // Starting...

  // get the port and host
  const port = configUtil.getSetting(settings, 'server.port', 0);
  const host = configUtil.getSetting(settings, 'server.host', DEFAULT_HOST);

  const done = Q.defer();

  if (port > 0) {
    // starts the listening of the express application...
    app.listen(port, host, function () {
      logger.info('Server is listen http://', host, ':', port);
      done.resolve(true);
    });
  } else {
    // missing the port for the server...
    process.nextTick(function () {
      done.reject('Missing the setting property "server.port"!');
    });
  }

  return done.promise;
};
