(function () {

    'use strict';

    module.exports = function (me) {
        var key, proto = me.__proto__;
        for (key in proto) {
            if (proto.hasOwnProperty(key) &&
                key !== 'constructor' &&
                typeof proto[key] === 'function') {
                (function(key) {
                    me[key] = function () {
                        return proto[key].apply(me, arguments);
                    }
                }(key));
            }
        }
    };

}());
