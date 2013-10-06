(function () {

    'use strict';

    module.exports = {
        bind: function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        }
    };

}());
