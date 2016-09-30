window.gRecordObject = null;
window.gCurrentMapObject = null;

window.openDialog = function (name) {
    const path = 'prefab/dialog/' + name;
    cc.loader.loadRes(path, cc.Prefab, function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.parent = canvas;
    });
}
