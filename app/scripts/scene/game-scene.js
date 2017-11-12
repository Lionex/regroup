PixiGame.GameScene = function() {
    PIXI.Graphics.call(this);

    this._objects = null;

    this.setup();
};


PixiGame.GameScene.constructor = PixiGame.GameScene;


PixiGame.GameScene.prototype = Object.create(PIXI.Graphics.prototype);


PixiGame.GameScene.prototype.setup = function() {
    this._objects = new PIXI.Container()

    this._objects.addChild(new_object(window.innerWidth / 2, 320))

    this.addChild(this._objects)
}


function spawn_grid(grid, new_obj) {
    for (var i = 0; i < grid.width*grid.height; i++) {
        new_obj(
            (i%grid.width) * grid.spacing + grid.x,
            Math.floor(i/grid.width) * grid.spacing + grid.y
        )
    }
}


PixiGame.GameScene.prototype.update = function() {

}


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

    draggable(ob)
    scale_on_grab(ob, 1.1)

    return ob
}


function new_container(x,y) {
    let ob = new PIXI.Graphics()
    ob.beginFill(0xFF0000)
    ob.drawRect(0,0,90,90)
    ob.endFill()

    ob.interactive = true
    ob.buttonMode = true

    ob.x = x
    ob.y = y

    draggable(ob)

    return ob
}


function collide(p1, p2, tol) {
    return tol > Math.sqrt((p2.y-p1.y)^2 + (p2.x-p1.x)^2)
}


function on_grab(ob, f) {
    ob
        .on('mousedown',  f)
        .on('touchstart', f)
}


function on_release(ob, f) {
    ob
        .on('mouseup',  f)
        .on('touchend', f)
        .on('mouseupoutside',  f)
        .on('touchendoutside', f)
}


function on_move(ob, f) {
    ob
        .on('mousemove', f)
        .on('touchmove', f)
}


function draggable(ob) {
    // Grab the object and save reference which allows us to grab the pointer
    // position
    on_grab(ob, (event) => {
        ob.pointer = event.data
        ob.drag = true
    })

    // release the object and clear reference to mouse event
    on_release(ob, () => {
        ob.data = null
        ob.drag = false
    })

    // Update position of self to pointer position
    on_move(ob, () => {
        if (ob.drag) {
            var pointerPos = ob.pointer.getLocalPosition(ob.parent);
            ob.x = pointerPos.x
            ob.y = pointerPos.y
        }
    })
}


function scale_on_grab(ob, factor) {
    on_grab(ob, () => {
        ob.scale.x *= factor
        ob.scale.y *= factor
    })

    on_release(ob, () => {
        ob.scale.x /= factor
        ob.scale.y /= factor
    })
}
