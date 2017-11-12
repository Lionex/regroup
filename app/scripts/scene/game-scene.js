PixiGame.GameScene = function() {
    PIXI.Graphics.call(this)

    this._objects = null

    this._containers = null

    this._object_atlas = null

    this.setup()
};


PixiGame.GameScene.constructor = PixiGame.GameScene;


PixiGame.GameScene.prototype = Object.create(PIXI.Graphics.prototype);


PixiGame.GameScene.prototype.setup = function() {
    let cx = PixiGame.renderer.width/2;

    this._object_atlas = PixiGame.loader.resources["object"].textures

    this._containers = new PIXI.Container()

    this._containers.addChild(new_container(cx, 100))

    this._objects = new PIXI.Container()

    let i = 0;
    spawn_grid(
        {
            x: cx-((64)*2.5), y: 320,
            width: 5, height: 5,
            spacing: 64+30
        },
        (x,y) => {
            let t = this._object_atlas[(i++ % 7) + ".png"]
            this._objects.addChild(new_object(t, x, y))
        }
    )

    // Add removal behaviour to object
    this._objects.children.map((ob) => {
        on_move(ob, () => {
            ob.alpha = 1
            this._containers.children.map((con) => {
                if (collide(ob,con,10)) {
                    ob.alpha = 0.8
                }
            })
        })
        on_release(ob, () => {
            this._containers.children.map((con) => {
                if (collide(ob,con,10)) {
                    this._objects.removeChild(ob)
                }
            })
        })
    })

    this.addChild(this._containers)
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

function new_object(texture, x, y) {
    // Define object appearance
    let ob = new PIXI.Sprite(texture)

    ob.anchor.set(0.5,0.5)
    ob.scale.set(0.5,0.5)

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
