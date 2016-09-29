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

    refresh: function refresh() {
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

    onFileItemClick: function onFileItemClick(event) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        var label = node.getComponentInChildren(cc.Label);
        var name = label.string;
        button.interactable = false;
        if (this._selectedItem) this._selectedItem.interactable = true;
        this._selectedItem = button;
        cc.log('open file:', name);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"global":[function(require,module,exports){
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
},{}]},{},["assets_view","map_container","main","view_frame","global","grid_draw"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvYXNzZXRzX3ZpZXcvYXNzZXRzX3ZpZXcuanMiLCJhc3NldHMvc2NyaXB0L2dsb2JhbC5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbl92aWV3L2dyaWRfZHJhdy5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbi5qcyIsImFzc2V0cy9zY3JpcHQvbWFpbl92aWV3L21hcF9jb250YWluZXIuanMiLCJhc3NldHMvc2NyaXB0L21haW5fdmlldy92aWV3X2ZyYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmQ0NTljemZ5SkhTcDNZTThoTktGSlUnLCAnYXNzZXRzX3ZpZXcnKTtcbi8vIHNjcmlwdFxcYXNzZXRzX3ZpZXdcXGFzc2V0c192aWV3LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWxlTGlzdENvbnRhaW5lcjogY2MuTm9kZSxcblxuICAgICAgICAvLyBwcmVmYWJcbiAgICAgICAgRmlsZUl0ZW06IGNjLlByZWZhYlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVmcmVzaDogZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmZpbGVMaXN0Q29udGFpbmVyLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjb3JkcyA9IGdSZWNvcmRPYmplY3QuZmlsZVJlY29yZHM7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVjb3Jkcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkZpbGVJdGVtKTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5maWxlTGlzdENvbnRhaW5lcjtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbik7XG4gICAgICAgICAgICB2YXIgZXZlbnRIYW5kbGVyID0gbmV3IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlci50YXJnZXQgPSB0aGlzO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiYXNzZXRzX3ZpZXdcIjtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlci5oYW5kbGVyID0gXCJvbkZpbGVJdGVtQ2xpY2tcIjtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGlja0V2ZW50cy5wdXNoKGV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgIHZhciBuYW1lID0gcmVjb3Jkc1tqXTtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjYy5MYWJlbCk7XG4gICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRmlsZUl0ZW1DbGljazogZnVuY3Rpb24gb25GaWxlSXRlbUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgYnV0dG9uID0gbm9kZS5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcbiAgICAgICAgdmFyIGxhYmVsID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkxhYmVsKTtcbiAgICAgICAgdmFyIG5hbWUgPSBsYWJlbC5zdHJpbmc7XG4gICAgICAgIGJ1dHRvbi5pbnRlcmFjdGFibGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSXRlbSkgdGhpcy5fc2VsZWN0ZWRJdGVtLmludGVyYWN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGJ1dHRvbjtcbiAgICAgICAgY2MubG9nKCdvcGVuIGZpbGU6JywgbmFtZSk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzc1MmNmQnltajlJdDczS2ZVbk5NcHdhJywgJ2dsb2JhbCcpO1xuLy8gc2NyaXB0XFxnbG9iYWwuanNcblxud2luZG93Lm9wZW5EaWFsb2cgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBwYXRoID0gJ3ByZWZhYi9kaWFsb2cvJyArIG5hbWU7XG4gICAgY2MubG9hZGVyLmxvYWRSZXMocGF0aCwgY2MuUHJlZmFiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICBub2RlLnBhcmVudCA9IGNhbnZhcztcbiAgICB9KTtcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3NTQwMVNjc1lKSTlMZFpscDViSG9kYycsICdncmlkX2RyYXcnKTtcbi8vIHNjcmlwdFxcbWFpbl92aWV3XFxncmlkX2RyYXcuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhpY3MgPSB0aGlzLmdldENvbXBvbmVudChjYy5HcmFwaGljcyk7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBmb3IgKHZhciB4ID0gLTIwMDA7IHggPD0gMjAwMDsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5tb3ZlVG8oeCAqIDMwLCAtMjAwMCAqIDMwKTtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLmxpbmVUbyh4ICogMzAsIDIwMDAgKiAzMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeSA9IC0yMDAwOyB5IDw9IDIwMDA7IHkrKykge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY3MubW92ZVRvKC0yMDAwICogMzAsIHkgKiAzMCk7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5saW5lVG8oMjAwMCAqIDMwLCB5ICogMzApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dyYXBoaWNzLnN0cm9rZSgpO1xuICAgIH0sXG5cbiAgICBzZXRWaXNpYmxlOiBmdW5jdGlvbiBzZXRWaXNpYmxlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykgcmV0dXJuO1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdmFsdWU7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2M2QyMkVxYzJCQjRacHZ6OVV0TDdFcycsICdtYWluJyk7XG4vLyBzY3JpcHRcXG1haW4uanNcblxudmFyIHZlcnNpb24gPSAnMC4wLjEnO1xudmFyIGRhdGFSb290ID0gJ2c6XFxcXGdhbWVcXFxcZGF0YVxcXFwnO1xudmFyIHJlc1BhdGggPSAnbWFwXFxcXCc7XG52YXIgcmVjb3JkRmlsZU5hbWUgPSAnbWFwLmpzb24nO1xudmFyIHJlY29yZEZpbGVQYXRoID0gZGF0YVJvb3QgKyByZXNQYXRoICsgcmVjb3JkRmlsZU5hbWU7XG5cbndpbmRvdy5nUmVjb3JkT2JqZWN0ID0gbnVsbDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzdGF0dXNMYWJlbDogY2MuTGFiZWwsXG5cbiAgICAgICAgZmlsZUxpc3RDb250YWluZXI6IGNjLk5vZGUsXG5cbiAgICAgICAgLy8gZGlhbG9nIHByZWZhYlxuICAgICAgICBOZXdNYXBEaWFsb2c6IGNjLlByZWZhYixcblxuICAgICAgICBhc3NldHNWaWV3OiBjYy5Ob2RlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB3aW5kb3cuY2FudmFzID0gdGhpcy5ub2RlO1xuXG4gICAgICAgIHRoaXMuX2Fzc2V0c1ZpZXdDdHJsID0gdGhpcy5hc3NldHNWaWV3LmdldENvbXBvbmVudCgnYXNzZXRzX3ZpZXcnKTtcblxuICAgICAgICBjYy5sb2coJ3N0YXJ0IGxvYWQgcmVjb3JkIGZpbGU6JywgcmVjb3JkRmlsZVBhdGgpO1xuICAgICAgICBpZiAoIXRoaXMubG9hZERhdGEoKSkge1xuICAgICAgICAgICAgY2MubG9nKCdyZWNvcmQgZmlsZSBub3QgZXhpc3QsIGNyZWF0ZWQuJyk7XG4gICAgICAgICAgICBnUmVjb3JkT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24sXG4gICAgICAgICAgICAgICAgZmlsZVJlY29yZHM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5zYXZlRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Fzc2V0c1ZpZXdDdHJsLnJlZnJlc2goKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge30sXG5cbiAgICBvbkNMaWNrOiBmdW5jdGlvbiBvbkNMaWNrKCkge1xuICAgICAgICAvL29wZW5EaWFsb2coJ25ld19tYXBfZGlhbG9nJyk7XG4gICAgfSxcblxuICAgIGxvYWREYXRhOiBmdW5jdGlvbiBsb2FkRGF0YSgpIHtcbiAgICAgICAgaWYgKCFqc2IuZmlsZVV0aWxzLmlzRmlsZUV4aXN0KHJlY29yZEZpbGVQYXRoKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgZGF0YSA9IGpzYi5maWxlVXRpbHMuZ2V0U3RyaW5nRnJvbUZpbGUocmVjb3JkRmlsZVBhdGgpO1xuICAgICAgICBnUmVjb3JkT2JqZWN0ID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHNhdmVEYXRhOiBmdW5jdGlvbiBzYXZlRGF0YSgpIHtcbiAgICAgICAgaWYgKCFnUmVjb3JkT2JqZWN0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBjYWNoZSA9IEpTT04uc3RyaW5naWZ5KGdSZWNvcmRPYmplY3QpO1xuICAgICAgICByZXR1cm4ganNiLmZpbGVVdGlscy53cml0ZVN0cmluZ1RvRmlsZShjYWNoZSwgcmVjb3JkRmlsZVBhdGgpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ0ZTQ4aWNqWDVJVDdTczhIbkk1M25kJywgJ21hcF9jb250YWluZXInKTtcbi8vIHNjcmlwdFxcbWFpbl92aWV3XFxtYXBfY29udGFpbmVyLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2Yjk3ZUFWNXJGTS83SDlTN0JUOC81ZScsICd2aWV3X2ZyYW1lJyk7XG4vLyBzY3JpcHRcXG1haW5fdmlld1xcdmlld19mcmFtZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZnJhbWVXaWR0aDogMTEzNixcbiAgICAgICAgZnJhbWVIZWlnaHQ6IDY0MFxuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHZhciBncmFwaGljcyA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICAgICAgZ3JhcGhpY3MucmVjdCgwLCAwLCB0aGlzLmZyYW1lV2lkdGgsIHRoaXMuZnJhbWVIZWlnaHQpO1xuICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
