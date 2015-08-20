(function () {
  var $body = $('body');

  var createOverlay = function(e, triggerId) {
    var triggerZIndex = $('#' + triggerId).css('z-index');

    var $overlay = $('<div>', {
      class: 'mt-Overlay',
      css: {
        'z-index': triggerZIndex - 1
      },
      click: function() {
        window.bus.emit('say-overlay-off');
      }
    });
    $overlay.appendTo($body);
    $body.addClass('is--mt-Overlay-visible');

  };

  var closeOverlay = function() {
    var $overlay = $('.mt-Overlay');
    var fadeOutSpeed = (convertCssTime($overlay.css('animation-duration')));

    $body.removeClass('is--mt-Overlay-visible');

    setTimeout(function() {
      $overlay.remove();
    }, fadeOutSpeed);
  }

  var bindEvents = function() {
    window.bus.on('mt-Overlay-create', createOverlay);
    window.bus.on('mt-Overlay-close', closeOverlay);
  }

  var init = function() {
    bindEvents();
  }

  init();
}());
