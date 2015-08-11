(function ( $ ) {
  $.fn.Modal = function() {
    return this.each(function() {
      var $self = $(this),
          $body = $('body'),
          $modalId,
          $modal;

      var showModal = function(e, trigger) {
        $modalId = $(trigger).data('modal-id');
        var $modal = $('#' + $modalId);

        $body.addClass('is--modal-open');
        $modal.show();
      }

      var closeModal = function(e, trigger) {
        $body.removeClass('is--modal-open');
        $self.hide();
      }

      var bindEvents = function() {
        window.bus.on('mt-Modal-show', showModal);
        window.bus.on('mt-Modal-close', closeModal);
      }

      var init = function() {
        bindEvents();
      }

      init();
    });
  };

  $('[data-modal="modal"]').Modal();

  $('[data-modal="open"]').on('click', function(e) {
    window.bus.emit('say-modal-on', [this]);
    e.preventDefault();
  });

  $('[data-modal="close"]').on('click', function(e) {
    window.bus.emit('say-modal-off', [this]);
    e.preventDefault();
  });
}( jQuery ));
