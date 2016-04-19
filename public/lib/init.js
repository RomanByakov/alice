(function($){
  $(function(){

    $('.addpopup')
    .popup()
    ;


    // User popup init

    $('.top-bar_user .teal')
      .popup({
        popup: $('.user-menu'),
        on: 'click',
        position: 'bottom left'
      });

      
    var $document = $(document),
        $element = $('#some-element'),
        className = 'hasScrolled';

    $document.scroll(function() {
      if ($document.scrollTop() >= 70) {

        $('.wrapper-block').removeClass('pushable');
      } else {
        $('.wrapper-block').addClass('pushable');
      }
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
