window.gRecordObject = null;
window.gCurrentMapObject = null;

window.openDialog = function (name) {
    var path = 'prefab/dialog/' + name;
    cc.loader.loadRes(path, cc.Prefab, function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.parent = canvas;
    });
};