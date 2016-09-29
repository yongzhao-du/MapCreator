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