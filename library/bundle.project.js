require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"assets_view":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2d459czfyJHSp3YM8hNKFJU', 'assets_view');
// script\assets_view\assets_view.js

cc.Class({
    "extends": cc.Component,

    properties: {
        fileListContainer: cc.Node,

        // prefab
        FileItem: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._selectedItem = null;
    },

    reset: function reset() {
        this._selectedItem = null;

        var children = this.fileListContainer.children;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            node.destroy();
        }

        var records = gRecordObject.fileRecords;
        for (var j = 0; j < records.length; j++) {
            var node = cc.instantiate(this.FileItem);
            node.parent = this.fileListContainer;

            var button = node.getComponent(cc.Button);
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this;
            eventHandler.component = "assets_view";
            eventHandler.handler = "onFileItemClick";
            button.clickEvents.push(eventHandler);

            var name = records[j];
            var label = node.getComponentInChildren(cc.Label);
            label.string = name;
        }
    },

    setSelectedItemByName: function setSelectedItemByName(name) {
        for (var j = 0; j < this.fileListContainer.children.length; j++) {
            var node = this.fileListContainer.children[j];
            var button = node.getComponent(cc.Button);
            var label = node.getComponentInChildren(cc.Label);
            if (label.string == name) {
                this.setSelectedItem(button);
                break;
            }
        }
    },

    setSelectedItem: function setSelectedItem(item) {
        item.interactable = false;
        if (this._selectedItem) this._selectedItem.interactable = true;
        this._selectedItem = item;
    },

    onFileItemClick: function onFileItemClick(event) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        var label = node.getComponentInChildren(cc.Label);
        var name = label.string;
        this.setSelectedItem(button);
        cc.log('open file:', name);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"game_event":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f736d1anWpE0ppJu+MxFbuN', 'game_event');
// script\event\game_event.js

window.GameEvent = {
    NEED_CREATE_NEW_MAP: 'NEED_CREATE_NEW_MAP'
};

cc._RFpop();
},{}],"global":[function(require,module,exports){
"use strict";
cc._RFpush(module, '752cfBymj9It73KfUnNMpwa', 'global');
// script\global.js

window.gRecordObject = null;
window.gCurrentMapObject = null;

window.openDialog = function (name) {
    var path = 'prefab/dialog/' + name;
    cc.loader.loadRes(path, cc.Prefab, function (err, prefab) {
        var node = cc.instantiate(prefab);
        node.parent = canvas;
    });
};

cc._RFpop();
},{}],"grid_draw":[function(require,module,exports){
"use strict";
cc._RFpush(module, '75401ScsYJI9LdZlp5bHodc', 'grid_draw');
// script\main_view\grid_draw.js

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._graphics = this.getComponent(cc.Graphics);
        this._visible = false;
    },

    start: function start() {
        for (var x = -2000; x <= 2000; x++) {
            this._graphics.moveTo(x * 30, -2000 * 30);
            this._graphics.lineTo(x * 30, 2000 * 30);
        }
        for (var y = -2000; y <= 2000; y++) {
            this._graphics.moveTo(-2000 * 30, y * 30);
            this._graphics.lineTo(2000 * 30, y * 30);
        }
        this._graphics.stroke();
    },

    setVisible: function setVisible(value) {
        if (typeof value !== 'boolean') return;
        this.node.active = value;
    }
});

cc._RFpop();
},{}],"main":[function(require,module,exports){
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
},{}],"map_container":[function(require,module,exports){
"use strict";
cc._RFpush(module, '44e48icjX5IT7Ss8HnI53nd', 'map_container');
// script\main_view\map_container.js

cc.Class({
    "extends": cc.Component,

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
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"map_id_input":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2e133ky6zRKD7M0kyYiOUhB', 'map_id_input');
// script\dialog\map_id_input.js

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
        editBox: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onEditReturn: function onEditReturn(sender) {
        canvas.emit( /*GameEventType.NEED_CREATE_NEW_MAP*/'NEED_CREATE_NEW_MAP', this.editBox.string);
        this.node.destroy();
    }
});

cc._RFpop();
},{}],"model_bg":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ab77vbzshOIbZh3gc/A46z', 'model_bg');
// script\dialog\model_bg.js

cc.Class({
    "extends": cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        this._touchStart = this.node.on(cc.Node.EventType.TOUCH_START, function () {}, this.node);
        this._touchMove = this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {}, this.node);
        this._touchEnd = this.node.on(cc.Node.EventType.TOUCH_END, function () {}, this.node);
        this._touchCancel = this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {}, this.node);
        this._mouseEnter = this.node.on(cc.Node.EventType.MOUSE_ENTER, function () {}, this.node);
        this._mouseLeave = this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {}, this.node);
        this._mouseDown = this.node.on(cc.Node.EventType.MOUSE_DOWN, function () {}, this.node);
        this._mouseMove = this.node.on(cc.Node.EventType.MOUSE_MOVE, function () {}, this.node);
        this._mouseUp = this.node.on(cc.Node.EventType.MOUSE_UP, function () {}, this.node);
        this._mouseWhell = this.node.on(cc.Node.EventType.MOUSE_WHEEL, function () {}, this.node);
    },

    onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this.node);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this.node);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this.node);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchCancel, this.node);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._mouseEnter, this.node);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._mouseLeave, this.node);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this.node);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this._mouseMove, this.node);
        this.node.off(cc.Node.EventType.MOUSE_UP, this._mouseUp, this.node);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._mouseWhell, this.node);
    }
});

cc._RFpop();
},{}],"status_view":[function(require,module,exports){
"use strict";
cc._RFpush(module, '24cc1k7L9lCyK5l0pMExMFz', 'status_view');
// script\status_view\status_view.js

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
        messageLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    error: function error(msg) {
        if (typeof msg !== 'string') return;
        this.messageLabel.node.color = cc.Color.RED;
        this.messageLabel.string = msg;
    },

    message: function message(msg) {
        if (typeof msg !== 'string') return;
        this.messageLabel.node.color = cc.Color.BLACK;
        this.messageLabel.string = msg;
    },

    status: function status(msg) {
        this.statusLabel.string = msg;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"toolbar_view":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5aba22I0AVLTpeBsMKk8l/r', 'toolbar_view');
// script\toolbar_view\toolbar_view.js

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onButtonClick: function onButtonClick(event) {
        var target = event.target;
        switch (target.name) {
            case 'new_button':
                openDialog('map_id_input_dialog');
                break;

            default:
                break;
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"view_frame":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6b97eAV5rFM/7H9S7BT8/5e', 'view_frame');
// script\main_view\view_frame.js

cc.Class({
    "extends": cc.Component,

    properties: {
        frameWidth: 1136,
        frameHeight: 640
    },

    start: function start() {
        var graphics = this.getComponent(cc.Graphics);
        graphics.rect(0, 0, this.frameWidth, this.frameHeight);
        graphics.stroke();
    }
});

cc._RFpop();
},{}]},{},["status_view","model_bg","assets_view","map_id_input","map_container","toolbar_view","main","view_frame","global","grid_draw","game_event"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvcjEyMS9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvYXNzZXRzX3ZpZXcvYXNzZXRzX3ZpZXcuanMiLCJhc3NldHMvc2NyaXB0L2V2ZW50L2dhbWVfZXZlbnQuanMiLCJhc3NldHMvc2NyaXB0L2dsb2JhbC5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbl92aWV3L2dyaWRfZHJhdy5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbi5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbl92aWV3L21hcF9jb250YWluZXIuanMiLCJhc3NldHMvc2NyaXB0L2RpYWxvZy9tYXBfaWRfaW5wdXQuanMiLCJhc3NldHMvc2NyaXB0L2RpYWxvZy9tb2RlbF9iZy5qcyIsImFzc2V0cy9zY3JpcHQvc3RhdHVzX3ZpZXcvc3RhdHVzX3ZpZXcuanMiLCJhc3NldHMvc2NyaXB0L3Rvb2xiYXJfdmlldy90b29sYmFyX3ZpZXcuanMiLCJhc3NldHMvc2NyaXB0L21haW5fdmlldy92aWV3X2ZyYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyZDQ1OWN6ZnlKSFNwM1lNOGhOS0ZKVScsICdhc3NldHNfdmlldycpO1xuLy8gc2NyaXB0XFxhc3NldHNfdmlld1xcYXNzZXRzX3ZpZXcuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZpbGVMaXN0Q29udGFpbmVyOiBjYy5Ob2RlLFxuXG4gICAgICAgIC8vIHByZWZhYlxuICAgICAgICBGaWxlSXRlbTogY2MuUHJlZmFiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5maWxlTGlzdENvbnRhaW5lci5jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlY29yZHMgPSBnUmVjb3JkT2JqZWN0LmZpbGVSZWNvcmRzO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlY29yZHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5GaWxlSXRlbSk7XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMuZmlsZUxpc3RDb250YWluZXI7XG5cbiAgICAgICAgICAgIHZhciBidXR0b24gPSBub2RlLmdldENvbXBvbmVudChjYy5CdXR0b24pO1xuICAgICAgICAgICAgdmFyIGV2ZW50SGFuZGxlciA9IG5ldyBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlci5jb21wb25lbnQgPSBcImFzc2V0c192aWV3XCI7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIuaGFuZGxlciA9IFwib25GaWxlSXRlbUNsaWNrXCI7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMucHVzaChldmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHJlY29yZHNbal07XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpO1xuICAgICAgICAgICAgbGFiZWwuc3RyaW5nID0gbmFtZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRTZWxlY3RlZEl0ZW1CeU5hbWU6IGZ1bmN0aW9uIHNldFNlbGVjdGVkSXRlbUJ5TmFtZShuYW1lKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5maWxlTGlzdENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmZpbGVMaXN0Q29udGFpbmVyLmNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbik7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpO1xuICAgICAgICAgICAgaWYgKGxhYmVsLnN0cmluZyA9PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0oYnV0dG9uKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRTZWxlY3RlZEl0ZW06IGZ1bmN0aW9uIHNldFNlbGVjdGVkSXRlbShpdGVtKSB7XG4gICAgICAgIGl0ZW0uaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZEl0ZW0pIHRoaXMuX3NlbGVjdGVkSXRlbS5pbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgIH0sXG5cbiAgICBvbkZpbGVJdGVtQ2xpY2s6IGZ1bmN0aW9uIG9uRmlsZUl0ZW1DbGljayhldmVudCkge1xuICAgICAgICB2YXIgbm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbik7XG4gICAgICAgIHZhciBsYWJlbCA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjYy5MYWJlbCk7XG4gICAgICAgIHZhciBuYW1lID0gbGFiZWwuc3RyaW5nO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbShidXR0b24pO1xuICAgICAgICBjYy5sb2coJ29wZW4gZmlsZTonLCBuYW1lKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjczNmQxYW5XcEUwcHBKdStNeEZidU4nLCAnZ2FtZV9ldmVudCcpO1xuLy8gc2NyaXB0XFxldmVudFxcZ2FtZV9ldmVudC5qc1xuXG53aW5kb3cuR2FtZUV2ZW50ID0ge1xuICAgIE5FRURfQ1JFQVRFX05FV19NQVA6ICdORUVEX0NSRUFURV9ORVdfTUFQJ1xufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzc1MmNmQnltajlJdDczS2ZVbk5NcHdhJywgJ2dsb2JhbCcpO1xuLy8gc2NyaXB0XFxnbG9iYWwuanNcblxud2luZG93LmdSZWNvcmRPYmplY3QgPSBudWxsO1xud2luZG93LmdDdXJyZW50TWFwT2JqZWN0ID0gbnVsbDtcblxud2luZG93Lm9wZW5EaWFsb2cgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBwYXRoID0gJ3ByZWZhYi9kaWFsb2cvJyArIG5hbWU7XG4gICAgY2MubG9hZGVyLmxvYWRSZXMocGF0aCwgY2MuUHJlZmFiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICBub2RlLnBhcmVudCA9IGNhbnZhcztcbiAgICB9KTtcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NTQwMVNjc1lKSTlMZFpscDViSG9kYycsICdncmlkX2RyYXcnKTtcbi8vIHNjcmlwdFxcbWFpbl92aWV3XFxncmlkX2RyYXcuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhpY3MgPSB0aGlzLmdldENvbXBvbmVudChjYy5HcmFwaGljcyk7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBmb3IgKHZhciB4ID0gLTIwMDA7IHggPD0gMjAwMDsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5tb3ZlVG8oeCAqIDMwLCAtMjAwMCAqIDMwKTtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLmxpbmVUbyh4ICogMzAsIDIwMDAgKiAzMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeSA9IC0yMDAwOyB5IDw9IDIwMDA7IHkrKykge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY3MubW92ZVRvKC0yMDAwICogMzAsIHkgKiAzMCk7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5saW5lVG8oMjAwMCAqIDMwLCB5ICogMzApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dyYXBoaWNzLnN0cm9rZSgpO1xuICAgIH0sXG5cbiAgICBzZXRWaXNpYmxlOiBmdW5jdGlvbiBzZXRWaXNpYmxlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykgcmV0dXJuO1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdmFsdWU7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2M2QyMkVxYzJCQjRacHZ6OVV0TDdFcycsICdtYWluJyk7XG4vLyBzY3JpcHRcXG1haW4uanNcblxudmFyIHZlcnNpb24gPSAnMC4wLjEnO1xudmFyIGRhdGFSb290ID0gJ2U6XFxcXGV4X2dhbWVcXFxcZGF0YVxcXFwnO1xudmFyIHJlc1BhdGggPSBkYXRhUm9vdCArICdtYXBcXFxcJztcbnZhciByZWNvcmRGaWxlTmFtZSA9ICdtYXAuanNvbic7XG52YXIgcmVjb3JkRmlsZVBhdGggPSByZXNQYXRoICsgcmVjb3JkRmlsZU5hbWU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3RhdHVzTGFiZWw6IGNjLkxhYmVsLFxuXG4gICAgICAgIGZpbGVMaXN0Q29udGFpbmVyOiBjYy5Ob2RlLFxuXG4gICAgICAgIC8vIGRpYWxvZyBwcmVmYWJcbiAgICAgICAgTmV3TWFwRGlhbG9nOiBjYy5QcmVmYWIsXG5cbiAgICAgICAgYXNzZXRzVmlldzogY2MuTm9kZSxcbiAgICAgICAgc3RhdHVzVmlldzogY2MuTm9kZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgd2luZG93LmNhbnZhcyA9IHRoaXMubm9kZTtcblxuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgICAgIHRoaXMuaW5pdFZpZXcoKTtcblxuICAgICAgICB0aGlzLmFkZEV2ZW50KCk7XG4gICAgfSxcblxuICAgIGFkZEV2ZW50OiBmdW5jdGlvbiBhZGRFdmVudCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKEdhbWVFdmVudC5ORUVEX0NSRUFURV9ORVdfTUFQLCB0aGlzLm9uRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGluaXRWaWV3OiBmdW5jdGlvbiBpbml0VmlldygpIHtcbiAgICAgICAgdGhpcy5fYXNzZXRzVmlldyA9IHRoaXMuYXNzZXRzVmlldy5nZXRDb21wb25lbnQoJ2Fzc2V0c192aWV3Jyk7XG4gICAgICAgIHRoaXMuX3N0YXR1c1ZpZXcgPSB0aGlzLnN0YXR1c1ZpZXcuZ2V0Q29tcG9uZW50KCdzdGF0dXNfdmlldycpO1xuXG4gICAgICAgIHRoaXMuX2Fzc2V0c1ZpZXcucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgaW5pdERhdGE6IGZ1bmN0aW9uIGluaXREYXRhKCkge1xuICAgICAgICB2YXIgb2JqZWN0LCBzdHJlYW07XG5cbiAgICAgICAgY2MubG9nKCfmraPlnKjor7vlj5borrDlvZXmlofku7Y6JywgcmVjb3JkRmlsZVBhdGgpO1xuICAgICAgICBpZiAoIWpzYi5maWxlVXRpbHMuaXNGaWxlRXhpc3QocmVjb3JkRmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBjYy5sb2coJ+ivu+WPluiusOW9leaWh+S7tuWksei0pSwg6Ieq5Yqo5Yib5bu66K6w5b2V5paH5Lu244CCJyk7XG4gICAgICAgICAgICBvYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbixcbiAgICAgICAgICAgICAgICBmaWxlUmVjb3JkczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdHJlYW0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QpO1xuICAgICAgICAgICAgaWYgKCFqc2IuZmlsZVV0aWxzLndyaXRlU3RyaW5nVG9GaWxlKHN0cmVhbSwgcmVjb3JkRmlsZVBhdGgpKSB7XG4gICAgICAgICAgICAgICAgY2MubG9nKCfliJvlu7rorrDlvZXmlofku7blpLHotKXvvIzmnKrnn6XplJnor6/jgIInKTtcbiAgICAgICAgICAgICAgICAvL+i/memHjOimgemAgOWHuuW8leaTju+8jOi/mOaJvuS4jeWIsEFQSVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyZWFtID0ganNiLmZpbGVVdGlscy5nZXRTdHJpbmdGcm9tRmlsZShyZWNvcmRGaWxlUGF0aCk7XG4gICAgICAgIG9iamVjdCA9IEpTT04ucGFyc2Uoc3RyZWFtKTtcblxuICAgICAgICBnUmVjb3JkT2JqZWN0ID0gb2JqZWN0O1xuICAgIH0sXG5cbiAgICBuZXdNYXA6IGZ1bmN0aW9uIG5ld01hcChpZCkge1xuICAgICAgICB2YXIgcGF0aCA9IHJlc1BhdGggKyBpZCArICcubWFwJztcbiAgICAgICAgaWYgKGpzYi5maWxlVXRpbHMuaXNGaWxlRXhpc3QocGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c1ZpZXcuZXJyb3IoJ+WIm+W7uuWcsOWbvuaWh+S7tuWksei0pe+8jOWcsOWbvuaWh+S7tuW3suWtmOWcqOOAgicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvYmplY3QgPSB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBtYXBTaXplOiB7IHdpZHRoOiA5NjAsIGhlaWdodDogNjQwIH0sXG4gICAgICAgICAgICB0aWxlU2l6ZTogeyB3aWR0aDogMjAsIGhlaWdodDogMjAgfSxcbiAgICAgICAgICAgIHRpbGVNYXNrczogW11cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHN0cmVhbSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XG4gICAgICAgIGlmICghanNiLmZpbGVVdGlscy53cml0ZVN0cmluZ1RvRmlsZShzdHJlYW0sIHBhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNWaWV3LmVycm9yKCfliJvlu7rlnLDlm77mlofku7blpLHotKXvvIzmnKrnn6XplJnor6/jgIInKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdSZWNvcmRPYmplY3QuZmlsZVJlY29yZHMucHVzaChpZCk7XG4gICAgICAgIHRoaXMuc2F2ZVJlY29yZCgpO1xuICAgICAgICBnQ3VycmVudE1hcE9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICB0aGlzLl9hc3NldHNWaWV3LnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX2Fzc2V0c1ZpZXcuc2V0U2VsZWN0ZWRJdGVtQnlOYW1lKGlkLnRvU3RyaW5nKCkpO1xuICAgIH0sXG5cbiAgICBvbkV2ZW50OiBmdW5jdGlvbiBvbkV2ZW50KGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBHYW1lRXZlbnQuTkVFRF9DUkVBVEVfTkVXX01BUDpcbiAgICAgICAgICAgICAgICB0aGlzLm5ld01hcChldmVudC5kZXRhaWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ0xpY2s6IGZ1bmN0aW9uIG9uQ0xpY2soKSB7XG4gICAgICAgIGlmIChnQ3VycmVudE1hcE9iamVjdCAmJiBnTW9kaWZsaXkpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbkRpYWxvZygnY29uZmlybV9zYXZlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5EaWFsb2coJ25ld19tYXAnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzYXZlUmVjb3JkOiBmdW5jdGlvbiBzYXZlUmVjb3JkKCkge1xuICAgICAgICBpZiAoIWdSZWNvcmRPYmplY3QpIHJldHVybjtcbiAgICAgICAgdmFyIHN0cmVhbSA9IEpTT04uc3RyaW5naWZ5KGdSZWNvcmRPYmplY3QpO1xuICAgICAgICByZXR1cm4ganNiLmZpbGVVdGlscy53cml0ZVN0cmluZ1RvRmlsZShzdHJlYW0sIHJlY29yZEZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0NGU0OGljalg1SVQ3U3M4SG5JNTNuZCcsICdtYXBfY29udGFpbmVyJyk7XG4vLyBzY3JpcHRcXG1haW5fdmlld1xcbWFwX2NvbnRhaW5lci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmUxMzNreTZ6UktEN00wa3lZaU9VaEInLCAnbWFwX2lkX2lucHV0Jyk7XG4vLyBzY3JpcHRcXGRpYWxvZ1xcbWFwX2lkX2lucHV0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgZWRpdEJveDogY2MuRWRpdEJveFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgb25FZGl0UmV0dXJuOiBmdW5jdGlvbiBvbkVkaXRSZXR1cm4oc2VuZGVyKSB7XG4gICAgICAgIGNhbnZhcy5lbWl0KCAvKkdhbWVFdmVudFR5cGUuTkVFRF9DUkVBVEVfTkVXX01BUCovJ05FRURfQ1JFQVRFX05FV19NQVAnLCB0aGlzLmVkaXRCb3guc3RyaW5nKTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJhYjc3dmJ6c2hPSWJaaDNnYy9BNDZ6JywgJ21vZGVsX2JnJyk7XG4vLyBzY3JpcHRcXGRpYWxvZ1xcbW9kZWxfYmcuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdG91Y2hTdGFydCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZSA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fdG91Y2hFbmQgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fdG91Y2hDYW5jZWwgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VFbnRlciA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlTGVhdmUgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLl9tb3VzZURvd24gPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRE9XTiwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlTW92ZSA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCBmdW5jdGlvbiAoKSB7fSwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5fbW91c2VVcCA9IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9VUCwgZnVuY3Rpb24gKCkge30sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMuX21vdXNlV2hlbGwgPSB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIGZ1bmN0aW9uICgpIHt9LCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fdG91Y2hTdGFydCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl90b3VjaE1vdmUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl90b3VjaEVuZCwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuX3RvdWNoQ2FuY2VsLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9tb3VzZUVudGVyLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0xFQVZFLCB0aGlzLl9tb3VzZUxlYXZlLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIHRoaXMuX21vdXNlRG93biwgdGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCB0aGlzLl9tb3VzZU1vdmUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAsIHRoaXMuX21vdXNlVXAsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfV0hFRUwsIHRoaXMuX21vdXNlV2hlbGwsIHRoaXMubm9kZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyNGNjMWs3TDlsQ3lLNWwwcE1FeE1GeicsICdzdGF0dXNfdmlldycpO1xuLy8gc2NyaXB0XFxzdGF0dXNfdmlld1xcc3RhdHVzX3ZpZXcuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzdGF0dXNMYWJlbDogY2MuTGFiZWwsXG4gICAgICAgIG1lc3NhZ2VMYWJlbDogY2MuTGFiZWxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSByZXR1cm47XG4gICAgICAgIHRoaXMubWVzc2FnZUxhYmVsLm5vZGUuY29sb3IgPSBjYy5Db2xvci5SRUQ7XG4gICAgICAgIHRoaXMubWVzc2FnZUxhYmVsLnN0cmluZyA9IG1zZztcbiAgICB9LFxuXG4gICAgbWVzc2FnZTogZnVuY3Rpb24gbWVzc2FnZShtc2cpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSByZXR1cm47XG4gICAgICAgIHRoaXMubWVzc2FnZUxhYmVsLm5vZGUuY29sb3IgPSBjYy5Db2xvci5CTEFDSztcbiAgICAgICAgdGhpcy5tZXNzYWdlTGFiZWwuc3RyaW5nID0gbXNnO1xuICAgIH0sXG5cbiAgICBzdGF0dXM6IGZ1bmN0aW9uIHN0YXR1cyhtc2cpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNMYWJlbC5zdHJpbmcgPSBtc2c7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWFiYTIySTBBVkxUcGVCc01LazhsL3InLCAndG9vbGJhcl92aWV3Jyk7XG4vLyBzY3JpcHRcXHRvb2xiYXJfdmlld1xcdG9vbGJhcl92aWV3LmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIG9uQnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQnV0dG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgc3dpdGNoICh0YXJnZXQubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnbmV3X2J1dHRvbic6XG4gICAgICAgICAgICAgICAgb3BlbkRpYWxvZygnbWFwX2lkX2lucHV0X2RpYWxvZycpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZiOTdlQVY1ckZNLzdIOVM3QlQ4LzVlJywgJ3ZpZXdfZnJhbWUnKTtcbi8vIHNjcmlwdFxcbWFpbl92aWV3XFx2aWV3X2ZyYW1lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBmcmFtZVdpZHRoOiAxMTM2LFxuICAgICAgICBmcmFtZUhlaWdodDogNjQwXG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdmFyIGdyYXBoaWNzID0gdGhpcy5nZXRDb21wb25lbnQoY2MuR3JhcGhpY3MpO1xuICAgICAgICBncmFwaGljcy5yZWN0KDAsIDAsIHRoaXMuZnJhbWVXaWR0aCwgdGhpcy5mcmFtZUhlaWdodCk7XG4gICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
