require('./dom.prepend');
require('./dom.remove');
require('./event.mouse');
require('./svg.contains');

/* For Internet Explorer compatibility. */
if (!(window as any).hasOwnProperty('TouchEvent')) {
    (window as any).TouchEvent = {};
}
