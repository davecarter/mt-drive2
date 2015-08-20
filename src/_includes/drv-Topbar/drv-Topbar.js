(function ( $ ) {
  $.fn.Topbar = function() {
    return this.each(function() {
      var $self = $(this),
          topbarId = $self.attr('id'),
          $body = $('body'),
          topbarIsClose = true;

      var createToggleButton = function() {
        var $toggleButtonContainer = ('[data-topbar="btn-container"]');

        var $toggleButton = $('<div>', {
          text: 'Menu',
          class: 'drv-MainNav-toggleBtn',
          click: function() {
            if(topbarIsClose) {
              window.bus.emit('say-main-nav-on', [topbarId]);
            } else {
              window.bus.emit('say-main-nav-off');
            }
          }
        });
        $toggleButton.prependTo($toggleButtonContainer);
      }

      var toggleMainNav = function() {
        if(topbarIsClose) {
          $body.removeClass('is--drv-MainNav-open');
        } else {
          $body.addClass('is--drv-MainNav-open');
        }
      }

      var bindEvents = function() {
        window.bus.on('drv-MainNav-open', function(){
            topbarIsClose = false;
            toggleMainNav();
        });
        window.bus.on('drv-MainNav-close', function(){
            topbarIsClose = true;
            toggleMainNav();
        });
      }

      var init = function() {
        bindEvents();
        createToggleButton();
      }

      init();
    });
  };
}( jQuery ));
