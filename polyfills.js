// Function bind polyfill
Function.prototype.bind=(function(){}).bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}function c(){}var a=[].slice,f=a.call(arguments,1),e=this,d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};

// Array indexOf polyfill
[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});

// Array isArray polyfill
Array.isArray||(Array.isArray=function(vArg){return Object.prototype.toString.call(vArg)==="[object Array]";});

// Array forEach polyfill
[].forEach||(Array.prototype.forEach=function(a,b){"use strict";var c,d;if(null===this)throw new TypeError("this is null or not defined");var e,f=Object(this),g=f.length>>>0;if("[object Function]"!=={}.toString.call(a))throw new TypeError(a+" is not a function");for(arguments.length>=2&&(c=b),d=0;g>d;)d in f&&(e=f[d],a.call(c,e,d,f)),d++});
