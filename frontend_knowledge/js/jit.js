/*
Copyright (c) 2011 Sencha Inc. - Author: Nicolas Garcia Belmonte (http://philogb.github.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */
 (function () { 

/*
  File: Core.js

 */

/*
 Object: $jit
 
 Defines the namespace for all library Classes and Objects. 
 This variable is the *only* global variable defined in the Toolkit. 
 There are also other interesting properties attached to this variable described below.
 */
window.$jit = function(w) {
  w = w || window;
  for(var k in $jit) {
    if($jit[k].$extend) {
      w[k] = $jit[k];
    }
  }
};

$jit.version = '2.0.1';
/*
  Object: $jit.id
  
  Works just like *document.getElementById*
  
  Example:
  (start code js)
  var element = $jit.id('elementId');
  (end code)

*/

/*
 Object: $jit.util
 
 Contains utility functions.
 
 Some of the utility functions and the Class system were based in the MooTools Framework 
 <http://mootools.net>. Copyright (c) 2006-2010 Valerio Proietti, <http://mad4milk.net/>. 
 MIT license <http://mootools.net/license.txt>.
 
 These methods are generally also implemented in DOM manipulation frameworks like JQuery, MooTools and Prototype.
 I'd suggest you to use the functions from those libraries instead of using these, since their functions 
 are widely used and tested in many different platforms/browsers. Use these functions only if you have to.
 
 */
var $ = function(d) {
  return document.getElementById(d);
};

$.empty = function() {
};

/*
  Method: extend
  
  Augment an object by appending another object's properties.
  
  Parameters:
  
  original - (object) The object to be extended.
  extended - (object) An object which properties are going to be appended to the original object.
  
  Example:
  (start code js)
  $jit.util.extend({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.extend = function(original, extended) {
  for ( var key in (extended || {}))
    original[key] = extended[key];
  return original;
};

$.lambda = function(value) {
  return (typeof value == 'function') ? value : function() {
    return value;
  };
};

$.time = Date.now || function() {
  return +new Date;
};

/*
  Method: splat
  
  Returns an array wrapping *obj* if *obj* is not an array. Returns *obj* otherwise.
  
  Parameters:
  
  obj - (mixed) The object to be wrapped in an array.
  
  Example:
  (start code js)
  $jit.util.splat(3);   //[3]
  $jit.util.splat([3]); //[3]
  (end code)
*/
$.splat = function(obj) {
  var type = $.type(obj);
  return type ? ((type != 'array') ? [ obj ] : obj) : [];
};

$.type = function(elem) {
  var type = $.type.s.call(elem).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
  if(type != 'object') return type;
  if(elem && elem.$$family) return elem.$$family;
  return (elem && elem.nodeName && elem.nodeType == 1)? 'element' : type;
};
$.type.s = Object.prototype.toString;

/*
  Method: each
  
  Iterates through an iterable applying *f*.
  
  Parameters:
  
  iterable - (array) The original array.
  fn - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.each([3, 4, 5], function(n) { alert('number ' + n); });
  (end code)
*/
$.each = function(iterable, fn) {
  var type = $.type(iterable);
  if (type == 'object') {
    for ( var key in iterable)
      fn(iterable[key], key);
  } else {
    for ( var i = 0, l = iterable.length; i < l; i++)
      fn(iterable[i], i);
  }
};

$.indexOf = function(array, item) {
  if(Array.indexOf) return array.indexOf(item);
  for(var i=0,l=array.length; i<l; i++) {
    if(array[i] === item) return i;
  }
  return -1;
};

/*
  Method: map
  
  Maps or collects an array by applying *f*.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.map([3, 4, 5], function(n) { return n*n; }); //[9, 16, 25]
  (end code)
*/
$.map = function(array, f) {
  var ans = [];
  $.each(array, function(elem, i) {
    ans.push(f(elem, i));
  });
  return ans;
};

/*
  Method: reduce
  
  Iteratively applies the binary function *f* storing the result in an accumulator.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  opt - (optional|mixed) The starting value for the acumulator.
  
  Example:
  (start code js)
  $jit.util.reduce([3, 4, 5], function(x, y) { return x + y; }, 0); //12
  (end code)
*/
$.reduce = function(array, f, opt) {
  var l = array.length;
  if(l==0) return opt;
  var acum = arguments.length == 3? opt : array[--l];
  while(l--) {
    acum = f(acum, array[l]);
  }
  return acum;
};

/*
  Method: merge
  
  Merges n-objects and their sub-objects creating a new, fresh object.
  
  Parameters:
  
  An arbitrary number of objects.
  
  Example:
  (start code js)
  $jit.util.merge({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.merge = function() {
  var mix = {};
  for ( var i = 0, l = arguments.length; i < l; i++) {
    var object = arguments[i];
    if ($.type(object) != 'object')
      continue;
    for ( var key in object) {
      var op = object[key], mp = mix[key];
      mix[key] = (mp && $.type(op) == 'object' && $.type(mp) == 'object') ? $
          .merge(mp, op) : $.unlink(op);
    }
  }
  return mix;
};

$.unlink = function(object) {
  var unlinked;
  switch ($.type(object)) {
  case 'object':
    unlinked = {};
    for ( var p in object)
      unlinked[p] = $.unlink(object[p]);
    break;
  case 'array':
    unlinked = [];
    for ( var i = 0, l = object.length; i < l; i++)
      unlinked[i] = $.unlink(object[i]);
    break;
  default:
    return object;
  }
  return unlinked;
};

$.zip = function() {
  if(arguments.length === 0) return [];
  for(var j=0, ans=[], l=arguments.length, ml=arguments[0].length; j<ml; j++) {
    for(var i=0, row=[]; i<l; i++) {
      row.push(arguments[i][j]);
    }
    ans.push(row);
  }
  return ans;
};

/*
  Method: rgbToHex
  
  Converts an RGB array into a Hex string.
  
  Parameters:
  
  srcArray - (array) An array with R, G and B values
  
  Example:
  (start code js)
  $jit.util.rgbToHex([255, 255, 255]); //'#ffffff'
  (end code)
*/
$.rgbToHex = function(srcArray, array) {
  if (srcArray.length < 3)
    return null;
  if (srcArray.length == 4 && srcArray[3] == 0 && !array)
    return 'transparent';
  var hex = [];
  for ( var i = 0; i < 3; i++) {
    var bit = (srcArray[i] - 0).toString(16);
    hex.push(bit.length == 1 ? '0' + bit : bit);
  }
  return array ? hex : '#' + hex.join('');
};

/*
  Method: hexToRgb
  
  Converts an Hex color string into an RGB array.
  
  Parameters:
  
  hex - (string) A color hex string.
  
  Example:
  (start code js)
  $jit.util.hexToRgb('#fff'); //[255, 255, 255]
  (end code)
*/
$.hexToRgb = function(hex) {
  if (hex.length != 7) {
    hex = hex.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
    hex.shift();
    if (hex.length != 3)
      return null;
    var rgb = [];
    for ( var i = 0; i < 3; i++) {
      var value = hex[i];
      if (value.length == 1)
        value += value;
      rgb.push(parseInt(value, 16));
    }
    return rgb;
  } else {
    hex = parseInt(hex.slice(1), 16);
    return [ hex >> 16, hex >> 8 & 0xff, hex & 0xff ];
  }
};

$.destroy = function(elem) {
  $.clean(elem);
  if (elem.parentNode)
    elem.parentNode.removeChild(elem);
  if (elem.clearAttributes)
    elem.clearAttributes();
};

$.clean = function(elem) {
  for (var ch = elem.childNodes, i = 0, l = ch.length; i < l; i++) {
    $.destroy(ch[i]);
  }
};

/*
  Method: addEvent
  
  Cross-browser add event listener.
  
  Parameters:
  
  obj - (obj) The Element to attach the listener to.
  type - (string) The listener type. For example 'click', or 'mousemove'.
  fn - (function) The callback function to be used when the event is fired.
  
  Example:
  (start code js)
  $jit.util.addEvent(elem, 'click', function(){ alert('hello'); });
  (end code)
*/
$.addEvent = function(obj, type, fn) {
  if (obj.addEventListener)
    obj.addEventListener(type, fn, false);
  else
    obj.attachEvent('on' + type, fn);
};

$.addEvents = function(obj, typeObj) {
  for(var type in typeObj) {
    $.addEvent(obj, type, typeObj[type]);
  }
};

$.hasClass = function(obj, klass) {
  return (' ' + obj.className + ' ').indexOf(' ' + klass + ' ') > -1;
};

$.addClass = function(obj, klass) {
  if (!$.hasClass(obj, klass))
    obj.className = (obj.className + " " + klass);
};

$.removeClass = function(obj, klass) {
  obj.className = obj.className.replace(new RegExp(
      '(^|\\s)' + klass + '(?:\\s|$)'), '$1');
};

$.getPos = function(elem) {
  var offset = getOffsets(elem);
  var scroll = getScrolls(elem);
  return {
    x: offset.x - scroll.x,
    y: offset.y - scroll.y
  };

  function getOffsets(elem) {
    var position = {
      x: 0,
      y: 0
    };
    while (elem && !isBody(elem)) {
      position.x += elem.offsetLeft;
      position.y += elem.offsetTop;
      elem = elem.offsetParent;
    }
    return position;
  }

  function getScrolls(elem) {
    var position = {
      x: 0,
      y: 0
    };
    while (elem && !isBody(elem)) {
      position.x += elem.scrollLeft;
      position.y += elem.scrollTop;
      elem = elem.parentNode;
    }
    return position;
  }

  function isBody(element) {
    return (/^(?:body|html)$/i).test(element.tagName);
  }
};

$.event = {
  get: function(e, win) {
    win = win || window;
    return e || win.event;
  },
  getWheel: function(e) {
    return e.wheelDelta? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  },
  isRightClick: function(e) {
    return (e.which == 3 || e.button == 2);
  },
  getPos: function(e, win) {
    // get mouse position
    win = win || window;
    e = e || win.event;
    var doc = win.document;
    doc = doc.documentElement || doc.body;
    //TODO(nico): make touch event handling better
    if(e.touches && e.touches.length) {
      e = e.touches[0];
    }
    var page = {
      x: e.pageX || (e.clientX + doc.scrollLeft),
      y: e.pageY || (e.clientY + doc.scrollTop)
    };
    return page;
  },
  stop: function(e) {
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }
};

$jit.util = $jit.id = $;

var Class = function(properties) {
  properties = properties || {};
  var klass = function() {
    for ( var key in this) {
      if (typeof this[key] != 'function')
        this[key] = $.unlink(this[key]);
    }
    this.constructor = klass;
    if (Class.prototyping)
      return this;
    var instance = this.initialize ? this.initialize.apply(this, arguments)
        : this;
    //typize
    this.$$family = 'class';
    return instance;
  };

  for ( var mutator in Class.Mutators) {
    if (!properties[mutator])
      continue;
    properties = Class.Mutators[mutator](properties, properties[mutator]);
    delete properties[mutator];
  }

  $.extend(klass, this);
  klass.constructor = Class;
  klass.prototype = properties;
  return klass;
};

Class.Mutators = {

  Implements: function(self, klasses) {
    $.each($.splat(klasses), function(klass) {
      Class.prototyping = klass;
      var instance = (typeof klass == 'function') ? new klass : klass;
      for ( var prop in instance) {
        if (!(prop in self)) {
          self[prop] = instance[prop];
        }
      }
      delete Class.prototyping;
    });
    return self;
  }

};

$.extend(Class, {

  inherit: function(object, properties) {
    for ( var key in properties) {
      var override = properties[key];
      var previous = object[key];
      var type = $.type(override);
      if (previous && type == 'function') {
        if (override != previous) {
          Class.override(object, key, override);
        }
      } else if (type == 'object') {
        object[key] = $.merge(previous, override);
      } else {
        object[key] = override;
      }
    }
    return object;
  },

  override: function(object, name, method) {
    var parent = Class.prototyping;
    if (parent && object[name] != parent[name])
      parent = null;
    var override = function() {
      var previous = this.parent;
      this.parent = parent ? parent[name] : object[name];
      var value = method.apply(this, arguments);
      this.parent = previous;
      return value;
    };
    object[name] = override;
  }

});

Class.prototype.implement = function() {
  var proto = this.prototype;
  $.each(Array.prototype.slice.call(arguments || []), function(properties) {
    Class.inherit(proto, properties);
  });
  return this;
};

$jit.Class = Class;

/*
  Object: $jit.json
  
  Provides JSON utility functions.
  
  Most of these functions are JSON-tree traversal and manipulation functions.
*/
$jit.json = {
  /*
     Method: prune
  
     Clears all tree nodes having depth greater than maxLevel.
  
     Parameters:
  
        tree - (object) A JSON tree object. For more information please see <Loader.loadJSON>.
        maxLevel - (number) An integer specifying the maximum level allowed for this tree. All nodes having depth greater than max level will be deleted.

  */
  prune: function(tree, maxLevel) {
    this.each(tree, function(elem, i) {
      if (i == maxLevel && elem.children) {
        delete elem.children;
        elem.children = [];
      }
    });
  },
  /*
     Method: getParent
  
     Returns the parent node of the node having _id_ as id.
  
     Parameters:
  
        tree - (object) A JSON tree object. See also <Loader.loadJSON>.
        id - (string) The _id_ of the child node whose parent will be returned.

    Returns:

        A tree JSON node if any, or false otherwise.
  
  */
  getParent: function(tree, id) {
    if (tree.id == id)
      return false;
    var ch = tree.children;
    if (ch && ch.length > 0) {
      for ( var i = 0; i < ch.length; i++) {
        if (ch[i].id == id)
          return tree;
        else {
          var ans = this.getParent(ch[i], id);
          if (ans)
            return ans;
        }
      }
    }
    return false;
  },
  /*
     Method: getSubtree
  
     Returns the subtree that matches the given id.
  
     Parameters:
  
        tree - (object) A JSON tree object. See also <Loader.loadJSON>.
        id - (string) A node *unique* identifier.
  
     Returns:
  
        A subtree having a root node matching the given id. Returns null if no subtree matching the id is found.

  */
  getSubtree: function(tree, id) {
    if (tree.id == id)
      return tree;
    for ( var i = 0, ch = tree.children; ch && i < ch.length; i++) {
      var t = this.getSubtree(ch[i], id);
      if (t != null)
        return t;
    }
    return null;
  },
  /*
     Method: eachLevel
  
      Iterates on tree nodes with relative depth less or equal than a specified level.
  
     Parameters:
  
        tree - (object) A JSON tree or subtree. See also <Loader.loadJSON>.
        initLevel - (number) An integer specifying the initial relative level. Usually zero.
        toLevel - (number) An integer specifying a top level. This method will iterate only through nodes with depth less than or equal this number.
        action - (function) A function that receives a node and an integer specifying the actual level of the node.
          
    Example:
   (start code js)
     $jit.json.eachLevel(tree, 0, 3, function(node, depth) {
        alert(node.name + ' ' + depth);
     });
   (end code)
  */
  eachLevel: function(tree, initLevel, toLevel, action) {
    if (initLevel <= toLevel) {
      action(tree, initLevel);
      if(!tree.children) return;
      for ( var i = 0, ch = tree.children; i < ch.length; i++) {
        this.eachLevel(ch[i], initLevel + 1, toLevel, action);
      }
    }
  },
  /*
     Method: each
  
      A JSON tree iterator.
  
     Parameters:
  
        tree - (object) A JSON tree or subtree. See also <Loader.loadJSON>.
        action - (function) A function that receives a node.

    Example:
    (start code js)
      $jit.json.each(tree, function(node) {
        alert(node.name);
      });
    (end code)
          
  */
  each: function(tree, action) {
    this.eachLevel(tree, 0, Number.MAX_VALUE, action);
  }
};


/*
     An object containing multiple type of transformations. 
*/

$jit.Trans = {
  $extend: true,
  
  linear: function(p){
    return p;
  }
};

var Trans = $jit.Trans;

(function(){

  var makeTrans = function(transition, params){
    params = $.splat(params);
    return $.extend(transition, {
      easeIn: function(pos){
        return transition(pos, params);
      },
      easeOut: function(pos){
        return 1 - transition(1 - pos, params);
      },
      easeInOut: function(pos){
        return (pos <= 0.5)? transition(2 * pos, params) / 2 : (2 - transition(
            2 * (1 - pos), params)) / 2;
      }
    });
  };

  var transitions = {

    Pow: function(p, x){
      return Math.pow(p, x[0] || 6);
    },

    Expo: function(p){
      return Math.pow(2, 8 * (p - 1));
    },

    Circ: function(p){
      return 1 - Math.sin(Math.acos(p));
    },

    Sine: function(p){
      return 1 - Math.sin((1 - p) * Math.PI / 2);
    },

    Back: function(p, x){
      x = x[0] || 1.618;
      return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    Bounce: function(p){
      var value;
      for ( var a = 0, b = 1; 1; a += b, b /= 2) {
        if (p >= (7 - 4 * a) / 11) {
          value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
          break;
        }
      }
      return value;
    },

    Elastic: function(p, x){
      return Math.pow(2, 10 * --p)
          * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
    }

  };

  $.each(transitions, function(val, key){
    Trans[key] = makeTrans(val);
  });

  $.each( [
      'Quad', 'Cubic', 'Quart', 'Quint'
  ], function(elem, i){
    Trans[elem] = makeTrans(function(p){
      return Math.pow(p, [
        i + 2
      ]);
    });
  });

})();

/*
   A Class that can perform animations for generic objects.

   If you are looking for animation transitions please take a look at the <Trans> object.

   Used by:

   <Graph.Plot>
   
   Based on:
   
   The Animation class is based in the MooTools Framework <http://mootools.net>. Copyright (c) 2006-2009 Valerio Proietti, <http://mad4milk.net/>. MIT license <http://mootools.net/license.txt>.

*/

var Animation = new Class( {

  initialize: function(options){
    this.setOptions(options);
  },

  setOptions: function(options){
    var opt = {
      duration: 2500,
      fps: 40,
      transition: Trans.Quart.easeInOut,
      compute: $.empty,
      complete: $.empty,
      link: 'ignore'
    };
    this.opt = $.merge(opt, options || {});
    return this;
  },

  step: function(){
    var time = $.time(), opt = this.opt;
    if (time < this.time + opt.duration) {
      var delta = opt.transition((time - this.time) / opt.duration);
      opt.compute(delta);
    } else {
      this.timer = clearInterval(this.timer);
      opt.compute(1);
      opt.complete();
    }
  },

  start: function(){
    if (!this.check())
      return this;
    this.time = 0;
    this.startTimer();
    return this;
  },

  startTimer: function(){
    var that = this, fps = this.opt.fps;
    if (this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = setInterval((function(){
      that.step();
    }), Math.round(1000 / fps));
    return true;
  },

  pause: function(){
    this.stopTimer();
    return this;
  },

  resume: function(){
    this.startTimer();
    return this;
  },

  stopTimer: function(){
    if (!this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = clearInterval(this.timer);
    return true;
  },

  check: function(){
    if (!this.timer)
      return true;
    if (this.opt.link == 'cancel') {
      this.stopTimer();
      return true;
    }
    return false;
  }
});


var Options = function() {
  var args = arguments;
  for(var i=0, l=args.length, ans={}; i<l; i++) {
    var opt = Options[args[i]];
    if(opt.$extend) {
      $.extend(ans, opt);
    } else {
      ans[args[i]] = opt;  
    }
  }
  return ans;
};

/*
 * File: Options.AreaChart.js
 *
*/

/*
  Object: Options.AreaChart
  
  <AreaChart> options. 
  Other options included in the AreaChart are <Options.Canvas>, <Options.Label>, <Options.Margin>, <Options.Tips> and <Options.Events>.
  
  Syntax:
  
  (start code js)

  Options.AreaChart = {
    animate: true,
    labelOffset: 3,
    type: 'stacked',
    selectOnHover: true,
    showAggregates: true,
    showLabels: true,
    filterOnClick: false,
    restoreOnRightClick: false
  };
  
  (end code)
  
  Example:
  
  (start code js)

  var areaChart = new $jit.AreaChart({
    animate: true,
    type: 'stacked:gradient',
    selectOnHover: true,
    filterOnClick: true,
    restoreOnRightClick: true
  });
  
  (end code)

  Parameters:
  
  animate - (boolean) Default's *true*. Whether to add animated transitions when filtering/restoring stacks.
  labelOffset - (number) Default's *3*. Adds margin between the label and the default place where it should be drawn.
  type - (string) Default's *'stacked'*. Stack style. Posible values are 'stacked', 'stacked:gradient' to add gradients.
  selectOnHover - (boolean) Default's *true*. If true, it will add a mark to the hovered stack.
  showAggregates - (boolean, function) Default's *true*. Display the values of the stacks. Can also be a function that returns *true* or *false* to display or filter some values. That same function can also return a string with the formatted value.
  showLabels - (boolean, function) Default's *true*. Display the name of the slots. Can also be a function that returns *true* or *false* to display or not each label.
  filterOnClick - (boolean) Default's *true*. Select the clicked stack by hiding all other stacks.
  restoreOnRightClick - (boolean) Default's *true*. Show all stacks by right clicking.
  
*/
  
Options.AreaChart = {
  $extend: true,

  animate: true,
  labelOffset: 3, // label offset
  type: 'stacked', // gradient
  Tips: {
    enable: false,
    onShow: $.empty,
    onHide: $.empty
  },
  Events: {
    enable: false,
    onClick: $.empty
  },
  selectOnHover: true,
  showAggregates: true,
  showLabels: true,
  filterOnClick: false,
  restoreOnRightClick: false
};

/*
 * File: Options.Margin.js
 *
*/

/*
  Object: Options.Margin
  
  Canvas drawing margins. 
  
  Syntax:
  
  (start code js)

  Options.Margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  
  (end code)
  
  Example:
  
  (start code js)

  var viz = new $jit.Viz({
    Margin: {
      right: 10,
      bottom: 20
    }
  });
  
  (end code)

  Parameters:
  
  top - (number) Default's *0*. Top margin.
  left - (number) Default's *0*. Left margin.
  right - (number) Default's *0*. Right margin.
  bottom - (number) Default's *0*. Bottom margin.
  
*/

Options.Margin = {
  $extend: false,
  
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

/*
 * File: Options.Canvas.js
 *
*/

/*
  Object: Options.Canvas
  
  These are Canvas general options, like where to append it in the DOM, its dimensions, background, 
  and other more advanced options.
  
  Syntax:
  
  (start code js)

  Options.Canvas = {
    injectInto: 'id',
    type: '2D', //'3D'
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false
  };  
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    injectInto: 'someContainerId',
    width: 500,
    height: 700
  });
  (end code)
  
  Parameters:
  
  injectInto - *required* (string|element) The id of the DOM container for the visualization. It can also be an Element provided that it has an id.
  type - (string) Context type. Default's 2D but can be 3D for webGL enabled browsers.
  width - (number) Default's to the *container's offsetWidth*. The width of the canvas.
  height - (number) Default's to the *container's offsetHeight*. The height of the canvas.
  useCanvas - (boolean|object) Default's *false*. You can pass another <Canvas> instance to be used by the visualization.
  withLabels - (boolean) Default's *true*. Whether to use a label container for the visualization.
  background - (boolean|object) Default's *false*. An object containing information about the rendering of a background canvas.
*/

Options.Canvas = {
    $extend: true,
    
    injectInto: 'id',
    type: '2D',
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false,
    
    Scene: {
      Lighting: {
        enable: false,
        ambient: [1, 1, 1],
        directional: {
          direction: { x: -100, y: -100, z: -100 },
          color: [0.5, 0.3, 0.1]
        }
      }
    }
};

/*
 * File: Options.Tree.js
 *
*/

/*
  Object: Options.Tree
  
  Options related to (strict) Tree layout algorithms. These options are used by the <ST> visualization.
  
  Syntax:
  
  (start code js)
  Options.Tree = {
    orientation: "left",
    subtreeOffset: 8,
    siblingOffset: 5,
    indent:10,
    multitree: false,
    align:"center"
  };
  (end code)
  
  Example:
  
  (start code js)
  var st = new $jit.ST({
    orientation: 'left',
    subtreeOffset: 1,
    siblingOFfset: 5,
    multitree: true
  });
  (end code)

  Parameters:
    
  subtreeOffset - (number) Default's 8. Separation offset between subtrees.
  siblingOffset - (number) Default's 5. Separation offset between siblings.
  orientation - (string) Default's 'left'. Tree orientation layout. Possible values are 'left', 'top', 'right', 'bottom'.
  align - (string) Default's *center*. Whether the tree alignment is 'left', 'center' or 'right'.
  indent - (number) Default's 10. Used when *align* is left or right and shows an indentation between parent and children.
  multitree - (boolean) Default's *false*. Used with the node $orn data property for creating multitrees.
     
*/
Options.Tree = {
    $extend: true,
    
    orientation: "left",
    subtreeOffset: 8,
    siblingOffset: 5,
    indent:10,
    multitree: false,
    align:"center"
};


/*
 * File: Options.Node.js
 *
*/

/*
  Object: Options.Node

  Provides Node rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Node = {
    overridable: false,
    type: 'circle',
    color: '#ccb',
    alpha: 1,
    dim: 3,
    height: 20,
    width: 90,
    autoHeight: false,
    autoWidth: false,
    lineWidth: 1,
    transform: true,
    align: "center",
    angularWidth:1,
    span:1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Node: {
      overridable: true,
      width: 30,
      autoHeight: true,
      type: 'rectangle'
    }
  });
  (end code)
  
  Parameters:

  overridable - (boolean) Default's *false*. Determine whether or not general node properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *circle*. Node's shape. Node built-in types include 'circle', 'rectangle', 'square', 'ellipse', 'triangle', 'star'. The default Node type might vary in each visualization. You can also implement (non built-in) custom Node types into your visualizations.
  color - (string) Default's *#ccb*. Node color.
  alpha - (number) Default's *1*. The Node's alpha value. *1* is for full opacity.
  dim - (number) Default's *3*. An extra parameter used by 'circle', 'square', 'triangle' and 'star' node types. Depending on each shape, this parameter can set the radius of a circle, half the length of the side of a square, half the base and half the height of a triangle or the length of a side of a star (concave decagon).
  height - (number) Default's *20*. Used by 'rectangle' and 'ellipse' node types. The height of the node shape.
  width - (number) Default's *90*. Used by 'rectangle' and 'ellipse' node types. The width of the node shape.
  autoHeight - (boolean) Default's *false*. Whether to set an auto height for the node depending on the content of the Node's label.
  autoWidth - (boolean) Default's *false*. Whether to set an auto width for the node depending on the content of the Node's label.
  lineWidth - (number) Default's *1*. Used only by some Node shapes. The line width of the strokes of a node.
  transform - (boolean) Default's *true*. Only used by the <Hypertree> visualization. Whether to scale the nodes according to the moebius transformation.
  align - (string) Default's *center*. Possible values are 'center', 'left' or 'right'. Used only by the <ST> visualization, these parameters are used for aligning nodes when some of they dimensions vary.
  angularWidth - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The amount of relative 'space' set for a node.
  span - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The angle span amount set for a node.
  CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting a Node.

*/
Options.Node = {
  $extend: false,
  
  overridable: false,
  type: 'circle',
  color: '#ccb',
  alpha: 1,
  dim: 3,
  height: 20,
  width: 90,
  autoHeight: false,
  autoWidth: false,
  lineWidth: 1,
  transform: true,
  align: "center",
  angularWidth:1,
  span:1,
  //Raw canvas styles to be
  //applied to the context instance
  //before plotting a node
  CanvasStyles: {}
};


/*
 * File: Options.Edge.js
 *
*/

/*
  Object: Options.Edge

  Provides Edge rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Edge = {
    overridable: false,
    type: 'line',
    color: '#ccb',
    lineWidth: 1,
    dim:15,
    alpha: 1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Edge: {
      overridable: true,
      type: 'line',
      color: '#fff',
      CanvasStyles: {
        shadowColor: '#ccc',
        shadowBlur: 10
      }
    }
  });
  (end code)
  
  Parameters:
    
   overridable - (boolean) Default's *false*. Determine whether or not general edges properties can be overridden by a particular <Graph.Adjacence>.
   type - (string) Default's 'line'. Edge styles include 'line', 'hyperline', 'arrow'. The default Edge type might vary in each visualization. You can also implement custom Edge types.
   color - (string) Default's '#ccb'. Edge color.
   lineWidth - (number) Default's *1*. Line/Edge width.
   alpha - (number) Default's *1*. The Edge's alpha value. *1* is for full opacity.
   dim - (number) Default's *15*. An extra parameter used by other complex shapes such as quadratic, bezier or arrow, to determine the shape's diameter.
   epsilon - (number) Default's *7*. Only used when using *enableForEdges* in <Options.Events>. This dimension is used to create an area for the line where the contains method for the edge returns *true*.
   CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting an Edge.

  See also:
   
   If you want to know more about how to customize Node/Edge data per element, in the JSON or programmatically, take a look at this article.
*/
Options.Edge = {
  $extend: false,
  
  overridable: false,
  type: 'line',
  color: '#ccb',
  lineWidth: 1,
  dim:15,
  alpha: 1,
  epsilon: 7,

  //Raw canvas styles to be
  //applied to the context instance
  //before plotting an edge
  CanvasStyles: {}
};


/*
 * File: Options.Fx.js
 *
*/

/*
  Object: Options.Fx

  Provides animation options like duration of the animations, frames per second and animation transitions.  

  Syntax:
  
  (start code js)
    Options.Fx = {
      fps:40,
      duration: 2500,
      transition: $jit.Trans.Quart.easeInOut,
      clearCanvas: true
    };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    duration: 1000,
    fps: 35,
    transition: $jit.Trans.linear
  });
  (end code)
  
  Parameters:
  
  clearCanvas - (boolean) Default's *true*. Whether to clear the frame/canvas when the viz is plotted or animated.
  duration - (number) Default's *2500*. Duration of the animation in milliseconds.
  fps - (number) Default's *40*. Frames per second.
  transition - (object) Default's *$jit.Trans.Quart.easeInOut*. The transition used for the animations. See below for a more detailed explanation.
  
  Object: $jit.Trans
  
  This object is used for specifying different animation transitions in all visualizations.

  There are many different type of animation transitions.

  linear:

  Displays a linear transition

  >Trans.linear
  
  (see Linear.png)

  Quad:

  Displays a Quadratic transition.

  >Trans.Quad.easeIn
  >Trans.Quad.easeOut
  >Trans.Quad.easeInOut
  
 (see Quad.png)

 Cubic:

 Displays a Cubic transition.

 >Trans.Cubic.easeIn
 >Trans.Cubic.easeOut
 >Trans.Cubic.easeInOut

 (see Cubic.png)

 Quart:

 Displays a Quartetic transition.

 >Trans.Quart.easeIn
 >Trans.Quart.easeOut
 >Trans.Quart.easeInOut

 (see Quart.png)

 Quint:

 Displays a Quintic transition.

 >Trans.Quint.easeIn
 >Trans.Quint.easeOut
 >Trans.Quint.easeInOut

 (see Quint.png)

 Expo:

 Displays an Exponential transition.

 >Trans.Expo.easeIn
 >Trans.Expo.easeOut
 >Trans.Expo.easeInOut

 (see Expo.png)

 Circ:

 Displays a Circular transition.

 >Trans.Circ.easeIn
 >Trans.Circ.easeOut
 >Trans.Circ.easeInOut

 (see Circ.png)

 Sine:

 Displays a Sineousidal transition.

 >Trans.Sine.easeIn
 >Trans.Sine.easeOut
 >Trans.Sine.easeInOut

 (see Sine.png)

 Back:

 >Trans.Back.easeIn
 >Trans.Back.easeOut
 >Trans.Back.easeInOut

 (see Back.png)

 Bounce:

 Bouncy transition.

 >Trans.Bounce.easeIn
 >Trans.Bounce.easeOut
 >Trans.Bounce.easeInOut

 (see Bounce.png)

 Elastic:

 Elastic curve.

 >Trans.Elastic.easeIn
 >Trans.Elastic.easeOut
 >Trans.Elastic.easeInOut

 (see Elastic.png)
 
 Based on:
     
 Easing and Transition animation methods are based in the MooTools Framework <http://mootools.net>. Copyright (c) 2006-2010 Valerio Proietti, <http://mad4milk.net/>. MIT license <http://mootools.net/license.txt>.


*/
Options.Fx = {
  $extend: true,
  
  fps:40,
  duration: 2500,
  transition: $jit.Trans.Quart.easeInOut,
  clearCanvas: true
};

/*
 * File: Options.Label.js
 *
*/
/*
  Object: Options.Label

  Provides styling for Labels such as font size, family, etc. Also sets Node labels as HTML, SVG or Native canvas elements.  

  Syntax:
  
  (start code js)
    Options.Label = {
      overridable: false,
      type: 'HTML', //'SVG', 'Native'
      style: ' ',
      size: 10,
      family: 'sans-serif',
      textAlign: 'center',
      textBaseline: 'alphabetic',
      color: '#fff'
    };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Label: {
      type: 'Native',
      size: 11,
      color: '#ccc'
    }
  });
  (end code)
  
  Parameters:
    
  overridable - (boolean) Default's *false*. Determine whether or not general label properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *HTML*. The type for the labels. Can be 'HTML', 'SVG' or 'Native' canvas labels.
  style - (string) Default's *empty string*. Can be 'italic' or 'bold'. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  size - (number) Default's *10*. The font's size. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  family - (string) Default's *sans-serif*. The font's family. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  color - (string) Default's *#fff*. The font's color. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
*/
Options.Label = {
  $extend: false,
  
  overridable: false,
  type: 'HTML', //'SVG', 'Native'
  style: ' ',
  size: 10,
  family: 'sans-serif',
  textAlign: 'center',
  textBaseline: 'alphabetic',
  color: '#fff'
};


/*
 * File: Options.Tips.js
 *
 */

/*
  Object: Options.Tips
  
  Tips options
  
  Syntax:
    
  (start code js)
  Options.Tips = {
    enable: false,
    type: 'auto',
    offsetX: 20,
    offsetY: 20,
    onShow: $.empty,
    onHide: $.empty
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Tips: {
      enable: true,
      type: 'Native',
      offsetX: 10,
      offsetY: 10,
      onShow: function(tip, node) {
        tip.innerHTML = node.name;
      }
    }
  });
  (end code)

  Parameters:

  enable - (boolean) Default's *false*. If *true*, a tooltip will be shown when a node is hovered. The tooltip is a div DOM element having "tip" as CSS class. 
  type - (string) Default's *auto*. Defines where to attach the MouseEnter/Leave tooltip events. Possible values are 'Native' to attach them to the canvas or 'HTML' to attach them to DOM label elements (if defined). 'auto' sets this property to the value of <Options.Label>'s *type* property.
  offsetX - (number) Default's *20*. An offset added to the current tooltip x-position (which is the same as the current mouse position). Default's 20.
  offsetY - (number) Default's *20*. An offset added to the current tooltip y-position (which is the same as the current mouse position). Default's 20.
  onShow(tip, node) - This callack is used right before displaying a tooltip. The first formal parameter is the tip itself (which is a DivElement). The second parameter may be a <Graph.Node> for graph based visualizations or an object with label, value properties for charts.
  onHide() - This callack is used when hiding a tooltip.

*/
Options.Tips = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  offsetX: 20,
  offsetY: 20,
  force: false,
  onShow: $.empty,
  onHide: $.empty
};


/*
 * File: Options.NodeStyles.js
 *
 */

/*
  Object: Options.NodeStyles
  
  Apply different styles when a node is hovered or selected.
  
  Syntax:
    
  (start code js)
  Options.NodeStyles = {
    enable: false,
    type: 'auto',
    stylesHover: false,
    stylesClick: false
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    NodeStyles: {
      enable: true,
      type: 'Native',
      stylesHover: {
        dim: 30,
        color: '#fcc'
      },
      duration: 600
    }
  });
  (end code)

  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable this option.
  type - (string) Default's *auto*. Use this to attach the hover/click events in the nodes or the nodes labels (if they have been defined as DOM elements: 'HTML' or 'SVG', see <Options.Label> for more details). The default 'auto' value will set NodeStyles to the same type defined for <Options.Label>.
  stylesHover - (boolean|object) Default's *false*. An object with node styles just like the ones defined for <Options.Node> or *false* otherwise.
  stylesClick - (boolean|object) Default's *false*. An object with node styles just like the ones defined for <Options.Node> or *false* otherwise.
*/

Options.NodeStyles = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  stylesHover: false,
  stylesClick: false
};


/*
 * File: Options.Events.js
 *
*/

/*
  Object: Options.Events
  
  Configuration for adding mouse/touch event handlers to Nodes.
  
  Syntax:
  
  (start code js)
  Options.Events = {
    enable: false,
    enableForEdges: false,
    type: 'auto',
    onClick: $.empty,
    onRightClick: $.empty,
    onMouseMove: $.empty,
    onMouseEnter: $.empty,
    onMouseLeave: $.empty,
    onDragStart: $.empty,
    onDragMove: $.empty,
    onDragCancel: $.empty,
    onDragEnd: $.empty,
    onTouchStart: $.empty,
    onTouchMove: $.empty,
    onTouchEnd: $.empty,
    onTouchCancel: $.empty,
    onMouseWheel: $.empty
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Events: {
      enable: true,
      onClick: function(node, eventInfo, e) {
        viz.doSomething();
      },
      onMouseEnter: function(node, eventInfo, e) {
        viz.canvas.getElement().style.cursor = 'pointer';
      },
      onMouseLeave: function(node, eventInfo, e) {
        viz.canvas.getElement().style.cursor = '';
      }
    }
  });
  (end code)
  
  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable the Event system.
  enableForEdges - (boolean) Default's *false*. Whether to track events also in arcs. If *true* the same callbacks -described below- are used for nodes *and* edges. A simple duck type check for edges is to check for *node.nodeFrom*.
  type - (string) Default's 'auto'. Whether to attach the events onto the HTML labels (via event delegation) or to use the custom 'Native' canvas Event System of the library. 'auto' is set when you let the <Options.Label> *type* parameter decide this.
  onClick(node, eventInfo, e) - Triggered when a user performs a click in the canvas. *node* is the <Graph.Node> clicked or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onRightClick(node, eventInfo, e) - Triggered when a user performs a right click in the canvas. *node* is the <Graph.Node> right clicked or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onMouseMove(node, eventInfo, e) - Triggered when the user moves the mouse. *node* is the <Graph.Node> under the cursor as it's moving over the canvas or false if no node has been clicked. *e* is the grabbed event (should return the native event in a cross-browser manner).  *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas.
  onMouseEnter(node, eventInfo, e) - Triggered when a user moves the mouse over a node. *node* is the <Graph.Node> that the mouse just entered. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onMouseLeave(node, eventInfo, e) - Triggered when the user mouse-outs a node. *node* is the <Graph.Node> 'mouse-outed'. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragStart(node, eventInfo, e) - Triggered when the user mouse-downs over a node. *node* is the <Graph.Node> being pressed. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragMove(node, eventInfo, e) - Triggered when a user, after pressing the mouse button over a node, moves the mouse around. *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragEnd(node, eventInfo, e) - Triggered when a user finished dragging a node. *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onDragCancel(node, eventInfo, e) - Triggered when the user releases the mouse button over a <Graph.Node> that wasn't dragged (i.e. the user didn't perform any mouse movement after pressing the mouse button). *node* is the <Graph.Node> being dragged. *e* is the grabbed event (should return the native event in a cross-browser manner). *eventInfo* is an object containing useful methods like *getPos* to get the mouse position relative to the canvas. 
  onTouchStart(node, eventInfo, e) - Behaves just like onDragStart. 
  onTouchMove(node, eventInfo, e) - Behaves just like onDragMove. 
  onTouchEnd(node, eventInfo, e) - Behaves just like onDragEnd. 
  onTouchCancel(node, eventInfo, e) - Behaves just like onDragCancel.
  onMouseWheel(delta, e) - Triggered when the user uses the mouse scroll over the canvas. *delta* is 1 or -1 depending on the sense of the mouse scroll.
*/

Options.Events = {
  $extend: false,
  
  enable: false,
  enableForEdges: false,
  type: 'auto',
  onClick: $.empty,
  onRightClick: $.empty,
  onMouseMove: $.empty,
  onMouseEnter: $.empty,
  onMouseLeave: $.empty,
  onDragStart: $.empty,
  onDragMove: $.empty,
  onDragCancel: $.empty,
  onDragEnd: $.empty,
  onTouchStart: $.empty,
  onTouchMove: $.empty,
  onTouchEnd: $.empty,
  onMouseWheel: $.empty
};

/*
 * File: Options.Navigation.js
 *
*/

/*
  Object: Options.Navigation
  
  Panning and zooming options for Graph/Tree based visualizations. These options are implemented 
  by all visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Navigation = {
    enable: false,
    type: 'auto',
    panning: false, //true, 'avoid nodes'
    zooming: false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    Navigation: {
      enable: true,
      panning: 'avoid nodes',
      zooming: 20
    }
  });
  (end code)
  
  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable Navigation capabilities.
  type - (string) Default's 'auto'. Whether to attach the navigation events onto the HTML labels (via event delegation) or to use the custom 'Native' canvas Event System of the library. When 'auto' set when you let the <Options.Label> *type* parameter decide this.
  panning - (boolean|string) Default's *false*. Set this property to *true* if you want to add Drag and Drop panning support to the visualization. You can also set this parameter to 'avoid nodes' to enable DnD panning but disable it if the DnD is taking place over a node. This is useful when some other events like Drag & Drop for nodes are added to <Graph.Nodes>.
  zooming - (boolean|number) Default's *false*. Set this property to a numeric value to turn mouse-scroll zooming on. The number will be proportional to the mouse-scroll sensitivity.
  
*/

Options.Navigation = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  panning: false, //true | 'avoid nodes'
  zooming: false
};

/*
 * File: Options.Controller.js
 *
*/

/*
  Object: Options.Controller
  
  Provides controller methods. Controller methods are callback functions that get called at different stages 
  of the animation, computing or plotting of the visualization.
  
  Implemented by:
    
  All visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Controller = {
    onBeforeCompute: $.empty,
    onAfterCompute:  $.empty,
    onCreateLabel:   $.empty,
    onPlaceLabel:    $.empty,
    onComplete:      $.empty,
    onBeforePlotLine:$.empty,
    onAfterPlotLine: $.empty,
    onBeforePlotNode:$.empty,
    onAfterPlotNode: $.empty,
    request:         false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    onBeforePlotNode: function(node) {
      if(node.selected) {
        node.setData('color', '#ffc');
      } else {
        node.removeData('color');
      }
    },
    onBeforePlotLine: function(adj) {
      if(adj.nodeFrom.selected && adj.nodeTo.selected) {
        adj.setData('color', '#ffc');
      } else {
        adj.removeData('color');
      }
    },
    onAfterCompute: function() {
      alert("computed!");
    }
  });
  (end code)
  
  Parameters:

   onBeforeCompute(node) - This method is called right before performing all computations and animations. The selected <Graph.Node> is passed as parameter.
   onAfterCompute() - This method is triggered after all animations or computations ended.
   onCreateLabel(domElement, node) - This method receives a new label DIV element as first parameter, and the corresponding <Graph.Node> as second parameter. This method will only be called once for each label. This method is useful when adding events or styles to the labels used by the JIT.
   onPlaceLabel(domElement, node) - This method receives a label DIV element as first parameter and the corresponding <Graph.Node> as second parameter. This method is called each time a label has been placed in the visualization, for example at each step of an animation, and thus it allows you to update the labels properties, such as size or position. Note that onPlaceLabel will be triggered after updating the labels positions. That means that, for example, the left and top css properties are already updated to match the nodes positions. Width and height properties are not set however.
   onBeforePlotNode(node) - This method is triggered right before plotting each <Graph.Node>. This method is useful for changing a node style right before plotting it.
   onAfterPlotNode(node) - This method is triggered right after plotting each <Graph.Node>.
   onBeforePlotLine(adj) - This method is triggered right before plotting a <Graph.Adjacence>. This method is useful for adding some styles to a particular edge before being plotted.
   onAfterPlotLine(adj) - This method is triggered right after plotting a <Graph.Adjacence>.

    *Used in <ST>, <TM.Base> and <Icicle> visualizations*
    
    request(nodeId, level, onComplete) - This method is used for buffering information into the visualization. When clicking on an empty node, the visualization will make a request for this node's subtrees, specifying a given level for this subtree (defined by _levelsToShow_). Once the request is completed, the onComplete callback should be called with the given result. This is useful to provide on-demand information into the visualizations withought having to load the entire information from start. The parameters used by this method are _nodeId_, which is the id of the root of the subtree to request, _level_ which is the depth of the subtree to be requested (0 would mean just the root node). _onComplete_ is an object having the callback method _onComplete.onComplete(json)_ that should be called once the json has been retrieved.  
 
 */
Options.Controller = {
  $extend: true,
  
  onBeforeCompute: $.empty,
  onAfterCompute:  $.empty,
  onCreateLabel:   $.empty,
  onPlaceLabel:    $.empty,
  onComplete:      $.empty,
  onBeforePlotLine:$.empty,
  onAfterPlotLine: $.empty,
  onBeforePlotNode:$.empty,
  onAfterPlotNode: $.empty,
  request:         false
};


/*
 * File: Extras.js
 * 
 * Provides Extras such as Tips and Style Effects.
 * 
 * Description:
 * 
 * Provides the <Tips> and <NodeStyles> classes and functions.
 *
 */

/*
 * Manager for mouse events (clicking and mouse moving).
 * 
 * This class is used for registering objects implementing onClick
 * and onMousemove methods. These methods are called when clicking or
 * moving the mouse around  the Canvas.
 * For now, <Tips> and <NodeStyles> are classes implementing these methods.
 * 
 */
var ExtrasInitializer = {
  initialize: function(className, viz) {
    this.viz = viz;
    this.canvas = viz.canvas;
    this.config = viz.config[className];
    this.nodeTypes = viz.fx.nodeTypes;
    var type = this.config.type;
    this.dom = type == 'auto'? (viz.config.Label.type != 'Native') : (type != 'Native');
    this.labelContainer = this.dom && viz.labels.getLabelContainer();
    this.isEnabled() && this.initializePost();
  },
  initializePost: $.empty,
  setAsProperty: $.lambda(false),
  isEnabled: function() {
    return this.config.enable;
  },
  isLabel: function(e, win, group) {
    e = $.event.get(e, win);
    var labelContainer = this.labelContainer,
        target = e.target || e.srcElement,
        related = e.relatedTarget;
    if(group) {
      return related && related == this.viz.canvas.getCtx().canvas 
          && !!target && this.isDescendantOf(target, labelContainer);
    } else {
      return this.isDescendantOf(target, labelContainer);
    }
  },
  isDescendantOf: function(elem, par) {
    while(elem && elem.parentNode) {
      if(elem.parentNode == par)
        return elem;
      elem = elem.parentNode;
    }
    return false;
  }
};

var EventsInterface = {
  onMouseUp: $.empty,
  onMouseDown: $.empty,
  onMouseMove: $.empty,
  onMouseOver: $.empty,
  onMouseOut: $.empty,
  onMouseWheel: $.empty,
  onTouchStart: $.empty,
  onTouchMove: $.empty,
  onTouchEnd: $.empty,
  onTouchCancel: $.empty
};

var MouseEventsManager = new Class({
  initialize: function(viz) {
    this.viz = viz;
    this.canvas = viz.canvas;
    this.node = false;
    this.edge = false;
    this.registeredObjects = [];
    this.attachEvents();
  },
  
  attachEvents: function() {
    var htmlCanvas = this.canvas.getElement(), 
        that = this;
    htmlCanvas.oncontextmenu = $.lambda(false);
    $.addEvents(htmlCanvas, {
      'mouseup': function(e, win) {
        var event = $.event.get(e, win);
        that.handleEvent('MouseUp', e, win, 
            that.makeEventObject(e, win), 
            $.event.isRightClick(event));
      },
      'mousedown': function(e, win) {
        var event = $.event.get(e, win);
        that.handleEvent('MouseDown', e, win, that.makeEventObject(e, win), 
            $.event.isRightClick(event));
      },
      'mousemove': function(e, win) {
        that.handleEvent('MouseMove', e, win, that.makeEventObject(e, win));
      },
      'mouseover': function(e, win) {
        that.handleEvent('MouseOver', e, win, that.makeEventObject(e, win));
      },
      'mouseout': function(e, win) {
        that.handleEvent('MouseOut', e, win, that.makeEventObject(e, win));
      },
      'touchstart': function(e, win) {
        that.handleEvent('TouchStart', e, win, that.makeEventObject(e, win));
      },
      'touchmove': function(e, win) {
        that.handleEvent('TouchMove', e, win, that.makeEventObject(e, win));
      },
      'touchend': function(e, win) {
        that.handleEvent('TouchEnd', e, win, that.makeEventObject(e, win));
      }
    });
    //attach mousewheel event
    var handleMouseWheel = function(e, win) {
      var event = $.event.get(e, win);
      var wheel = $.event.getWheel(event);
      that.handleEvent('MouseWheel', e, win, wheel);
    };
    //TODO(nico): this is a horrible check for non-gecko browsers!
    if(!document.getBoxObjectFor && window.mozInnerScreenX == null) {
      $.addEvent(htmlCanvas, 'mousewheel', handleMouseWheel);
    } else {
      htmlCanvas.addEventListener('DOMMouseScroll', handleMouseWheel, false);
    }
  },
  
  register: function(obj) {
    this.registeredObjects.push(obj);
  },
  
  handleEvent: function() {
    var args = Array.prototype.slice.call(arguments),
        type = args.shift();
    for(var i=0, regs=this.registeredObjects, l=regs.length; i<l; i++) {
      regs[i]['on' + type].apply(regs[i], args);
    }
  },
  
  makeEventObject: function(e, win) {
    var that = this,
        graph = this.viz.graph,
        fx = this.viz.fx,
        ntypes = fx.nodeTypes,
        etypes = fx.edgeTypes;
    return {
      pos: false,
      node: false,
      edge: false,
      contains: false,
      getNodeCalled: false,
      getEdgeCalled: false,
      getPos: function() {
        //TODO(nico): check why this can't be cache anymore when using edge detection
        //if(this.pos) return this.pos;
        var canvas = that.viz.canvas,
            s = canvas.getSize(),
            p = canvas.getPos(),
            ox = canvas.translateOffsetX,
            oy = canvas.translateOffsetY,
            sx = canvas.scaleOffsetX,
            sy = canvas.scaleOffsetY,
            pos = $.event.getPos(e, win);
        this.pos = {
          x: (pos.x - p.x - s.width/2 - ox) * 1/sx,
          y: (pos.y - p.y - s.height/2 - oy) * 1/sy
        };
        return this.pos;
      },
      getNode: function() {
        if(this.getNodeCalled) return this.node;
        this.getNodeCalled = true;
        for(var id in graph.nodes) {
          var n = graph.nodes[id],
              geom = n && ntypes[n.getData('type')],
              contains = geom && geom.contains && geom.contains.call(fx, n, this.getPos());
          if(contains) {
            this.contains = contains;
            return that.node = this.node = n;
          }
        }
        return that.node = this.node = false;
      },
      getEdge: function() {
        if(this.getEdgeCalled) return this.edge;
        this.getEdgeCalled = true;
        var hashset = {};
        for(var id in graph.edges) {
          var edgeFrom = graph.edges[id];
          hashset[id] = true;
          for(var edgeId in edgeFrom) {
            if(edgeId in hashset) continue;
            var e = edgeFrom[edgeId],
                geom = e && etypes[e.getData('type')],
                contains = geom && geom.contains && geom.contains.call(fx, e, this.getPos());
            if(contains) {
              this.contains = contains;
              return that.edge = this.edge = e;
            }
          }
        }
        return that.edge = this.edge = false;
      },
      getContains: function() {
        if(this.getNodeCalled) return this.contains;
        this.getNode();
        return this.contains;
      }
    };
  }
});

/* 
 * Provides the initialization function for <NodeStyles> and <Tips> implemented 
 * by all main visualizations.
 *
 */
var Extras = {
  initializeExtras: function() {
    var mem = new MouseEventsManager(this), that = this;
    $.each(['NodeStyles', 'Tips', 'Navigation', 'Events'], function(k) {
      var obj = new Extras.Classes[k](k, that);
      if(obj.isEnabled()) {
        mem.register(obj);
      }
      if(obj.setAsProperty()) {
        that[k.toLowerCase()] = obj;
      }
    });
  }   
};

Extras.Classes = {};
/*
  Class: Events
   
  This class defines an Event API to be accessed by the user.
  The methods implemented are the ones defined in the <Options.Events> object.
*/

Extras.Classes.Events = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.fx = this.viz.fx;
    this.ntypes = this.viz.fx.nodeTypes;
    this.etypes = this.viz.fx.edgeTypes;
    
    this.hovered = false;
    this.pressed = false;
    this.touched = false;

    this.touchMoved = false;
    this.moved = false;
    
  },
  
  setAsProperty: $.lambda(true),
  
  onMouseUp: function(e, win, event, isRightClick) {
    var evt = $.event.get(e, win);
    if(!this.moved) {
      if(isRightClick) {
        this.config.onRightClick(this.hovered, event, evt);
      } else {
        this.config.onClick(this.pressed, event, evt);
      }
    }
    if(this.pressed) {
      if(this.moved) {
        this.config.onDragEnd(this.pressed, event, evt);
      } else {
        this.config.onDragCancel(this.pressed, event, evt);
      }
      this.pressed = this.moved = false;
    }
  },

  onMouseOut: function(e, win, event) {
   //mouseout a label
   var evt = $.event.get(e, win), label;
   if(this.dom && (label = this.isLabel(e, win, true))) {
     this.config.onMouseLeave(this.viz.graph.getNode(label.id),
                              event, evt);
     this.hovered = false;
     return;
   }
   //mouseout canvas
   var rt = evt.relatedTarget,
       canvasWidget = this.canvas.getElement();
   while(rt && rt.parentNode) {
     if(canvasWidget == rt.parentNode) return;
     rt = rt.parentNode;
   }
   if(this.hovered) {
     this.config.onMouseLeave(this.hovered,
         event, evt);
     this.hovered = false;
   }
  },
  
  onMouseOver: function(e, win, event) {
    //mouseover a label
    var evt = $.event.get(e, win), label;
    if(this.dom && (label = this.isLabel(e, win, true))) {
      this.hovered = this.viz.graph.getNode(label.id);
      this.config.onMouseEnter(this.hovered,
                               event, evt);
    }
  },
  
  onMouseMove: function(e, win, event) {
   var label, evt = $.event.get(e, win);
   if(this.pressed) {
     this.moved = true;
     this.config.onDragMove(this.pressed, event, evt);
     return;
   }
   if(this.dom) {
     this.config.onMouseMove(this.hovered,
         event, evt);
   } else {
     if(this.hovered) {
       var hn = this.hovered;
       var geom = hn.nodeFrom? this.etypes[hn.getData('type')] : this.ntypes[hn.getData('type')];
       var contains = geom && geom.contains 
         && geom.contains.call(this.fx, hn, event.getPos());
       if(contains) {
         this.config.onMouseMove(hn, event, evt);
         return;
       } else {
         this.config.onMouseLeave(hn, event, evt);
         this.hovered = false;
       }
     }
     if(this.hovered = (event.getNode() || (this.config.enableForEdges && event.getEdge()))) {
       this.config.onMouseEnter(this.hovered, event, evt);
     } else {
       this.config.onMouseMove(false, event, evt);
     }
   }
  },
  
  onMouseWheel: function(e, win, delta) {
    this.config.onMouseWheel(delta, $.event.get(e, win));
  },
  
  onMouseDown: function(e, win, event) {
    var evt = $.event.get(e, win), label;
    if(this.dom) {
      if(label = this.isLabel(e, win)) {
        this.pressed = this.viz.graph.getNode(label.id);
      }
    } else {
      this.pressed = event.getNode() || (this.config.enableForEdges && event.getEdge());
    }
    this.pressed && this.config.onDragStart(this.pressed, event, evt);
  },
  
  onTouchStart: function(e, win, event) {
    var evt = $.event.get(e, win), label;
    if(this.dom && (label = this.isLabel(e, win))) {
      this.touched = this.viz.graph.getNode(label.id);
    } else {
      this.touched = event.getNode() || (this.config.enableForEdges && event.getEdge());
    }
    this.touched && this.config.onTouchStart(this.touched, event, evt);
  },
  
  onTouchMove: function(e, win, event) {
    var evt = $.event.get(e, win);
    if(this.touched) {
      this.touchMoved = true;
      this.config.onTouchMove(this.touched, event, evt);
    }
  },
  
  onTouchEnd: function(e, win, event) {
    var evt = $.event.get(e, win);
    if(this.touched) {
      if(this.touchMoved) {
        this.config.onTouchEnd(this.touched, event, evt);
      } else {
        this.config.onTouchCancel(this.touched, event, evt);
      }
      this.touched = this.touchMoved = false;
    }
  }
});

/*
   Class: Tips
    
   A class containing tip related functions. This class is used internally.
   
   Used by:
   
   <ST>, <Sunburst>, <Hypertree>, <RGraph>, <TM>, <ForceDirected>, <Icicle>
   
   See also:
   
   <Options.Tips>
*/

Extras.Classes.Tips = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    //add DOM tooltip
    if(document.body) {
      var tip = $('_tooltip') || document.createElement('div');
      tip.id = '_tooltip';
      tip.className = 'tip';
      $.extend(tip.style, {
        position: 'absolute',
        display: 'none',
        zIndex: 13000
      });
      document.body.appendChild(tip);
      this.tip = tip;
      this.node = false;
    }
  },
  
  setAsProperty: $.lambda(true),
  
  onMouseOut: function(e, win) {
    //mouseout a label
    var evt = $.event.get(e, win);
    if(this.dom && this.isLabel(e, win, true)) {
      this.hide(true);
      return;
    }
    //mouseout canvas
    var rt = e.relatedTarget,
        canvasWidget = this.canvas.getElement();
    while(rt && rt.parentNode) {
      if(canvasWidget == rt.parentNode) return;
      rt = rt.parentNode;
    }
    this.hide(false);
  },
  
  onMouseOver: function(e, win) {
    //mouseover a label
    var label;
    if(this.dom && (label = this.isLabel(e, win, false))) {
      this.node = this.viz.graph.getNode(label.id);
      this.config.onShow(this.tip, this.node, label);
    }
  },
  
  onMouseMove: function(e, win, opt) {
    if(this.dom && this.isLabel(e, win)) {
      this.setTooltipPosition($.event.getPos(e, win));
    }
    if(!this.dom) {
      var node = opt.getNode();
      if(!node) {
        this.hide(true);
        return;
      }
      if(this.config.force || !this.node || this.node.id != node.id) {
        this.node = node;
        this.config.onShow(this.tip, node, opt.getContains());
      }
      this.setTooltipPosition($.event.getPos(e, win));
    }
  },
  
  setTooltipPosition: function(pos) {
    var tip = this.tip, 
        style = tip.style, 
        cont = this.config;
    style.display = '';
    //get window dimensions
    var win = {
      'height': document.body.clientHeight,
      'width': document.body.clientWidth
    };
    //get tooltip dimensions
    var obj = {
      'width': tip.offsetWidth,
      'height': tip.offsetHeight  
    };
    //set tooltip position
    var x = cont.offsetX, y = cont.offsetY;
    style.top = ((pos.y + y + obj.height > win.height)?  
        (pos.y - obj.height - y) : pos.y + y) + 'px';
    style.left = ((pos.x + obj.width + x > win.width)? 
        (pos.x - obj.width - x) : pos.x + x) + 'px';
  },
  
  hide: function(triggerCallback) {
    this.tip.style.display = 'none';
    triggerCallback && this.config.onHide();
  }
});

/*
  Class: NodeStyles
   
  Change node styles when clicking or hovering a node. This class is used internally.
  
  Used by:
  
  <ST>, <Sunburst>, <Hypertree>, <RGraph>, <TM>, <ForceDirected>, <Icicle>
  
  See also:
  
  <Options.NodeStyles>
*/
Extras.Classes.NodeStyles = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.fx = this.viz.fx;
    this.types = this.viz.fx.nodeTypes;
    this.nStyles = this.config;
    this.nodeStylesOnHover = this.nStyles.stylesHover;
    this.nodeStylesOnClick = this.nStyles.stylesClick;
    this.hoveredNode = false;
    this.fx.nodeFxAnimation = new Animation();
    
    this.down = false;
    this.move = false;
  },
  
  onMouseOut: function(e, win) {
    this.down = this.move = false;
    if(!this.hoveredNode) return;
    //mouseout a label
    if(this.dom && this.isLabel(e, win, true)) {
      this.toggleStylesOnHover(this.hoveredNode, false);
    }
    //mouseout canvas
    var rt = e.relatedTarget,
        canvasWidget = this.canvas.getElement();
    while(rt && rt.parentNode) {
      if(canvasWidget == rt.parentNode) return;
      rt = rt.parentNode;
    }
    this.toggleStylesOnHover(this.hoveredNode, false);
    this.hoveredNode = false;
  },
  
  onMouseOver: function(e, win) {
    //mouseover a label
    var label;
    if(this.dom && (label = this.isLabel(e, win, true))) {
      var node = this.viz.graph.getNode(label.id);
      if(node.selected) return;
      this.hoveredNode = node;
      this.toggleStylesOnHover(this.hoveredNode, true);
    }
  },
  
  onMouseDown: function(e, win, event, isRightClick) {
    if(isRightClick) return;
    var label;
    if(this.dom && (label = this.isLabel(e, win))) {
      this.down = this.viz.graph.getNode(label.id);
    } else if(!this.dom) {
      this.down = event.getNode();
    }
    this.move = false;
  },
  
  onMouseUp: function(e, win, event, isRightClick) {
    if(isRightClick) return;
    if(!this.move) {
      this.onClick(event.getNode());
    }
    this.down = this.move = false;
  },
  
  getRestoredStyles: function(node, type) {
    var restoredStyles = {}, 
        nStyles = this['nodeStylesOn' + type];
    for(var prop in nStyles) {
      restoredStyles[prop] = node.styles['$' + prop];
    }
    return restoredStyles;
  },
  
  toggleStylesOnHover: function(node, set) {
    if(this.nodeStylesOnHover) {
      this.toggleStylesOn('Hover', node, set);
    }
  },

  toggleStylesOnClick: function(node, set) {
    if(this.nodeStylesOnClick) {
      this.toggleStylesOn('Click', node, set);
    }
  },
  
  toggleStylesOn: function(type, node, set) {
    var viz = this.viz;
    var nStyles = this.nStyles;
    if(set) {
      var that = this;
      if(!node.styles) {
        node.styles = $.merge(node.data, {});
      }
      for(var s in this['nodeStylesOn' + type]) {
        var $s = '$' + s;
        if(!($s in node.styles)) {
            node.styles[$s] = node.getData(s); 
        }
      }
      viz.fx.nodeFx($.extend({
        'elements': {
          'id': node.id,
          'properties': that['nodeStylesOn' + type]
         },
         transition: Trans.Quart.easeOut,
         duration:300,
         fps:40
      }, this.config));
    } else {
      var restoredStyles = this.getRestoredStyles(node, type);
      viz.fx.nodeFx($.extend({
        'elements': {
          'id': node.id,
          'properties': restoredStyles
         },
         transition: Trans.Quart.easeOut,
         duration:300,
         fps:40
      }, this.config));
    }
  },

  onClick: function(node) {
    if(!node) return;
    var nStyles = this.nodeStylesOnClick;
    if(!nStyles) return;
    //if the node is selected then unselect it
    if(node.selected) {
      this.toggleStylesOnClick(node, false);
      delete node.selected;
    } else {
      //unselect all selected nodes...
      this.viz.graph.eachNode(function(n) {
        if(n.selected) {
          for(var s in nStyles) {
            n.setData(s, n.styles['$' + s], 'end');
          }
          delete n.selected;
        }
      });
      //select clicked node
      this.toggleStylesOnClick(node, true);
      node.selected = true;
      delete node.hovered;
      this.hoveredNode = false;
    }
  },
  
  onMouseMove: function(e, win, event) {
    //if mouse button is down and moving set move=true
    if(this.down) this.move = true;
    //already handled by mouseover/out
    if(this.dom && this.isLabel(e, win)) return;
    var nStyles = this.nodeStylesOnHover;
    if(!nStyles) return;
    
    if(!this.dom) {
      if(this.hoveredNode) {
        var geom = this.types[this.hoveredNode.getData('type')];
        var contains = geom && geom.contains && geom.contains.call(this.fx, 
            this.hoveredNode, event.getPos());
        if(contains) return;
      }
      var node = event.getNode();
      //if no node is being hovered then just exit
      if(!this.hoveredNode && !node) return;
      //if the node is hovered then exit
      if(node.hovered) return;
      //select hovered node
      if(node && !node.selected) {
        //check if an animation is running and exit it
        this.fx.nodeFxAnimation.stopTimer();
        //unselect all hovered nodes...
        this.viz.graph.eachNode(function(n) {
          if(n.hovered && !n.selected) {
            for(var s in nStyles) {
              n.setData(s, n.styles['$' + s], 'end');
            }
            delete n.hovered;
          }
        });
        //select hovered node
        node.hovered = true;
        this.hoveredNode = node;
        this.toggleStylesOnHover(node, true);
      } else if(this.hoveredNode && !this.hoveredNode.selected) {
        //check if an animation is running and exit it
        this.fx.nodeFxAnimation.stopTimer();
        //unselect hovered node
        this.toggleStylesOnHover(this.hoveredNode, false);
        delete this.hoveredNode.hovered;
        this.hoveredNode = false;
      }
    }
  }
});

Extras.Classes.Navigation = new Class({
  Implements: [ExtrasInitializer, EventsInterface],
  
  initializePost: function() {
    this.pos = false;
    this.pressed = false;
  },
  
  onMouseWheel: function(e, win, scroll) {
    if(!this.config.zooming) return;
    $.event.stop($.event.get(e, win));
    var val = this.config.zooming / 1000,
        ans = 1 + scroll * val;
    this.canvas.scale(ans, ans);
  },
  
  onMouseDown: function(e, win, eventInfo) {
    if(!this.config.panning) return;
    if(this.config.panning == 'avoid nodes' && (this.dom? this.isLabel(e, win) : eventInfo.getNode())) return;
    this.pressed = true;
    this.pos = eventInfo.getPos();
    var canvas = this.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY;
    this.pos.x *= sx;
    this.pos.x += ox;
    this.pos.y *= sy;
    this.pos.y += oy;
  },
  
  onMouseMove: function(e, win, eventInfo) {
    if(!this.config.panning) return;
    if(!this.pressed) return;
    if(this.config.panning == 'avoid nodes' && (this.dom? this.isLabel(e, win) : eventInfo.getNode())) return;
    var thispos = this.pos, 
        currentPos = eventInfo.getPos(),
        canvas = this.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY;
    currentPos.x *= sx;
    currentPos.y *= sy;
    currentPos.x += ox;
    currentPos.y += oy;
    var x = currentPos.x - thispos.x,
        y = currentPos.y - thispos.y;
    this.pos = currentPos;
    this.canvas.translate(x * 1/sx, y * 1/sy);
  },
  
  onMouseUp: function(e, win, eventInfo, isRightClick) {
    if(!this.config.panning) return;
    this.pressed = false;
  }
});


/*
 * File: Canvas.js
 *
 */

/*
 Class: Canvas
 
 	A canvas widget used by all visualizations. The canvas object can be accessed by doing *viz.canvas*. If you want to 
 	know more about <Canvas> options take a look at <Options.Canvas>.
 
 A canvas widget is a set of DOM elements that wrap the native canvas DOM Element providing a consistent API and behavior 
 across all browsers. It can also include Elements to add DOM (SVG or HTML) label support to all visualizations.
 
 Example:
 
 Suppose we have this HTML
 
 (start code xml)
 	<div id="infovis"></div>
 (end code)
 
 Now we create a new Visualization
 
 (start code js)
 	var viz = new $jit.Viz({
 		//Where to inject the canvas. Any div container will do.
 		'injectInto':'infovis',
		 //width and height for canvas. 
		 //Default's to the container offsetWidth and Height.
		 'width': 900,
		 'height':500
	 });
 (end code)

 The generated HTML will look like this
 
 (start code xml)
 <div id="infovis">
 	<div id="infovis-canvaswidget" style="position:relative;">
 	<canvas id="infovis-canvas" width=900 height=500
 	style="position:absolute; top:0; left:0; width:900px; height:500px;" />
 	<div id="infovis-label"
 	style="overflow:visible; position:absolute; top:0; left:0; width:900px; height:0px">
 	</div>
 	</div>
 </div>
 (end code)
 
 As you can see, the generated HTML consists of a canvas DOM Element of id *infovis-canvas* and a div label container
 of id *infovis-label*, wrapped in a main div container of id *infovis-canvaswidget*.
 */

var Canvas;
(function() {
  //check for native canvas support
  var canvasType = typeof HTMLCanvasElement,
      supportsCanvas = (canvasType == 'object' || canvasType == 'function');
  //create element function
  function $E(tag, props) {
    var elem = document.createElement(tag);
    for(var p in props) {
      if(typeof props[p] == "object") {
        $.extend(elem[p], props[p]);
      } else {
        elem[p] = props[p];
      }
    }
    if (tag == "canvas" && !supportsCanvas && G_vmlCanvasManager) {
      elem = G_vmlCanvasManager.initElement(document.body.appendChild(elem));
    }
    return elem;
  }
  //canvas widget which we will call just Canvas
  $jit.Canvas = Canvas = new Class({
    canvases: [],
    pos: false,
    element: false,
    labelContainer: false,
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,
    
    initialize: function(viz, opt) {
      this.viz = viz;
      this.opt = this.config = opt;
      var id = $.type(opt.injectInto) == 'string'? 
          opt.injectInto:opt.injectInto.id,
          type = opt.type,
          idLabel = id + "-label", 
          wrapper = $(id),
          width = opt.width || wrapper.offsetWidth,
          height = opt.height || wrapper.offsetHeight;
      this.id = id;
      //canvas options
      var canvasOptions = {
        injectInto: id,
        width: width,
        height: height
      };
      //create main wrapper
      this.element = $E('div', {
        'id': id + '-canvaswidget',
        'style': {
          'position': 'relative',
          'width': width + 'px',
          'height': height + 'px'
        }
      });
      //create label container
      this.labelContainer = this.createLabelContainer(opt.Label.type, 
          idLabel, canvasOptions);
      //create primary canvas
      this.canvases.push(new Canvas.Base[type]({
        config: $.extend({idSuffix: '-canvas'}, canvasOptions),
        plot: function(base) {
          viz.fx.plot();
        },
        resize: function() {
          viz.refresh();
        }
      }));
      //create secondary canvas
      var back = opt.background;
      if(back) {
        var backCanvas = new Canvas.Background[back.type](viz, $.extend(back, canvasOptions));
        this.canvases.push(new Canvas.Base[type](backCanvas));
      }
      //insert canvases
      var len = this.canvases.length;
      while(len--) {
        this.element.appendChild(this.canvases[len].canvas);
        if(len > 0) {
          this.canvases[len].plot();
        }
      }
      this.element.appendChild(this.labelContainer);
      wrapper.appendChild(this.element);
      //Update canvas position when the page is scrolled.
      var timer = null, that = this;
      $.addEvent(window, 'scroll', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          that.getPos(true); //update canvas position
        }, 500);
      });
    },
    /*
      Method: getCtx
      
      Returns the main canvas context object
      
      Example:
      
      (start code js)
       var ctx = canvas.getCtx();
       //Now I can use the native canvas context
       //and for example change some canvas styles
       ctx.globalAlpha = 1;
      (end code)
    */
    getCtx: function(i) {
      return this.canvases[i || 0].getCtx();
    },
    /*
      Method: getConfig
      
      Returns the current Configuration for this Canvas Widget.
      
      Example:
      
      (start code js)
       var config = canvas.getConfig();
      (end code)
    */
    getConfig: function() {
      return this.opt;
    },
    /*
      Method: getElement

      Returns the main Canvas DOM wrapper
      
      Example:
      
      (start code js)
       var wrapper = canvas.getElement();
       //Returns <div id="infovis-canvaswidget" ... >...</div> as element
      (end code)
    */
    getElement: function() {
      return this.element;
    },
    /*
      Method: getSize
      
      Returns canvas dimensions.
      
      Returns:
      
      An object with *width* and *height* properties.
      
      Example:
      (start code js)
      canvas.getSize(); //returns { width: 900, height: 500 }
      (end code)
    */
    getSize: function(i) {
      return this.canvases[i || 0].getSize();
    },
    /*
      Method: resize
      
      Resizes the canvas.
      
      Parameters:
      
      width - New canvas width.
      height - New canvas height.
      
      Example:
      
      (start code js)
       canvas.resize(width, height);
      (end code)
    
    */
    resize: function(width, height) {
      this.getPos(true);
      this.translateOffsetX = this.translateOffsetY = 0;
      this.scaleOffsetX = this.scaleOffsetY = 1;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].resize(width, height);
      }
      var style = this.element.style;
      style.width = width + 'px';
      style.height = height + 'px';
      if(this.labelContainer)
        this.labelContainer.style.width = width + 'px';
    },
    /*
      Method: translate
      
      Applies a translation to the canvas.
      
      Parameters:
      
      x - (number) x offset.
      y - (number) y offset.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.translate(30, 30);
      (end code)
    
    */
    translate: function(x, y, disablePlot) {
      this.translateOffsetX += x*this.scaleOffsetX;
      this.translateOffsetY += y*this.scaleOffsetY;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].translate(x, y, disablePlot);
      }
    },
    /*
      Method: scale
      
      Scales the canvas.
      
      Parameters:
      
      x - (number) scale value.
      y - (number) scale value.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.scale(0.5, 0.5);
      (end code)
    
    */
    scale: function(x, y, disablePlot) {
      var px = this.scaleOffsetX * x,
          py = this.scaleOffsetY * y;
      var dx = this.translateOffsetX * (x -1) / px,
          dy = this.translateOffsetY * (y -1) / py;
      this.scaleOffsetX = px;
      this.scaleOffsetY = py;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].scale(x, y, true);
      }
      this.translate(dx, dy, false);
    },
    /*
      Method: getPos
      
      Returns the canvas position as an *x, y* object.
      
      Parameters:
      
      force - (boolean) Default's *false*. Set this to *true* if you want to recalculate the position without using any cache information.
      
      Returns:
      
      An object with *x* and *y* properties.
      
      Example:
      (start code js)
      canvas.getPos(true); //returns { x: 900, y: 500 }
      (end code)
    */
    getPos: function(force){
      if(force || !this.pos) {
        return this.pos = $.getPos(this.getElement());
      }
      return this.pos;
    },
    /*
       Method: clear
       
       Clears the canvas.
    */
    clear: function(i){
      this.canvases[i||0].clear();
    },
    
    path: function(type, action){
      var ctx = this.canvases[0].getCtx();
      ctx.beginPath();
      action(ctx);
      ctx[type]();
      ctx.closePath();
    },
    
    createLabelContainer: function(type, idLabel, dim) {
      var NS = 'http://www.w3.org/2000/svg';
      if(type == 'HTML' || type == 'Native') {
        return $E('div', {
          'id': idLabel,
          'style': {
            'overflow': 'visible',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': dim.width + 'px',
            'height': 0
          }
        });
      } else if(type == 'SVG') {
        var svgContainer = document.createElementNS(NS, 'svg:svg');
        svgContainer.setAttribute("width", dim.width);
        svgContainer.setAttribute('height', dim.height);
        var style = svgContainer.style;
        style.position = 'absolute';
        style.left = style.top = '0px';
        var labelContainer = document.createElementNS(NS, 'svg:g');
        labelContainer.setAttribute('width', dim.width);
        labelContainer.setAttribute('height', dim.height);
        labelContainer.setAttribute('x', 0);
        labelContainer.setAttribute('y', 0);
        labelContainer.setAttribute('id', idLabel);
        svgContainer.appendChild(labelContainer);
        return svgContainer;
      }
    }
  });
  //base canvas wrapper
  Canvas.Base = {};
  Canvas.Base['2D'] = new Class({
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,

    initialize: function(viz) {
      this.viz = viz;
      this.opt = viz.config;
      this.size = false;
      this.createCanvas();
      this.translateToCenter();
    },
    createCanvas: function() {
      var opt = this.opt,
          width = opt.width,
          height = opt.height;
      this.canvas = $E('canvas', {
        'id': opt.injectInto + opt.idSuffix,
        'width': width,
        'height': height,
        'style': {
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'width': width + 'px',
          'height': height + 'px'
        }
      });
    },
    getCtx: function() {
      if(!this.ctx) 
        return this.ctx = this.canvas.getContext('2d');
      return this.ctx;
    },
    getSize: function() {
      if(this.size) return this.size;
      var canvas = this.canvas;
      return this.size = {
        width: canvas.width,
        height: canvas.height
      };
    },
    translateToCenter: function(ps) {
      var size = this.getSize(),
          width = ps? (size.width - ps.width - this.translateOffsetX*2) : size.width;
          height = ps? (size.height - ps.height - this.translateOffsetY*2) : size.height;
      var ctx = this.getCtx();
      ps && ctx.scale(1/this.scaleOffsetX, 1/this.scaleOffsetY);
      ctx.translate(width/2, height/2);
    },
    resize: function(width, height) {
      var size = this.getSize(),
          canvas = this.canvas,
          styles = canvas.style;
      this.size = false;
      canvas.width = width;
      canvas.height = height;
      styles.width = width + "px";
      styles.height = height + "px";
      //small ExCanvas fix
      if(!supportsCanvas) {
        this.translateToCenter(size);
      } else {
        this.translateToCenter();
      }
      this.translateOffsetX =
        this.translateOffsetY = 0;
      this.scaleOffsetX = 
        this.scaleOffsetY = 1;
      this.clear();
      this.viz.resize(width, height, this);
    },
    translate: function(x, y, disablePlot) {
      var sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.translateOffsetX += x*sx;
      this.translateOffsetY += y*sy;
      this.getCtx().translate(x, y);
      !disablePlot && this.plot();
    },
    scale: function(x, y, disablePlot) {
      this.scaleOffsetX *= x;
      this.scaleOffsetY *= y;
      this.getCtx().scale(x, y);
      !disablePlot && this.plot();
    },
    clear: function(){
      var size = this.getSize(),
          ox = this.translateOffsetX,
          oy = this.translateOffsetY,
          sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.getCtx().clearRect((-size.width / 2 - ox) * 1/sx, 
                              (-size.height / 2 - oy) * 1/sy, 
                              size.width * 1/sx, size.height * 1/sy);
    },
    plot: function() {
      this.clear();
      this.viz.plot(this);
    }
  });
  //background canvases
  //TODO(nico): document this!
  Canvas.Background = {};
  Canvas.Background.Circles = new Class({
    initialize: function(viz, options) {
      this.viz = viz;
      this.config = $.merge({
        idSuffix: '-bkcanvas',
        levelDistance: 100,
        numberOfCircles: 6,
        CanvasStyles: {},
        offset: 0
      }, options);
    },
    resize: function(width, height, base) {
      this.plot(base);
    },
    plot: function(base) {
      var canvas = base.canvas,
          ctx = base.getCtx(),
          conf = this.config,
          styles = conf.CanvasStyles;
      //set canvas styles
      for(var s in styles) ctx[s] = styles[s];
      var n = conf.numberOfCircles,
          rho = conf.levelDistance;
      for(var i=1; i<=n; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, rho * i, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
      }
      //TODO(nico): print labels too!
    }
  });
})();


/*
 * File: Polar.js
 * 
 * Defines the <Polar> class.
 *
 * Description:
 *
 * The <Polar> class, just like the <Complex> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 *
 * See also:
 *
 * <http://en.wikipedia.org/wiki/Polar_coordinates>
 *
*/

/*
   Class: Polar

   A multi purpose polar representation.

   Description:
 
   The <Polar> class, just like the <Complex> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 
   See also:
 
   <http://en.wikipedia.org/wiki/Polar_coordinates>
 
   Parameters:

      theta - An angle.
      rho - The norm.
*/

var Polar = function(theta, rho) {
  this.theta = theta || 0;
  this.rho = rho || 0;
};

$jit.Polar = Polar;

Polar.prototype = {
    /*
       Method: getc
    
       Returns a complex number.
    
       Parameters:

       simple - _optional_ If *true*, this method will return only an object holding x and y properties and not a <Complex> instance. Default's *false*.

      Returns:
    
          A complex number.
    */
    getc: function(simple) {
        return this.toComplex(simple);
    },

    /*
       Method: getp
    
       Returns a <Polar> representation.
    
       Returns:
    
          A variable in polar coordinates.
    */
    getp: function() {
        return this;
    },


    /*
       Method: set
    
       Sets a number.

       Parameters:

       v - A <Complex> or <Polar> instance.
    
    */
    set: function(v) {
        v = v.getp();
        this.theta = v.theta; this.rho = v.rho;
    },

    /*
       Method: setc
    
       Sets a <Complex> number.

       Parameters:

       x - A <Complex> number real part.
       y - A <Complex> number imaginary part.
    
    */
    setc: function(x, y) {
        this.rho = Math.sqrt(x * x + y * y);
        this.theta = Math.atan2(y, x);
        if(this.theta < 0) this.theta += Math.PI * 2;
    },

    /*
       Method: setp
    
       Sets a polar number.

       Parameters:

       theta - A <Polar> number angle property.
       rho - A <Polar> number rho property.
    
    */
    setp: function(theta, rho) {
        this.theta = theta; 
        this.rho = rho;
    },

    /*
       Method: clone
    
       Returns a copy of the current object.
    
       Returns:
    
          A copy of the real object.
    */
    clone: function() {
        return new Polar(this.theta, this.rho);
    },

    /*
       Method: toComplex
    
        Translates from polar to cartesian coordinates and returns a new <Complex> instance.
    
        Parameters:

        simple - _optional_ If *true* this method will only return an object with x and y properties (and not the whole <Complex> instance). Default's *false*.
 
        Returns:
    
          A new <Complex> instance.
    */
    toComplex: function(simple) {
        var x = Math.cos(this.theta) * this.rho;
        var y = Math.sin(this.theta) * this.rho;
        if(simple) return { 'x': x, 'y': y};
        return new Complex(x, y);
    },

    /*
       Method: add
    
        Adds two <Polar> instances.
    
       Parameters:

       polar - A <Polar> number.

       Returns:
    
          A new Polar instance.
    */
    add: function(polar) {
        return new Polar(this.theta + polar.theta, this.rho + polar.rho);
    },
    
    /*
       Method: scale
    
        Scales a polar norm.
    
        Parameters:

        number - A scale factor.
        
        Returns:
    
          A new Polar instance.
    */
    scale: function(number) {
        return new Polar(this.theta, this.rho * number);
    },
    
    /*
       Method: equals
    
       Comparison method.

       Returns *true* if the theta and rho properties are equal.

       Parameters:

       c - A <Polar> number.

       Returns:

       *true* if the theta and rho parameters for these objects are equal. *false* otherwise.
    */
    equals: function(c) {
        return this.theta == c.theta && this.rho == c.rho;
    },
    
    /*
       Method: $add
    
        Adds two <Polar> instances affecting the current object.
    
       Paramters:

       polar - A <Polar> instance.

       Returns:
    
          The changed object.
    */
    $add: function(polar) {
        this.theta = this.theta + polar.theta; this.rho += polar.rho;
        return this;
    },

    /*
       Method: $madd
    
        Adds two <Polar> instances affecting the current object. The resulting theta angle is modulo 2pi.
    
       Parameters:

       polar - A <Polar> instance.

       Returns:
    
          The changed object.
    */
    $madd: function(polar) {
        this.theta = (this.theta + polar.theta) % (Math.PI * 2); this.rho += polar.rho;
        return this;
    },

    
    /*
       Method: $scale
    
        Scales a polar instance affecting the object.
    
      Parameters:

      number - A scaling factor.

      Returns:
    
          The changed object.
    */
    $scale: function(number) {
        this.rho *= number;
        return this;
    },
    
    /*
      Method: isZero
   
      Returns *true* if the number is zero.
   
   */
    isZero: function () {
      var almostZero = 0.0001, abs = Math.abs;
      return abs(this.theta) < almostZero && abs(this.rho) < almostZero;
    },

    /*
       Method: interpolate
    
        Calculates a polar interpolation between two points at a given delta moment.

        Parameters:
      
        elem - A <Polar> instance.
        delta - A delta factor ranging [0, 1].
    
       Returns:
    
          A new <Polar> instance representing an interpolation between _this_ and _elem_
    */
    interpolate: function(elem, delta) {
        var pi = Math.PI, pi2 = pi * 2;
        var ch = function(t) {
            var a =  (t < 0)? (t % pi2) + pi2 : t % pi2;
            return a;
        };
        var tt = this.theta, et = elem.theta;
        var sum, diff = Math.abs(tt - et);
        if(diff == pi) {
          if(tt > et) {
            sum = ch((et + ((tt - pi2) - et) * delta)) ;
          } else {
            sum = ch((et - pi2 + (tt - (et)) * delta));
          }
        } else if(diff >= pi) {
          if(tt > et) {
            sum = ch((et + ((tt - pi2) - et) * delta)) ;
          } else {
            sum = ch((et - pi2 + (tt - (et - pi2)) * delta));
          }
        } else {  
          sum = ch((et + (tt - et) * delta)) ;
        }
        var r = (this.rho - elem.rho) * delta + elem.rho;
        return {
          'theta': sum,
          'rho': r
        };
    }
};


var $P = function(a, b) { return new Polar(a, b); };

Polar.KER = $P(0, 0);



/*
 * File: Complex.js
 * 
 * Defines the <Complex> class.
 *
 * Description:
 *
 * The <Complex> class, just like the <Polar> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 *
 * See also:
 *
 * <http://en.wikipedia.org/wiki/Complex_number>
 *
*/

/*
   Class: Complex
    
   A multi-purpose Complex Class with common methods.
 
   Description:
 
   The <Complex> class, just like the <Polar> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 
   See also:
 
   <http://en.wikipedia.org/wiki/Complex_number>

   Parameters:

   x - _optional_ A Complex number real part.
   y - _optional_ A Complex number imaginary part.
 
*/

var Complex = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

$jit.Complex = Complex;

Complex.prototype = {
    /*
       Method: getc
    
       Returns a complex number.
    
       Returns:
    
          A complex number.
    */
    getc: function() {
        return this;
    },

    /*
       Method: getp
    
       Returns a <Polar> representation of this number.
    
       Parameters:

       simple - _optional_ If *true*, this method will return only an object holding theta and rho properties and not a <Polar> instance. Default's *false*.

       Returns:
    
          A variable in <Polar> coordinates.
    */
    getp: function(simple) {
        return this.toPolar(simple);
    },


    /*
       Method: set
    
       Sets a number.

       Parameters:

       c - A <Complex> or <Polar> instance.
    
    */
    set: function(c) {
      c = c.getc(true);
      this.x = c.x; 
      this.y = c.y;
    },

    /*
       Method: setc
    
       Sets a complex number.

       Parameters:

       x - A <Complex> number Real part.
       y - A <Complex> number Imaginary part.
    
    */
    setc: function(x, y) {
        this.x = x; 
        this.y = y;
    },

    /*
       Method: setp
    
       Sets a polar number.

       Parameters:

       theta - A <Polar> number theta property.
       rho - A <Polar> number rho property.
    
    */
    setp: function(theta, rho) {
        this.x = Math.cos(theta) * rho;
        this.y = Math.sin(theta) * rho;
    },

    /*
       Method: clone
    
       Returns a copy of the current object.
    
       Returns:
    
          A copy of the real object.
    */
    clone: function() {
        return new Complex(this.x, this.y);
    },

    /*
       Method: toPolar
    
       Transforms cartesian to polar coordinates.
    
       Parameters:

       simple - _optional_ If *true* this method will only return an object with theta and rho properties (and not the whole <Polar> instance). Default's *false*.
       
       Returns:
    
          A new <Polar> instance.
    */
    
    toPolar: function(simple) {
        var rho = this.norm();
        var atan = Math.atan2(this.y, this.x);
        if(atan < 0) atan += Math.PI * 2;
        if(simple) return { 'theta': atan, 'rho': rho };
        return new Polar(atan, rho);
    },
    /*
       Method: norm
    
       Calculates a <Complex> number norm.
    
       Returns:
    
          A real number representing the complex norm.
    */
    norm: function () {
        return Math.sqrt(this.squaredNorm());
    },
    
    /*
       Method: squaredNorm
    
       Calculates a <Complex> number squared norm.
    
       Returns:
    
          A real number representing the complex squared norm.
    */
    squaredNorm: function () {
        return this.x*this.x + this.y*this.y;
    },

    /*
       Method: add
    
       Returns the result of adding two complex numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    add: function(pos) {
        return new Complex(this.x + pos.x, this.y + pos.y);
    },

    /*
       Method: prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    prod: function(pos) {
        return new Complex(this.x*pos.x - this.y*pos.y, this.y*pos.x + this.x*pos.y);
    },

    /*
       Method: conjugate
    
       Returns the conjugate of this <Complex> number.

       Does not alter the original object.

       Returns:
    
         The conjugate of this <Complex> number.
    */
    conjugate: function() {
        return new Complex(this.x, -this.y);
    },


    /*
       Method: scale
    
       Returns the result of scaling a <Complex> instance.
       
       Does not alter the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    scale: function(factor) {
        return new Complex(this.x * factor, this.y * factor);
    },

    /*
       Method: equals
    
       Comparison method.

       Returns *true* if both real and imaginary parts are equal.

       Parameters:

       c - A <Complex> instance.

       Returns:

       A boolean instance indicating if both <Complex> numbers are equal.
    */
    equals: function(c) {
        return this.x == c.x && this.y == c.y;
    },

    /*
       Method: $add
    
       Returns the result of adding two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    $add: function(pos) {
        this.x += pos.x; this.y += pos.y;
        return this;    
    },
    
    /*
       Method: $prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    $prod:function(pos) {
        var x = this.x, y = this.y;
        this.x = x*pos.x - y*pos.y;
        this.y = y*pos.x + x*pos.y;
        return this;
    },
    
    /*
       Method: $conjugate
    
       Returns the conjugate for this <Complex>.
       
       Alters the original object.

       Returns:
    
         The conjugate for this complex.
    */
    $conjugate: function() {
        this.y = -this.y;
        return this;
    },
    
    /*
       Method: $scale
    
       Returns the result of scaling a <Complex> instance.
       
       Alters the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $scale: function(factor) {
        this.x *= factor; this.y *= factor;
        return this;
    },
    
    /*
       Method: $div
    
       Returns the division of two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> number.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $div: function(pos) {
        var x = this.x, y = this.y;
        var sq = pos.squaredNorm();
        this.x = x * pos.x + y * pos.y; this.y = y * pos.x - x * pos.y;
        return this.$scale(1 / sq);
    },

    /*
      Method: isZero
   
      Returns *true* if the number is zero.
   
   */
    isZero: function () {
      var almostZero = 0.0001, abs = Math.abs;
      return abs(this.x) < almostZero && abs(this.y) < almostZero;
    }
};

var $C = function(a, b) { return new Complex(a, b); };

Complex.KER = $C(0, 0);



/*
 * File: Graph.js
 *
*/

/*
 Class: Graph

 A Graph Class that provides useful manipulation functions. You can find more manipulation methods in the <Graph.Util> object.

 An instance of this class can be accessed by using the *graph* parameter of any tree or graph visualization.
 
 Example:

 (start code js)
   //create new visualization
   var viz = new $jit.Viz(options);
   //load JSON data
   viz.loadJSON(json);
   //access model
   viz.graph; //<Graph> instance
 (end code)
 
 Implements:
 
 The following <Graph.Util> methods are implemented in <Graph>
 
  - <Graph.Util.getNode>
  - <Graph.Util.eachNode>
  - <Graph.Util.computeLevels>
  - <Graph.Util.eachBFS>
  - <Graph.Util.clean>
  - <Graph.Util.getClosestNodeToPos>
  - <Graph.Util.getClosestNodeToOrigin>
 
*/  

$jit.Graph = new Class({

  initialize: function(opt, Node, Edge, Label) {
    var innerOptions = {
    'klass': Complex,
    'Node': {}
    };
    this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
    this.opt = $.merge(innerOptions, opt || {});
    this.nodes = {};
    this.edges = {};
    
    //add nodeList methods
    var that = this;
    this.nodeList = {};
    for(var p in Accessors) {
      that.nodeList[p] = (function(p) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          that.eachNode(function(n) {
            n[p].apply(n, args);
          });
        };
      })(p);
    }

 },

/*
     Method: getNode
    
     Returns a <Graph.Node> by *id*.

     Parameters:

     id - (string) A <Graph.Node> id.

     Example:

     (start code js)
       var node = graph.getNode('nodeId');
     (end code)
*/  
 getNode: function(id) {
    if(this.hasNode(id)) return this.nodes[id];
    return false;
 },

 /*
     Method: get
    
     An alias for <Graph.Util.getNode>. Returns a node by *id*.
    
     Parameters:
    
     id - (string) A <Graph.Node> id.
    
     Example:
    
     (start code js)
       var node = graph.get('nodeId');
     (end code)
*/  
  get: function(id) {
    return this.getNode(id);
  },

 /*
   Method: getByName
  
   Returns a <Graph.Node> by *name*.
  
   Parameters:
  
   name - (string) A <Graph.Node> name.
  
   Example:
  
   (start code js)
     var node = graph.getByName('someName');
   (end code)
  */  
  getByName: function(name) {
    for(var id in this.nodes) {
      var n = this.nodes[id];
      if(n.name == name) return n;
    }
    return false;
  },

/*
   Method: getAdjacence
  
   Returns a <Graph.Adjacence> object connecting nodes with ids *id* and *id2*.

   Parameters:

   id - (string) A <Graph.Node> id.
   id2 - (string) A <Graph.Node> id.
*/  
  getAdjacence: function (id, id2) {
    if(id in this.edges) {
      return this.edges[id][id2];
    }
    return false;
 },

    /*
     Method: addNode
    
     Adds a node.
     
     Parameters:
    
      obj - An object with the properties described below

      id - (string) A node id
      name - (string) A node's name
      data - (object) A node's data hash

    See also:
    <Graph.Node>

  */  
  addNode: function(obj) { 
   if(!this.nodes[obj.id]) {  
     var edges = this.edges[obj.id] = {};
     this.nodes[obj.id] = new Graph.Node($.extend({
        'id': obj.id,
        'name': obj.name,
        'data': $.merge(obj.data || {}, {}),
        'adjacencies': edges 
      }, this.opt.Node), 
      this.opt.klass, 
      this.Node, 
      this.Edge,
      this.Label);
    }
    return this.nodes[obj.id];
  },
  
    /*
     Method: addAdjacence
    
     Connects nodes specified by *obj* and *obj2*. If not found, nodes are created.
     
     Parameters:
    
      obj - (object) A <Graph.Node> object.
      obj2 - (object) Another <Graph.Node> object.
      data - (object) A data object. Used to store some extra information in the <Graph.Adjacence> object created.

    See also:

    <Graph.Node>, <Graph.Adjacence>
    */  
  addAdjacence: function (obj, obj2, data) {
    if(!this.hasNode(obj.id)) { this.addNode(obj); }
    if(!this.hasNode(obj2.id)) { this.addNode(obj2); }
    obj = this.nodes[obj.id]; obj2 = this.nodes[obj2.id];
    if(!obj.adjacentTo(obj2)) {
      var adjsObj = this.edges[obj.id] = this.edges[obj.id] || {};
      var adjsObj2 = this.edges[obj2.id] = this.edges[obj2.id] || {};
      adjsObj[obj2.id] = adjsObj2[obj.id] = new Graph.Adjacence(obj, obj2, data, this.Edge, this.Label);
      return adjsObj[obj2.id];
    }
    return this.edges[obj.id][obj2.id];
 },

    /*
     Method: removeNode
    
     Removes a <Graph.Node> matching the specified *id*.

     Parameters:

     id - (string) A node's id.

    */  
  removeNode: function(id) {
    if(this.hasNode(id)) {
      delete this.nodes[id];
      var adjs = this.edges[id];
      for(var to in adjs) {
        delete this.edges[to][id];
      }
      delete this.edges[id];
    }
  },
  
/*
     Method: removeAdjacence
    
     Removes a <Graph.Adjacence> matching *id1* and *id2*.

     Parameters:

     id1 - (string) A <Graph.Node> id.
     id2 - (string) A <Graph.Node> id.
*/  
  removeAdjacence: function(id1, id2) {
    delete this.edges[id1][id2];
    delete this.edges[id2][id1];
  },

   /*
     Method: hasNode
    
     Returns a boolean indicating if the node belongs to the <Graph> or not.
     
     Parameters:
    
        id - (string) Node id.
   */  
  hasNode: function(id) {
    return id in this.nodes;
  },
  
  /*
    Method: empty

    Empties the Graph

  */
  empty: function() { this.nodes = {}; this.edges = {};}

});

var Graph = $jit.Graph;

/*
 Object: Accessors
 
 Defines a set of methods for data, canvas and label styles manipulation implemented by <Graph.Node> and <Graph.Adjacence> instances.
 
 */
var Accessors;

(function () {
  var getDataInternal = function(prefix, prop, type, force, prefixConfig) {
    var data;
    type = type || 'current';
    prefix = "$" + (prefix ? prefix + "-" : "");

    if(type == 'current') {
      data = this.data;
    } else if(type == 'start') {
      data = this.startData;
    } else if(type == 'end') {
      data = this.endData;
    }

    var dollar = prefix + prop;

    if(force) {
      return data[dollar];
    }

    if(!this.Config.overridable)
      return prefixConfig[prop] || 0;

    return (dollar in data) ?
      data[dollar] : ((dollar in this.data) ? this.data[dollar] : (prefixConfig[prop] || 0));
  }

  var setDataInternal = function(prefix, prop, value, type) {
    type = type || 'current';
    prefix = '$' + (prefix ? prefix + '-' : '');

    var data;

    if(type == 'current') {
      data = this.data;
    } else if(type == 'start') {
      data = this.startData;
    } else if(type == 'end') {
      data = this.endData;
    }

    data[prefix + prop] = value;
  }

  var removeDataInternal = function(prefix, properties) {
    prefix = '$' + (prefix ? prefix + '-' : '');
    var that = this;
    $.each(properties, function(prop) {
      var pref = prefix + prop;
      delete that.data[pref];
      delete that.endData[pref];
      delete that.startData[pref];
    });
  }

  Accessors = {
    /*
    Method: getData

    Returns the specified data value property.
    This is useful for querying special/reserved <Graph.Node> data properties
    (i.e dollar prefixed properties).

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not needed. For
              example *getData(width)* will return *data.$width*.
      type  - (string) The type of the data property queried. Default's "current". You can access *start* and *end* 
              data properties also. These properties are used when making animations.
      force - (boolean) Whether to obtain the true value of the property (equivalent to
              *data.$prop*) or to check for *node.overridable = true* first.

    Returns:

      The value of the dollar prefixed property or the global Node/Edge property
      value if *overridable=false*

    Example:
    (start code js)
     node.getData('width'); //will return node.data.$width if Node.overridable=true;
    (end code)
    */
    getData: function(prop, type, force) {
      return getDataInternal.call(this, "", prop, type, force, this.Config);
    },


    /*
    Method: setData

    Sets the current data property with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not necessary. For
              example *setData(width)* will set *data.$width*.
      value - (mixed) The value to store.
      type  - (string) The type of the data property to store. Default's "current" but
              can also be "start" or "end".

    Example:
    
    (start code js)
     node.setData('width', 30);
    (end code)
    
    If we were to make an animation of a node/edge width then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setData('width', 10, 'start');
      node.setData('width', 30, 'end');
      //will animate nodes width property
      viz.fx.animate({
        modes: ['node-property:width'],
        duration: 1000
      });
    (end code)
    */
    setData: function(prop, value, type) {
      setDataInternal.call(this, "", prop, value, type);
    },

    /*
    Method: setDataset

    Convenience method to set multiple data values at once.
    
    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    Example:
    (start code js)
      node.setDataset(['current', 'end'], {
        'width': [100, 5],
        'color': ['#fff', '#ccc']
      });
      //...or also
      node.setDataset('end', {
        'width': 5,
        'color': '#ccc'
      });
    (end code)
    
    See also: 
    
    <Accessors.setData>
    
    */
    setDataset: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setData(attr, val[i], types[i]);
        }
      }
    },
    
    /*
    Method: removeData

    Remove data properties.

    Parameters:

    One or more property names as arguments. The dollar sign is not needed.

    Example:
    (start code js)
    node.removeData('width'); //now the default width value is returned
    (end code)
    */
    removeData: function() {
      removeDataInternal.call(this, "", Array.prototype.slice.call(arguments));
    },

    /*
    Method: getCanvasStyle

    Returns the specified canvas style data value property. This is useful for
    querying special/reserved <Graph.Node> canvas style data properties (i.e.
    dollar prefixed properties that match with $canvas-<name of canvas style>).

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not needed. For
              example *getCanvasStyle(shadowBlur)* will return *data[$canvas-shadowBlur]*.
      type  - (string) The type of the data property queried. Default's *current*. You can access *start* and *end* 
              data properties also.
              
    Example:
    (start code js)
      node.getCanvasStyle('shadowBlur');
    (end code)
    
    See also:
    
    <Accessors.getData>
    */
    getCanvasStyle: function(prop, type, force) {
      return getDataInternal.call(
          this, 'canvas', prop, type, force, this.Config.CanvasStyles);
    },

    /*
    Method: setCanvasStyle

    Sets the canvas style data property with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.
    
    Parameters:
    
    prop - (string) Name of the property. Can be any canvas property like 'shadowBlur', 'shadowColor', 'strokeStyle', etc.
    value - (mixed) The value to set to the property.
    type - (string) Default's *current*. Whether to set *start*, *current* or *end* type properties.
    
    Example:
    
    (start code js)
     node.setCanvasStyle('shadowBlur', 30);
    (end code)
    
    If we were to make an animation of a node/edge shadowBlur canvas style then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setCanvasStyle('shadowBlur', 10, 'start');
      node.setCanvasStyle('shadowBlur', 30, 'end');
      //will animate nodes canvas style property for nodes
      viz.fx.animate({
        modes: ['node-style:shadowBlur'],
        duration: 1000
      });
    (end code)
    
    See also:
    
    <Accessors.setData>.
    */
    setCanvasStyle: function(prop, value, type) {
      setDataInternal.call(this, 'canvas', prop, value, type);
    },

    /*
    Method: setCanvasStyles

    Convenience method to set multiple styles at once.

    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    See also:
    
    <Accessors.setDataset>.
    */
    setCanvasStyles: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setCanvasStyle(attr, val[i], types[i]);
        }
      }
    },

    /*
    Method: removeCanvasStyle

    Remove canvas style properties from data.

    Parameters:
    
    A variable number of canvas style strings.

    See also:
    
    <Accessors.removeData>.
    */
    removeCanvasStyle: function() {
      removeDataInternal.call(this, 'canvas', Array.prototype.slice.call(arguments));
    },

    /*
    Method: getLabelData

    Returns the specified label data value property. This is useful for
    querying special/reserved <Graph.Node> label options (i.e.
    dollar prefixed properties that match with $label-<name of label style>).

    Parameters:

      prop  - (string) The name of the property. The dollar sign prefix is not needed. For
              example *getLabelData(size)* will return *data[$label-size]*.
      type  - (string) The type of the data property queried. Default's *current*. You can access *start* and *end* 
              data properties also.
              
    See also:
    
    <Accessors.getData>.
    */
    getLabelData: function(prop, type, force) {
      return getDataInternal.call(
          this, 'label', prop, type, force, this.Label);
    },

    /*
    Method: setLabelData

    Sets the current label data with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.

    Parameters:
    
    prop - (string) Name of the property. Can be any canvas property like 'shadowBlur', 'shadowColor', 'strokeStyle', etc.
    value - (mixed) The value to set to the property.
    type - (string) Default's *current*. Whether to set *start*, *current* or *end* type properties.
    
    Example:
    
    (start code js)
     node.setLabelData('size', 30);
    (end code)
    
    If we were to make an animation of a node label size then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      //set start and end values
      node.setLabelData('size', 10, 'start');
      node.setLabelData('size', 30, 'end');
      //will animate nodes label size
      viz.fx.animate({
        modes: ['label-property:size'],
        duration: 1000
      });
    (end code)
    
    See also:
    
    <Accessors.setData>.
    */
    setLabelData: function(prop, value, type) {
      setDataInternal.call(this, 'label', prop, value, type);
    },

    /*
    Method: setLabelDataset

    Convenience function to set multiple label data at once.

    Parameters:
    
    types - (array|string) A set of 'current', 'end' or 'start' values.
    obj - (object) A hash containing the names and values of the properties to be altered.

    See also:
    
    <Accessors.setDataset>.
    */
    setLabelDataset: function(types, obj) {
      types = $.splat(types);
      for(var attr in obj) {
        for(var i=0, val = $.splat(obj[attr]), l=types.length; i<l; i++) {
          this.setLabelData(attr, val[i], types[i]);
        }
      }
    },

    /*
    Method: removeLabelData

    Remove label properties from data.
    
    Parameters:
    
    A variable number of label property strings.

    See also:
    
    <Accessors.removeData>.
    */
    removeLabelData: function() {
      removeDataInternal.call(this, 'label', Array.prototype.slice.call(arguments));
    }
  };
})();

/*
     Class: Graph.Node

     A <Graph> node.
     
     Implements:
     
     <Accessors> methods.
     
     The following <Graph.Util> methods are implemented by <Graph.Node>
     
    - <Graph.Util.eachAdjacency>
    - <Graph.Util.eachLevel>
    - <Graph.Util.eachSubgraph>
    - <Graph.Util.eachSubnode>
    - <Graph.Util.anySubnode>
    - <Graph.Util.getSubnodes>
    - <Graph.Util.getParents>
    - <Graph.Util.isDescendantOf>     
*/
Graph.Node = new Class({
    
  initialize: function(opt, klass, Node, Edge, Label) {
    var innerOptions = {
      'id': '',
      'name': '',
      'data': {},
      'startData': {},
      'endData': {},
      'adjacencies': {},

      'selected': false,
      'drawn': false,
      'exist': false,

      'angleSpan': {
        'begin': 0,
        'end' : 0
      },

      'pos': new klass,
      'startPos': new klass,
      'endPos': new klass
    };
    
    $.extend(this, $.extend(innerOptions, opt));
    this.Config = this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
  },

    /*
       Method: adjacentTo
    
       Indicates if the node is adjacent to the node specified by id

       Parameters:
    
          id - (string) A node id.
    
       Example:
       (start code js)
        node.adjacentTo('nodeId') == true;
       (end code)
    */
    adjacentTo: function(node) {
        return node.id in this.adjacencies;
    },

    /*
       Method: getAdjacency
    
       Returns a <Graph.Adjacence> object connecting the current <Graph.Node> and the node having *id* as id.

       Parameters:
    
          id - (string) A node id.
    */  
    getAdjacency: function(id) {
        return this.adjacencies[id];
    },

    /*
      Method: getPos
   
      Returns the position of the node.
  
      Parameters:
   
         type - (string) Default's *current*. Possible values are "start", "end" or "current".
   
      Returns:
   
        A <Complex> or <Polar> instance.
  
      Example:
      (start code js)
       var pos = node.getPos('end');
      (end code)
   */
   getPos: function(type) {
       type = type || "current";
       if(type == "current") {
         return this.pos;
       } else if(type == "end") {
         return this.endPos;
       } else if(type == "start") {
         return this.startPos;
       }
   },
   /*
     Method: setPos
  
     Sets the node's position.
  
     Parameters:
  
        value - (object) A <Complex> or <Polar> instance.
        type - (string) Default's *current*. Possible values are "start", "end" or "current".
  
     Example:
     (start code js)
      node.setPos(new $jit.Complex(0, 0), 'end');
     (end code)
  */
  setPos: function(value, type) {
      type = type || "current";
      var pos;
      if(type == "current") {
        pos = this.pos;
      } else if(type == "end") {
        pos = this.endPos;
      } else if(type == "start") {
        pos = this.startPos;
      }
      pos.set(value);
  }
});

Graph.Node.implement(Accessors);

/*
     Class: Graph.Adjacence

     A <Graph> adjacence (or edge) connecting two <Graph.Nodes>.
     
     Implements:
     
     <Accessors> methods.

     See also:

     <Graph>, <Graph.Node>

     Properties:
     
      nodeFrom - A <Graph.Node> connected by this edge.
      nodeTo - Another  <Graph.Node> connected by this edge.
      data - Node data property containing a hash (i.e {}) with custom options.
*/
Graph.Adjacence = new Class({
  
  initialize: function(nodeFrom, nodeTo, data, Edge, Label) {
    this.nodeFrom = nodeFrom;
    this.nodeTo = nodeTo;
    this.data = data || {};
    this.startData = {};
    this.endData = {};
    this.Config = this.Edge = Edge;
    this.Label = Label;
  }
});

Graph.Adjacence.implement(Accessors);

/*
   Object: Graph.Util

   <Graph> traversal and processing utility object.
   
   Note:
   
   For your convenience some of these methods have also been appended to <Graph> and <Graph.Node> classes.
*/
Graph.Util = {
    /*
       filter
    
       For internal use only. Provides a filtering function based on flags.
    */
    filter: function(param) {
        if(!param || !($.type(param) == 'string')) return function() { return true; };
        var props = param.split(" ");
        return function(elem) {
            for(var i=0; i<props.length; i++) { 
              if(elem[props[i]]) { 
                return false; 
              }
            }
            return true;
        };
    },
    /*
       Method: getNode
    
       Returns a <Graph.Node> by *id*.
       
       Also implemented by:
       
       <Graph>

       Parameters:

       graph - (object) A <Graph> instance.
       id - (string) A <Graph.Node> id.

       Example:

       (start code js)
         $jit.Graph.Util.getNode(graph, 'nodeid');
         //or...
         graph.getNode('nodeid');
       (end code)
    */
    getNode: function(graph, id) {
        return graph.nodes[id];
    },
    
    /*
       Method: eachNode
    
       Iterates over <Graph> nodes performing an *action*.
       
       Also implemented by:
       
       <Graph>.

       Parameters:

       graph - (object) A <Graph> instance.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachNode(graph, function(node) {
          alert(node.name);
         });
         //or...
         graph.eachNode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachNode: function(graph, action, flags) {
        var filter = this.filter(flags);
        for(var i in graph.nodes) {
          if(filter(graph.nodes[i])) action(graph.nodes[i]);
        } 
    },
    
    /*
      Method: each
   
      Iterates over <Graph> nodes performing an *action*. It's an alias for <Graph.Util.eachNode>.
      
      Also implemented by:
      
      <Graph>.
  
      Parameters:
  
      graph - (object) A <Graph> instance.
      action - (function) A callback function having a <Graph.Node> as first formal parameter.
  
      Example:
      (start code js)
        $jit.Graph.Util.each(graph, function(node) {
         alert(node.name);
        });
        //or...
        graph.each(function(node) {
          alert(node.name);
        });
      (end code)
   */
   each: function(graph, action, flags) {
      this.eachNode(graph, action, flags); 
   },

 /*
       Method: eachAdjacency
    
       Iterates over <Graph.Node> adjacencies applying the *action* function.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:

       node - (object) A <Graph.Node>.
       action - (function) A callback function having <Graph.Adjacence> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachAdjacency(node, function(adj) {
          alert(adj.nodeTo.name);
         });
         //or...
         node.eachAdjacency(function(adj) {
           alert(adj.nodeTo.name);
         });
       (end code)
    */
    eachAdjacency: function(node, action, flags) {
        var adj = node.adjacencies, filter = this.filter(flags);
        for(var id in adj) {
          var a = adj[id];
          if(filter(a)) {
            if(a.nodeFrom != node) {
              var tmp = a.nodeFrom;
              a.nodeFrom = a.nodeTo;
              a.nodeTo = tmp;
            }
            action(a, id);
          }
        }
    },

     /*
       Method: computeLevels
    
       Performs a BFS traversal setting the correct depth for each node.
        
       Also implemented by:
       
       <Graph>.
       
       Note:
       
       The depth of each node can then be accessed by 
       >node._depth

       Parameters:

       graph - (object) A <Graph>.
       id - (string) A starting node id for the BFS traversal.
       startDepth - (optional|number) A minimum depth value. Default's 0.

    */
    computeLevels: function(graph, id, startDepth, flags) {
        startDepth = startDepth || 0;
        var filter = this.filter(flags);
        this.eachNode(graph, function(elem) {
            elem._flag = false;
            elem._depth = -1;
        }, flags);
        var root = graph.getNode(id);
        root._depth = startDepth;
        var queue = [root];
        while(queue.length != 0) {
            var node = queue.pop();
            node._flag = true;
            this.eachAdjacency(node, function(adj) {
                var n = adj.nodeTo;
                if(n._flag == false && filter(n)) {
                    if(n._depth < 0) n._depth = node._depth + 1 + startDepth;
                    queue.unshift(n);
                }
            }, flags);
        }
    },

    /*
       Method: eachBFS
    
       Performs a BFS traversal applying *action* to each <Graph.Node>.
       
       Also implemented by:
       
       <Graph>.

       Parameters:

       graph - (object) A <Graph>.
       id - (string) A starting node id for the BFS traversal.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachBFS(graph, 'mynodeid', function(node) {
          alert(node.name);
         });
         //or...
         graph.eachBFS('mynodeid', function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachBFS: function(graph, id, action, flags) {
        var filter = this.filter(flags);
        this.clean(graph);
        var queue = [graph.getNode(id)];
        while(queue.length != 0) {
            var node = queue.pop();
            node._flag = true;
            action(node, node._depth);
            this.eachAdjacency(node, function(adj) {
                var n = adj.nodeTo;
                if(n._flag == false && filter(n)) {
                    n._flag = true;
                    queue.unshift(n);
                }
            }, flags);
        }
    },
    
    /*
       Method: eachLevel
    
       Iterates over a node's subgraph applying *action* to the nodes of relative depth between *levelBegin* and *levelEnd*.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       levelBegin - (number) A relative level value.
       levelEnd - (number) A relative level value.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

    */
    eachLevel: function(node, levelBegin, levelEnd, action, flags) {
        var d = node._depth, filter = this.filter(flags), that = this;
        levelEnd = levelEnd === false? Number.MAX_VALUE -d : levelEnd;
        (function loopLevel(node, levelBegin, levelEnd) {
            var d = node._depth;
            if(d >= levelBegin && d <= levelEnd && filter(node)) action(node, d);
            if(d < levelEnd) {
                that.eachAdjacency(node, function(adj) {
                    var n = adj.nodeTo;
                    if(n._depth > d) loopLevel(n, levelBegin, levelEnd);
                });
            }
        })(node, levelBegin + d, levelEnd + d);      
    },

    /*
       Method: eachSubgraph
    
       Iterates over a node's children recursively.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubgraph(node, function(node) {
           alert(node.name);
         });
         //or...
         node.eachSubgraph(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubgraph: function(node, action, flags) {
      this.eachLevel(node, 0, false, action, flags);
    },

    /*
       Method: eachSubnode
    
       Iterates over a node's children (without deeper recursion).
       
       Also implemented by:
       
       <Graph.Node>.
       
       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubnode(node, function(node) {
          alert(node.name);
         });
         //or...
         node.eachSubnode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubnode: function(node, action, flags) {
        this.eachLevel(node, 1, 1, action, flags);
    },

    /*
       Method: anySubnode
    
       Returns *true* if any subnode matches the given condition.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       cond - (function) A callback function returning a Boolean instance. This function has as first formal parameter a <Graph.Node>.

       Example:
       (start code js)
         $jit.Graph.Util.anySubnode(node, function(node) { return node.name == "mynodename"; });
         //or...
         node.anySubnode(function(node) { return node.name == 'mynodename'; });
       (end code)
    */
    anySubnode: function(node, cond, flags) {
      var flag = false;
      cond = cond || $.lambda(true);
      var c = $.type(cond) == 'string'? function(n) { return n[cond]; } : cond;
      this.eachSubnode(node, function(elem) {
        if(c(elem)) flag = true;
      }, flags);
      return flag;
    },
  
    /*
       Method: getSubnodes
    
       Collects all subnodes for a specified node. 
       The *level* parameter filters nodes having relative depth of *level* from the root node. 
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       level - (optional|number) Default's *0*. A starting relative depth for collecting nodes.

       Returns:
       An array of nodes.

    */
    getSubnodes: function(node, level, flags) {
        var ans = [], that = this;
        level = level || 0;
        var levelStart, levelEnd;
        if($.type(level) == 'array') {
            levelStart = level[0];
            levelEnd = level[1];
        } else {
            levelStart = level;
            levelEnd = Number.MAX_VALUE - node._depth;
        }
        this.eachLevel(node, levelStart, levelEnd, function(n) {
            ans.push(n);
        }, flags);
        return ans;
    },
  
  
    /*
       Method: getParents
    
       Returns an Array of <Graph.Nodes> which are parents of the given node.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.

       Returns:
       An Array of <Graph.Nodes>.

       Example:
       (start code js)
         var pars = $jit.Graph.Util.getParents(node);
         //or...
         var pars = node.getParents();
         
         if(pars.length > 0) {
           //do stuff with parents
         }
       (end code)
    */
    getParents: function(node) {
        var ans = [];
        this.eachAdjacency(node, function(adj) {
            var n = adj.nodeTo;
            if(n._depth < node._depth) ans.push(n);
        });
        return ans;
    },
    
    /*
    Method: isDescendantOf
 
    Returns a boolean indicating if some node is descendant of the node with the given id. 

    Also implemented by:
    
    <Graph.Node>.
    
    
    Parameters:
    node - (object) A <Graph.Node>.
    id - (string) A <Graph.Node> id.

    Example:
    (start code js)
      $jit.Graph.Util.isDescendantOf(node, "nodeid"); //true|false
      //or...
      node.isDescendantOf('nodeid');//true|false
    (end code)
 */
 isDescendantOf: function(node, id) {
    if(node.id == id) return true;
    var pars = this.getParents(node), ans = false;
    for ( var i = 0; !ans && i < pars.length; i++) {
    ans = ans || this.isDescendantOf(pars[i], id);
  }
    return ans;
 },

 /*
     Method: clean
  
     Cleans flags from nodes.

     Also implemented by:
     
     <Graph>.
     
     Parameters:
     graph - A <Graph> instance.
  */
  clean: function(graph) { this.eachNode(graph, function(elem) { elem._flag = false; }); },
  
  /* 
    Method: getClosestNodeToOrigin 
  
    Returns the closest node to the center of canvas.
  
    Also implemented by:
    
    <Graph>.
    
    Parameters:
   
     graph - (object) A <Graph> instance.
     prop - (optional|string) Default's 'current'. A <Graph.Node> position property. Possible properties are 'start', 'current' or 'end'.
  
  */
  getClosestNodeToOrigin: function(graph, prop, flags) {
   return this.getClosestNodeToPos(graph, Polar.KER, prop, flags);
  },
  
  /* 
    Method: getClosestNodeToPos
  
    Returns the closest node to the given position.
  
    Also implemented by:
    
    <Graph>.
    
    Parameters:
   
     graph - (object) A <Graph> instance.
     pos - (object) A <Complex> or <Polar> instance.
     prop - (optional|string) Default's *current*. A <Graph.Node> position property. Possible properties are 'start', 'current' or 'end'.
  
  */
  getClosestNodeToPos: function(graph, pos, prop, flags) {
   var node = null;
   prop = prop || 'current';
   pos = pos && pos.getc(true) || Complex.KER;
   var distance = function(a, b) {
     var d1 = a.x - b.x, d2 = a.y - b.y;
     return d1 * d1 + d2 * d2;
   };
   this.eachNode(graph, function(elem) {
     node = (node == null || distance(elem.getPos(prop).getc(true), pos) < distance(
         node.getPos(prop).getc(true), pos)) ? elem : node;
   }, flags);
   return node;
  } 
};

//Append graph methods to <Graph>
$.each(['get', 'getNode', 'each', 'eachNode', 'computeLevels', 'eachBFS', 'clean', 'getClosestNodeToPos', 'getClosestNodeToOrigin'], function(m) {
  Graph.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

//Append node methods to <Graph.Node>
$.each(['eachAdjacency', 'eachLevel', 'eachSubgraph', 'eachSubnode', 'anySubnode', 'getSubnodes', 'getParents', 'isDescendantOf'], function(m) {
  Graph.Node.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

/*
 * File: Graph.Op.js
 *
*/

/*
   Object: Graph.Op

   Perform <Graph> operations like adding/removing <Graph.Nodes> or <Graph.Adjacences>, 
   morphing a <Graph> into another <Graph>, contracting or expanding subtrees, etc.

*/
Graph.Op = {

    options: {
      type: 'nothing',
      duration: 2000,
      hideLabels: true,
      fps:30
    },
    
    initialize: function(viz) {
      this.viz = viz;
    },

    /*
       Method: removeNode
    
       Removes one or more <Graph.Nodes> from the visualization. 
       It can also perform several animations like fading sequentially, fading concurrently, iterating or replotting.

       Parameters:
    
        node - (string|array) The node's id. Can also be an array having many ids.
        opt - (object) Animation options. It's an object with optional properties described below
        type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot", "fade:seq",  "fade:con" or "iter".
        duration - Described in <Options.Fx>.
        fps - Described in <Options.Fx>.
        transition - Described in <Options.Fx>.
        hideLabels - (boolean) Default's *true*. Hide labels during the animation.
   
      Example:
      (start code js)
        var viz = new $jit.Viz(options);
        viz.op.removeNode('nodeId', {
          type: 'fade:seq',
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.removeNode(['someId', 'otherId'], {
          type: 'fade:con',
          duration: 1500
        });
      (end code)
    */
  
    removeNode: function(node, opt) {
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt);
        var n = $.splat(node);
        var i, that, nodeObj;
        switch(options.type) {
            case 'nothing':
                for(i=0; i<n.length; i++) viz.graph.removeNode(n[i]);
                break;
            
            case 'replot':
                this.removeNode(n, { type: 'nothing' });
                viz.labels.clearLabels();
                viz.refresh(true);
                break;
            
            case 'fade:seq': case 'fade':
                that = this;
                //set alpha to 0 for nodes to remove.
                for(i=0; i<n.length; i++) {
                    nodeObj = viz.graph.getNode(n[i]);
                    nodeObj.setData('alpha', 0, 'end');
                }
                viz.fx.animate($.merge(options, {
                    modes: ['node-property:alpha'],
                    onComplete: function() {
                        that.removeNode(n, { type: 'nothing' });
                        viz.labels.clearLabels();
                        viz.reposition();
                        viz.fx.animate($.merge(options, {
                            modes: ['linear']
                        }));
                    }
                }));
                break;
            
            case 'fade:con':
                that = this;
                //set alpha to 0 for nodes to remove. Tag them for being ignored on computing positions.
                for(i=0; i<n.length; i++) {
                    nodeObj = viz.graph.getNode(n[i]);
                    nodeObj.setData('alpha', 0, 'end');
                    nodeObj.ignore = true;
                }
                viz.reposition();
                viz.fx.animate($.merge(options, {
                    modes: ['node-property:alpha', 'linear'],
                    onComplete: function() {
                        that.removeNode(n, { type: 'nothing' });
                        options.onComplete && options.onComplete();
                    }
                }));
                break;
            
            case 'iter':
                that = this;
                viz.fx.sequence({
                    condition: function() { return n.length != 0; },
                    step: function() { that.removeNode(n.shift(), { type: 'nothing' });  viz.labels.clearLabels(); },
                    onComplete: function() { options.onComplete && options.onComplete(); },
                    duration: Math.ceil(options.duration / n.length)
                });
                break;
                
            default: this.doError();
        }
    },
    
    /*
       Method: removeEdge
    
       Removes one or more <Graph.Adjacences> from the visualization. 
       It can also perform several animations like fading sequentially, fading concurrently, iterating or replotting.

       Parameters:
    
       vertex - (array) An array having two strings which are the ids of the nodes connected by this edge (i.e ['id1', 'id2']). Can also be a two dimensional array holding many edges (i.e [['id1', 'id2'], ['id3', 'id4'], ...]).
       opt - (object) Animation options. It's an object with optional properties described below
       type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot", "fade:seq",  "fade:con" or "iter".
       duration - Described in <Options.Fx>.
       fps - Described in <Options.Fx>.
       transition - Described in <Options.Fx>.
       hideLabels - (boolean) Default's *true*. Hide labels during the animation.
   
      Example:
      (start code js)
        var viz = new $jit.Viz(options);
        viz.op.removeEdge(['nodeId', 'otherId'], {
          type: 'fade:seq',
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.removeEdge([['someId', 'otherId'], ['id3', 'id4']], {
          type: 'fade:con',
          duration: 1500
        });
      (end code)
    
    */
    removeEdge: function(vertex, opt) {
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt);
        var v = ($.type(vertex[0]) == 'string')? [vertex] : vertex;
        var i, that, adj;
        switch(options.type) {
            case 'nothing':
                for(i=0; i<v.length; i++)   viz.graph.removeAdjacence(v[i][0], v[i][1]);
                break;
            
            case 'replot':
                this.removeEdge(v, { type: 'nothing' });
                viz.refresh(true);
                break;
            
            case 'fade:seq': case 'fade':
                that = this;
                //set alpha to 0 for edges to remove.
                for(i=0; i<v.length; i++) {
                    adj = viz.graph.getAdjacence(v[i][0], v[i][1]);
                    if(adj) {
                        adj.setData('alpha', 0,'end');
                    }
                }
                viz.fx.animate($.merge(options, {
                    modes: ['edge-property:alpha'],
                    onComplete: function() {
                        that.removeEdge(v, { type: 'nothing' });
                        viz.reposition();
                        viz.fx.animate($.merge(options, {
                            modes: ['linear']
                        }));
                    }
                }));
                break;
            
            case 'fade:con':
                that = this;
                //set alpha to 0 for nodes to remove. Tag them for being ignored when computing positions.
                for(i=0; i<v.length; i++) {
                    adj = viz.graph.getAdjacence(v[i][0], v[i][1]);
                    if(adj) {
                        adj.setData('alpha',0 ,'end');
                        adj.ignore = true;
                    }
                }
                viz.reposition();
                viz.fx.animate($.merge(options, {
                    modes: ['edge-property:alpha', 'linear'],
                    onComplete: function() {
                        that.removeEdge(v, { type: 'nothing' });
                        options.onComplete && options.onComplete();
                    }
                }));
                break;
            
            case 'iter':
                that = this;
                viz.fx.sequence({
                    condition: function() { return v.length != 0; },
                    step: function() { that.removeEdge(v.shift(), { type: 'nothing' }); viz.labels.clearLabels(); },
                    onComplete: function() { options.onComplete(); },
                    duration: Math.ceil(options.duration / v.length)
                });
                break;
                
            default: this.doError();
        }
    },
    
    /*
       Method: sum
    
       Adds a new graph to the visualization. 
       The JSON graph (or tree) must at least have a common node with the current graph plotted by the visualization. 
       The resulting graph can be defined as follows <http://mathworld.wolfram.com/GraphSum.html>

       Parameters:
    
       json - (object) A json tree or graph structure. See also <Loader.loadJSON>.
       opt - (object) Animation options. It's an object with optional properties described below
       type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot", "fade:seq",  "fade:con".
       duration - Described in <Options.Fx>.
       fps - Described in <Options.Fx>.
       transition - Described in <Options.Fx>.
       hideLabels - (boolean) Default's *true*. Hide labels during the animation.
   
      Example:
      (start code js)
        //...json contains a tree or graph structure...

        var viz = new $jit.Viz(options);
        viz.op.sum(json, {
          type: 'fade:seq',
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.sum(json, {
          type: 'fade:con',
          duration: 1500
        });
      (end code)
    
    */
    sum: function(json, opt) {
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt), root = viz.root;
        var graph;
        viz.root = opt.id || viz.root;
        switch(options.type) {
            case 'nothing':
                graph = viz.construct(json);
                graph.eachNode(function(elem) {
                    elem.eachAdjacency(function(adj) {
                        viz.graph.addAdjacence(adj.nodeFrom, adj.nodeTo, adj.data);
                    });
                });
                break;
            
            case 'replot':
                viz.refresh(true);
                this.sum(json, { type: 'nothing' });
                viz.refresh(true);
                break;
            
            case 'fade:seq': case 'fade': case 'fade:con':
                that = this;
                graph = viz.construct(json);

                //set alpha to 0 for nodes to add.
                var fadeEdges = this.preprocessSum(graph);
                var modes = !fadeEdges? ['node-property:alpha'] : ['node-property:alpha', 'edge-property:alpha'];
                viz.reposition();
                if(options.type != 'fade:con') {
                    viz.fx.animate($.merge(options, {
                        modes: ['linear'],
                        onComplete: function() {
                            viz.fx.animate($.merge(options, {
                                modes: modes,
                                onComplete: function() {
                                    options.onComplete();
                                }
                            }));
                        }
                    }));
                } else {
                    viz.graph.eachNode(function(elem) {
                        if (elem.id != root && elem.pos.isZero()) {
                          elem.pos.set(elem.endPos); 
                          elem.startPos.set(elem.endPos);
                        }
                    });
                    viz.fx.animate($.merge(options, {
                        modes: ['linear'].concat(modes)
                    }));
                }
                break;

            default: this.doError();
        }
    },
    
    /*
       Method: morph
    
       This method will transform the current visualized graph into the new JSON representation passed in the method. 
       The JSON object must at least have the root node in common with the current visualized graph.

       Parameters:
    
       json - (object) A json tree or graph structure. See also <Loader.loadJSON>.
       opt - (object) Animation options. It's an object with optional properties described below
       type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot", "fade:con".
       duration - Described in <Options.Fx>.
       fps - Described in <Options.Fx>.
       transition - Described in <Options.Fx>.
       hideLabels - (boolean) Default's *true*. Hide labels during the animation.
       id - (string) The shared <Graph.Node> id between both graphs.
       
       extraModes - (optional|object) When morphing with an animation, dollar prefixed data parameters are added to 
                    *endData* and not *data* itself. This way you can animate dollar prefixed parameters during your morphing operation. 
                    For animating these extra-parameters you have to specify an object that has animation groups as keys and animation 
                    properties as values, just like specified in <Graph.Plot.animate>.
   
      Example:
      (start code js)
        //...json contains a tree or graph structure...

        var viz = new $jit.Viz(options);
        viz.op.morph(json, {
          type: 'fade',
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.morph(json, {
          type: 'fade',
          duration: 1500
        });
        //if the json data contains dollar prefixed params
        //like $width or $height these too can be animated
        viz.op.morph(json, {
          type: 'fade',
          duration: 1500
        }, {
          'node-property': ['width', 'height']
        });
      (end code)
    
    */
    morph: function(json, opt, extraModes) {
        extraModes = extraModes || {};
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt), root = viz.root;
        var graph;
        //TODO(nico) this hack makes morphing work with the Hypertree. 
        //Need to check if it has been solved and this can be removed.
        viz.root = opt.id || viz.root;
        switch(options.type) {
            case 'nothing':
                graph = viz.construct(json);
                graph.eachNode(function(elem) {
                  var nodeExists = viz.graph.hasNode(elem.id);  
                  elem.eachAdjacency(function(adj) {
                    var adjExists = !!viz.graph.getAdjacence(adj.nodeFrom.id, adj.nodeTo.id);
                    viz.graph.addAdjacence(adj.nodeFrom, adj.nodeTo, adj.data);
                    //Update data properties if the node existed
                    if(adjExists) {
                      var addedAdj = viz.graph.getAdjacence(adj.nodeFrom.id, adj.nodeTo.id);
                      for(var prop in (adj.data || {})) {
                        addedAdj.data[prop] = adj.data[prop];
                      }
                    }
                  });
                  //Update data properties if the node existed
                  if(nodeExists) {
                    var addedNode = viz.graph.getNode(elem.id);
                    for(var prop in (elem.data || {})) {
                      addedNode.data[prop] = elem.data[prop];
                    }
                  }
                });
                viz.graph.eachNode(function(elem) {
                    elem.eachAdjacency(function(adj) {
                        if(!graph.getAdjacence(adj.nodeFrom.id, adj.nodeTo.id)) {
                            viz.graph.removeAdjacence(adj.nodeFrom.id, adj.nodeTo.id);
                        }
                    });
                    if(!graph.hasNode(elem.id)) viz.graph.removeNode(elem.id);
                });
                
                break;
            
            case 'replot':
                viz.labels.clearLabels(true);
                this.morph(json, { type: 'nothing' });
                viz.refresh(true);
                viz.refresh(true);
                break;
                
            case 'fade:seq': case 'fade': case 'fade:con':
                that = this;
                graph = viz.construct(json);
                //preprocessing for nodes to delete.
                //get node property modes to interpolate
                var nodeModes = ('node-property' in extraModes) 
                  && $.map($.splat(extraModes['node-property']), 
                      function(n) { return '$' + n; });
                viz.graph.eachNode(function(elem) {
                  var graphNode = graph.getNode(elem.id);   
                  if(!graphNode) {
                      elem.setData('alpha', 1);
                      elem.setData('alpha', 1, 'start');
                      elem.setData('alpha', 0, 'end');
                      elem.ignore = true;
                    } else {
                      //Update node data information
                      var graphNodeData = graphNode.data;
                      for(var prop in graphNodeData) {
                        if(nodeModes && ($.indexOf(nodeModes, prop) > -1)) {
                          elem.endData[prop] = graphNodeData[prop];
                        } else {
                          elem.data[prop] = graphNodeData[prop];
                        }
                      }
                    }
                }); 
                viz.graph.eachNode(function(elem) {
                    if(elem.ignore) return;
                    elem.eachAdjacency(function(adj) {
                        if(adj.nodeFrom.ignore || adj.nodeTo.ignore) return;
                        var nodeFrom = graph.getNode(adj.nodeFrom.id);
                        var nodeTo = graph.getNode(adj.nodeTo.id);
                        if(!nodeFrom.adjacentTo(nodeTo)) {
                            var adj = viz.graph.getAdjacence(nodeFrom.id, nodeTo.id);
                            fadeEdges = true;
                            adj.setData('alpha', 1);
                            adj.setData('alpha', 1, 'start');
                            adj.setData('alpha', 0, 'end');
                        }
                    });
                }); 
                //preprocessing for adding nodes.
                var fadeEdges = this.preprocessSum(graph);

                var modes = !fadeEdges? ['node-property:alpha'] : 
                                        ['node-property:alpha', 
                                         'edge-property:alpha'];
                //Append extra node-property animations (if any)
                modes[0] = modes[0] + (('node-property' in extraModes)? 
                    (':' + $.splat(extraModes['node-property']).join(':')) : '');
                //Append extra edge-property animations (if any)
                modes[1] = (modes[1] || 'edge-property:alpha') + (('edge-property' in extraModes)? 
                    (':' + $.splat(extraModes['edge-property']).join(':')) : '');
                //Add label-property animations (if any)
                if('label-property' in extraModes) {
                  modes.push('label-property:' + $.splat(extraModes['label-property']).join(':'))
                }
                //only use reposition if its implemented.
                if (viz.reposition) {
                  viz.reposition();
                } else {
                  viz.compute('end');
                }
                viz.graph.eachNode(function(elem) {
                    if (elem.id != root && elem.pos.getp().equals(Polar.KER)) {
                      elem.pos.set(elem.endPos); elem.startPos.set(elem.endPos);
                    }
                });
                viz.fx.animate($.merge(options, {
                    modes: [extraModes.position || 'polar'].concat(modes),
                    onComplete: function() {
                        viz.graph.eachNode(function(elem) {
                            if(elem.ignore) viz.graph.removeNode(elem.id);
                        });
                        viz.graph.eachNode(function(elem) {
                            elem.eachAdjacency(function(adj) {
                                if(adj.ignore) viz.graph.removeAdjacence(adj.nodeFrom.id, adj.nodeTo.id);
                            });
                        });
                        options.onComplete();
                    }
                }));
                break;

            default:;
        }
    },

    
  /*
    Method: contract
 
    Collapses the subtree of the given node. The node will have a _collapsed=true_ property.
    
    Parameters:
 
    node - (object) A <Graph.Node>.
    opt - (object) An object containing options described below
    type - (string) Whether to 'replot' or 'animate' the contraction.
   
    There are also a number of Animation options. For more information see <Options.Fx>.

    Example:
    (start code js)
     var viz = new $jit.Viz(options);
     viz.op.contract(node, {
       type: 'animate',
       duration: 1000,
       hideLabels: true,
       transition: $jit.Trans.Quart.easeOut
     });
   (end code)
 
   */
    contract: function(node, opt) {
      var viz = this.viz;
      if(node.collapsed || !node.anySubnode($.lambda(true))) return;
      opt = $.merge(this.options, viz.config, opt || {}, {
        'modes': ['node-property:alpha:span', 'linear']
      });
      node.collapsed = true;
      (function subn(n) {
        n.eachSubnode(function(ch) {
          ch.ignore = true;
          ch.setData('alpha', 0, opt.type == 'animate'? 'end' : 'current');
          subn(ch);
        });
      })(node);
      if(opt.type == 'animate') {
        viz.compute('end');
        if(viz.rotated) {
          viz.rotate(viz.rotated, 'none', {
            'property':'end'
          });
        }
        (function subn(n) {
          n.eachSubnode(function(ch) {
            ch.setPos(node.getPos('end'), 'end');
            subn(ch);
          });
        })(node);
        viz.fx.animate(opt);
      } else if(opt.type == 'replot'){
        viz.refresh();
      }
    },
    
    /*
    Method: expand
 
    Expands the previously contracted subtree. The given node must have the _collapsed=true_ property.
    
    Parameters:
 
    node - (object) A <Graph.Node>.
    opt - (object) An object containing options described below
    type - (string) Whether to 'replot' or 'animate'.
     
    There are also a number of Animation options. For more information see <Options.Fx>.

    Example:
    (start code js)
      var viz = new $jit.Viz(options);
      viz.op.expand(node, {
        type: 'animate',
        duration: 1000,
        hideLabels: true,
        transition: $jit.Trans.Quart.easeOut
      });
    (end code)
 
   */
    expand: function(node, opt) {
      if(!('collapsed' in node)) return;
      var viz = this.viz;
      opt = $.merge(this.options, viz.config, opt || {}, {
        'modes': ['node-property:alpha:span', 'linear']
      });
      delete node.collapsed;
      (function subn(n) {
        n.eachSubnode(function(ch) {
          delete ch.ignore;
          ch.setData('alpha', 1, opt.type == 'animate'? 'end' : 'current');
          subn(ch);
        });
      })(node);
      if(opt.type == 'animate') {
        viz.compute('end');
        if(viz.rotated) {
          viz.rotate(viz.rotated, 'none', {
            'property':'end'
          });
        }
        viz.fx.animate(opt);
      } else if(opt.type == 'replot'){
        viz.refresh();
      }
    },

    preprocessSum: function(graph) {
        var viz = this.viz;
        graph.eachNode(function(elem) {
            if(!viz.graph.hasNode(elem.id)) {
                viz.graph.addNode(elem);
                var n = viz.graph.getNode(elem.id);
                n.setData('alpha', 0);
                n.setData('alpha', 0, 'start');
                n.setData('alpha', 1, 'end');
            }
        }); 
        var fadeEdges = false;
        graph.eachNode(function(elem) {
            elem.eachAdjacency(function(adj) {
                var nodeFrom = viz.graph.getNode(adj.nodeFrom.id);
                var nodeTo = viz.graph.getNode(adj.nodeTo.id);
                if(!nodeFrom.adjacentTo(nodeTo)) {
                    var adj = viz.graph.addAdjacence(nodeFrom, nodeTo, adj.data);
                    if(nodeFrom.startAlpha == nodeFrom.endAlpha 
                    && nodeTo.startAlpha == nodeTo.endAlpha) {
                        fadeEdges = true;
                        adj.setData('alpha', 0);
                        adj.setData('alpha', 0, 'start');
                        adj.setData('alpha', 1, 'end');
                    } 
                }
            });
        }); 
        return fadeEdges;
    }
};



/*
   File: Helpers.js
 
   Helpers are objects that contain rendering primitives (like rectangles, ellipses, etc), for plotting nodes and edges.
   Helpers also contain implementations of the *contains* method, a method returning a boolean indicating whether the mouse
   position is over the rendered shape.
   
   Helpers are very useful when implementing new NodeTypes, since you can access them through *this.nodeHelper* and 
   *this.edgeHelper* <Graph.Plot> properties, providing you with simple primitives and mouse-position check functions.
   
   Example:
   (start code js)
   //implement a new node type
   $jit.Viz.Plot.NodeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.nodeHelper.circle.render ...
       },
       'contains': function(node, pos) {
         this.nodeHelper.circle.contains ...
       }
     }
   });
   //implement an edge type
   $jit.Viz.Plot.EdgeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.edgeHelper.circle.render ...
       },
       //optional
       'contains': function(node, pos) {
         this.edgeHelper.circle.contains ...
       }
     }
   });
   (end code)

*/

/*
   Object: NodeHelper
   
   Contains rendering and other type of primitives for simple shapes.
 */
var NodeHelper = {
  'none': {
    'render': $.empty,
    'contains': $.lambda(false)
  },
  /*
   Object: NodeHelper.circle
   */
  'circle': {
    /*
     Method: render
     
     Renders a circle into the canvas.
     
     Parameters:
     
     type - (string) Possible options are 'fill' or 'stroke'.
     pos - (object) An *x*, *y* object with the position of the center of the circle.
     radius - (number) The radius of the circle to be rendered.
     canvas - (object) A <Canvas> instance.
     
     Example:
     (start code js)
     NodeHelper.circle.render('fill', { x: 10, y: 30 }, 30, viz.canvas);
     (end code)
     */
    'render': function(type, pos, radius, canvas){
      var ctx = canvas.getCtx();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx[type]();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    radius - (number) The radius of the rendered circle.
    
    Example:
    (start code js)
    NodeHelper.circle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30); //true
    (end code)
    */
    'contains': function(npos, pos, radius){
      var diffx = npos.x - pos.x, 
          diffy = npos.y - pos.y, 
          diff = diffx * diffx + diffy * diffy;
      return diff <= radius * radius;
    }
  },
  /*
  Object: NodeHelper.ellipse
  */
  'ellipse': {
    /*
    Method: render
    
    Renders an ellipse into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the ellipse.
    width - (number) The width of the ellipse.
    height - (number) The height of the ellipse.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.ellipse.render('fill', { x: 10, y: 30 }, 30, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, width, height, canvas){
      var ctx = canvas.getCtx(),
          scalex = 1,
          scaley = 1,
          scaleposx = 1,
          scaleposy = 1,
          radius = 0;

      if (width > height) {
          radius = width / 2;
          scaley = height / width;
          scaleposy = width / height;
      } else {
          radius = height / 2;
          scalex = width / height;
          scaleposx = height / width;
      }

      ctx.save();
      ctx.scale(scalex, scaley);
      ctx.beginPath();
      ctx.arc(pos.x * scaleposx, pos.y * scaleposy, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx[type]();
      ctx.restore();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    width - (number) The width of the rendered ellipse.
    height - (number) The height of the rendered ellipse.
    
    Example:
    (start code js)
    NodeHelper.ellipse.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30, 40);
    (end code)
    */
    'contains': function(npos, pos, width, height){
      var radius = 0,
          scalex = 1,
          scaley = 1,
          diffx = 0,
          diffy = 0,
          diff = 0;

      if (width > height) {
	      radius = width / 2;
	      scaley = height / width;
      } else {
          radius = height / 2;
          scalex = width / height;
      }

      diffx = (npos.x - pos.x) * (1 / scalex);
      diffy = (npos.y - pos.y) * (1 / scaley);
      diff = diffx * diffx + diffy * diffy;
      return diff <= radius * radius;
    }
  },
  /*
  Object: NodeHelper.square
  */
  'square': {
    /*
    Method: render
    
    Renders a square into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the square.
    dim - (number) The radius (or half-diameter) of the square.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.square.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      canvas.getCtx()[type + "Rect"](pos.x - dim, pos.y - dim, 2*dim, 2*dim);
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) The radius (or half-diameter) of the square.
    
    Example:
    (start code js)
    NodeHelper.square.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim){
      return Math.abs(pos.x - npos.x) <= dim && Math.abs(pos.y - npos.y) <= dim;
    }
  },
  /*
  Object: NodeHelper.rectangle
  */
  'rectangle': {
    /*
    Method: render
    
    Renders a rectangle into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the rectangle.
    width - (number) The width of the rectangle.
    height - (number) The height of the rectangle.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.rectangle.render('fill', { x: 10, y: 30 }, 30, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, width, height, canvas){
      canvas.getCtx()[type + "Rect"](pos.x - width / 2, pos.y - height / 2, 
                                      width, height);
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    width - (number) The width of the rendered rectangle.
    height - (number) The height of the rendered rectangle.
    
    Example:
    (start code js)
    NodeHelper.rectangle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30, 40);
    (end code)
    */
    'contains': function(npos, pos, width, height){
      return Math.abs(pos.x - npos.x) <= width / 2
          && Math.abs(pos.y - npos.y) <= height / 2;
    }
  },
  /*
  Object: NodeHelper.triangle
  */
  'triangle': {
    /*
    Method: render
    
    Renders a triangle into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the triangle.
    dim - (number) Half the base and half the height of the triangle.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.triangle.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      var ctx = canvas.getCtx(), 
          c1x = pos.x, 
          c1y = pos.y - dim, 
          c2x = c1x - dim, 
          c2y = pos.y + dim, 
          c3x = c1x + dim, 
          c3y = c2y;
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c2x, c2y);
      ctx.lineTo(c3x, c3y);
      ctx.closePath();
      ctx[type]();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) Half the base and half the height of the triangle.
    
    Example:
    (start code js)
    NodeHelper.triangle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim) {
      return NodeHelper.circle.contains(npos, pos, dim);
    }
  },
  /*
  Object: NodeHelper.star
  */
  'star': {
    /*
    Method: render
    
    Renders a star (concave decagon) into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the star.
    dim - (number) The length of a side of a concave decagon.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.star.render('stroke', { x: 10, y: 30 }, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, dim, canvas){
      var ctx = canvas.getCtx(), 
          pi5 = Math.PI / 5;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.beginPath();
      ctx.moveTo(dim, 0);
      for (var i = 0; i < 9; i++) {
        ctx.rotate(pi5);
        if (i % 2 == 0) {
          ctx.lineTo((dim / 0.525731) * 0.200811, 0);
        } else {
          ctx.lineTo(dim, 0);
        }
      }
      ctx.closePath();
      ctx[type]();
      ctx.restore();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    dim - (number) The length of a side of a concave decagon.
    
    Example:
    (start code js)
    NodeHelper.star.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(npos, pos, dim) {
      return NodeHelper.circle.contains(npos, pos, dim);
    }
  }
};

/*
  Object: EdgeHelper
  
  Contains rendering primitives for simple edge shapes.
*/
var EdgeHelper = {
  /*
    Object: EdgeHelper.line
  */
  'line': {
      /*
      Method: render
      
      Renders a line into the canvas.
      
      Parameters:
      
      from - (object) An *x*, *y* object with the starting position of the line.
      to - (object) An *x*, *y* object with the ending position of the line.
      canvas - (object) A <Canvas> instance.
      
      Example:
      (start code js)
      EdgeHelper.line.render({ x: 10, y: 30 }, { x: 10, y: 50 }, viz.canvas);
      (end code)
      */
      'render': function(from, to, canvas){
        var ctx = canvas.getCtx();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      },
      /*
      Method: contains
      
      Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
      
      Parameters:
      
      posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
      posTo - (object) An *x*, *y* object with a <Graph.Node> position.
      pos - (object) An *x*, *y* object with the position to check.
      epsilon - (number) The dimension of the shape.
      
      Example:
      (start code js)
      EdgeHelper.line.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
      (end code)
      */
      'contains': function(posFrom, posTo, pos, epsilon) {
        var min = Math.min, 
            max = Math.max,
            minPosX = min(posFrom.x, posTo.x),
            maxPosX = max(posFrom.x, posTo.x),
            minPosY = min(posFrom.y, posTo.y),
            maxPosY = max(posFrom.y, posTo.y);
        
        if(pos.x >= minPosX && pos.x <= maxPosX 
            && pos.y >= minPosY && pos.y <= maxPosY) {
          if(Math.abs(posTo.x - posFrom.x) <= epsilon) {
            return true;
          }
          var dist = (posTo.y - posFrom.y) / (posTo.x - posFrom.x) * (pos.x - posFrom.x) + posFrom.y;
          return Math.abs(dist - pos.y) <= epsilon;
        }
        return false;
      }
    },
  /*
    Object: EdgeHelper.arrow
  */
  'arrow': {
      /*
      Method: render
      
      Renders an arrow into the canvas.
      
      Parameters:
      
      from - (object) An *x*, *y* object with the starting position of the arrow.
      to - (object) An *x*, *y* object with the ending position of the arrow.
      dim - (number) The dimension of the arrow.
      swap - (boolean) Whether to set the arrow pointing to the starting position or the ending position.
      canvas - (object) A <Canvas> instance.
      
      Example:
      (start code js)
      EdgeHelper.arrow.render({ x: 10, y: 30 }, { x: 10, y: 50 }, 13, false, viz.canvas);
      (end code)
      */
    'render': function(from, to, dim, swap, canvas){
        var ctx = canvas.getCtx();
        // invert edge direction
        if (swap) {
          var tmp = from;
          from = to;
          to = tmp;
        }
        var vect = new Complex(to.x - from.x, to.y - from.y);
        vect.$scale(dim / vect.norm());
        var intermediatePoint = new Complex(to.x - vect.x, to.y - vect.y),
            normal = new Complex(-vect.y / 2, vect.x / 2),
            v1 = intermediatePoint.add(normal), 
            v2 = intermediatePoint.$add(normal.$scale(-1));
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(to.x, to.y);
        ctx.closePath();
        ctx.fill();
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
    posTo - (object) An *x*, *y* object with a <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    epsilon - (number) The dimension of the shape.
    
    Example:
    (start code js)
    EdgeHelper.arrow.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': function(posFrom, posTo, pos, epsilon) {
      return EdgeHelper.line.contains(posFrom, posTo, pos, epsilon);
    }
  },
  /*
    Object: EdgeHelper.hyperline
  */
  'hyperline': {
    /*
    Method: render
    
    Renders a hyperline into the canvas. A hyperline are the lines drawn for the <Hypertree> visualization.
    
    Parameters:
    
    from - (object) An *x*, *y* object with the starting position of the hyperline. *x* and *y* must belong to [0, 1).
    to - (object) An *x*, *y* object with the ending position of the hyperline. *x* and *y* must belong to [0, 1).
    r - (number) The scaling factor.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    EdgeHelper.hyperline.render({ x: 10, y: 30 }, { x: 10, y: 50 }, 100, viz.canvas);
    (end code)
    */
    'render': function(from, to, r, canvas){
      var ctx = canvas.getCtx();  
      var centerOfCircle = computeArcThroughTwoPoints(from, to);
      if (centerOfCircle.a > 1000 || centerOfCircle.b > 1000
          || centerOfCircle.ratio < 0) {
        ctx.beginPath();
        ctx.moveTo(from.x * r, from.y * r);
        ctx.lineTo(to.x * r, to.y * r);
        ctx.stroke();
      } else {
        var angleBegin = Math.atan2(to.y - centerOfCircle.y, to.x
            - centerOfCircle.x);
        var angleEnd = Math.atan2(from.y - centerOfCircle.y, from.x
            - centerOfCircle.x);
        var sense = sense(angleBegin, angleEnd);
        ctx.beginPath();
        ctx.arc(centerOfCircle.x * r, centerOfCircle.y * r, centerOfCircle.ratio
            * r, angleBegin, angleEnd, sense);
        ctx.stroke();
      }
      /*      
        Calculates the arc parameters through two points.
        
        More information in <http://en.wikipedia.org/wiki/Poincar%C3%A9_disc_model#Analytic_geometry_constructions_in_the_hyperbolic_plane> 
      
        Parameters:
      
        p1 - A <Complex> instance.
        p2 - A <Complex> instance.
        scale - The Disk's diameter.
      
        Returns:
      
        An object containing some arc properties.
      */
      function computeArcThroughTwoPoints(p1, p2){
        var aDen = (p1.x * p2.y - p1.y * p2.x), bDen = aDen;
        var sq1 = p1.squaredNorm(), sq2 = p2.squaredNorm();
        // Fall back to a straight line
        if (aDen == 0)
          return {
            x: 0,
            y: 0,
            ratio: -1
          };
    
        var a = (p1.y * sq2 - p2.y * sq1 + p1.y - p2.y) / aDen;
        var b = (p2.x * sq1 - p1.x * sq2 + p2.x - p1.x) / bDen;
        var x = -a / 2;
        var y = -b / 2;
        var squaredRatio = (a * a + b * b) / 4 - 1;
        // Fall back to a straight line
        if (squaredRatio < 0)
          return {
            x: 0,
            y: 0,
            ratio: -1
          };
        var ratio = Math.sqrt(squaredRatio);
        var out = {
          x: x,
          y: y,
          ratio: ratio > 1000? -1 : ratio,
          a: a,
          b: b
        };
    
        return out;
      }
      /*      
        Sets angle direction to clockwise (true) or counterclockwise (false). 
         
        Parameters: 
      
           angleBegin - Starting angle for drawing the arc. 
           angleEnd - The HyperLine will be drawn from angleBegin to angleEnd. 
      
        Returns: 
      
           A Boolean instance describing the sense for drawing the HyperLine. 
      */
      function sense(angleBegin, angleEnd){
        return (angleBegin < angleEnd)? ((angleBegin + Math.PI > angleEnd)? false
            : true) : ((angleEnd + Math.PI > angleBegin)? true : false);
      }
    },
    /*
    Method: contains
    
    Not Implemented
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
    posTo - (object) An *x*, *y* object with a <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    epsilon - (number) The dimension of the shape.
    
    Example:
    (start code js)
    EdgeHelper.hyperline.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
    (end code)
    */
    'contains': $.lambda(false)
  }
};


/*
 * File: Graph.Plot.js
 */

/*
   Object: Graph.Plot

   <Graph> rendering and animation methods.
   
   Properties:
   
   nodeHelper - <NodeHelper> object.
   edgeHelper - <EdgeHelper> object.
*/
Graph.Plot = {
    //Default initializer
    initialize: function(viz, klass){
      this.viz = viz;
      this.config = viz.config;
      this.node = viz.config.Node;
      this.edge = viz.config.Edge;
      this.animation = new Animation;
      this.nodeTypes = new klass.Plot.NodeTypes;
      this.edgeTypes = new klass.Plot.EdgeTypes;
      this.labels = viz.labels;
   },

    //Add helpers
    nodeHelper: NodeHelper,
    edgeHelper: EdgeHelper,
    
    Interpolator: {
        //node/edge property parsers
        'map': {
          'border': 'color',
          'color': 'color',
          'width': 'number',
          'height': 'number',
          'dim': 'number',
          'alpha': 'number',
          'lineWidth': 'number',
          'angularWidth':'number',
          'span':'number',
          'valueArray':'array-number',
          'dimArray':'array-number'
          //'colorArray':'array-color'
        },
        
        //canvas specific parsers
        'canvas': {
          'globalAlpha': 'number',
          'fillStyle': 'color',
          'strokeStyle': 'color',
          'lineWidth': 'number',
          'shadowBlur': 'number',
          'shadowColor': 'color',
          'shadowOffsetX': 'number',
          'shadowOffsetY': 'number',
          'miterLimit': 'number'
        },
  
        //label parsers
        'label': {
          'size': 'number',
          'color': 'color'
        },
  
        //Number interpolator
        'compute': function(from, to, delta) {
          return from + (to - from) * delta;
        },
        
        //Position interpolators
        'moebius': function(elem, props, delta, vector) {
          var v = vector.scale(-delta);  
          if(v.norm() < 1) {
              var x = v.x, y = v.y;
              var ans = elem.startPos
                .getc().moebiusTransformation(v);
              elem.pos.setc(ans.x, ans.y);
              v.x = x; v.y = y;
            }           
        },

        'linear': function(elem, props, delta) {
            var from = elem.startPos.getc(true);
            var to = elem.endPos.getc(true);
            elem.pos.setc(this.compute(from.x, to.x, delta), 
                          this.compute(from.y, to.y, delta));
        },

        'polar': function(elem, props, delta) {
          var from = elem.startPos.getp(true);
          var to = elem.endPos.getp();
          var ans = to.interpolate(from, delta);
          elem.pos.setp(ans.theta, ans.rho);
        },
        
        //Graph's Node/Edge interpolators
        'number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start');
          var to = elem[getter](prop, 'end');
          elem[setter](prop, this.compute(from, to, delta));
        },

        'color': function(elem, prop, delta, getter, setter) {
          var from = $.hexToRgb(elem[getter](prop, 'start'));
          var to = $.hexToRgb(elem[getter](prop, 'end'));
          var comp = this.compute;
          var val = $.rgbToHex([parseInt(comp(from[0], to[0], delta)),
                                parseInt(comp(from[1], to[1], delta)),
                                parseInt(comp(from[2], to[2], delta))]);
          
          elem[setter](prop, val);
        },
        
        'array-number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start'),
              to = elem[getter](prop, 'end'),
              cur = [];
          for(var i=0, l=from.length; i<l; i++) {
            var fromi = from[i], toi = to[i];
            if(fromi.length) {
              for(var j=0, len=fromi.length, curi=[]; j<len; j++) {
                curi.push(this.compute(fromi[j], toi[j], delta));
              }
              cur.push(curi);
            } else {
              cur.push(this.compute(fromi, toi, delta));
            }
          }
          elem[setter](prop, cur);
        },
        
        'node': function(elem, props, delta, map, getter, setter) {
          map = this[map];
          if(props) {
            var len = props.length;
            for(var i=0; i<len; i++) {
              var pi = props[i];
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          } else {
            for(var pi in map) {
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          }
        },
        
        'edge': function(elem, props, delta, mapKey, getter, setter) {
            var adjs = elem.adjacencies;
            for(var id in adjs) this['node'](adjs[id], props, delta, mapKey, getter, setter);
        },
        
        'node-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'map', 'getData', 'setData');
        },
        
        'edge-property': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'map', 'getData', 'setData');  
        },

        'label-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'label', 'getLabelData', 'setLabelData');
        },
        
        'node-style': function(elem, props, delta) {
          this['node'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');
        },
        
        'edge-style': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');  
        }
    },
    
  
    /*
       sequence
    
       Iteratively performs an action while refreshing the state of the visualization.

       Parameters:

       options - (object) An object containing some sequence options described below
       condition - (function) A function returning a boolean instance in order to stop iterations.
       step - (function) A function to execute on each step of the iteration.
       onComplete - (function) A function to execute when the sequence finishes.
       duration - (number) Duration (in milliseconds) of each step.

      Example:
       (start code js)
        var rg = new $jit.RGraph(options);
        var i = 0;
        rg.fx.sequence({
          condition: function() {
           return i == 10;
          },
          step: function() {
            alert(i++);
          },
          onComplete: function() {
           alert('done!');
          }
        });
       (end code)

    */
    sequence: function(options) {
        var that = this;
        options = $.merge({
          condition: $.lambda(false),
          step: $.empty,
          onComplete: $.empty,
          duration: 200
        }, options || {});

        var interval = setInterval(function() {
          if(options.condition()) {
            options.step();
          } else {
            clearInterval(interval);
            options.onComplete();
          }
          that.viz.refresh(true);
        }, options.duration);
    },
    
    /*
      prepare
 
      Prepare graph position and other attribute values before performing an Animation. 
      This method is used internally by the Toolkit.
      
      See also:
       
       <Animation>, <Graph.Plot.animate>

    */
    prepare: function(modes) {
      var graph = this.viz.graph,
          accessors = {
            'node-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'edge-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'node-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            },
            'edge-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            }
          };

      //parse modes
      var m = {};
      if($.type(modes) == 'array') {
        for(var i=0, len=modes.length; i < len; i++) {
          var elems = modes[i].split(':');
          m[elems.shift()] = elems;
        }
      } else {
        for(var p in modes) {
          if(p == 'position') {
            m[modes.position] = [];
          } else {
            m[p] = $.splat(modes[p]);
          }
        }
      }
      
      graph.eachNode(function(node) { 
        node.startPos.set(node.pos);
        $.each(['node-property', 'node-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            for(var i=0, l=prop.length; i < l; i++) {
              node[accessors[p].setter](prop[i], node[accessors[p].getter](prop[i]), 'start');
            }
          }
        });
        $.each(['edge-property', 'edge-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            node.eachAdjacency(function(adj) {
              for(var i=0, l=prop.length; i < l; i++) {
                adj[accessors[p].setter](prop[i], adj[accessors[p].getter](prop[i]), 'start');
              }
            });
          }
        });
      });
      return m;
    },
    
    /*
       Method: animate
    
       Animates a <Graph> by interpolating some <Graph.Node>, <Graph.Adjacence> or <Graph.Label> properties.

       Parameters:

       opt - (object) Animation options. The object properties are described below
       duration - (optional) Described in <Options.Fx>.
       fps - (optional) Described in <Options.Fx>.
       hideLabels - (optional|boolean) Whether to hide labels during the animation.
       modes - (required|object) An object with animation modes (described below).

       Animation modes:
       
       Animation modes are strings representing different node/edge and graph properties that you'd like to animate. 
       They are represented by an object that has as keys main categories of properties to animate and as values a list 
       of these specific properties. The properties are described below
       
       position - Describes the way nodes' positions must be interpolated. Possible values are 'linear', 'polar' or 'moebius'.
       node-property - Describes which Node properties will be interpolated. These properties can be any of the ones defined in <Options.Node>.
       edge-property - Describes which Edge properties will be interpolated. These properties can be any the ones defined in <Options.Edge>.
       label-property - Describes which Label properties will be interpolated. These properties can be any of the ones defined in <Options.Label> like color or size.
       node-style - Describes which Node Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.
       edge-style - Describes which Edge Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.

       Example:
       (start code js)
       var viz = new $jit.Viz(options);
       //...tweak some Data, CanvasStyles or LabelData properties...
       viz.fx.animate({
         modes: {
           'position': 'linear',
           'node-property': ['width', 'height'],
           'node-style': 'shadowColor',
           'label-property': 'size'
         },
         hideLabels: false
       });
       //...can also be written like this...
       viz.fx.animate({
         modes: ['linear',
                 'node-property:width:height',
                 'node-style:shadowColor',
                 'label-property:size'],
         hideLabels: false
       });
       (end code)
    */
    animate: function(opt, versor) {
      opt = $.merge(this.viz.config, opt || {});
      var that = this,
          viz = this.viz,
          graph  = viz.graph,
          interp = this.Interpolator,
          animation =  opt.type === 'nodefx'? this.nodeFxAnimation : this.animation;
      //prepare graph values
      var m = this.prepare(opt.modes);
      
      //animate
      if(opt.hideLabels) this.labels.hideLabels(true);
      animation.setOptions($.extend(opt, {
        $animating: false,
        compute: function(delta) {
          graph.eachNode(function(node) { 
            for(var p in m) {
              interp[p](node, m[p], delta, versor);
            }
          });
          that.plot(opt, this.$animating, delta);
          this.$animating = true;
        },
        complete: function() {
          if(opt.hideLabels) that.labels.hideLabels(false);
          that.plot(opt);
          opt.onComplete();
          //TODO(nico): This shouldn't be here!
          //opt.onAfterCompute();
        }       
      })).start();
    },
    
    /*
      nodeFx
   
      Apply animation to node properties like color, width, height, dim, etc.
  
      Parameters:
  
      options - Animation options. This object properties is described below
      elements - The Elements to be transformed. This is an object that has a properties
      
      (start code js)
      'elements': {
        //can also be an array of ids
        'id': 'id-of-node-to-transform',
        //properties to be modified. All properties are optional.
        'properties': {
          'color': '#ccc', //some color
          'width': 10, //some width
          'height': 10, //some height
          'dim': 20, //some dim
          'lineWidth': 10 //some line width
        } 
      }
      (end code)
      
      - _reposition_ Whether to recalculate positions and add a motion animation. 
      This might be used when changing _width_ or _height_ properties in a <Layouts.Tree> like layout. Default's *false*.
      
      - _onComplete_ A method that is called when the animation completes.
      
      ...and all other <Graph.Plot.animate> options like _duration_, _fps_, _transition_, etc.
  
      Example:
      (start code js)
       var rg = new RGraph(canvas, config); //can be also Hypertree or ST
       rg.fx.nodeFx({
         'elements': {
           'id':'mynodeid',
           'properties': {
             'color':'#ccf'
           },
           'transition': Trans.Quart.easeOut
         }
       });
      (end code)    
   */
   nodeFx: function(opt) {
     var viz = this.viz,
         graph  = viz.graph,
         animation = this.nodeFxAnimation,
         options = $.merge(this.viz.config, {
           'elements': {
             'id': false,
             'properties': {}
           },
           'reposition': false
         });
     opt = $.merge(options, opt || {}, {
       onBeforeCompute: $.empty,
       onAfterCompute: $.empty
     });
     //check if an animation is running
     animation.stopTimer();
     var props = opt.elements.properties;
     //set end values for nodes
     if(!opt.elements.id) {
       graph.eachNode(function(n) {
         for(var prop in props) {
           n.setData(prop, props[prop], 'end');
         }
       });
     } else {
       var ids = $.splat(opt.elements.id);
       $.each(ids, function(id) {
         var n = graph.getNode(id);
         if(n) {
           for(var prop in props) {
             n.setData(prop, props[prop], 'end');
           }
         }
       });
     }
     //get keys
     var propnames = [];
     for(var prop in props) propnames.push(prop);
     //add node properties modes
     var modes = ['node-property:' + propnames.join(':')];
     //set new node positions
     if(opt.reposition) {
       modes.push('linear');
       viz.compute('end');
     }
     //animate
     this.animate($.merge(opt, {
       modes: modes,
       type: 'nodefx'
     }));
   },

    
    /*
       Method: plot
    
       Plots a <Graph>.

       Parameters:

       opt - (optional) Plotting options. Most of them are described in <Options.Fx>.

       Example:

       (start code js)
       var viz = new $jit.Viz(options);
       viz.fx.plot(); 
       (end code)

    */
   plot: function(opt, animating) {
     var viz = this.viz, 
         aGraph = viz.graph, 
         canvas = viz.canvas, 
         id = viz.root, 
         that = this, 
         ctx = canvas.getCtx(), 
         min = Math.min,
         opt = opt || this.viz.controller;
     
     opt.clearCanvas && canvas.clear();
       
     var root = aGraph.getNode(id);
     if(!root) return;
     
     var T = !!root.visited;
     aGraph.eachNode(function(node) {
       var nodeAlpha = node.getData('alpha');
       node.eachAdjacency(function(adj) {
         var nodeTo = adj.nodeTo;
         if(!!nodeTo.visited === T && node.drawn && nodeTo.drawn) {
           !animating && opt.onBeforePlotLine(adj);
           that.plotLine(adj, canvas, animating);
           !animating && opt.onAfterPlotLine(adj);
         }
       });
       if(node.drawn) {
         !animating && opt.onBeforePlotNode(node);
         that.plotNode(node, canvas, animating);
         !animating && opt.onAfterPlotNode(node);
       }
       if(!that.labelsHidden && opt.withLabels) {
         if(node.drawn && nodeAlpha >= 0.95) {
           that.labels.plotLabel(canvas, node, opt);
         } else {
           that.labels.hideLabel(node, false);
         }
       }
       node.visited = !T;
     });
    },

  /*
      Plots a Subtree.
   */
   plotTree: function(node, opt, animating) {
       var that = this, 
       viz = this.viz, 
       canvas = viz.canvas,
       config = this.config,
       ctx = canvas.getCtx();
       var nodeAlpha = node.getData('alpha');
       node.eachSubnode(function(elem) {
         if(opt.plotSubtree(node, elem) && elem.exist && elem.drawn) {
             var adj = node.getAdjacency(elem.id);
             !animating && opt.onBeforePlotLine(adj);
             that.plotLine(adj, canvas, animating);
             !animating && opt.onAfterPlotLine(adj);
             that.plotTree(elem, opt, animating);
         }
       });
       if(node.drawn) {
           !animating && opt.onBeforePlotNode(node);
           this.plotNode(node, canvas, animating);
           !animating && opt.onAfterPlotNode(node);
           if(!opt.hideLabels && opt.withLabels && nodeAlpha >= 0.95) 
               this.labels.plotLabel(canvas, node, opt);
           else 
               this.labels.hideLabel(node, false);
       } else {
           this.labels.hideLabel(node, true);
       }
   },

  /*
       Method: plotNode
    
       Plots a <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       canvas - (object) A <Canvas> element.

    */
    plotNode: function(node, canvas, animating) {
        var f = node.getData('type'), 
            ctxObj = this.node.CanvasStyles;
        if(f != 'none') {
          var width = node.getData('lineWidth'),
              color = node.getData('color'),
              alpha = node.getData('alpha'),
              ctx = canvas.getCtx();
          ctx.save();
          ctx.lineWidth = width;
          ctx.fillStyle = ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          
          for(var s in ctxObj) {
            ctx[s] = node.getCanvasStyle(s);
          }

          this.nodeTypes[f].render.call(this, node, canvas, animating);
          ctx.restore();
        }
    },
    
    /*
       Method: plotLine
    
       Plots a <Graph.Adjacence>.

       Parameters:

       adj - (object) A <Graph.Adjacence>.
       canvas - (object) A <Canvas> instance.

    */
    plotLine: function(adj, canvas, animating) {
      var f = adj.getData('type'),
          ctxObj = this.edge.CanvasStyles;
      if(f != 'none') {
        var width = adj.getData('lineWidth'),
            color = adj.getData('color'),
            ctx = canvas.getCtx(),
            nodeFrom = adj.nodeFrom,
            nodeTo = adj.nodeTo;
        
        ctx.save();
        ctx.lineWidth = width;
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.globalAlpha = Math.min(nodeFrom.getData('alpha'), 
            nodeTo.getData('alpha'), 
            adj.getData('alpha'));
        
        for(var s in ctxObj) {
          ctx[s] = adj.getCanvasStyle(s);
        }

        this.edgeTypes[f].render.call(this, adj, canvas, animating);
        ctx.restore();
      }
    }    
  
};

/*
  Object: Graph.Plot3D
  
  <Graph> 3D rendering and animation methods.
  
  Properties:
  
  nodeHelper - <NodeHelper> object.
  edgeHelper - <EdgeHelper> object.

*/
Graph.Plot3D = $.merge(Graph.Plot, {
  Interpolator: {
    'linear': function(elem, props, delta) {
      var from = elem.startPos.getc(true);
      var to = elem.endPos.getc(true);
      elem.pos.setc(this.compute(from.x, to.x, delta), 
                    this.compute(from.y, to.y, delta),
                    this.compute(from.z, to.z, delta));
    }
  },
  
  plotNode: function(node, canvas) {
    if(node.getData('type') == 'none') return;
    this.plotElement(node, canvas, {
      getAlpha: function() {
        return node.getData('alpha');
      }
    });
  },
  
  plotLine: function(adj, canvas) {
    if(adj.getData('type') == 'none') return;
    this.plotElement(adj, canvas, {
      getAlpha: function() {
        return Math.min(adj.nodeFrom.getData('alpha'),
                        adj.nodeTo.getData('alpha'),
                        adj.getData('alpha'));
      }
    });
  },
  
  plotElement: function(elem, canvas, opt) {
    var gl = canvas.getCtx(),
        viewMatrix = new Matrix4,
        lighting = canvas.config.Scene.Lighting,
        wcanvas = canvas.canvases[0],
        program = wcanvas.program,
        camera = wcanvas.camera;
    
    if(!elem.geometry) {
      elem.geometry = new O3D[elem.getData('type')];
    }
    elem.geometry.update(elem);
    if(!elem.webGLVertexBuffer) {
      var vertices = [],
          faces = [],
          normals = [],
          vertexIndex = 0,
          geom = elem.geometry;
      
      for(var i=0, vs=geom.vertices, fs=geom.faces, fsl=fs.length; i<fsl; i++) {
        var face = fs[i],
            v1 = vs[face.a],
            v2 = vs[face.b],
            v3 = vs[face.c],
            v4 = face.d? vs[face.d] : false,
            n = face.normal;
        
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);
        if(v4) vertices.push(v4.x, v4.y, v4.z);
            
        normals.push(n.x, n.y, n.z);
        normals.push(n.x, n.y, n.z);
        normals.push(n.x, n.y, n.z);
        if(v4) normals.push(n.x, n.y, n.z);
            
        faces.push(vertexIndex, vertexIndex +1, vertexIndex +2);
        if(v4) {
          faces.push(vertexIndex, vertexIndex +2, vertexIndex +3);
          vertexIndex += 4;
        } else {
          vertexIndex += 3;
        }
      }
      //create and store vertex data
      elem.webGLVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, elem.webGLVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      //create and store faces index data
      elem.webGLFaceBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem.webGLFaceBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
      elem.webGLFaceCount = faces.length;
      //calculate vertex normals and store them
      elem.webGLNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, elem.webGLNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    }
    viewMatrix.multiply(camera.matrix, elem.geometry.matrix);
    //send matrix data
    gl.uniformMatrix4fv(program.viewMatrix, false, viewMatrix.flatten());
    gl.uniformMatrix4fv(program.projectionMatrix, false, camera.projectionMatrix.flatten());
    //send normal matrix for lighting
    var normalMatrix = Matrix4.makeInvert(viewMatrix);
    normalMatrix.$transpose();
    gl.uniformMatrix4fv(program.normalMatrix, false, normalMatrix.flatten());
    //send color data
    var color = $.hexToRgb(elem.getData('color'));
    color.push(opt.getAlpha());
    gl.uniform4f(program.color, color[0] / 255, color[1] / 255, color[2] / 255, color[3]);
    //send lighting data
    gl.uniform1i(program.enableLighting, lighting.enable);
    if(lighting.enable) {
      //set ambient light color
      if(lighting.ambient) {
        var acolor = lighting.ambient;
        gl.uniform3f(program.ambientColor, acolor[0], acolor[1], acolor[2]);
      }
      //set directional light
      if(lighting.directional) {
        var dir = lighting.directional,
            color = dir.color,
            pos = dir.direction,
            vd = new Vector3(pos.x, pos.y, pos.z).normalize().$scale(-1);
        gl.uniform3f(program.lightingDirection, vd.x, vd.y, vd.z);
        gl.uniform3f(program.directionalColor, color[0], color[1], color[2]);
      }
    }
    //send vertices data
    gl.bindBuffer(gl.ARRAY_BUFFER, elem.webGLVertexBuffer);
    gl.vertexAttribPointer(program.position, 3, gl.FLOAT, false, 0, 0);
    //send normals data
    gl.bindBuffer(gl.ARRAY_BUFFER, elem.webGLNormalBuffer);
    gl.vertexAttribPointer(program.normal, 3, gl.FLOAT, false, 0, 0);
    //draw!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem.webGLFaceBuffer );
    gl.drawElements(gl.TRIANGLES, elem.webGLFaceCount, gl.UNSIGNED_SHORT, 0);
  }
});


/*
 * File: Graph.Label.js
 *
*/

/*
   Object: Graph.Label

   An interface for plotting/hiding/showing labels.

   Description:

   This is a generic interface for plotting/hiding/showing labels.
   The <Graph.Label> interface is implemented in multiple ways to provide
   different label types.

   For example, the Graph.Label interface is implemented as <Graph.Label.HTML> to provide
   HTML label elements. Also we provide the <Graph.Label.SVG> interface for SVG type labels. 
   The <Graph.Label.Native> interface implements these methods with the native Canvas text rendering functions.
   
   All subclasses (<Graph.Label.HTML>, <Graph.Label.SVG> and <Graph.Label.Native>) implement the method plotLabel.
*/

Graph.Label = {};

/*
   Class: Graph.Label.Native

   Implements labels natively, using the Canvas text API.
*/
Graph.Label.Native = new Class({
    initialize: function(viz) {
      this.viz = viz;
    },

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
       Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)
    */
    plotLabel: function(canvas, node, controller) {
      var ctx = canvas.getCtx();
      var pos = node.pos.getc(true);

      ctx.font = node.getLabelData('style') + ' ' + node.getLabelData('size') + 'px ' + node.getLabelData('family');
      ctx.textAlign = node.getLabelData('textAlign');
      ctx.fillStyle = ctx.strokeStyle = node.getLabelData('color');
      ctx.textBaseline = node.getLabelData('textBaseline');

      this.renderLabel(canvas, node, controller);
    },

    /*
       renderLabel

       Does the actual rendering of the label in the canvas. The default
       implementation renders the label close to the position of the node, this
       method should be overriden to position the labels differently.

       Parameters:

       canvas - A <Canvas> instance.
       node - A <Graph.Node>.
       controller - A configuration object. See also <Hypertree>, <RGraph>, <ST>.
    */
    renderLabel: function(canvas, node, controller) {
      var ctx = canvas.getCtx();
      var pos = node.pos.getc(true);
      ctx.fillText(node.name, pos.x, pos.y + node.getData("height") / 2);
    },

    hideLabel: $.empty,
    hideLabels: $.empty
});

/*
   Class: Graph.Label.DOM

   Abstract Class implementing some DOM label methods.

   Implemented by:

   <Graph.Label.HTML> and <Graph.Label.SVG>.

*/
Graph.Label.DOM = new Class({
    //A flag value indicating if node labels are being displayed or not.
    labelsHidden: false,
    //Label container
    labelContainer: false,
    //Label elements hash.
    labels: {},

    /*
       Method: getLabelContainer

       Lazy fetcher for the label container.

       Returns:

       The label container DOM element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var labelContainer = viz.labels.getLabelContainer();
        alert(labelContainer.innerHTML);
      (end code)
    */
    getLabelContainer: function() {
      return this.labelContainer ?
        this.labelContainer :
        this.labelContainer = document.getElementById(this.viz.config.labelContainer);
    },

    /*
       Method: getLabel

       Lazy fetcher for the label element.

       Parameters:

       id - (string) The label id (which is also a <Graph.Node> id).

       Returns:

       The label element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var label = viz.labels.getLabel('someid');
        alert(label.innerHTML);
      (end code)

    */
    getLabel: function(id) {
      return (id in this.labels && this.labels[id] != null) ?
        this.labels[id] :
        this.labels[id] = document.getElementById(id);
    },

    /*
       Method: hideLabels

       Hides all labels (by hiding the label container).

       Parameters:

       hide - (boolean) A boolean value indicating if the label container must be hidden or not.

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        rg.labels.hideLabels(true);
       (end code)

    */
    hideLabels: function (hide) {
      var container = this.getLabelContainer();
      if(hide)
        container.style.display = 'none';
      else
        container.style.display = '';
      this.labelsHidden = hide;
    },

    /*
       Method: clearLabels

       Clears the label container.

       Useful when using a new visualization with the same canvas element/widget.

       Parameters:

       force - (boolean) Forces deletion of all labels.

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        viz.labels.clearLabels();
        (end code)
    */
    clearLabels: function(force) {
      for(var id in this.labels) {
        if (force || !this.viz.graph.hasNode(id)) {
          this.disposeLabel(id);
          delete this.labels[id];
        }
      }
    },

    /*
       Method: disposeLabel

       Removes a label.

       Parameters:

       id - (string) A label id (which generally is also a <Graph.Node> id).

       Example:
       (start code js)
        var viz = new $jit.Viz(options);
        viz.labels.disposeLabel('labelid');
       (end code)
    */
    disposeLabel: function(id) {
      var elem = this.getLabel(id);
      if(elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    },

    /*
       Method: hideLabel

       Hides the corresponding <Graph.Node> label.

       Parameters:

       node - (object) A <Graph.Node>. Can also be an array of <Graph.Nodes>.
       show - (boolean) If *true*, nodes will be shown. Otherwise nodes will be hidden.

       Example:
       (start code js)
        var rg = new $jit.Viz(options);
        viz.labels.hideLabel(viz.graph.getNode('someid'), false);
       (end code)
    */
    hideLabel: function(node, show) {
      node = $.splat(node);
      var st = show ? "" : "none", lab, that = this;
      $.each(node, function(n) {
        var lab = that.getLabel(n.id);
        if (lab) {
          lab.style.display = st;
        }
      });
    },

    /*
       fitsInCanvas

       Returns _true_ or _false_ if the label for the node is contained in the canvas dom element or not.

       Parameters:

       pos - A <Complex> instance (I'm doing duck typing here so any object with _x_ and _y_ parameters will do).
       canvas - A <Canvas> instance.

       Returns:

       A boolean value specifying if the label is contained in the <Canvas> DOM element or not.

    */
    fitsInCanvas: function(pos, canvas) {
      var size = canvas.getSize();
      if(pos.x >= size.width || pos.x < 0
         || pos.y >= size.height || pos.y < 0) return false;
       return true;
    }
});

/*
   Class: Graph.Label.HTML

   Implements HTML labels.

   Extends:

   All <Graph.Label.DOM> methods.

*/
Graph.Label.HTML = new Class({
    Implements: Graph.Label.DOM,

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
      Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)


    */
    plotLabel: function(canvas, node, controller) {
      var id = node.id, tag = this.getLabel(id);

      if(!tag && !(tag = document.getElementById(id))) {
        tag = document.createElement('div');
        var container = this.getLabelContainer();
        tag.id = id;
        tag.className = 'node';
        tag.style.position = 'absolute';
        controller.onCreateLabel(tag, node);
        container.appendChild(tag);
        this.labels[node.id] = tag;
      }

      this.placeLabel(tag, node, controller);
    }
});

/*
   Class: Graph.Label.SVG

   Implements SVG labels.

   Extends:

   All <Graph.Label.DOM> methods.
*/
Graph.Label.SVG = new Class({
    Implements: Graph.Label.DOM,

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
       Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)


    */
    plotLabel: function(canvas, node, controller) {
      var id = node.id, tag = this.getLabel(id);
      if(!tag && !(tag = document.getElementById(id))) {
        var ns = 'http://www.w3.org/2000/svg';
          tag = document.createElementNS(ns, 'svg:text');
        var tspan = document.createElementNS(ns, 'svg:tspan');
        tag.appendChild(tspan);
        var container = this.getLabelContainer();
        tag.setAttribute('id', id);
        tag.setAttribute('class', 'node');
        container.appendChild(tag);
        controller.onCreateLabel(tag, node);
        this.labels[node.id] = tag;
      }
      this.placeLabel(tag, node, controller);
    }
});



Graph.Geom = new Class({

  initialize: function(viz) {
    this.viz = viz;
    this.config = viz.config;
    this.node = viz.config.Node;
    this.edge = viz.config.Edge;
  },
  /*
    Applies a translation to the tree.
  
    Parameters:
  
    pos - A <Complex> number specifying translation vector.
    prop - A <Graph.Node> position property ('pos', 'start' or 'end').
  
    Example:
  
    (start code js)
      st.geom.translate(new Complex(300, 100), 'end');
    (end code)
  */  
  translate: function(pos, prop) {
     prop = $.splat(prop);
     this.viz.graph.eachNode(function(elem) {
         $.each(prop, function(p) { elem.getPos(p).$add(pos); });
     });
  },
  /*
    Hides levels of the tree until it properly fits in canvas.
  */  
  setRightLevelToShow: function(node, canvas, callback) {
     var level = this.getRightLevelToShow(node, canvas), 
         fx = this.viz.labels,
         opt = $.merge({
           execShow:true,
           execHide:true,
           onHide: $.empty,
           onShow: $.empty
         }, callback || {});
     node.eachLevel(0, this.config.levelsToShow, function(n) {
         var d = n._depth - node._depth;
         if(d > level) {
             opt.onHide(n);
             if(opt.execHide) {
               n.drawn = false; 
               n.exist = false;
               fx.hideLabel(n, false);
             }
         } else {
             opt.onShow(n);
             if(opt.execShow) {
               n.exist = true;
             }
         }
     });
     node.drawn= true;
  },
  /*
    Returns the right level to show for the current tree in order to fit in canvas.
  */  
  getRightLevelToShow: function(node, canvas) {
     var config = this.config;
     var level = config.levelsToShow;
     var constrained = config.constrained;
     if(!constrained) return level;
     while(!this.treeFitsInCanvas(node, canvas, level) && level > 1) { level-- ; }
     return level;
  }
});

/*
 * File: Loader.js
 * 
 */

/*
   Object: Loader

   Provides methods for loading and serving JSON data.
*/
var Loader = {
     construct: function(json) {
        var isGraph = ($.type(json) == 'array');
        var ans = new Graph(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
        if(!isGraph) 
            //make tree
            (function (ans, json) {
                ans.addNode(json);
                if(json.children) {
                  for(var i=0, ch = json.children; i<ch.length; i++) {
                    ans.addAdjacence(json, ch[i]);
                    arguments.callee(ans, ch[i]);
                  }
                }
            })(ans, json);
        else
            //make graph
            (function (ans, json) {
                var getNode = function(id) {
                  for(var i=0, l=json.length; i<l; i++) {
                    if(json[i].id == id) {
                      return json[i];
                    }
                  }
                  // The node was not defined in the JSON
                  // Let's create it
                  var newNode = {
                		"id" : id,
                		"name" : id
                	};
                  return ans.addNode(newNode);
                };

                for(var i=0, l=json.length; i<l; i++) {
                  ans.addNode(json[i]);
                  var adj = json[i].adjacencies;
                  if (adj) {
                    for(var j=0, lj=adj.length; j<lj; j++) {
                      var node = adj[j], data = {};
                      if(typeof adj[j] != 'string') {
                        data = $.merge(node.data, {});
                        node = node.nodeTo;
                      }
                      ans.addAdjacence(json[i], getNode(node), data);
                    }
                  }
                }
            })(ans, json);

        return ans;
    },

    /*
     Method: loadJSON
    
     Loads a JSON structure to the visualization. The JSON structure can be a JSON *tree* or *graph* structure.
     
      A JSON tree or graph structure consists of nodes, each having as properties
       
       id - (string) A unique identifier for the node
       name - (string) A node's name
       data - (object) The data optional property contains a hash (i.e {}) 
       where you can store all the information you want about this node.
        
      For JSON *Tree* structures, there's an extra optional property *children* of type Array which contains the node's children.
      
      Example:

      (start code js)
        var json = {  
          "id": "aUniqueIdentifier",  
          "name": "usually a nodes name",  
          "data": {
            "some key": "some value",
            "some other key": "some other value"
           },  
          "children": [ *other nodes or empty* ]  
        };  
      (end code)
        
        JSON *Graph* structures consist of an array of nodes, each specifying the nodes to which the current node is connected. 
        For JSON *Graph* structures, the *children* property is replaced by the *adjacencies* property.
        
        There are two types of *Graph* structures, *simple* and *extended* graph structures.
        
        For *simple* Graph structures, the adjacencies property contains an array of strings, each specifying the 
        id of the node connected to the main node.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": ["anotherUniqueIdentifier", "yetAnotherUniqueIdentifier", 'etc']  
          },

          'other nodes go here...' 
        ];          
        (end code)
        
        For *extended Graph structures*, the adjacencies property contains an array of Adjacency objects that have as properties
        
        nodeTo - (string) The other node connected by this adjacency.
        data - (object) A data property, where we can store custom key/value information.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": [  
            {  
              nodeTo:"aNodeId",  
              data: {} //put whatever you want here  
            },
            'other adjacencies go here...'  
          },

          'other nodes go here...' 
        ];          
        (end code)
       
       About the data property:
       
       As described before, you can store custom data in the *data* property of JSON *nodes* and *adjacencies*. 
       You can use almost any string as key for the data object. Some keys though are reserved by the toolkit, and 
       have special meanings. This is the case for keys starting with a dollar sign, for example, *$width*.
       
       For JSON *node* objects, adding dollar prefixed properties that match the names of the options defined in 
       <Options.Node> will override the general value for that option with that particular value. For this to work 
       however, you do have to set *overridable = true* in <Options.Node>.
       
       The same thing is true for JSON adjacencies. Dollar prefixed data properties will alter values set in <Options.Edge> 
       if <Options.Edge> has *overridable = true*.
       
       When loading JSON data into TreeMaps, the *data* property must contain a value for the *$area* key, 
       since this is the value which will be taken into account when creating the layout. 
       The same thing goes for the *$color* parameter.
       
       In JSON Nodes you can use also *$label-* prefixed properties to refer to <Options.Label> properties. For example, 
       *$label-size* will refer to <Options.Label> size property. Also, in JSON nodes and adjacencies you can set 
       canvas specific properties individually by using the *$canvas-* prefix. For example, *$canvas-shadowBlur* will refer 
       to the *shadowBlur* property.
       
       These properties can also be accessed after loading the JSON data from <Graph.Nodes> and <Graph.Adjacences> 
       by using <Accessors>. For more information take a look at the <Graph> and <Accessors> documentation.
       
       Finally, these properties can also be used to create advanced animations like with <Options.NodeStyles>. For more 
       information about creating animations please take a look at the <Graph.Plot> and <Graph.Plot.animate> documentation.
       
       loadJSON Parameters:
    
        json - A JSON Tree or Graph structure.
        i - For Graph structures only. Sets the indexed node as root for the visualization.

    */
    loadJSON: function(json, i) {
      this.json = json;
      //if they're canvas labels erase them.
      if(this.labels && this.labels.clearLabels) {
        this.labels.clearLabels(true);
      }
      this.graph = this.construct(json);
      if($.type(json) != 'array'){
        this.root = json.id;
      } else {
        this.root = json[i? i : 0].id;
      }
    },
    
    /*
      Method: toJSON
   
      Returns a JSON tree/graph structure from the visualization's <Graph>. 
      See <Loader.loadJSON> for the graph formats available.
      
      See also:
      
      <Loader.loadJSON>
      
      Parameters:
      
      type - (string) Default's "tree". The type of the JSON structure to be returned. 
      Possible options are "tree" or "graph".
    */    
    toJSON: function(type) {
      type = type || "tree";
      if(type == 'tree') {
        var ans = {};
        var rootNode = this.graph.getNode(this.root);
        var ans = (function recTree(node) {
          var ans = {};
          ans.id = node.id;
          ans.name = node.name;
          ans.data = node.data;
          var ch =[];
          node.eachSubnode(function(n) {
            ch.push(recTree(n));
          });
          ans.children = ch;
          return ans;
        })(rootNode);
        return ans;
      } else {
        var ans = [];
        var T = !!this.graph.getNode(this.root).visited;
        this.graph.eachNode(function(node) {
          var ansNode = {};
          ansNode.id = node.id;
          ansNode.name = node.name;
          ansNode.data = node.data;
          var adjs = [];
          node.eachAdjacency(function(adj) {
            var nodeTo = adj.nodeTo;
            if(!!nodeTo.visited === T) {
              var ansAdj = {};
              ansAdj.nodeTo = nodeTo.id;
              ansAdj.data = adj.data;
              adjs.push(ansAdj);
            }
          });
          ansNode.adjacencies = adjs;
          ans.push(ansNode);
          node.visited = !T;
        });
        return ans;
      }
    }
};



/*
 * File: Layouts.js
 * 
 * Implements base Tree and Graph layouts.
 *
 * Description:
 *
 * Implements base Tree and Graph layouts like Radial, Tree, etc.
 * 
 */

/*
 * Object: Layouts
 * 
 * Parent object for common layouts.
 *
 */
var Layouts = $jit.Layouts = {};


//Some util shared layout functions are defined here.
var NodeDim = {
  label: null,
  
  compute: function(graph, prop, opt) {
    this.initializeLabel(opt);
    var label = this.label, style = label.style;
    graph.eachNode(function(n) {
      var autoWidth  = n.getData('autoWidth'),
          autoHeight = n.getData('autoHeight');
      if(autoWidth || autoHeight) {
        //delete dimensions since these are
        //going to be overridden now.
        delete n.data.$width;
        delete n.data.$height;
        delete n.data.$dim;
        
        var width  = n.getData('width'),
            height = n.getData('height');
        //reset label dimensions
        style.width  = autoWidth? 'auto' : width + 'px';
        style.height = autoHeight? 'auto' : height + 'px';
        
        //TODO(nico) should let the user choose what to insert here.
        label.innerHTML = n.name;
        
        var offsetWidth  = label.offsetWidth,
            offsetHeight = label.offsetHeight;
        var type = n.getData('type');
        if($.indexOf(['circle', 'square', 'triangle', 'star'], type) === -1) {
          n.setData('width', offsetWidth);
          n.setData('height', offsetHeight);
        } else {
          var dim = offsetWidth > offsetHeight? offsetWidth : offsetHeight;
          n.setData('width', dim);
          n.setData('height', dim);
          n.setData('dim', dim); 
        }
      }
    });
  },
  
  initializeLabel: function(opt) {
    if(!this.label) {
      this.label = document.createElement('div');
      document.body.appendChild(this.label);
    }
    this.setLabelStyles(opt);
  },
  
  setLabelStyles: function(opt) {
    $.extend(this.label.style, {
      'visibility': 'hidden',
      'position': 'absolute',
      'width': 'auto',
      'height': 'auto'
    });
    this.label.className = 'jit-autoadjust-label';
  }
};


/*
 * Class: Layouts.Tree
 * 
 * Implements a Tree Layout.
 * 
 * Implemented By:
 * 
 * <ST>
 * 
 * Inspired by:
 * 
 * Drawing Trees (Andrew J. Kennedy) <http://research.microsoft.com/en-us/um/people/akenn/fun/drawingtrees.pdf>
 * 
 */
Layouts.Tree = (function() {
  //Layout functions
  var slice = Array.prototype.slice;

  /*
     Calculates the max width and height nodes for a tree level
  */  
  function getBoundaries(graph, config, level, orn, prop) {
    var dim = config.Node;
    var multitree = config.multitree;
    if (dim.overridable) {
      var w = -1, h = -1;
      graph.eachNode(function(n) {
        if (n._depth == level
            && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {
          var dw = n.getData('width', prop);
          var dh = n.getData('height', prop);
          w = (w < dw) ? dw : w;
          h = (h < dh) ? dh : h;
        }
      });
      return {
        'width' : w < 0 ? dim.width : w,
        'height' : h < 0 ? dim.height : h
      };
    } else {
      return dim;
    }
  }


  function movetree(node, prop, val, orn) {
    var p = (orn == "left" || orn == "right") ? "y" : "x";
    node.getPos(prop)[p] += val;
  }


  function moveextent(extent, val) {
    var ans = [];
    $.each(extent, function(elem) {
      elem = slice.call(elem);
      elem[0] += val;
      elem[1] += val;
      ans.push(elem);
    });
    return ans;
  }


  function merge(ps, qs) {
    if (ps.length == 0)
      return qs;
    if (qs.length == 0)
      return ps;
    var p = ps.shift(), q = qs.shift();
    return [ [ p[0], q[1] ] ].concat(merge(ps, qs));
  }


  function mergelist(ls, def) {
    def = def || [];
    if (ls.length == 0)
      return def;
    var ps = ls.pop();
    return mergelist(ls, merge(ps, def));
  }


  function fit(ext1, ext2, subtreeOffset, siblingOffset, i) {
    if (ext1.length <= i || ext2.length <= i)
      return 0;

    var p = ext1[i][1], q = ext2[i][0];
    return Math.max(fit(ext1, ext2, subtreeOffset, siblingOffset, ++i)
        + subtreeOffset, p - q + siblingOffset);
  }


  function fitlistl(es, subtreeOffset, siblingOffset) {
    function $fitlistl(acc, es, i) {
      if (es.length <= i)
        return [];
      var e = es[i], ans = fit(acc, e, subtreeOffset, siblingOffset, 0);
      return [ ans ].concat($fitlistl(merge(acc, moveextent(e, ans)), es, ++i));
    }
    ;
    return $fitlistl( [], es, 0);
  }


  function fitlistr(es, subtreeOffset, siblingOffset) {
    function $fitlistr(acc, es, i) {
      if (es.length <= i)
        return [];
      var e = es[i], ans = -fit(e, acc, subtreeOffset, siblingOffset, 0);
      return [ ans ].concat($fitlistr(merge(moveextent(e, ans), acc), es, ++i));
    }
    ;
    es = slice.call(es);
    var ans = $fitlistr( [], es.reverse(), 0);
    return ans.reverse();
  }


  function fitlist(es, subtreeOffset, siblingOffset, align) {
    var esl = fitlistl(es, subtreeOffset, siblingOffset), esr = fitlistr(es,
        subtreeOffset, siblingOffset);

    if (align == "left")
      esr = esl;
    else if (align == "right")
      esl = esr;

    for ( var i = 0, ans = []; i < esl.length; i++) {
      ans[i] = (esl[i] + esr[i]) / 2;
    }
    return ans;
  }


  function design(graph, node, prop, config, orn) {
    var multitree = config.multitree;
    var auxp = [ 'x', 'y' ], auxs = [ 'width', 'height' ];
    var ind = +(orn == "left" || orn == "right");
    var p = auxp[ind], notp = auxp[1 - ind];

    var cnode = config.Node;
    var s = auxs[ind], nots = auxs[1 - ind];

    var siblingOffset = config.siblingOffset;
    var subtreeOffset = config.subtreeOffset;
    var align = config.align;

    function $design(node, maxsize, acum) {
      var sval = node.getData(s, prop);
      var notsval = maxsize
          || (node.getData(nots, prop));

      var trees = [], extents = [], chmaxsize = false;
      var chacum = notsval + config.levelDistance;
      node.eachSubnode(function(n) {
            if (n.exist
                && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {

              if (!chmaxsize)
                chmaxsize = getBoundaries(graph, config, n._depth, orn, prop);

              var s = $design(n, chmaxsize[nots], acum + chacum);
              trees.push(s.tree);
              extents.push(s.extent);
            }
          });
      var positions = fitlist(extents, subtreeOffset, siblingOffset, align);
      for ( var i = 0, ptrees = [], pextents = []; i < trees.length; i++) {
        movetree(trees[i], prop, positions[i], orn);
        pextents.push(moveextent(extents[i], positions[i]));
      }
      var resultextent = [ [ -sval / 2, sval / 2 ] ]
          .concat(mergelist(pextents));
      node.getPos(prop)[p] = 0;

      if (orn == "top" || orn == "left") {
        node.getPos(prop)[notp] = acum;
      } else {
        node.getPos(prop)[notp] = -acum;
      }

      return {
        tree : node,
        extent : resultextent
      };
    }

    $design(node, false, 0);
  }


  return new Class({
    /*
    Method: compute
    
    Computes nodes' positions.

     */
    compute : function(property, computeLevels) {
      var prop = property || 'start';
      var node = this.graph.getNode(this.root);
      $.extend(node, {
        'drawn' : true,
        'exist' : true,
        'selected' : true
      });
      NodeDim.compute(this.graph, prop, this.config);
      if (!!computeLevels || !("_depth" in node)) {
        this.graph.computeLevels(this.root, 0, "ignore");
      }
      
      this.computePositions(node, prop);
    },

    computePositions : function(node, prop) {
      var config = this.config;
      var multitree = config.multitree;
      var align = config.align;
      var indent = align !== 'center' && config.indent;
      var orn = config.orientation;
      var orns = multitree ? [ 'top', 'right', 'bottom', 'left' ] : [ orn ];
      var that = this;
      $.each(orns, function(orn) {
        //calculate layout
          design(that.graph, node, prop, that.config, orn, prop);
          var i = [ 'x', 'y' ][+(orn == "left" || orn == "right")];
          //absolutize
          (function red(node) {
            node.eachSubnode(function(n) {
              if (n.exist
                  && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {

                n.getPos(prop)[i] += node.getPos(prop)[i];
                if (indent) {
                  n.getPos(prop)[i] += align == 'left' ? indent : -indent;
                }
                red(n);
              }
            });
          })(node);
        });
    }
  });
  
})();

/*
 * File: Spacetree.js
 */

/*
   Class: ST
   
  A Tree layout with advanced contraction and expansion animations.
     
  Inspired by:
 
  SpaceTree: Supporting Exploration in Large Node Link Tree, Design Evolution and Empirical Evaluation (Catherine Plaisant, Jesse Grosjean, Benjamin B. Bederson) 
  <http://hcil.cs.umd.edu/trs/2002-05/2002-05.pdf>
  
  Drawing Trees (Andrew J. Kennedy) <http://research.microsoft.com/en-us/um/people/akenn/fun/drawingtrees.pdf>
  
  Note:
 
  This visualization was built and engineered from scratch, taking only the papers as inspiration, and only shares some features with the visualization described in those papers.
 
  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Tree>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.Tips>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed
  
  constrained - (boolean) Default's *true*. Whether to show the entire tree when loaded or just the number of levels specified by _levelsToShow_.
  levelsToShow - (number) Default's *2*. The number of levels to show for a subtree. This number is relative to the selected node.
  levelDistance - (number) Default's *30*. The distance between two consecutive levels of the tree.
  Node.type - Described in <Options.Node>. Default's set to *rectangle*.
  offsetX - (number) Default's *0*. The x-offset distance from the selected node to the center of the canvas.
  offsetY - (number) Default's *0*. The y-offset distance from the selected node to the center of the canvas.
  duration - Described in <Options.Fx>. It's default value has been changed to *700*.
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <ST.Op> instance.
  fx - Access a <ST.Plot> instance.
  labels - Access a <ST.Label> interface implementation.

 */

$jit.ST= (function() {
    // Define some private methods first...
    // Nodes in path
    var nodesInPath = [];
    // Nodes to contract
    function getNodesToHide(node) {
      node = node || this.clickedNode;
      if(!this.config.constrained) {
        return [];
      }
      var Geom = this.geom;
      var graph = this.graph;
      var canvas = this.canvas;
      var level = node._depth, nodeArray = [];
  	  graph.eachNode(function(n) {
          if(n.exist && !n.selected) {
              if(n.isDescendantOf(node.id)) {
                if(n._depth <= level) nodeArray.push(n);
              } else {
                nodeArray.push(n);
              }
          }
  	  });
  	  var leafLevel = Geom.getRightLevelToShow(node, canvas);
  	  node.eachLevel(leafLevel, leafLevel, function(n) {
          if(n.exist && !n.selected) nodeArray.push(n);
  	  });
  	    
  	  for (var i = 0; i < nodesInPath.length; i++) {
  	    var n = this.graph.getNode(nodesInPath[i]);
  	    if(!n.isDescendantOf(node.id)) {
  	      nodeArray.push(n);
  	    }
  	  } 
  	  return nodeArray;       
    };
    // Nodes to expand
     function getNodesToShow(node) {
        var nodeArray = [], config = this.config;
        node = node || this.clickedNode;
        this.clickedNode.eachLevel(0, config.levelsToShow, function(n) {
            if(config.multitree && !('$orn' in n.data) 
            		&& n.anySubnode(function(ch){ return ch.exist && !ch.drawn; })) {
            	nodeArray.push(n);
            } else if(n.drawn && !n.anySubnode("drawn")) {
              nodeArray.push(n);
            }
        });
        return nodeArray;
     };
    // Now define the actual class.
    return new Class({
    
        Implements: [Loader, Extras, Layouts.Tree],
        
        initialize: function(controller) {            
          var $ST = $jit.ST;
          
          var config= {
                levelsToShow: 2,
                levelDistance: 30,
                constrained: true,                
                Node: {
                  type: 'rectangle'
                },
                duration: 700,
                offsetX: 0,
                offsetY: 0
            };
            
            this.controller = this.config = $.merge(
                Options("Canvas", "Fx", "Tree", "Node", "Edge", "Controller", 
                    "Tips", "NodeStyles", "Events", "Navigation", "Label"), config, controller);

            var canvasConfig = this.config;
            if(canvasConfig.useCanvas) {
              this.canvas = canvasConfig.useCanvas;
              this.config.labelContainer = this.canvas.id + '-label';
            } else {
              if(canvasConfig.background) {
                canvasConfig.background = $.merge({
                  type: 'Circles'
                }, canvasConfig.background);
              }
              this.canvas = new Canvas(this, canvasConfig);
              this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
            }

            this.graphOptions = {
                'klass': Complex
            };
            this.graph = new Graph(this.graphOptions, this.config.Node, this.config.Edge);
            this.labels = new $ST.Label[canvasConfig.Label.type](this);
            this.fx = new $ST.Plot(this, $ST);
            this.op = new $ST.Op(this);
            this.group = new $ST.Group(this);
            this.geom = new $ST.Geom(this);
            this.clickedNode=  null;
            // initialize extras
            this.initializeExtras();
        },
    
        /*
         Method: plot
        
         Plots the <ST>. This is a shortcut to *fx.plot*.

        */  
        plot: function() { this.fx.plot(this.controller); },
    
      
        /*
         Method: switchPosition
        
         Switches the tree orientation.

         Parameters:

        pos - (string) The new tree orientation. Possible values are "top", "left", "right" and "bottom".
        method - (string) Set this to "animate" if you want to animate the tree when switching its position. You can also set this parameter to "replot" to just replot the subtree.
        onComplete - (optional|object) This callback is called once the "switching" animation is complete.

         Example:

         (start code js)
           st.switchPosition("right", "animate", {
            onComplete: function() {
              alert('completed!');
            } 
           });
         (end code)
        */  
        switchPosition: function(pos, method, onComplete) {
          var Geom = this.geom, Plot = this.fx, that = this;
          if(!Plot.busy) {
              Plot.busy = true;
              this.contract({
                  onComplete: function() {
                      Geom.switchOrientation(pos);
                      that.compute('end', false);
                      Plot.busy = false;
                      if(method == 'animate') {
                    	  that.onClick(that.clickedNode.id, onComplete);  
                      } else if(method == 'replot') {
                    	  that.select(that.clickedNode.id, onComplete);
                      }
                  }
              }, pos);
          }
        },

        /*
        Method: switchAlignment
       
        Switches the tree alignment.

        Parameters:

       align - (string) The new tree alignment. Possible values are "left", "center" and "right".
       method - (string) Set this to "animate" if you want to animate the tree after aligning its position. You can also set this parameter to "replot" to just replot the subtree.
       onComplete - (optional|object) This callback is called once the "switching" animation is complete.

        Example:

        (start code js)
          st.switchAlignment("right", "animate", {
           onComplete: function() {
             alert('completed!');
           } 
          });
        (end code)
       */  
       switchAlignment: function(align, method, onComplete) {
        this.config.align = align;
        if(method == 'animate') {
        	this.select(this.clickedNode.id, onComplete);
        } else if(method == 'replot') {
        	this.onClick(this.clickedNode.id, onComplete);	
        }
       },

       /*
        Method: addNodeInPath
       
        Adds a node to the current path as selected node. The selected node will be visible (as in non-collapsed) at all times.
        

        Parameters:

       id - (string) A <Graph.Node> id.

        Example:

        (start code js)
          st.addNodeInPath("nodeId");
        (end code)
       */  
       addNodeInPath: function(id) {
           nodesInPath.push(id);
           this.select((this.clickedNode && this.clickedNode.id) || this.root);
       },       

       /*
       Method: clearNodesInPath
      
       Removes all nodes tagged as selected by the <ST.addNodeInPath> method.
       
       See also:
       
       <ST.addNodeInPath>
     
       Example:

       (start code js)
         st.clearNodesInPath();
       (end code)
      */  
       clearNodesInPath: function(id) {
           nodesInPath.length = 0;
           this.select((this.clickedNode && this.clickedNode.id) || this.root);
       },
        
       /*
         Method: refresh
        
         Computes positions and plots the tree.
         
       */
       refresh: function() {
           this.reposition();
           this.select((this.clickedNode && this.clickedNode.id) || this.root);
       },    

       reposition: function() {
            this.graph.computeLevels(this.root, 0, "ignore");
             this.geom.setRightLevelToShow(this.clickedNode, this.canvas);
            this.graph.eachNode(function(n) {
                if(n.exist) n.drawn = true;
            });
            this.compute('end');
        },
        
        requestNodes: function(node, onComplete) {
          var handler = $.merge(this.controller, onComplete), 
          lev = this.config.levelsToShow;
          if(handler.request) {
              var leaves = [], d = node._depth;
              node.eachLevel(0, lev, function(n) {
                  if(n.drawn && 
                   !n.anySubnode()) {
                   leaves.push(n);
                   n._level = lev - (n._depth - d);
                  }
              });
              this.group.requestNodes(leaves, handler);
          }
            else
              handler.onComplete();
        },
     
        contract: function(onComplete, switched) {
          var orn  = this.config.orientation;
          var Geom = this.geom, Group = this.group;
          if(switched) Geom.switchOrientation(switched);
          var nodes = getNodesToHide.call(this);
          if(switched) Geom.switchOrientation(orn);
          Group.contract(nodes, $.merge(this.controller, onComplete));
        },
      
         move: function(node, onComplete) {
            this.compute('end', false);
            var move = onComplete.Move, offset = {
                'x': move.offsetX,
                'y': move.offsetY 
            };
            if(move.enable) {
                this.geom.translate(node.endPos.add(offset).$scale(-1), "end");
            }
            this.fx.animate($.merge(this.controller, { modes: ['linear'] }, onComplete));
         },
      
        expand: function (node, onComplete) {
            var nodeArray = getNodesToShow.call(this, node);
            this.group.expand(nodeArray, $.merge(this.controller, onComplete));
        },
    
        selectPath: function(node) {
          var that = this;
          this.graph.eachNode(function(n) { n.selected = false; }); 
          function path(node) {
              if(node == null || node.selected) return;
              node.selected = true;
              $.each(that.group.getSiblings([node])[node.id], 
              function(n) { 
                   n.exist = true; 
                   n.drawn = true; 
              });    
              var parents = node.getParents();
              parents = (parents.length > 0)? parents[0] : null;
              path(parents);
          };
          for(var i=0, ns = [node.id].concat(nodesInPath); i < ns.length; i++) {
              path(this.graph.getNode(ns[i]));
          }
        },
      
        /*
        Method: setRoot
     
         Switches the current root node. Changes the topology of the Tree.
     
        Parameters:
           id - (string) The id of the node to be set as root.
           method - (string) Set this to "animate" if you want to animate the tree after adding the subtree. You can also set this parameter to "replot" to just replot the subtree.
           onComplete - (optional|object) An action to perform after the animation (if any).
 
        Example:

        (start code js)
          st.setRoot('nodeId', 'animate', {
             onComplete: function() {
               alert('complete!');
             }
          });
        (end code)
     */
     setRoot: function(id, method, onComplete) {
        	if(this.busy) return;
        	this.busy = true;
          var that = this, canvas = this.canvas;
        	var rootNode = this.graph.getNode(this.root);
        	var clickedNode = this.graph.getNode(id);
        	function $setRoot() {
            	if(this.config.multitree && clickedNode.data.$orn) {
            		var orn = clickedNode.data.$orn;
            		var opp = {
            				'left': 'right',
            				'right': 'left',
            				'top': 'bottom',
            				'bottom': 'top'
            		}[orn];
            		rootNode.data.$orn = opp;
            		(function tag(rootNode) {
                		rootNode.eachSubnode(function(n) {
                			if(n.id != id) {
                				n.data.$orn = opp;
                				tag(n);
                			}
                		});
            		})(rootNode);
            		delete clickedNode.data.$orn;
            	}
            	this.root = id;
            	this.clickedNode = clickedNode;
            	this.graph.computeLevels(this.root, 0, "ignore");
            	this.geom.setRightLevelToShow(clickedNode, canvas, {
            	  execHide: false,
            	  onShow: function(node) {
            	    if(!node.drawn) {
                    node.drawn = true;
                    node.setData('alpha', 1, 'end');
                    node.setData('alpha', 0);
                    node.pos.setc(clickedNode.pos.x, clickedNode.pos.y);
            	    }
            	  }
            	});
              this.compute('end');
              this.busy = true;
              this.fx.animate({
                modes: ['linear', 'node-property:alpha'],
                onComplete: function() {
                  that.busy = false;
                  that.onClick(id, {
                    onComplete: function() {
                      onComplete && onComplete.onComplete();
                    }
                  });
                }
              });
        	}

        	// delete previous orientations (if any)
        	delete rootNode.data.$orns;

        	if(method == 'animate') {
        	  $setRoot.call(this);
        	  that.selectPath(clickedNode);
        	} else if(method == 'replot') {
        		$setRoot.call(this);
        		this.select(this.root);
        	}
     },

     /*
           Method: addSubtree
        
            Adds a subtree.
        
           Parameters:
              subtree - (object) A JSON Tree object. See also <Loader.loadJSON>.
              method - (string) Set this to "animate" if you want to animate the tree after adding the subtree. You can also set this parameter to "replot" to just replot the subtree.
              onComplete - (optional|object) An action to perform after the animation (if any).
    
           Example:

           (start code js)
             st.addSubtree(json, 'animate', {
                onComplete: function() {
                  alert('complete!');
                }
             });
           (end code)
        */
        addSubtree: function(subtree, method, onComplete) {
            if(method == 'replot') {
                this.op.sum(subtree, $.extend({ type: 'replot' }, onComplete || {}));
            } else if (method == 'animate') {
                this.op.sum(subtree, $.extend({ type: 'fade:seq' }, onComplete || {}));
            }
        },
    
        /*
           Method: removeSubtree
        
            Removes a subtree.
        
           Parameters:
              id - (string) The _id_ of the subtree to be removed.
              removeRoot - (boolean) Default's *false*. Remove the root of the subtree or only its subnodes.
              method - (string) Set this to "animate" if you want to animate the tree after removing the subtree. You can also set this parameter to "replot" to just replot the subtree.
              onComplete - (optional|object) An action to perform after the animation (if any).

          Example:

          (start code js)
            st.removeSubtree('idOfSubtreeToBeRemoved', false, 'animate', {
              onComplete: function() {
                alert('complete!');
              }
            });
          (end code)
    
        */
        removeSubtree: function(id, removeRoot, method, onComplete) {
            var node = this.graph.getNode(id), subids = [];
            node.eachLevel(+!removeRoot, false, function(n) {
                subids.push(n.id);
            });
            if(method == 'replot') {
                this.op.removeNode(subids, $.extend({ type: 'replot' }, onComplete || {}));
            } else if (method == 'animate') {
                this.op.removeNode(subids, $.extend({ type: 'fade:seq'}, onComplete || {}));
            }
        },
    
        /*
           Method: select
        
            Selects a node in the <ST> without performing an animation. Useful when selecting 
            nodes which are currently hidden or deep inside the tree.

          Parameters:
            id - (string) The id of the node to select.
            onComplete - (optional|object) an onComplete callback.

          Example:
          (start code js)
            st.select('mynodeid', {
              onComplete: function() {
                alert('complete!');
              }
            });
          (end code)
        */
        select: function(id, onComplete) {
            var group = this.group, geom = this.geom;
            var node=  this.graph.getNode(id), canvas = this.canvas;
            var root  = this.graph.getNode(this.root);
            var complete = $.merge(this.controller, onComplete);
            var that = this;
    
            complete.onBeforeCompute(node);
            this.selectPath(node);
            this.clickedNode= node;
            this.requestNodes(node, {
                onComplete: function(){
                    group.hide(group.prepare(getNodesToHide.call(that)), complete);
                    geom.setRightLevelToShow(node, canvas);
                    that.compute("current");
                    that.graph.eachNode(function(n) { 
                        var pos = n.pos.getc(true);
                        n.startPos.setc(pos.x, pos.y);
                        n.endPos.setc(pos.x, pos.y);
                        n.visited = false; 
                    });
                    var offset = { x: complete.offsetX, y: complete.offsetY };
                    that.geom.translate(node.endPos.add(offset).$scale(-1), ["start", "current", "end"]);
                    group.show(getNodesToShow.call(that));              
                    that.plot();
                    complete.onAfterCompute(that.clickedNode);
                    complete.onComplete();
                }
            });     
        },
    
      /*
         Method: onClick
    
        Animates the <ST> to center the node specified by *id*.
            
        Parameters:
        
        id - (string) A node id.
        options - (optional|object) A group of options and callbacks described below.
        onComplete - (object) An object callback called when the animation finishes.
        Move - (object) An object that has as properties _offsetX_ or _offsetY_ for adding some offset position to the centered node.

        Example:

        (start code js)
          st.onClick('mynodeid', {
	          Move: {
	          	enable: true,
	            offsetX: 30,
	            offsetY: 5
	          },
	          onComplete: function() {
	              alert('yay!');
	          }
          });
        (end code)
    
        */    
      onClick: function (id, options) {
        var canvas = this.canvas, that = this, Geom = this.geom, config = this.config;
        var innerController = {
            Move: {
        	    enable: true,
              offsetX: config.offsetX || 0,
              offsetY: config.offsetY || 0  
            },
            setRightLevelToShowConfig: false,
            onBeforeRequest: $.empty,
            onBeforeContract: $.empty,
            onBeforeMove: $.empty,
            onBeforeExpand: $.empty
        };
        var complete = $.merge(this.controller, innerController, options);
        
        if(!this.busy) {
            this.busy = true;
            var node = this.graph.getNode(id);
            this.selectPath(node, this.clickedNode);
           	this.clickedNode = node;
            complete.onBeforeCompute(node);
            complete.onBeforeRequest(node);
            this.requestNodes(node, {
                onComplete: function() {
                    complete.onBeforeContract(node);
                    that.contract({
                        onComplete: function() {
                            Geom.setRightLevelToShow(node, canvas, complete.setRightLevelToShowConfig);
                            complete.onBeforeMove(node);
                            that.move(node, {
                                Move: complete.Move,
                                onComplete: function() {
                                    complete.onBeforeExpand(node);
                                    that.expand(node, {
                                        onComplete: function() {
                                            that.busy = false;
                                            complete.onAfterCompute(id);
                                            complete.onComplete();
                                        }
                                    }); // expand
                                }
                            }); // move
                        }
                    });// contract
                }
            });// request
        }
      }
    });

})();

$jit.ST.$extend = true;

/*
   Class: ST.Op
    
   Custom extension of <Graph.Op>.

   Extends:

   All <Graph.Op> methods
   
   See also:
   
   <Graph.Op>

*/
$jit.ST.Op = new Class({

  Implements: Graph.Op
    
});

/*
    
     Performs operations on group of nodes.

*/
$jit.ST.Group = new Class({
    
    initialize: function(viz) {
        this.viz = viz;
        this.canvas = viz.canvas;
        this.config = viz.config;
        this.animation = new Animation;
        this.nodes = null;
    },
    
    /*
    
       Calls the request method on the controller to request a subtree for each node. 
    */
    requestNodes: function(nodes, controller) {
        var counter = 0, len = nodes.length, nodeSelected = {};
        var complete = function() { controller.onComplete(); };
        var viz = this.viz;
        if(len == 0) complete();
        for(var i=0; i<len; i++) {
            nodeSelected[nodes[i].id] = nodes[i];
            controller.request(nodes[i].id, nodes[i]._level, {
                onComplete: function(nodeId, data) {
                    if(data && data.children) {
                        data.id = nodeId;
                        viz.op.sum(data, { type: 'nothing' });
                    }
                    if(++counter == len) {
                        viz.graph.computeLevels(viz.root, 0);
                        complete();
                    }
                }
            });
        }
    },
    
    /*
    
       Collapses group of nodes. 
    */
    contract: function(nodes, controller) {
        var viz = this.viz;
        var that = this;

        nodes = this.prepare(nodes);
        this.animation.setOptions($.merge(controller, {
            $animating: false,
            compute: function(delta) {
              if(delta == 1) delta = 0.99;
              that.plotStep(1 - delta, controller, this.$animating);
              this.$animating = 'contract';
            },
            
            complete: function() {
                that.hide(nodes, controller);
            }       
        })).start();
    },
    
    hide: function(nodes, controller) {
        var viz = this.viz;
        for(var i=0; i<nodes.length; i++) {
            // TODO nodes are requested on demand, but not
            // deleted when hidden. Would that be a good feature?
            // Currently that feature is buggy, so I'll turn it off
            // Actually this feature is buggy because trimming should take
            // place onAfterCompute and not right after collapsing nodes.
            if (true || !controller || !controller.request) {
                nodes[i].eachLevel(1, false, function(elem){
                    if (elem.exist) {
                        $.extend(elem, {
                            'drawn': false,
                            'exist': false
                        });
                    }
                });
            } else {
                var ids = [];
                nodes[i].eachLevel(1, false, function(n) {
                    ids.push(n.id);
                });
                viz.op.removeNode(ids, { 'type': 'nothing' });
                viz.labels.clearLabels();
            }
        }
        controller.onComplete();
    },    
    

    /*
       Expands group of nodes. 
    */
    expand: function(nodes, controller) {
        var that = this;
        this.show(nodes);
        this.animation.setOptions($.merge(controller, {
            $animating: false,
            compute: function(delta) {
                that.plotStep(delta, controller, this.$animating);
                this.$animating = 'expand';
            },
            
            complete: function() {
                that.plotStep(undefined, controller, false);
                controller.onComplete();
            }       
        })).start();
        
    },
    
    show: function(nodes) {
        var config = this.config;
        this.prepare(nodes);
        $.each(nodes, function(n) {
        	// check for root nodes if multitree
        	if(config.multitree && !('$orn' in n.data)) {
        		delete n.data.$orns;
        		var orns = ' ';
        		n.eachSubnode(function(ch) {
        			if(('$orn' in ch.data) 
        					&& orns.indexOf(ch.data.$orn) < 0 
        					&& ch.exist && !ch.drawn) {
        				orns += ch.data.$orn + ' ';
        			}
        		});
        		n.data.$orns = orns;
        	}
            n.eachLevel(0, config.levelsToShow, function(n) {
            	if(n.exist) n.drawn = true;
            });     
        });
    },
    
    prepare: function(nodes) {
        this.nodes = this.getNodesWithChildren(nodes);
        return this.nodes;
    },
    
    /*
       Filters an array of nodes leaving only nodes with children.
    */
    getNodesWithChildren: function(nodes) {
        var ans = [], config = this.config, root = this.viz.root;
        nodes.sort(function(a, b) { return (a._depth <= b._depth) - (a._depth >= b._depth); });
        for(var i=0; i<nodes.length; i++) {
            if(nodes[i].anySubnode("exist")) {
            	for (var j = i+1, desc = false; !desc && j < nodes.length; j++) {
                    if(!config.multitree || '$orn' in nodes[j].data) {
                		desc = desc || nodes[i].isDescendantOf(nodes[j].id);                    	
                    }
                }
                if(!desc) ans.push(nodes[i]);
            }
        }
        return ans;
    },
    
    plotStep: function(delta, controller, animating) {
        var viz = this.viz,
        config = this.config,
        canvas = viz.canvas, 
        ctx = canvas.getCtx(),
        nodes = this.nodes;
        var i, node;
        // hide nodes that are meant to be collapsed/expanded
        var nds = {};
        for(i=0; i<nodes.length; i++) {
          node = nodes[i];
          nds[node.id] = [];
          var root = config.multitree && !('$orn' in node.data);
          var orns = root && node.data.$orns;
          node.eachSubgraph(function(n) { 
            // TODO(nico): Cleanup
        	  // special check for root node subnodes when
        	  // multitree is checked.
        	  if(root && orns && orns.indexOf(n.data.$orn) > 0 
        			  && n.drawn) {
        		  n.drawn = false;
                  nds[node.id].push(n);
              } else if((!root || !orns) && n.drawn) {
                n.drawn = false;
                nds[node.id].push(n);
              }
            });	
            node.drawn = true;
        }
        // plot the whole (non-scaled) tree
        if(nodes.length > 0) viz.fx.plot();
        // show nodes that were previously hidden
        for(i in nds) {
          $.each(nds[i], function(n) { n.drawn = true; });
        }
        // plot each scaled subtree
        for(i=0; i<nodes.length; i++) {
          node = nodes[i];
          ctx.save();
          viz.fx.plotSubtree(node, controller, delta, animating);                
          ctx.restore();
        }
      },

      getSiblings: function(nodes) {
        var siblings = {};
        $.each(nodes, function(n) {
            var par = n.getParents();
            if (par.length == 0) {
                siblings[n.id] = [n];
            } else {
                var ans = [];
                par[0].eachSubnode(function(sn) {
                    ans.push(sn);
                });
                siblings[n.id] = ans;
            }
        });
        return siblings;
    }
});

/*
   ST.Geom

   Performs low level geometrical computations.

   Access:

   This instance can be accessed with the _geom_ parameter of the st instance created.

   Example:

   (start code js)
    var st = new ST(canvas, config);
    st.geom.translate //or can also call any other <ST.Geom> method
   (end code)

*/

$jit.ST.Geom = new Class({
    Implements: Graph.Geom,
    /*
       Changes the tree current orientation to the one specified.

       You should usually use <ST.switchPosition> instead.
    */  
    switchOrientation: function(orn) {
    	this.config.orientation = orn;
    },

    /*
       Makes a value dispatch according to the current layout
       Works like a CSS property, either _top-right-bottom-left_ or _top|bottom - left|right_.
     */
    dispatch: function() {
    	  // TODO(nico) should store Array.prototype.slice.call somewhere.
        var args = Array.prototype.slice.call(arguments);
        var s = args.shift(), len = args.length;
        var val = function(a) { return typeof a == 'function'? a() : a; };
        if(len == 2) {
            return (s == "top" || s == "bottom")? val(args[0]) : val(args[1]);
        } else if(len == 4) {
            switch(s) {
                case "top": return val(args[0]);
                case "right": return val(args[1]);
                case "bottom": return val(args[2]);
                case "left": return val(args[3]);
            }
        }
        return undefined;
    },

    /*
       Returns label height or with, depending on the tree current orientation.
    */  
    getSize: function(n, invert) {
        var data = n.data, config = this.config;
        var siblingOffset = config.siblingOffset;
        var s = (config.multitree 
        		&& ('$orn' in data) 
        		&& data.$orn) || config.orientation;
        var w = n.getData('width') + siblingOffset;
        var h = n.getData('height') + siblingOffset;
        if(!invert)
            return this.dispatch(s, h, w);
        else
            return this.dispatch(s, w, h);
    },
    
    /*
       Calculates a subtree base size. This is an utility function used by _getBaseSize_
    */  
    getTreeBaseSize: function(node, level, leaf) {
        var size = this.getSize(node, true), baseHeight = 0, that = this;
        if(leaf(level, node)) return size;
        if(level === 0) return 0;
        node.eachSubnode(function(elem) {
            baseHeight += that.getTreeBaseSize(elem, level -1, leaf);
        });
        return (size > baseHeight? size : baseHeight) + this.config.subtreeOffset;
    },


    /*
       getEdge
       
       Returns a Complex instance with the begin or end position of the edge to be plotted.

       Parameters:

       node - A <Graph.Node> that is connected to this edge.
       type - Returns the begin or end edge position. Possible values are 'begin' or 'end'.

       Returns:

       A <Complex> number specifying the begin or end position.
    */  
    getEdge: function(node, type, s) {
    	var $C = function(a, b) { 
          return function(){
            return node.pos.add(new Complex(a, b));
          }; 
        };
        var dim = this.node;
        var w = node.getData('width');
        var h = node.getData('height');

        if(type == 'begin') {
            if(dim.align == "center") {
                return this.dispatch(s, $C(0, h/2), $C(-w/2, 0),
                                     $C(0, -h/2),$C(w/2, 0));
            } else if(dim.align == "left") {
                return this.dispatch(s, $C(0, h), $C(0, 0),
                                     $C(0, 0), $C(w, 0));
            } else if(dim.align == "right") {
                return this.dispatch(s, $C(0, 0), $C(-w, 0),
                                     $C(0, -h),$C(0, 0));
            } else throw "align: not implemented";
            
            
        } else if(type == 'end') {
            if(dim.align == "center") {
                return this.dispatch(s, $C(0, -h/2), $C(w/2, 0),
                                     $C(0, h/2),  $C(-w/2, 0));
            } else if(dim.align == "left") {
                return this.dispatch(s, $C(0, 0), $C(w, 0),
                                     $C(0, h), $C(0, 0));
            } else if(dim.align == "right") {
                return this.dispatch(s, $C(0, -h),$C(0, 0),
                                     $C(0, 0), $C(-w, 0));
            } else throw "align: not implemented";
        }
    },

    /*
       Adjusts the tree position due to canvas scaling or translation.
    */  
    getScaledTreePosition: function(node, scale) {
        var dim = this.node;
        var w = node.getData('width');
        var h = node.getData('height');
        var s = (this.config.multitree 
        		&& ('$orn' in node.data) 
        		&& node.data.$orn) || this.config.orientation;

        var $C = function(a, b) { 
          return function(){
            return node.pos.add(new Complex(a, b)).$scale(1 - scale);
          }; 
        };
        if(dim.align == "left") {
            return this.dispatch(s, $C(0, h), $C(0, 0),
                                 $C(0, 0), $C(w, 0));
        } else if(dim.align == "center") {
            return this.dispatch(s, $C(0, h / 2), $C(-w / 2, 0),
                                 $C(0, -h / 2),$C(w / 2, 0));
        } else if(dim.align == "right") {
            return this.dispatch(s, $C(0, 0), $C(-w, 0),
                                 $C(0, -h),$C(0, 0));
        } else throw "align: not implemented";
    },

    /*
       treeFitsInCanvas
       
       Returns a Boolean if the current subtree fits in canvas.

       Parameters:

       node - A <Graph.Node> which is the current root of the subtree.
       canvas - The <Canvas> object.
       level - The depth of the subtree to be considered.
    */  
    treeFitsInCanvas: function(node, canvas, level) {
        var csize = canvas.getSize();
        var s = (this.config.multitree 
        		&& ('$orn' in node.data) 
        		&& node.data.$orn) || this.config.orientation;

        var size = this.dispatch(s, csize.width, csize.height);
        var baseSize = this.getTreeBaseSize(node, level, function(level, node) { 
          return level === 0 || !node.anySubnode();
        });
        return (baseSize < size);
    }
});

/*
  Class: ST.Plot
  
  Custom extension of <Graph.Plot>.

  Extends:

  All <Graph.Plot> methods
  
  See also:
  
  <Graph.Plot>

*/
$jit.ST.Plot = new Class({
    
    Implements: Graph.Plot,
    
    /*
       Plots a subtree from the spacetree.
    */
    plotSubtree: function(node, opt, scale, animating) {
        var viz = this.viz, canvas = viz.canvas, config = viz.config;
        scale = Math.min(Math.max(0.001, scale), 1);
        if(scale >= 0) {
            node.drawn = false;     
            var ctx = canvas.getCtx();
            var diff = viz.geom.getScaledTreePosition(node, scale);
            ctx.translate(diff.x, diff.y);
            ctx.scale(scale, scale);
        }
        this.plotTree(node, $.merge(opt, {
          'withLabels': true,
          'hideLabels': !!scale,
          'plotSubtree': function(n, ch) {
            var root = config.multitree && !('$orn' in node.data);
            var orns = root && node.getData('orns');
            return !root || orns.indexOf(node.getData('orn')) > -1;
          }
        }), animating);
        if(scale >= 0) node.drawn = true;
    },   
   
    /*
        Method: getAlignedPos
        
        Returns a *x, y* object with the position of the top/left corner of a <ST> node.
        
        Parameters:
        
        pos - (object) A <Graph.Node> position.
        width - (number) The width of the node.
        height - (number) The height of the node.
        
     */
    getAlignedPos: function(pos, width, height) {
        var nconfig = this.node;
        var square, orn;
        if(nconfig.align == "center") {
            square = {
                x: pos.x - width / 2,
                y: pos.y - height / 2
            };
        } else if (nconfig.align == "left") {
            orn = this.config.orientation;
            if(orn == "bottom" || orn == "top") {
                square = {
                    x: pos.x - width / 2,
                    y: pos.y
                };
            } else {
                square = {
                    x: pos.x,
                    y: pos.y - height / 2
                };
            }
        } else if(nconfig.align == "right") {
            orn = this.config.orientation;
            if(orn == "bottom" || orn == "top") {
                square = {
                    x: pos.x - width / 2,
                    y: pos.y - height
                };
            } else {
                square = {
                    x: pos.x - width,
                    y: pos.y - height / 2
                };
            }
        } else throw "align: not implemented";
        
        return square;
    },
    
    getOrientation: function(adj) {
    	var config = this.config;
    	var orn = config.orientation;

    	if(config.multitree) {
        	var nodeFrom = adj.nodeFrom;
        	var nodeTo = adj.nodeTo;
    		orn = (('$orn' in nodeFrom.data) 
        		&& nodeFrom.data.$orn) 
        		|| (('$orn' in nodeTo.data) 
        		&& nodeTo.data.$orn);
    	}

    	return orn; 
    }
});

/*
  Class: ST.Label

  Custom extension of <Graph.Label>. 
  Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.

  Extends:

  All <Graph.Label> methods and subclasses.

  See also:

  <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
 */ 
$jit.ST.Label = {};

/*
   ST.Label.Native

   Custom extension of <Graph.Label.Native>.

   Extends:

   All <Graph.Label.Native> methods

   See also:

   <Graph.Label.Native>
*/
$jit.ST.Label.Native = new Class({
  Implements: Graph.Label.Native,

  renderLabel: function(canvas, node, controller) {
    var ctx = canvas.getCtx(),
        coord = node.pos.getc(true),
        width = node.getData('width'),
        height = node.getData('height'),
        pos = this.viz.fx.getAlignedPos(coord, width, height);
    ctx.fillText(node.name, pos.x + width / 2, pos.y + height / 2);
  }
});

$jit.ST.Label.DOM = new Class({
  Implements: Graph.Label.DOM,

  /* 
      placeLabel

      Overrides abstract method placeLabel in <Graph.Plot>.

      Parameters:

      tag - A DOM label element.
      node - A <Graph.Node>.
      controller - A configuration/controller object passed to the visualization.
     
    */
    placeLabel: function(tag, node, controller) {
        var pos = node.pos.getc(true), 
            config = this.viz.config, 
            dim = config.Node, 
            canvas = this.viz.canvas,
            w = node.getData('width'),
            h = node.getData('height'),
            radius = canvas.getSize(),
            labelPos, orn;
        
        var ox = canvas.translateOffsetX,
            oy = canvas.translateOffsetY,
            sx = canvas.scaleOffsetX,
            sy = canvas.scaleOffsetY,
            posx = pos.x * sx + ox,
            posy = pos.y * sy + oy;

        if(dim.align == "center") {
            labelPos= {
                x: Math.round(posx - w / 2 + radius.width/2),
                y: Math.round(posy - h / 2 + radius.height/2)
            };
        } else if (dim.align == "left") {
            orn = config.orientation;
            if(orn == "bottom" || orn == "top") {
                labelPos= {
                    x: Math.round(posx - w / 2 + radius.width/2),
                    y: Math.round(posy + radius.height/2)
                };
            } else {
                labelPos= {
                    x: Math.round(posx + radius.width/2),
                    y: Math.round(posy - h / 2 + radius.height/2)
                };
            }
        } else if(dim.align == "right") {
            orn = config.orientation;
            if(orn == "bottom" || orn == "top") {
                labelPos= {
                    x: Math.round(posx - w / 2 + radius.width/2),
                    y: Math.round(posy - h + radius.height/2)
                };
            } else {
                labelPos= {
                    x: Math.round(posx - w + radius.width/2),
                    y: Math.round(posy - h / 2 + radius.height/2)
                };
            }
        } else throw "align: not implemented";

        var style = tag.style;
        style.left = labelPos.x + 'px';
        style.top  = labelPos.y + 'px';
        style.display = this.fitsInCanvas(labelPos, canvas)? '' : 'none';
        controller.onPlaceLabel(tag, node);
    }
});

/*
  ST.Label.SVG

  Custom extension of <Graph.Label.SVG>.

  Extends:

  All <Graph.Label.SVG> methods

  See also:

  <Graph.Label.SVG>
*/
$jit.ST.Label.SVG = new Class({
  Implements: [$jit.ST.Label.DOM, Graph.Label.SVG],

  initialize: function(viz) {
    this.viz = viz;
  }
});

/*
   ST.Label.HTML

   Custom extension of <Graph.Label.HTML>.

   Extends:

   All <Graph.Label.HTML> methods.

   See also:

   <Graph.Label.HTML>

*/
$jit.ST.Label.HTML = new Class({
  Implements: [$jit.ST.Label.DOM, Graph.Label.HTML],

  initialize: function(viz) {
    this.viz = viz;
  }
});


/*
  Class: ST.Plot.NodeTypes

  This class contains a list of <Graph.Node> built-in types. 
  Node types implemented are 'none', 'circle', 'rectangle', 'ellipse' and 'square'.

  You can add your custom node types, customizing your visualization to the extreme.

  Example:

  (start code js)
    ST.Plot.NodeTypes.implement({
      'mySpecialType': {
        'render': function(node, canvas) {
          //print your custom node to canvas
        },
        //optional
        'contains': function(node, pos) {
          //return true if pos is inside the node or false otherwise
        }
      }
    });
  (end code)

*/
$jit.ST.Plot.NodeTypes = new Class({
  'none': {
    'render': $.empty,
    'contains': $.lambda(false)
  },
  'circle': {
    'render': function(node, canvas) {
      var dim  = node.getData('dim'),
          pos = this.getAlignedPos(node.pos.getc(true), dim, dim),
          dim2 = dim/2;
      this.nodeHelper.circle.render('fill', {x:pos.x+dim2, y:pos.y+dim2}, dim2, canvas);
    },
    'contains': function(node, pos) {
      var dim  = node.getData('dim'),
          npos = this.getAlignedPos(node.pos.getc(true), dim, dim),
          dim2 = dim/2;
      this.nodeHelper.circle.contains({x:npos.x+dim2, y:npos.y+dim2}, pos, dim2);
    }
  },
  'square': {
    'render': function(node, canvas) {
      var dim  = node.getData('dim'),
          dim2 = dim/2,
          pos = this.getAlignedPos(node.pos.getc(true), dim, dim);
      this.nodeHelper.square.render('fill', {x:pos.x+dim2, y:pos.y+dim2}, dim2, canvas);
    },
    'contains': function(node, pos) {
      var dim  = node.getData('dim'),
          npos = this.getAlignedPos(node.pos.getc(true), dim, dim),
          dim2 = dim/2;
      this.nodeHelper.square.contains({x:npos.x+dim2, y:npos.y+dim2}, pos, dim2);
    }
  },
  'ellipse': {
    'render': function(node, canvas) {
      var width = node.getData('width'),
          height = node.getData('height'),
          pos = this.getAlignedPos(node.pos.getc(true), width, height);
      this.nodeHelper.ellipse.render('fill', {x:pos.x+width/2, y:pos.y+height/2}, width, height, canvas);
    },
    'contains': function(node, pos) {
      var width = node.getData('width'),
          height = node.getData('height'),
          npos = this.getAlignedPos(node.pos.getc(true), width, height);
      this.nodeHelper.ellipse.contains({x:npos.x+width/2, y:npos.y+height/2}, pos, width, height);
    }
  },
  'rectangle': {
    'render': function(node, canvas) {
      var width = node.getData('width'),
          height = node.getData('height'),
          pos = this.getAlignedPos(node.pos.getc(true), width, height);
      this.nodeHelper.rectangle.render('fill', {x:pos.x+width/2, y:pos.y+height/2}, width, height, canvas);
    },
    'contains': function(node, pos) {
      var width = node.getData('width'),
          height = node.getData('height'),
          npos = this.getAlignedPos(node.pos.getc(true), width, height);
      this.nodeHelper.rectangle.contains({x:npos.x+width/2, y:npos.y+height/2}, pos, width, height);
    }
  }
});

/*
  Class: ST.Plot.EdgeTypes

  This class contains a list of <Graph.Adjacence> built-in types. 
  Edge types implemented are 'none', 'line', 'arrow', 'quadratic:begin', 'quadratic:end', 'bezier'.

  You can add your custom edge types, customizing your visualization to the extreme.

  Example:

  (start code js)
    ST.Plot.EdgeTypes.implement({
      'mySpecialType': {
        'render': function(adj, canvas) {
          //print your custom edge to canvas
        },
        //optional
        'contains': function(adj, pos) {
          //return true if pos is inside the arc or false otherwise
        }
      }
    });
  (end code)

*/
$jit.ST.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'line': {
      'render': function(adj, canvas) {
        var orn = this.getOrientation(adj),
            nodeFrom = adj.nodeFrom, 
            nodeTo = adj.nodeTo,
            rel = nodeFrom._depth < nodeTo._depth,
            from = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
            to =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn);
        this.edgeHelper.line.render(from, to, canvas);
      },
      'contains': function(adj, pos) {
        var orn = this.getOrientation(adj),
            nodeFrom = adj.nodeFrom, 
            nodeTo = adj.nodeTo,
            rel = nodeFrom._depth < nodeTo._depth,
            from = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
            to =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn);
        return this.edgeHelper.line.contains(from, to, pos, this.edge.epsilon);
      }
    },
     'arrow': {
       'render': function(adj, canvas) {
         var orn = this.getOrientation(adj),
             node = adj.nodeFrom, 
             child = adj.nodeTo,
             dim = adj.getData('dim'),
             from = this.viz.geom.getEdge(node, 'begin', orn),
             to = this.viz.geom.getEdge(child, 'end', orn),
             direction = adj.data.$direction,
             inv = (direction && direction.length>1 && direction[0] != node.id);
         this.edgeHelper.arrow.render(from, to, dim, inv, canvas);
       },
       'contains': function(adj, pos) {
         var orn = this.getOrientation(adj),
             nodeFrom = adj.nodeFrom, 
             nodeTo = adj.nodeTo,
             rel = nodeFrom._depth < nodeTo._depth,
             from = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
             to =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn);
         return this.edgeHelper.arrow.contains(from, to, pos, this.edge.epsilon);
       }
     },
    'quadratic:begin': {
       'render': function(adj, canvas) {
          var orn = this.getOrientation(adj);
          var nodeFrom = adj.nodeFrom, 
              nodeTo = adj.nodeTo,
              rel = nodeFrom._depth < nodeTo._depth,
              begin = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
              end =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn),
              dim = adj.getData('dim'),
              ctx = canvas.getCtx();
          ctx.beginPath();
          ctx.moveTo(begin.x, begin.y);
          switch(orn) {
            case "left":
              ctx.quadraticCurveTo(begin.x + dim, begin.y, end.x, end.y);
              break;
            case "right":
              ctx.quadraticCurveTo(begin.x - dim, begin.y, end.x, end.y);
              break;
            case "top":
              ctx.quadraticCurveTo(begin.x, begin.y + dim, end.x, end.y);
              break;
            case "bottom":
              ctx.quadraticCurveTo(begin.x, begin.y - dim, end.x, end.y);
              break;
          }
          ctx.stroke();
        }
     },
    'quadratic:end': {
       'render': function(adj, canvas) {
          var orn = this.getOrientation(adj);
          var nodeFrom = adj.nodeFrom, 
              nodeTo = adj.nodeTo,
              rel = nodeFrom._depth < nodeTo._depth,
              begin = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
              end =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn),
              dim = adj.getData('dim'),
              ctx = canvas.getCtx();
          ctx.beginPath();
          ctx.moveTo(begin.x, begin.y);
          switch(orn) {
            case "left":
              ctx.quadraticCurveTo(end.x - dim, end.y, end.x, end.y);
              break;
            case "right":
              ctx.quadraticCurveTo(end.x + dim, end.y, end.x, end.y);
              break;
            case "top":
              ctx.quadraticCurveTo(end.x, end.y - dim, end.x, end.y);
              break;
            case "bottom":
              ctx.quadraticCurveTo(end.x, end.y + dim, end.x, end.y);
              break;
          }
          ctx.stroke();
       }
     },
    'bezier': {
       'render': function(adj, canvas) {
         var orn = this.getOrientation(adj),
             nodeFrom = adj.nodeFrom, 
             nodeTo = adj.nodeTo,
             rel = nodeFrom._depth < nodeTo._depth,
             begin = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
             end =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn),
             dim = adj.getData('dim'),
             ctx = canvas.getCtx();
         ctx.beginPath();
         ctx.moveTo(begin.x, begin.y);
         switch(orn) {
           case "left":
             ctx.bezierCurveTo(begin.x + dim, begin.y, end.x - dim, end.y, end.x, end.y);
             break;
           case "right":
             ctx.bezierCurveTo(begin.x - dim, begin.y, end.x + dim, end.y, end.x, end.y);
             break;
           case "top":
             ctx.bezierCurveTo(begin.x, begin.y + dim, end.x, end.y - dim, end.x, end.y);
             break;
           case "bottom":
             ctx.bezierCurveTo(begin.x, begin.y - dim, end.x, end.y + dim, end.x, end.y);
             break;
         }
         ctx.stroke();
       }
    }
});



/*
 * File: AreaChart.js
 *
*/

$jit.ST.Plot.NodeTypes.implement({
  'areachart-stacked' : {
    'render' : function(node, canvas) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          stringArray = node.getData('stringArray'),
          dimArray = node.getData('dimArray'),
          valArray = node.getData('valueArray'),
          valLeft = $.reduce(valArray, function(x, y) { return x + y[0]; }, 0),
          valRight = $.reduce(valArray, function(x, y) { return x + y[1]; }, 0),
          colorArray = node.getData('colorArray'),
          colorLength = colorArray.length,
          config = node.getData('config'),
          gradient = node.getData('gradient'),
          showLabels = config.showLabels,
          aggregates = config.showAggregates,
          label = config.Label,
          prev = node.getData('prev');

      var ctx = canvas.getCtx(), border = node.getData('border');
      if (colorArray && dimArray && stringArray) {
        for (var i=0, l=dimArray.length, acumLeft=0, acumRight=0, valAcum=0; i<l; i++) {
          ctx.fillStyle = ctx.strokeStyle = colorArray[i % colorLength];
          ctx.save();
          if(gradient && (dimArray[i][0] > 0 || dimArray[i][1] > 0)) {
            var h1 = acumLeft + dimArray[i][0],
                h2 = acumRight + dimArray[i][1],
                alpha = Math.atan((h2 - h1) / width),
                delta = 55;
            var linear = ctx.createLinearGradient(x + width/2, 
                y - (h1 + h2)/2,
                x + width/2 + delta * Math.sin(alpha),
                y - (h1 + h2)/2 + delta * Math.cos(alpha));
            var color = $.rgbToHex($.map($.hexToRgb(colorArray[i % colorLength].slice(1)), 
                function(v) { return (v * 0.85) >> 0; }));
            linear.addColorStop(0, colorArray[i % colorLength]);
            linear.addColorStop(1, color);
            ctx.fillStyle = linear;
          }
          ctx.beginPath();
          ctx.moveTo(x, y - acumLeft);
          ctx.lineTo(x + width, y - acumRight);
          ctx.lineTo(x + width, y - acumRight - dimArray[i][1]);
          ctx.lineTo(x, y - acumLeft - dimArray[i][0]);
          ctx.lineTo(x, y - acumLeft);
          ctx.fill();
          ctx.restore();
          if(border) {
            var strong = border.name == stringArray[i];
            var perc = strong? 0.7 : 0.8;
            var color = $.rgbToHex($.map($.hexToRgb(colorArray[i % colorLength].slice(1)), 
                function(v) { return (v * perc) >> 0; }));
            ctx.strokeStyle = color;
            ctx.lineWidth = strong? 4 : 1;
            ctx.save();
            ctx.beginPath();
            if(border.index === 0) {
              ctx.moveTo(x, y - acumLeft);
              ctx.lineTo(x, y - acumLeft - dimArray[i][0]);
            } else {
              ctx.moveTo(x + width, y - acumRight);
              ctx.lineTo(x + width, y - acumRight - dimArray[i][1]);
            }
            ctx.stroke();
            ctx.restore();
          }
          acumLeft += (dimArray[i][0] || 0);
          acumRight += (dimArray[i][1] || 0);
          
          if(dimArray[i][0] > 0)
            valAcum += (valArray[i][0] || 0);
        }
        if(prev && label.type == 'Native') {
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = ctx.strokeStyle = label.color;
          ctx.font = label.style + ' ' + label.size + 'px ' + label.family;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var aggValue = aggregates(node.name, valLeft, valRight, node, valAcum);
          if(aggValue !== false) {
            ctx.fillText(aggValue !== true? aggValue : valAcum, x, y - acumLeft - config.labelOffset - label.size/2, width);
          }
          if(showLabels(node.name, valLeft, valRight, node)) {
            ctx.fillText(node.name, x, y + label.size/2 + config.labelOffset);
          }
          ctx.restore();
        }
      }
    },
    'contains': function(node, mpos) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          dimArray = node.getData('dimArray'),
          rx = mpos.x - x;
      //bounding box check
      if(mpos.x < x || mpos.x > x + width
        || mpos.y > y || mpos.y < y - height) {
        return false;
      }
      //deep check
      for(var i=0, l=dimArray.length, lAcum=y, rAcum=y; i<l; i++) {
        var dimi = dimArray[i];
        lAcum -= dimi[0];
        rAcum -= dimi[1];
        var intersec = lAcum + (rAcum - lAcum) * rx / width;
        if(mpos.y >= intersec) {
          var index = +(rx > width/2);
          return {
            'name': node.getData('stringArray')[i],
            'color': node.getData('colorArray')[i],
            'value': node.getData('valueArray')[i][index],
            'index': index
          };
        }
      }
      return false;
    }
  }
});

/*
  Class: AreaChart
  
  A visualization that displays stacked area charts.
  
  Constructor Options:
  
  See <Options.AreaChart>.

*/
$jit.AreaChart = new Class({
  st: null,
  colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
  selected: {},
  busy: false,
  
  initialize: function(opt) {
    this.controller = this.config = 
      $.merge(Options("Canvas", "Margin", "Label", "AreaChart"), {
        Label: { type: 'Native' }
      }, opt);
    //set functions for showLabels and showAggregates
    var showLabels = this.config.showLabels,
        typeLabels = $.type(showLabels),
        showAggregates = this.config.showAggregates,
        typeAggregates = $.type(showAggregates);
    this.config.showLabels = typeLabels == 'function'? showLabels : $.lambda(showLabels);
    this.config.showAggregates = typeAggregates == 'function'? showAggregates : $.lambda(showAggregates);
    
    this.initializeViz();
  },
  
  initializeViz: function() {
    var config = this.config,
        that = this,
        nodeType = config.type.split(":")[0],
        nodeLabels = {};

    var delegate = new $jit.ST({
      injectInto: config.injectInto,
      width: config.width,
      height: config.height,
      orientation: "bottom",
      levelDistance: 0,
      siblingOffset: 0,
      subtreeOffset: 0,
      withLabels: config.Label.type != 'Native',
      useCanvas: config.useCanvas,
      Label: {
        type: config.Label.type
      },
      Node: {
        overridable: true,
        type: 'areachart-' + nodeType,
        align: 'left',
        width: 1,
        height: 1
      },
      Edge: {
        type: 'none'
      },
      Tips: {
        enable: config.Tips.enable,
        type: 'Native',
        force: true,
        onShow: function(tip, node, contains) {
          var elem = contains;
          config.Tips.onShow(tip, elem, node);
        }
      },
      Events: {
        enable: true,
        type: 'Native',
        onClick: function(node, eventInfo, evt) {
          if(!config.filterOnClick && !config.Events.enable) return;
          var elem = eventInfo.getContains();
          if(elem) config.filterOnClick && that.filter(elem.name);
          config.Events.enable && config.Events.onClick(elem, eventInfo, evt);
        },
        onRightClick: function(node, eventInfo, evt) {
          if(!config.restoreOnRightClick) return;
          that.restore();
        },
        onMouseMove: function(node, eventInfo, evt) {
          if(!config.selectOnHover) return;
          if(node) {
            var elem = eventInfo.getContains();
            that.select(node.id, elem.name, elem.index);
          } else {
            that.select(false, false, false);
          }
        }
      },
      onCreateLabel: function(domElement, node) {
        var labelConf = config.Label,
            valueArray = node.getData('valueArray'),
            acumLeft = $.reduce(valueArray, function(x, y) { return x + y[0]; }, 0),
            acumRight = $.reduce(valueArray, function(x, y) { return x + y[1]; }, 0);
        if(node.getData('prev')) {
          var nlbs = {
            wrapper: document.createElement('div'),
            aggregate: document.createElement('div'),
            label: document.createElement('div')
          };
          var wrapper = nlbs.wrapper,
              label = nlbs.label,
              aggregate = nlbs.aggregate,
              wrapperStyle = wrapper.style,
              labelStyle = label.style,
              aggregateStyle = aggregate.style;
          //store node labels
          nodeLabels[node.id] = nlbs;
          //append labels
          wrapper.appendChild(label);
          wrapper.appendChild(aggregate);
          if(!config.showLabels(node.name, acumLeft, acumRight, node)) {
            label.style.display = 'none';
          }
          if(!config.showAggregates(node.name, acumLeft, acumRight, node)) {
            aggregate.style.display = 'none';
          }
          wrapperStyle.position = 'relative';
          wrapperStyle.overflow = 'visible';
          wrapperStyle.fontSize = labelConf.size + 'px';
          wrapperStyle.fontFamily = labelConf.family;
          wrapperStyle.color = labelConf.color;
          wrapperStyle.textAlign = 'center';
          aggregateStyle.position = labelStyle.position = 'absolute';
          
          domElement.style.width = node.getData('width') + 'px';
          domElement.style.height = node.getData('height') + 'px';
          label.innerHTML = node.name;
          
          domElement.appendChild(wrapper);
        }
      },
      onPlaceLabel: function(domElement, node) {
        if(!node.getData('prev')) return;
        var labels = nodeLabels[node.id],
            wrapperStyle = labels.wrapper.style,
            labelStyle = labels.label.style,
            aggregateStyle = labels.aggregate.style,
            width = node.getData('width'),
            height = node.getData('height'),
            dimArray = node.getData('dimArray'),
            valArray = node.getData('valueArray'),
            acumLeft = $.reduce(valArray, function(x, y) { return x + y[0]; }, 0),
            acumRight = $.reduce(valArray, function(x, y) { return x + y[1]; }, 0),
            font = parseInt(wrapperStyle.fontSize, 10),
            domStyle = domElement.style;
        
        if(dimArray && valArray) {
          if(config.showLabels(node.name, acumLeft, acumRight, node)) {
            labelStyle.display = '';
          } else {
            labelStyle.display = 'none';
          }
          var aggValue = config.showAggregates(node.name, acumLeft, acumRight, node);
          if(aggValue !== false) {
            aggregateStyle.display = '';
          } else {
            aggregateStyle.display = 'none';
          }
          wrapperStyle.width = aggregateStyle.width = labelStyle.width = domElement.style.width = width + 'px';
          aggregateStyle.left = labelStyle.left = -width/2 + 'px';
          for(var i=0, l=valArray.length, acum=0, leftAcum=0; i<l; i++) {
            if(dimArray[i][0] > 0) {
              acum+= valArray[i][0];
              leftAcum+= dimArray[i][0];
            }
          }
          aggregateStyle.top = (-font - config.labelOffset) + 'px';
          labelStyle.top = (config.labelOffset + leftAcum) + 'px';
          domElement.style.top = parseInt(domElement.style.top, 10) - leftAcum + 'px';
          domElement.style.height = wrapperStyle.height = leftAcum + 'px';
          labels.aggregate.innerHTML = aggValue !== true? aggValue : acum;
        }
      }
    });
    
    var size = delegate.canvas.getSize(),
        margin = config.Margin;
    delegate.config.offsetY = -size.height/2 + margin.bottom 
      + (config.showLabels && (config.labelOffset + config.Label.size));
    delegate.config.offsetX = (margin.right - margin.left)/2;
    this.delegate = delegate;
    this.canvas = this.delegate.canvas;
  },
  
 /*
  Method: loadJSON
 
  Loads JSON data into the visualization. 
  
  Parameters:
  
  json - The JSON data format. This format is described in <http://blog.thejit.org/2010/04/24/new-javascript-infovis-toolkit-visualizations/#json-data-format>.
  
  Example:
  (start code js)
  var areaChart = new $jit.AreaChart(options);
  areaChart.loadJSON(json);
  (end code)
 */  
  loadJSON: function(json) {
    var prefix = $.time(), 
        ch = [], 
        delegate = this.delegate,
        name = $.splat(json.label), 
        color = $.splat(json.color || this.colors),
        config = this.config,
        gradient = !!config.type.split(":")[1],
        animate = config.animate;
    
    for(var i=0, values=json.values, l=values.length; i<l-1; i++) {
      var val = values[i], prev = values[i-1], next = values[i+1];
      var valLeft = $.splat(values[i].values), valRight = $.splat(values[i+1].values);
      var valArray = $.zip(valLeft, valRight);
      var acumLeft = 0, acumRight = 0;
      ch.push({
        'id': prefix + val.label,
        'name': val.label,
        'data': {
          'value': valArray,
          '$valueArray': valArray,
          '$colorArray': color,
          '$stringArray': name,
          '$next': next.label,
          '$prev': prev? prev.label:false,
          '$config': config,
          '$gradient': gradient
        },
        'children': []
      });
    }
    var root = {
      'id': prefix + '$root',
      'name': '',
      'data': {
        '$type': 'none',
        '$width': 1,
        '$height': 1
      },
      'children': ch
    };
    delegate.loadJSON(root);
    
    this.normalizeDims();
    delegate.compute();
    delegate.select(delegate.root);
    if(animate) {
      delegate.fx.animate({
        modes: ['node-property:height:dimArray'],
        duration:1500
      });
    }
  },
  
 /*
  Method: updateJSON
 
  Use this method when updating values for the current JSON data. If the items specified by the JSON data already exist in the graph then their values will be updated.
  
  Parameters:
  
  json - (object) JSON data to be updated. The JSON format corresponds to the one described in <AreaChart.loadJSON>.
  onComplete - (object) A callback object to be called when the animation transition when updating the data end.
  
  Example:
  
  (start code js)
  areaChart.updateJSON(json, {
    onComplete: function() {
      alert('update complete!');
    }
  });
  (end code)
 */  
  updateJSON: function(json, onComplete) {
    if(this.busy) return;
    this.busy = true;
    
    var delegate = this.delegate,
        graph = delegate.graph,
        labels = json.label && $.splat(json.label),
        values = json.values,
        animate = this.config.animate,
        that = this,
        hashValues = {};

    //convert the whole thing into a hash
    for (var i = 0, l = values.length; i < l; i++) {
      hashValues[values[i].label] = values[i];
    }
  
    graph.eachNode(function(n) {
      var v = hashValues[n.name],
          stringArray = n.getData('stringArray'),
          valArray = n.getData('valueArray'),
          next = n.getData('next');
      
      if (v) {
        v.values = $.splat(v.values);
        $.each(valArray, function(a, i) {
          a[0] = v.values[i];
          if(labels) stringArray[i] = labels[i];
        });
        n.setData('valueArray', valArray);
      }
     
      if(next) {
        v = hashValues[next];
        if(v) {
          $.each(valArray, function(a, i) {
            a[1] = v.values[i];
          });
        }
      }
    });
    this.normalizeDims();
    delegate.compute();
    delegate.select(delegate.root);
    if(animate) {
      delegate.fx.animate({
        modes: ['node-property:height:dimArray'],
        duration:1500,
        onComplete: function() {
          that.busy = false;
          onComplete && onComplete.onComplete();
        }
      });
    }
  },
  
/*
  Method: filter
 
  Filter selected stacks, collapsing all other stacks. You can filter multiple stacks at the same time.
  
  Parameters:
  
  filters - (array) An array of strings with the name of the stacks to be filtered.
  callback - (object) An object with an *onComplete* callback method. 
  
  Example:
  
  (start code js)
  areaChart.filter(['label A', 'label C'], {
      onComplete: function() {
          console.log('done!');
      }
  });
  (end code)
  
  See also:
  
  <AreaChart.restore>.
 */  
  filter: function(filters, callback) {
    if(this.busy) return;
    this.busy = true;
    if(this.config.Tips.enable) this.delegate.tips.hide();
    this.select(false, false, false);
    var args = $.splat(filters);
    var rt = this.delegate.graph.getNode(this.delegate.root);
    var that = this;
    this.normalizeDims();
    rt.eachAdjacency(function(adj) {
      var n = adj.nodeTo, 
          dimArray = n.getData('dimArray', 'end'),
          stringArray = n.getData('stringArray');
      n.setData('dimArray', $.map(dimArray, function(d, i) {
        return ($.indexOf(args, stringArray[i]) > -1)? d:[0, 0];
      }), 'end');
    });
    this.delegate.fx.animate({
      modes: ['node-property:dimArray'],
      duration:1500,
      onComplete: function() {
        that.busy = false;
        callback && callback.onComplete();
      }
    });
  },
  
  /*
  Method: restore
 
  Sets all stacks that could have been filtered visible.
  
  Example:
  
  (start code js)
  areaChart.restore();
  (end code)
  
  See also:
  
  <AreaChart.filter>.
 */  
  restore: function(callback) {
    if(this.busy) return;
    this.busy = true;
    if(this.config.Tips.enable) this.delegate.tips.hide();
    this.select(false, false, false);
    this.normalizeDims();
    var that = this;
    this.delegate.fx.animate({
      modes: ['node-property:height:dimArray'],
      duration:1500,
      onComplete: function() {
        that.busy = false;
        callback && callback.onComplete();
      }
    });
  },
  //adds the little brown bar when hovering the node
  select: function(id, name, index) {
    if(!this.config.selectOnHover) return;
    var s = this.selected;
    if(s.id != id || s.name != name 
        || s.index != index) {
      s.id = id;
      s.name = name;
      s.index = index;
      this.delegate.graph.eachNode(function(n) {
        n.setData('border', false);
      });
      if(id) {
        var n = this.delegate.graph.getNode(id);
        n.setData('border', s);
        var link = index === 0? 'prev':'next';
        link = n.getData(link);
        if(link) {
          n = this.delegate.graph.getByName(link);
          if(n) {
            n.setData('border', {
              name: name,
              index: 1-index
            });
          }
        }
      }
      this.delegate.plot();
    }
  },
  
  /*
    Method: getLegend
   
    Returns an object containing as keys the legend names and as values hex strings with color values.
    
    Example:
    
    (start code js)
    var legend = areaChart.getLegend();
    (end code)
 */  
  getLegend: function() {
    var legend = {};
    var n;
    this.delegate.graph.getNode(this.delegate.root).eachAdjacency(function(adj) {
      n = adj.nodeTo;
    });
    var colors = n.getData('colorArray'),
        len = colors.length;
    $.each(n.getData('stringArray'), function(s, i) {
      legend[s] = colors[i % len];
    });
    return legend;
  },
  
  /*
    Method: getMaxValue
   
    Returns the maximum accumulated value for the stacks. This method is used for normalizing the graph heights according to the canvas height.
    
    Example:
    
    (start code js)
    var ans = areaChart.getMaxValue();
    (end code)
    
    In some cases it could be useful to override this method to normalize heights for a group of AreaCharts, like when doing small multiples.
    
    Example:
    
    (start code js)
    //will return 100 for all AreaChart instances,
    //displaying all of them with the same scale
    $jit.AreaChart.implement({
      'getMaxValue': function() {
        return 100;
      }
    });
    (end code)
    
*/  
  getMaxValue: function() {
    var maxValue = 0;
    this.delegate.graph.eachNode(function(n) {
      var valArray = n.getData('valueArray'),
          acumLeft = 0, acumRight = 0;
      $.each(valArray, function(v) { 
        acumLeft += +v[0];
        acumRight += +v[1];
      });
      var acum = acumRight>acumLeft? acumRight:acumLeft;
      maxValue = maxValue>acum? maxValue:acum;
    });
    return maxValue;
  },
  
  normalizeDims: function() {
    //number of elements
    var root = this.delegate.graph.getNode(this.delegate.root), l=0;
    root.eachAdjacency(function() {
      l++;
    });
    var maxValue = this.getMaxValue() || 1,
        size = this.delegate.canvas.getSize(),
        config = this.config,
        margin = config.Margin,
        labelOffset = config.labelOffset + config.Label.size,
        fixedDim = (size.width - (margin.left + margin.right)) / l,
        animate = config.animate,
        height = size.height - (margin.top + margin.bottom) - (config.showAggregates && labelOffset) 
          - (config.showLabels && labelOffset);
    this.delegate.graph.eachNode(function(n) {
      var acumLeft = 0, acumRight = 0, animateValue = [];
      $.each(n.getData('valueArray'), function(v) {
        acumLeft += +v[0];
        acumRight += +v[1];
        animateValue.push([0, 0]);
      });
      var acum = acumRight>acumLeft? acumRight:acumLeft;
      n.setData('width', fixedDim);
      if(animate) {
        n.setData('height', acum * height / maxValue, 'end');
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return [n[0] * height / maxValue, n[1] * height / maxValue]; 
        }), 'end');
        var dimArray = n.getData('dimArray');
        if(!dimArray) {
          n.setData('dimArray', animateValue);
        }
      } else {
        n.setData('height', acum * height / maxValue);
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return [n[0] * height / maxValue, n[1] * height / maxValue]; 
        }));
      }
    });
  }
});


/*
 * File: Options.BarChart.js
 *
*/

/*
  Object: Options.BarChart
  
  <BarChart> options. 
  Other options included in the BarChart are <Options.Canvas>, <Options.Label>, <Options.Margin>, <Options.Tips> and <Options.Events>.
  
  Syntax:
  
  (start code js)

  Options.BarChart = {
    animate: true,
    labelOffset: 3,
    barsOffset: 0,
    type: 'stacked',
    hoveredColor: '#9fd4ff',
    orientation: 'horizontal',
    showAggregates: true,
    showLabels: true
  };
  
  (end code)
  
  Example:
  
  (start code js)

  var barChart = new $jit.BarChart({
    animate: true,
    barsOffset: 10,
    type: 'stacked:gradient'
  });
  
  (end code)

  Parameters:
  
  animate - (boolean) Default's *true*. Whether to add animated transitions when filtering/restoring stacks.
  offset - (number) Default's *25*. Adds margin between the visualization and the canvas.
  labelOffset - (number) Default's *3*. Adds margin between the label and the default place where it should be drawn.
  barsOffset - (number) Default's *0*. Separation between bars.
  type - (string) Default's *'stacked'*. Stack or grouped styles. Posible values are 'stacked', 'grouped', 'stacked:gradient', 'grouped:gradient' to add gradients.
  hoveredColor - (boolean|string) Default's *'#9fd4ff'*. Sets the selected color for a hovered bar stack.
  orientation - (string) Default's 'horizontal'. Sets the direction of the bars. Possible options are 'vertical' or 'horizontal'.
  showAggregates - (boolean, function) Default's *true*. Display the sum the values of each bar. Can also be a function that returns *true* or *false* to display the value of the bar or not. That same function can also return a string with the formatted data to be added.
  showLabels - (boolean, function) Default's *true*. Display the name of the slots. Can also be a function that returns *true* or *false* for each bar to decide whether to show the label or not.
  
*/

Options.BarChart = {
  $extend: true,
  
  animate: true,
  type: 'stacked', //stacked, grouped, : gradient
  labelOffset: 3, //label offset
  barsOffset: 0, //distance between bars
  hoveredColor: '#9fd4ff',
  orientation: 'horizontal',
  showAggregates: true,
  showLabels: true,
  Tips: {
    enable: false,
    onShow: $.empty,
    onHide: $.empty
  },
  Events: {
    enable: false,
    onClick: $.empty
  }
};

/*
 * File: BarChart.js
 *
*/

$jit.ST.Plot.NodeTypes.implement({
  'barchart-stacked' : {
    'render' : function(node, canvas) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          dimArray = node.getData('dimArray'),
          valueArray = node.getData('valueArray'),
          colorArray = node.getData('colorArray'),
          colorLength = colorArray.length,
          stringArray = node.getData('stringArray');

      var ctx = canvas.getCtx(),
          opt = {},
          border = node.getData('border'),
          gradient = node.getData('gradient'),
          config = node.getData('config'),
          horz = config.orientation == 'horizontal',
          aggregates = config.showAggregates,
          showLabels = config.showLabels,
          label = config.Label;
      
      if (colorArray && dimArray && stringArray) {
        for (var i=0, l=dimArray.length, acum=0, valAcum=0; i<l; i++) {
          ctx.fillStyle = ctx.strokeStyle = colorArray[i % colorLength];
          if(gradient) {
            var linear;
            if(horz) {
              linear = ctx.createLinearGradient(x + acum + dimArray[i]/2, y, 
                  x + acum + dimArray[i]/2, y + height);
            } else {
              linear = ctx.createLinearGradient(x, y - acum - dimArray[i]/2, 
                  x + width, y - acum- dimArray[i]/2);
            }
            var color = $.rgbToHex($.map($.hexToRgb(colorArray[i % colorLength].slice(1)), 
                function(v) { return (v * 0.5) >> 0; }));
            linear.addColorStop(0, color);
            linear.addColorStop(0.5, colorArray[i % colorLength]);
            linear.addColorStop(1, color);
            ctx.fillStyle = linear;
          }
          if(horz) {
            ctx.fillRect(x + acum, y, dimArray[i], height);
          } else {
            ctx.fillRect(x, y - acum - dimArray[i], width, dimArray[i]);
          }
          if(border && border.name == stringArray[i]) {
            opt.acum = acum;
            opt.dimValue = dimArray[i];
          }
          acum += (dimArray[i] || 0);
          valAcum += (valueArray[i] || 0);
        }
        if(border) {
          ctx.save();
          ctx.lineWidth = 2;
          ctx.strokeStyle = border.color;
          if(horz) {
            ctx.strokeRect(x + opt.acum + 1, y + 1, opt.dimValue -2, height - 2);
          } else {
            ctx.strokeRect(x + 1, y - opt.acum - opt.dimValue + 1, width -2, opt.dimValue -2);
          }
          ctx.restore();
        }
        if(label.type == 'Native') {
          ctx.save();
          ctx.fillStyle = ctx.strokeStyle = label.color;
          ctx.font = label.style + ' ' + label.size + 'px ' + label.family;
          ctx.textBaseline = 'middle';
          var aggValue = aggregates(node.name, valAcum, node);
          if(aggValue !== false) {
            aggValue = aggValue !== true? aggValue : valAcum;
            if(horz) {
              ctx.textAlign = 'right';
              ctx.fillText(aggValue, x + acum - config.labelOffset, y + height/2);
            } else {
              ctx.textAlign = 'center';
              ctx.fillText(aggValue, x + width/2, y - height - label.size/2 - config.labelOffset);
            }
          }
          if(showLabels(node.name, valAcum, node)) {
            if(horz) {
              ctx.textAlign = 'center';
              ctx.translate(x - config.labelOffset - label.size/2, y + height/2);
              ctx.rotate(Math.PI / 2);
              ctx.fillText(node.name, 0, 0);
            } else {
              ctx.textAlign = 'center';
              ctx.fillText(node.name, x + width/2, y + label.size/2 + config.labelOffset);
            }
          }
          ctx.restore();
        }
      }
    },
    'contains': function(node, mpos) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          dimArray = node.getData('dimArray'),
          config = node.getData('config'),
          rx = mpos.x - x,
          horz = config.orientation == 'horizontal';
      //bounding box check
      if(horz) {
        if(mpos.x < x || mpos.x > x + width
            || mpos.y > y + height || mpos.y < y) {
            return false;
          }
      } else {
        if(mpos.x < x || mpos.x > x + width
            || mpos.y > y || mpos.y < y - height) {
            return false;
          }
      }
      //deep check
      for(var i=0, l=dimArray.length, acum=(horz? x:y); i<l; i++) {
        var dimi = dimArray[i];
        if(horz) {
          acum += dimi;
          var intersec = acum;
          if(mpos.x <= intersec) {
            return {
              'name': node.getData('stringArray')[i],
              'color': node.getData('colorArray')[i],
              'value': node.getData('valueArray')[i],
              'label': node.name
            };
          }
        } else {
          acum -= dimi;
          var intersec = acum;
          if(mpos.y >= intersec) {
            return {
              'name': node.getData('stringArray')[i],
              'color': node.getData('colorArray')[i],
              'value': node.getData('valueArray')[i],
              'label': node.name
            };
          }
        }
      }
      return false;
    }
  },
  'barchart-grouped' : {
    'render' : function(node, canvas) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          dimArray = node.getData('dimArray'),
          valueArray = node.getData('valueArray'),
          valueLength = valueArray.length,
          colorArray = node.getData('colorArray'),
          colorLength = colorArray.length,
          stringArray = node.getData('stringArray'); 

      var ctx = canvas.getCtx(),
          opt = {},
          border = node.getData('border'),
          gradient = node.getData('gradient'),
          config = node.getData('config'),
          horz = config.orientation == 'horizontal',
          aggregates = config.showAggregates,
          showLabels = config.showLabels,
          label = config.Label,
          fixedDim = (horz? height : width) / valueLength;
      
      if (colorArray && dimArray && stringArray) {
        for (var i=0, l=valueLength, acum=0, valAcum=0; i<l; i++) {
          ctx.fillStyle = ctx.strokeStyle = colorArray[i % colorLength];
          if(gradient) {
            var linear;
            if(horz) {
              linear = ctx.createLinearGradient(x + dimArray[i]/2, y + fixedDim * i, 
                  x + dimArray[i]/2, y + fixedDim * (i + 1));
            } else {
              linear = ctx.createLinearGradient(x + fixedDim * i, y - dimArray[i]/2, 
                  x + fixedDim * (i + 1), y - dimArray[i]/2);
            }
            var color = $.rgbToHex($.map($.hexToRgb(colorArray[i % colorLength].slice(1)), 
                function(v) { return (v * 0.5) >> 0; }));
            linear.addColorStop(0, color);
            linear.addColorStop(0.5, colorArray[i % colorLength]);
            linear.addColorStop(1, color);
            ctx.fillStyle = linear;
          }
          if(horz) {
            ctx.fillRect(x, y + fixedDim * i, dimArray[i], fixedDim);
          } else {
            ctx.fillRect(x + fixedDim * i, y - dimArray[i], fixedDim, dimArray[i]);
          }
          if(border && border.name == stringArray[i]) {
            opt.acum = fixedDim * i;
            opt.dimValue = dimArray[i];
          }
          acum += (dimArray[i] || 0);
          valAcum += (valueArray[i] || 0);
        }
        if(border) {
          ctx.save();
          ctx.lineWidth = 2;
          ctx.strokeStyle = border.color;
          if(horz) {
            ctx.strokeRect(x + 1, y + opt.acum + 1, opt.dimValue -2, fixedDim - 2);
          } else {
            ctx.strokeRect(x + opt.acum + 1, y - opt.dimValue + 1, fixedDim -2, opt.dimValue -2);
          }
          ctx.restore();
        }
        if(label.type == 'Native') {
          ctx.save();
          ctx.fillStyle = ctx.strokeStyle = label.color;
          ctx.font = label.style + ' ' + label.size + 'px ' + label.family;
          ctx.textBaseline = 'middle';
          var aggValue = aggregates(node.name, valAcum, node);
          if(aggValue !== false) {
            aggValue = aggValue !== true? aggValue : valAcum;
            if(horz) {
              ctx.textAlign = 'right';
              ctx.fillText(aggValue, x + Math.max.apply(null, dimArray) - config.labelOffset, y + height/2);
            } else {
              ctx.textAlign = 'center';
              ctx.fillText(aggValue, x + width/2, y - Math.max.apply(null, dimArray) - label.size/2 - config.labelOffset);
            }
          }
          if(showLabels(node.name, valAcum, node)) {
            if(horz) {
              ctx.textAlign = 'center';
              ctx.translate(x - config.labelOffset - label.size/2, y + height/2);
              ctx.rotate(Math.PI / 2);
              ctx.fillText(node.name, 0, 0);
            } else {
              ctx.textAlign = 'center';
              ctx.fillText(node.name, x + width/2, y + label.size/2 + config.labelOffset);
            }
          }
          ctx.restore();
        }
      }
    },
    'contains': function(node, mpos) {
      var pos = node.pos.getc(true), 
          width = node.getData('width'),
          height = node.getData('height'),
          algnPos = this.getAlignedPos(pos, width, height),
          x = algnPos.x, y = algnPos.y,
          dimArray = node.getData('dimArray'),
          len = dimArray.length,
          config = node.getData('config'),
          rx = mpos.x - x,
          horz = config.orientation == 'horizontal',
          fixedDim = (horz? height : width) / len;
      //bounding box check
      if(horz) {
        if(mpos.x < x || mpos.x > x + width
            || mpos.y > y + height || mpos.y < y) {
            return false;
          }
      } else {
        if(mpos.x < x || mpos.x > x + width
            || mpos.y > y || mpos.y < y - height) {
            return false;
          }
      }
      //deep check
      for(var i=0, l=dimArray.length; i<l; i++) {
        var dimi = dimArray[i];
        if(horz) {
          var limit = y + fixedDim * i;
          if(mpos.x <= x+ dimi && mpos.y >= limit && mpos.y <= limit + fixedDim) {
            return {
              'name': node.getData('stringArray')[i],
              'color': node.getData('colorArray')[i],
              'value': node.getData('valueArray')[i],
              'label': node.name
            };
          }
        } else {
          var limit = x + fixedDim * i;
          if(mpos.x >= limit && mpos.x <= limit + fixedDim && mpos.y >= y - dimi) {
            return {
              'name': node.getData('stringArray')[i],
              'color': node.getData('colorArray')[i],
              'value': node.getData('valueArray')[i],
              'label': node.name
            };
          }
        }
      }
      return false;
    }
  }
});

/*
  Class: BarChart
  
  A visualization that displays stacked bar charts.
  
  Constructor Options:
  
  See <Options.BarChart>.

*/
$jit.BarChart = new Class({
  st: null,
  colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
  selected: {},
  busy: false,
  
  initialize: function(opt) {
    this.controller = this.config = 
      $.merge(Options("Canvas", "Margin", "Label", "BarChart"), {
        Label: { type: 'Native' }
      }, opt);
    //set functions for showLabels and showAggregates
    var showLabels = this.config.showLabels,
        typeLabels = $.type(showLabels),
        showAggregates = this.config.showAggregates,
        typeAggregates = $.type(showAggregates);
    this.config.showLabels = typeLabels == 'function'? showLabels : $.lambda(showLabels);
    this.config.showAggregates = typeAggregates == 'function'? showAggregates : $.lambda(showAggregates);
    
    this.initializeViz();
  },
  
  initializeViz: function() {
    var config = this.config, that = this;
    var nodeType = config.type.split(":")[0],
        horz = config.orientation == 'horizontal',
        nodeLabels = {};
    
    var delegate = new $jit.ST({
      injectInto: config.injectInto,
      width: config.width,
      height: config.height,
      orientation: horz? 'left' : 'bottom',
      levelDistance: 0,
      siblingOffset: config.barsOffset,
      subtreeOffset: 0,
      withLabels: config.Label.type != 'Native',      
      useCanvas: config.useCanvas,
      Label: {
        type: config.Label.type
      },
      Node: {
        overridable: true,
        type: 'barchart-' + nodeType,
        align: 'left',
        width: 1,
        height: 1
      },
      Edge: {
        type: 'none'
      },
      Tips: {
        enable: config.Tips.enable,
        type: 'Native',
        force: true,
        onShow: function(tip, node, contains) {
          var elem = contains;
          config.Tips.onShow(tip, elem, node);
        }
      },
      Events: {
        enable: true,
        type: 'Native',
        onClick: function(node, eventInfo, evt) {
          if(!config.Events.enable) return;
          var elem = eventInfo.getContains();
          config.Events.onClick(elem, eventInfo, evt);
        },
        onMouseMove: function(node, eventInfo, evt) {
          if(!config.hoveredColor) return;
          if(node) {
            var elem = eventInfo.getContains();
            that.select(node.id, elem.name, elem.index);
          } else {
            that.select(false, false, false);
          }
        }
      },
      onCreateLabel: function(domElement, node) {
        var labelConf = config.Label,
            valueArray = node.getData('valueArray'),
            acum = $.reduce(valueArray, function(x, y) { return x + y; }, 0);
        var nlbs = {
          wrapper: document.createElement('div'),
          aggregate: document.createElement('div'),
          label: document.createElement('div')
        };
        var wrapper = nlbs.wrapper,
            label = nlbs.label,
            aggregate = nlbs.aggregate,
            wrapperStyle = wrapper.style,
            labelStyle = label.style,
            aggregateStyle = aggregate.style;
        //store node labels
        nodeLabels[node.id] = nlbs;
        //append labels
        wrapper.appendChild(label);
        wrapper.appendChild(aggregate);
        if(!config.showLabels(node.name, acum, node)) {
          labelStyle.display = 'none';
        }
        if(!config.showAggregates(node.name, acum, node)) {
          aggregateStyle.display = 'none';
        }
        wrapperStyle.position = 'relative';
        wrapperStyle.overflow = 'visible';
        wrapperStyle.fontSize = labelConf.size + 'px';
        wrapperStyle.fontFamily = labelConf.family;
        wrapperStyle.color = labelConf.color;
        wrapperStyle.textAlign = 'center';
        aggregateStyle.position = labelStyle.position = 'absolute';
        
        domElement.style.width = node.getData('width') + 'px';
        domElement.style.height = node.getData('height') + 'px';
        aggregateStyle.left = labelStyle.left =  '0px';

        label.innerHTML = node.name;
        
        domElement.appendChild(wrapper);
      },
      onPlaceLabel: function(domElement, node) {
        if(!nodeLabels[node.id]) return;
        var labels = nodeLabels[node.id],
            wrapperStyle = labels.wrapper.style,
            labelStyle = labels.label.style,
            aggregateStyle = labels.aggregate.style,
            grouped = config.type.split(':')[0] == 'grouped',
            horz = config.orientation == 'horizontal',
            dimArray = node.getData('dimArray'),
            valArray = node.getData('valueArray'),
            width = (grouped && horz)? Math.max.apply(null, dimArray) : node.getData('width'),
            height = (grouped && !horz)? Math.max.apply(null, dimArray) : node.getData('height'),
            font = parseInt(wrapperStyle.fontSize, 10),
            domStyle = domElement.style;
            
        
        if(dimArray && valArray) {
          wrapperStyle.width = aggregateStyle.width = labelStyle.width = domElement.style.width = width + 'px';
          for(var i=0, l=valArray.length, acum=0; i<l; i++) {
            if(dimArray[i] > 0) {
              acum+= valArray[i];
            }
          }
          if(config.showLabels(node.name, acum, node)) {
            labelStyle.display = '';
          } else {
            labelStyle.display = 'none';
          }
          var aggValue = config.showAggregates(node.name, acum, node);
          if(aggValue !== false) {
            aggregateStyle.display = '';
          } else {
            aggregateStyle.display = 'none';
          }
          if(config.orientation == 'horizontal') {
            aggregateStyle.textAlign = 'right';
            labelStyle.textAlign = 'left';
            labelStyle.textIndex = aggregateStyle.textIndent = config.labelOffset + 'px';
            aggregateStyle.top = labelStyle.top = (height-font)/2 + 'px';
            domElement.style.height = wrapperStyle.height = height + 'px';
          } else {
            aggregateStyle.top = (-font - config.labelOffset) + 'px';
            labelStyle.top = (config.labelOffset + height) + 'px';
            domElement.style.top = parseInt(domElement.style.top, 10) - height + 'px';
            domElement.style.height = wrapperStyle.height = height + 'px';
          }
          labels.aggregate.innerHTML = aggValue !== true? aggValue : acum;
        }
      }
    });
    
    var size = delegate.canvas.getSize(),
        margin = config.Margin;
    if(horz) {
      delegate.config.offsetX = size.width/2 - margin.left
        - (config.showLabels && (config.labelOffset + config.Label.size));    
      delegate.config.offsetY = (margin.bottom - margin.top)/2;
    } else {
      delegate.config.offsetY = -size.height/2 + margin.bottom 
        + (config.showLabels && (config.labelOffset + config.Label.size));
      delegate.config.offsetX = (margin.right - margin.left)/2;
    }
    this.delegate = delegate;
    this.canvas = this.delegate.canvas;
  },
  
  /*
    Method: loadJSON
   
    Loads JSON data into the visualization. 
    
    Parameters:
    
    json - The JSON data format. This format is described in <http://blog.thejit.org/2010/04/24/new-javascript-infovis-toolkit-visualizations/#json-data-format>.
    
    Example:
    (start code js)
    var barChart = new $jit.BarChart(options);
    barChart.loadJSON(json);
    (end code)
 */  
  loadJSON: function(json) {
    if(this.busy) return;
    this.busy = true;
    
    var prefix = $.time(), 
        ch = [], 
        delegate = this.delegate,
        name = $.splat(json.label), 
        color = $.splat(json.color || this.colors),
        config = this.config,
        gradient = !!config.type.split(":")[1],
        animate = config.animate,
        horz = config.orientation == 'horizontal',
        that = this;
    
    for(var i=0, values=json.values, l=values.length; i<l; i++) {
      var val = values[i]
      var valArray = $.splat(values[i].values);
      var acum = 0;
      ch.push({
        'id': prefix + val.label,
        'name': val.label,
        'data': {
          'value': valArray,
          '$valueArray': valArray,
          '$colorArray': color,
          '$stringArray': name,
          '$gradient': gradient,
          '$config': config
        },
        'children': []
      });
    }
    var root = {
      'id': prefix + '$root',
      'name': '',
      'data': {
        '$type': 'none',
        '$width': 1,
        '$height': 1
      },
      'children': ch
    };
    delegate.loadJSON(root);
    
    this.normalizeDims();
    delegate.compute();
    delegate.select(delegate.root);
    if(animate) {
      if(horz) {
        delegate.fx.animate({
          modes: ['node-property:width:dimArray'],
          duration:1500,
          onComplete: function() {
            that.busy = false;
          }
        });
      } else {
        delegate.fx.animate({
          modes: ['node-property:height:dimArray'],
          duration:1500,
          onComplete: function() {
            that.busy = false;
          }
        });
      }
    } else {
      this.busy = false;
    }
  },
  
  /*
    Method: updateJSON
   
    Use this method when updating values for the current JSON data. If the items specified by the JSON data already exist in the graph then their values will be updated.
    
    Parameters:
    
    json - (object) JSON data to be updated. The JSON format corresponds to the one described in <BarChart.loadJSON>.
    onComplete - (object) A callback object to be called when the animation transition when updating the data end.
    
    Example:
    
    (start code js)
    barChart.updateJSON(json, {
      onComplete: function() {
        alert('update complete!');
      }
    });
    (end code)
 */  
  updateJSON: function(json, onComplete) {
    if(this.busy) return;
    this.busy = true;
    this.select(false, false, false);
    var delegate = this.delegate;
    var graph = delegate.graph;
    var values = json.values;
    var animate = this.config.animate;
    var that = this;
    var horz = this.config.orientation == 'horizontal';
    $.each(values, function(v) {
      var n = graph.getByName(v.label);
      if(n) {
        n.setData('valueArray', $.splat(v.values));
        if(json.label) {
          n.setData('stringArray', $.splat(json.label));
        }
      }
    });
    this.normalizeDims();
    delegate.compute();
    delegate.select(delegate.root);
    if(animate) {
      if(horz) {
        delegate.fx.animate({
          modes: ['node-property:width:dimArray'],
          duration:1500,
          onComplete: function() {
            that.busy = false;
            onComplete && onComplete.onComplete();
          }
        });
      } else {
        delegate.fx.animate({
          modes: ['node-property:height:dimArray'],
          duration:1500,
          onComplete: function() {
            that.busy = false;
            onComplete && onComplete.onComplete();
          }
        });
      }
    }
  },
  
  //adds the little brown bar when hovering the node
  select: function(id, name) {
    if(!this.config.hoveredColor) return;
    var s = this.selected;
    if(s.id != id || s.name != name) {
      s.id = id;
      s.name = name;
      s.color = this.config.hoveredColor;
      this.delegate.graph.eachNode(function(n) {
        if(id == n.id) {
          n.setData('border', s);
        } else {
          n.setData('border', false);
        }
      });
      this.delegate.plot();
    }
  },
  
  /*
    Method: getLegend
   
    Returns an object containing as keys the legend names and as values hex strings with color values.
    
    Example:
    
    (start code js)
    var legend = barChart.getLegend();
    (end code)
  */  
  getLegend: function() {
    var legend = {};
    var n;
    this.delegate.graph.getNode(this.delegate.root).eachAdjacency(function(adj) {
      n = adj.nodeTo;
    });
    var colors = n.getData('colorArray'),
        len = colors.length;
    $.each(n.getData('stringArray'), function(s, i) {
      legend[s] = colors[i % len];
    });
    return legend;
  },
  
  /*
    Method: getMaxValue
   
    Returns the maximum accumulated value for the stacks. This method is used for normalizing the graph heights according to the canvas height.
    
    Example:
    
    (start code js)
    var ans = barChart.getMaxValue();
    (end code)
    
    In some cases it could be useful to override this method to normalize heights for a group of BarCharts, like when doing small multiples.
    
    Example:
    
    (start code js)
    //will return 100 for all BarChart instances,
    //displaying all of them with the same scale
    $jit.BarChart.implement({
      'getMaxValue': function() {
        return 100;
      }
    });
    (end code)
    
  */  
  getMaxValue: function() {
    var maxValue = 0, stacked = this.config.type.split(':')[0] == 'stacked';
    this.delegate.graph.eachNode(function(n) {
      var valArray = n.getData('valueArray'),
          acum = 0;
      if(!valArray) return;
      if(stacked) {
        $.each(valArray, function(v) { 
          acum += +v;
        });
      } else {
        acum = Math.max.apply(null, valArray);
      }
      maxValue = maxValue>acum? maxValue:acum;
    });
    return maxValue;
  },
  
  setBarType: function(type) {
    this.config.type = type;
    this.delegate.config.Node.type = 'barchart-' + type.split(':')[0];
  },
  
  normalizeDims: function() {
    //number of elements
    var root = this.delegate.graph.getNode(this.delegate.root), l=0;
    root.eachAdjacency(function() {
      l++;
    });
    var maxValue = this.getMaxValue() || 1,
        size = this.delegate.canvas.getSize(),
        config = this.config,
        margin = config.Margin,
        marginWidth = margin.left + margin.right,
        marginHeight = margin.top + margin.bottom,
        horz = config.orientation == 'horizontal',
        fixedDim = (size[horz? 'height':'width'] - (horz? marginHeight:marginWidth) - (l -1) * config.barsOffset) / l,
        animate = config.animate,
        height = size[horz? 'width':'height'] - (horz? marginWidth:marginHeight) 
          - (!horz && config.showAggregates && (config.Label.size + config.labelOffset))
          - (config.showLabels && (config.Label.size + config.labelOffset)),
        dim1 = horz? 'height':'width',
        dim2 = horz? 'width':'height';
    this.delegate.graph.eachNode(function(n) {
      var acum = 0, animateValue = [];
      $.each(n.getData('valueArray'), function(v) {
        acum += +v;
        animateValue.push(0);
      });
      n.setData(dim1, fixedDim);
      if(animate) {
        n.setData(dim2, acum * height / maxValue, 'end');
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return n * height / maxValue; 
        }), 'end');
        var dimArray = n.getData('dimArray');
        if(!dimArray) {
          n.setData('dimArray', animateValue);
        }
      } else {
        n.setData(dim2, acum * height / maxValue);
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return n * height / maxValue; 
        }));
      }
    });
  }
});


/*
 * File: Options.PieChart.js
 *
*/
/*
  Object: Options.PieChart
  
  <PieChart> options. 
  Other options included in the PieChart are <Options.Canvas>, <Options.Label>, <Options.Tips> and <Options.Events>.
  
  Syntax:
  
  (start code js)

  Options.PieChart = {
    animate: true,
    offset: 25,
    sliceOffset:0,
    labelOffset: 3,
    type: 'stacked',
    hoveredColor: '#9fd4ff',
    showLabels: true,
    resizeLabels: false,
    updateHeights: false
  };  

  (end code)
  
  Example:
  
  (start code js)

  var pie = new $jit.PieChart({
    animate: true,
    sliceOffset: 5,
    type: 'stacked:gradient'
  });  

  (end code)
  
  Parameters:
  
  animate - (boolean) Default's *true*. Whether to add animated transitions when plotting/updating the visualization.
  offset - (number) Default's *25*. Adds margin between the visualization and the canvas.
  sliceOffset - (number) Default's *0*. Separation between the center of the canvas and each pie slice.
  labelOffset - (number) Default's *3*. Adds margin between the label and the default place where it should be drawn.
  type - (string) Default's *'stacked'*. Stack style. Posible values are 'stacked', 'stacked:gradient' to add gradients.
  hoveredColor - (boolean|string) Default's *'#9fd4ff'*. Sets the selected color for a hovered pie stack.
  showLabels - (boolean) Default's *true*. Display the name of the slots.
  resizeLabels - (boolean|number) Default's *false*. Resize the pie labels according to their stacked values. Set a number for *resizeLabels* to set a font size minimum.
  updateHeights - (boolean) Default's *false*. Only for mono-valued (most common) pie charts. Resize the height of the pie slices according to their current values.

*/
Options.PieChart = {
  $extend: true,

  animate: true,
  offset: 25, // page offset
  sliceOffset:0,
  labelOffset: 3, // label offset
  type: 'stacked', // gradient
  hoveredColor: '#9fd4ff',
  Events: {
    enable: false,
    onClick: $.empty
  },
  Tips: {
    enable: false,
    onShow: $.empty,
    onHide: $.empty
  },
  showLabels: true,
  resizeLabels: false,
  
  //only valid for mono-valued datasets
  updateHeights: false
};

/*
 * Class: Layouts.Radial
 * 
 * Implements a Radial Layout.
 * 
 * Implemented By:
 * 
 * <RGraph>, <Hypertree>
 * 
 */
Layouts.Radial = new Class({

  /*
   * Method: compute
   * 
   * Computes nodes' positions.
   * 
   * Parameters:
   * 
   * property - _optional_ A <Graph.Node> position property to store the new
   * positions. Possible values are 'pos', 'end' or 'start'.
   * 
   */
  compute : function(property) {
    var prop = $.splat(property || [ 'current', 'start', 'end' ]);
    NodeDim.compute(this.graph, prop, this.config);
    this.graph.computeLevels(this.root, 0, "ignore");
    var lengthFunc = this.createLevelDistanceFunc(); 
    this.computeAngularWidths(prop);
    this.computePositions(prop, lengthFunc);
  },

  /*
   * computePositions
   * 
   * Performs the main algorithm for computing node positions.
   */
  computePositions : function(property, getLength) {
    var propArray = property;
    var graph = this.graph;
    var root = graph.getNode(this.root);
    var parent = this.parent;
    var config = this.config;

    for ( var i=0, l=propArray.length; i < l; i++) {
      var pi = propArray[i];
      root.setPos($P(0, 0), pi);
      root.setData('span', Math.PI * 2, pi);
    }

    root.angleSpan = {
      begin : 0,
      end : 2 * Math.PI
    };

    graph.eachBFS(this.root, function(elem) {
      var angleSpan = elem.angleSpan.end - elem.angleSpan.begin;
      var angleInit = elem.angleSpan.begin;
      var len = getLength(elem);
      //Calculate the sum of all angular widths
      var totalAngularWidths = 0, subnodes = [], maxDim = {};
      elem.eachSubnode(function(sib) {
        totalAngularWidths += sib._treeAngularWidth;
        //get max dim
        for ( var i=0, l=propArray.length; i < l; i++) {
          var pi = propArray[i], dim = sib.getData('dim', pi);
          maxDim[pi] = (pi in maxDim)? (dim > maxDim[pi]? dim : maxDim[pi]) : dim;
        }
        subnodes.push(sib);
      }, "ignore");
      //Maintain children order
      //Second constraint for <http://bailando.sims.berkeley.edu/papers/infovis01.htm>
      if (parent && parent.id == elem.id && subnodes.length > 0
          && subnodes[0].dist) {
        subnodes.sort(function(a, b) {
          return (a.dist >= b.dist) - (a.dist <= b.dist);
        });
      }
      //Calculate nodes positions.
      for (var k = 0, ls=subnodes.length; k < ls; k++) {
        var child = subnodes[k];
        if (!child._flag) {
          var angleProportion = child._treeAngularWidth / totalAngularWidths * angleSpan;
          var theta = angleInit + angleProportion / 2;

          for ( var i=0, l=propArray.length; i < l; i++) {
            var pi = propArray[i];
            child.setPos($P(theta, len), pi);
            child.setData('span', angleProportion, pi);
            child.setData('dim-quotient', child.getData('dim', pi) / maxDim[pi], pi);
          }

          child.angleSpan = {
            begin : angleInit,
            end : angleInit + angleProportion
          };
          angleInit += angleProportion;
        }
      }
    }, "ignore");
  },

  /*
   * Method: setAngularWidthForNodes
   * 
   * Sets nodes angular widths.
   */
  setAngularWidthForNodes : function(prop) {
    this.graph.eachBFS(this.root, function(elem, i) {
      var diamValue = elem.getData('angularWidth', prop[0]) || 5;
      elem._angularWidth = diamValue / i;
    }, "ignore");
  },

  /*
   * Method: setSubtreesAngularWidth
   * 
   * Sets subtrees angular widths.
   */
  setSubtreesAngularWidth : function() {
    var that = this;
    this.graph.eachNode(function(elem) {
      that.setSubtreeAngularWidth(elem);
    }, "ignore");
  },

  /*
   * Method: setSubtreeAngularWidth
   * 
   * Sets the angular width for a subtree.
   */
  setSubtreeAngularWidth : function(elem) {
    var that = this, nodeAW = elem._angularWidth, sumAW = 0;
    elem.eachSubnode(function(child) {
      that.setSubtreeAngularWidth(child);
      sumAW += child._treeAngularWidth;
    }, "ignore");
    elem._treeAngularWidth = Math.max(nodeAW, sumAW);
  },

  /*
   * Method: computeAngularWidths
   * 
   * Computes nodes and subtrees angular widths.
   */
  computeAngularWidths : function(prop) {
    this.setAngularWidthForNodes(prop);
    this.setSubtreesAngularWidth();
  }

});


/*
 * File: Sunburst.js
 */

/*
   Class: Sunburst
      
   A radial space filling tree visualization.
   
   Inspired by:
 
   Sunburst <http://www.cc.gatech.edu/gvu/ii/sunburst/>.
   
   Note:
   
   This visualization was built and engineered from scratch, taking only the paper as inspiration, and only shares some features with the visualization described in the paper.
   
  Implements:
  
  All <Loader> methods
  
   Constructor Options:
   
   Inherits options from
   
   - <Options.Canvas>
   - <Options.Controller>
   - <Options.Node>
   - <Options.Edge>
   - <Options.Label>
   - <Options.Events>
   - <Options.Tips>
   - <Options.NodeStyles>
   - <Options.Navigation>
   
   Additionally, there are other parameters and some default values changed
   
   interpolation - (string) Default's *linear*. Describes the way nodes are interpolated. Possible values are 'linear' and 'polar'.
   levelDistance - (number) Default's *100*. The distance between levels of the tree. 
   Node.type - Described in <Options.Node>. Default's to *multipie*.
   Node.height - Described in <Options.Node>. Default's *0*.
   Edge.type - Described in <Options.Edge>. Default's *none*.
   Label.textAlign - Described in <Options.Label>. Default's *start*.
   Label.textBaseline - Described in <Options.Label>. Default's *middle*.
     
   Instance Properties:

   canvas - Access a <Canvas> instance.
   graph - Access a <Graph> instance.
   op - Access a <Sunburst.Op> instance.
   fx - Access a <Sunburst.Plot> instance.
   labels - Access a <Sunburst.Label> interface implementation.   

*/

$jit.Sunburst = new Class({

  Implements: [ Loader, Extras, Layouts.Radial ],

  initialize: function(controller) {
    var $Sunburst = $jit.Sunburst;

    var config = {
      interpolation: 'linear',
      levelDistance: 100,
      Node: {
        'type': 'multipie',
        'height':0
      },
      Edge: {
        'type': 'none'
      },
      Label: {
        textAlign: 'start',
        textBaseline: 'middle'
      }
    };

    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), config, controller);

    var canvasConfig = this.config;
    if(canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Polar,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new $Sunburst.Label[canvasConfig.Label.type](this);
    this.fx = new $Sunburst.Plot(this, $Sunburst);
    this.op = new $Sunburst.Op(this);
    this.json = null;
    this.root = null;
    this.rotated = null;
    this.busy = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
  
    createLevelDistanceFunc 
  
    Returns the levelDistance function used for calculating a node distance 
    to its origin. This function returns a function that is computed 
    per level and not per node, such that all nodes with the same depth will have the 
    same distance to the origin. The resulting function gets the 
    parent node as parameter and returns a float.

   */
  createLevelDistanceFunc: function() {
    var ld = this.config.levelDistance;
    return function(elem) {
      return (elem._depth + 1) * ld;
    };
  },

  /* 
     Method: refresh 
     
     Computes positions and plots the tree.

   */
  refresh: function() {
    this.compute();
    this.plot();
  },

  /*
   reposition
  
   An alias for computing new positions to _endPos_

   See also:

   <Sunburst.compute>
   
  */
  reposition: function() {
    this.compute('end');
  },

  /*
  Method: rotate
  
  Rotates the graph so that the selected node is horizontal on the right.

  Parameters:
  
  node - (object) A <Graph.Node>.
  method - (string) Whether to perform an animation or just replot the graph. Possible values are "replot" or "animate".
  opt - (object) Configuration options merged with this visualization configuration options.
  
  See also:

  <Sunburst.rotateAngle>
  
  */
  rotate: function(node, method, opt) {
    var theta = node.getPos(opt.property || 'current').getp(true).theta;
    this.rotated = node;
    this.rotateAngle(-theta, method, opt);
  },

  /*
  Method: rotateAngle
  
  Rotates the graph of an angle theta.
  
   Parameters:
   
   node - (object) A <Graph.Node>.
   method - (string) Whether to perform an animation or just replot the graph. Possible values are "replot" or "animate".
   opt - (object) Configuration options merged with this visualization configuration options.
   
   See also:

   <Sunburst.rotate>
  
  */
  rotateAngle: function(theta, method, opt) {
    var that = this;
    var options = $.merge(this.config, opt || {}, {
      modes: [ 'polar' ]
    });
    var prop = opt.property || (method === "animate" ? 'end' : 'current');
    if(method === 'animate') {
      this.fx.animation.pause();
    }
    this.graph.eachNode(function(n) {
      var p = n.getPos(prop);
      p.theta += theta;
      if (p.theta < 0) {
        p.theta += Math.PI * 2;
      }
    });
    if (method == 'animate') {
      this.fx.animate(options);
    } else if (method == 'replot') {
      this.fx.plot();
      this.busy = false;
    }
  },

  /*
   Method: plot
  
   Plots the Sunburst. This is a shortcut to *fx.plot*.
  */
  plot: function() {
    this.fx.plot();
  }
});

$jit.Sunburst.$extend = true;

(function(Sunburst) {

  /*
     Class: Sunburst.Op

     Custom extension of <Graph.Op>.

     Extends:

     All <Graph.Op> methods
     
     See also:
     
     <Graph.Op>

  */
  Sunburst.Op = new Class( {

    Implements: Graph.Op

  });

  /*
     Class: Sunburst.Plot

    Custom extension of <Graph.Plot>.
  
    Extends:
  
    All <Graph.Plot> methods
    
    See also:
    
    <Graph.Plot>
  
  */
  Sunburst.Plot = new Class( {

    Implements: Graph.Plot

  });

  /*
    Class: Sunburst.Label

    Custom extension of <Graph.Label>. 
    Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.
  
    Extends:
  
    All <Graph.Label> methods and subclasses.
  
    See also:
  
    <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
   */
  Sunburst.Label = {};

  /*
     Sunburst.Label.Native

     Custom extension of <Graph.Label.Native>.

     Extends:

     All <Graph.Label.Native> methods

     See also:

     <Graph.Label.Native>
  */
  Sunburst.Label.Native = new Class( {
    Implements: Graph.Label.Native,

    initialize: function(viz) {
      this.viz = viz;
      this.label = viz.config.Label;
      this.config = viz.config;
    },

    renderLabel: function(canvas, node, controller) {
      var span = node.getData('span');
      if(span < Math.PI /2 && Math.tan(span) * 
          this.config.levelDistance * node._depth < 10) {
        return;
      }
      var ctx = canvas.getCtx();
      var measure = ctx.measureText(node.name);
      if (node.id == this.viz.root) {
        var x = -measure.width / 2, y = 0, thetap = 0;
        var ld = 0;
      } else {
        var indent = 5;
        var ld = controller.levelDistance - indent;
        var clone = node.pos.clone();
        clone.rho += indent;
        var p = clone.getp(true);
        var ct = clone.getc(true);
        var x = ct.x, y = ct.y;
        // get angle in degrees
        var pi = Math.PI;
        var cond = (p.theta > pi / 2 && p.theta < 3 * pi / 2);
        var thetap = cond ? p.theta + pi : p.theta;
        if (cond) {
          x -= Math.abs(Math.cos(p.theta) * measure.width);
          y += Math.sin(p.theta) * measure.width;
        } else if (node.id == this.viz.root) {
          x -= measure.width / 2;
        }
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(thetap);
      ctx.fillText(node.name, 0, 0);
      ctx.restore();
    }
  });

  /*
     Sunburst.Label.SVG

    Custom extension of <Graph.Label.SVG>.
  
    Extends:
  
    All <Graph.Label.SVG> methods
  
    See also:
  
    <Graph.Label.SVG>
  
  */
  Sunburst.Label.SVG = new Class( {
    Implements: Graph.Label.SVG,

    initialize: function(viz) {
      this.viz = viz;
    },

    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.getc(true), viz = this.viz, canvas = this.viz.canvas;
      var radius = canvas.getSize();
      var labelPos = {
        x: Math.round(pos.x + radius.width / 2),
        y: Math.round(pos.y + radius.height / 2)
      };
      tag.setAttribute('x', labelPos.x);
      tag.setAttribute('y', labelPos.y);

      var bb = tag.getBBox();
      if (bb) {
        // center the label
    var x = tag.getAttribute('x');
    var y = tag.getAttribute('y');
    // get polar coordinates
    var p = node.pos.getp(true);
    // get angle in degrees
    var pi = Math.PI;
    var cond = (p.theta > pi / 2 && p.theta < 3 * pi / 2);
    if (cond) {
      tag.setAttribute('x', x - bb.width);
      tag.setAttribute('y', y - bb.height);
    } else if (node.id == viz.root) {
      tag.setAttribute('x', x - bb.width / 2);
    }

    var thetap = cond ? p.theta + pi : p.theta;
    if(node._depth)
      tag.setAttribute('transform', 'rotate(' + thetap * 360 / (2 * pi) + ' ' + x
          + ' ' + y + ')');
  }

  controller.onPlaceLabel(tag, node);
}
  });

  /*
     Sunburst.Label.HTML

     Custom extension of <Graph.Label.HTML>.

     Extends:

     All <Graph.Label.HTML> methods.

     See also:

     <Graph.Label.HTML>

  */
  Sunburst.Label.HTML = new Class( {
    Implements: Graph.Label.HTML,

    initialize: function(viz) {
      this.viz = viz;
    },
    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.clone(), 
          canvas = this.viz.canvas,
          height = node.getData('height'),
          ldist = ((height || node._depth == 0)? height : this.viz.config.levelDistance) /2,
          radius = canvas.getSize();
      pos.rho += ldist;
      pos = pos.getc(true);
      
      var labelPos = {
        x: Math.round(pos.x + radius.width / 2),
        y: Math.round(pos.y + radius.height / 2)
      };

      var style = tag.style;
      style.left = labelPos.x + 'px';
      style.top = labelPos.y + 'px';
      style.display = this.fitsInCanvas(labelPos, canvas) ? '' : 'none';

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
    Class: Sunburst.Plot.NodeTypes

    This class contains a list of <Graph.Node> built-in types. 
    Node types implemented are 'none', 'pie', 'multipie', 'gradient-pie' and 'gradient-multipie'.

    You can add your custom node types, customizing your visualization to the extreme.

    Example:

    (start code js)
      Sunburst.Plot.NodeTypes.implement({
        'mySpecialType': {
          'render': function(node, canvas) {
            //print your custom node to canvas
          },
          //optional
          'contains': function(node, pos) {
            //return true if pos is inside the node or false otherwise
          }
        }
      });
    (end code)

  */
  Sunburst.Plot.NodeTypes = new Class( {
    'none': {
      'render': $.empty,
      'contains': $.lambda(false),
      'anglecontains': function(node, pos) {
        var span = node.getData('span') / 2, theta = node.pos.theta;
        var begin = theta - span, end = theta + span;
        if (begin < 0)
          begin += Math.PI * 2;
        var atan = Math.atan2(pos.y, pos.x);
        if (atan < 0)
          atan += Math.PI * 2;
        if (begin > end) {
          return (atan > begin && atan <= Math.PI * 2) || atan < end;
        } else {
          return atan > begin && atan < end;
        }
      }
    },

    'pie': {
      'render': function(node, canvas) {
        var span = node.getData('span') / 2, theta = node.pos.theta;
        var begin = theta - span, end = theta + span;
        var polarNode = node.pos.getp(true);
        var polar = new Polar(polarNode.rho, begin);
        var p1coord = polar.getc(true);
        polar.theta = end;
        var p2coord = polar.getc(true);

        var ctx = canvas.getCtx();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p1coord.x, p1coord.y);
        ctx.moveTo(0, 0);
        ctx.lineTo(p2coord.x, p2coord.y);
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, polarNode.rho * node.getData('dim-quotient'), begin, end,
            false);
        ctx.fill();
      },
      'contains': function(node, pos) {
        if (this.nodeTypes['none'].anglecontains.call(this, node, pos)) {
          var rho = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
          var ld = this.config.levelDistance, d = node._depth;
          return (rho <= ld * d);
        }
        return false;
      }
    },
    'multipie': {
      'render': function(node, canvas) {
        var height = node.getData('height');
        var ldist = height? height : this.config.levelDistance;
        var span = node.getData('span') / 2, theta = node.pos.theta;
        var begin = theta - span, end = theta + span;
        var polarNode = node.pos.getp(true);

        var polar = new Polar(polarNode.rho, begin);
        var p1coord = polar.getc(true);

        polar.theta = end;
        var p2coord = polar.getc(true);

        polar.rho += ldist;
        var p3coord = polar.getc(true);

        polar.theta = begin;
        var p4coord = polar.getc(true);

        var ctx = canvas.getCtx();
        ctx.moveTo(0, 0);
        ctx.beginPath();
        ctx.arc(0, 0, polarNode.rho, begin, end, false);
        ctx.arc(0, 0, polarNode.rho + ldist, end, begin, true);
        ctx.moveTo(p1coord.x, p1coord.y);
        ctx.lineTo(p4coord.x, p4coord.y);
        ctx.moveTo(p2coord.x, p2coord.y);
        ctx.lineTo(p3coord.x, p3coord.y);
        ctx.fill();

        if (node.collapsed) {
          ctx.save();
          ctx.lineWidth = 2;
          ctx.moveTo(0, 0);
          ctx.beginPath();
          ctx.arc(0, 0, polarNode.rho + ldist + 5, end - 0.01, begin + 0.01,
              true);
          ctx.stroke();
          ctx.restore();
        }
      },
      'contains': function(node, pos) {
        if (this.nodeTypes['none'].anglecontains.call(this, node, pos)) {
          var rho = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
          var height = node.getData('height');
          var ldist = height? height : this.config.levelDistance;
          var ld = this.config.levelDistance, d = node._depth;
          return (rho >= ld * d) && (rho <= (ld * d + ldist));
        }
        return false;
      }
    },

    'gradient-multipie': {
      'render': function(node, canvas) {
        var ctx = canvas.getCtx();
        var height = node.getData('height');
        var ldist = height? height : this.config.levelDistance;
        var radialGradient = ctx.createRadialGradient(0, 0, node.getPos().rho,
            0, 0, node.getPos().rho + ldist);

        var colorArray = $.hexToRgb(node.getData('color')), ans = [];
        $.each(colorArray, function(i) {
          ans.push(parseInt(i * 0.5, 10));
        });
        var endColor = $.rgbToHex(ans);
        radialGradient.addColorStop(0, endColor);
        radialGradient.addColorStop(1, node.getData('color'));
        ctx.fillStyle = radialGradient;
        this.nodeTypes['multipie'].render.call(this, node, canvas);
      },
      'contains': function(node, pos) {
        return this.nodeTypes['multipie'].contains.call(this, node, pos);
      }
    },

    'gradient-pie': {
      'render': function(node, canvas) {
        var ctx = canvas.getCtx();
        var radialGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, node
            .getPos().rho);

        var colorArray = $.hexToRgb(node.getData('color')), ans = [];
        $.each(colorArray, function(i) {
          ans.push(parseInt(i * 0.5, 10));
        });
        var endColor = $.rgbToHex(ans);
        radialGradient.addColorStop(1, endColor);
        radialGradient.addColorStop(0, node.getData('color'));
        ctx.fillStyle = radialGradient;
        this.nodeTypes['pie'].render.call(this, node, canvas);
      },
      'contains': function(node, pos) {
        return this.nodeTypes['pie'].contains.call(this, node, pos);
      }
    }
  });

  /*
    Class: Sunburst.Plot.EdgeTypes

    This class contains a list of <Graph.Adjacence> built-in types. 
    Edge types implemented are 'none', 'line' and 'arrow'.
  
    You can add your custom edge types, customizing your visualization to the extreme.
  
    Example:
  
    (start code js)
      Sunburst.Plot.EdgeTypes.implement({
        'mySpecialType': {
          'render': function(adj, canvas) {
            //print your custom edge to canvas
          },
          //optional
          'contains': function(adj, pos) {
            //return true if pos is inside the arc or false otherwise
          }
        }
      });
    (end code)
  
  */
  Sunburst.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'line': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        this.edgeHelper.line.render(from, to, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.line.contains(from, to, pos, this.edge.epsilon);
      }
    },
    'arrow': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            dim = adj.getData('dim'),
            direction = adj.data.$direction,
            inv = (direction && direction.length>1 && direction[0] != adj.nodeFrom.id);
        this.edgeHelper.arrow.render(from, to, dim, inv, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.arrow.contains(from, to, pos, this.edge.epsilon);
      }
    },
    'hyperline': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(),
            to = adj.nodeTo.pos.getc(),
            dim = Math.max(from.norm(), to.norm());
        this.edgeHelper.hyperline.render(from.$scale(1/dim), to.$scale(1/dim), dim, canvas);
      },
      'contains': $.lambda(false) //TODO(nico): Implement this!
    }
  });

})($jit.Sunburst);


/*
 * File: PieChart.js
 *
*/

$jit.Sunburst.Plot.NodeTypes.implement({
  'piechart-stacked' : {
    'render' : function(node, canvas) {
      var pos = node.pos.getp(true),
          dimArray = node.getData('dimArray'),
          valueArray = node.getData('valueArray'),
          colorArray = node.getData('colorArray'),
          colorLength = colorArray.length,
          stringArray = node.getData('stringArray'),
          span = node.getData('span') / 2,
          theta = node.pos.theta,
          begin = theta - span,
          end = theta + span,
          polar = new Polar;
    
      var ctx = canvas.getCtx(), 
          opt = {},
          gradient = node.getData('gradient'),
          border = node.getData('border'),
          config = node.getData('config'),
          showLabels = config.showLabels,
          resizeLabels = config.resizeLabels,
          label = config.Label;

      var xpos = config.sliceOffset * Math.cos((begin + end) /2);
      var ypos = config.sliceOffset * Math.sin((begin + end) /2);

      if (colorArray && dimArray && stringArray) {
        for (var i=0, l=dimArray.length, acum=0, valAcum=0; i<l; i++) {
          var dimi = dimArray[i], colori = colorArray[i % colorLength];
          if(dimi <= 0) continue;
          ctx.fillStyle = ctx.strokeStyle = colori;
          if(gradient && dimi) {
            var radialGradient = ctx.createRadialGradient(xpos, ypos, acum + config.sliceOffset,
                xpos, ypos, acum + dimi + config.sliceOffset);
            var colorRgb = $.hexToRgb(colori), 
                ans = $.map(colorRgb, function(i) { return (i * 0.8) >> 0; }),
                endColor = $.rgbToHex(ans);

            radialGradient.addColorStop(0, colori);
            radialGradient.addColorStop(0.5, colori);
            radialGradient.addColorStop(1, endColor);
            ctx.fillStyle = radialGradient;
          }
          
          polar.rho = acum + config.sliceOffset;
          polar.theta = begin;
          var p1coord = polar.getc(true);
          polar.theta = end;
          var p2coord = polar.getc(true);
          polar.rho += dimi;
          var p3coord = polar.getc(true);
          polar.theta = begin;
          var p4coord = polar.getc(true);

          ctx.beginPath();
          //fixing FF arc method + fill
          ctx.arc(xpos, ypos, acum + .01, begin, end, false);
          ctx.arc(xpos, ypos, acum + dimi + .01, end, begin, true);
          ctx.fill();
          if(border && border.name == stringArray[i]) {
            opt.acum = acum;
            opt.dimValue = dimArray[i];
            opt.begin = begin;
            opt.end = end;
          }
          acum += (dimi || 0);
          valAcum += (valueArray[i] || 0);
        }
        if(border) {
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = 2;
          ctx.strokeStyle = border.color;
          var s = begin < end? 1 : -1;
          ctx.beginPath();
          //fixing FF arc method + fill
          ctx.arc(xpos, ypos, opt.acum + .01 + 1, opt.begin, opt.end, false);
          ctx.arc(xpos, ypos, opt.acum + opt.dimValue + .01 - 1, opt.end, opt.begin, true);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        if(showLabels && label.type == 'Native') {
          ctx.save();
          ctx.fillStyle = ctx.strokeStyle = label.color;
          var scale = resizeLabels? node.getData('normalizedDim') : 1,
              fontSize = (label.size * scale) >> 0;
          fontSize = fontSize < +resizeLabels? +resizeLabels : fontSize;
          
          ctx.font = label.style + ' ' + fontSize + 'px ' + label.family;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          
          polar.rho = acum + config.labelOffset + config.sliceOffset;
          polar.theta = node.pos.theta;
          var cart = polar.getc(true);
          
          ctx.fillText(node.name, cart.x, cart.y);
          ctx.restore();
        }
      }
    },
    'contains': function(node, pos) {
      if (this.nodeTypes['none'].anglecontains.call(this, node, pos)) {
        var rho = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        var ld = this.config.levelDistance, d = node._depth;
        var config = node.getData('config');
        if(rho <=ld * d + config.sliceOffset) {
          var dimArray = node.getData('dimArray');
          for(var i=0,l=dimArray.length,acum=config.sliceOffset; i<l; i++) {
            var dimi = dimArray[i];
            if(rho >= acum && rho <= acum + dimi) {
              return {
                name: node.getData('stringArray')[i],
                color: node.getData('colorArray')[i],
                value: node.getData('valueArray')[i],
                label: node.name
              };
            }
            acum += dimi;
          }
        }
        return false;
        
      }
      return false;
    }
  }
});

/*
  Class: PieChart
  
  A visualization that displays stacked bar charts.
  
  Constructor Options:
  
  See <Options.PieChart>.

*/
$jit.PieChart = new Class({
  sb: null,
  colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
  selected: {},
  busy: false,
  
  initialize: function(opt) {
    this.controller = this.config = 
      $.merge(Options("Canvas", "PieChart", "Label"), {
        Label: { type: 'Native' }
      }, opt);
    this.initializeViz();
  },
  
  initializeViz: function() {
    var config = this.config, that = this;
    var nodeType = config.type.split(":")[0];
    var delegate = new $jit.Sunburst({
      injectInto: config.injectInto,
      width: config.width,
      height: config.height,
      useCanvas: config.useCanvas,
      withLabels: config.Label.type != 'Native',
      Label: {
        type: config.Label.type
      },
      Node: {
        overridable: true,
        type: 'piechart-' + nodeType,
        width: 1,
        height: 1
      },
      Edge: {
        type: 'none'
      },
      Tips: {
        enable: config.Tips.enable,
        type: 'Native',
        force: true,
        onShow: function(tip, node, contains) {
          var elem = contains;
          config.Tips.onShow(tip, elem, node);
        }
      },
      Events: {
        enable: true,
        type: 'Native',
        onClick: function(node, eventInfo, evt) {
          if(!config.Events.enable) return;
          var elem = eventInfo.getContains();
          config.Events.onClick(elem, eventInfo, evt);
        },
        onMouseMove: function(node, eventInfo, evt) {
          if(!config.hoveredColor) return;
          if(node) {
            var elem = eventInfo.getContains();
            that.select(node.id, elem.name, elem.index);
          } else {
            that.select(false, false, false);
          }
        }
      },
      onCreateLabel: function(domElement, node) {
        var labelConf = config.Label;
        if(config.showLabels) {
          var style = domElement.style;
          style.fontSize = labelConf.size + 'px';
          style.fontFamily = labelConf.family;
          style.color = labelConf.color;
          style.textAlign = 'center';
          domElement.innerHTML = node.name;
        }
      },
      onPlaceLabel: function(domElement, node) {
        if(!config.showLabels) return;
        var pos = node.pos.getp(true),
            dimArray = node.getData('dimArray'),
            span = node.getData('span') / 2,
            theta = node.pos.theta,
            begin = theta - span,
            end = theta + span,
            polar = new Polar;
      
        var showLabels = config.showLabels,
            resizeLabels = config.resizeLabels,
            label = config.Label;
        
        if (dimArray) {
          for (var i=0, l=dimArray.length, acum=0; i<l; i++) {
            acum += dimArray[i];
          }
          var scale = resizeLabels? node.getData('normalizedDim') : 1,
              fontSize = (label.size * scale) >> 0;
          fontSize = fontSize < +resizeLabels? +resizeLabels : fontSize;
          domElement.style.fontSize = fontSize + 'px';
          polar.rho = acum + config.labelOffset + config.sliceOffset;
          polar.theta = (begin + end) / 2;
          var pos = polar.getc(true);
          var radius = that.canvas.getSize();
          var labelPos = {
            x: Math.round(pos.x + radius.width / 2),
            y: Math.round(pos.y + radius.height / 2)
          };
          domElement.style.left = labelPos.x + 'px';
          domElement.style.top = labelPos.y + 'px';
        }
      }
    });
    
    var size = delegate.canvas.getSize(),
        min = Math.min;
    delegate.config.levelDistance = min(size.width, size.height)/2 
      - config.offset - config.sliceOffset;
    this.delegate = delegate;
    this.canvas = this.delegate.canvas;
    this.canvas.getCtx().globalCompositeOperation = 'lighter';
  },
  
  /*
    Method: loadJSON
   
    Loads JSON data into the visualization. 
    
    Parameters:
    
    json - The JSON data format. This format is described in <http://blog.thejit.org/2010/04/24/new-javascript-infovis-toolkit-visualizations/#json-data-format>.
    
    Example:
    (start code js)
    var pieChart = new $jit.PieChart(options);
    pieChart.loadJSON(json);
    (end code)
  */  
  loadJSON: function(json) {
    var prefix = $.time(), 
        ch = [], 
        delegate = this.delegate,
        name = $.splat(json.label),
        nameLength = name.length,
        color = $.splat(json.color || this.colors),
        colorLength = color.length,
        config = this.config,
        gradient = !!config.type.split(":")[1],
        animate = config.animate,
        mono = nameLength == 1;
    
    for(var i=0, values=json.values, l=values.length; i<l; i++) {
      var val = values[i];
      var valArray = $.splat(val.values);
      ch.push({
        'id': prefix + val.label,
        'name': val.label,
        'data': {
          'value': valArray,
          '$valueArray': valArray,
          '$colorArray': mono? $.splat(color[i % colorLength]) : color,
          '$stringArray': name,
          '$gradient': gradient,
          '$config': config,
          '$angularWidth': $.reduce(valArray, function(x,y){return x+y;})
        },
        'children': []
      });
    }
    var root = {
      'id': prefix + '$root',
      'name': '',
      'data': {
        '$type': 'none',
        '$width': 1,
        '$height': 1
      },
      'children': ch
    };
    delegate.loadJSON(root);
    
    this.normalizeDims();
    delegate.refresh();
    if(animate) {
      delegate.fx.animate({
        modes: ['node-property:dimArray'],
        duration:1500
      });
    }
  },
  
  /*
    Method: updateJSON
   
    Use this method when updating values for the current JSON data. If the items specified by the JSON data already exist in the graph then their values will be updated.
    
    Parameters:
    
    json - (object) JSON data to be updated. The JSON format corresponds to the one described in <PieChart.loadJSON>.
    onComplete - (object) A callback object to be called when the animation transition when updating the data end.
    
    Example:
    
    (start code js)
    pieChart.updateJSON(json, {
      onComplete: function() {
        alert('update complete!');
      }
    });
    (end code)
  */  
  updateJSON: function(json, onComplete) {
    if(this.busy) return;
    this.busy = true;
    
    var delegate = this.delegate;
    var graph = delegate.graph;
    var values = json.values;
    var animate = this.config.animate;
    var that = this;
    $.each(values, function(v) {
      var n = graph.getByName(v.label),
          vals = $.splat(v.values);
      if(n) {
        n.setData('valueArray', vals);
        n.setData('angularWidth', $.reduce(vals, function(x,y){return x+y;}));
        if(json.label) {
          n.setData('stringArray', $.splat(json.label));
        }
      }
    });
    this.normalizeDims();
    if(animate) {
      delegate.compute('end');
      delegate.fx.animate({
        modes: ['node-property:dimArray:span', 'linear'],
        duration:1500,
        onComplete: function() {
          that.busy = false;
          onComplete && onComplete.onComplete();
        }
      });
    } else {
      delegate.refresh();
    }
  },
    
  //adds the little brown bar when hovering the node
  select: function(id, name) {
    if(!this.config.hoveredColor) return;
    var s = this.selected;
    if(s.id != id || s.name != name) {
      s.id = id;
      s.name = name;
      s.color = this.config.hoveredColor;
      this.delegate.graph.eachNode(function(n) {
        if(id == n.id) {
          n.setData('border', s);
        } else {
          n.setData('border', false);
        }
      });
      this.delegate.plot();
    }
  },
  
  /*
    Method: getLegend
   
    Returns an object containing as keys the legend names and as values hex strings with color values.
    
    Example:
    
    (start code js)
    var legend = pieChart.getLegend();
    (end code)
  */  
  getLegend: function() {
    var legend = {};
    var n;
    this.delegate.graph.getNode(this.delegate.root).eachAdjacency(function(adj) {
      n = adj.nodeTo;
    });
    var colors = n.getData('colorArray'),
        len = colors.length;
    $.each(n.getData('stringArray'), function(s, i) {
      legend[s] = colors[i % len];
    });
    return legend;
  },
  
  /*
    Method: getMaxValue
   
    Returns the maximum accumulated value for the stacks. This method is used for normalizing the graph heights according to the canvas height.
    
    Example:
    
    (start code js)
    var ans = pieChart.getMaxValue();
    (end code)
    
    In some cases it could be useful to override this method to normalize heights for a group of PieCharts, like when doing small multiples.
    
    Example:
    
    (start code js)
    //will return 100 for all PieChart instances,
    //displaying all of them with the same scale
    $jit.PieChart.implement({
      'getMaxValue': function() {
        return 100;
      }
    });
    (end code)
    
  */  
  getMaxValue: function() {
    var maxValue = 0;
    this.delegate.graph.eachNode(function(n) {
      var valArray = n.getData('valueArray'),
          acum = 0;
      $.each(valArray, function(v) { 
        acum += +v;
      });
      maxValue = maxValue>acum? maxValue:acum;
    });
    return maxValue;
  },
  
  normalizeDims: function() {
    //number of elements
    var root = this.delegate.graph.getNode(this.delegate.root), l=0;
    root.eachAdjacency(function() {
      l++;
    });
    var maxValue = this.getMaxValue() || 1,
        config = this.config,
        animate = config.animate,
        rho = this.delegate.config.levelDistance;
    this.delegate.graph.eachNode(function(n) {
      var acum = 0, animateValue = [];
      $.each(n.getData('valueArray'), function(v) {
        acum += +v;
        animateValue.push(1);
      });
      var stat = (animateValue.length == 1) && !config.updateHeights;
      if(animate) {
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return stat? rho: (n * rho / maxValue); 
        }), 'end');
        var dimArray = n.getData('dimArray');
        if(!dimArray) {
          n.setData('dimArray', animateValue);
        }
      } else {
        n.setData('dimArray', $.map(n.getData('valueArray'), function(n) { 
          return stat? rho : (n * rho / maxValue); 
        }));
      }
      n.setData('normalizedDim', acum / maxValue);
    });
  }
});


/*
 * Class: Layouts.TM
 * 
 * Implements TreeMaps layouts (SliceAndDice, Squarified, Strip).
 * 
 * Implemented By:
 * 
 * <TM>
 * 
 */
Layouts.TM = {};

Layouts.TM.SliceAndDice = new Class({
  compute: function(prop) {
    var root = this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root);
    this.controller.onBeforeCompute(root);
    var size = this.canvas.getSize(),
        config = this.config,
        width = size.width,
        height = size.height;
    this.graph.computeLevels(this.root, 0, "ignore");
    //set root position and dimensions
    root.getPos(prop).setc(-width/2, -height/2);
    root.setData('width', width, prop);
    root.setData('height', height + config.titleHeight, prop);
    this.computePositions(root, root, this.layout.orientation, prop);
    this.controller.onAfterCompute(root);
  },
  
  computePositions: function(par, ch, orn, prop) {
    //compute children areas
    var totalArea = 0;
    par.eachSubnode(function(n) {
      totalArea += n.getData('area', prop);
    });
    
    var config = this.config,
        offst = config.offset,
        width  = par.getData('width', prop),
        height = Math.max(par.getData('height', prop) - config.titleHeight, 0),
        fact = par == ch? 1 : (ch.getData('area', prop) / totalArea);

    var otherSize, size, dim, pos, pos2, posth, pos2th;
    var horizontal = (orn == "h");
    if(horizontal) {
      orn = 'v';
      otherSize = height;
      size = width * fact;
      dim = 'height';
      pos = 'y';
      pos2 = 'x';
      posth = config.titleHeight;
      pos2th = 0;
    } else {
      orn = 'h';    
      otherSize = height * fact;
      size = width;
      dim = 'width';
      pos = 'x';
      pos2 = 'y';
      posth = 0;
      pos2th = config.titleHeight;
    }
    var cpos = ch.getPos(prop);
    ch.setData('width', size, prop);
    ch.setData('height', otherSize, prop);
    var offsetSize = 0, tm = this;
    ch.eachSubnode(function(n) {
      var p = n.getPos(prop);
      p[pos] = offsetSize + cpos[pos] + posth;
      p[pos2] = cpos[pos2] + pos2th;
      tm.computePositions(ch, n, orn, prop);
      offsetSize += n.getData(dim, prop);
    });
  }

});

Layouts.TM.Area = {
 /*
    Method: compute
 
   Called by loadJSON to calculate recursively all node positions and lay out the tree.
 
    Parameters:

       json - A JSON tree. See also <Loader.loadJSON>.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 compute: function(prop) {
    prop = prop || "current";
    var root = this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root);
    this.controller.onBeforeCompute(root);
    var config = this.config,
        size = this.canvas.getSize(),
        width = size.width,
        height = size.height,
        offst = config.offset,
        offwdth = width - offst,
        offhght = height - offst;
    this.graph.computeLevels(this.root, 0, "ignore");
    //set root position and dimensions
    root.getPos(prop).setc(-width/2, -height/2);
    root.setData('width', width, prop);
    root.setData('height', height, prop);
    //create a coordinates object
    var coord = {
        'top': -height/2 + config.titleHeight,
        'left': -width/2,
        'width': offwdth,
        'height': offhght - config.titleHeight
    };
    this.computePositions(root, coord, prop);
    this.controller.onAfterCompute(root);
 }, 
 
 /*
    Method: computeDim
 
   Computes dimensions and positions of a group of nodes
   according to a custom layout row condition. 
 
    Parameters:

       tail - An array of nodes.  
       initElem - An array of nodes (containing the initial node to be laid).
       w - A fixed dimension where nodes will be layed out.
       coord - A coordinates object specifying width, height, left and top style properties.
       comp - A custom comparison function
 */
 computeDim: function(tail, initElem, w, coord, comp, prop) {
   if(tail.length + initElem.length == 1) {
     var l = (tail.length == 1)? tail : initElem;
     this.layoutLast(l, w, coord, prop);
     return;
   }
   if(tail.length >= 2 && initElem.length == 0) {
     initElem = [tail.shift()];
   }
   if(tail.length == 0) {
     if(initElem.length > 0) this.layoutRow(initElem, w, coord, prop);
     return;
   }
   var c = tail[0];
   if(comp(initElem, w) >= comp([c].concat(initElem), w)) {
     this.computeDim(tail.slice(1), initElem.concat([c]), w, coord, comp, prop);
   } else {
     var newCoords = this.layoutRow(initElem, w, coord, prop);
     this.computeDim(tail, [], newCoords.dim, newCoords, comp, prop);
   }
 },

 
 /*
    Method: worstAspectRatio
 
   Calculates the worst aspect ratio of a group of rectangles. 
       
    See also:
       
       <http://en.wikipedia.org/wiki/Aspect_ratio>
   
    Parameters:

     ch - An array of nodes.  
     w  - The fixed dimension where rectangles are being laid out.

    Returns:
 
        The worst aspect ratio.


 */
 worstAspectRatio: function(ch, w) {
   if(!ch || ch.length == 0) return Number.MAX_VALUE;
   var areaSum = 0, maxArea = 0, minArea = Number.MAX_VALUE;
   for(var i=0, l=ch.length; i<l; i++) {
     var area = ch[i]._area;
     areaSum += area; 
     minArea = minArea < area? minArea : area;
     maxArea = maxArea > area? maxArea : area; 
   }
   var sqw = w * w, sqAreaSum = areaSum * areaSum;
   return Math.max(sqw * maxArea / sqAreaSum,
           sqAreaSum / (sqw * minArea));
 },
 
 /*
    Method: avgAspectRatio
 
   Calculates the average aspect ratio of a group of rectangles. 
       
       See also:
       
       <http://en.wikipedia.org/wiki/Aspect_ratio>
   
    Parameters:

     ch - An array of nodes.  
       w - The fixed dimension where rectangles are being laid out.

    Returns:
 
        The average aspect ratio.


 */
 avgAspectRatio: function(ch, w) {
   if(!ch || ch.length == 0) return Number.MAX_VALUE;
   var arSum = 0;
   for(var i=0, l=ch.length; i<l; i++) {
     var area = ch[i]._area;
     var h = area / w;
     arSum += w > h? w / h : h / w;
   }
   return arSum / l;
 },

 /*
    layoutLast
 
   Performs the layout of the last computed sibling.
 
    Parameters:

       ch - An array of nodes.  
       w - A fixed dimension where nodes will be layed out.
     coord - A coordinates object specifying width, height, left and top style properties.
 */
 layoutLast: function(ch, w, coord, prop) {
   var child = ch[0];
   child.getPos(prop).setc(coord.left, coord.top);
   child.setData('width', coord.width, prop);
   child.setData('height', coord.height, prop);
 }
};


Layouts.TM.Squarified = new Class({
 Implements: Layouts.TM.Area,
 
 computePositions: function(node, coord, prop) {
   var config = this.config, 
       max = Math.max;
   
   if (coord.width >= coord.height) 
     this.layout.orientation = 'h';
   else
     this.layout.orientation = 'v';
   
   var ch = node.getSubnodes([1, 1], "ignore");
   if(ch.length > 0) {
     this.processChildrenLayout(node, ch, coord, prop);
     for(var i=0, l=ch.length; i<l; i++) {
       var chi = ch[i], 
           offst = config.offset,
           height = max(chi.getData('height', prop) - offst - config.titleHeight, 0),
           width = max(chi.getData('width', prop) - offst, 0),
           chipos = chi.getPos(prop);

       coord = {
         'width': width,
         'height': height,
         'top': chipos.y + config.titleHeight,
         'left': chipos.x
       };
       this.computePositions(chi, coord, prop);
     }
   }
 },

 /*
    Method: processChildrenLayout
 
   Computes children real areas and other useful parameters for performing the Squarified algorithm.
 
    Parameters:

       par - The parent node of the json subtree.  
       ch - An Array of nodes
     coord - A coordinates object specifying width, height, left and top style properties.
 */
 processChildrenLayout: function(par, ch, coord, prop) {
   //compute children real areas
   var parentArea = coord.width * coord.height;
   var i, l=ch.length, totalChArea=0, chArea = [];
   for(i=0; i<l; i++) {
     chArea[i] = parseFloat(ch[i].getData('area', prop));
     totalChArea += chArea[i];
   }
   for(i=0; i<l; i++) {
     ch[i]._area = parentArea * chArea[i] / totalChArea;
   }
   var minimumSideValue = this.layout.horizontal()? coord.height : coord.width;
   ch.sort(function(a, b) { 
     var diff = b._area - a._area; 
     return diff? diff : (b.id == a.id? 0 : (b.id < a.id? 1 : -1)); 
   });
   var initElem = [ch[0]];
   var tail = ch.slice(1);
   this.squarify(tail, initElem, minimumSideValue, coord, prop);
 },

 /*
   Method: squarify
 
   Performs an heuristic method to calculate div elements sizes in order to have a good aspect ratio.
 
    Parameters:

       tail - An array of nodes.  
       initElem - An array of nodes, containing the initial node to be laid out.
       w - A fixed dimension where nodes will be laid out.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 squarify: function(tail, initElem, w, coord, prop) {
   this.computeDim(tail, initElem, w, coord, this.worstAspectRatio, prop);
 },
 
 /*
    Method: layoutRow
 
   Performs the layout of an array of nodes.
 
    Parameters:

       ch - An array of nodes.  
       w - A fixed dimension where nodes will be laid out.
       coord - A coordinates object specifying width, height, left and top style properties.
 */
 layoutRow: function(ch, w, coord, prop) {
   if(this.layout.horizontal()) {
     return this.layoutV(ch, w, coord, prop);
   } else {
     return this.layoutH(ch, w, coord, prop);
   }
 },
 
 layoutV: function(ch, w, coord, prop) {
   var totalArea = 0, rnd = function(x) { return x; }; 
   $.each(ch, function(elem) { totalArea += elem._area; });
   var width = rnd(totalArea / w), top =  0; 
   for(var i=0, l=ch.length; i<l; i++) {
     var h = rnd(ch[i]._area / width);
     var chi = ch[i];
     chi.getPos(prop).setc(coord.left, coord.top + top);
     chi.setData('width', width, prop);
     chi.setData('height', h, prop);
     top += h;
   }
   var ans = {
     'height': coord.height,
     'width': coord.width - width,
     'top': coord.top,
     'left': coord.left + width
   };
   //take minimum side value.
   ans.dim = Math.min(ans.width, ans.height);
   if(ans.dim != ans.height) this.layout.change();
   return ans;
 },
 
 layoutH: function(ch, w, coord, prop) {
   var totalArea = 0; 
   $.each(ch, function(elem) { totalArea += elem._area; });
   var height = totalArea / w,
       top = coord.top, 
       left = 0;
   
   for(var i=0, l=ch.length; i<l; i++) {
     var chi = ch[i];
     var w = chi._area / height;
     chi.getPos(prop).setc(coord.left + left, top);
     chi.setData('width', w, prop);
     chi.setData('height', height, prop);
     left += w;
   }
   var ans = {
     'height': coord.height - height,
     'width': coord.width,
     'top': coord.top + height,
     'left': coord.left
   };
   ans.dim = Math.min(ans.width, ans.height);
   if(ans.dim != ans.width) this.layout.change();
   return ans;
 }
});

Layouts.TM.Strip = new Class({
  Implements: Layouts.TM.Area,

    /*
      Method: compute
    
     Called by loadJSON to calculate recursively all node positions and lay out the tree.
    
      Parameters:
    
         json - A JSON subtree. See also <Loader.loadJSON>. 
       coord - A coordinates object specifying width, height, left and top style properties.
    */
    computePositions: function(node, coord, prop) {
     var  ch = node.getSubnodes([1, 1], "ignore"), 
          config = this.config,
          max = Math.max;
     if(ch.length > 0) {
       this.processChildrenLayout(node, ch, coord, prop);
       for(var i=0, l=ch.length; i<l; i++) {
         var chi = ch[i];
         var offst = config.offset,
             height = max(chi.getData('height', prop) - offst - config.titleHeight, 0),
             width  = max(chi.getData('width', prop)  - offst, 0);
         var chipos = chi.getPos(prop);
         coord = {
           'width': width,
           'height': height,
           'top': chipos.y + config.titleHeight,
           'left': chipos.x
         };
         this.computePositions(chi, coord, prop);
       }
     }
    },
    
    /*
      Method: processChildrenLayout
    
     Computes children real areas and other useful parameters for performing the Strip algorithm.
    
      Parameters:
    
         par - The parent node of the json subtree.  
         ch - An Array of nodes
         coord - A coordinates object specifying width, height, left and top style properties.
    */
    processChildrenLayout: function(par, ch, coord, prop) {
     //compute children real areas
      var parentArea = coord.width * coord.height;
      var i, l=ch.length, totalChArea=0, chArea = [];
      for(i=0; i<l; i++) {
        chArea[i] = +ch[i].getData('area', prop);
        totalChArea += chArea[i];
      }
      for(i=0; i<l; i++) {
        ch[i]._area = parentArea * chArea[i] / totalChArea;
      }
     var side = this.layout.horizontal()? coord.width : coord.height;
     var initElem = [ch[0]];
     var tail = ch.slice(1);
     this.stripify(tail, initElem, side, coord, prop);
    },
    
    /*
      Method: stripify
    
     Performs an heuristic method to calculate div elements sizes in order to have 
     a good compromise between aspect ratio and order.
    
      Parameters:
    
         tail - An array of nodes.  
         initElem - An array of nodes.
         w - A fixed dimension where nodes will be layed out.
       coord - A coordinates object specifying width, height, left and top style properties.
    */
    stripify: function(tail, initElem, w, coord, prop) {
     this.computeDim(tail, initElem, w, coord, this.avgAspectRatio, prop);
    },
    
    /*
      Method: layoutRow
    
     Performs the layout of an array of nodes.
    
      Parameters:
    
         ch - An array of nodes.  
         w - A fixed dimension where nodes will be laid out.
         coord - A coordinates object specifying width, height, left and top style properties.
    */
    layoutRow: function(ch, w, coord, prop) {
     if(this.layout.horizontal()) {
       return this.layoutH(ch, w, coord, prop);
     } else {
       return this.layoutV(ch, w, coord, prop);
     }
    },
    
    layoutV: function(ch, w, coord, prop) {
     var totalArea = 0; 
     $.each(ch, function(elem) { totalArea += elem._area; });
     var width = totalArea / w, top =  0; 
     for(var i=0, l=ch.length; i<l; i++) {
       var chi = ch[i];
       var h = chi._area / width;
       chi.getPos(prop).setc(coord.left, 
           coord.top + (w - h - top));
       chi.setData('width', width, prop);
       chi.setData('height', h, prop);
       top += h;
     }
    
     return {
       'height': coord.height,
       'width': coord.width - width,
       'top': coord.top,
       'left': coord.left + width,
       'dim': w
     };
    },
    
    layoutH: function(ch, w, coord, prop) {
     var totalArea = 0; 
     $.each(ch, function(elem) { totalArea += elem._area; });
     var height = totalArea / w,
         top = coord.height - height, 
         left = 0;
     
     for(var i=0, l=ch.length; i<l; i++) {
       var chi = ch[i];
       var s = chi._area / height;
       chi.getPos(prop).setc(coord.left + left, coord.top + top);
       chi.setData('width', s, prop);
       chi.setData('height', height, prop);
       left += s;
     }
     return {
       'height': coord.height - height,
       'width': coord.width,
       'top': coord.top,
       'left': coord.left,
       'dim': w
     };
    }
 });


/*
 * Class: Layouts.Icicle
 *
 * Implements the icicle tree layout.
 *
 * Implemented By:
 *
 * <Icicle>
 *
 */

Layouts.Icicle = new Class({
 /*
  * Method: compute
  *
  * Called by loadJSON to calculate all node positions.
  *
  * Parameters:
  *
  * posType - The nodes' position to compute. Either "start", "end" or
  *            "current". Defaults to "current".
  */
  compute: function(posType) {
    posType = posType || "current";

    var root = this.graph.getNode(this.root),
        config = this.config,
        size = this.canvas.getSize(),
        width = size.width,
        height = size.height,
        offset = config.offset,
        levelsToShow = config.constrained ? config.levelsToShow : Number.MAX_VALUE;

    this.controller.onBeforeCompute(root);

    Graph.Util.computeLevels(this.graph, root.id, 0, "ignore");

    var treeDepth = 0;

    Graph.Util.eachLevel(root, 0, false, function (n, d) { if(d > treeDepth) treeDepth = d; });

    var startNode = this.graph.getNode(this.clickedNode && this.clickedNode.id || root.id);
    var maxDepth = Math.min(treeDepth, levelsToShow-1);
    var initialDepth = startNode._depth;
    if(this.layout.horizontal()) {
      this.computeSubtree(startNode, -width/2, -height/2, width/(maxDepth+1), height, initialDepth, maxDepth, posType);
    } else {
      this.computeSubtree(startNode, -width/2, -height/2, width, height/(maxDepth+1), initialDepth, maxDepth, posType);
    }
  },

  computeSubtree: function (root, x, y, width, height, initialDepth, maxDepth, posType) {
    root.getPos(posType).setc(x, y);
    root.setData('width', width, posType);
    root.setData('height', height, posType);

    var nodeLength, prevNodeLength = 0, totalDim = 0;
    var children = Graph.Util.getSubnodes(root, [1, 1], 'ignore'); // next level from this node

    if(!children.length)
      return;

    $.each(children, function(e) { totalDim += e.getData('dim'); });

    for(var i=0, l=children.length; i < l; i++) {
      if(this.layout.horizontal()) {
        nodeLength = height * children[i].getData('dim') / totalDim;
        this.computeSubtree(children[i], x+width, y, width, nodeLength, initialDepth, maxDepth, posType);
        y += nodeLength;
      } else {
        nodeLength = width * children[i].getData('dim') / totalDim;
        this.computeSubtree(children[i], x, y+height, nodeLength, height, initialDepth, maxDepth, posType);
        x += nodeLength;
      }
    }
  }
});



/*
 * File: Icicle.js
 *
*/

/*
  Class: Icicle
  
  Icicle space filling visualization.
  
  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.Tips>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed

  orientation - (string) Default's *h*. Whether to set horizontal or vertical layouts. Possible values are 'h' and 'v'.
  offset - (number) Default's *2*. Boxes offset.
  constrained - (boolean) Default's *false*. Whether to show the entire tree when loaded or just the number of levels specified by _levelsToShow_.
  levelsToShow - (number) Default's *3*. The number of levels to show for a subtree. This number is relative to the selected node.
  animate - (boolean) Default's *false*. Whether to animate transitions.
  Node.type - Described in <Options.Node>. Default's *rectangle*.
  Label.type - Described in <Options.Label>. Default's *Native*.
  duration - Described in <Options.Fx>. Default's *700*.
  fps - Described in <Options.Fx>. Default's *45*.
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <Icicle.Op> instance.
  fx - Access a <Icicle.Plot> instance.
  labels - Access a <Icicle.Label> interface implementation.

*/

$jit.Icicle = new Class({
  Implements: [ Loader, Extras, Layouts.Icicle ],

  layout: {
    orientation: "h",
    vertical: function(){
      return this.orientation == "v";
    },
    horizontal: function(){
      return this.orientation == "h";
    },
    change: function(){
      this.orientation = this.vertical()? "h" : "v";
    }
  },

  initialize: function(controller) {
    var config = {
      animate: false,
      orientation: "h",
      offset: 2,
      levelsToShow: Number.MAX_VALUE,
      constrained: false,
      Node: {
        type: 'rectangle',
        overridable: true
      },
      Edge: {
        type: 'none'
      },
      Label: {
        type: 'Native'
      },
      duration: 700,
      fps: 45
    };

    var opts = Options("Canvas", "Node", "Edge", "Fx", "Tips", "NodeStyles",
                       "Events", "Navigation", "Controller", "Label");
    this.controller = this.config = $.merge(opts, config, controller);
    this.layout.orientation = this.config.orientation;

    var canvasConfig = this.config;
    if (canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Complex,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };

    this.graph = new Graph(
      this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);

    this.labels = new $jit.Icicle.Label[this.config.Label.type](this);
    this.fx = new $jit.Icicle.Plot(this, $jit.Icicle);
    this.op = new $jit.Icicle.Op(this);
    this.group = new $jit.Icicle.Group(this);
    this.clickedNode = null;

    this.initializeExtras();
  },

  /* 
    Method: refresh 
    
    Computes positions and plots the tree.
  */
  refresh: function(){
    var labelType = this.config.Label.type;
    if(labelType != 'Native') {
      var that = this;
      this.graph.eachNode(function(n) { that.labels.hideLabel(n, false); });
    }
    this.compute();
    this.plot();
  },

  /* 
    Method: plot 
    
    Plots the Icicle visualization. This is a shortcut to *fx.plot*. 
  
   */
  plot: function(){
    this.fx.plot(this.config);
  },

  /* 
    Method: enter 
    
    Sets the node as root.
    
     Parameters:
     
     node - (object) A <Graph.Node>.
  
   */
  enter: function (node) {
    if (this.busy)
      return;
    this.busy = true;

    var that = this,
        config = this.config;

    var callback = {
      onComplete: function() {
        //compute positions of newly inserted nodes
        if(config.request)
          that.compute();

        if(config.animate) {
          that.graph.nodeList.setDataset(['current', 'end'], {
            'alpha': [1, 0] //fade nodes
          });

          Graph.Util.eachSubgraph(node, function(n) {
            n.setData('alpha', 1, 'end');
          }, "ignore");

          that.fx.animate({
            duration: 500,
            modes:['node-property:alpha'],
            onComplete: function() {
              that.clickedNode = node;
              that.compute('end');

              that.fx.animate({
                modes:['linear', 'node-property:width:height'],
                duration: 1000,
                onComplete: function() {
                  that.busy = false;
                  that.clickedNode = node;
                }
              });
            }
          });
        } else {
          that.clickedNode = node;
          that.busy = false;
          that.refresh();
        }
      }
    };

    if(config.request) {
      this.requestNodes(clickedNode, callback);
    } else {
      callback.onComplete();
    }
  },

  /* 
    Method: out 
    
    Sets the parent node of the current selected node as root.
  
   */
  out: function(){
    if(this.busy)
      return;

    var that = this,
        GUtil = Graph.Util,
        config = this.config,
        graph = this.graph,
        parents = GUtil.getParents(graph.getNode(this.clickedNode && this.clickedNode.id || this.root)),
        parent = parents[0],
        clickedNode = parent,
        previousClickedNode = this.clickedNode;

    this.busy = true;
    this.events.hoveredNode = false;

    if(!parent) {
      this.busy = false;
      return;
    }

    //final plot callback
    callback = {
      onComplete: function() {
        that.clickedNode = parent;
        if(config.request) {
          that.requestNodes(parent, {
            onComplete: function() {
              that.compute();
              that.plot();
              that.busy = false;
            }
          });
        } else {
          that.compute();
          that.plot();
          that.busy = false;
        }
      }
    };

    //animate node positions
    if(config.animate) {
      this.clickedNode = clickedNode;
      this.compute('end');
      //animate the visible subtree only
      this.clickedNode = previousClickedNode;
      this.fx.animate({
        modes:['linear', 'node-property:width:height'],
        duration: 1000,
        onComplete: function() {
          //animate the parent subtree
          that.clickedNode = clickedNode;
          //change nodes alpha
          graph.nodeList.setDataset(['current', 'end'], {
            'alpha': [0, 1]
          });
          GUtil.eachSubgraph(previousClickedNode, function(node) {
            node.setData('alpha', 1);
          }, "ignore");
          that.fx.animate({
            duration: 500,
            modes:['node-property:alpha'],
            onComplete: function() {
              callback.onComplete();
            }
          });
        }
      });
    } else {
      callback.onComplete();
    }
  },
  requestNodes: function(node, onComplete){
    var handler = $.merge(this.controller, onComplete),
        levelsToShow = this.config.constrained ? this.config.levelsToShow : Number.MAX_VALUE;

    if (handler.request) {
      var leaves = [], d = node._depth;
      Graph.Util.eachLevel(node, 0, levelsToShow, function(n){
        if (n.drawn && !Graph.Util.anySubnode(n)) {
          leaves.push(n);
          n._level = n._depth - d;
          if (this.config.constrained)
            n._level = levelsToShow - n._level;

        }
      });
      this.group.requestNodes(leaves, handler);
    } else {
      handler.onComplete();
    }
  }
});

/*
  Class: Icicle.Op
  
  Custom extension of <Graph.Op>.
  
  Extends:
  
  All <Graph.Op> methods
  
  See also:
  
  <Graph.Op>
  
  */
$jit.Icicle.Op = new Class({

  Implements: Graph.Op

});

/*
 * Performs operations on group of nodes.
 */
$jit.Icicle.Group = new Class({

  initialize: function(viz){
    this.viz = viz;
    this.canvas = viz.canvas;
    this.config = viz.config;
  },

  /*
   * Calls the request method on the controller to request a subtree for each node.
   */
  requestNodes: function(nodes, controller){
    var counter = 0, len = nodes.length, nodeSelected = {};
    var complete = function(){
      controller.onComplete();
    };
    var viz = this.viz;
    if (len == 0)
      complete();
    for(var i = 0; i < len; i++) {
      nodeSelected[nodes[i].id] = nodes[i];
      controller.request(nodes[i].id, nodes[i]._level, {
        onComplete: function(nodeId, data){
          if (data && data.children) {
            data.id = nodeId;
            viz.op.sum(data, {
              type: 'nothing'
            });
          }
          if (++counter == len) {
            Graph.Util.computeLevels(viz.graph, viz.root, 0);
            complete();
          }
        }
      });
    }
  }
});

/*
  Class: Icicle.Plot
  
  Custom extension of <Graph.Plot>.
  
  Extends:
  
  All <Graph.Plot> methods
  
  See also:
  
  <Graph.Plot>
  
  */
$jit.Icicle.Plot = new Class({
  Implements: Graph.Plot,

  plot: function(opt, animating){
    opt = opt || this.viz.controller;
    var viz = this.viz,
        graph = viz.graph,
        root = graph.getNode(viz.clickedNode && viz.clickedNode.id || viz.root),
        initialDepth = root._depth;

    viz.canvas.clear();
    this.plotTree(root, $.merge(opt, {
      'withLabels': true,
      'hideLabels': false,
      'plotSubtree': function(root, node) {
        return !viz.config.constrained ||
               (node._depth - initialDepth < viz.config.levelsToShow);
      }
    }), animating);
  }
});

/*
  Class: Icicle.Label
  
  Custom extension of <Graph.Label>. 
  Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.
  
  Extends:
  
  All <Graph.Label> methods and subclasses.
  
  See also:
  
  <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
  */
$jit.Icicle.Label = {};

/*
  Icicle.Label.Native
  
  Custom extension of <Graph.Label.Native>.
  
  Extends:
  
  All <Graph.Label.Native> methods
  
  See also:
  
  <Graph.Label.Native>

  */
$jit.Icicle.Label.Native = new Class({
  Implements: Graph.Label.Native,

  renderLabel: function(canvas, node, controller) {
    var ctx = canvas.getCtx(),
        width = node.getData('width'),
        height = node.getData('height'),
        size = node.getLabelData('size'),
        m = ctx.measureText(node.name);

    // Guess as much as possible if the label will fit in the node
    if(height < (size * 1.5) || width < m.width)
      return;

    var pos = node.pos.getc(true);
    ctx.fillText(node.name,
                 pos.x + width / 2,
                 pos.y + height / 2);
  }
});

/*
  Icicle.Label.SVG
  
  Custom extension of <Graph.Label.SVG>.
  
  Extends:
  
  All <Graph.Label.SVG> methods
  
  See also:
  
  <Graph.Label.SVG>
*/
$jit.Icicle.Label.SVG = new Class( {
  Implements: Graph.Label.SVG,

  initialize: function(viz){
    this.viz = viz;
  },

  /*
    placeLabel
   
    Overrides abstract method placeLabel in <Graph.Plot>.
   
    Parameters:
   
    tag - A DOM label element.
    node - A <Graph.Node>.
    controller - A configuration/controller object passed to the visualization.
   */
  placeLabel: function(tag, node, controller){
    var pos = node.pos.getc(true), canvas = this.viz.canvas;
    var radius = canvas.getSize();
    var labelPos = {
      x: Math.round(pos.x + radius.width / 2),
      y: Math.round(pos.y + radius.height / 2)
    };
    tag.setAttribute('x', labelPos.x);
    tag.setAttribute('y', labelPos.y);

    controller.onPlaceLabel(tag, node);
  }
});

/*
  Icicle.Label.HTML
  
  Custom extension of <Graph.Label.HTML>.
  
  Extends:
  
  All <Graph.Label.HTML> methods.
  
  See also:
  
  <Graph.Label.HTML>
  
  */
$jit.Icicle.Label.HTML = new Class( {
  Implements: Graph.Label.HTML,

  initialize: function(viz){
    this.viz = viz;
  },

  /*
    placeLabel
   
    Overrides abstract method placeLabel in <Graph.Plot>.
   
    Parameters:
   
    tag - A DOM label element.
    node - A <Graph.Node>.
    controller - A configuration/controller object passed to the visualization.
   */
  placeLabel: function(tag, node, controller){
    var pos = node.pos.getc(true), canvas = this.viz.canvas;
    var radius = canvas.getSize();
    var labelPos = {
      x: Math.round(pos.x + radius.width / 2),
      y: Math.round(pos.y + radius.height / 2)
    };

    var style = tag.style;
    style.left = labelPos.x + 'px';
    style.top = labelPos.y + 'px';
    style.display = '';

    controller.onPlaceLabel(tag, node);
  }
});

/*
  Class: Icicle.Plot.NodeTypes
  
  This class contains a list of <Graph.Node> built-in types. 
  Node types implemented are 'none', 'rectangle'.
  
  You can add your custom node types, customizing your visualization to the extreme.
  
  Example:
  
  (start code js)
    Icicle.Plot.NodeTypes.implement({
      'mySpecialType': {
        'render': function(node, canvas) {
          //print your custom node to canvas
        },
        //optional
        'contains': function(node, pos) {
          //return true if pos is inside the node or false otherwise
        }
      }
    });
  (end code)
  
  */
$jit.Icicle.Plot.NodeTypes = new Class( {
  'none': {
    'render': $.empty
  },

  'rectangle': {
    'render': function(node, canvas, animating) {
      var config = this.viz.config;
      var offset = config.offset;
      var width = node.getData('width');
      var height = node.getData('height');
      var border = node.getData('border');
      var pos = node.pos.getc(true);
      var posx = pos.x + offset / 2, posy = pos.y + offset / 2;
      var ctx = canvas.getCtx();
      
      if(width - offset < 2 || height - offset < 2) return;
      
      if(config.cushion) {
        var color = node.getData('color');
        var lg = ctx.createRadialGradient(posx + (width - offset)/2, 
                                          posy + (height - offset)/2, 1, 
                                          posx + (width-offset)/2, posy + (height-offset)/2, 
                                          width < height? height : width);
        var colorGrad = $.rgbToHex($.map($.hexToRgb(color), 
            function(r) { return r * 0.3 >> 0; }));
        lg.addColorStop(0, color);
        lg.addColorStop(1, colorGrad);
        ctx.fillStyle = lg;
      }

      if (border) {
        ctx.strokeStyle = border;
        ctx.lineWidth = 3;
      }

      ctx.fillRect(posx, posy, Math.max(0, width - offset), Math.max(0, height - offset));
      border && ctx.strokeRect(pos.x, pos.y, width, height);
    },

    'contains': function(node, pos) {
      if(this.viz.clickedNode && !$jit.Graph.Util.isDescendantOf(node, this.viz.clickedNode.id)) return false;
      var npos = node.pos.getc(true),
          width = node.getData('width'),
          height = node.getData('height');
      return this.nodeHelper.rectangle.contains({x: npos.x + width/2, y: npos.y + height/2}, pos, width, height);
    }
  }
});

$jit.Icicle.Plot.EdgeTypes = new Class( {
  'none': $.empty
});



/*
 * File: Layouts.ForceDirected.js
 *
*/

/*
 * Class: Layouts.ForceDirected
 * 
 * Implements a Force Directed Layout.
 * 
 * Implemented By:
 * 
 * <ForceDirected>
 * 
 * Credits:
 * 
 * Marcus Cobden <http://marcuscobden.co.uk>
 * 
 */
Layouts.ForceDirected = new Class({

  getOptions: function(random) {
    var s = this.canvas.getSize();
    var w = s.width, h = s.height;
    //count nodes
    var count = 0;
    this.graph.eachNode(function(n) { 
      count++;
    });
    var k2 = w * h / count, k = Math.sqrt(k2);
    var l = this.config.levelDistance;
    
    return {
      width: w,
      height: h,
      tstart: w * 0.1,
      nodef: function(x) { return k2 / (x || 1); },
      edgef: function(x) { return /* x * x / k; */ k * (x - l); }
    };
  },
  
  compute: function(property, incremental) {
    var prop = $.splat(property || ['current', 'start', 'end']);
    var opt = this.getOptions();
    NodeDim.compute(this.graph, prop, this.config);
    this.graph.computeLevels(this.root, 0, "ignore");
    this.graph.eachNode(function(n) {
      $.each(prop, function(p) {
        var pos = n.getPos(p);
        if(pos.equals(Complex.KER)) {
          pos.x = opt.width/5 * (Math.random() - 0.5);
          pos.y = opt.height/5 * (Math.random() - 0.5);
        }
        //initialize disp vector
        n.disp = {};
        $.each(prop, function(p) {
          n.disp[p] = $C(0, 0);
        });
      });
    });
    this.computePositions(prop, opt, incremental);
  },
  
  computePositions: function(property, opt, incremental) {
    var times = this.config.iterations, i = 0, that = this;
    if(incremental) {
      (function iter() {
        for(var total=incremental.iter, j=0; j<total; j++) {
          opt.t = opt.tstart;
          if(times) opt.t *= (1 - i++/(times -1));
          that.computePositionStep(property, opt);
          if(times && i >= times) {
            incremental.onComplete();
            return;
          }
        }
        incremental.onStep(Math.round(i / (times -1) * 100));
        setTimeout(iter, 1);
      })();
    } else {
      for(; i < times; i++) {
        opt.t = opt.tstart * (1 - i/(times -1));
        this.computePositionStep(property, opt);
      }
    }
  },
  
  computePositionStep: function(property, opt) {
    var graph = this.graph;
    var min = Math.min, max = Math.max;
    var dpos = $C(0, 0);
    //calculate repulsive forces
    graph.eachNode(function(v) {
      //initialize disp
      $.each(property, function(p) {
        v.disp[p].x = 0; v.disp[p].y = 0;
      });
      graph.eachNode(function(u) {
        if(u.id != v.id) {
          $.each(property, function(p) {
            var vp = v.getPos(p), up = u.getPos(p);
            dpos.x = vp.x - up.x;
            dpos.y = vp.y - up.y;
            var norm = dpos.norm() || 1;
            v.disp[p].$add(dpos
                .$scale(opt.nodef(norm) / norm));
          });
        }
      });
    });
    //calculate attractive forces
    var T = !!graph.getNode(this.root).visited;
    graph.eachNode(function(node) {
      node.eachAdjacency(function(adj) {
        var nodeTo = adj.nodeTo;
        if(!!nodeTo.visited === T) {
          $.each(property, function(p) {
            var vp = node.getPos(p), up = nodeTo.getPos(p);
            dpos.x = vp.x - up.x;
            dpos.y = vp.y - up.y;
            var norm = dpos.norm() || 1;
            node.disp[p].$add(dpos.$scale(-opt.edgef(norm) / norm));
            nodeTo.disp[p].$add(dpos.$scale(-1));
          });
        }
      });
      node.visited = !T;
    });
    //arrange positions to fit the canvas
    var t = opt.t, w2 = opt.width / 2, h2 = opt.height / 2;
    graph.eachNode(function(u) {
      $.each(property, function(p) {
        var disp = u.disp[p];
        var norm = disp.norm() || 1;
        var p = u.getPos(p);
        p.$add($C(disp.x * min(Math.abs(disp.x), t) / norm, 
            disp.y * min(Math.abs(disp.y), t) / norm));
        p.x = min(w2, max(-w2, p.x));
        p.y = min(h2, max(-h2, p.y));
      });
    });
  }
});

/*
 * File: ForceDirected.js
 */

/*
   Class: ForceDirected
      
   A visualization that lays graphs using a Force-Directed layout algorithm.
   
   Inspired by:
  
   Force-Directed Drawing Algorithms (Stephen G. Kobourov) <http://www.cs.brown.edu/~rt/gdhandbook/chapters/force-directed.pdf>
   
  Implements:
  
  All <Loader> methods
  
   Constructor Options:
   
   Inherits options from
   
   - <Options.Canvas>
   - <Options.Controller>
   - <Options.Node>
   - <Options.Edge>
   - <Options.Label>
   - <Options.Events>
   - <Options.Tips>
   - <Options.NodeStyles>
   - <Options.Navigation>
   
   Additionally, there are two parameters
   
   levelDistance - (number) Default's *50*. The natural length desired for the edges.
   iterations - (number) Default's *50*. The number of iterations for the spring layout simulation. Depending on the browser's speed you could set this to a more 'interesting' number, like *200*. 
     
   Instance Properties:

   canvas - Access a <Canvas> instance.
   graph - Access a <Graph> instance.
   op - Access a <ForceDirected.Op> instance.
   fx - Access a <ForceDirected.Plot> instance.
   labels - Access a <ForceDirected.Label> interface implementation.

*/

$jit.ForceDirected = new Class( {

  Implements: [ Loader, Extras, Layouts.ForceDirected ],

  initialize: function(controller) {
    var $ForceDirected = $jit.ForceDirected;

    var config = {
      iterations: 50,
      levelDistance: 50
    };

    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), config, controller);

    var canvasConfig = this.config;
    if(canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Complex,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new $ForceDirected.Label[canvasConfig.Label.type](this);
    this.fx = new $ForceDirected.Plot(this, $ForceDirected);
    this.op = new $ForceDirected.Op(this);
    this.json = null;
    this.busy = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
    Method: refresh 
    
    Computes positions and plots the tree.
  */
  refresh: function() {
    this.compute();
    this.plot();
  },

  reposition: function() {
    this.compute('end');
  },

/*
  Method: computeIncremental
  
  Performs the Force Directed algorithm incrementally.
  
  Description:
  
  ForceDirected algorithms can perform many computations and lead to JavaScript taking too much time to complete. 
  This method splits the algorithm into smaller parts allowing the user to track the evolution of the algorithm and 
  avoiding browser messages such as "This script is taking too long to complete".
  
  Parameters:
  
  opt - (object) The object properties are described below
  
  iter - (number) Default's *20*. Split the algorithm into pieces of _iter_ iterations. For example, if the _iterations_ configuration property 
  of your <ForceDirected> class is 100, then you could set _iter_ to 20 to split the main algorithm into 5 smaller pieces.
  
  property - (string) Default's *end*. Whether to update starting, current or ending node positions. Possible values are 'end', 'start', 'current'. 
  You can also set an array of these properties. If you'd like to keep the current node positions but to perform these 
  computations for final animation positions then you can just choose 'end'.
  
  onStep - (function) A callback function called when each "small part" of the algorithm completed. This function gets as first formal 
  parameter a percentage value.
  
  onComplete - A callback function called when the algorithm completed.
  
  Example:
  
  In this example I calculate the end positions and then animate the graph to those positions
  
  (start code js)
  var fd = new $jit.ForceDirected(...);
  fd.computeIncremental({
    iter: 20,
    property: 'end',
    onStep: function(perc) {
      Log.write("loading " + perc + "%");
    },
    onComplete: function() {
      Log.write("done");
      fd.animate();
    }
  });
  (end code)
  
  In this example I calculate all positions and (re)plot the graph
  
  (start code js)
  var fd = new ForceDirected(...);
  fd.computeIncremental({
    iter: 20,
    property: ['end', 'start', 'current'],
    onStep: function(perc) {
      Log.write("loading " + perc + "%");
    },
    onComplete: function() {
      Log.write("done");
      fd.plot();
    }
  });
  (end code)
  
  */
  computeIncremental: function(opt) {
    opt = $.merge( {
      iter: 20,
      property: 'end',
      onStep: $.empty,
      onComplete: $.empty
    }, opt || {});

    this.config.onBeforeCompute(this.graph.getNode(this.root));
    this.compute(opt.property, opt);
  },

  /*
    Method: plot
   
    Plots the ForceDirected graph. This is a shortcut to *fx.plot*.
   */
  plot: function() {
    this.fx.plot();
  },

  /*
     Method: animate
    
     Animates the graph from the current positions to the 'end' node positions.
  */
  animate: function(opt) {
    this.fx.animate($.merge( {
      modes: [ 'linear' ]
    }, opt || {}));
  }
});

$jit.ForceDirected.$extend = true;

(function(ForceDirected) {

  /*
     Class: ForceDirected.Op
     
     Custom extension of <Graph.Op>.

     Extends:

     All <Graph.Op> methods
     
     See also:
     
     <Graph.Op>

  */
  ForceDirected.Op = new Class( {

    Implements: Graph.Op

  });

  /*
    Class: ForceDirected.Plot
    
    Custom extension of <Graph.Plot>.
  
    Extends:
  
    All <Graph.Plot> methods
    
    See also:
    
    <Graph.Plot>
  
  */
  ForceDirected.Plot = new Class( {

    Implements: Graph.Plot

  });

  /*
    Class: ForceDirected.Label
    
    Custom extension of <Graph.Label>. 
    Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.
  
    Extends:
  
    All <Graph.Label> methods and subclasses.
  
    See also:
  
    <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
  */
  ForceDirected.Label = {};

  /*
     ForceDirected.Label.Native
     
     Custom extension of <Graph.Label.Native>.

     Extends:

     All <Graph.Label.Native> methods

     See also:

     <Graph.Label.Native>

  */
  ForceDirected.Label.Native = new Class( {
    Implements: Graph.Label.Native
  });

  /*
    ForceDirected.Label.SVG
    
    Custom extension of <Graph.Label.SVG>.
  
    Extends:
  
    All <Graph.Label.SVG> methods
  
    See also:
  
    <Graph.Label.SVG>
  
  */
  ForceDirected.Label.SVG = new Class( {
    Implements: Graph.Label.SVG,

    initialize: function(viz) {
      this.viz = viz;
    },

    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Label>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize();
      var labelPos = {
        x: Math.round(pos.x * sx + ox + radius.width / 2),
        y: Math.round(pos.y * sy + oy + radius.height / 2)
      };
      tag.setAttribute('x', labelPos.x);
      tag.setAttribute('y', labelPos.y);

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
     ForceDirected.Label.HTML
     
     Custom extension of <Graph.Label.HTML>.

     Extends:

     All <Graph.Label.HTML> methods.

     See also:

     <Graph.Label.HTML>

  */
  ForceDirected.Label.HTML = new Class( {
    Implements: Graph.Label.HTML,

    initialize: function(viz) {
      this.viz = viz;
    },
    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize();
      var labelPos = {
        x: Math.round(pos.x * sx + ox + radius.width / 2),
        y: Math.round(pos.y * sy + oy + radius.height / 2)
      };
      var style = tag.style;
      style.left = labelPos.x + 'px';
      style.top = labelPos.y + 'px';
      style.display = this.fitsInCanvas(labelPos, canvas) ? '' : 'none';

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
    Class: ForceDirected.Plot.NodeTypes

    This class contains a list of <Graph.Node> built-in types. 
    Node types implemented are 'none', 'circle', 'triangle', 'rectangle', 'star', 'ellipse' and 'square'.

    You can add your custom node types, customizing your visualization to the extreme.

    Example:

    (start code js)
      ForceDirected.Plot.NodeTypes.implement({
        'mySpecialType': {
          'render': function(node, canvas) {
            //print your custom node to canvas
          },
          //optional
          'contains': function(node, pos) {
            //return true if pos is inside the node or false otherwise
          }
        }
      });
    (end code)

  */
  ForceDirected.Plot.NodeTypes = new Class({
    'none': {
      'render': $.empty,
      'contains': $.lambda(false)
    },
    'circle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.circle.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.circle.contains(npos, pos, dim);
      }
    },
    'ellipse': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        this.nodeHelper.ellipse.render('fill', pos, width, height, canvas);
        },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        return this.nodeHelper.ellipse.contains(npos, pos, width, height);
      }
    },
    'square': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.square.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.square.contains(npos, pos, dim);
      }
    },
    'rectangle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        this.nodeHelper.rectangle.render('fill', pos, width, height, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        return this.nodeHelper.rectangle.contains(npos, pos, width, height);
      }
    },
    'triangle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.triangle.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos) {
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.triangle.contains(npos, pos, dim);
      }
    },
    'star': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true),
            dim = node.getData('dim');
        this.nodeHelper.star.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos) {
        var npos = node.pos.getc(true),
            dim = node.getData('dim');
        return this.nodeHelper.star.contains(npos, pos, dim);
      }
    }
  });

  /*
    Class: ForceDirected.Plot.EdgeTypes
  
    This class contains a list of <Graph.Adjacence> built-in types. 
    Edge types implemented are 'none', 'line' and 'arrow'.
  
    You can add your custom edge types, customizing your visualization to the extreme.
  
    Example:
  
    (start code js)
      ForceDirected.Plot.EdgeTypes.implement({
        'mySpecialType': {
          'render': function(adj, canvas) {
            //print your custom edge to canvas
          },
          //optional
          'contains': function(adj, pos) {
            //return true if pos is inside the arc or false otherwise
          }
        }
      });
    (end code)
  
  */
  ForceDirected.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'line': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        this.edgeHelper.line.render(from, to, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.line.contains(from, to, pos, this.edge.epsilon);
      }
    },
    'arrow': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            dim = adj.getData('dim'),
            direction = adj.data.$direction,
            inv = (direction && direction.length>1 && direction[0] != adj.nodeFrom.id);
        this.edgeHelper.arrow.render(from, to, dim, inv, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.arrow.contains(from, to, pos, this.edge.epsilon);
      }
    }
  });

})($jit.ForceDirected);


/*
 * File: Treemap.js
 *
*/

$jit.TM = {};

var TM = $jit.TM;

$jit.TM.$extend = true;

/*
  Class: TM.Base
  
  Abstract class providing base functionality for <TM.Squarified>, <TM.Strip> and <TM.SliceAndDice> visualizations.
  
  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.Tips>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed

  orientation - (string) Default's *h*. Whether to set horizontal or vertical layouts. Possible values are 'h' and 'v'.
  titleHeight - (number) Default's *13*. The height of the title rectangle for inner (non-leaf) nodes.
  offset - (number) Default's *2*. Boxes offset.
  constrained - (boolean) Default's *false*. Whether to show the entire tree when loaded or just the number of levels specified by _levelsToShow_.
  levelsToShow - (number) Default's *3*. The number of levels to show for a subtree. This number is relative to the selected node.
  animate - (boolean) Default's *false*. Whether to animate transitions.
  Node.type - Described in <Options.Node>. Default's *rectangle*.
  duration - Described in <Options.Fx>. Default's *700*.
  fps - Described in <Options.Fx>. Default's *45*.
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <TM.Op> instance.
  fx - Access a <TM.Plot> instance.
  labels - Access a <TM.Label> interface implementation.

  Inspired by:
  
  Squarified Treemaps (Mark Bruls, Kees Huizing, and Jarke J. van Wijk) <http://www.win.tue.nl/~vanwijk/stm.pdf>
  
  Tree visualization with tree-maps: 2-d space-filling approach (Ben Shneiderman) <http://hcil.cs.umd.edu/trs/91-03/91-03.html>
  
   Note:
   
   This visualization was built and engineered from scratch, taking only the paper as inspiration, and only shares some features with the visualization described in the paper.

*/
TM.Base = {
  layout: {
    orientation: "h",
    vertical: function(){
      return this.orientation == "v";
    },
    horizontal: function(){
      return this.orientation == "h";
    },
    change: function(){
      this.orientation = this.vertical()? "h" : "v";
    }
  },

  initialize: function(controller){
    var config = {
      orientation: "h",
      titleHeight: 13,
      offset: 2,
      levelsToShow: 0,
      constrained: false,
      animate: false,
      Node: {
        type: 'rectangle',
        overridable: true,
        //we all know why this is not zero,
        //right, Firefox?
        width: 3,
        height: 3,
        color: '#444'
      },
      Label: {
        textAlign: 'center',
        textBaseline: 'top'
      },
      Edge: {
        type: 'none'
      },
      duration: 700,
      fps: 45
    };

    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), config, controller);
    this.layout.orientation = this.config.orientation;

    var canvasConfig = this.config;
    if (canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Complex,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new TM.Label[canvasConfig.Label.type](this);
    this.fx = new TM.Plot(this);
    this.op = new TM.Op(this);
    this.group = new TM.Group(this);
    this.geom = new TM.Geom(this);
    this.clickedNode = null;
    this.busy = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
    Method: refresh 
    
    Computes positions and plots the tree.
  */
  refresh: function(){
    if(this.busy) return;
    this.busy = true;
    var that = this;
    if(this.config.animate) {
      this.compute('end');
      this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode 
          && this.clickedNode.id || this.root));
      this.fx.animate($.merge(this.config, {
        modes: ['linear', 'node-property:width:height'],
        onComplete: function() {
          that.busy = false;
        }
      }));
    } else {
      var labelType = this.config.Label.type;
      if(labelType != 'Native') {
        var that = this;
        this.graph.eachNode(function(n) { that.labels.hideLabel(n, false); });
      }
      this.busy = false;
      this.compute();
      this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode 
          && this.clickedNode.id || this.root));
      this.plot();
    }
  },

  /* 
    Method: plot 
    
    Plots the TreeMap. This is a shortcut to *fx.plot*. 
  
   */
  plot: function(){
    this.fx.plot();
  },

  /* 
  Method: leaf 
  
  Returns whether the node is a leaf.
  
   Parameters:
   
   n - (object) A <Graph.Node>.

 */
  leaf: function(n){
    return n.getSubnodes([
        1, 1
    ], "ignore").length == 0;
  },
  
  /* 
  Method: enter 
  
  Sets the node as root.
  
   Parameters:
   
   n - (object) A <Graph.Node>.

 */
  enter: function(n){
    if(this.busy) return;
    this.busy = true;
    
    var that = this,
        config = this.config,
        graph = this.graph,
        clickedNode = n,
        previousClickedNode = this.clickedNode;

    var callback = {
      onComplete: function() {
        //ensure that nodes are shown for that level
        if(config.levelsToShow > 0) {
          that.geom.setRightLevelToShow(n);
        }
        //compute positions of newly inserted nodes
        if(config.levelsToShow > 0 || config.request) that.compute();
        if(config.animate) {
          //fade nodes
          graph.nodeList.setData('alpha', 0, 'end');
          n.eachSubgraph(function(n) {
            n.setData('alpha', 1, 'end');
          }, "ignore");
          that.fx.animate({
            duration: 500,
            modes:['node-property:alpha'],
            onComplete: function() {
              //compute end positions
              that.clickedNode = clickedNode;
              that.compute('end');
              //animate positions
              //TODO(nico) commenting this line didn't seem to throw errors...
              that.clickedNode = previousClickedNode;
              that.fx.animate({
                modes:['linear', 'node-property:width:height'],
                duration: 1000,
                onComplete: function() { 
                  that.busy = false;
                  //TODO(nico) check comment above
                  that.clickedNode = clickedNode;
                }
              });
            }
          });
        } else {
          that.busy = false;
          that.clickedNode = n;
          that.refresh();
        }
      }
    };
    if(config.request) {
      this.requestNodes(clickedNode, callback);
    } else {
      callback.onComplete();
    }
  },

  /* 
  Method: out 
  
  Sets the parent node of the current selected node as root.

 */
  out: function(){
    if(this.busy) return;
    this.busy = true;
    this.events.hoveredNode = false;
    var that = this,
        config = this.config,
        graph = this.graph,
        parents = graph.getNode(this.clickedNode 
            && this.clickedNode.id || this.root).getParents(),
        parent = parents[0],
        clickedNode = parent,
        previousClickedNode = this.clickedNode;
    
    //if no parents return
    if(!parent) {
      this.busy = false;
      return;
    }
    //final plot callback
    callback = {
      onComplete: function() {
        that.clickedNode = parent;
        if(config.request) {
          that.requestNodes(parent, {
            onComplete: function() {
              that.compute();
              that.plot();
              that.busy = false;
            }
          });
        } else {
          that.compute();
          that.plot();
          that.busy = false;
        }
      }
    };
    //prune tree
    if (config.levelsToShow > 0)
      this.geom.setRightLevelToShow(parent);
    //animate node positions
    if(config.animate) {
      this.clickedNode = clickedNode;
      this.compute('end');
      //animate the visible subtree only
      this.clickedNode = previousClickedNode;
      this.fx.animate({
        modes:['linear', 'node-property:width:height'],
        duration: 1000,
        onComplete: function() {
          //animate the parent subtree
          that.clickedNode = clickedNode;
          //change nodes alpha
          graph.eachNode(function(n) {
            n.setDataset(['current', 'end'], {
              'alpha': [0, 1]
            });
          }, "ignore");
          previousClickedNode.eachSubgraph(function(node) {
            node.setData('alpha', 1);
          }, "ignore");
          that.fx.animate({
            duration: 500,
            modes:['node-property:alpha'],
            onComplete: function() {
              callback.onComplete();
            }
          });
        }
      });
    } else {
      callback.onComplete();
    }
  },

  requestNodes: function(node, onComplete){
    var handler = $.merge(this.controller, onComplete), 
        lev = this.config.levelsToShow;
    if (handler.request) {
      var leaves = [], d = node._depth;
      node.eachLevel(0, lev, function(n){
        var nodeLevel = lev - (n._depth - d);
        if (n.drawn && !n.anySubnode() && nodeLevel > 0) {
          leaves.push(n);
          n._level = nodeLevel;
        }
      });
      this.group.requestNodes(leaves, handler);
    } else {
      handler.onComplete();
    }
  },
  
  reposition: function() {
    this.compute('end');
  }
};

/*
  Class: TM.Op
  
  Custom extension of <Graph.Op>.
  
  Extends:
  
  All <Graph.Op> methods
  
  See also:
  
  <Graph.Op>
  
  */
TM.Op = new Class({
  Implements: Graph.Op,

  initialize: function(viz){
    this.viz = viz;
  }
});

//extend level methods of Graph.Geom
TM.Geom = new Class({
  Implements: Graph.Geom,
  
  getRightLevelToShow: function() {
    return this.viz.config.levelsToShow;
  },
  
  setRightLevelToShow: function(node) {
    var level = this.getRightLevelToShow(), 
        fx = this.viz.labels;
    node.eachLevel(0, level+1, function(n) {
      var d = n._depth - node._depth;
      if(d > level) {
        n.drawn = false; 
        n.exist = false;
        n.ignore = true;
        fx.hideLabel(n, false);
      } else {
        n.drawn = true;
        n.exist = true;
        delete n.ignore;
      }
    });
    node.drawn = true;
    delete node.ignore;
  }
});

/*

Performs operations on group of nodes.

*/
TM.Group = new Class( {

  initialize: function(viz){
    this.viz = viz;
    this.canvas = viz.canvas;
    this.config = viz.config;
  },

  /*
  
    Calls the request method on the controller to request a subtree for each node. 
  */
  requestNodes: function(nodes, controller){
    var counter = 0, len = nodes.length, nodeSelected = {};
    var complete = function(){
      controller.onComplete();
    };
    var viz = this.viz;
    if (len == 0)
      complete();
    for ( var i = 0; i < len; i++) {
      nodeSelected[nodes[i].id] = nodes[i];
      controller.request(nodes[i].id, nodes[i]._level, {
        onComplete: function(nodeId, data){
          if (data && data.children) {
            data.id = nodeId;
            viz.op.sum(data, {
              type: 'nothing'
            });
          }
          if (++counter == len) {
            viz.graph.computeLevels(viz.root, 0);
            complete();
          }
        }
      });
    }
  }
});

/*
  Class: TM.Plot
  
  Custom extension of <Graph.Plot>.
  
  Extends:
  
  All <Graph.Plot> methods
  
  See also:
  
  <Graph.Plot>
  
  */
TM.Plot = new Class({

  Implements: Graph.Plot,

  initialize: function(viz){
    this.viz = viz;
    this.config = viz.config;
    this.node = this.config.Node;
    this.edge = this.config.Edge;
    this.animation = new Animation;
    this.nodeTypes = new TM.Plot.NodeTypes;
    this.edgeTypes = new TM.Plot.EdgeTypes;
    this.labels = viz.labels;
  },

  plot: function(opt, animating){
    var viz = this.viz, 
        graph = viz.graph;
    viz.canvas.clear();
    this.plotTree(graph.getNode(viz.clickedNode && viz.clickedNode.id || viz.root), $.merge(viz.config, opt || {}, {
      'withLabels': true,
      'hideLabels': false,
      'plotSubtree': function(n, ch){
        return n.anySubnode("exist");
      }
    }), animating);
  }
});

/*
  Class: TM.Label
  
  Custom extension of <Graph.Label>. 
  Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.

  Extends:

  All <Graph.Label> methods and subclasses.

  See also:

  <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
*/
TM.Label = {};

/*
 TM.Label.Native

 Custom extension of <Graph.Label.Native>.

 Extends:

 All <Graph.Label.Native> methods

 See also:

 <Graph.Label.Native>
*/
TM.Label.Native = new Class({
  Implements: Graph.Label.Native,

  initialize: function(viz) {
    this.config = viz.config;
    this.leaf = viz.leaf;
  },
  
  renderLabel: function(canvas, node, controller){
    if(!this.leaf(node) && !this.config.titleHeight) return;
    var pos = node.pos.getc(true), 
        ctx = canvas.getCtx(),
        width = node.getData('width'),
        height = node.getData('height'),
        x = pos.x + width/2,
        y = pos.y;
        
    ctx.fillText(node.name, x, y, width);
  }
});

/*
 TM.Label.SVG

  Custom extension of <Graph.Label.SVG>.

  Extends:

  All <Graph.Label.SVG> methods

  See also:

  <Graph.Label.SVG>
*/
TM.Label.SVG = new Class( {
  Implements: Graph.Label.SVG,

  initialize: function(viz){
    this.viz = viz;
    this.leaf = viz.leaf;
    this.config = viz.config;
  },

  /* 
  placeLabel

  Overrides abstract method placeLabel in <Graph.Plot>.

  Parameters:

  tag - A DOM label element.
  node - A <Graph.Node>.
  controller - A configuration/controller object passed to the visualization.
  
  */
  placeLabel: function(tag, node, controller){
    var pos = node.pos.getc(true), 
        canvas = this.viz.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY,
        radius = canvas.getSize();
    var labelPos = {
      x: Math.round(pos.x * sx + ox + radius.width / 2),
      y: Math.round(pos.y * sy + oy + radius.height / 2)
    };
    tag.setAttribute('x', labelPos.x);
    tag.setAttribute('y', labelPos.y);

    if(!this.leaf(node) && !this.config.titleHeight) {
      tag.style.display = 'none';
    }
    controller.onPlaceLabel(tag, node);
  }
});

/*
 TM.Label.HTML

 Custom extension of <Graph.Label.HTML>.

 Extends:

 All <Graph.Label.HTML> methods.

 See also:

 <Graph.Label.HTML>

*/
TM.Label.HTML = new Class( {
  Implements: Graph.Label.HTML,

  initialize: function(viz){
    this.viz = viz;
    this.leaf = viz.leaf;
    this.config = viz.config;
  },

  /* 
    placeLabel
  
    Overrides abstract method placeLabel in <Graph.Plot>.
  
    Parameters:
  
    tag - A DOM label element.
    node - A <Graph.Node>.
    controller - A configuration/controller object passed to the visualization.
  
  */
  placeLabel: function(tag, node, controller){
    var pos = node.pos.getc(true), 
        canvas = this.viz.canvas,
        ox = canvas.translateOffsetX,
        oy = canvas.translateOffsetY,
        sx = canvas.scaleOffsetX,
        sy = canvas.scaleOffsetY,
        radius = canvas.getSize();
    var labelPos = {
      x: Math.round(pos.x * sx + ox + radius.width / 2),
      y: Math.round(pos.y * sy + oy + radius.height / 2)
    };

    var style = tag.style;
    style.left = labelPos.x + 'px';
    style.top = labelPos.y + 'px';
    style.width = node.getData('width') * sx + 'px';
    style.height = node.getData('height') * sy + 'px';
    style.zIndex = node._depth * 100;
    style.display = '';

    if(!this.leaf(node) && !this.config.titleHeight) {
      tag.style.display = 'none';
    }
    controller.onPlaceLabel(tag, node);
  }
});

/*
  Class: TM.Plot.NodeTypes

  This class contains a list of <Graph.Node> built-in types. 
  Node types implemented are 'none', 'rectangle'.

  You can add your custom node types, customizing your visualization to the extreme.

  Example:

  (start code js)
    TM.Plot.NodeTypes.implement({
      'mySpecialType': {
        'render': function(node, canvas) {
          //print your custom node to canvas
        },
        //optional
        'contains': function(node, pos) {
          //return true if pos is inside the node or false otherwise
        }
      }
    });
  (end code)

*/
TM.Plot.NodeTypes = new Class( {
  'none': {
    'render': $.empty
  },

  'rectangle': {
    'render': function(node, canvas, animating){
      var leaf = this.viz.leaf(node),
          config = this.config,
          offst = config.offset,
          titleHeight = config.titleHeight,
          pos = node.pos.getc(true),
          width = node.getData('width'),
          height = node.getData('height'),
          border = node.getData('border'),
          ctx = canvas.getCtx(),
          posx = pos.x + offst / 2, 
          posy = pos.y + offst / 2;
      if(width <= offst || height <= offst) return;
      if (leaf) {
        if(config.cushion) {
          var lg = ctx.createRadialGradient(posx + (width-offst)/2, posy + (height-offst)/2, 1, 
              posx + (width-offst)/2, posy + (height-offst)/2, width < height? height : width);
          var color = node.getData('color');
          var colorGrad = $.rgbToHex($.map($.hexToRgb(color), 
              function(r) { return r * 0.2 >> 0; }));
          lg.addColorStop(0, color);
          lg.addColorStop(1, colorGrad);
          ctx.fillStyle = lg;
        }
        ctx.fillRect(posx, posy, width - offst, height - offst);
        if(border) {
          ctx.save();
          ctx.strokeStyle = border;
          ctx.strokeRect(posx, posy, width - offst, height - offst);
          ctx.restore();
        }
      } else if(titleHeight > 0){
        ctx.fillRect(pos.x + offst / 2, pos.y + offst / 2, width - offst,
            titleHeight - offst);
        if(border) {
          ctx.save();
          ctx.strokeStyle = border;
          ctx.strokeRect(pos.x + offst / 2, pos.y + offst / 2, width - offst,
              height - offst);
          ctx.restore();
        }
      }
    },
    'contains': function(node, pos) {
      if(this.viz.clickedNode && !node.isDescendantOf(this.viz.clickedNode.id) || node.ignore) return false;
      var npos = node.pos.getc(true),
          width = node.getData('width'), 
          leaf = this.viz.leaf(node),
          height = leaf? node.getData('height') : this.config.titleHeight;
      return this.nodeHelper.rectangle.contains({x: npos.x + width/2, y: npos.y + height/2}, pos, width, height);
    }
  }
});

TM.Plot.EdgeTypes = new Class( {
  'none': $.empty
});

/*
  Class: TM.SliceAndDice
  
  A slice and dice TreeMap visualization.
  
  Implements:
  
  All <TM.Base> methods and properties.
*/
TM.SliceAndDice = new Class( {
  Implements: [
      Loader, Extras, TM.Base, Layouts.TM.SliceAndDice
  ]
});

/*
  Class: TM.Squarified
  
  A squarified TreeMap visualization.

  Implements:
  
  All <TM.Base> methods and properties.
*/
TM.Squarified = new Class( {
  Implements: [
      Loader, Extras, TM.Base, Layouts.TM.Squarified
  ]
});

/*
  Class: TM.Strip
  
  A strip TreeMap visualization.

  Implements:
  
  All <TM.Base> methods and properties.
*/
TM.Strip = new Class( {
  Implements: [
      Loader, Extras, TM.Base, Layouts.TM.Strip
  ]
});


/*
 * File: RGraph.js
 *
 */

/*
   Class: RGraph
   
   A radial graph visualization with advanced animations.
   
   Inspired by:
 
   Animated Exploration of Dynamic Graphs with Radial Layout (Ka-Ping Yee, Danyel Fisher, Rachna Dhamija, Marti Hearst) <http://bailando.sims.berkeley.edu/papers/infovis01.htm>
   
   Note:
   
   This visualization was built and engineered from scratch, taking only the paper as inspiration, and only shares some features with the visualization described in the paper.
   
  Implements:
  
  All <Loader> methods
  
   Constructor Options:
   
   Inherits options from
   
   - <Options.Canvas>
   - <Options.Controller>
   - <Options.Node>
   - <Options.Edge>
   - <Options.Label>
   - <Options.Events>
   - <Options.Tips>
   - <Options.NodeStyles>
   - <Options.Navigation>
   
   Additionally, there are other parameters and some default values changed
   
   interpolation - (string) Default's *linear*. Describes the way nodes are interpolated. Possible values are 'linear' and 'polar'.
   levelDistance - (number) Default's *100*. The distance between levels of the tree. 
     
   Instance Properties:

   canvas - Access a <Canvas> instance.
   graph - Access a <Graph> instance.
   op - Access a <RGraph.Op> instance.
   fx - Access a <RGraph.Plot> instance.
   labels - Access a <RGraph.Label> interface implementation.   
*/

$jit.RGraph = new Class( {

  Implements: [
      Loader, Extras, Layouts.Radial
  ],

  initialize: function(controller){
    var $RGraph = $jit.RGraph;

    var config = {
      interpolation: 'linear',
      levelDistance: 100
    };

    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), config, controller);

    var canvasConfig = this.config;
    if(canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Polar,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new $RGraph.Label[canvasConfig.Label.type](this);
    this.fx = new $RGraph.Plot(this, $RGraph);
    this.op = new $RGraph.Op(this);
    this.json = null;
    this.root = null;
    this.busy = false;
    this.parent = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
  
    createLevelDistanceFunc 
  
    Returns the levelDistance function used for calculating a node distance 
    to its origin. This function returns a function that is computed 
    per level and not per node, such that all nodes with the same depth will have the 
    same distance to the origin. The resulting function gets the 
    parent node as parameter and returns a float.

   */
  createLevelDistanceFunc: function(){
    var ld = this.config.levelDistance;
    return function(elem){
      return (elem._depth + 1) * ld;
    };
  },

  /* 
     Method: refresh 
     
     Computes positions and plots the tree.

   */
  refresh: function(){
    this.compute();
    this.plot();
  },

  reposition: function(){
    this.compute('end');
  },

  /*
   Method: plot
  
   Plots the RGraph. This is a shortcut to *fx.plot*.
  */
  plot: function(){
    this.fx.plot();
  },
  /*
   getNodeAndParentAngle
  
   Returns the _parent_ of the given node, also calculating its angle span.
  */
  getNodeAndParentAngle: function(id){
    var theta = false;
    var n = this.graph.getNode(id);
    var ps = n.getParents();
    var p = (ps.length > 0)? ps[0] : false;
    if (p) {
      var posParent = p.pos.getc(), posChild = n.pos.getc();
      var newPos = posParent.add(posChild.scale(-1));
      theta = Math.atan2(newPos.y, newPos.x);
      if (theta < 0)
        theta += 2 * Math.PI;
    }
    return {
      parent: p,
      theta: theta
    };
  },
  /*
   tagChildren
  
   Enumerates the children in order to maintain child ordering (second constraint of the paper).
  */
  tagChildren: function(par, id){
    if (par.angleSpan) {
      var adjs = [];
      par.eachAdjacency(function(elem){
        adjs.push(elem.nodeTo);
      }, "ignore");
      var len = adjs.length;
      for ( var i = 0; i < len && id != adjs[i].id; i++)
        ;
      for ( var j = (i + 1) % len, k = 0; id != adjs[j].id; j = (j + 1) % len) {
        adjs[j].dist = k++;
      }
    }
  },
  /* 
  Method: onClick 
  
  Animates the <RGraph> to center the node specified by *id*.

   Parameters:

   id - A <Graph.Node> id.
   opt - (optional|object) An object containing some extra properties described below
   hideLabels - (boolean) Default's *true*. Hide labels when performing the animation.

   Example:

   (start code js)
     rgraph.onClick('someid');
     //or also...
     rgraph.onClick('someid', {
      hideLabels: false
     });
    (end code)
    
  */
  onClick: function(id, opt){
    if (this.root != id && !this.busy) {
      this.busy = true;
      this.root = id;
      var that = this;
      this.controller.onBeforeCompute(this.graph.getNode(id));
      var obj = this.getNodeAndParentAngle(id);

      // second constraint
      this.tagChildren(obj.parent, id);
      this.parent = obj.parent;
      this.compute('end');

      // first constraint
      var thetaDiff = obj.theta - obj.parent.endPos.theta;
      this.graph.eachNode(function(elem){
        elem.endPos.set(elem.endPos.getp().add($P(thetaDiff, 0)));
      });

      var mode = this.config.interpolation;
      opt = $.merge( {
        onComplete: $.empty
      }, opt || {});

      this.fx.animate($.merge( {
        hideLabels: true,
        modes: [
          mode
        ]
      }, opt, {
        onComplete: function(){
          that.busy = false;
          opt.onComplete();
        }
      }));
    }
  }
});

$jit.RGraph.$extend = true;

(function(RGraph){

  /*
     Class: RGraph.Op
     
     Custom extension of <Graph.Op>.

     Extends:

     All <Graph.Op> methods
     
     See also:
     
     <Graph.Op>

  */
  RGraph.Op = new Class( {

    Implements: Graph.Op

  });

  /*
     Class: RGraph.Plot
    
    Custom extension of <Graph.Plot>.
  
    Extends:
  
    All <Graph.Plot> methods
    
    See also:
    
    <Graph.Plot>
  
  */
  RGraph.Plot = new Class( {

    Implements: Graph.Plot

  });

  /*
    Object: RGraph.Label

    Custom extension of <Graph.Label>. 
    Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.
  
    Extends:
  
    All <Graph.Label> methods and subclasses.
  
    See also:
  
    <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.
  
   */
  RGraph.Label = {};

  /*
     RGraph.Label.Native

     Custom extension of <Graph.Label.Native>.

     Extends:

     All <Graph.Label.Native> methods

     See also:

     <Graph.Label.Native>

  */
  RGraph.Label.Native = new Class( {
    Implements: Graph.Label.Native
  });

  /*
     RGraph.Label.SVG
    
    Custom extension of <Graph.Label.SVG>.
  
    Extends:
  
    All <Graph.Label.SVG> methods
  
    See also:
  
    <Graph.Label.SVG>
  
  */
  RGraph.Label.SVG = new Class( {
    Implements: Graph.Label.SVG,

    initialize: function(viz){
      this.viz = viz;
    },

    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller){
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize();
      var labelPos = {
        x: Math.round(pos.x * sx + ox + radius.width / 2),
        y: Math.round(pos.y * sy + oy + radius.height / 2)
      };
      tag.setAttribute('x', labelPos.x);
      tag.setAttribute('y', labelPos.y);

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
     RGraph.Label.HTML

     Custom extension of <Graph.Label.HTML>.

     Extends:

     All <Graph.Label.HTML> methods.

     See also:

     <Graph.Label.HTML>

  */
  RGraph.Label.HTML = new Class( {
    Implements: Graph.Label.HTML,

    initialize: function(viz){
      this.viz = viz;
    },
    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller){
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize();
      var labelPos = {
        x: Math.round(pos.x * sx + ox + radius.width / 2),
        y: Math.round(pos.y * sy + oy + radius.height / 2)
      };

      var style = tag.style;
      style.left = labelPos.x + 'px';
      style.top = labelPos.y + 'px';
      style.display = this.fitsInCanvas(labelPos, canvas)? '' : 'none';

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
    Class: RGraph.Plot.NodeTypes

    This class contains a list of <Graph.Node> built-in types. 
    Node types implemented are 'none', 'circle', 'triangle', 'rectangle', 'star', 'ellipse' and 'square'.

    You can add your custom node types, customizing your visualization to the extreme.

    Example:

    (start code js)
      RGraph.Plot.NodeTypes.implement({
        'mySpecialType': {
          'render': function(node, canvas) {
            //print your custom node to canvas
          },
          //optional
          'contains': function(node, pos) {
            //return true if pos is inside the node or false otherwise
          }
        }
      });
    (end code)

  */
  RGraph.Plot.NodeTypes = new Class({
    'none': {
      'render': $.empty,
      'contains': $.lambda(false)
    },
    'circle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.circle.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.circle.contains(npos, pos, dim);
      }
    },
    'ellipse': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        this.nodeHelper.ellipse.render('fill', pos, width, height, canvas);
        },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        return this.nodeHelper.ellipse.contains(npos, pos, width, height);
      }
    },
    'square': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.square.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.square.contains(npos, pos, dim);
      }
    },
    'rectangle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        this.nodeHelper.rectangle.render('fill', pos, width, height, canvas);
      },
      'contains': function(node, pos){
        var npos = node.pos.getc(true), 
            width = node.getData('width'), 
            height = node.getData('height');
        return this.nodeHelper.rectangle.contains(npos, pos, width, height);
      }
    },
    'triangle': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true), 
            dim = node.getData('dim');
        this.nodeHelper.triangle.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos) {
        var npos = node.pos.getc(true), 
            dim = node.getData('dim');
        return this.nodeHelper.triangle.contains(npos, pos, dim);
      }
    },
    'star': {
      'render': function(node, canvas){
        var pos = node.pos.getc(true),
            dim = node.getData('dim');
        this.nodeHelper.star.render('fill', pos, dim, canvas);
      },
      'contains': function(node, pos) {
        var npos = node.pos.getc(true),
            dim = node.getData('dim');
        return this.nodeHelper.star.contains(npos, pos, dim);
      }
    }
  });

  /*
    Class: RGraph.Plot.EdgeTypes

    This class contains a list of <Graph.Adjacence> built-in types. 
    Edge types implemented are 'none', 'line' and 'arrow'.
  
    You can add your custom edge types, customizing your visualization to the extreme.
  
    Example:
  
    (start code js)
      RGraph.Plot.EdgeTypes.implement({
        'mySpecialType': {
          'render': function(adj, canvas) {
            //print your custom edge to canvas
          },
          //optional
          'contains': function(adj, pos) {
            //return true if pos is inside the arc or false otherwise
          }
        }
      });
    (end code)
  
  */
  RGraph.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'line': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        this.edgeHelper.line.render(from, to, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.line.contains(from, to, pos, this.edge.epsilon);
      }
    },
    'arrow': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            dim = adj.getData('dim'),
            direction = adj.data.$direction,
            inv = (direction && direction.length>1 && direction[0] != adj.nodeFrom.id);
        this.edgeHelper.arrow.render(from, to, dim, inv, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true);
        return this.edgeHelper.arrow.contains(from, to, pos, this.edge.epsilon);
      }
    }
  });

})($jit.RGraph);


/*
 * File: Hypertree.js
 * 
*/

/* 
     Complex 
     
     A multi-purpose Complex Class with common methods. Extended for the Hypertree. 
 
*/
/* 
   moebiusTransformation 
 
   Calculates a moebius transformation for this point / complex. 
    For more information go to: 
        http://en.wikipedia.org/wiki/Moebius_transformation. 
 
   Parameters: 
 
      c - An initialized Complex instance representing a translation Vector. 
*/

Complex.prototype.moebiusTransformation = function(c) {
  var num = this.add(c);
  var den = c.$conjugate().$prod(this);
  den.x++;
  return num.$div(den);
};

/* 
    moebiusTransformation 
     
    Calculates a moebius transformation for the hyperbolic tree. 
     
    <http://en.wikipedia.org/wiki/Moebius_transformation> 
      
     Parameters: 
     
        graph - A <Graph> instance.
        pos - A <Complex>.
        prop - A property array.
        theta - Rotation angle. 
        startPos - _optional_ start position. 
*/
Graph.Util.moebiusTransformation = function(graph, pos, prop, startPos, flags) {
  this.eachNode(graph, function(elem) {
    for ( var i = 0; i < prop.length; i++) {
      var p = pos[i].scale(-1), property = startPos ? startPos : prop[i];
      elem.getPos(prop[i]).set(elem.getPos(property).getc().moebiusTransformation(p));
    }
  }, flags);
};

/* 
   Class: Hypertree 
   
   A Hyperbolic Tree/Graph visualization.
   
   Inspired by:
 
   A Focus+Context Technique Based on Hyperbolic Geometry for Visualizing Large Hierarchies (John Lamping, Ramana Rao, and Peter Pirolli). 
   <http://www.cs.tau.ac.il/~asharf/shrek/Projects/HypBrowser/startree-chi95.pdf>
 
  Note:
 
  This visualization was built and engineered from scratch, taking only the paper as inspiration, and only shares some features with the Hypertree described in the paper.

  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.Tips>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed
  
  radius - (string|number) Default's *auto*. The radius of the disc to plot the <Hypertree> in. 'auto' will take the smaller value from the width and height canvas dimensions. You can also set this to a custom value, for example *250*.
  offset - (number) Default's *0*. A number in the range [0, 1) that will be substracted to each node position to make a more compact <Hypertree>. This will avoid placing nodes too far from each other when a there's a selected node.
  fps - Described in <Options.Fx>. It's default value has been changed to *35*.
  duration - Described in <Options.Fx>. It's default value has been changed to *1500*.
  Edge.type - Described in <Options.Edge>. It's default value has been changed to *hyperline*. 
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <Hypertree.Op> instance.
  fx - Access a <Hypertree.Plot> instance.
  labels - Access a <Hypertree.Label> interface implementation.

*/

$jit.Hypertree = new Class( {

  Implements: [ Loader, Extras, Layouts.Radial ],

  initialize: function(controller) {
    var $Hypertree = $jit.Hypertree;

    var config = {
      radius: "auto",
      offset: 0,
      Edge: {
        type: 'hyperline'
      },
      duration: 1500,
      fps: 35
    };
    this.controller = this.config = $.merge(Options("Canvas", "Node", "Edge",
        "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), config, controller);

    var canvasConfig = this.config;
    if(canvasConfig.useCanvas) {
      this.canvas = canvasConfig.useCanvas;
      this.config.labelContainer = this.canvas.id + '-label';
    } else {
      if(canvasConfig.background) {
        canvasConfig.background = $.merge({
          type: 'Circles'
        }, canvasConfig.background);
      }
      this.canvas = new Canvas(this, canvasConfig);
      this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
    }

    this.graphOptions = {
      'klass': Polar,
      'Node': {
        'selected': false,
        'exist': true,
        'drawn': true
      }
    };
    this.graph = new Graph(this.graphOptions, this.config.Node,
        this.config.Edge);
    this.labels = new $Hypertree.Label[canvasConfig.Label.type](this);
    this.fx = new $Hypertree.Plot(this, $Hypertree);
    this.op = new $Hypertree.Op(this);
    this.json = null;
    this.root = null;
    this.busy = false;
    // initialize extras
    this.initializeExtras();
  },

  /* 
  
  createLevelDistanceFunc 

  Returns the levelDistance function used for calculating a node distance 
  to its origin. This function returns a function that is computed 
  per level and not per node, such that all nodes with the same depth will have the 
  same distance to the origin. The resulting function gets the 
  parent node as parameter and returns a float.

  */
  createLevelDistanceFunc: function() {
    // get max viz. length.
    var r = this.getRadius();
    // get max depth.
    var depth = 0, max = Math.max, config = this.config;
    this.graph.eachNode(function(node) {
      depth = max(node._depth, depth);
    }, "ignore");
    depth++;
    // node distance generator
    var genDistFunc = function(a) {
      return function(node) {
        node.scale = r;
        var d = node._depth + 1;
        var acum = 0, pow = Math.pow;
        while (d) {
          acum += pow(a, d--);
        }
        return acum - config.offset;
      };
    };
    // estimate better edge length.
    for ( var i = 0.51; i <= 1; i += 0.01) {
      var valSeries = (1 - Math.pow(i, depth)) / (1 - i);
      if (valSeries >= 2) { return genDistFunc(i - 0.01); }
    }
    return genDistFunc(0.75);
  },

  /* 
    Method: getRadius 
    
    Returns the current radius of the visualization. If *config.radius* is *auto* then it 
    calculates the radius by taking the smaller size of the <Canvas> widget.
    
    See also:
    
    <Canvas.getSize>
   
  */
  getRadius: function() {
    var rad = this.config.radius;
    if (rad !== "auto") { return rad; }
    var s = this.canvas.getSize();
    return Math.min(s.width, s.height) / 2;
  },

  /* 
    Method: refresh 
    
    Computes positions and plots the tree.

    Parameters:

    reposition - (optional|boolean) Set this to *true* to force all positions (current, start, end) to match.

   */
  refresh: function(reposition) {
    if (reposition) {
      this.reposition();
      this.graph.eachNode(function(node) {
        node.startPos.rho = node.pos.rho = node.endPos.rho;
        node.startPos.theta = node.pos.theta = node.endPos.theta;
      });
    } else {
      this.compute();
    }
    this.plot();
  },

  /* 
   reposition 
   
   Computes nodes' positions and restores the tree to its previous position.

   For calculating nodes' positions the root must be placed on its origin. This method does this 
     and then attemps to restore the hypertree to its previous position.
    
  */
  reposition: function() {
    this.compute('end');
    var vector = this.graph.getNode(this.root).pos.getc().scale(-1);
    Graph.Util.moebiusTransformation(this.graph, [ vector ], [ 'end' ],
        'end', "ignore");
    this.graph.eachNode(function(node) {
      if (node.ignore) {
        node.endPos.rho = node.pos.rho;
        node.endPos.theta = node.pos.theta;
      }
    });
  },

  /* 
   Method: plot 
   
   Plots the <Hypertree>. This is a shortcut to *fx.plot*. 

  */
  plot: function() {
    this.fx.plot();
  },

  /* 
   Method: onClick 
   
   Animates the <Hypertree> to center the node specified by *id*.

   Parameters:

   id - A <Graph.Node> id.
   opt - (optional|object) An object containing some extra properties described below
   hideLabels - (boolean) Default's *true*. Hide labels when performing the animation.

   Example:

   (start code js)
     ht.onClick('someid');
     //or also...
     ht.onClick('someid', {
      hideLabels: false
     });
    (end code)
    
  */
  onClick: function(id, opt) {
    var pos = this.graph.getNode(id).pos.getc(true);
    this.move(pos, opt);
  },

  /* 
   Method: move 

   Translates the tree to the given position. 

   Parameters:

   pos - (object) A *x, y* coordinate object where x, y in [0, 1), to move the tree to.
   opt - This object has been defined in <Hypertree.onClick>
   
   Example:
   
   (start code js)
     ht.move({ x: 0, y: 0.7 }, {
       hideLabels: false
     });
   (end code)

  */
  move: function(pos, opt) {
    var versor = $C(pos.x, pos.y);
    if (this.busy === false && versor.norm() < 1) {
      this.busy = true;
      var root = this.graph.getClosestNodeToPos(versor), that = this;
      this.graph.computeLevels(root.id, 0);
      this.controller.onBeforeCompute(root);
      opt = $.merge( {
        onComplete: $.empty
      }, opt || {});
      this.fx.animate($.merge( {
        modes: [ 'moebius' ],
        hideLabels: true
      }, opt, {
        onComplete: function() {
          that.busy = false;
          opt.onComplete();
        }
      }), versor);
    }
  }
});

$jit.Hypertree.$extend = true;

(function(Hypertree) {

  /* 
     Class: Hypertree.Op 
   
     Custom extension of <Graph.Op>.

     Extends:

     All <Graph.Op> methods
     
     See also:
     
     <Graph.Op>

  */
  Hypertree.Op = new Class( {

    Implements: Graph.Op

  });

  /* 
     Class: Hypertree.Plot 
   
    Custom extension of <Graph.Plot>.
  
    Extends:
  
    All <Graph.Plot> methods
    
    See also:
    
    <Graph.Plot>
  
  */
  Hypertree.Plot = new Class( {

    Implements: Graph.Plot

  });

  /*
    Object: Hypertree.Label

    Custom extension of <Graph.Label>. 
    Contains custom <Graph.Label.SVG>, <Graph.Label.HTML> and <Graph.Label.Native> extensions.
  
    Extends:
  
    All <Graph.Label> methods and subclasses.
  
    See also:
  
    <Graph.Label>, <Graph.Label.Native>, <Graph.Label.HTML>, <Graph.Label.SVG>.

   */
  Hypertree.Label = {};

  /*
     Hypertree.Label.Native

     Custom extension of <Graph.Label.Native>.

     Extends:

     All <Graph.Label.Native> methods

     See also:

     <Graph.Label.Native>

  */
  Hypertree.Label.Native = new Class( {
    Implements: Graph.Label.Native,

    initialize: function(viz) {
      this.viz = viz;
    },

    renderLabel: function(canvas, node, controller) {
      var ctx = canvas.getCtx();
      var coord = node.pos.getc(true);
      var s = this.viz.getRadius();
      ctx.fillText(node.name, coord.x * s, coord.y * s);
    }
  });

  /*
     Hypertree.Label.SVG

    Custom extension of <Graph.Label.SVG>.
  
    Extends:
  
    All <Graph.Label.SVG> methods
  
    See also:
  
    <Graph.Label.SVG>
  
  */
  Hypertree.Label.SVG = new Class( {
    Implements: Graph.Label.SVG,

    initialize: function(viz) {
      this.viz = viz;
    },

    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize(),
          r = this.viz.getRadius();
      var labelPos = {
        x: Math.round((pos.x * sx) * r + ox + radius.width / 2),
        y: Math.round((pos.y * sy) * r + oy + radius.height / 2)
      };
      tag.setAttribute('x', labelPos.x);
      tag.setAttribute('y', labelPos.y);
      controller.onPlaceLabel(tag, node);
    }
  });

  /*
     Hypertree.Label.HTML

     Custom extension of <Graph.Label.HTML>.

     Extends:

     All <Graph.Label.HTML> methods.

     See also:

     <Graph.Label.HTML>

  */
  Hypertree.Label.HTML = new Class( {
    Implements: Graph.Label.HTML,

    initialize: function(viz) {
      this.viz = viz;
    },
    /* 
       placeLabel

       Overrides abstract method placeLabel in <Graph.Plot>.

       Parameters:

       tag - A DOM label element.
       node - A <Graph.Node>.
       controller - A configuration/controller object passed to the visualization.
      
     */
    placeLabel: function(tag, node, controller) {
      var pos = node.pos.getc(true), 
          canvas = this.viz.canvas,
          ox = canvas.translateOffsetX,
          oy = canvas.translateOffsetY,
          sx = canvas.scaleOffsetX,
          sy = canvas.scaleOffsetY,
          radius = canvas.getSize(),
          r = this.viz.getRadius();
      var labelPos = {
        x: Math.round((pos.x * sx) * r + ox + radius.width / 2),
        y: Math.round((pos.y * sy) * r + oy + radius.height / 2)
      };
      var style = tag.style;
      style.left = labelPos.x + 'px';
      style.top = labelPos.y + 'px';
      style.display = this.fitsInCanvas(labelPos, canvas) ? '' : 'none';

      controller.onPlaceLabel(tag, node);
    }
  });

  /*
    Class: Hypertree.Plot.NodeTypes

    This class contains a list of <Graph.Node> built-in types. 
    Node types implemented are 'none', 'circle', 'triangle', 'rectangle', 'star', 'ellipse' and 'square'.

    You can add your custom node types, customizing your visualization to the extreme.

    Example:

    (start code js)
      Hypertree.Plot.NodeTypes.implement({
        'mySpecialType': {
          'render': function(node, canvas) {
            //print your custom node to canvas
          },
          //optional
          'contains': function(node, pos) {
            //return true if pos is inside the node or false otherwise
          }
        }
      });
    (end code)

  */
  Hypertree.Plot.NodeTypes = new Class({
    'none': {
      'render': $.empty,
      'contains': $.lambda(false)
    },
    'circle': {
      'render': function(node, canvas) {
        var nconfig = this.node,
            dim = node.getData('dim'),
            p = node.pos.getc();
        dim = nconfig.transform? dim * (1 - p.squaredNorm()) : dim;
        p.$scale(node.scale);
        if (dim > 0.2) {
          this.nodeHelper.circle.render('fill', p, dim, canvas);
        }
      },
      'contains': function(node, pos) {
        var dim = node.getData('dim'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.circle.contains(npos, pos, dim);
      }
    },
    'ellipse': {
      'render': function(node, canvas) {
        var pos = node.pos.getc().$scale(node.scale),
            width = node.getData('width'),
            height = node.getData('height');
        this.nodeHelper.ellipse.render('fill', pos, width, height, canvas);
      },
      'contains': function(node, pos) {
        var width = node.getData('width'),
            height = node.getData('height'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.circle.contains(npos, pos, width, height);
      }
    },
    'square': {
      'render': function(node, canvas) {
        var nconfig = this.node,
            dim = node.getData('dim'),
            p = node.pos.getc();
        dim = nconfig.transform? dim * (1 - p.squaredNorm()) : dim;
        p.$scale(node.scale);
        if (dim > 0.2) {
          this.nodeHelper.square.render('fill', p, dim, canvas);
        }
      },
      'contains': function(node, pos) {
        var dim = node.getData('dim'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.square.contains(npos, pos, dim);
      }
    },
    'rectangle': {
      'render': function(node, canvas) {
        var nconfig = this.node,
            width = node.getData('width'),
            height = node.getData('height'),
            pos = node.pos.getc();
        width = nconfig.transform? width * (1 - pos.squaredNorm()) : width;
        height = nconfig.transform? height * (1 - pos.squaredNorm()) : height;
        pos.$scale(node.scale);
        if (width > 0.2 && height > 0.2) {
          this.nodeHelper.rectangle.render('fill', pos, width, height, canvas);
        }
      },
      'contains': function(node, pos) {
        var width = node.getData('width'),
            height = node.getData('height'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.rectangle.contains(npos, pos, width, height);
      }
    },
    'triangle': {
      'render': function(node, canvas) {
        var nconfig = this.node,
            dim = node.getData('dim'),
            p = node.pos.getc();
        dim = nconfig.transform? dim * (1 - p.squaredNorm()) : dim;
        p.$scale(node.scale);
        if (dim > 0.2) {
          this.nodeHelper.triangle.render('fill', p, dim, canvas);
        }
      },
      'contains': function(node, pos) {
        var dim = node.getData('dim'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.triangle.contains(npos, pos, dim);
      }
    },
    'star': {
      'render': function(node, canvas) {
        var nconfig = this.node,
            dim = node.getData('dim'),
            p = node.pos.getc();
        dim = nconfig.transform? dim * (1 - p.squaredNorm()) : dim;
        p.$scale(node.scale);
        if (dim > 0.2) {
          this.nodeHelper.star.render('fill', p, dim, canvas);
        }
      },
      'contains': function(node, pos) {
        var dim = node.getData('dim'),
            npos = node.pos.getc().$scale(node.scale);
        return this.nodeHelper.star.contains(npos, pos, dim);
      }
    }
  });

  /*
   Class: Hypertree.Plot.EdgeTypes

    This class contains a list of <Graph.Adjacence> built-in types. 
    Edge types implemented are 'none', 'line', 'arrow' and 'hyperline'.
  
    You can add your custom edge types, customizing your visualization to the extreme.
  
    Example:
  
    (start code js)
      Hypertree.Plot.EdgeTypes.implement({
        'mySpecialType': {
          'render': function(adj, canvas) {
            //print your custom edge to canvas
          },
          //optional
          'contains': function(adj, pos) {
            //return true if pos is inside the arc or false otherwise
          }
        }
      });
    (end code)
  
  */
  Hypertree.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'line': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
          to = adj.nodeTo.pos.getc(true),
          r = adj.nodeFrom.scale;
          this.edgeHelper.line.render({x:from.x*r, y:from.y*r}, {x:to.x*r, y:to.y*r}, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            r = adj.nodeFrom.scale;
            this.edgeHelper.line.contains({x:from.x*r, y:from.y*r}, {x:to.x*r, y:to.y*r}, pos, this.edge.epsilon);
      }
    },
    'arrow': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            r = adj.nodeFrom.scale,
            dim = adj.getData('dim'),
            direction = adj.data.$direction,
            inv = (direction && direction.length>1 && direction[0] != adj.nodeFrom.id);
        this.edgeHelper.arrow.render({x:from.x*r, y:from.y*r}, {x:to.x*r, y:to.y*r}, dim, inv, canvas);
      },
      'contains': function(adj, pos) {
        var from = adj.nodeFrom.pos.getc(true),
            to = adj.nodeTo.pos.getc(true),
            r = adj.nodeFrom.scale;
        this.edgeHelper.arrow.contains({x:from.x*r, y:from.y*r}, {x:to.x*r, y:to.y*r}, pos, this.edge.epsilon);
      }
    },
    'hyperline': {
      'render': function(adj, canvas) {
        var from = adj.nodeFrom.pos.getc(),
            to = adj.nodeTo.pos.getc(),
            dim = this.viz.getRadius();
        this.edgeHelper.hyperline.render(from, to, dim, canvas);
      },
      'contains': $.lambda(false)
    }
  });

})($jit.Hypertree);




 })();