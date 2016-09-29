cc.Class({
    extends: cc.Component,

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
    onLoad: function () {
        this._graphics = this.getComponent(cc.Graphics);
        this._visible = false;
    },
    
    start: function () {
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

    setVisible: function (value) {
        if (typeof(value) !== 'boolean')
            return;
        this.node.active = value;
    }
});
