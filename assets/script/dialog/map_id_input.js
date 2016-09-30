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
        editBox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {

    },

    onEditReturn: function (sender) {
        canvas.emit(/*GameEventType.NEED_CREATE_NEW_MAP*/'NEED_CREATE_NEW_MAP', this.editBox.string);
        this.node.destroy();
    },
});
