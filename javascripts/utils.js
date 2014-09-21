(function(Util) {

    'use strict';

    // DOM utilities
    Util.DOM = {
        qs: function(selector, scope) {

            scope = (scope instanceof NodeList) ? scope[0].parentNode : scope;

            return (scope || document).querySelector(selector);

        },
        qsa: function(selector, scope) {

            scope = (scope instanceof NodeList) ? scope[0].parentNode : scope;

            return (scope || document).querySelectorAll(selector);

        },
        parent: function (element, tagName) {

            if (!element.parentNode) return false;

            var $elementTag = tagName.toLowerCase();
            var $parentTag  = element.parentNode.tagName.toString().toLowerCase();

            if ($parentTag === $elementTag) {
                return element.parentNode;
            }

            return Util.DOM(element.parentNode, tagName);

        },
        on: function(target, type, callback, useCapture) {

            if(!(target instanceof HTMLElement)) {
                for(var i = 0; i < target.length; i++) {
                    Util.DOM.on(target[i], type, callback, useCapture);
                }
                return;
            }

            target.addEventListener(type, callback, !!useCapture);

        },
        addClass: function(target, className) {

            if(!Util.DOM.hasClass(target, className)) {
                target.className = target.className + ' ' + className;
            }

        },
        removeClass: function(target, className) {

            if(target instanceof NodeList) {
                for(var i = 0; i < target.length; i++) {
                    Util.DOM.removeClass(target[i], className);
                }
                return;
            }

            if(Util.DOM.hasClass(target, className)) {
                var regex = new RegExp('(?:^|\\s)'+ className +'(?!\\S)');
                target.className = target.className.replace(regex, '');
            }

        },
        hasClass: function(target, className) {

            var classes = target.className.split(' ');

            return (~classes.indexOf(className));

        }
    };

})(App.Util);
