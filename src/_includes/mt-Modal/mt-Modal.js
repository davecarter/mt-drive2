(function ( $ ) {
  $.fn.Modal = function() {
    return this.each(function() {
      var $self = $(this),
          $body = $('body'),
          $modalId,
          $modal;

      var showModal = function(e, modalId) {
        var $modal = $('#' + modalId);

        $body.addClass('is--mt-Modal-visible');
        $modal.show();
      }

      var closeModal = function(e, trigger) {
        $body.removeClass('is--mt-Modal-visible');
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
    var modalId = $(this).data('modal-id');

    window.bus.emit('say-modal-on', [modalId]);
    e.preventDefault();
  });

  $('[data-modal="close"]').on('click', function(e) {
    window.bus.emit('say-modal-off');
    e.preventDefault();
  });
}( jQuery ));
