(function () {
  var $body = $('body');

  var createOverlay = function(e, trigger) {
    var $overlay = $('<div>', {
      class: 'mt-overlay',
      click: function() {
        window.bus.emit('say-overlay-off');
      }
    });
    $overlay.appendTo($body);
    $body.addClass('is--modal-open');
  };

  var closeOverlay = function() {
    $('.mt-overlay').remove();
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
