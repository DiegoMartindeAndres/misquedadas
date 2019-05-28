$(document).ready(function(){
  $(window).scroll(function(){
    if($(this).scrollTop()>=$('nav').height()){
      $('nav').addClass('scrolled');
      return;
    }
    $('nav').removeClass('scrolled');
  });
  if($(window).width()<768){
    $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i>');
    $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i>');
  } else{
    $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i> Nuevo sitio');
    $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i> Borrar sitio');
  }
  $(window).resize(function(){
    if($(window).width()<768){
      $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i>');
      $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i>');
    } else{
      $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i> Nuevo sitio');
      $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i> Borrar sitio');
    }
  });
})
