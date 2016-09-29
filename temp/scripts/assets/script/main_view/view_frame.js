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