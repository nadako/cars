import Math.*;

import pixi.display.DisplayObjectContainer;
import pixi.Pixi;
import pixi.primitives.Graphics;
import sui.controls.LabelControl;

import Car;

class Main extends pixi.Application {
    public static inline var LEFT = 37;
    public static inline var UP = 38;
    public static inline var RIGHT = 39;
    public static inline var DOWN = 40;

    var pressed = new Map<Int,Bool>();
    var car = new Car();
    var carSprite = new Graphics();
    var wheels:Array<Graphics> = [];

    var steerAngleLabel:LabelControl;
    var throttleLabel:LabelControl;
    var brakeLabel:LabelControl;
    var velocityLabel:LabelControl;
    var positionLabel:LabelControl;
    var kmhLabel:LabelControl;

    function new() {
        super();
        onUpdate = _onUpdate;
        start();
        js.Browser.document.addEventListener("keyup", onKey);
        js.Browser.document.addEventListener("keydown", onKey);

        var ui = new sui.Sui();
        var f = ui.folder("settings");
        f.bind(car.mass);
        f.bind(car.inertia);
        f.bind(car.drag);
        f.bind(car.resistance);
        f.bind(car.caFront);
        f.bind(car.caRear);
        f.bind(car.maxGrip);
        f.int("drive train", DriveTrain.Rear, {
            list: [
                {label: "fwd", value: DriveTrain.Front},
                {label: "rwd", value: DriveTrain.Rear},
                {label: "4wd", value: DriveTrain.Full}
            ],
            listonly: true,
        },
        function(i) car.driveTrain = cast i);
        steerAngleLabel = ui.label("", "steeringAngle");
        throttleLabel = ui.label("", "throttle");
        brakeLabel = ui.label("", "brake");
        velocityLabel = ui.label("", "velocity");
        positionLabel = ui.label("", "position");
        kmhLabel = ui.label("", "kmh");
        ui.attach(sui.Sui.Anchor.topLeft);

        var container = new DisplayObjectContainer();
        container.scale.set(30, 30);
        container.position.set(_stage.width / 2, _stage.height / 2);
        _stage.addChild(container);

        carSprite.beginFill(0);
        carSprite.drawRect(-car.size.x / 2, -car.size.y / 2, car.size.x, car.size.y);
        carSprite.endFill();

        function makeWheel(x:Float, y:Float):Graphics {
            var g = new Graphics();
            g.beginFill(0xFF0000);
            g.drawRect(-car.wheelSize.x / 2, -car.wheelSize.y / 2, car.wheelSize.x, car.wheelSize.y);
            g.endFill();
            g.x = x;
            g.y = -y;
            carSprite.addChild(g);
            return g;
        }

        wheels = [
            makeWheel(-car.size.x / 2, car.frontAxleToCg),
            makeWheel(car.size.x / 2, car.frontAxleToCg),
            makeWheel(-car.size.x / 2, -car.rearAxleToCg),
            makeWheel(car.size.x / 2, -car.rearAxleToCg),
        ];

        container.addChild(carSprite);
    }

    function onKey(e:js.html.KeyboardEvent) {
        switch (e.type) {
            case "keydown":
                pressed[e.keyCode] = true;
            case "keyup":
                pressed.remove(e.keyCode);
            default:
        }
    }

    inline function isPressed(key:Int):Bool return pressed.exists(key);

    function _onUpdate(elapsedTime:Float) {
        var dt = elapsedTime / 1000;

        car.steerAngle =
            if (isPressed(LEFT))
                max(-PI / 4, car.steerAngle - PI * dt)
            else if (isPressed(RIGHT))
                min(PI / 4, car.steerAngle + PI * dt)
            else if (car.steerAngle < 0)
                min(0, car.steerAngle + PI * dt * 2)
            else if (car.steerAngle > 0)
                max(0, car.steerAngle - PI * dt * 2)
            else
                0;

        if (isPressed(UP)) {
            car.throttle = 8391 / 100;
            car.brake = 0;
        } else if (isPressed(DOWN)) {
            car.throttle = -100;
            car.brake = 0;
        } else {
            car.throttle = 0;
            car.brake = 0;
        }

        car.update(dt);

        carSprite.position.set(car.position.x, -car.position.y);
        carSprite.rotation = car.angle;
        wheels[0].rotation = wheels[1].rotation = car.steerAngle;

        steerAngleLabel.set(fs(car.steerAngle * Pixi.RAD_TO_DEG));
        throttleLabel.set(fs(car.throttle));
        brakeLabel.set(fs(car.brake));
        velocityLabel.set(car.velocity.toString());
        positionLabel.set(car.position.toString());
        kmhLabel.set(fs(car.velocity.length * 3.6));
    }

    static function main() {
        new Main();
    }

    public static inline function fs(v:Float):String return Std.string(round(v * 100) / 100);
}

