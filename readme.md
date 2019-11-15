
# Instalación y pruebas del portal "misquedadas"

## Arranque y acceso al Servidor Personal Virtual

* Arrancar el Servidor Personal desde Moodle de FTEL
* Moodle de la UPM -> Asignatura FTEL -> Tema 6 - Proyecto del curso -> Servidor Personal en la nube DIT: arranque, estado y acceso
* Descargar en la máquina local la clave privada de acceso al servidor según se indica en las instrucciones de la página  anterior
* Acceder, por ssh, al Servidor Personal siguiendo las instrucciones de la misma página

***Nota importante antes de la instalación***: El servidor personal en la nube tiene instaladas las herramientas necesarias para poder realizar el proyecto final  como un servidor HTTP Apache, un servidor Node.js o el gestor de bases de datos MySQL.

NO ES NECESARIO QUE INSTALE SOFTWARE ADICIONAL usando instrucciones como <apt-get -installl>.

La instalación de software adicional puede incurrir en el crecimiento de la cuota de disco y por lo tanto se procederá al reseteo de la máquina como medida cautelar.

## Instalación de la aplicación
En la consola de comandos del Servidor Personal ejecutar:

```sh
$ cd ~
$ git clone https://github.com/DiegoMartindeAndres/misquedadas.git
$ cd ~/misquedadas
$ npm install
```
***Nota***: es posible que después de ejecutar la acción "npm install" nos devuelva un mensaje diciendo que tenemos vulnerabilidades (found 5 vulnerabilities (2 low, 1 moderate, 2 high)). No es importante, simplemente haz caso omiso.

## Configurar la aplicación
Nos acabamos de descargar el código de la aplicación de un repositorio público. No es una buena práctica dejar en los repositorios públicos claves, como el del acceso a nuestra base de datos, ya cualquiera podría ver las claves y acceder a nuestro al sistema. Por lo tanto tendremos que añadir a mano dichas claves y configurar la IP de nuestro servidor en la nube. Esta información está almacenada en un fichero llamado “~/misquedadas/misquedadas-2.json”. Deberemos editarlo, por ejemplo con Nano (nano ~/misquedadas/misquedadas-2.json)
Debemos cambiar la siguiente línea para poner entre comillas la IP de tú servidor:
```sh
"host": "IP de tu servidor"
```

También debemos cambiar la línea, para colocar la clave que utilizamos para acceder a la BBDD
```sh
"password": "Clave de la base de datos",
```
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
