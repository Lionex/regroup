PixiGame.GameScene = function() {
    PIXI.Graphics.call(this);

    this._objects = null;

    this.setup();
};


PixiGame.GameScene.constructor = PixiGame.GameScene;


PixiGame.GameScene.prototype = Object.create(PIXI.Graphics.prototype);


PixiGame.GameScene.prototype.setup = function() {
    this._objects = new PIXI.Container()

    var ob = new_object(window.innerWidth / 2, 320)
    scale_on_grab(ob, 1.1)
    this._objects.addChild(ob)

    this.addChild(this._objects)
}


PixiGame.GameScene.prototype.update = function() {}


PixiGame.GameScene.prototype.destroy = function() {
    this.removeChildren();
}


function new_object(x,y) {
    // Define object appearance
    let ob = new PIXI.Graphics()
    ob.beginFill(0xFFFFFF)
    ob.drawCircle(0, 0, 32)
    ob.endFill()

    // Set position and other attributes
    ob.x = x
    ob.y = y

    // Define interactive behaviour
    ob.interactive = true
    ob.buttonMode = true
    ob
        // Grab the object
        .on('mousedown', grab)
        .on('touchstart', grab)
        // release the object
        .on('mouseup', release)
        .on('touchend', release)
        .on('mouseupoutside', release)
        .on('touchupoutside', release)
        // move the object
        .on('mousemove', move)
        .on('touchmove', move)

    // Helper functions for interacitve behaviour

    // Save reference which allows us to grab the pointer position
    function grab(event) {
        this.pointer = event.data
        this.drag = true
    }

    // Update position of self to pointer position
    function move() {
        if (this.drag) {
            var newPosition = this.pointer.getLocalPosition(this.parent);
            this.x = newPosition.x
            this.y = newPosition.y
        }
    }

    // Remove reference and stop the drag behaviour
    function release() {
        this.data = null
        this.drag = false
    }

    return ob
}


function scale_on_grab(ob, factor) {
    ob
        // Grab the object
        .on('mousedown', grab)
        .on('touchstart', grab)
        // release the object
        .on('mouseup', release)
        .on('touchend', release)
        .on('mouseupoutside', release)
        .on('touchupoutside', release)

    // Save reference which allows us to grab the pointer position
    function grab(event) {
        this.scale.x *= factor
        this.scale.y *= factor
    }

    // Remove reference and stop the drag behaviour
    function release() {
        this.scale.x /= factor
        this.scale.y /= factor
    }
}
