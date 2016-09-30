"use strict";
cc._RFpush(module, '63d22Eqc2BB4Zpvz9UtL7Es', 'main');
// script\main.js

var version = '0.0.1';
var dataRoot = 'e:\\ex_game\\data\\';
var resPath = dataRoot + 'map\\';
var recordFileName = 'map.json';
var recordFilePath = resPath + recordFileName;

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

        assetsView: cc.Node,
        statusView: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        window.canvas = this.node;

        this.initData();
        this.initView();

        this.addEvent();
    },

    addEvent: function addEvent() {
        this.node.on(GameEvent.NEED_CREATE_NEW_MAP, this.onEvent.bind(this));
    },

    initView: function initView() {
        this._assetsView = this.assetsView.getComponent('assets_view');
        this._statusView = this.statusView.getComponent('status_view');

        this._assetsView.reset();
    },

    initData: function initData() {
        var object, stream;

        cc.log('正在读取记录文件:', recordFilePath);
        if (!jsb.fileUtils.isFileExist(recordFilePath)) {
            cc.log('读取记录文件失败, 自动创建记录文件。');
            object = {
                version: version,
                fileRecords: []
            };
            stream = JSON.stringify(object);
            if (!jsb.fileUtils.writeStringToFile(stream, recordFilePath)) {
                cc.log('创建记录文件失败，未知错误。');
                //这里要退出引擎，还找不到API
            }
        }

        stream = jsb.fileUtils.getStringFromFile(recordFilePath);
        object = JSON.parse(stream);

        gRecordObject = object;
    },

    newMap: function newMap(id) {
        var path = resPath + id + '.map';
        if (jsb.fileUtils.isFileExist(path)) {
            this._statusView.error('创建地图文件失败，地图文件已存在。');
            return;
        }
        var object = {
            id: id,
            mapSize: { width: 960, height: 640 },
            tileSize: { width: 20, height: 20 },
            tileMasks: []
        };
        var stream = JSON.stringify(object);
        if (!jsb.fileUtils.writeStringToFile(stream, path)) {
            this._statusView.error('创建地图文件失败，未知错误。');
            return;
        }

        gRecordObject.fileRecords.push(id);
        this.saveRecord();
        gCurrentMapObject = object;

        this._assetsView.reset();
        this._assetsView.setSelectedItemByName(id.toString());
    },

    onEvent: function onEvent(event) {
        switch (event.type) {
            case GameEvent.NEED_CREATE_NEW_MAP:
                this.newMap(event.detail);
                break;

            default:
                break;
        }
    },

    onCLick: function onCLick() {
        if (gCurrentMapObject && gModifliy) {
            this.openDialog('confirm_save');
        } else {
            this.openDialog('new_map');
        }
    },

    saveRecord: function saveRecord() {
        if (!gRecordObject) return;
        var stream = JSON.stringify(gRecordObject);
        return jsb.fileUtils.writeStringToFile(stream, recordFilePath);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();