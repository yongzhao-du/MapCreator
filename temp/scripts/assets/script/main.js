"use strict";
cc._RFpush(module, '63d22Eqc2BB4Zpvz9UtL7Es', 'main');
// script\main.js

var version = '0.0.1';
var dataRoot = 'g:\\game\\data\\';
var resPath = 'map\\';
var recordFileName = 'map.json';
var recordFilePath = dataRoot + resPath + recordFileName;

window.gRecordObject = null;

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        statusLabel: cc.Label,

        fileListContainer: cc.Node,

        // dialog prefab
        NewMapDialog: cc.Prefab,

        assetsView: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        window.canvas = this.node;

        this._assetsViewCtrl = this.assetsView.getComponent('assets_view');

        cc.log('start load record file:', recordFilePath);
        if (!this.loadData()) {
            cc.log('record file not exist, created.');
            gRecordObject = {
                version: version,
                fileRecords: []
            };
            this.saveData();
        }
        this._assetsViewCtrl.refresh();
    },

    start: function start() {},

    onCLick: function onCLick() {
        //openDialog('new_map_dialog');
    },

    loadData: function loadData() {
        if (!jsb.fileUtils.isFileExist(recordFilePath)) return false;
        var data = jsb.fileUtils.getStringFromFile(recordFilePath);
        gRecordObject = JSON.parse(data);
        return true;
    },

    saveData: function saveData() {
        if (!gRecordObject) return false;
        var cache = JSON.stringify(gRecordObject);
        return jsb.fileUtils.writeStringToFile(cache, recordFilePath);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();