// Convert CSS time units in millisecond
// Use for sync CSS Animations with setTimeout
// I have better results with this than listening animationend events, but
// probably the other way is less hacky.
// Revise in the future
// http://davidwalsh.name/css-animation-callback

var convertCssTime = function(value) {
  var result = value.replace('s','');
  result = parseFloat(result) * 1000;

  return result;
}
