(function() {

  // OPEN MODAL
  window.bus.on('say-modal-on', function(e, trigger) {
    window.bus.emit('mt-Modal-show', [trigger]);
    window.bus.emit('mt-Overlay-create', [trigger]);
  });

  // CLOSE MODAL
  window.bus.on('say-modal-off', function(e, trigger) {
    window.bus.emit('mt-Modal-close', [trigger]);
    window.bus.emit('mt-Overlay-close');
  });

  // CLOSE OVERLAY
  window.bus.on('say-overlay-off', function() {
    window.bus.emit('mt-Overlay-close');
    window.bus.emit('mt-Modal-close');
  });

})();
