// app/configPassport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// Poner todas las promesas para conseguir las cosas.
const showUsuario = require('./service/get-usuario');
const _ = require('lodash');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(usuario, done) {
    done(null, usuario.nombre);
  });

  // used to deserialize the user
  passport.deserializeUser(function(nombre, done) {
    var params = {};
    params.nombre = nombre;

    // Buscar por el usuario o mandar el error
    Promise.all([showUsuario.execute(params)])
    .catch(
      function(err) {
        //console.log(err); // some coding error in handling happened
        done(err,null);
      })
      .then(values => {
        //console.log(values[0][0]); // some coding error in handling happened
        if (_.isEmpty(values[0][0])){
          done("No existe usuario.",null);
        } else {
          done(null,values[0][0]);
        }
      });

      // Como se hacía.
      // User.findById(nombre, function(err, usuario) {
      //     done(err, usuario);
      // });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'nombre',
        passwordField : 'clave',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, nombre, clave, done) { // callback with email and password from our form

      var params = {};
      params.nombre = nombre;
      //console.log("Nombre: ",nombre," Clave: ",clave);
      // Buscar por el usuario o mandar el error
      Promise.all([showUsuario.execute(params)])
      .catch(
        function(err) {
          console.log(err); // some coding error in handling happened
          done(err);
        })
        .then(values => {
          //console.log(values[0][0]);
          var usuario = values[0][0];
          if (_.isEmpty(usuario)){
            return done(null, false, req.flash('loginMessage', 'No existe el usuario.')); // req.flash is the way to set flashdata using connect-flash
          } else {
            if (usuario.clave == clave){
              return done(null, usuario);
            } else {

                return done(null, false, req.flash('loginMessage', 'Oops! Fallo en la clave.')); // create the loginMessage and save it to session as flashdata
            }

          }
        });



        // //-----------
        // // find a user whose email is the same as the forms email
        // // we are checking to see if the user trying to login already exists
        // User.findOne({ 'local.email' :  email }, function(err, user) {
        //     // if there are any errors, return the error before anything else
        //     if (err)
        //         return done(err);
        //
        //     // if no user is found, return the message
        //     if (!user)
        //         return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        //
        //     // if the user is found but the password is wrong
        //     if (!user.validPassword(password))
        //         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        //
        //     // all is well, return successful user
        //     return done(null, user);
        // });
        //
        // //---------------

    }));

};
