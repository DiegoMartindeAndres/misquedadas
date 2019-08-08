$(document).ready(function(){
  $(window).scroll(function(){
    if($(this).scrollTop()>=$('nav').height()){
      if($(window).width()<768){
        $('nav').addClass('scrolled');
      }
      $('.lista-quedadas-container.desplegable').addClass('scrolled');
      return;
    }
    $('nav').removeClass('scrolled');
    $('.lista-quedadas-container.desplegable').removeClass('scrolled');
  });
  if($(window).width()<768){
    $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i>');
    $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i>');
    $('.otras-quedadas-toggle .nav-tag').html("");
    $('.atras-arrow .nav-tag').html("");
    $('.logout-button .nav-tag').html("");
  } else{
    $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i> Nuevo sitio');
    $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i> Borrar sitio');
    $('.otras-quedadas-toggle .nav-tag').html("Otras");
    $('.atras-arrow .nav-tag').html("Atrás");
    $('.logout-button .nav-tag').html("Logout");
  }
  $(window).resize(function(){
    if($(window).width()<768){
      $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i>');
      $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i>');
      $('.otras-quedadas-toggle .nav-tag').html("");
      $('.atras-arrow .nav-tag').html("");
      $('.logout-button .nav-tag').html("");
    } else{
      $('#botonNuevoSitio').html('<i class="far fa-plus-square"></i> Nuevo sitio');
      $('#botonEliminarSitio').html('<i class="far fa-trash-alt"></i> Borrar sitio');
      $('.otras-quedadas-toggle .nav-tag').html("Otras");
      $('.atras-arrow .nav-tag').html("Atrás");
      $('.logout-button .nav-tag').html("Logout");
    }
  });
  $('.otras-quedadas-toggle').on('click',function(){
    //$('.otras-quedadas-toggle i').toggleClass('rotated');
    $('.overlay').toggleClass('hidden');
    $('.lista-quedadas-container.desplegable').toggleClass('displayed');
    $('body').toggleClass('noscroll');
  })
  $('.overlay').on('click',function(){
    $('.otras-quedadas-toggle').click();
  })

})
