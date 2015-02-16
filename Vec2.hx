@:forward
abstract Vec2(Vec2Data) {
    public inline function new(x = 0.0, y = 0.0) {
        this = new Vec2Data(x, y);
    }

    @:op(A += B) static inline function addeq(a:Vec2, b:Vec2):Vec2 {
        a.x += b.x;
        a.y += b.y;
        return a;
    }

    @:op(A + B) static inline function add(a:Vec2, b:Vec2):Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    @:commutative
    @:op(A * B) static inline function mul(a:Vec2, b:Float):Vec2 {
        return new Vec2(a.x * b, a.y * b);
    }

    @:op(A / B) static inline function div(a:Vec2, b:Float):Vec2 {
        return new Vec2(a.x / b, a.y / b);
    }

    public var length(get,never):Float;
    inline function get_length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public inline function rotate(angle:Float):Vec2 {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return new Vec2(this.x * sin + this.y * cos, this.x * cos - this.y * sin);
    }
}

@:publicFields
private class Vec2Data {
    var x:Float;
    var y:Float;
    inline function new(x, y) {
        this.x = x;
        this.y = y;
    }
    inline function toString():String {
        return '{${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100}}';
    }
}
