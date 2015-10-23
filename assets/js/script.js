// IIFE
;(function() {
    /*
     * Basic DOM Selector
     *
     * @param  {String}         selector
     * @param  {HTMLElement}    el
     * Even though i prevent IE8 support, i want to include
     */
    var R_SELECTOR = /^(\w+)?(#[\w_-]+)?((?:\.[\w_-]+)*)/i;
    function $(selector, el) {
        'use strict';
        var spec = {}, classSelector;
        el = (el) ? el : document;
        if(el.querySelector){
            return el.querySelector(selector);
            // Note: the returned object is a NodeList.
            // If you'd like to convert it to a Array for convenience, use this instead:
            // return Array.prototype.slice.call(el.querySelectorAll(selector));
        } else {
            selector = R_SELECTOR.exec(selector);
            spec.tag = selector[1] || 'div';
            spec.id = (selector[2] || '').substr(1);
            // split ClassNames
            classSelector = (selector[3] || '').split('.');
            spec.className = classSelector.join(' ');
            if(spec.id){ return (document.getElementById(spec.id) || null); }
            else if(spec.className){ return (el.getElementsByClassName(spec.className)[0] || null);}//return (__getElementsByClassName(el, spec.classname)[0] || null); }
            else { return (el.getElementsByTagName(spec.tag)[0] || null); }
        }
    }

    function $$(selector, el) {
        'use strict';
        var spec = {}, classSelector;
        el = (el) ? el : document;
        if(el.querySelectorAll){
            // return el.querySelectorAll(selector);
            // Note: the returned object is a NodeList.
            // If you'd like to convert it to a Array for convenience, use this instead:
            return Array.prototype.slice.call(el.querySelectorAll(selector));
        } else {
            selector = R_SELECTOR.exec(selector);
            spec.tag = selector[1] || 'div';
            spec.id = (selector[2] || '').substr(1);
            // split ClassNames
            classSelector = (selector[3] || '').split('.');
            spec.className = classSelector.join(' ');
            if(spec.id){ return (document.getElementById(spec.id) || null); }
            else if(spec.className){ return (el.getElementsByClassName(spec.className)[0] || null); }
            else { return (el.getElementsByTagName(spec.tag) || null); }
        }
    }

    /*
     * Bind events to elements
     *
     * @param  {HTMLElement}   el
     * @param  {Event}     event
     * @param  {Function}    fn
     */
    function _bind(el, event, fn) {
        'use strict';
        if (typeof el.addEventListener === "function") {
            el.addEventListener(event, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + event, fn);
        }
    }

    /*
     * utility for joining classNames together.
     * _classNames('foo', 'bar'); // => 'foo bar'
     * _classNames('foo', { bar: false }); // => 'foo'
     */
    function _classNames() {
        'use strict';
        var classes = '';
        var arg;

        for (var i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            if (!arg) {
                continue;
            }

            if ('string' === typeof arg || 'number' === typeof arg) {
                classes += ' ' + arg;
            } else if (Object.prototype.toString.call(arg) === '[object Array]') {
                classes += ' ' + _classNames.apply(null, arg);
            } else if ('object' === typeof arg) {
                for (var key in arg) {
                    if (!arg.hasOwnProperty(key) || !arg[key]) {
                        continue;
                    }
                    classes += ' ' + key;
                }
            }
        }
        return classes.substr(1);
    }

    /*
     * Object iterator
     * @param  {Object|Array}  obj
     * @param  {Function}      iterator
     */
    function _each(obj, iterator) {
        'use strict';
        if (obj) {
            for (var key in obj) {
                /* istanbul ignore else */
                if (obj.hasOwnProperty(key)) {
                    iterator(obj[key], key, obj);
                }
            }
        }
    }

    function scrollTo(y, callback, duration) {
        // if callback is an integer, that no callback is defined
        callback = (Number(callback) === callback) ? undefined : callback;
        duration = (Number(callback) === callback) ? callback : duration || 500;

        // easing functions http://goo.gl/5HLl8
        Math.easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return c/2*t*t + b;
            }
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        Math.easeInCubic = function(t, b, c, d) {
            var tc = (t/=d)*t*t;
            return b+c*(tc);
        };

        Math.inOutQuintic = function(t, b, c, d) {
            var ts = (t/=d)*t,
            tc = ts*t;
            return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
        };

        // requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
        var requestAnimFrame = (function(){
            return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
        })();

        // because it's so fucking difficult to detect the scrolling element, just move them all
        function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        }
        function position() {
            return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
        }
        function animateScroll() {
            // increment the time
            currentTime += increment;
            // find the value with the quadratic in-out easing function
            var val = Math.easeInOutQuad(currentTime, startY, change, duration);
            // move the document.body
            move(val);
            // do the animation unless its over
            if (currentTime < duration) {
                requestAnimFrame(animateScroll);
            } else {
                if (callback && typeof(callback) === 'function') {
                    // the animation is done so lets callback
                    callback();
                }
            }
        }
        var startY = position(),
            change = y - startY,
            currentTime = 0,
            increment = 20;
        animateScroll();
    }

    function checkboxClickOutside(popupDiv, checkboxElement, labelElement){
        'use strict';
        var isOutSide = true;

        _bind(document.body, 'click', function(){
             if(isOutSide){
                checkboxElement.checked = false;
             }
             isOutSide = true;
        });

        _each([popupDiv, checkboxElement, labelElement], function(el) {
            _bind(el, 'click', function() {
                isOutSide=false;
            });
        });
    }

    checkboxClickOutside(document.getElementById('sidebar'), document.getElementById('sidebar-shown'), document.getElementById('sidebar-link'));


    var sidebar = $('ul', $('#sidebar')),
        scrollItems = [];
    // for each navigation item
    _each( $$('li', sidebar), function(navItem) {
        var anchor = $('a', navItem);
        // bind an click event
        _bind(anchor, 'click', function(evt) {
            evt.preventDefault();
            var target = $(evt.target.getAttribute('href'));
            scrollTo(target.offsetTop, function(){}, 1200);

        });
        // and push to an array
        scrollItems.push(anchor);
    });

    _bind(window, 'scroll', function(evt) {
        var curPos = (document.documentElement.scrollTop || document.body.scrollTop) + 4;

        // filter all possible items
        var cur = scrollItems.filter(function(item) {
            return ($(item.getAttribute('href')).offsetTop < curPos) ? true : false;
        });

        // return the last item in the array
        cur = cur[cur.length - 1];

        scrollItems.forEach(function(item) {
            item.parentNode.className = _classNames({
                'clean-menu--active': item == cur
            });
        });
    });

    var darkThemeActive = false;
    _bind($('#toggle-theme'), 'click', function(evt) {
        darkThemeActive = !darkThemeActive;
        document.body.className = _classNames({
            'dark-theme': darkThemeActive
        });

    });

}());
