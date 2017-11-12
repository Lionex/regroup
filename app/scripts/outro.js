document.addEventListener('DOMContentLoaded', function() {

    //
    PixiGame.renderer = new PIXI.autoDetectRenderer(
        window.innerWidth,
        window.innerHeight,
        { backgroundColor: 0x1099bb }
    );
    PixiGame.renderer.autoResize = true

    PixiGame.renderer.view.setAttribute('class', 'renderer');
    document.body.appendChild(PixiGame.renderer.view);

    //
    PixiGame.stage = new PIXI.Container();

    //
    PixiGame.sceneController = new PixiGame.SceneController(PixiGame.MainMenuScene);

    //
    PixiGame.gameLoopController = new PixiGame.GameLoopController();
    PixiGame.gameLoopController.start();

    PixiGame.loader = PIXI.loader

    // Load assests and start game
    PixiGame.loader
        .add('object','images/game/object.json')
        .load(setup)

    function setup() {
        PixiGame.gameLoopController.start()
    }
});
