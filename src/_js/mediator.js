(function() {

  // OPEN MODAL
  window.bus.on('modal-on', function(e, trigger) {
    window.bus.emit('modal-show', [trigger]);
    window.bus.emit('overlay-create', [trigger]);
  });

  // CLOSE MODAL
  window.bus.on('modal-off', function(e, trigger) {
    window.bus.emit('modal-close', [trigger]);
    window.bus.emit('overlay-close');
  });

  // CLOSE OVERLAY
  window.bus.on('overlay-off', function() {
    window.bus.emit('modal-close');
    window.bus.emit('overlay-close');
  });

})();
