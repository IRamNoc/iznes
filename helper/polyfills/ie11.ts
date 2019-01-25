require('./dom.prepend');
require('./dom.remove');
require('./event.mouse');
require('./svg.contains');
require('./element.closest');

/* For Internet Explorer compatibility. */
if (!(window as any).hasOwnProperty('TouchEvent')) {
    (window as any).TouchEvent = {};
}

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
