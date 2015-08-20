(function() {

  // OPEN MAIN NAV
  window.bus.on('say-main-nav-on', function(e, triggerId) {
    window.bus.emit('drv-MainNav-open');
    window.bus.emit('mt-Overlay-create', [triggerId]);
    window.bus.emit('mt-Modal-close');
  });

  // CLOSE MAIN NAV
  window.bus.on('say-main-nav-off', function() {
    window.bus.emit('drv-MainNav-close');
    window.bus.emit('mt-Overlay-close');
  });

  // // OPEN MODAL
  window.bus.on('say-modal-on', function(e, modalId) {
    window.bus.emit('mt-Modal-show', [modalId]);
    window.bus.emit('mt-Overlay-create', [modalId]);
  });

  // CLOSE MODAL
  window.bus.on('say-modal-off', function() {
    window.bus.emit('mt-Modal-close');
    window.bus.emit('mt-Overlay-close');
  });

  // CLOSE OVERLAY
  window.bus.on('say-overlay-off', function() {
    window.bus.emit('mt-Overlay-close');
    window.bus.emit('drv-MainNav-close');
    window.bus.emit('mt-Modal-close');
  });

})();
