"use strict";
cc._RFpush(module, '752cfBymj9It73KfUnNMpwa', 'global');
// script\global.js

window.openDialog = function (name) {
    var path = 'prefab/dialog/' + name;
    cc.loader.loadRes(path, cc.Prefab, function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.parent = canvas;
    });
};

cc._RFpop();