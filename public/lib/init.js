(function($){
  $(function(){
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

    function adaptive()
    {
      var width = $(window).width(), height = $(window).height();
      if (width <= 1023) {
        if($('.wrapper-block').hasClass('visible'))
        {
          $('.wrapper-block').transition('fade right');
          $('.wrapper-block').removeClass('visible');
          $('.top-bar .top-bar_logo').removeClass('hidden');
          $('.nav-bar .nav-bar_logo').addClass('hidden');
          $('.top-bar .top-bar_search').addClass('hidden');
          $('.nav-bar .top-bar_search').removeClass('hidden');
          $('.hamburger').removeClass('hidden');

        }
      }
      else {
        $('.wrapper-block').addClass('visible');
        $('.top-bar .top-bar_logo').addClass('hidden');
        $('.nav-bar .nav-bar_logo').removeClass('hidden');
        $('.top-bar .top-bar_search').removeClass('hidden');
        $('.nav-bar .top-bar_search').addClass('hidden');
        $('.hamburger').addClass('hidden');
      }
    };

    $(document).ready(function(){
      adaptive();
    });

    $(window).resize(function(){
      adaptive();
    });

    
    $('.hamburger').click(function(){
      if($('.wrapper-block').hasClass('visible'))
      {
        $('.wrapper-block').removeClass('visible');
      }
      else {
        $('.wrapper-block').addClass('visible');
      }

    });

    // $document.scroll(function() {
    //   if ($document.scrollTop() >= 70) {
    //
    //     $('.wrapper-block').removeClass('pushable');
    //   } else {
    //     $('.wrapper-block').addClass('pushable');
    //   }
    // });

  }); // end of document ready
})(jQuery); // end of jQuery name space
