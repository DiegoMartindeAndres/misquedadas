
# Instalación y pruebas del portal "misquedadas"

## Arranque y acceso al Servidor Personal Virtual

* Arrancar el Servidor Personal desde Moodle de FTEL
* Moodle de la UPM -> Asignatura FTEL -> Tema 6 - Proyecto del curso -> Servidor Personal en la nube DIT: arranque, estado y acceso
* Descargar en la máquina local la clave privada de acceso al servidor según se indica en las instrucciones de la página  anterior
* Acceder, por ssh, al Servidor Personal siguiendo las instrucciones de la misma página

## Instalación de la aplicación
En la consola de comandos del Servidor Personal ejecutar:

```sh
$ cd ~
$ git clone https://github.com/DiegoMartindeAndres/misquedadas.git
$ cd ~/misquedadas
$ npm install
```

## Modificar las claves de acceso a la BBDD y al mapa de Google Maps
Nos acabamos de descargar el código de un repositorio público. No es una buena práctica dejar en los repositorios públicos claves ya cualquiera podría ver las claves y acceder al sistema. Por lo tanto tendremos que añadir a mano dichas claves; las claves se almacenan en un fichero llamado “misquedadas-2.json”. Deberemos editarlo, por ejemplo con Nano (nano misquedadas-2.json)

Los valores concretos están publicados en el Moodle de la asignatura en el artículo "Instalación y pruebas del portal "misquedadas""

## Carga de contenidos
* Rellenar la BBDD misquedadas, de forma similar a como se hizo en la práctica de BBDD, con los datos que se quieran presentar en el portal

## Arranque del servicio
En la consola de comandos del servidor personal ejecutar:

```sh
$ cd ~/misquedadas
$ npm start
```

## Parar el servicio
* Pulsando la combinación de teclas `Ctrl+C`

## Comprobación del Servicio
* NAVEGAR por la aplicación: navegador -> http://`la ip de mi servidor personal`:8080

## Rearranque del servidor y del servicio
Para rearrancar el servicio habrá que concatenar las acciones de parar el servicio y arrancar el servicio. Es decir:
```sh
`Ctrl+C`
$ npm start
```


## License

Diego Martín de Andrés 2018
