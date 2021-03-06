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