(function() {
  $('#btn').on('click', function(){
    window.bus.emit('close-modal');
  });
}());
