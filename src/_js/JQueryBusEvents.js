class JQueryBusEvents extends BusEvents{
  constructor($=window.jQuery){
    super();
    this.$ = $;
  }
  on(event, fn) {
    this.$(document).on(event, fn)
  }

  emit(event, ...data){
    this.$(document).trigger.apply(this.$(document), [event].concat(data));
  }
}

window.bus = new JQueryBusEvents();
