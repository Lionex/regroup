PixiGame.GameScene = function() {
    PIXI.Graphics.call(this)

    this._objects = null

    this._containers = null

    this._config = null

    this.setup()
};


PixiGame.GameScene.constructor = PixiGame.GameScene;


PixiGame.GameScene.prototype = Object.create(PIXI.Graphics.prototype);


PixiGame.GameScene.prototype.setup = function() {
    this._config = {
        ob: {
            scale: {
                x: 0.5,
                y: 0.5,
            },
            colors: [
                0xF9D423,
                0x79B7B4,
                0xE1F5C4,
                0xCE6B5D,
                0x941F1F,
                0x7AB317,
                0x87758F
            ],
            texture: {
                length: 7,
                id: PixiGame.loader.resources["object"].textures,
            },
            spawn: {
                x: PixiGame.renderer.width/2,
                y: PixiGame.renderer.height/2,
                width: 5,
                heigh: 5,
            }
        },
        con: {
            scale: {
                x: 90,
                y: 90,
            },
            line_color: 0x000000,
            color: 0xFFFFFF,
            spawn: {
                x: PixiGame.renderer.width/2,
                y: PixiGame.renderer.height/8,
                width: 3,
                height: 1,
            }
        }
    }

    // Set config values that are set from other values
    this._config.ob.spawn.x -=
        this._config.ob.spawn.width/2*this._config.ob.spawn.spacing - 32
    this._config.con.spawn.spacing = this._config.con.scale.x*1.2
    this._config.con.spawn.x -=
        this._config.con.spawn.width/2*this._config.con.spawn.spacing


    this._containers = new PIXI.Container()

    spawn_grid(
        this._config.con.spawn,
        (x,y) => { this._containers.addChild(
            new_container(x, y, this._config.con)
        )}
    )

    this._objects = new PIXI.Container()

    spawn_grid(
        this._config.ob.spawn,
        (x,y) => {
            ob = new_object(t, x, y, this._config.ob)
            this._objects.addChild(ob)
        }
    )

    this._objects.children.map((ob) => {
        remove_self(ob, this._objects, this._containers.children)
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
    if (this._objects.children.length === 0) {
        spawn_grid(
            {
                x: PixiGame.renderer.width/2-((64)*2.5), y: 320,
                width: 5, height: 5,
                spacing: 64+30
            },
            (x,y) => {
                ob = new_object(x, y, this._config.ob)
                this._objects.addChild(ob)
            }
        )

        this._objects.children.map((ob) => {
            remove_self(ob, this._objects, this._containers.children)
        })
    }
}


PixiGame.GameScene.prototype.destroy = function() {
    this.removeChildren();
}


function new_object(x, y, config) {
    // Define object appearance

    let rand = Math.floor(Math.random() * config.texture.length)
    let texture = config.texture.id[rand+".png"]
    let ob = new PIXI.Sprite(texture)

    ob.anchor.set(0.5,0.5)
    ob.scale.set(config.scale.x, config.scale.y)
    ob.rotation = Math.floor(Math.random()*4) * Math.PI/2
    ob.tint = config.colors[Math.floor(Math.random() * config.colors.length)]

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


function remove_self(self, parent, colliders) {
    on_move(self, () => {
        self.alpha = 1
        colliders.map((con) => {
            if (collide(self,con,10)) {
                self.alpha = 0.8
            }
        })
    })
    on_release(self, () => {
        colliders.map((con) => {
            if (collide(self,con,10)) {
                parent.removeChild(self)
            }
        })
    })
}


function new_container(x,y,config) {
    let ob = new PIXI.Graphics()
    ob.lineStyle(config.scale.x/10, config.line_color)
    ob.beginFill(config.color)
    ob.drawRect(0,0,config.scale.x,config.scale.y)
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
