import Math.*;

@:enum abstract DriveTrain(Int) to Int {
    var Front = 2;
    var Rear = 0;
    var Full = 1;
}

@:publicFields
class Car {
    // config
    var frontAxleToCg:Float = 1.2;
    var rearAxleToCg:Float = 1.2;
    var cgHeight:Float = 1;
    var mass:Float = 1500;
    var inertia:Float = 1500;
    var size:Vec2 = new Vec2(1.5, 3);
    var wheelSize:Vec2 = new Vec2(0.3, 0.7);
    var driveTrain:DriveTrain = Rear;

    // constants
    var gravity:Float = 9.81;
    var drag:Float = 5.0;
    var resistance:Float = 30;
    var caFront:Float = -5.0;
    var caRear:Float = -5.2;
    var maxGrip:Float = 2.0;

    // values
    var position:Vec2 = new Vec2(10, -10);
    var velocity:Vec2 = new Vec2(0, 0);
    var angle:Float = 0;
    var angularVelocity:Float = 0;

    // controls
    var throttle:Float = 0;
    var brake:Float = 0;
    var steerAngle:Float = 0;

    function new() {}

    function update(dt:Float) {
        var localVelocity = velocity.rotate(angle);

        var slipAngleFront, slipAngleRear;
        if (localVelocity.x == 0) {
            slipAngleFront = slipAngleRear = 0.0;
        } else {
            var absVLong = abs(localVelocity.x);
            slipAngleFront = atan2(localVelocity.y + angularVelocity * frontAxleToCg, absVLong) - (steerAngle * (localVelocity.x < 0 ? -1 : 1));
            slipAngleRear = atan2(localVelocity.y - angularVelocity * rearAxleToCg, absVLong);
        }

        var wheelBase = frontAxleToCg + rearAxleToCg;
        var totalWeight = mass * gravity;
        var weightFront = (rearAxleToCg / wheelBase) * totalWeight;
        var weightRear = (frontAxleToCg / wheelBase) * totalWeight;
        // TODO: acceleration based weight shifting

        var fLateralFront = new Vec2(0, max(-maxGrip, min(maxGrip, caFront * slipAngleFront)) * weightFront);
        var fLateralRear = new Vec2(0, max(-maxGrip, min(maxGrip, caRear * slipAngleRear)) * weightRear);

        var frontCoef = 0.5 * driveTrain;
        var rearCoef = 1 - frontCoef;

        var fTraction = new Vec2(
            100 * (throttle * (rearCoef + frontCoef * cos(steerAngle)) - brake * (localVelocity.x < 0 ? -1 : 1)),
            100 * (throttle * frontCoef * sin(steerAngle))
        );

        var fResistance = new Vec2(
            -(resistance * localVelocity.x + drag * localVelocity.x * abs(localVelocity.x)),
            -(resistance * localVelocity.y + drag * localVelocity.y * abs(localVelocity.y))
        );

        var fCornering = fLateralRear + fLateralFront * cos(steerAngle);
        var fTotal = fTraction + fResistance + fCornering;

        var localAcceleration = fTotal / mass;
        var acceleration = localAcceleration.rotate(angle);
        velocity += dt * acceleration;
        position += dt * velocity;

        var torque = -fLateralRear.y * rearAxleToCg + fLateralFront.y * frontAxleToCg;
        var angularAcceleration = torque / inertia;
        angularVelocity += dt * angularAcceleration;
        angle += dt * angularVelocity;
    }
}
