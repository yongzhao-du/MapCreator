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
        statusLabel: cc.Label,
        messageLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    error: function (msg) {
        if (typeof(msg) !== 'string') return;
        this.messageLabel.node.color = cc.Color.RED;
        this.messageLabel.string = msg;
    },
    
    message: function (msg) {
        if (typeof(msg) !== 'string') return;
        this.messageLabel.node.color = cc.Color.BLACK ;
        this.messageLabel.string = msg;
    },
    
    status: function (msg) {
        this.statusLabel.string = msg;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
