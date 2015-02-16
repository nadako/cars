(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Car = function() {
	this.steerAngle = 0;
	this.brake = 0;
	this.throttle = 0;
	this.angularVelocity = 0;
	this.angle = 0;
	this.velocity = new _$Vec2_Vec2Data(0,0);
	this.position = new _$Vec2_Vec2Data(10,-10);
	this.maxGrip = 2.0;
	this.caRear = -5.2;
	this.caFront = -5.0;
	this.resistance = 30;
	this.drag = 5.0;
	this.gravity = 9.81;
	this.driveTrain = 0;
	this.wheelSize = new _$Vec2_Vec2Data(0.3,0.7);
	this.size = new _$Vec2_Vec2Data(1.5,3);
	this.inertia = 1500;
	this.mass = 1500;
	this.rearAxleToCg = 1.2;
	this.frontAxleToCg = 1.2;
};
Car.__name__ = true;
Car.prototype = {
	update: function(dt) {
		var this1 = this.velocity;
		var angle = this.angle;
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var localVelocity_x = this1.x * sin + this1.y * cos;
		var localVelocity_y = this1.x * cos - this1.y * sin;
		var slipAngleFront;
		var slipAngleRear;
		if(localVelocity_x == 0) slipAngleFront = slipAngleRear = 0.0; else {
			var absVLong = Math.abs(localVelocity_x);
			slipAngleFront = Math.atan2(localVelocity_y + this.angularVelocity * this.frontAxleToCg,absVLong) - this.steerAngle * (localVelocity_x < 0?-1:1);
			slipAngleRear = Math.atan2(localVelocity_y - this.angularVelocity * this.rearAxleToCg,absVLong);
		}
		var wheelBase = this.frontAxleToCg + this.rearAxleToCg;
		var totalWeight = this.mass * this.gravity;
		var weightFront = this.rearAxleToCg / wheelBase * totalWeight;
		var weightRear = this.frontAxleToCg / wheelBase * totalWeight;
		var y = Math.max(-this.maxGrip,Math.min(this.maxGrip,this.caFront * slipAngleFront)) * weightFront;
		var fLateralFront_y = y;
		var y1 = Math.max(-this.maxGrip,Math.min(this.maxGrip,this.caRear * slipAngleRear)) * weightRear;
		var fLateralRear_y = y1;
		var frontCoef = 0.5 * this.driveTrain;
		var rearCoef = 1 - frontCoef;
		var x = 100 * (this.throttle * (rearCoef + frontCoef * Math.cos(this.steerAngle)) - this.brake * (localVelocity_x < 0?-1:1));
		var y2 = 100 * (this.throttle * frontCoef * Math.sin(this.steerAngle));
		var fTraction_x = x;
		var fTraction_y = y2;
		var x1 = -(this.resistance * localVelocity_x + this.drag * localVelocity_x * Math.abs(localVelocity_x));
		var y3 = -(this.resistance * localVelocity_y + this.drag * localVelocity_y * Math.abs(localVelocity_y));
		var fResistance_x = x1;
		var fResistance_y = y3;
		var b = Math.cos(this.steerAngle);
		var b_x = 0 * b;
		var b_y = fLateralFront_y * b;
		var fCornering_x = b_x;
		var fCornering_y = fLateralRear_y + b_y;
		var a_x = fTraction_x + fResistance_x;
		var a_y = fTraction_y + fResistance_y;
		var fTotal_x = a_x + fCornering_x;
		var fTotal_y = a_y + fCornering_y;
		var b1 = this.mass;
		var localAcceleration_x = fTotal_x / b1;
		var localAcceleration_y = fTotal_y / b1;
		var angle1 = this.angle;
		var cos1 = Math.cos(angle1);
		var sin1 = Math.sin(angle1);
		var acceleration_x = localAcceleration_x * sin1 + localAcceleration_y * cos1;
		var acceleration_y = localAcceleration_x * cos1 - localAcceleration_y * sin1;
		var a = this.velocity;
		var b_x1 = acceleration_x * dt;
		var b_y1 = acceleration_y * dt;
		a.x += b_x1;
		a.y += b_y1;
		var a1 = this.position;
		var a2 = this.velocity;
		var b_x2 = a2.x * dt;
		var b_y2 = a2.y * dt;
		a1.x += b_x2;
		a1.y += b_y2;
		var torque = -fLateralRear_y * this.rearAxleToCg + fLateralFront_y * this.frontAxleToCg;
		var angularAcceleration = torque / this.inertia;
		this.angularVelocity += dt * angularAcceleration;
		this.angle += dt * this.angularVelocity;
	}
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		var tmp;
		if((this.r.m != null?n >= 0:false)?n < this.r.m.length:false) tmp = this.r.m[n]; else throw "EReg::matched";
		return tmp;
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var pixi_Application = function() {
	this._lastTime = new Date();
	this._setDefaultValues();
};
pixi_Application.__name__ = true;
pixi_Application.prototype = {
	_setDefaultValues: function() {
		this.pixelRatio = 1;
		this.skipFrame = false;
		this.set_stats(false);
		this.backgroundColor = 16777215;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.resize = true;
		this._skipFrame = false;
	}
	,start: function() {
		var tmp;
		var _this = window.document;
		tmp = _this.createElement("canvas");
		this._canvas = tmp;
		this._canvas.style.width = this.width + "px";
		this._canvas.style.height = this.height + "px";
		this._canvas.style.position = "absolute";
		window.document.body.appendChild(this._canvas);
		this._stage = new PIXI.Stage(this.backgroundColor);
		var renderingOptions = { };
		renderingOptions.view = this._canvas;
		renderingOptions.resolution = this.pixelRatio;
		this._renderer = PIXI.autoDetectRenderer(this.width,this.height,renderingOptions);
		window.document.body.appendChild(this._renderer.view);
		if(this.resize) window.onresize = $bind(this,this._onWindowResize);
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
		this._lastTime = new Date();
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this._renderer.resize(this.width,this.height);
		this._canvas.style.width = this.width + "px";
		this._canvas.style.height = this.height + "px";
		if(this.onResize != null) this.onResize();
	}
	,_onRequestAnimationFrame: function() {
		if(this.skipFrame?this._skipFrame:false) this._skipFrame = false; else {
			this._skipFrame = true;
			this._calculateElapsedTime();
			if(this.onUpdate != null) this.onUpdate(this._elapsedTime);
			this._renderer.render(this._stage);
		}
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
		if(this._stats != null) this._stats.update();
	}
	,_calculateElapsedTime: function() {
		this._currentTime = new Date();
		this._elapsedTime = this._currentTime.getTime() - this._lastTime.getTime();
		this._lastTime = this._currentTime;
	}
	,set_stats: function(val) {
		if(val) {
			var _container = window.document.createElement("div");
			window.document.body.appendChild(_container);
			this._stats = new Stats();
			this._stats.domElement.style.position = "absolute";
			this._stats.domElement.style.top = "2px";
			this._stats.domElement.style.right = "2px";
			_container.appendChild(this._stats.domElement);
			this._stats.begin();
		}
		return this.stats = val;
	}
};
var Main = function() {
	this.wheels = [];
	this.carSprite = new PIXI.Graphics();
	this.car = new Car();
	this.pressed = new haxe_ds_IntMap();
	var _g = this;
	pixi_Application.call(this);
	this.onUpdate = $bind(this,this._onUpdate);
	this.start();
	window.document.addEventListener("keyup",$bind(this,this.onKey));
	window.document.addEventListener("keydown",$bind(this,this.onKey));
	var ui = new sui_Sui();
	var f = ui.folder("settings");
	f["float"]("mass",this.car.mass,null,function(v) {
		_g.car.mass = v;
	});
	f["float"]("inertia",this.car.inertia,null,function(v1) {
		_g.car.inertia = v1;
	});
	f["float"]("drag",this.car.drag,null,function(v2) {
		_g.car.drag = v2;
	});
	f["float"]("resistance",this.car.resistance,null,function(v3) {
		_g.car.resistance = v3;
	});
	f["float"]("ca front",this.car.caFront,null,function(v4) {
		_g.car.caFront = v4;
	});
	f["float"]("ca rear",this.car.caRear,null,function(v5) {
		_g.car.caRear = v5;
	});
	f["float"]("max grip",this.car.maxGrip,null,function(v6) {
		_g.car.maxGrip = v6;
	});
	f["int"]("drive train",0,{ list : [{ label : "fwd", value : 2},{ label : "rwd", value : 0},{ label : "4wd", value : 1}], listonly : true},function(i) {
		_g.car.driveTrain = i;
	});
	this.steerAngleLabel = ui.label("","steeringAngle");
	this.throttleLabel = ui.label("","throttle");
	this.brakeLabel = ui.label("","brake");
	this.velocityLabel = ui.label("","velocity");
	this.positionLabel = ui.label("","position");
	this.kmhLabel = ui.label("","kmh");
	ui.attach(null,"sui-top-left");
	var container = new pixi_display_DisplayObjectContainer();
	container.scale.set(30,30);
	container.position.set(this._stage.width / 2,this._stage.height / 2);
	this._stage.addChild(container);
	this.carSprite.beginFill(0);
	this.carSprite.drawRect(-this.car.size.x / 2,-this.car.size.y / 2,this.car.size.x,this.car.size.y);
	this.carSprite.endFill();
	var makeWheel = function(x,y) {
		var g = new PIXI.Graphics();
		g.beginFill(16711680);
		g.drawRect(-_g.car.wheelSize.x / 2,-_g.car.wheelSize.y / 2,_g.car.wheelSize.x,_g.car.wheelSize.y);
		g.endFill();
		g.x = x;
		g.y = -y;
		_g.carSprite.addChild(g);
		return g;
	};
	this.wheels = [makeWheel(-this.car.size.x / 2,this.car.frontAxleToCg),makeWheel(this.car.size.x / 2,this.car.frontAxleToCg),makeWheel(-this.car.size.x / 2,-this.car.rearAxleToCg),makeWheel(this.car.size.x / 2,-this.car.rearAxleToCg)];
	container.addChild(this.carSprite);
};
Main.__name__ = true;
Main.main = function() {
	new Main();
};
Main.__super__ = pixi_Application;
Main.prototype = $extend(pixi_Application.prototype,{
	onKey: function(e) {
		var _g = e.type;
		switch(_g) {
		case "keydown":
			this.pressed.h[e.keyCode] = true;
			true;
			break;
		case "keyup":
			this.pressed.remove(e.keyCode);
			break;
		default:
		}
	}
	,_onUpdate: function(elapsedTime) {
		var dt = elapsedTime / 1000;
		var tmp;
		if(this.pressed.h.hasOwnProperty(37)) tmp = Math.max(-Math.PI / 4,this.car.steerAngle - Math.PI * dt); else if(this.pressed.h.hasOwnProperty(39)) tmp = Math.min(Math.PI / 4,this.car.steerAngle + Math.PI * dt); else if(this.car.steerAngle < 0) tmp = Math.min(0,this.car.steerAngle + Math.PI * dt * 2); else if(this.car.steerAngle > 0) tmp = Math.max(0,this.car.steerAngle - Math.PI * dt * 2); else tmp = 0;
		this.car.steerAngle = tmp;
		if(this.pressed.h.hasOwnProperty(38)) {
			this.car.throttle = 83.91;
			this.car.brake = 0;
		} else if(this.pressed.h.hasOwnProperty(40)) {
			this.car.throttle = -100;
			this.car.brake = 0;
		} else {
			this.car.throttle = 0;
			this.car.brake = 0;
		}
		this.car.update(dt);
		this.carSprite.position.set(this.car.position.x,-this.car.position.y);
		this.carSprite.rotation = this.car.angle;
		this.wheels[0].rotation = this.wheels[1].rotation = this.car.steerAngle;
		this.steerAngleLabel.set(Std.string(Math.round(this.car.steerAngle * PIXI.RAD_TO_DEG * 100) / 100));
		this.throttleLabel.set(Std.string(Math.round(this.car.throttle * 100) / 100));
		this.brakeLabel.set(Std.string(Math.round(this.car.brake * 100) / 100));
		var tmp1;
		var _this = this.car.velocity;
		tmp1 = "{" + Math.round(_this.x * 100) / 100 + ", " + Math.round(_this.y * 100) / 100 + "}";
		this.velocityLabel.set(tmp1);
		var tmp2;
		var _this1 = this.car.position;
		tmp2 = "{" + Math.round(_this1.x * 100) / 100 + ", " + Math.round(_this1.y * 100) / 100 + "}";
		this.positionLabel.set(tmp2);
		var tmp3;
		var tmp4;
		var this1 = this.car.velocity;
		tmp4 = Math.sqrt(this1.x * this1.x + this1.y * this1.y);
		var v = tmp4 * 3.6;
		tmp3 = Std.string(Math.round(v * 100) / 100);
		this.kmhLabel.set(tmp3);
	}
});
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
var _$Vec2_Vec2Data = function(x,y) {
	this.x = x;
	this.y = y;
};
_$Vec2_Vec2Data.__name__ = true;
var dots_Detect = function() { };
dots_Detect.__name__ = true;
dots_Detect.supportsInput = function(type) {
	var tmp;
	var _this = window.document;
	tmp = _this.createElement("input");
	var i = tmp;
	i.setAttribute("type",type);
	return i.type == type;
};
var dots_Dom = function() { };
dots_Dom.__name__ = true;
dots_Dom.addCss = function(css,container) {
	if(null == container) container = window.document.head;
	var tmp;
	var _this = window.document;
	tmp = _this.createElement("style");
	var style = tmp;
	style.type = "text/css";
	style.appendChild(window.document.createTextNode(css));
	container.appendChild(style);
};
var dots_Html = function() { };
dots_Html.__name__ = true;
dots_Html.parseNodes = function(html) {
	if(!dots_Html.pattern.match(html)) throw "Invalid pattern \"" + html + "\"";
	var tmp;
	var _g = dots_Html.pattern.matched(1).toLowerCase();
	switch(_g) {
	case "tbody":case "thead":
		tmp = window.document.createElement("table");
		break;
	case "td":case "th":
		tmp = window.document.createElement("tr");
		break;
	case "tr":
		tmp = window.document.createElement("tbody");
		break;
	default:
		tmp = window.document.createElement("div");
	}
	var el = tmp;
	el.innerHTML = html;
	return el.childNodes;
};
var dots_Query = function() { };
dots_Query.__name__ = true;
dots_Query.first = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelector(selector);
};
var haxe_StackItem = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = true;
haxe_CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.exceptionStack = function() {
	return [];
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		b.b += m == null?"null":"" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += file == null?"null":"" + file;
		b.b += " line ";
		b.b += line == null?"null":"" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		b.b += cname == null?"null":"" + cname;
		b.b += ".";
		b.b += meth == null?"null":"" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		b.b += n == null?"null":"" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe_StackItem.Module(line));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
};
var haxe_ds_Option = { __ename__ : true, __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var pixi_display_DisplayObject = function() {
	PIXI.DisplayObject.call(this);
	this.name = "";
};
pixi_display_DisplayObject.__name__ = true;
pixi_display_DisplayObject.__super__ = PIXI.DisplayObject;
pixi_display_DisplayObject.prototype = $extend(PIXI.DisplayObject.prototype,{
});
var pixi_display_DisplayObjectContainer = function() {
	PIXI.DisplayObjectContainer.call(this);
};
pixi_display_DisplayObjectContainer.__name__ = true;
pixi_display_DisplayObjectContainer.__super__ = PIXI.DisplayObjectContainer;
pixi_display_DisplayObjectContainer.prototype = $extend(PIXI.DisplayObjectContainer.prototype,{
});
var pixi_renderers_IRenderer = function() { };
pixi_renderers_IRenderer.__name__ = true;
var sui_Sui = function() {
	this.grid = new sui_components_Grid();
	this.el = this.grid.el;
};
sui_Sui.__name__ = true;
sui_Sui.createFloat = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0.0;
	var tmp;
	var tmp1;
	var tmp3;
	var _0 = options;
	var _1;
	if(null == _0) tmp3 = null; else if(null == (_1 = _0.listonly)) tmp3 = null; else tmp3 = _1;
	var t = tmp3;
	if(t != null) tmp1 = t; else tmp1 = false;
	var _g = tmp1;
	var tmp2;
	var tmp4;
	var _01 = options;
	var _11;
	if(null == _01) tmp4 = null; else if(null == (_11 = _01.kind)) tmp4 = null; else tmp4 = _11;
	var t1 = tmp4;
	if(t1 != null) tmp2 = t1; else tmp2 = sui_controls_FloatKind.FloatNumber;
	var _g1 = tmp2;
	if(_g != null) switch(_g) {
	case true:
		tmp = new sui_controls_NumberSelectControl(defaultValue,options);
		break;
	default:
		switch(_g1[1]) {
		case 1:
			tmp = new sui_controls_TimeControl(defaultValue,options);
			break;
		default:
			if((null != options?options.min != null:false)?options.max != null:false) tmp = new sui_controls_FloatRangeControl(defaultValue,options); else tmp = new sui_controls_FloatControl(defaultValue,options);
		}
	} else switch(_g1[1]) {
	case 1:
		tmp = new sui_controls_TimeControl(defaultValue,options);
		break;
	default:
		if((null != options?options.min != null:false)?options.max != null:false) tmp = new sui_controls_FloatRangeControl(defaultValue,options); else tmp = new sui_controls_FloatControl(defaultValue,options);
	}
	return tmp;
};
sui_Sui.createInt = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0;
	var tmp;
	var tmp2;
	var _0 = options;
	var _1;
	if(null == _0) tmp2 = null; else if(null == (_1 = _0.listonly)) tmp2 = null; else tmp2 = _1;
	var t = tmp2;
	if(t != null) tmp = t; else tmp = false;
	var tmp1;
	if(tmp) tmp1 = new sui_controls_NumberSelectControl(defaultValue,options); else if((null != options?options.min != null:false)?options.max != null:false) tmp1 = new sui_controls_IntRangeControl(defaultValue,options); else tmp1 = new sui_controls_IntControl(defaultValue,options);
	return tmp1;
};
sui_Sui.createLabel = function(defaultValue,label,callback) {
	if(defaultValue == null) defaultValue = "";
	return new sui_controls_LabelControl(defaultValue);
};
sui_Sui.prototype = {
	'float': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0.0;
		return this.control(label,sui_Sui.createFloat(defaultValue,options),callback);
	}
	,folder: function(label,options) {
		var tmp;
		var tmp2;
		var _0 = options;
		var _1;
		if(null == _0) tmp2 = null; else if(null == (_1 = _0.collapsible)) tmp2 = null; else tmp2 = _1;
		var t = tmp2;
		if(t != null) tmp = t; else tmp = true;
		var collapsible = tmp;
		var tmp1;
		var tmp3;
		var _01 = options;
		var _11;
		if(null == _01) tmp3 = null; else if(null == (_11 = _01.collapsed)) tmp3 = null; else tmp3 = _11;
		var t1 = tmp3;
		if(t1 != null) tmp1 = t1; else tmp1 = false;
		var collapsed = tmp1;
		var sui1 = new sui_Sui();
		var header = { el : dots_Html.parseNodes("<header class=\"sui-folder\">\n<i class=\"sui-trigger-toggle sui-icon sui-icon-collapse\"></i>\n" + label + "</header>")[0]};
		var trigger = dots_Query.first(".sui-trigger-toggle",header.el);
		if(collapsible) {
			header.el.classList.add("sui-collapsible");
			if(collapsed) sui1.grid.el.style.display = "none";
			var collapse = thx_stream_EmitterBools.negate(thx_stream_dom_Dom.streamEvent(header.el,"click",false).map(function(_) {
				return collapsed = !collapsed;
			}));
			var tmp4;
			var fa = thx_stream_dom_Dom.subscribeToggleVisibility(sui1.grid.el);
			var fb = thx_stream_dom_Dom.subscribeSwapClass(trigger,"sui-icon-collapse","sui-icon-expand");
			tmp4 = function(v) {
				fa(v);
				fb(v);
			};
			collapse.subscribe(tmp4);
		} else trigger.style.display = "none";
		sui1.grid.el.classList.add("sui-grid-inner");
		this.grid.add(sui_components_CellContent.VerticalPair(header,sui1.grid));
		return sui1;
	}
	,'int': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0;
		return this.control(label,sui_Sui.createInt(defaultValue,options),callback);
	}
	,label: function(defaultValue,label,callback) {
		if(defaultValue == null) defaultValue = "";
		return this.control(label,sui_Sui.createLabel(defaultValue),callback);
	}
	,control: function(label,control,callback) {
		this.grid.add(null == label?sui_components_CellContent.Single(control):sui_components_CellContent.HorizontalPair(new sui_controls_LabelControl(label),control));
		control.streams.value.subscribe(callback);
		return control;
	}
	,attach: function(el,anchor) {
		if(null == el) el = window.document.body;
		var tmp;
		var tmp1;
		var _0 = anchor;
		if(null == _0) tmp1 = null; else tmp1 = _0;
		var t = tmp1;
		if(t != null) tmp = t; else if(el == window.document.body) tmp = "sui-top-right"; else tmp = "sui-append";
		this.el.classList.add(tmp);
		el.appendChild(this.el);
	}
};
var sui_components_Grid = function() {
	this.el = dots_Html.parseNodes("<table class=\"sui-grid\"></table>")[0];
};
sui_components_Grid.__name__ = true;
sui_components_Grid.prototype = {
	add: function(cell) {
		var _g = this;
		switch(cell[1]) {
		case 0:
			var control = cell[2];
			var container = dots_Html.parseNodes("<tr class=\"sui-single\"><td colspan=\"2\"></td></tr>")[0];
			dots_Query.first("td",container).appendChild(control.el);
			this.el.appendChild(container);
			break;
		case 2:
			var right = cell[3];
			var left = cell[2];
			var container1 = dots_Html.parseNodes("<tr class=\"sui-horizontal\"><td class=\"sui-left\"></td><td class=\"sui-right\"></td></tr>")[0];
			dots_Query.first(".sui-left",container1).appendChild(left.el);
			dots_Query.first(".sui-right",container1).appendChild(right.el);
			this.el.appendChild(container1);
			break;
		case 1:
			var bottom = cell[3];
			var top = cell[2];
			var tmp;
			var list = dots_Html.parseNodes("<tr class=\"sui-vertical sui-top\"><td colspan=\"2\"></td></tr><tr class=\"sui-vertical sui-bottom\"><td colspan=\"2\"></td></tr>");
			tmp = Array.prototype.slice.call(list,0);
			var containers = tmp;
			dots_Query.first("td",containers[0]).appendChild(top.el);
			dots_Query.first("td",containers[1]).appendChild(bottom.el);
			containers.map(function(_) {
				return _g.el.appendChild(_);
			});
			break;
		}
	}
};
var sui_components_CellContent = { __ename__ : true, __constructs__ : ["Single","VerticalPair","HorizontalPair"] };
sui_components_CellContent.Single = function(control) { var $x = ["Single",0,control]; $x.__enum__ = sui_components_CellContent; return $x; };
sui_components_CellContent.VerticalPair = function(top,bottom) { var $x = ["VerticalPair",1,top,bottom]; $x.__enum__ = sui_components_CellContent; return $x; };
sui_components_CellContent.HorizontalPair = function(left,right) { var $x = ["HorizontalPair",2,left,right]; $x.__enum__ = sui_components_CellContent; return $x; };
var sui_controls_IControl = function() { };
sui_controls_IControl.__name__ = true;
var sui_controls_SingleInputControl = function(defaultValue,event,name,type,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><input type=\"" + type + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.input = dots_Query.first("input",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.setInput(defaultValue);
	thx_stream_dom_Dom.streamFocus(this.input).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.input,event).map(function(_) {
		return _g.getInput();
	}).feed(this.values.value);
	if(!options.allownull) this.input.setAttribute("required","required");
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_SingleInputControl.__name__ = true;
sui_controls_SingleInputControl.__interfaces__ = [sui_controls_IControl];
sui_controls_SingleInputControl.prototype = {
	setInput: function(v) {
		throw new thx_core_error_AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 64, className : "sui.controls.SingleInputControl", methodName : "setInput"});
	}
	,getInput: function() {
		throw new thx_core_error_AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 67, className : "sui.controls.SingleInputControl", methodName : "getInput"});
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,focus: function() {
		this.input.focus();
	}
};
var sui_controls_DoubleInputControl = function(defaultValue,name,event1,type1,event2,type2,filter,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-double sui-type-" + name + "\"><input class=\"input1\" type=\"" + type1 + "\"/><input class=\"input2\" type=\"" + type2 + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.input1 = dots_Query.first(".input1",this.el);
	this.input2 = dots_Query.first(".input2",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input1.removeAttribute("disabled");
			_g.input2.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input1.setAttribute("disabled","disabled");
			_g.input2.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx_stream_dom_Dom.streamFocus(this.input1).merge(thx_stream_dom_Dom.streamFocus(this.input2)).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.input1,event1).map(function(_) {
		return _g.getInput1();
	}).subscribe(function(v2) {
		_g.setInput2(v2);
		_g.values.value.set(v2);
	});
	thx_stream_dom_Dom.streamEvent(this.input2,event2).map(function(_1) {
		return _g.getInput2();
	}).filter(filter).subscribe(function(v3) {
		_g.setInput1(v3);
		_g.values.value.set(v3);
	});
	if(!options.allownull) {
		this.input1.setAttribute("required","required");
		this.input2.setAttribute("required","required");
	}
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
	if(!dots_Detect.supportsInput(type1)) this.input1.style.display = "none";
};
sui_controls_DoubleInputControl.__name__ = true;
sui_controls_DoubleInputControl.__interfaces__ = [sui_controls_IControl];
sui_controls_DoubleInputControl.prototype = {
	setInputs: function(v) {
		this.setInput1(v);
		this.setInput2(v);
	}
	,setInput1: function(v) {
		throw new thx_core_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 89, className : "sui.controls.DoubleInputControl", methodName : "setInput1"});
	}
	,setInput2: function(v) {
		throw new thx_core_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 92, className : "sui.controls.DoubleInputControl", methodName : "setInput2"});
	}
	,getInput1: function() {
		throw new thx_core_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 95, className : "sui.controls.DoubleInputControl", methodName : "getInput1"});
	}
	,getInput2: function() {
		throw new thx_core_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 98, className : "sui.controls.DoubleInputControl", methodName : "getInput2"});
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,focus: function() {
		this.input2.focus();
	}
};
var sui_controls_ControlStreams = function(value,focused,enabled) {
	this.value = value;
	this.focused = focused;
	this.enabled = enabled;
};
sui_controls_ControlStreams.__name__ = true;
var sui_controls_ControlValues = function(defaultValue) {
	this.value = new thx_stream_Value(defaultValue);
	this.focused = new thx_stream_Value(false);
	this.enabled = new thx_stream_Value(true);
};
sui_controls_ControlValues.__name__ = true;
var sui_controls_DataList = function(container,values) {
	this.id = "sui-dl-" + ++sui_controls_DataList.nid;
	var tmp;
	var html = "<datalist id=\"" + this.id + "\" style=\"display:none\">" + values.map(sui_controls_DataList.toOption).join("") + "</datalist>";
	tmp = dots_Html.parseNodes(html)[0];
	var datalist = tmp;
	container.appendChild(datalist);
};
sui_controls_DataList.__name__ = true;
sui_controls_DataList.toOption = function(o) {
	return "<option value=\"" + StringTools.htmlEscape(o.value) + "\">" + o.label + "</option>";
};
sui_controls_DataList.prototype = {
	applyTo: function(el) {
		el.setAttribute("list",this.id);
		return this;
	}
};
var sui_controls_SelectControl = function(defaultValue,name,options) {
	this.count = 0;
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><select></select></div>";
	if(null == options) throw " A select control requires an option object with values or list set";
	if(null == options.values?null == options.list:false) throw " A select control requires either the values or list option";
	if(null == options.allownull) options.allownull = false;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.select = dots_Query.first("select",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.select.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.select.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.options = [];
	var tmp;
	if(options.allownull) {
		var tmp2;
		var tmp3;
		var _0 = options;
		var _1;
		if(null == _0) tmp3 = null; else if(null == (_1 = _0.labelfornull)) tmp3 = null; else tmp3 = _1;
		var t = tmp3;
		if(t != null) tmp2 = t; else tmp2 = "- none -";
		tmp = [{ label : tmp2, value : null}];
	} else tmp = [];
	var tmp1;
	var tmp4;
	var _01 = options;
	var _11;
	if(null == _01) tmp4 = null; else if(null == (_11 = _01.list)) tmp4 = null; else tmp4 = _11;
	var t1 = tmp4;
	if(t1 != null) tmp1 = t1; else tmp1 = options.values.map(function(_) {
		return { value : _, label : Std.string(_)};
	});
	tmp.concat(tmp1).map(function(_2) {
		return _g.addOption(_2.label,_2.value);
	});
	this.setInput(defaultValue);
	thx_stream_dom_Dom.streamFocus(this.select).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.select,"change").map(function(_3) {
		return _g.getInput();
	}).feed(this.values.value);
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_SelectControl.__name__ = true;
sui_controls_SelectControl.__interfaces__ = [sui_controls_IControl];
sui_controls_SelectControl.prototype = {
	addOption: function(label,value) {
		var index = this.count++;
		var option = dots_Html.parseNodes("<option>" + label + "</option>")[0];
		this.options[index] = value;
		this.select.appendChild(option);
		return option;
	}
	,setInput: function(v) {
		var index = this.options.indexOf(v);
		if(index < 0) throw "value \"" + Std.string(v) + "\" is not included in this select control";
		this.select.selectedIndex = index;
	}
	,getInput: function() {
		return this.options[this.select.selectedIndex];
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,focus: function() {
		this.select.focus();
	}
};
var sui_controls_NumberControl = function(value,name,options) {
	if(null == options) options = { };
	sui_controls_SingleInputControl.call(this,value,"input",name,"number",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min","" + Std.string(options.min));
	if(null != options.max) this.input.setAttribute("max","" + Std.string(options.max));
	if(null != options.step) this.input.setAttribute("step","" + Std.string(options.step));
	if(null != options.placeholder) this.input.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input);
};
sui_controls_NumberControl.__name__ = true;
sui_controls_NumberControl.__super__ = sui_controls_SingleInputControl;
sui_controls_NumberControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
});
var sui_controls_FloatControl = function(value,options) {
	sui_controls_NumberControl.call(this,value,"float",options);
};
sui_controls_FloatControl.__name__ = true;
sui_controls_FloatControl.__super__ = sui_controls_NumberControl;
sui_controls_FloatControl.prototype = $extend(sui_controls_NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return parseFloat(this.input.value);
	}
});
var sui_controls_NumberRangeControl = function(value,options) {
	sui_controls_DoubleInputControl.call(this,value,"float-range","input","range","input","number",function(v) {
		return v != null;
	},options);
	if(null != options.autocomplete) {
		this.input1.setAttribute("autocomplete",options.autocomplete?"on":"off");
		this.input2.setAttribute("autocomplete",options.autocomplete?"on":"off");
	}
	if(null != options.min) {
		this.input1.setAttribute("min","" + Std.string(options.min));
		this.input2.setAttribute("min","" + Std.string(options.min));
	}
	if(null != options.max) {
		this.input1.setAttribute("max","" + Std.string(options.max));
		this.input2.setAttribute("max","" + Std.string(options.max));
	}
	if(null != options.step) {
		this.input1.setAttribute("step","" + Std.string(options.step));
		this.input2.setAttribute("step","" + Std.string(options.step));
	}
	if(null != options.placeholder) this.input2.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input1).applyTo(this.input2); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input1).applyTo(this.input2);
	this.setInputs(value);
};
sui_controls_NumberRangeControl.__name__ = true;
sui_controls_NumberRangeControl.__super__ = sui_controls_DoubleInputControl;
sui_controls_NumberRangeControl.prototype = $extend(sui_controls_DoubleInputControl.prototype,{
	setInput1: function(v) {
		this.input1.value = "" + Std.string(v);
	}
	,setInput2: function(v) {
		this.input2.value = "" + Std.string(v);
	}
});
var sui_controls_FloatRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) options.min = Math.min(value,0);
	if(null == options.min) {
		var s = null != options.step?options.step:1;
		options.max = Math.max(value,s);
	}
	sui_controls_NumberRangeControl.call(this,value,options);
};
sui_controls_FloatRangeControl.__name__ = true;
sui_controls_FloatRangeControl.__super__ = sui_controls_NumberRangeControl;
sui_controls_FloatRangeControl.prototype = $extend(sui_controls_NumberRangeControl.prototype,{
	getInput1: function() {
		return thx_core_Floats.canParse(this.input1.value)?thx_core_Floats.parse(this.input1.value):null;
	}
	,getInput2: function() {
		return thx_core_Floats.canParse(this.input2.value)?thx_core_Floats.parse(this.input2.value):null;
	}
});
var sui_controls_IntControl = function(value,options) {
	sui_controls_NumberControl.call(this,value,"int",options);
};
sui_controls_IntControl.__name__ = true;
sui_controls_IntControl.__super__ = sui_controls_NumberControl;
sui_controls_IntControl.prototype = $extend(sui_controls_NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return Std.parseInt(this.input.value);
	}
});
var sui_controls_IntRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) options.min = value < 0?value:0;
	if(null == options.min) {
		var s = null != options.step?options.step:100;
		options.max = value > s?value:s;
	}
	sui_controls_NumberRangeControl.call(this,value,options);
};
sui_controls_IntRangeControl.__name__ = true;
sui_controls_IntRangeControl.__super__ = sui_controls_NumberRangeControl;
sui_controls_IntRangeControl.prototype = $extend(sui_controls_NumberRangeControl.prototype,{
	getInput1: function() {
		return thx_core_Ints.canParse(this.input1.value)?thx_core_Ints.parse(this.input1.value):null;
	}
	,getInput2: function() {
		return thx_core_Ints.canParse(this.input2.value)?thx_core_Ints.parse(this.input2.value):null;
	}
});
var sui_controls_LabelControl = function(defaultValue) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-label\"><output>" + defaultValue + "</output></div>";
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.output = dots_Query.first("output",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
};
sui_controls_LabelControl.__name__ = true;
sui_controls_LabelControl.__interfaces__ = [sui_controls_IControl];
sui_controls_LabelControl.prototype = {
	set: function(v) {
		this.output.innerHTML = v;
		this.values.value.set(v);
	}
};
var sui_controls_NumberSelectControl = function(defaultValue,options) {
	sui_controls_SelectControl.call(this,defaultValue,"select-number",options);
};
sui_controls_NumberSelectControl.__name__ = true;
sui_controls_NumberSelectControl.__super__ = sui_controls_SelectControl;
sui_controls_NumberSelectControl.prototype = $extend(sui_controls_SelectControl.prototype,{
});
var sui_controls_FloatKind = { __ename__ : true, __constructs__ : ["FloatNumber","FloatTime"] };
sui_controls_FloatKind.FloatNumber = ["FloatNumber",0];
sui_controls_FloatKind.FloatNumber.__enum__ = sui_controls_FloatKind;
sui_controls_FloatKind.FloatTime = ["FloatTime",1];
sui_controls_FloatKind.FloatTime.__enum__ = sui_controls_FloatKind;
var sui_controls_TimeControl = function(value,options) {
	if(null == options) options = { };
	sui_controls_SingleInputControl.call(this,value,"input","time","time",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min",sui_controls_TimeControl.timeToString(options.min));
	if(null != options.max) this.input.setAttribute("max",sui_controls_TimeControl.timeToString(options.max));
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : sui_controls_TimeControl.timeToString(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : sui_controls_TimeControl.timeToString(o1), value : sui_controls_TimeControl.timeToString(o1)};
	})).applyTo(this.input);
};
sui_controls_TimeControl.__name__ = true;
sui_controls_TimeControl.timeToString = function(t) {
	var h = Math.floor(t / 3600000);
	t -= h * 3600000;
	var m = Math.floor(t / 60000);
	t -= m * 60000;
	var s = t / 1000;
	var hh = StringTools.lpad("" + h,"0",2);
	var mm = StringTools.lpad("" + m,"0",2);
	var ss = (s >= 10?"":"0") + s;
	return "" + hh + ":" + mm + ":" + ss;
};
sui_controls_TimeControl.stringToTime = function(t) {
	var p = t.split(":");
	var h = Std.parseInt(p[0]);
	var m = Std.parseInt(p[1]);
	var s = parseFloat(p[2]);
	return s * 1000 + m * 60000 + h * 3600000;
};
sui_controls_TimeControl.__super__ = sui_controls_SingleInputControl;
sui_controls_TimeControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.value = sui_controls_TimeControl.timeToString(v);
	}
	,getInput: function() {
		return sui_controls_TimeControl.stringToTime(this.input.value);
	}
});
var thx_core_Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		var tmp;
		try {
			tmp = haxe_CallStack.exceptionStack();
		} catch( e ) {
			tmp = [];
		}
		stack = tmp;
		if(stack.length == 0) {
			var tmp1;
			try {
				tmp1 = haxe_CallStack.callStack();
			} catch( e1 ) {
				tmp1 = [];
			}
			stack = tmp1;
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx_core_Error.__name__ = true;
thx_core_Error.__super__ = Error;
thx_core_Error.prototype = $extend(Error.prototype,{
	toString: function() {
		return this.message + "\nfrom: " + this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber + "\n\n" + haxe_CallStack.toString(this.stackItems);
	}
});
var thx_core_Floats = function() { };
thx_core_Floats.__name__ = true;
thx_core_Floats.canParse = function(s) {
	return thx_core_Floats.pattern_parse.match(s);
};
thx_core_Floats.parse = function(s) {
	if(s.substring(0,1) == "+") s = s.substring(1);
	return parseFloat(s);
};
var thx_core_Functions = function() { };
thx_core_Functions.__name__ = true;
thx_core_Functions.equality = function(a,b) {
	return a == b;
};
var thx_core_Ints = function() { };
thx_core_Ints.__name__ = true;
thx_core_Ints.canParse = function(s) {
	return thx_core_Ints.pattern_parse.match(s);
};
thx_core_Ints.parse = function(s,base) {
	var v = parseInt(s,base);
	return isNaN(v)?null:v;
};
var thx_core_error_AbstractMethod = function(posInfo) {
	thx_core_Error.call(this,"method " + posInfo.className + "." + posInfo.methodName + "() is abstract",null,posInfo);
};
thx_core_error_AbstractMethod.__name__ = true;
thx_core_error_AbstractMethod.__super__ = thx_core_Error;
thx_core_error_AbstractMethod.prototype = $extend(thx_core_Error.prototype,{
});
var thx_promise_Future = function() {
	this.handlers = [];
	this.state = haxe_ds_Option.None;
};
thx_promise_Future.__name__ = true;
thx_promise_Future.create = function(handler) {
	var future = new thx_promise_Future();
	handler($bind(future,future.setState));
	return future;
};
thx_promise_Future.value = function(v) {
	return thx_promise_Future.create(function(callback) {
		callback(v);
	});
};
thx_promise_Future.prototype = {
	then: function(handler) {
		this.handlers.push(handler);
		this.update();
		return this;
	}
	,setState: function(newstate) {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				this.state = haxe_ds_Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx_core_Error("future was already \"" + Std.string(r) + "\", can't apply the new state \"" + Std.string(newstate) + "\"",null,{ fileName : "Future.hx", lineNumber : 85, className : "thx.promise.Future", methodName : "setState"});
				break;
			}
		}
		this.update();
		return this;
	}
	,update: function() {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				break;
			case 0:
				var result = _g[2];
				var index = -1;
				while(++index < this.handlers.length) this.handlers[index](result);
				this.handlers = [];
				break;
			}
		}
	}
};
var thx_stream_Emitter = function(init) {
	this.init = init;
};
thx_stream_Emitter.__name__ = true;
thx_stream_Emitter.prototype = {
	feed: function(value) {
		var stream = new thx_stream_Stream(null);
		stream.subscriber = function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				value.set(v);
				break;
			case 1:
				var c = r[2];
				if(c) stream.cancel(); else stream.end();
				break;
			}
		};
		value.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(value.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,end) {
		pulse = null != pulse?pulse:function(_) {
		};
		end = null != end?end:function(_1) {
		};
		var stream = new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				pulse(v);
				break;
			case 1:
				var c = r[2];
				end(c);
				break;
			}
		});
		this.init(stream);
		return stream;
	}
	,merge: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
		});
	}
	,map: function(f) {
		return this.mapFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,mapFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then($bind(stream,stream.pulse));
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,toTrue: function() {
		return this.map(function(_) {
			return true;
		});
	}
	,toFalse: function() {
		return this.map(function(_) {
			return false;
		});
	}
	,filter: function(f) {
		return this.filterFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,filterFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then(function(c) {
						if(c) stream.pulse(v);
					});
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
};
var thx_stream_EmitterBools = function() { };
thx_stream_EmitterBools.__name__ = true;
thx_stream_EmitterBools.negate = function(emitter) {
	return emitter.map(function(v) {
		return !v;
	});
};
var thx_stream_IStream = function() { };
thx_stream_IStream.__name__ = true;
var thx_stream_Stream = function(subscriber) {
	this.subscriber = subscriber;
	this.cleanUps = [];
	this.finalized = false;
	this.canceled = false;
};
thx_stream_Stream.__name__ = true;
thx_stream_Stream.__interfaces__ = [thx_stream_IStream];
thx_stream_Stream.prototype = {
	addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx_stream_StreamValue.End(true));
	}
	,end: function() {
		this.finalize(thx_stream_StreamValue.End(false));
	}
	,pulse: function(v) {
		this.subscriber(thx_stream_StreamValue.Pulse(v));
	}
	,finalize: function(signal) {
		if(this.finalized) return;
		this.finalized = true;
		while(this.cleanUps.length > 0) (this.cleanUps.shift())();
		this.subscriber(signal);
		this.subscriber = function(_) {
		};
	}
};
var thx_stream_StreamValue = { __ename__ : true, __constructs__ : ["Pulse","End"] };
thx_stream_StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx_stream_StreamValue; return $x; };
thx_stream_StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx_stream_StreamValue; return $x; };
var thx_stream_Value = function(value,equals) {
	var _g = this;
	this.equals = null == equals?thx_core_Functions.equality:equals;
	this.value = value;
	this.downStreams = [];
	this.upStreams = [];
	thx_stream_Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
		stream.pulse(_g.value);
	});
};
thx_stream_Value.__name__ = true;
thx_stream_Value.__super__ = thx_stream_Emitter;
thx_stream_Value.prototype = $extend(thx_stream_Emitter.prototype,{
	set: function(value) {
		if(this.equals(this.value,value)) return;
		this.value = value;
		this.update();
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.pulse(this.value);
		}
	}
});
var thx_stream_dom_Dom = function() { };
thx_stream_dom_Dom.__name__ = true;
thx_stream_dom_Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx_stream_Emitter(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx_stream_dom_Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"focus",capture).toTrue().merge(thx_stream_dom_Dom.streamEvent(el,"blur",capture).toFalse());
};
thx_stream_dom_Dom.subscribeSwapClass = function(el,nameOn,nameOff) {
	return function(on) {
		if(on) {
			el.classList.add(nameOn);
			el.classList.remove(nameOff);
		} else {
			el.classList.add(nameOff);
			el.classList.remove(nameOn);
		}
	};
};
thx_stream_dom_Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
dots_Dom.addCss(".sui-icon-add,.sui-icon-collapse,.sui-icon-down,.sui-icon-expand,.sui-icon-remove,.sui-icon-up{background-repeat:no-repeat}.sui-icon-add{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H35V19c0-1.657-1.343-3-3-3s-3%201.343-3%203v10H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h10v10c0%201.657%201.343%203%203%203s3-1.343%203-3V35h10c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-collapse{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-down{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-expand{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-remove{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h26c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-up{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-grid{border-collapse:collapse;}.sui-grid *{box-sizing:border-box}.sui-grid td{border-bottom:1px solid #ddd;margin:0;padding:0}.sui-grid tr:first-child td{border-top:1px solid #ddd}.sui-grid td:first-child{border-left:1px solid #ddd}.sui-grid td:last-child{border-right:1px solid #ddd}.sui-grid td.sui-top,.sui-grid td.sui-left{background-color:#fff}.sui-grid td.sui-bottom,.sui-grid td.sui-right{background-color:#f6f6f6}.sui-bottom-left,.sui-bottom-right,.sui-top-left,.sui-top-right{position:absolute;background-color:#fff}.sui-top-right{top:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-top-right.sui-grid tr:first-child td{border-top:none}.sui-top-right.sui-grid td:last-child{border-right:none}.sui-top-left{top:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-top-left.sui-grid tr:first-child td{border-top:none}.sui-top-left.sui-grid td:last-child{border-left:none}.sui-bottom-right{bottom:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-right.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-right.sui-grid td:last-child{border-right:none}.sui-bottom-left{bottom:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-left.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-left.sui-grid td:last-child{border-left:none}.sui-fill{position:absolute;width:100%;max-height:100%;top:0;left:0}.sui-append{width:100%}.sui-control,.sui-folder{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;user-select:none;font-size:11px;font-family:Helvetica,\"Nimbus Sans L\",\"Liberation Sans\",Arial,sans-serif;line-height:18px;vertical-align:middle;}.sui-control *,.sui-folder *{box-sizing:border-box;margin:0;padding:0}.sui-control button,.sui-folder button{line-height:18px;vertical-align:middle}.sui-control input,.sui-folder input{line-height:18px;vertical-align:middle;border:none;background-color:#f6f6f6;max-width:16em}.sui-control button:hover,.sui-folder button:hover{background-color:#fafafa;border:1px solid #ddd}.sui-control button:focus,.sui-folder button:focus{background-color:#fafafa;border:1px solid #aaa;outline:#eee solid 2px}.sui-control input:focus,.sui-folder input:focus{outline:#eee solid 2px;$outline-offset:-2px;background-color:#fafafa}.sui-control output,.sui-folder output{padding:0 6px;background-color:#fff;display:inline-block}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"],.sui-control input[type=\"date\"],.sui-folder input[type=\"date\"],.sui-control input[type=\"datetime-local\"],.sui-folder input[type=\"datetime-local\"],.sui-control input[type=\"time\"],.sui-folder input[type=\"time\"]{text-align:right}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"]{font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace}.sui-control input,.sui-folder input{padding:0 6px}.sui-control input[type=\"color\"],.sui-folder input[type=\"color\"],.sui-control input[type=\"checkbox\"],.sui-folder input[type=\"checkbox\"]{padding:0;margin:0}.sui-control input[type=\"range\"],.sui-folder input[type=\"range\"]{margin:0 8px;min-height:19px}.sui-control button,.sui-folder button{background-color:#eee;border:1px solid #aaa;border-radius:4px}.sui-control.sui-control-single input,.sui-folder.sui-control-single input,.sui-control.sui-control-single output,.sui-folder.sui-control-single output,.sui-control.sui-control-single button,.sui-folder.sui-control-single button{width:100%}.sui-control.sui-control-single input[type=\"checkbox\"],.sui-folder.sui-control-single input[type=\"checkbox\"]{width:initial}.sui-control.sui-control-double input,.sui-folder.sui-control-double input,.sui-control.sui-control-double output,.sui-folder.sui-control-double output,.sui-control.sui-control-double button,.sui-folder.sui-control-double button{width:50%}.sui-control.sui-control-double .input1,.sui-folder.sui-control-double .input1{width:calc(100% - 7em);max-width:8em}.sui-control.sui-control-double .input2,.sui-folder.sui-control-double .input2{width:7em}.sui-control.sui-control-double .input1[type=\"range\"],.sui-folder.sui-control-double .input1[type=\"range\"]{width:calc(100% - 7em - 16px)}.sui-control.sui-type-bool,.sui-folder.sui-type-bool{text-align:center}.sui-control.sui-invalid,.sui-folder.sui-invalid{border-left:4px solid #d00}.sui-array{list-style:none;}.sui-array .sui-array-item{border-bottom:1px dotted #aaa;position:relative;}.sui-array .sui-array-item .sui-icon,.sui-array .sui-array-item .sui-icon-mini{opacity:.1}.sui-array .sui-array-item .sui-array-add .sui-icon,.sui-array .sui-array-item .sui-array-add .sui-icon-mini{opacity:.2}.sui-array .sui-array-item > *{vertical-align:top}.sui-array .sui-array-item:first-child > .sui-move > .sui-icon-up{visibility:hidden}.sui-array .sui-array-item:last-child{border-bottom:none;}.sui-array .sui-array-item:last-child > .sui-move > .sui-icon-down{visibility:hidden}.sui-array .sui-array-item > div{display:inline-block}.sui-array .sui-array-item .sui-move{position:absolute;width:8px;height:100%;}.sui-array .sui-array-item .sui-move .sui-icon-mini{display:block;position:absolute}.sui-array .sui-array-item .sui-move .sui-icon-up{top:0;left:1px}.sui-array .sui-array-item .sui-move .sui-icon-down{bottom:0;left:1px}.sui-array .sui-array-item .sui-control-container{margin:0 14px 0 10px;width:calc(100% - 24px)}.sui-array .sui-array-item .sui-remove{width:12px;position:absolute;right:1px;top:0}.sui-array .sui-array-item .sui-icon-remove,.sui-array .sui-array-item .sui-icon-up,.sui-array .sui-array-item .sui-icon-down{cursor:pointer}.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon-mini,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon-mini{opacity:.4}.sui-array ~ .sui-control{margin-bottom:0}.sui-map{border-collapse:collapse;}.sui-map .sui-map-item > td{border-bottom:1px dotted #aaa;}.sui-map .sui-map-item > td:first-child{border-left:none}.sui-map .sui-map-item:last-child > td{border-bottom:none}.sui-map .sui-map-item .sui-icon{opacity:.1}.sui-map .sui-map-item .sui-array-add .sui-icon{opacity:.2}.sui-map .sui-map-item .sui-remove{width:14px;text-align:right;padding:0 1px}.sui-map .sui-map-item .sui-icon-remove{cursor:pointer}.sui-map .sui-map-item.sui-focus > .sui-remove .sui-icon{opacity:.4}.sui-disabled .sui-icon,.sui-disabled .sui-icon-mini,.sui-disabled .sui-icon:hover,.sui-disabled .sui-icon-mini:hover{opacity:.05 !important;cursor:default}.sui-array-add{text-align:right;}.sui-array-add .sui-icon,.sui-array-add .sui-icon-mini{margin-right:1px;opacity:.2;cursor:pointer}.sui-icon,.sui-icon-mini{display:inline-block;opacity:.4;vertical-align:middle;}.sui-icon:hover,.sui-icon-mini:hover{opacity:.8 !important}.sui-icon{width:12px;height:12px;background-size:12px 12px}.sui-icon-mini{width:8px;height:8px;background-size:8px 8px}.sui-folder{padding:0 6px;font-weight:bold}.sui-collapsible{cursor:pointer}.sui-bottom-left .sui-trigger-toggle,.sui-bottom-right .sui-trigger-toggle{transform:rotate(180deg)}.sui-choice-options > .sui-grid,.sui-grid-inner{width:100%}.sui-choice-options > .sui-grid > tr > td:first-child,.sui-choice-options > .sui-grid > tbody > tr > td:first-child{border-left:none}.sui-choice-options > .sui-grid > tr:last-child > td,.sui-choice-options > .sui-grid > tbody > tr:last-child > td{border-bottom:none}.sui-grid-inner{border-left:6px solid #f6f6f6}.sui-choice-header select{width:100%}");
dots_Html.pattern = new EReg("[<]([^> ]+)","");
dots_Query.doc = document;
sui_controls_DataList.nid = 0;
thx_core_Floats.pattern_parse = new EReg("^(\\+|-)?\\d+(\\.\\d+)?(e-?\\d+)?$","");
thx_core_Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
Main.main();
})();
