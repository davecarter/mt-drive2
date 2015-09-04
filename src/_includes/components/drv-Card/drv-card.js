(function ( $ ) {
  $.fn.DriveCard = function() {
    return this.each(function() {
      var $self = $(this),
          cardlId = $self.attr('id'),
          $codeToggleBtn = $self.find('[data-card="code-toggle"]'),
          $codeBlock = $self.find('[data-card="code"]');


      var toggleCode = function(e, trigger) {
        $codeToggleBtn.toggleClass('is--open');
        $codeBlock.slideToggle();
      }

      var bindEvents = function() {
        $codeToggleBtn.on('click', function() {
          toggleCode();
          window.bus.emit('say-card-code-toggle', [cardlId]);
        })
      }

      var init = function() {
        $codeToggleBtn.removeClass('is--open');
        // $codeBlock.hide();
        bindEvents();
      }
      init();
    });
  };

  $('[data-card="card"]').DriveCard();

}( jQuery ));


