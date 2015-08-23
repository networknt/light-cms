webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(56);
	module.exports = __webpack_require__(58);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {var io = __webpack_require__(2);
	var stripAnsi = __webpack_require__(54);
	var scriptElements = document.getElementsByTagName("script");
	io = io.connect( true ?
		__resourceQuery.substr(1) :
		scriptElements[scriptElements.length-1].getAttribute("src").replace(/\/[^\/]+$/, "")
	);

	var hot = false;
	var initial = true;
	var currentHash = "";

	io.on("hot", function() {
		hot = true;
		console.log("[WDS] Hot Module Replacement enabled.");
	});

	io.on("invalid", function() {
		console.log("[WDS] App updated. Recompiling...");
	});

	io.on("hash", function(hash) {
		currentHash = hash;
	});

	io.on("still-ok", function() {
		console.log("[WDS] Nothing changed.")
	});

	io.on("ok", function() {
		if(initial) return initial = false;
		reloadApp();
	});

	io.on("warnings", function(warnings) {
		console.log("[WDS] Warnings while compiling.");
		for(var i = 0; i < warnings.length; i++)
			console.warn(stripAnsi(warnings[i]));
		if(initial) return initial = false;
		reloadApp();
	});

	io.on("errors", function(errors) {
		console.log("[WDS] Errors while compiling.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	});

	io.on("proxy-error", function(errors) {
		console.log("[WDS] Proxy error.");
		for(var i = 0; i < errors.length; i++)
			console.error(stripAnsi(errors[i]));
		if(initial) return initial = false;
		reloadApp();
	});

	io.on("disconnect", function() {
		console.error("[WDS] Disconnected!");
	});

	function reloadApp() {
		if(hot) {
			console.log("[WDS] App hot update...");
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		} else {
			console.log("[WDS] App updated. Reloading...");
			window.location.reload();
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:8001"))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(4);
	var parser = __webpack_require__(7);
	var Manager = __webpack_require__(14);
	var debug = __webpack_require__(6)('socket.io-client');

	/**
	 * Module exports.
	 */

	module.exports = exports = lookup;

	/**
	 * Managers cache.
	 */

	var cache = exports.managers = {};

	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */

	function lookup(uri, opts) {
	  if (typeof uri == 'object') {
	    opts = uri;
	    uri = undefined;
	  }

	  opts = opts || {};

	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var io;

	  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
	    debug('ignoring socket cache for %s', source);
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	      debug('new io instance for %s', source);
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }

	  return io.socket(parsed.path);
	}

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = parser.protocol;

	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */

	exports.connect = lookup;

	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */

	exports.Manager = __webpack_require__(14);
	exports.Socket = __webpack_require__(46);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module dependencies.
	 */

	var parseuri = __webpack_require__(5);
	var debug = __webpack_require__(6)('socket.io-client:url');

	/**
	 * Module exports.
	 */

	module.exports = url;

	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */

	function url(uri, loc){
	  var obj = uri;

	  // default to window.location
	  var loc = loc || global.location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;

	  // relative path support
	  if ('string' == typeof uri) {
	    if ('/' == uri.charAt(0)) {
	      if ('/' == uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.hostname + uri;
	      }
	    }

	    if (!/^(https?|wss?):\/\//.test(uri)) {
	      debug('protocol-less url %s', uri);
	      if ('undefined' != typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }

	    // parse
	    debug('parse %s', uri);
	    obj = parseuri(uri);
	  }

	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    }
	    else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }

	  obj.path = obj.path || '/';

	  // define unique id
	  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

	  return obj;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
	  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	  var m = re.exec(str || '')
	    , uri = {}
	    , i = 14;

	  while (i--) {
	    uri[parts[i]] = m[i] || '';
	  }

	  return uri;
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	/**
	 * Expose `debug()` as the module.
	 */

	module.exports = debug;

	/**
	 * Create a debugger with the given `name`.
	 *
	 * @param {String} name
	 * @return {Type}
	 * @api public
	 */

	function debug(name) {
	  if (!debug.enabled(name)) return function(){};

	  return function(fmt){
	    fmt = coerce(fmt);

	    var curr = new Date;
	    var ms = curr - (debug[name] || curr);
	    debug[name] = curr;

	    fmt = name
	      + ' '
	      + fmt
	      + ' +' + debug.humanize(ms);

	    // This hackery is required for IE8
	    // where `console.log` doesn't have 'apply'
	    window.console
	      && console.log
	      && Function.prototype.apply.call(console.log, console, arguments);
	  }
	}

	/**
	 * The currently active debug mode names.
	 */

	debug.names = [];
	debug.skips = [];

	/**
	 * Enables a debug mode by name. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} name
	 * @api public
	 */

	debug.enable = function(name) {
	  try {
	    localStorage.debug = name;
	  } catch(e){}

	  var split = (name || '').split(/[\s,]+/)
	    , len = split.length;

	  for (var i = 0; i < len; i++) {
	    name = split[i].replace('*', '.*?');
	    if (name[0] === '-') {
	      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
	    }
	    else {
	      debug.names.push(new RegExp('^' + name + '$'));
	    }
	  }
	};

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	debug.disable = function(){
	  debug.enable('');
	};

	/**
	 * Humanize the given `ms`.
	 *
	 * @param {Number} m
	 * @return {String}
	 * @api private
	 */

	debug.humanize = function(ms) {
	  var sec = 1000
	    , min = 60 * 1000
	    , hour = 60 * min;

	  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
	  if (ms >= min) return (ms / min).toFixed(1) + 'm';
	  if (ms >= sec) return (ms / sec | 0) + 's';
	  return ms + 'ms';
	};

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	debug.enabled = function(name) {
	  for (var i = 0, len = debug.skips.length; i < len; i++) {
	    if (debug.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (var i = 0, len = debug.names.length; i < len; i++) {
	    if (debug.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * Coerce `val`.
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

	// persist

	try {
	  if (window.localStorage) debug.enable(localStorage.debug);
	} catch(e){}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var debug = __webpack_require__(6)('socket.io-parser');
	var json = __webpack_require__(8);
	var isArray = __webpack_require__(10);
	var Emitter = __webpack_require__(11);
	var binary = __webpack_require__(12);
	var isBuf = __webpack_require__(13);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = 4;

	/**
	 * Packet types.
	 *
	 * @api public
	 */

	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'BINARY_EVENT',
	  'ACK',
	  'BINARY_ACK',
	  'ERROR'
	];

	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */

	exports.CONNECT = 0;

	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */

	exports.DISCONNECT = 1;

	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */

	exports.EVENT = 2;

	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */

	exports.ACK = 3;

	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */

	exports.ERROR = 4;

	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */

	exports.BINARY_EVENT = 5;

	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */

	exports.BINARY_ACK = 6;

	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */

	exports.Encoder = Encoder;

	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */

	exports.Decoder = Decoder;

	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */

	function Encoder() {}

	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */

	Encoder.prototype.encode = function(obj, callback){
	  debug('encoding packet %j', obj);

	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};

	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */

	function encodeAsString(obj) {
	  var str = '';
	  var nsp = false;

	  // first is type
	  str += obj.type;

	  // attachments if we have them
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    str += obj.attachments;
	    str += '-';
	  }

	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' != obj.nsp) {
	    nsp = true;
	    str += obj.nsp;
	  }

	  // immediately followed by the id
	  if (null != obj.id) {
	    if (nsp) {
	      str += ',';
	      nsp = false;
	    }
	    str += obj.id;
	  }

	  // json data
	  if (null != obj.data) {
	    if (nsp) str += ',';
	    str += json.stringify(obj.data);
	  }

	  debug('encoded %j as %s', obj, str);
	  return str;
	}

	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */

	function encodeAsBinary(obj, callback) {

	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;

	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }

	  binary.removeBlobs(obj, writeEncoding);
	}

	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */

	function Decoder() {
	  this.reconstructor = null;
	}

	/**
	 * Mix in `Emitter` with Decoder.
	 */

	Emitter(Decoder.prototype);

	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */

	Decoder.prototype.add = function(obj) {
	  var packet;
	  if ('string' == typeof obj) {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);

	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};

	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */

	function decodeString(str) {
	  var p = {};
	  var i = 0;

	  // look up type
	  p.type = Number(str.charAt(0));
	  if (null == exports.types[p.type]) return error();

	  // look up attachments if type binary
	  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
	    var buf = '';
	    while (str.charAt(++i) != '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) != '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }

	  // look up namespace (if any)
	  if ('/' == str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' == c) break;
	      p.nsp += c;
	      if (i == str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }

	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i == str.length) break;
	    }
	    p.id = Number(p.id);
	  }

	  // look up json data
	  if (str.charAt(++i)) {
	    try {
	      p.data = json.parse(str.substr(i));
	    } catch(e){
	      return error();
	    }
	  }

	  debug('decoded %s as %j', str, p);
	  return p;
	}

	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */

	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};

	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */

	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}

	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */

	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};

	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */

	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};

	function error(data){
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
	;(function (window) {
	  // Convenience aliases.
	  var getClass = {}.toString, isProperty, forEach, undef;

	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(9);

	  // Detect native implementations.
	  var nativeJSON = typeof JSON == "object" && JSON;

	  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
	  // available.
	  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

	  if (JSON3 && nativeJSON) {
	    // Explicitly delegate to the native `stringify` and `parse`
	    // implementations in CommonJS environments.
	    JSON3.stringify = nativeJSON.stringify;
	    JSON3.parse = nativeJSON.parse;
	  } else {
	    // Export for web browsers, JavaScript engines, and asynchronous module
	    // loaders, using the global `JSON` object if available.
	    JSON3 = window.JSON = nativeJSON || {};
	  }

	  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	  var isExtended = new Date(-3509827334573292);
	  try {
	    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	    // results for certain dates in Opera >= 10.53.
	    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	      // Safari < 2.0.2 stores the internal millisecond time value correctly,
	      // but clips the values returned by the date methods to the range of
	      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	  } catch (exception) {}

	  // Internal: Determines whether the native `JSON.stringify` and `parse`
	  // implementations are spec-compliant. Based on work by Ken Snyder.
	  function has(name) {
	    if (has[name] !== undef) {
	      // Return cached feature test result.
	      return has[name];
	    }

	    var isSupported;
	    if (name == "bug-string-char-index") {
	      // IE <= 7 doesn't support accessing string characters using square
	      // bracket notation. IE 8 only supports this for primitives.
	      isSupported = "a"[0] != "a";
	    } else if (name == "json") {
	      // Indicates whether both `JSON.stringify` and `JSON.parse` are
	      // supported.
	      isSupported = has("json-stringify") && has("json-parse");
	    } else {
	      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	      // Test `JSON.stringify`.
	      if (name == "json-stringify") {
	        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	        if (stringifySupported) {
	          // A test function object with a custom `toJSON` method.
	          (value = function () {
	            return 1;
	          }).toJSON = value;
	          try {
	            stringifySupported =
	              // Firefox 3.1b1 and b2 serialize string, number, and boolean
	              // primitives as object literals.
	              stringify(0) === "0" &&
	              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	              // literals.
	              stringify(new Number()) === "0" &&
	              stringify(new String()) == '""' &&
	              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	              // does not define a canonical JSON representation (this applies to
	              // objects with `toJSON` properties as well, *unless* they are nested
	              // within an object or array).
	              stringify(getClass) === undef &&
	              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	              // FF 3.1b3 pass this test.
	              stringify(undef) === undef &&
	              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	              // respectively, if the value is omitted entirely.
	              stringify() === undef &&
	              // FF 3.1b1, 2 throw an error if the given value is not a number,
	              // string, array, object, Boolean, or `null` literal. This applies to
	              // objects with custom `toJSON` methods as well, unless they are nested
	              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	              // methods entirely.
	              stringify(value) === "1" &&
	              stringify([value]) == "[1]" &&
	              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	              // `"[null]"`.
	              stringify([undef]) == "[null]" &&
	              // YUI 3.0.0b1 fails to serialize `null` literals.
	              stringify(null) == "null" &&
	              // FF 3.1b1, 2 halts serialization if an array contains a function:
	              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	              // elides non-JSON values from objects and arrays, unless they
	              // define custom `toJSON` methods.
	              stringify([undef, getClass, null]) == "[null,null,null]" &&
	              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	              // where character escape codes are expected (e.g., `\b` => `\u0008`).
	              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	              stringify(null, value) === "1" &&
	              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	              // serialize extended years.
	              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	              // The milliseconds are optional in ES 5, but required in 5.1.
	              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	              // four-digit years instead of six-digit years. Credits: @Yaffle.
	              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	              // values less than 1000. Credits: @Yaffle.
	              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	          } catch (exception) {
	            stringifySupported = false;
	          }
	        }
	        isSupported = stringifySupported;
	      }
	      // Test `JSON.parse`.
	      if (name == "json-parse") {
	        var parse = JSON3.parse;
	        if (typeof parse == "function") {
	          try {
	            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	            // Conforming implementations should also coerce the initial argument to
	            // a string prior to parsing.
	            if (parse("0") === 0 && !parse(false)) {
	              // Simple parsing test.
	              value = parse(serialized);
	              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	              if (parseSupported) {
	                try {
	                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                  parseSupported = !parse('"\t"');
	                } catch (exception) {}
	                if (parseSupported) {
	                  try {
	                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                    // certain octal literals.
	                    parseSupported = parse("01") !== 1;
	                  } catch (exception) {}
	                }
	                if (parseSupported) {
	                  try {
	                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                    // points. These environments, along with FF 3.1b1 and 2,
	                    // also allow trailing commas in JSON objects and arrays.
	                    parseSupported = parse("1.") !== 1;
	                  } catch (exception) {}
	                }
	              }
	            }
	          } catch (exception) {
	            parseSupported = false;
	          }
	        }
	        isSupported = parseSupported;
	      }
	    }
	    return has[name] = !!isSupported;
	  }

	  if (!has("json")) {
	    // Common `[[Class]]` name aliases.
	    var functionClass = "[object Function]";
	    var dateClass = "[object Date]";
	    var numberClass = "[object Number]";
	    var stringClass = "[object String]";
	    var arrayClass = "[object Array]";
	    var booleanClass = "[object Boolean]";

	    // Detect incomplete support for accessing string characters by index.
	    var charIndexBuggy = has("bug-string-char-index");

	    // Define additional utility methods if the `Date` methods are buggy.
	    if (!isExtended) {
	      var floor = Math.floor;
	      // A mapping between the months of the year and the number of days between
	      // January 1st and the first of the respective month.
	      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	      // Internal: Calculates the number of days between the Unix epoch and the
	      // first day of the given month.
	      var getDay = function (year, month) {
	        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	      };
	    }

	    // Internal: Determines if a property is a direct property of the given
	    // object. Delegates to the native `Object#hasOwnProperty` method.
	    if (!(isProperty = {}.hasOwnProperty)) {
	      isProperty = function (property) {
	        var members = {}, constructor;
	        if ((members.__proto__ = null, members.__proto__ = {
	          // The *proto* property cannot be set multiple times in recent
	          // versions of Firefox and SeaMonkey.
	          "toString": 1
	        }, members).toString != getClass) {
	          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	          // supports the mutable *proto* property.
	          isProperty = function (property) {
	            // Capture and break the object's prototype chain (see section 8.6.2
	            // of the ES 5.1 spec). The parenthesized expression prevents an
	            // unsafe transformation by the Closure Compiler.
	            var original = this.__proto__, result = property in (this.__proto__ = null, this);
	            // Restore the original prototype chain.
	            this.__proto__ = original;
	            return result;
	          };
	        } else {
	          // Capture a reference to the top-level `Object` constructor.
	          constructor = members.constructor;
	          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	          // other environments.
	          isProperty = function (property) {
	            var parent = (this.constructor || constructor).prototype;
	            return property in this && !(property in parent && this[property] === parent[property]);
	          };
	        }
	        members = null;
	        return isProperty.call(this, property);
	      };
	    }

	    // Internal: A set of primitive types used by `isHostType`.
	    var PrimitiveTypes = {
	      'boolean': 1,
	      'number': 1,
	      'string': 1,
	      'undefined': 1
	    };

	    // Internal: Determines if the given object `property` value is a
	    // non-primitive.
	    var isHostType = function (object, property) {
	      var type = typeof object[property];
	      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
	    };

	    // Internal: Normalizes the `for...in` iteration algorithm across
	    // environments. Each enumerated key is yielded to a `callback` function.
	    forEach = function (object, callback) {
	      var size = 0, Properties, members, property;

	      // Tests for bugs in the current environment's `for...in` algorithm. The
	      // `valueOf` property inherits the non-enumerable flag from
	      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	      (Properties = function () {
	        this.valueOf = 0;
	      }).prototype.valueOf = 0;

	      // Iterate over a new instance of the `Properties` class.
	      members = new Properties();
	      for (property in members) {
	        // Ignore all properties inherited from `Object.prototype`.
	        if (isProperty.call(members, property)) {
	          size++;
	        }
	      }
	      Properties = members = null;

	      // Normalize the iteration algorithm.
	      if (!size) {
	        // A list of non-enumerable properties inherited from `Object.prototype`.
	        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	        // properties.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, length;
	          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
	          for (property in object) {
	            // Gecko <= 1.0 enumerates the `prototype` property of functions under
	            // certain conditions; IE does not.
	            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for each non-enumerable property.
	          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	        };
	      } else if (size == 2) {
	        // Safari <= 2.0.4 enumerates shadowed properties twice.
	        forEach = function (object, callback) {
	          // Create a set of iterated properties.
	          var members = {}, isFunction = getClass.call(object) == functionClass, property;
	          for (property in object) {
	            // Store each property name to prevent double enumeration. The
	            // `prototype` property of functions is not enumerated due to cross-
	            // environment inconsistencies.
	            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	        };
	      } else {
	        // No bugs detected; use the standard `for...in` algorithm.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	          for (property in object) {
	            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for the `constructor` property due to
	          // cross-environment inconsistencies.
	          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	            callback(property);
	          }
	        };
	      }
	      return forEach(object, callback);
	    };

	    // Public: Serializes a JavaScript `value` as a JSON string. The optional
	    // `filter` argument may specify either a function that alters how object and
	    // array members are serialized, or an array of strings and numbers that
	    // indicates which properties should be serialized. The optional `width`
	    // argument may be either a string or number that specifies the indentation
	    // level of the output.
	    if (!has("json-stringify")) {
	      // Internal: A map of control characters and their escaped equivalents.
	      var Escapes = {
	        92: "\\\\",
	        34: '\\"',
	        8: "\\b",
	        12: "\\f",
	        10: "\\n",
	        13: "\\r",
	        9: "\\t"
	      };

	      // Internal: Converts `value` into a zero-padded string such that its
	      // length is at least equal to `width`. The `width` must be <= 6.
	      var leadingZeroes = "000000";
	      var toPaddedString = function (width, value) {
	        // The `|| 0` expression is necessary to work around a bug in
	        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	        return (leadingZeroes + (value || 0)).slice(-width);
	      };

	      // Internal: Double-quotes a string `value`, replacing all ASCII control
	      // characters (characters with code unit values between 0 and 31) with
	      // their escaped equivalents. This is an implementation of the
	      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	      var unicodePrefix = "\\u00";
	      var quote = function (value) {
	        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
	        if (isLarge) {
	          symbols = value.split("");
	        }
	        for (; index < length; index++) {
	          var charCode = value.charCodeAt(index);
	          // If the character is a control character, append its Unicode or
	          // shorthand escape sequence; otherwise, append the character as-is.
	          switch (charCode) {
	            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	              result += Escapes[charCode];
	              break;
	            default:
	              if (charCode < 32) {
	                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                break;
	              }
	              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
	          }
	        }
	        return result + '"';
	      };

	      // Internal: Recursively serializes an object. Implements the
	      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	        try {
	          // Necessary for host object support.
	          value = object[property];
	        } catch (exception) {}
	        if (typeof value == "object" && value) {
	          className = getClass.call(value);
	          if (className == dateClass && !isProperty.call(value, "toJSON")) {
	            if (value > -1 / 0 && value < 1 / 0) {
	              // Dates are serialized according to the `Date#toJSON` method
	              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	              // for the ISO 8601 date time string format.
	              if (getDay) {
	                // Manually compute the year, month, date, hours, minutes,
	                // seconds, and milliseconds if the `getUTC*` methods are
	                // buggy. Adapted from @Yaffle's `date-shim` project.
	                date = floor(value / 864e5);
	                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                date = 1 + date - getDay(year, month);
	                // The `time` value specifies the time within the day (see ES
	                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                // to compute `A modulo B`, as the `%` operator does not
	                // correspond to the `modulo` operation for negative numbers.
	                time = (value % 864e5 + 864e5) % 864e5;
	                // The hours, minutes, seconds, and milliseconds are obtained by
	                // decomposing the time within the day. See section 15.9.1.10.
	                hours = floor(time / 36e5) % 24;
	                minutes = floor(time / 6e4) % 60;
	                seconds = floor(time / 1e3) % 60;
	                milliseconds = time % 1e3;
	              } else {
	                year = value.getUTCFullYear();
	                month = value.getUTCMonth();
	                date = value.getUTCDate();
	                hours = value.getUTCHours();
	                minutes = value.getUTCMinutes();
	                seconds = value.getUTCSeconds();
	                milliseconds = value.getUTCMilliseconds();
	              }
	              // Serialize extended years correctly.
	              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                // Months, dates, hours, minutes, and seconds should have two
	                // digits; milliseconds should have three.
	                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                // Milliseconds are optional in ES 5.0, but required in 5.1.
	                "." + toPaddedString(3, milliseconds) + "Z";
	            } else {
	              value = null;
	            }
	          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	            // ignores all `toJSON` methods on these objects unless they are
	            // defined directly on an instance.
	            value = value.toJSON(property);
	          }
	        }
	        if (callback) {
	          // If a replacement function was provided, call it to obtain the value
	          // for serialization.
	          value = callback.call(object, property, value);
	        }
	        if (value === null) {
	          return "null";
	        }
	        className = getClass.call(value);
	        if (className == booleanClass) {
	          // Booleans are represented literally.
	          return "" + value;
	        } else if (className == numberClass) {
	          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	          // `"null"`.
	          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	        } else if (className == stringClass) {
	          // Strings are double-quoted and escaped.
	          return quote("" + value);
	        }
	        // Recursively serialize objects and arrays.
	        if (typeof value == "object") {
	          // Check for cyclic structures. This is a linear search; performance
	          // is inversely proportional to the number of unique nested objects.
	          for (length = stack.length; length--;) {
	            if (stack[length] === value) {
	              // Cyclic structures cannot be serialized by `JSON.stringify`.
	              throw TypeError();
	            }
	          }
	          // Add the object to the stack of traversed objects.
	          stack.push(value);
	          results = [];
	          // Save the current indentation level and indent one additional level.
	          prefix = indentation;
	          indentation += whitespace;
	          if (className == arrayClass) {
	            // Recursively serialize array elements.
	            for (index = 0, length = value.length; index < length; index++) {
	              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	              results.push(element === undef ? "null" : element);
	            }
	            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	          } else {
	            // Recursively serialize object members. Members are selected from
	            // either a user-specified list of property names, or the object
	            // itself.
	            forEach(properties || value, function (property) {
	              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	              if (element !== undef) {
	                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                // is not the empty string, let `member` {quote(property) + ":"}
	                // be the concatenation of `member` and the `space` character."
	                // The "`space` character" refers to the literal space
	                // character, not the `space` {width} argument provided to
	                // `JSON.stringify`.
	                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	              }
	            });
	            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	          }
	          // Remove the object from the traversed object stack.
	          stack.pop();
	          return result;
	        }
	      };

	      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	      JSON3.stringify = function (source, filter, width) {
	        var whitespace, callback, properties, className;
	        if (typeof filter == "function" || typeof filter == "object" && filter) {
	          if ((className = getClass.call(filter)) == functionClass) {
	            callback = filter;
	          } else if (className == arrayClass) {
	            // Convert the property names array into a makeshift set.
	            properties = {};
	            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	          }
	        }
	        if (width) {
	          if ((className = getClass.call(width)) == numberClass) {
	            // Convert the `width` to an integer and create a string containing
	            // `width` number of space characters.
	            if ((width -= width % 1) > 0) {
	              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	            }
	          } else if (className == stringClass) {
	            whitespace = width.length <= 10 ? width : width.slice(0, 10);
	          }
	        }
	        // Opera <= 7.54u2 discards the values associated with empty string keys
	        // (`""`) only if they are used directly within an object member list
	        // (e.g., `!("" in { "": 1})`).
	        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	      };
	    }

	    // Public: Parses a JSON source string.
	    if (!has("json-parse")) {
	      var fromCharCode = String.fromCharCode;

	      // Internal: A map of escaped control characters and their unescaped
	      // equivalents.
	      var Unescapes = {
	        92: "\\",
	        34: '"',
	        47: "/",
	        98: "\b",
	        116: "\t",
	        110: "\n",
	        102: "\f",
	        114: "\r"
	      };

	      // Internal: Stores the parser state.
	      var Index, Source;

	      // Internal: Resets the parser state and throws a `SyntaxError`.
	      var abort = function() {
	        Index = Source = null;
	        throw SyntaxError();
	      };

	      // Internal: Returns the next token, or `"$"` if the parser has reached
	      // the end of the source string. A token may be a string, number, `null`
	      // literal, or Boolean literal.
	      var lex = function () {
	        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	        while (Index < length) {
	          charCode = source.charCodeAt(Index);
	          switch (charCode) {
	            case 9: case 10: case 13: case 32:
	              // Skip whitespace tokens, including tabs, carriage returns, line
	              // feeds, and space characters.
	              Index++;
	              break;
	            case 123: case 125: case 91: case 93: case 58: case 44:
	              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	              // the current position.
	              value = charIndexBuggy ? source.charAt(Index) : source[Index];
	              Index++;
	              return value;
	            case 34:
	              // `"` delimits a JSON string; advance to the next character and
	              // begin parsing the string. String tokens are prefixed with the
	              // sentinel `@` character to distinguish them from punctuators and
	              // end-of-string tokens.
	              for (value = "@", Index++; Index < length;) {
	                charCode = source.charCodeAt(Index);
	                if (charCode < 32) {
	                  // Unescaped ASCII control characters (those with a code unit
	                  // less than the space character) are not permitted.
	                  abort();
	                } else if (charCode == 92) {
	                  // A reverse solidus (`\`) marks the beginning of an escaped
	                  // control character (including `"`, `\`, and `/`) or Unicode
	                  // escape sequence.
	                  charCode = source.charCodeAt(++Index);
	                  switch (charCode) {
	                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                      // Revive escaped control characters.
	                      value += Unescapes[charCode];
	                      Index++;
	                      break;
	                    case 117:
	                      // `\u` marks the beginning of a Unicode escape sequence.
	                      // Advance to the first character and validate the
	                      // four-digit code point.
	                      begin = ++Index;
	                      for (position = Index + 4; Index < position; Index++) {
	                        charCode = source.charCodeAt(Index);
	                        // A valid sequence comprises four hexdigits (case-
	                        // insensitive) that form a single hexadecimal value.
	                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                          // Invalid Unicode escape sequence.
	                          abort();
	                        }
	                      }
	                      // Revive the escaped character.
	                      value += fromCharCode("0x" + source.slice(begin, Index));
	                      break;
	                    default:
	                      // Invalid escape sequence.
	                      abort();
	                  }
	                } else {
	                  if (charCode == 34) {
	                    // An unescaped double-quote character marks the end of the
	                    // string.
	                    break;
	                  }
	                  charCode = source.charCodeAt(Index);
	                  begin = Index;
	                  // Optimize for the common case where a string is valid.
	                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                    charCode = source.charCodeAt(++Index);
	                  }
	                  // Append the string as-is.
	                  value += source.slice(begin, Index);
	                }
	              }
	              if (source.charCodeAt(Index) == 34) {
	                // Advance to the next character and return the revived string.
	                Index++;
	                return value;
	              }
	              // Unterminated string.
	              abort();
	            default:
	              // Parse numbers and literals.
	              begin = Index;
	              // Advance past the negative sign, if one is specified.
	              if (charCode == 45) {
	                isSigned = true;
	                charCode = source.charCodeAt(++Index);
	              }
	              // Parse an integer or floating-point value.
	              if (charCode >= 48 && charCode <= 57) {
	                // Leading zeroes are interpreted as octal literals.
	                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                  // Illegal octal literal.
	                  abort();
	                }
	                isSigned = false;
	                // Parse the integer component.
	                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                // Floats cannot contain a leading decimal point; however, this
	                // case is already accounted for by the parser.
	                if (source.charCodeAt(Index) == 46) {
	                  position = ++Index;
	                  // Parse the decimal component.
	                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal trailing decimal.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Parse exponents. The `e` denoting the exponent is
	                // case-insensitive.
	                charCode = source.charCodeAt(Index);
	                if (charCode == 101 || charCode == 69) {
	                  charCode = source.charCodeAt(++Index);
	                  // Skip past the sign following the exponent, if one is
	                  // specified.
	                  if (charCode == 43 || charCode == 45) {
	                    Index++;
	                  }
	                  // Parse the exponential component.
	                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal empty exponent.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Coerce the parsed value to a JavaScript number.
	                return +source.slice(begin, Index);
	              }
	              // A negative sign may only precede numbers.
	              if (isSigned) {
	                abort();
	              }
	              // `true`, `false`, and `null` literals.
	              if (source.slice(Index, Index + 4) == "true") {
	                Index += 4;
	                return true;
	              } else if (source.slice(Index, Index + 5) == "false") {
	                Index += 5;
	                return false;
	              } else if (source.slice(Index, Index + 4) == "null") {
	                Index += 4;
	                return null;
	              }
	              // Unrecognized token.
	              abort();
	          }
	        }
	        // Return the sentinel `$` character if the parser has reached the end
	        // of the source string.
	        return "$";
	      };

	      // Internal: Parses a JSON `value` token.
	      var get = function (value) {
	        var results, hasMembers;
	        if (value == "$") {
	          // Unexpected end of input.
	          abort();
	        }
	        if (typeof value == "string") {
	          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	            // Remove the sentinel `@` character.
	            return value.slice(1);
	          }
	          // Parse object and array literals.
	          if (value == "[") {
	            // Parses a JSON array, returning a new JavaScript array.
	            results = [];
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing square bracket marks the end of the array literal.
	              if (value == "]") {
	                break;
	              }
	              // If the array literal contains elements, the current token
	              // should be a comma separating the previous element from the
	              // next.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "]") {
	                    // Unexpected trailing `,` in array literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each array element.
	                  abort();
	                }
	              }
	              // Elisions and leading commas are not permitted.
	              if (value == ",") {
	                abort();
	              }
	              results.push(get(value));
	            }
	            return results;
	          } else if (value == "{") {
	            // Parses a JSON object, returning a new JavaScript object.
	            results = {};
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing curly brace marks the end of the object literal.
	              if (value == "}") {
	                break;
	              }
	              // If the object literal contains members, the current token
	              // should be a comma separator.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "}") {
	                    // Unexpected trailing `,` in object literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each object member.
	                  abort();
	                }
	              }
	              // Leading commas are not permitted, object property names must be
	              // double-quoted strings, and a `:` must separate each property
	              // name and value.
	              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                abort();
	              }
	              results[value.slice(1)] = get(lex());
	            }
	            return results;
	          }
	          // Unexpected token encountered.
	          abort();
	        }
	        return value;
	      };

	      // Internal: Updates a traversed object member.
	      var update = function(source, property, callback) {
	        var element = walk(source, property, callback);
	        if (element === undef) {
	          delete source[property];
	        } else {
	          source[property] = element;
	        }
	      };

	      // Internal: Recursively traverses a parsed JSON object, invoking the
	      // `callback` function for each value. This is an implementation of the
	      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	      var walk = function (source, property, callback) {
	        var value = source[property], length;
	        if (typeof value == "object" && value) {
	          // `forEach` can't be used to traverse an array in Opera <= 8.54
	          // because its `Object#hasOwnProperty` implementation returns `false`
	          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	          if (getClass.call(value) == arrayClass) {
	            for (length = value.length; length--;) {
	              update(value, length, callback);
	            }
	          } else {
	            forEach(value, function (property) {
	              update(value, property, callback);
	            });
	          }
	        }
	        return callback.call(source, property, value);
	      };

	      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	      JSON3.parse = function (source, callback) {
	        var result, value;
	        Index = 0;
	        Source = "" + source;
	        result = get(lex());
	        // If a JSON string contains multiple tokens, it is invalid.
	        if (lex() != "$") {
	          abort();
	        }
	        // Reset the parser state.
	        Index = Source = null;
	        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	      };
	    }
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}(this));


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

	/**
	 * Module requirements
	 */

	var isArray = __webpack_require__(10);
	var isBuf = __webpack_require__(13);

	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */

	exports.deconstructPacket = function(packet){
	  var buffers = [];
	  var packetData = packet.data;

	  function _deconstructPacket(data) {
	    if (!data) return data;

	    if (isBuf(data)) {
	      var placeholder = { _placeholder: true, num: buffers.length };
	      buffers.push(data);
	      return placeholder;
	    } else if (isArray(data)) {
	      var newData = new Array(data.length);
	      for (var i = 0; i < data.length; i++) {
	        newData[i] = _deconstructPacket(data[i]);
	      }
	      return newData;
	    } else if ('object' == typeof data && !(data instanceof Date)) {
	      var newData = {};
	      for (var key in data) {
	        newData[key] = _deconstructPacket(data[key]);
	      }
	      return newData;
	    }
	    return data;
	  }

	  var pack = packet;
	  pack.data = _deconstructPacket(packetData);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};

	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */

	exports.reconstructPacket = function(packet, buffers) {
	  var curPlaceHolder = 0;

	  function _reconstructPacket(data) {
	    if (data && data._placeholder) {
	      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
	      return buf;
	    } else if (isArray(data)) {
	      for (var i = 0; i < data.length; i++) {
	        data[i] = _reconstructPacket(data[i]);
	      }
	      return data;
	    } else if (data && 'object' == typeof data) {
	      for (var key in data) {
	        data[key] = _reconstructPacket(data[key]);
	      }
	      return data;
	    }
	    return data;
	  }

	  packet.data = _reconstructPacket(packet.data);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};

	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */

	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;

	    // convert any blob
	    if ((global.Blob && obj instanceof Blob) ||
	        (global.File && obj instanceof File)) {
	      pendingBlobs++;

	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }

	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };

	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }

	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.exports = isBuf;

	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */

	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(4);
	var eio = __webpack_require__(15);
	var Socket = __webpack_require__(46);
	var Emitter = __webpack_require__(11);
	var parser = __webpack_require__(7);
	var on = __webpack_require__(48);
	var bind = __webpack_require__(49);
	var object = __webpack_require__(52);
	var debug = __webpack_require__(6)('socket.io-client:manager');
	var indexOf = __webpack_require__(43);
	var Backoff = __webpack_require__(53);

	/**
	 * Module exports
	 */

	module.exports = Manager;

	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */

	function Manager(uri, opts){
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && ('object' == typeof uri)) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};

	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connected = [];
	  this.encoding = false;
	  this.packetBuffer = [];
	  this.encoder = new parser.Encoder();
	  this.decoder = new parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}

	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */

	Manager.prototype.emitAll = function() {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	  }
	};

	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */

	Manager.prototype.updateSocketIds = function(){
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].id = this.engine.id;
	  }
	};

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Manager.prototype);

	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnection = function(v){
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};

	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionAttempts = function(v){
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};

	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelay = function(v){
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};

	Manager.prototype.randomizationFactor = function(v){
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};

	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelayMax = function(v){
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};

	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.timeout = function(v){
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};

	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */

	Manager.prototype.maybeReconnectOnOpen = function() {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};


	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */

	Manager.prototype.open =
	Manager.prototype.connect = function(fn){
	  debug('readyState %s', this.readyState);
	  if (~this.readyState.indexOf('open')) return this;

	  debug('opening %s', this.uri);
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;

	  // emit `open`
	  var openSub = on(socket, 'open', function() {
	    self.onopen();
	    fn && fn();
	  });

	  // emit `connect_error`
	  var errorSub = on(socket, 'error', function(data){
	    debug('connect_error');
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });

	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	    debug('connect attempt will timeout after %d', timeout);

	    // set timer
	    var timer = setTimeout(function(){
	      debug('connect attempt timed out after %d', timeout);
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }

	  this.subs.push(openSub);
	  this.subs.push(errorSub);

	  return this;
	};

	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */

	Manager.prototype.onopen = function(){
	  debug('open');

	  // clear old subs
	  this.cleanup();

	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');

	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	};

	/**
	 * Called with data.
	 *
	 * @api private
	 */

	Manager.prototype.ondata = function(data){
	  this.decoder.add(data);
	};

	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */

	Manager.prototype.ondecoded = function(packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */

	Manager.prototype.onerror = function(err){
	  debug('error', err);
	  this.emitAll('error', err);
	};

	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */

	Manager.prototype.socket = function(nsp){
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connect', function(){
	      socket.id = self.engine.id;
	      if (!~indexOf(self.connected, socket)) {
	        self.connected.push(socket);
	      }
	    });
	  }
	  return socket;
	};

	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */

	Manager.prototype.destroy = function(socket){
	  var index = indexOf(this.connected, socket);
	  if (~index) this.connected.splice(index, 1);
	  if (this.connected.length) return;

	  this.close();
	};

	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Manager.prototype.packet = function(packet){
	  debug('writing packet %j', packet);
	  var self = this;

	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function(encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i]);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else { // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};

	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */

	Manager.prototype.processPacketQueue = function() {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};

	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */

	Manager.prototype.cleanup = function(){
	  var sub;
	  while (sub = this.subs.shift()) sub.destroy();

	  this.packetBuffer = [];
	  this.encoding = false;

	  this.decoder.destroy();
	};

	/**
	 * Close the current socket.
	 *
	 * @api private
	 */

	Manager.prototype.close =
	Manager.prototype.disconnect = function(){
	  this.skipReconnect = true;
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.engine && this.engine.close();
	};

	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */

	Manager.prototype.onclose = function(reason){
	  debug('close');
	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);
	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};

	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */

	Manager.prototype.reconnect = function(){
	  if (this.reconnecting || this.skipReconnect) return this;

	  var self = this;

	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	    debug('reconnect failed');
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	    debug('will wait %dms before reconnect attempt', delay);

	    this.reconnecting = true;
	    var timer = setTimeout(function(){
	      if (self.skipReconnect) return;

	      debug('attempting reconnect');
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);

	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;

	      self.open(function(err){
	        if (err) {
	          debug('reconnect attempt error');
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	          debug('reconnect success');
	          self.onreconnect();
	        }
	      });
	    }, delay);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }
	};

	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */

	Manager.prototype.onreconnect = function(){
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports =  __webpack_require__(16);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(17);

	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(25);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var transports = __webpack_require__(18);
	var Emitter = __webpack_require__(11);
	var debug = __webpack_require__(37)('engine.io-client:socket');
	var index = __webpack_require__(43);
	var parser = __webpack_require__(25);
	var parseuri = __webpack_require__(44);
	var parsejson = __webpack_require__(45);
	var parseqs = __webpack_require__(35);

	/**
	 * Module exports.
	 */

	module.exports = Socket;

	/**
	 * Noop function.
	 *
	 * @api private
	 */

	function noop(){}

	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */

	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);

	  opts = opts || {};

	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }

	  if (uri) {
	    uri = parseuri(uri);
	    opts.host = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  }

	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);

	  if (opts.host) {
	    var pieces = opts.host.split(':');
	    opts.hostname = pieces.shift();
	    if (pieces.length) {
	      opts.port = pieces.pop();
	    } else if (!opts.port) {
	      // if no port is specified manually, use the protocol default
	      opts.port = this.secure ? '443' : '80';
	    }
	  }

	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.callbackBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized || null;

	  this.open();
	}

	Socket.priorWebsocketSuccess = false;

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	Socket.protocol = parser.protocol; // this is an int

	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */

	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(24);
	Socket.transports = __webpack_require__(18);
	Socket.parser = __webpack_require__(25);

	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */

	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);

	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;

	  // transport name
	  query.transport = name;

	  // session id if we already have one
	  if (this.id) query.sid = this.id;

	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized
	  });

	  return transport;
	};

	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}

	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 == this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';

	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  var transport;
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }

	  transport.open();
	  this.setTransport(transport);
	};

	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */

	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;

	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }

	  // set up transport
	  this.transport = transport;

	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};

	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */

	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;

	  Socket.priorWebsocketSuccess = false;

	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;

	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');

	          cleanup();

	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }

	  function freezeTransport() {
	    if (failed) return;

	    // Any callback called by transport should be ignored since now
	    failed = true;

	    cleanup();

	    transport.close();
	    transport = null;
	  }

	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;

	    freezeTransport();

	    debug('probe transport "%s" failed because of error: %s', name, err);

	    self.emit('upgradeError', error);
	  }

	  function onTransportClose(){
	    onerror("transport closed");
	  }

	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }

	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }

	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }

	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);

	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);

	  transport.open();

	};

	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */

	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();

	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};

	/**
	 * Handles a packet.
	 *
	 * @api private
	 */

	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

	    this.emit('packet', packet);

	    // Socket is live - any packet counts
	    this.emit('heartbeat');

	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;

	      case 'pong':
	        this.setPing();
	        break;

	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.emit('error', err);
	        break;

	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};

	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */

	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();

	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};

	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */

	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};

	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */

	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};

	/**
	* Sends a ping packet.
	*
	* @api public
	*/

	Socket.prototype.ping = function () {
	  this.sendPacket('ping');
	};

	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */

	Socket.prototype.onDrain = function() {
	  for (var i = 0; i < this.prevBufferLen; i++) {
	    if (this.callbackBuffer[i]) {
	      this.callbackBuffer[i]();
	    }
	  }

	  this.writeBuffer.splice(0, this.prevBufferLen);
	  this.callbackBuffer.splice(0, this.prevBufferLen);

	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;

	  if (this.writeBuffer.length == 0) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};

	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */

	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};

	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @return {Socket} for chaining.
	 * @api public
	 */

	Socket.prototype.write =
	Socket.prototype.send = function (msg, fn) {
	  this.sendPacket('message', msg, fn);
	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Function} callback function.
	 * @api private
	 */

	Socket.prototype.sendPacket = function (type, data, fn) {
	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }

	  var packet = { type: type, data: data };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  this.callbackBuffer.push(fn);
	  this.flush();
	};

	/**
	 * Closes the connection.
	 *
	 * @api private
	 */

	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';

	    var self = this;

	    function close() {
	      self.onClose('forced close');
	      debug('socket closing - telling transport to close');
	      self.transport.close();
	    }

	    function cleanupAndClose() {
	      self.removeListener('upgrade', cleanupAndClose);
	      self.removeListener('upgradeError', cleanupAndClose);
	      close();
	    }

	    function waitForUpgrade() {
	      // wait for upgrade to finish since we can't send packets while pausing a transport
	      self.once('upgrade', cleanupAndClose);
	      self.once('upgradeError', cleanupAndClose);
	    }

	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }

	  return this;
	};

	/**
	 * Called upon transport error
	 *
	 * @api private
	 */

	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};

	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */

	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;

	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);

	    // clean buffers in next tick, so developers can still
	    // grab the buffers on `close` event
	    setTimeout(function() {
	      self.writeBuffer = [];
	      self.callbackBuffer = [];
	      self.prevBufferLen = 0;
	    }, 0);

	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');

	    // ensure transport won't stay open
	    this.transport.close();

	    // ignore further transport communication
	    this.transport.removeAllListeners();

	    // set ready state
	    this.readyState = 'closed';

	    // clear session id
	    this.id = null;

	    // emit close event
	    this.emit('close', reason, desc);
	  }
	};

	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */

	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */

	var XMLHttpRequest = __webpack_require__(19);
	var XHR = __webpack_require__(22);
	var JSONP = __webpack_require__(40);
	var websocket = __webpack_require__(41);

	/**
	 * Export transports.
	 */

	exports.polling = polling;
	exports.websocket = websocket;

	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */

	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }

	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);

	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(20);

	module.exports = function(opts) {
	  var xdomain = opts.xdomain;

	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;

	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;

	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }

	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }

	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var global = __webpack_require__(21);

	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */

	try {
	  module.exports = 'XMLHttpRequest' in global &&
	    'withCredentials' in new global.XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	
	/**
	 * Returns `this`. Execute this without a "context" (i.e. without it being
	 * attached to an object of the left-hand side), and `this` points to the
	 * "global" scope of the current JS execution.
	 */

	module.exports = (function () { return this; })();


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */

	var XMLHttpRequest = __webpack_require__(19);
	var Polling = __webpack_require__(23);
	var Emitter = __webpack_require__(11);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:polling-xhr');

	/**
	 * Module exports.
	 */

	module.exports = XHR;
	module.exports.Request = Request;

	/**
	 * Empty function
	 */

	function empty(){}

	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function XHR(opts){
	  Polling.call(this, opts);

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(XHR, Polling);

	/**
	 * XHR supports binary
	 */

	XHR.prototype.supportsBinary = true;

	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */

	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  return new Request(opts);
	};

	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */

	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};

	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */

	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  this.create();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */

	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;

	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }

	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }

	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }

	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }

	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }

	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};

	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */

	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};

	/**
	 * Called if we have data.
	 *
	 * @api private
	 */

	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};

	/**
	 * Called upon error.
	 *
	 * @api private
	 */

	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};

	/**
	 * Cleans up house.
	 *
	 * @api private
	 */

	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }

	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }

	  if (global.document) {
	    delete Request.requests[this.index];
	  }

	  this.xhr = null;
	};

	/**
	 * Called upon load.
	 *
	 * @api private
	 */

	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        data = 'ok';
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};

	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */

	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};

	/**
	 * Aborts the request.
	 *
	 * @api public
	 */

	Request.prototype.abort = function(){
	  this.cleanup();
	};

	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */

	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}

	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(24);
	var parseqs = __webpack_require__(35);
	var parser = __webpack_require__(25);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:polling');

	/**
	 * Module exports.
	 */

	module.exports = Polling;

	/**
	 * Is XHR2 supported?
	 */

	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(19);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();

	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */

	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(Polling, Transport);

	/**
	 * Transport name.
	 */

	Polling.prototype.name = 'polling';

	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */

	Polling.prototype.doOpen = function(){
	  this.poll();
	};

	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */

	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;

	  this.readyState = 'pausing';

	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }

	  if (this.polling || !this.writable) {
	    var total = 0;

	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }

	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};

	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */

	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};

	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */

	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }

	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }

	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };

	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);

	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');

	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};

	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */

	Polling.prototype.doClose = function(){
	  var self = this;

	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }

	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};

	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */

	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };

	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';

	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
	  }

	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  return schema + '://' + this.hostname + port + this.path + query;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(25);
	var Emitter = __webpack_require__(11);

	/**
	 * Module exports.
	 */

	module.exports = Transport;

	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */

	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Transport.prototype);

	/**
	 * A counter used to prevent collisions in the timestamps used
	 * for cache busting.
	 */

	Transport.timestamps = 0;

	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */

	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};

	/**
	 * Opens the transport.
	 *
	 * @api public
	 */

	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }

	  return this;
	};

	/**
	 * Closes the transport.
	 *
	 * @api private
	 */

	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }

	  return this;
	};

	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */

	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};

	/**
	 * Called upon open
	 *
	 * @api private
	 */

	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};

	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */

	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};

	/**
	 * Called with a decoded packet.
	 */

	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon close.
	 *
	 * @api private
	 */

	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var keys = __webpack_require__(26);
	var hasBinary = __webpack_require__(27);
	var sliceBuffer = __webpack_require__(29);
	var base64encoder = __webpack_require__(30);
	var after = __webpack_require__(31);
	var utf8 = __webpack_require__(32);

	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */

	var isAndroid = navigator.userAgent.match(/Android/i);

	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;

	/**
	 * Current protocol version.
	 */

	exports.protocol = 3;

	/**
	 * Packet types.
	 */

	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};

	var packetslist = keys(packets);

	/**
	 * Premade error packet.
	 */

	var err = { type: 'error', data: 'parser error' };

	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */

	var Blob = __webpack_require__(34);

	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */

	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }

	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }

	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;

	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }

	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }

	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];

	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }

	  return callback('' + encoded);

	};

	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}

	/**
	 * Encode packet helpers for binary types
	 */

	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);

	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }

	  return callback(resultBuffer.buffer);
	}

	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}

	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }

	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);

	  return callback(blob);
	}

	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */

	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }

	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};

	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */

	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }

	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);

	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }

	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }

	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};

	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */

	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }

	  var data = base64encoder.decode(msg.substr(1));

	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }

	  return { type: type, data: data };
	};

	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */

	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }

	  var isBinary = hasBinary(packets);

	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }

	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }

	  if (!packets.length) {
	    return callback('0:');
	  }

	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};

	/**
	 * Async array map using after
	 */

	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);

	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };

	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}

	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */

	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }

	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	  var length = ''
	    , n, msg;

	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);

	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      msg = data.substr(i + 1, n);

	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);

	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }

	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }

	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }

	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	};

	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */

	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }

	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);

	    var resultArray = new Uint8Array(totalLength);

	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }

	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }

	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;

	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });

	    return callback(resultArray.buffer);
	  });
	};

	/**
	 * Encode as Blob
	 */

	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }

	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;

	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;

	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};

	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */

	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var bufferTail = data;
	  var buffers = [];

	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';

	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;

	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }

	      msgLength += tailArray[i];
	    }

	    if(numberTooLong) return callback(err, 0, 1);

	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);

	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }

	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }

	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */

	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;

	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(28);

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (obj.hasOwnProperty(key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */

	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;

	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }

	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }

	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";

	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";

	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }

	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }

	    return base64;
	  };

	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;

	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }

	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);

	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);

	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }

	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = after

	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count

	    return (count === 0) ? callback() : proxy

	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count

	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}

	function noop() {}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! http://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from http://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from http://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}

		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}

		function utf8encode(string) {
			var codePoints = ucs2decode(string);

			// console.log(JSON.stringify(codePoints.map(function(x) {
			// 	return 'U+' + x.toString(16).toUpperCase();
			// })));

			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module), (function() { return this; }())))

/***/ },
/* 33 */,
/* 34 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */

	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;

	/**
	 * Check if Blob constructor is supported
	 */

	var blobSupported = (function() {
	  try {
	    var b = new Blob(['hi']);
	    return b.size == 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if BlobBuilder is supported
	 */

	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;

	function BlobBuilderConstructor(ary, options) {
	  options = options || {};

	  var bb = new BlobBuilder();
	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }
	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};

	module.exports = (function() {
	  if (blobSupported) {
	    return global.Blob;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	exports.encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(38);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // This hackery is required for IE8,
	  // where the `console.log` function doesn't have 'apply'
	  return 'object' == typeof console
	    && 'function' == typeof console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      localStorage.removeItem('debug');
	    } else {
	      localStorage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = localStorage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(39);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 's':
	      return n * s;
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */

	var Polling = __webpack_require__(23);
	var inherit = __webpack_require__(36);

	/**
	 * Module exports.
	 */

	module.exports = JSONPPolling;

	/**
	 * Cached regular expressions.
	 */

	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;

	/**
	 * Global JSONP callbacks.
	 */

	var callbacks;

	/**
	 * Callbacks count.
	 */

	var index = 0;

	/**
	 * Noop.
	 */

	function empty () { }

	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */

	function JSONPPolling (opts) {
	  Polling.call(this, opts);

	  this.query = this.query || {};

	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }

	  // callback identifier
	  this.index = callbacks.length;

	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });

	  // append to query string
	  this.query.j = this.index;

	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(JSONPPolling, Polling);

	/*
	 * JSONP only supports binary as base64 encoded strings
	 */

	JSONPPolling.prototype.supportsBinary = false;

	/**
	 * Closes the socket.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }

	  Polling.prototype.doClose.call(this);
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');

	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };

	  var insertAt = document.getElementsByTagName('script')[0];
	  insertAt.parentNode.insertBefore(script, insertAt);
	  this.script = script;

	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
	  
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};

	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */

	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;

	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;

	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);

	    this.form = form;
	    this.area = area;
	  }

	  this.form.action = this.uri();

	  function complete () {
	    initIframe();
	    fn();
	  }

	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }

	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }

	    iframe.id = self.iframeId;

	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }

	  initIframe();

	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');

	  try {
	    this.form.submit();
	  } catch(e) {}

	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(24);
	var parser = __webpack_require__(25);
	var parseqs = __webpack_require__(35);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:websocket');

	/**
	 * `ws` exposes a WebSocket-compatible interface in
	 * Node, or the `WebSocket` or `MozWebSocket` globals
	 * in the browser.
	 */

	var WebSocket = __webpack_require__(42);

	/**
	 * Module exports.
	 */

	module.exports = WS;

	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */

	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(WS, Transport);

	/**
	 * Transport name.
	 *
	 * @api public
	 */

	WS.prototype.name = 'websocket';

	/*
	 * WebSockets support binary
	 */

	WS.prototype.supportsBinary = true;

	/**
	 * Opens socket.
	 *
	 * @api private
	 */

	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }

	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = { agent: this.agent };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  this.ws = new WebSocket(uri, protocols, opts);

	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }

	  this.ws.binaryType = 'arraybuffer';
	  this.addEventListeners();
	};

	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */

	WS.prototype.addEventListeners = function(){
	  var self = this;

	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};

	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */

	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}

	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */

	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  for (var i = 0, l = packets.length; i < l; i++) {
	    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
	      //Sometimes the websocket has already been closed but the browser didn't
	      //have a chance of informing us about it yet, in that case send will
	      //throw an error
	      try {
	        self.ws.send(data);
	      } catch (e){
	        debug('websocket closed before onclose event');
	      }
	    });
	  }

	  function ondrain() {
	    self.writable = true;
	    self.emit('drain');
	  }
	  // fake drain
	  // defer to next tick to allow Socket to clear writeBuffer
	  setTimeout(ondrain, 0);
	};

	/**
	 * Called upon close
	 *
	 * @api private
	 */

	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};

	/**
	 * Closes socket.
	 *
	 * @api private
	 */

	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';

	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = +new Date;
	  }

	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  return schema + '://' + this.hostname + port + this.path + query;
	};

	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */

	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	
	/**
	 * Module dependencies.
	 */

	var global = (function() { return this; })();

	/**
	 * WebSocket constructor.
	 */

	var WebSocket = global.WebSocket || global.MozWebSocket;

	/**
	 * Module exports.
	 */

	module.exports = WebSocket ? ws : null;

	/**
	 * WebSocket constructor.
	 *
	 * The third `opts` options object gets ignored in web browsers, since it's
	 * non-standard, and throws a TypeError if passed to the constructor.
	 * See: https://github.com/einaros/ws/issues/227
	 *
	 * @param {String} uri
	 * @param {Array} protocols (optional)
	 * @param {Object) opts (optional)
	 * @api public
	 */

	function ws(uri, protocols, opts) {
	  var instance;
	  if (protocols) {
	    instance = new WebSocket(uri, protocols);
	  } else {
	    instance = new WebSocket(uri);
	  }
	  return instance;
	}

	if (WebSocket) ws.prototype = WebSocket.prototype;


/***/ },
/* 43 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    return uri;
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */

	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;

	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }

	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }

	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(7);
	var Emitter = __webpack_require__(11);
	var toArray = __webpack_require__(47);
	var on = __webpack_require__(48);
	var bind = __webpack_require__(49);
	var debug = __webpack_require__(6)('socket.io-client:socket');
	var hasBin = __webpack_require__(50);

	/**
	 * Module exports.
	 */

	module.exports = exports = Socket;

	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */

	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1
	};

	/**
	 * Shortcut to `Emitter#emit`.
	 */

	var emit = Emitter.prototype.emit;

	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */

	function Socket(io, nsp){
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  if (this.io.autoConnect) this.open();
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */

	Socket.prototype.subEvents = function() {
	  if (this.subs) return;

	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};

	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */

	Socket.prototype.open =
	Socket.prototype.connect = function(){
	  if (this.connected) return this;

	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' == this.io.readyState) this.onopen();
	  return this;
	};

	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.send = function(){
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};

	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.emit = function(ev){
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }

	  var args = toArray(arguments);
	  var parserType = parser.EVENT; // default
	  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
	  var packet = { type: parserType, data: args };

	  // event ack callback
	  if ('function' == typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }

	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }

	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.packet = function(packet){
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};

	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */

	Socket.prototype.onopen = function(){
	  debug('transport is open - connecting');

	  // write connect packet if necessary
	  if ('/' != this.nsp) {
	    this.packet({ type: parser.CONNECT });
	  }
	};

	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */

	Socket.prototype.onclose = function(reason){
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};

	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onpacket = function(packet){
	  if (packet.nsp != this.nsp) return;

	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;

	    case parser.EVENT:
	      this.onevent(packet);
	      break;

	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;

	    case parser.ACK:
	      this.onack(packet);
	      break;

	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;

	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;

	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};

	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onevent = function(packet){
	  var args = packet.data || [];
	  debug('emitting event %j', args);

	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }

	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};

	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */

	Socket.prototype.ack = function(id){
	  var self = this;
	  var sent = false;
	  return function(){
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);

	    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
	    self.packet({
	      type: type,
	      id: id,
	      data: args
	    });
	  };
	};

	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onack = function(packet){
	  debug('calling ack %s with %j', packet.id, packet.data);
	  var fn = this.acks[packet.id];
	  fn.apply(this, packet.data);
	  delete this.acks[packet.id];
	};

	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */

	Socket.prototype.onconnect = function(){
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};

	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */

	Socket.prototype.emitBuffered = function(){
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];

	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};

	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */

	Socket.prototype.ondisconnect = function(){
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};

	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */

	Socket.prototype.destroy = function(){
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }

	  this.io.destroy(this);
	};

	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.close =
	Socket.prototype.disconnect = function(){
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }

	  // remove socket from pool
	  this.destroy();

	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};


/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = toArray

	function toArray(list, index) {
	    var array = []

	    index = index || 0

	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }

	    return array
	}


/***/ },
/* 48 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = on;

	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */

	function on(obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function(){
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(51);

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 52 */
/***/ function(module, exports) {

	
	/**
	 * HOP ref.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Return own keys in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */

	exports.keys = Object.keys || function(obj){
	  var keys = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      keys.push(key);
	    }
	  }
	  return keys;
	};

	/**
	 * Return own values in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */

	exports.values = function(obj){
	  var vals = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      vals.push(obj[key]);
	    }
	  }
	  return vals;
	};

	/**
	 * Merge `b` into `a`.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api public
	 */

	exports.merge = function(a, b){
	  for (var key in b) {
	    if (has.call(b, key)) {
	      a[key] = b[key];
	    }
	  }
	  return a;
	};

	/**
	 * Return length of `obj`.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api public
	 */

	exports.length = function(obj){
	  return exports.keys(obj).length;
	};

	/**
	 * Check if `obj` is empty.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api public
	 */

	exports.isEmpty = function(obj){
	  return 0 == exports.length(obj);
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Backoff`.
	 */

	module.exports = Backoff;

	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}

	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */

	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};

	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */

	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};

	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};

	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};

	/**
	 * Set the jitter
	 *
	 * @api public
	 */

	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};



/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(55)();

	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				__webpack_require__(57)(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 57 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var Router = __webpack_require__(225);
	var injectTapEventPlugin = __webpack_require__(264);
	var AppRoutes = __webpack_require__(268);

	window.React = React;

	//Needed for onTouchTap
	//Can go away with the react 1.0 release.
	injectTapEventPlugin();

	var router = __webpack_require__(478).getRouter();
	var rootComponentInstance;
	router.run(function (Handler) {
	    rootComponentInstance = React.render(React.createElement(Handler, null), document.getElementById('content'));
	});

	if (true) {
	    __webpack_require__(479).RootInstanceProvider.injectProvider({
	        getRootInstances: function getRootInstances() {
	            // Help React Hot Loader figure out the root component instances on the page:
	            return [rootComponentInstance];
	        }
	    });
	}

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "app.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(60);

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var makePatchReactClass = __webpack_require__(61);

	/**
	 * Returns a function that, when invoked, patches a React class with a new
	 * version of itself. To patch different classes, pass different IDs.
	 */
	module.exports = function makeMakeHot(getRootInstances, React) {
	  if (typeof getRootInstances !== 'function') {
	    throw new Error('Expected getRootInstances to be a function.');
	  }

	  var patchers = {};

	  return function makeHot(NextClass, persistentId) {
	    persistentId = persistentId || NextClass.displayName || NextClass.name;

	    if (!persistentId) {
	      console.error(
	        'Hot reload is disabled for one of your types. To enable it, pass a ' +
	        'string uniquely identifying this class within this current module ' +
	        'as a second parameter to makeHot.'
	      );
	      return NextClass;
	    }

	    if (!patchers[persistentId]) {
	      patchers[persistentId] = makePatchReactClass(getRootInstances, React);
	    }

	    var patchReactClass = patchers[persistentId];
	    return patchReactClass(NextClass);
	  };
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var makeAssimilatePrototype = __webpack_require__(62),
	    requestForceUpdateAll = __webpack_require__(63);

	function hasNonStubTypeProperty(ReactClass) {
	  if (!ReactClass.hasOwnProperty('type')) {
	    return false;
	  }

	  var descriptor = Object.getOwnPropertyDescriptor(ReactClass, 'type');
	  if (typeof descriptor.get === 'function') {
	    return false;
	  }

	  return true;
	}

	function getPrototype(ReactClass) {
	  var prototype = ReactClass.prototype,
	      seemsLegit = prototype && typeof prototype.render === 'function';

	  if (!seemsLegit && hasNonStubTypeProperty(ReactClass)) {
	    prototype = ReactClass.type.prototype;
	  }

	  return prototype;
	}

	/**
	 * Returns a function that will patch React class with new versions of itself
	 * on subsequent invocations. Both legacy and ES6 style classes are supported.
	 */
	module.exports = function makePatchReactClass(getRootInstances, React) {
	  var assimilatePrototype = makeAssimilatePrototype(),
	      FirstClass = null;

	  return function patchReactClass(NextClass) {
	    var nextPrototype = getPrototype(NextClass);
	    assimilatePrototype(nextPrototype);

	    if (FirstClass) {
	      requestForceUpdateAll(getRootInstances, React);
	    }

	    return FirstClass || (FirstClass = NextClass);
	  };
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Returns a function that establishes the first prototype passed to it
	 * as the "source of truth" and patches its methods on subsequent invocations,
	 * also patching current and previous prototypes to forward calls to it.
	 */
	module.exports = function makeAssimilatePrototype() {
	  var storedPrototype,
	      knownPrototypes = [];

	  function wrapMethod(key) {
	    return function () {
	      if (storedPrototype[key]) {
	        return storedPrototype[key].apply(this, arguments);
	      }
	    };
	  }

	  function patchProperty(proto, key) {
	    proto[key] = storedPrototype[key];

	    if (typeof proto[key] !== 'function' ||
	      key === 'type' ||
	      key === 'constructor') {
	      return;
	    }

	    proto[key] = wrapMethod(key);

	    if (storedPrototype[key].isReactClassApproved) {
	      proto[key].isReactClassApproved = storedPrototype[key].isReactClassApproved;
	    }

	    if (proto.__reactAutoBindMap && proto.__reactAutoBindMap[key]) {
	      proto.__reactAutoBindMap[key] = proto[key];
	    }
	  }

	  function updateStoredPrototype(freshPrototype) {
	    storedPrototype = {};

	    Object.getOwnPropertyNames(freshPrototype).forEach(function (key) {
	      storedPrototype[key] = freshPrototype[key];
	    });
	  }

	  function reconcileWithStoredPrototypes(freshPrototype) {
	    knownPrototypes.push(freshPrototype);
	    knownPrototypes.forEach(function (proto) {
	      Object.getOwnPropertyNames(storedPrototype).forEach(function (key) {
	        patchProperty(proto, key);
	      });
	    });
	  }

	  return function assimilatePrototype(freshPrototype) {
	    if (Object.prototype.hasOwnProperty.call(freshPrototype, '__isAssimilatedByReactHotAPI')) {
	      return;
	    }

	    updateStoredPrototype(freshPrototype);
	    reconcileWithStoredPrototypes(freshPrototype);
	    freshPrototype.__isAssimilatedByReactHotAPI = true;
	  };
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var deepForceUpdate = __webpack_require__(64);

	var isRequestPending = false;

	module.exports = function requestForceUpdateAll(getRootInstances, React) {
	  if (isRequestPending) {
	    return;
	  }

	  /**
	   * Forces deep re-render of all mounted React components.
	   * Hats off to Omar Skalli (@Chetane) for suggesting this approach:
	   * https://gist.github.com/Chetane/9a230a9fdcdca21a4e29
	   */
	  function forceUpdateAll() {
	    isRequestPending = false;

	    var rootInstances = getRootInstances(),
	        rootInstance;

	    for (var key in rootInstances) {
	      if (rootInstances.hasOwnProperty(key)) {
	        rootInstance = rootInstances[key];

	        // `|| rootInstance` for React 0.12 and earlier
	        rootInstance = rootInstance._reactInternalInstance || rootInstance;
	        deepForceUpdate(rootInstance, React);
	      }
	    }
	  }

	  setTimeout(forceUpdateAll);
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bindAutoBindMethods = __webpack_require__(65);
	var traverseRenderedChildren = __webpack_require__(66);

	function setPendingForceUpdate(internalInstance) {
	  if (internalInstance._pendingForceUpdate === false) {
	    internalInstance._pendingForceUpdate = true;
	  }
	}

	function forceUpdateIfPending(internalInstance, React) {
	  if (internalInstance._pendingForceUpdate === true) {
	    // `|| internalInstance` for React 0.12 and earlier
	    var instance = internalInstance._instance || internalInstance;

	    if (instance.forceUpdate) {
	      instance.forceUpdate();
	    } else if (React && React.Component) {
	      React.Component.prototype.forceUpdate.call(instance);
	    }
	  }
	}

	/**
	 * Updates a React component recursively, so even if children define funky
	 * `shouldComponentUpdate`, they are forced to re-render.
	 * Makes sure that any newly added methods are properly auto-bound.
	 */
	function deepForceUpdate(internalInstance, React) {
	  traverseRenderedChildren(internalInstance, bindAutoBindMethods);
	  traverseRenderedChildren(internalInstance, setPendingForceUpdate);
	  traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);
	}

	module.exports = deepForceUpdate;


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	function bindAutoBindMethod(component, method) {
	  var boundMethod = method.bind(component);

	  boundMethod.__reactBoundContext = component;
	  boundMethod.__reactBoundMethod = method;
	  boundMethod.__reactBoundArguments = null;

	  var componentName = component.constructor.displayName,
	      _bind = boundMethod.bind;

	  boundMethod.bind = function (newThis) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    if (newThis !== component && newThis !== null) {
	      console.warn(
	        'bind(): React component methods may only be bound to the ' +
	        'component instance. See ' + componentName
	      );
	    } else if (!args.length) {
	      console.warn(
	        'bind(): You are binding a component method to the component. ' +
	        'React does this for you automatically in a high-performance ' +
	        'way, so you can safely remove this call. See ' + componentName
	      );
	      return boundMethod;
	    }

	    var reboundMethod = _bind.apply(boundMethod, arguments);
	    reboundMethod.__reactBoundContext = component;
	    reboundMethod.__reactBoundMethod = method;
	    reboundMethod.__reactBoundArguments = args;

	    return reboundMethod;
	  };

	  return boundMethod;
	}

	/**
	 * Performs auto-binding similar to how React does it.
	 * Skips already auto-bound methods.
	 * Based on https://github.com/facebook/react/blob/b264372e2b3ad0b0c0c0cc95a2f383e4a1325c3d/src/classic/class/ReactClass.js#L639-L705
	 */
	module.exports = function bindAutoBindMethods(internalInstance) {
	  var component = typeof internalInstance.getPublicInstance === 'function' ?
	    internalInstance.getPublicInstance() :
	    internalInstance;

	  for (var autoBindKey in component.__reactAutoBindMap) {
	    if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
	      continue;
	    }

	    // Skip already bound methods
	    if (component.hasOwnProperty(autoBindKey) &&
	        component[autoBindKey].__reactBoundContext === component) {
	      continue;
	    }

	    var method = component.__reactAutoBindMap[autoBindKey];
	    component[autoBindKey] = bindAutoBindMethod(component, method);
	  }
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	'use strict';

	function traverseRenderedChildren(internalInstance, callback, argument) {
	  callback(internalInstance, argument);

	  if (internalInstance._renderedComponent) {
	    traverseRenderedChildren(
	      internalInstance._renderedComponent,
	      callback,
	      argument
	    );
	  } else {
	    for (var key in internalInstance._renderedChildren) {
	      traverseRenderedChildren(
	        internalInstance._renderedChildren[key],
	        callback,
	        argument
	      );
	    }
	  }
	}

	module.exports = traverseRenderedChildren;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getRootInstancesFromReactMount = __webpack_require__(68);

	var injectedProvider = null,
	    didWarn = false;

	function warnOnce() {
	  if (!didWarn) {
	    console.warn(
	      'It appears that React Hot Loader isn\'t configured correctly. ' +
	      'If you\'re using NPM, make sure your dependencies don\'t drag duplicate React distributions into their node_modules and that require("react") corresponds to the React instance you render your app with.',
	      'If you\'re using a precompiled version of React, see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react for integration instructions.'
	    );
	  }

	  didWarn = true;
	}

	var RootInstanceProvider = {
	  injection: {
	    injectProvider: function (provider) {
	      injectedProvider = provider;
	    }
	  },

	  getRootInstances: function (ReactMount) {
	    if (injectedProvider) {
	      return injectedProvider.getRootInstances();
	    }

	    var instances = ReactMount && getRootInstancesFromReactMount(ReactMount) || [];
	    if (!Object.keys(instances).length) {
	      warnOnce();
	    }

	    return instances;
	  }
	};

	module.exports = RootInstanceProvider;

/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	function getRootInstancesFromReactMount(ReactMount) {
	  return ReactMount._instancesByReactRootID || ReactMount._instancesByContainerID || [];
	}

	module.exports = getRootInstancesFromReactMount;

/***/ },
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function injectTapEventPlugin () {
	  var React = __webpack_require__(123);
	  React.initializeTouchEvents(true);

	  __webpack_require__(76).injection.injectEventPluginsByName({
	    "ResponderEventPlugin": __webpack_require__(265),
	    "TapEventPlugin":       __webpack_require__(266)
	  });
	};


/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ResponderEventPlugin
	 */

	"use strict";

	var EventConstants = __webpack_require__(74);
	var EventPluginUtils = __webpack_require__(78);
	var EventPropagators = __webpack_require__(161);
	var SyntheticEvent = __webpack_require__(165);

	var accumulateInto = __webpack_require__(79);
	var keyOf = __webpack_require__(130);

	var isStartish = EventPluginUtils.isStartish;
	var isMoveish = EventPluginUtils.isMoveish;
	var isEndish = EventPluginUtils.isEndish;
	var executeDirectDispatch = EventPluginUtils.executeDirectDispatch;
	var hasDispatches = EventPluginUtils.hasDispatches;
	var executeDispatchesInOrderStopAtTrue =
	  EventPluginUtils.executeDispatchesInOrderStopAtTrue;

	/**
	 * ID of element that should respond to touch/move types of interactions, as
	 * indicated explicitly by relevant callbacks.
	 */
	var responderID = null;
	var isPressing = false;

	var eventTypes = {
	  /**
	   * On a `touchStart`/`mouseDown`, is it desired that this element become the
	   * responder?
	   */
	  startShouldSetResponder: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onStartShouldSetResponder: null}),
	      captured: keyOf({onStartShouldSetResponderCapture: null})
	    }
	  },

	  /**
	   * On a `scroll`, is it desired that this element become the responder? This
	   * is usually not needed, but should be used to retroactively infer that a
	   * `touchStart` had occured during momentum scroll. During a momentum scroll,
	   * a touch start will be immediately followed by a scroll event if the view is
	   * currently scrolling.
	   */
	  scrollShouldSetResponder: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onScrollShouldSetResponder: null}),
	      captured: keyOf({onScrollShouldSetResponderCapture: null})
	    }
	  },

	  /**
	   * On a `touchMove`/`mouseMove`, is it desired that this element become the
	   * responder?
	   */
	  moveShouldSetResponder: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onMoveShouldSetResponder: null}),
	      captured: keyOf({onMoveShouldSetResponderCapture: null})
	    }
	  },

	  /**
	   * Direct responder events dispatched directly to responder. Do not bubble.
	   */
	  responderMove: {registrationName: keyOf({onResponderMove: null})},
	  responderRelease: {registrationName: keyOf({onResponderRelease: null})},
	  responderTerminationRequest: {
	    registrationName: keyOf({onResponderTerminationRequest: null})
	  },
	  responderGrant: {registrationName: keyOf({onResponderGrant: null})},
	  responderReject: {registrationName: keyOf({onResponderReject: null})},
	  responderTerminate: {registrationName: keyOf({onResponderTerminate: null})}
	};

	/**
	 * Performs negotiation between any existing/current responder, checks to see if
	 * any new entity is interested in becoming responder, performs that handshake
	 * and returns any events that must be emitted to notify the relevant parties.
	 *
	 * A note about event ordering in the `EventPluginHub`.
	 *
	 * Suppose plugins are injected in the following order:
	 *
	 * `[R, S, C]`
	 *
	 * To help illustrate the example, assume `S` is `SimpleEventPlugin` (for
	 * `onClick` etc) and `R` is `ResponderEventPlugin`.
	 *
	 * "Deferred-Dispatched Events":
	 *
	 * - The current event plugin system will traverse the list of injected plugins,
	 *   in order, and extract events by collecting the plugin's return value of
	 *   `extractEvents()`.
	 * - These events that are returned from `extractEvents` are "deferred
	 *   dispatched events".
	 * - When returned from `extractEvents`, deferred-dispatched events contain an
	 *   "accumulation" of deferred dispatches.
	 * - These deferred dispatches are accumulated/collected before they are
	 *   returned, but processed at a later time by the `EventPluginHub` (hence the
	 *   name deferred).
	 *
	 * In the process of returning their deferred-dispatched events, event plugins
	 * themselves can dispatch events on-demand without returning them from
	 * `extractEvents`. Plugins might want to do this, so that they can use event
	 * dispatching as a tool that helps them decide which events should be extracted
	 * in the first place.
	 *
	 * "On-Demand-Dispatched Events":
	 *
	 * - On-demand-dispatched events are not returned from `extractEvents`.
	 * - On-demand-dispatched events are dispatched during the process of returning
	 *   the deferred-dispatched events.
	 * - They should not have side effects.
	 * - They should be avoided, and/or eventually be replaced with another
	 *   abstraction that allows event plugins to perform multiple "rounds" of event
	 *   extraction.
	 *
	 * Therefore, the sequence of event dispatches becomes:
	 *
	 * - `R`s on-demand events (if any)   (dispatched by `R` on-demand)
	 * - `S`s on-demand events (if any)   (dispatched by `S` on-demand)
	 * - `C`s on-demand events (if any)   (dispatched by `C` on-demand)
	 * - `R`s extracted events (if any)   (dispatched by `EventPluginHub`)
	 * - `S`s extracted events (if any)   (dispatched by `EventPluginHub`)
	 * - `C`s extracted events (if any)   (dispatched by `EventPluginHub`)
	 *
	 * In the case of `ResponderEventPlugin`: If the `startShouldSetResponder`
	 * on-demand dispatch returns `true` (and some other details are satisfied) the
	 * `onResponderGrant` deferred dispatched event is returned from
	 * `extractEvents`. The sequence of dispatch executions in this case
	 * will appear as follows:
	 *
	 * - `startShouldSetResponder` (`ResponderEventPlugin` dispatches on-demand)
	 * - `touchStartCapture`       (`EventPluginHub` dispatches as usual)
	 * - `touchStart`              (`EventPluginHub` dispatches as usual)
	 * - `responderGrant/Reject`   (`EventPluginHub` dispatches as usual)
	 *
	 * @param {string} topLevelType Record from `EventConstants`.
	 * @param {string} topLevelTargetID ID of deepest React rendered element.
	 * @param {object} nativeEvent Native browser event.
	 * @return {*} An accumulation of synthetic events.
	 */
	function setResponderAndExtractTransfer(
	    topLevelType,
	    topLevelTargetID,
	    nativeEvent) {
	  var shouldSetEventType =
	    isStartish(topLevelType) ? eventTypes.startShouldSetResponder :
	    isMoveish(topLevelType) ? eventTypes.moveShouldSetResponder :
	    eventTypes.scrollShouldSetResponder;

	  var bubbleShouldSetFrom = responderID || topLevelTargetID;
	  var shouldSetEvent = SyntheticEvent.getPooled(
	    shouldSetEventType,
	    bubbleShouldSetFrom,
	    nativeEvent
	  );
	  EventPropagators.accumulateTwoPhaseDispatches(shouldSetEvent);
	  var wantsResponderID = executeDispatchesInOrderStopAtTrue(shouldSetEvent);
	  if (!shouldSetEvent.isPersistent()) {
	    shouldSetEvent.constructor.release(shouldSetEvent);
	  }

	  if (!wantsResponderID || wantsResponderID === responderID) {
	    return null;
	  }
	  var extracted;
	  var grantEvent = SyntheticEvent.getPooled(
	    eventTypes.responderGrant,
	    wantsResponderID,
	    nativeEvent
	  );

	  EventPropagators.accumulateDirectDispatches(grantEvent);
	  if (responderID) {
	    var terminationRequestEvent = SyntheticEvent.getPooled(
	      eventTypes.responderTerminationRequest,
	      responderID,
	      nativeEvent
	    );
	    EventPropagators.accumulateDirectDispatches(terminationRequestEvent);
	    var shouldSwitch = !hasDispatches(terminationRequestEvent) ||
	      executeDirectDispatch(terminationRequestEvent);
	    if (!terminationRequestEvent.isPersistent()) {
	      terminationRequestEvent.constructor.release(terminationRequestEvent);
	    }

	    if (shouldSwitch) {
	      var terminateType = eventTypes.responderTerminate;
	      var terminateEvent = SyntheticEvent.getPooled(
	        terminateType,
	        responderID,
	        nativeEvent
	      );
	      EventPropagators.accumulateDirectDispatches(terminateEvent);
	      extracted = accumulateInto(extracted, [grantEvent, terminateEvent]);
	      responderID = wantsResponderID;
	    } else {
	      var rejectEvent = SyntheticEvent.getPooled(
	        eventTypes.responderReject,
	        wantsResponderID,
	        nativeEvent
	      );
	      EventPropagators.accumulateDirectDispatches(rejectEvent);
	      extracted = accumulateInto(extracted, rejectEvent);
	    }
	  } else {
	    extracted = accumulateInto(extracted, grantEvent);
	    responderID = wantsResponderID;
	  }
	  return extracted;
	}

	/**
	 * A transfer is a negotiation between a currently set responder and the next
	 * element to claim responder status. Any start event could trigger a transfer
	 * of responderID. Any move event could trigger a transfer, so long as there is
	 * currently a responder set (in other words as long as the user is pressing
	 * down).
	 *
	 * @param {string} topLevelType Record from `EventConstants`.
	 * @return {boolean} True if a transfer of responder could possibly occur.
	 */
	function canTriggerTransfer(topLevelType) {
	  return topLevelType === EventConstants.topLevelTypes.topScroll ||
	         isStartish(topLevelType) ||
	         (isPressing && isMoveish(topLevelType));
	}

	/**
	 * Event plugin for formalizing the negotiation between claiming locks on
	 * receiving touches.
	 */
	var ResponderEventPlugin = {

	  getResponderID: function() {
	    return responderID;
	  },

	  eventTypes: eventTypes,

	  /**
	   * @param {string} topLevelType Record from `EventConstants`.
	   * @param {DOMEventTarget} topLevelTarget The listening component root node.
	   * @param {string} topLevelTargetID ID of `topLevelTarget`.
	   * @param {object} nativeEvent Native browser event.
	   * @return {*} An accumulation of synthetic events.
	   * @see {EventPluginHub.extractEvents}
	   */
	  extractEvents: function(
	      topLevelType,
	      topLevelTarget,
	      topLevelTargetID,
	      nativeEvent) {
	    var extracted;
	    // Must have missed an end event - reset the state here.
	    if (responderID && isStartish(topLevelType)) {
	      responderID = null;
	    }
	    if (isStartish(topLevelType)) {
	      isPressing = true;
	    } else if (isEndish(topLevelType)) {
	      isPressing = false;
	    }
	    if (canTriggerTransfer(topLevelType)) {
	      var transfer = setResponderAndExtractTransfer(
	        topLevelType,
	        topLevelTargetID,
	        nativeEvent
	      );
	      if (transfer) {
	        extracted = accumulateInto(extracted, transfer);
	      }
	    }
	    // Now that we know the responder is set correctly, we can dispatch
	    // responder type events (directly to the responder).
	    var type = isMoveish(topLevelType) ? eventTypes.responderMove :
	      isEndish(topLevelType) ? eventTypes.responderRelease :
	      isStartish(topLevelType) ? eventTypes.responderStart : null;
	    if (type) {
	      var gesture = SyntheticEvent.getPooled(
	        type,
	        responderID || '',
	        nativeEvent
	      );
	      EventPropagators.accumulateDirectDispatches(gesture);
	      extracted = accumulateInto(extracted, gesture);
	    }
	    if (type === eventTypes.responderRelease) {
	      responderID = null;
	    }
	    return extracted;
	  }

	};

	module.exports = ResponderEventPlugin;


/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TapEventPlugin
	 * @typechecks static-only
	 */

	"use strict";

	var EventConstants = __webpack_require__(74);
	var EventPluginUtils = __webpack_require__(78);
	var EventPropagators = __webpack_require__(161);
	var SyntheticUIEvent = __webpack_require__(174);
	var TouchEventUtils = __webpack_require__(267);
	var ViewportMetrics = __webpack_require__(82);

	var keyOf = __webpack_require__(130);
	var topLevelTypes = EventConstants.topLevelTypes;

	var isStartish = EventPluginUtils.isStartish;
	var isEndish = EventPluginUtils.isEndish;

	var isTouch = function(topLevelType) {
	  var touchTypes = [
	    topLevelTypes.topTouchCancel,
	    topLevelTypes.topTouchEnd,
	    topLevelTypes.topTouchStart,
	    topLevelTypes.topTouchMove
	  ];
	  return touchTypes.indexOf(topLevelType) >= 0;
	}

	/**
	 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
	 * in order to still be considered a 'tap' event.
	 */
	var tapMoveThreshold = 10;
	var ignoreMouseThreshold = 750;
	var startCoords = {x: null, y: null};
	var lastTouchEvent = null;

	var Axis = {
	  x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	  y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
	};

	function getAxisCoordOfEvent(axis, nativeEvent) {
	  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	  if (singleTouch) {
	    return singleTouch[axis.page];
	  }
	  return axis.page in nativeEvent ?
	    nativeEvent[axis.page] :
	    nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
	}

	function getDistance(coords, nativeEvent) {
	  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	  return Math.pow(
	    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
	    0.5
	  );
	}

	var dependencies = [
	  topLevelTypes.topMouseDown,
	  topLevelTypes.topMouseMove,
	  topLevelTypes.topMouseUp
	];

	if (EventPluginUtils.useTouchEvents) {
	  dependencies.push(
	    topLevelTypes.topTouchEnd,
	    topLevelTypes.topTouchStart,
	    topLevelTypes.topTouchMove
	  );
	}

	var eventTypes = {
	  touchTap: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onTouchTap: null}),
	      captured: keyOf({onTouchTapCapture: null})
	    },
	    dependencies: dependencies
	  }
	};

	var now = function() {
	  if (Date.now) {
	    return Date.now();
	  } else {
	    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
	    return +new Date;
	  }
	}

	var TapEventPlugin = {

	  tapMoveThreshold: tapMoveThreshold,

	  ignoreMouseThreshold: ignoreMouseThreshold,

	  eventTypes: eventTypes,

	  /**
	   * @param {string} topLevelType Record from `EventConstants`.
	   * @param {DOMEventTarget} topLevelTarget The listening component root node.
	   * @param {string} topLevelTargetID ID of `topLevelTarget`.
	   * @param {object} nativeEvent Native browser event.
	   * @return {*} An accumulation of synthetic events.
	   * @see {EventPluginHub.extractEvents}
	   */
	  extractEvents: function(
	      topLevelType,
	      topLevelTarget,
	      topLevelTargetID,
	      nativeEvent) {

	    if (isTouch(topLevelType)) {
	      lastTouchEvent = now();
	    } else {
	      if (lastTouchEvent && (now() - lastTouchEvent) < ignoreMouseThreshold) {
	        return null;
	      }
	    }

	    if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
	      return null;
	    }
	    var event = null;
	    var distance = getDistance(startCoords, nativeEvent);
	    if (isEndish(topLevelType) && distance < tapMoveThreshold) {
	      event = SyntheticUIEvent.getPooled(
	        eventTypes.touchTap,
	        topLevelTargetID,
	        nativeEvent
	      );
	    }
	    if (isStartish(topLevelType)) {
	      startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
	      startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
	    } else if (isEndish(topLevelType)) {
	      startCoords.x = 0;
	      startCoords.y = 0;
	    }
	    EventPropagators.accumulateTwoPhaseDispatches(event);
	    return event;
	  }

	};

	module.exports = TapEventPlugin;


/***/ },
/* 267 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TouchEventUtils
	 */

	var TouchEventUtils = {
	  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
	  extractSingleTouch: function(nativeEvent) {
	    var touches = nativeEvent.touches;
	    var changedTouches = nativeEvent.changedTouches;
	    var hasTouches = touches && touches.length > 0;
	    var hasChangedTouches = changedTouches && changedTouches.length > 0;

	    return !hasTouches && hasChangedTouches ? changedTouches[0] :
	           hasTouches ? touches[0] :
	           nativeEvent;
	  }
	};

	module.exports = TouchEventUtils;


/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var Router = __webpack_require__(225);
	var Route = Router.Route;
	var Redirect = Router.Redirect;
	var DefaultRoute = Router.DefaultRoute;

	// Here we define all our component examples
	var Main = __webpack_require__(269);
	var UserExample = __webpack_require__(455);
	var UserProfile = __webpack_require__(457);
	var Home = __webpack_require__(458);
	var Forum = __webpack_require__(459);
	var News = __webpack_require__(460);

	var BlogRoot = __webpack_require__(461);
	var Blogs = __webpack_require__(466);
	var BlogView = __webpack_require__(468);
	var BlogPostView = __webpack_require__(470);

	var SignUp = __webpack_require__(471);
	var Login = __webpack_require__(476);
	var Logout = __webpack_require__(477);

	var AppRoutes = React.createElement(
	    Route,
	    { name: 'root', path: '/light-cms/', handler: Main },
	    React.createElement(Route, { name: 'home', handler: Home }),
	    React.createElement(Route, { name: 'user-example', handler: UserExample }),
	    React.createElement(Route, { name: 'u/:userId', handler: UserProfile }),
	    React.createElement(Route, { name: 'blogs', handler: Blogs }),
	    React.createElement(Route, { name: 'blogView', handler: BlogView }),
	    React.createElement(Route, { name: 'blogPostView', handler: BlogPostView }),
	    React.createElement(Route, { name: 'forum', handler: Forum }),
	    React.createElement(Route, { name: 'news', handler: News }),
	    React.createElement(Route, { name: 'signup', path: '/signup', handler: SignUp }),
	    React.createElement(Route, { name: 'login', path: '/login', handler: Login }),
	    React.createElement(Route, { name: 'logout', path: '/logout', handler: Logout }),
	    React.createElement(DefaultRoute, { handler: Home })
	);

	module.exports = AppRoutes;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "routes.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var Router = __webpack_require__(225);

	var _require = __webpack_require__(225);

	var Link = _require.Link;

	var _require2 = __webpack_require__(270);

	var Styles = _require2.Styles;
	var RaisedButton = _require2.RaisedButton;
	var AppBar = _require2.AppBar;
	var FlatButton = _require2.FlatButton;
	var IconMenu = _require2.IconMenu;
	var IconButton = _require2.IconButton;

	var MenuItem = __webpack_require__(427);
	var ThemeManager = new Styles.ThemeManager();
	var Colors = Styles.Colors;
	var Typography = Styles.Typography;

	var RouteHandler = Router.RouteHandler;
	var FullWidthSection = __webpack_require__(429);
	var AuthStore = __webpack_require__(433);

	var InlineUser = __webpack_require__(445);

	__webpack_require__(446);

	var LeftNavMenu = __webpack_require__(450);

	var Main = React.createClass({
	    displayName: 'Main',

	    contextTypes: {
	        router: React.PropTypes.func
	    },
	    getChildContext: function getChildContext() {
	        return {
	            muiTheme: ThemeManager.getCurrentTheme()
	        };
	    },

	    getInitialState: function getInitialState() {
	        return {
	            isLoggedIn: AuthStore.isLoggedIn()
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        AuthStore.addChangeListener(this._userLoginChange);
	    },

	    _userLoginChange: function _userLoginChange() {
	        console.log("Main._userLoginChange", AuthStore.isLoggedIn());
	        this.setState({
	            isLoggedIn: AuthStore.isLoggedIn()
	        });
	    },

	    _rightMenuChange: function _rightMenuChange(e, value) {
	        console.log("Main._rightMenuChange", value);
	        this.context.router.transitionTo('/' + value._store.props.value);
	    },

	    render: function render() {
	        var styles = this.getStyles();
	        var rightButton = React.createElement(
	            FlatButton,
	            { style: styles.rightMenuButton },
	            'User'
	        );

	        var rightMenu;
	        if (this.state.isLoggedIn) {
	            rightMenu = React.createElement(
	                IconMenu,
	                { iconButtonElement: rightButton,
	                    openDirection: 'bottom-left',
	                    onItemTouchTap: this._rightMenuChange },
	                React.createElement(MenuItem, { value: "logout", primaryText: 'Sign out' })
	            );
	        } else {
	            rightMenu = React.createElement(
	                IconMenu,
	                { iconButtonElement: rightButton,
	                    openDirection: 'bottom-left',
	                    onItemTouchTap: this._rightMenuChange },
	                React.createElement(MenuItem, { value: "login", primaryText: 'Log in' }),
	                React.createElement(MenuItem, { value: "signup", primaryText: 'Sign up' })
	            );
	        }

	        return React.createElement(
	            'div',
	            { style: styles.parent },
	            React.createElement(AppBar, { title: 'NetworkNT', onLeftIconButtonTouchTap: this.showSideBar, iconElementRight: rightMenu, zDepth: 0, style: styles.topMenu }),
	            React.createElement(LeftNavMenu, { ref: 'leftNav' }),
	            React.createElement(RouteHandler, null),
	            React.createElement(
	                FullWidthSection,
	                { style: styles.footer },
	                React.createElement(
	                    'p',
	                    { style: styles.p },
	                    'Copyright NetworkNT - 2015'
	                )
	            )
	        );
	    },
	    getStyles: function getStyles() {
	        return {
	            parent: {
	                position: 'relative',
	                margin: '64px 0 120px'
	            },
	            footer: {
	                backgroundColor: Colors.grey800,
	                textAlign: 'center',
	                position: 'fixed',
	                left: '0px',
	                right: '0px',
	                bottom: '0px',
	                height: '120px',
	                zIndex: '-10'
	            },
	            a: {
	                color: Colors.red
	            },
	            p: {
	                margin: '0 auto',
	                padding: '0',
	                color: Colors.lightWhite
	            },
	            rightMenuButton: {
	                backgroundColor: Colors.transparent,
	                color: Typography.textFullWhite,
	                margin: 0,
	                paddingTop: 6
	            },
	            topMenu: {
	                backgroundColor: Colors.green300,
	                position: 'fixed',
	                top: '0px',
	                left: '0px',
	                right: '0px',
	                height: '64px'
	            },
	            subheaderMenuItem: {
	                backgroundColor: Colors.green300
	            }
	        };
	    },
	    showSideBar: function showSideBar(e) {
	        this.refs.leftNav.toggle();
	    },
	    componentWillMount: function componentWillMount() {
	        ThemeManager.setTheme(ThemeManager.types.LIGHT);
	    }
	});

	Main.childContextTypes = {
	    muiTheme: React.PropTypes.object
	};

	module.exports = Main;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Main.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var React = __webpack_require__(274);
	var PureRenderMixin = React.addons.PureRenderMixin;
	var StylePropable = __webpack_require__(272);
	var Colors = __webpack_require__(296);
	var CheckIcon = __webpack_require__(428);
	var ListItem = __webpack_require__(385);

	var MenuItem = React.createClass({
	  displayName: 'MenuItem',

	  mixins: [PureRenderMixin, StylePropable],

	  contextTypes: {
	    muiTheme: React.PropTypes.object
	  },

	  propTypes: {
	    checked: React.PropTypes.bool,
	    desktop: React.PropTypes.bool,
	    disabled: React.PropTypes.bool,
	    innerDivStyle: React.PropTypes.object,
	    insetChildren: React.PropTypes.bool,
	    focusState: React.PropTypes.oneOf(['none', 'focused', 'keyboard-focused']),
	    leftIcon: React.PropTypes.element,
	    rightIcon: React.PropTypes.element,
	    secondaryText: React.PropTypes.node,
	    value: React.PropTypes.string
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      focusState: 'none'
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this._applyFocusState();
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    this._applyFocusState();
	  },

	  render: function render() {
	    var _props = this.props;
	    var checked = _props.checked;
	    var children = _props.children;
	    var desktop = _props.desktop;
	    var disabled = _props.disabled;
	    var focusState = _props.focusState;
	    var innerDivStyle = _props.innerDivStyle;
	    var insetChildren = _props.insetChildren;
	    var leftIcon = _props.leftIcon;
	    var rightIcon = _props.rightIcon;
	    var secondaryText = _props.secondaryText;
	    var style = _props.style;
	    var value = _props.value;

	    var other = _objectWithoutProperties(_props, ['checked', 'children', 'desktop', 'disabled', 'focusState', 'innerDivStyle', 'insetChildren', 'leftIcon', 'rightIcon', 'secondaryText', 'style', 'value']);

	    var disabledColor = this.context.muiTheme.palette.disabledColor;
	    var textColor = this.context.muiTheme.palette.textColor;
	    var leftIndent = desktop ? 64 : 72;
	    var sidePadding = desktop ? 24 : 16;

	    var styles = {
	      root: {
	        color: disabled ? disabledColor : textColor,
	        lineHeight: desktop ? '32px' : '48px',
	        fontSize: desktop ? 15 : 16,
	        whiteSpace: 'nowrap'
	      },

	      innerDivStyle: {
	        paddingLeft: leftIcon || insetChildren || checked ? leftIndent : sidePadding,
	        paddingRight: sidePadding,
	        paddingBottom: 0,
	        paddingTop: 0
	      },

	      secondaryText: {
	        float: 'right'
	      },

	      leftIconDesktop: {
	        padding: 0,
	        left: 24,
	        top: 4
	      },

	      rightIconDesktop: {
	        padding: 0,
	        right: 24,
	        top: 4,
	        fill: Colors.grey600
	      }
	    };

	    var mergedRootStyles = this.mergeStyles(styles.root, style);
	    var mergedInnerDivStyles = this.mergeStyles(styles.innerDivStyle, innerDivStyle);

	    //Left Icon
	    var leftIconElement = leftIcon ? leftIcon : checked ? React.createElement(CheckIcon, null) : null;
	    if (leftIconElement && desktop) {
	      var mergedLeftIconStyles = this.mergeStyles(styles.leftIconDesktop, leftIconElement.props.style);
	      leftIconElement = React.cloneElement(leftIconElement, { style: mergedLeftIconStyles });
	    }

	    //Right Icon
	    var rightIconElement = undefined;
	    if (rightIcon) {
	      var mergedRightIconStyles = desktop ? this.mergeStyles(styles.rightIconDesktop, rightIcon.props.style) : null;
	      rightIconElement = React.cloneElement(rightIcon, { style: mergedRightIconStyles });
	    }

	    //Secondary Text
	    var secondaryTextElement = undefined;
	    if (secondaryText) {
	      var secondaryTextIsAnElement = React.isValidElement(secondaryText);
	      var mergedSecondaryTextStyles = secondaryTextIsAnElement ? this.mergeStyles(styles.secondaryText, secondaryText.props.style) : null;

	      secondaryTextElement = secondaryTextIsAnElement ? React.cloneElement(secondaryText, { style: mergedSecondaryTextStyles }) : React.createElement(
	        'div',
	        { style: styles.secondaryText },
	        secondaryText
	      );
	    }

	    return React.createElement(
	      ListItem,
	      _extends({}, other, {
	        disabled: disabled,
	        innerDivStyle: mergedInnerDivStyles,
	        insetChildren: insetChildren,
	        leftIcon: leftIconElement,
	        ref: 'listItem',
	        rightIcon: rightIconElement,
	        style: mergedRootStyles }),
	      children,
	      secondaryTextElement
	    );
	  },

	  _applyFocusState: function _applyFocusState() {
	    this.refs.listItem.applyFocusState(this.props.focusState);
	  }
	});

	module.exports = MenuItem;

/***/ },
/* 428 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(274);
	var PureRenderMixin = React.addons.PureRenderMixin;
	var SvgIcon = __webpack_require__(312);

	var NavigationCheck = React.createClass({
	  displayName: 'NavigationCheck',

	  mixins: [PureRenderMixin],

	  render: function render() {
	    return React.createElement(
	      SvgIcon,
	      this.props,
	      React.createElement('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' })
	    );
	  }

	});

	module.exports = NavigationCheck;

/***/ },
/* 429 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);

	var _require = __webpack_require__(270);

	var ClearFix = _require.ClearFix;
	var Mixins = _require.Mixins;
	var Styles = _require.Styles;
	var StylePropable = Mixins.StylePropable;
	var StyleResizable = Mixins.StyleResizable;

	var DesktopGutter = Styles.Spacing.desktopGutter;

	var FullWidthSection = React.createClass({
	    displayName: 'FullWidthSection',

	    mixins: [StylePropable, StyleResizable],

	    propTypes: {
	        'useContent': React.PropTypes.bool,
	        'contentType': React.PropTypes.string,
	        'contentStyle': React.PropTypes.object
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            useContent: false,
	            contentType: 'div'
	        };
	    },

	    getStyles: function getStyles() {
	        return {
	            root: {
	                padding: DesktopGutter + 'px',
	                boxSizing: 'border-box'
	            },
	            content: {
	                maxWidth: '1200px',
	                margin: '0 auto'
	            },
	            rootWhenSmall: {
	                paddingTop: DesktopGutter * 2 + 'px',
	                paddingBottom: DesktopGutter * 2 + 'px'
	            },
	            rootWhenLarge: {
	                paddingTop: DesktopGutter * 3 + 'px',
	                paddingBottom: DesktopGutter * 3 + 'px'
	            }
	        };
	    },

	    render: function render() {
	        var styles = this.getStyles();
	        var _props = this.props;
	        var style = _props.style;
	        var useContent = _props.useContent;
	        var contentType = _props.contentType;
	        var contentStyle = _props.contentStyle;

	        var content;

	        if (useContent) {
	            content = React.createElement(contentType, { style: this.mergeAndPrefix(styles.content, contentStyle) }, this.props.children);
	        } else {
	            content = this.props.children;
	        }

	        return React.createElement(
	            ClearFix,
	            { style: this.mergeAndPrefix(styles.root, style, this.isDeviceSize(StyleResizable.statics.Sizes.SMALL) && styles.rootWhenSmall, this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && styles.rootWhenLarge) },
	            content
	        );
	    }
	});

	module.exports = FullWidthSection;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "full-width-section.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 430 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isReactClassish = __webpack_require__(431),
	    isReactElementish = __webpack_require__(432);

	function makeExportsHot(m, React) {
	  if (isReactElementish(m.exports, React)) {
	    // React elements are never valid React classes
	    return false;
	  }

	  var freshExports = m.exports,
	      exportsReactClass = isReactClassish(m.exports, React),
	      foundReactClasses = false;

	  if (exportsReactClass) {
	    m.exports = m.makeHot(m.exports, '__MODULE_EXPORTS');
	    foundReactClasses = true;
	  }

	  for (var key in m.exports) {
	    if (!Object.prototype.hasOwnProperty.call(freshExports, key)) {
	      continue;
	    }

	    if (exportsReactClass && key === 'type') {
	      // React 0.12 also puts classes under `type` property for compat.
	      // Skip to avoid updating twice.
	      continue;
	    }

	    var value;
	    try {
	      value = freshExports[key];
	    } catch (err) {
	      continue;
	    }

	    if (!isReactClassish(value, React)) {
	      continue;
	    }

	    if (Object.getOwnPropertyDescriptor(m.exports, key).writable) {
	      m.exports[key] = m.makeHot(value, '__MODULE_EXPORTS_' + key);
	      foundReactClasses = true;
	    } else {
	      console.warn("Can't make class " + key + " hot reloadable due to being read-only. To fix this you can try two solutions. First, you can exclude files or directories (for example, /node_modules/) using 'exclude' option in loader configuration. Second, if you are using Babel, you can enable loose mode for `es6.modules` using the 'loose' option. See: http://babeljs.io/docs/advanced/loose/ and http://babeljs.io/docs/usage/options/");
	    }
	  }

	  return foundReactClasses;
	}

	module.exports = makeExportsHot;


/***/ },
/* 431 */
/***/ function(module, exports) {

	function hasRender(Class) {
	  var prototype = Class.prototype;
	  if (!prototype) {
	    return false;
	  }

	  return typeof prototype.render === 'function';
	}

	function descendsFromReactComponent(Class, React) {
	  if (!React.Component) {
	    return false;
	  }

	  var Base = Object.getPrototypeOf(Class);
	  while (Base) {
	    if (Base === React.Component) {
	      return true;
	    }

	    Base = Object.getPrototypeOf(Base);
	  }

	  return false;
	}

	function isReactClassish(Class, React) {
	  if (typeof Class !== 'function') {
	    return false;
	  }

	  // React 0.13
	  if (hasRender(Class) || descendsFromReactComponent(Class, React)) {
	    return true;
	  }

	  // React 0.12 and earlier
	  if (Class.type && hasRender(Class.type)) {
	    return true;
	  }

	  return false;
	}

	module.exports = isReactClassish;

/***/ },
/* 432 */
/***/ function(module, exports, __webpack_require__) {

	var isReactClassish = __webpack_require__(431);

	function isReactElementish(obj, React) {
	  if (!obj) {
	    return false;
	  }

	  return Object.prototype.toString.call(obj.props) === '[object Object]' &&
	         isReactClassish(obj.type, React);
	}

	module.exports = isReactElementish;

/***/ },
/* 433 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var AppConstants = __webpack_require__(438);
	var EventEmitter = __webpack_require__(439).EventEmitter;
	var assign = __webpack_require__(440);
	var jwtDecode = __webpack_require__(441);

	var ActionTypes = AppConstants.ActionTypes;
	var CHANGE_EVENT = 'change';

	// Load an access token from the auth storage, you might want to implement
	// a 'remember me' using localStorage
	var _isLoggedIn = false;
	var _currentUser = { userId: '', roles: ['anonymous'] };
	var _rememberMe = false;
	var _accessToken = '';
	var _refreshToken = '';
	var _error = "";

	var AuthStore = assign({}, EventEmitter.prototype, {

	    emitChange: function emitChange() {
	        this.emit(CHANGE_EVENT);
	    },

	    addChangeListener: function addChangeListener(callback) {
	        this.on(CHANGE_EVENT, callback);
	    },

	    removeChangeListener: function removeChangeListener(callback) {
	        this.removeListener(CHANGE_EVENT, callback);
	    },

	    isLoggedIn: function isLoggedIn() {
	        return _isLoggedIn;
	    },

	    getAccessToken: function getAccessToken() {
	        return _accessToken;
	    },

	    getRefreshToken: function getRefreshToken() {
	        return _refreshToken;
	    },

	    getRoles: function getRoles() {
	        return _currentUser.roles;
	    },

	    getUserId: function getUserId() {
	        return _currentUser.userId;
	    },

	    getRememberMe: function getRememberMe() {
	        return _rememberMe;
	    },

	    getError: function getError() {
	        return _error;
	    }

	});

	AuthStore.dispatchToken = AppDispatcher.register(function (payload) {
	    console.log('Authstore received payload', payload);
	    var data = payload.action;

	    switch (data.type) {
	        case ActionTypes.SIGNUP_REQUEST:
	        case ActionTypes.SIGNUP_RESPONSE:
	            AuthStore.emitChange();
	            break;
	        case ActionTypes.LOGIN_REQUEST:
	            console.log("Authstore received Login Request", payload);
	            // This is an indicator if refresh token will be used to get another access token after access token is expired.
	            _rememberMe = data.rememberMe;
	            break;

	        case ActionTypes.LOGIN_RESPONSE:
	            console.log("Authstore received Login Response", payload);
	            if (data.json) {
	                // Successfully logged in and get access token back. If remember me is checked, then a refresh token is returned as well.
	                _isLoggedIn = true;
	                // Parse the Json Token and get uesr object which contains userId and roles.
	                //_currentUser = JSON.parse(base64.base64Decode(payload.json.accessToken.split('.')[1])).user;
	                // Save authorizationData object into local storage so it can last longer than the browser session. local storage will
	                // fall back to Cookie if HTML5 is not supported by the browser.
	                _accessToken = data.json.accessToken;
	                localStorage.setItem('accessToken', _accessToken);
	                console.log('_accessToken', _accessToken);
	                var jwt = jwtDecode(_accessToken);
	                console.log('jwt', jwt);
	                _currentUser = jwt.user;

	                if (_rememberMe) {
	                    _refreshToken = data.json.refreshToken;
	                    localStorage.setItem('refreshToken', _refreshToken);
	                }
	                // Redirect to the attempted url if the login page was redirected upon 401 and 403 error.
	                // httpBuffer.redirectToAttemptedUrl();
	            }
	            if (data.error) {
	                _error = data.error.error;
	            }
	            AuthStore.emitChange();
	            break;
	        case ActionTypes.REFRESH:
	            console.log('refreshed access token is saved');
	            _accessToken = data.accessToken;
	            localStorage.setItem('accessToken', _accessToken);
	            break;

	        case ActionTypes.LOGOUT:
	            console.log('logout  action type in AuthStore');
	            _isLoggedIn = false;
	            _accessToken = null;
	            localStorage.removeItem('accessToken');
	            _rememberMe = false;
	            _refreshToken = null;
	            localStorage.removeItem('refreshToken');
	            AuthStore.emitChange();
	            break;
	        case ActionTypes.INIT:
	            console.log('init is called');
	            var accessToken = localStorage.getItem('accessToken');
	            if (accessToken) {
	                _isLoggedIn = true;
	                _accessToken = accessToken;
	                var jwt = jwtDecode(_accessToken);
	                console.log('jwt', jwt);
	                _currentUser = jwt.user;
	            }
	            var refreshToken = localStorage.getItem('refreshToken');
	            if (refreshToken) {
	                _rememberMe = true;
	                _refreshToken = refreshToken;
	            }
	            AuthStore.emitChange();
	            break;

	        default:
	    }

	    return true;
	});

	module.exports = AuthStore;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "AuthStore.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 434 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var Dispatcher = __webpack_require__(435).Dispatcher;
	var assign = __webpack_require__(83);

	var AppDispatcher = assign(new Dispatcher(), {
	    handleAction: function handleAction(action) {
	        this.dispatch({
	            source: 'APP_ACTION', // not sure why this exists... flux documentation suggests a single dispatcher per application.
	            action: action
	        });
	    }
	});

	module.exports = AppDispatcher;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "AppDispatcher.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/*
	 * Copyright 2015 Network New Technologies Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	'use strict';

	var keyMirror = __webpack_require__(75);

	var host = "example";

	module.exports = {
	    APIRoot: '/api/rs',
	    ClientId: 'example@Browser',
	    host: host,

	    ChangeEvents: {
	        ROUTE_CHANGE_EVENT: 'routeChange',
	        BLOG_CHANGE_EVENT: 'blogChange',
	        MENU_CHANGE_EVENT: 'menuChange'
	    },

	    ActionTypes: keyMirror({
	        // Routes
	        REDIRECT: null,
	        SIGNUP_REQUEST: null,
	        SIGNUP_RESPONSE: null,
	        INIT: null,
	        LOGIN_REQUEST: null,
	        LOGIN_RESPONSE: null,
	        LOGOUT: null,
	        REFRESH: null,
	        MENU_RESPONSE: null,
	        BLOG_RESPONSE: null
	    }),

	    APIEndpoints: {
	        SIGNIN: {
	            category: 'user',
	            name: 'signInUser',
	            readOnly: false
	        },
	        REGISTRATION: {},
	        GETMENU: {
	            category: 'menu',
	            name: 'getMenu',
	            readOnly: true,
	            data: {
	                host: host
	            }
	        }
	    }

	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "AppConstants.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);

	var _require = __webpack_require__(270);

	var Styles = _require.Styles;
	var FlatButton = _require.FlatButton;
	var EnhancedButton = _require.EnhancedButton;
	var IconButton = _require.IconButton;

	var Colors = Styles.Colors;

	var _require2 = __webpack_require__(225);

	var Router = _require2.Router;
	var Link = _require2.Link;

	var InlineUser = React.createClass({
	    displayName: 'InlineUser',

	    render: function render() {
	        var styles = this.getStyles();
	        return React.createElement(
	            Link,
	            { to: "/u/" + this.props.id },
	            React.createElement(FlatButton, { label: this.props.id, style: styles.inlineUser, labelStyle: styles.inlineUserLabel })
	        );
	    },
	    getStyles: function getStyles() {
	        var lightBlue = Colors.lightBlue300;
	        return {
	            inlineUser: {
	                color: lightBlue,
	                backgroundColor: Colors.transparent,
	                padding: 0,
	                margin: 0,
	                border: 0,
	                minWidth: 0
	            },
	            inlineUserLabel: {
	                padding: 0,
	                margin: 0,
	                border: 0,
	                minWidth: 0
	            }
	        };
	    }
	});

	module.exports = InlineUser;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "InlineUser.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 446 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(447);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(449)(content, {});
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		module.hot.accept(447, function() {
			var newContent = __webpack_require__(447);
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 447 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(448)();
	exports.push([module.id, "/* Global CSS */\nhtml {\n    font-family: 'Roboto', sans-serif;\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%\n}\n\nbody {\n    font-size: 15px;\n    line-height: 20px;\n    margin: 0\n}", ""]);

/***/ },
/* 448 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	// 
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(var i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 449 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 450 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var Router = __webpack_require__(225);

	var _require = __webpack_require__(270);

	var MenuItem = _require.MenuItem;
	var LeftNav = _require.LeftNav;
	var Styles = _require.Styles;

	var ThemeManager = Styles.ThemeManager();
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var MenuStore = __webpack_require__(451);
	var MenuActions = __webpack_require__(453);

	var menu = [{ type: MenuItem.Types.SUBHEADER, text: 'Component Examples' }, { route: 'blogs', text: 'Blogs' }, { route: 'forum', text: 'Forum' }, { route: 'news', text: 'News' }, { route: 'user-example', text: 'User Example' },
	/*
	{ type: MenuItem.Types.SUBHEADER, text: 'User'},
	{ route: 'login', text: 'Login'},
	{ route: 'logout', text: 'Logout'},
	{ route: 'signup', text: 'Sign up'},
	*/
	{ type: MenuItem.Types.SUBHEADER, text: 'NetworkNT' }, {
	    type: MenuItem.Types.LINK,
	    payload: 'https://github.com/networknt',
	    text: 'GitHub'
	}];

	var LeftNavMenu = React.createClass({
	    displayName: 'LeftNavMenu',

	    componentWillMount: function componentWillMount() {
	        ThemeManager.setComponentThemes({
	            menuSubheader: {
	                textColor: Colors.green300
	            }
	        });
	    },

	    componentDidMount: function componentDidMount() {
	        MenuStore.addChangeListener(this._onMenuChange);
	        MenuActions.getMenu();
	    },

	    _onMenuChange: function _onMenuChange() {
	        console.log('LeftNavMenu._onMenuChange');
	        // TODO. Menu items would now be set to MenuStore.getMenu(); however format is not currently conducive to this.
	    },

	    getStyles: function getStyles() {
	        return {
	            root: {
	                cursor: 'pointer',
	                //.mui-font-style-headline
	                fontSize: '24px',
	                color: Typography.textFullWhite,
	                lineHeight: Spacing.desktopKeylineIncrement + 'px',
	                fontWeight: Typography.fontWeightLight,
	                backgroundColor: Colors.green300,
	                paddingLeft: Spacing.desktopGutter,
	                paddingTop: '0px',
	                marginBottom: '0px'
	            },
	            leftNav: {
	                ".SubheaderMenuItem backgroundColor": Colors.green300
	            }

	        };
	    },

	    render: function render() {
	        var style = this.getStyles();
	        var header = React.createElement(
	            'div',
	            { style: style.root, onTouchTap: this.onHeaderClick },
	            'NetworkNT'
	        );

	        return React.createElement(LeftNav, {
	            ref: 'leftNav',
	            style: style.leftNav,
	            docked: false,
	            isInitiallyOpen: false,
	            header: header,
	            menuItems: menu,
	            selectedIndex: this.getSelectedIndex(),
	            onChange: this.onLeftNavChange });
	    },

	    toggle: function toggle() {
	        this.refs.leftNav.toggle();
	    },

	    getSelectedIndex: function getSelectedIndex() {
	        var currentItem;
	        for (var i = menu.length - 1; i >= 0; i--) {
	            currentItem = menu[i];
	            if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
	        }
	    },

	    onLeftNavChange: function onLeftNavChange(e, key, payload) {
	        this.context.router.transitionTo(payload.route);
	    },

	    onHeaderClick: function onHeaderClick() {
	        this.context.router.transitionTo('root');
	        this.refs.leftNav.close();
	    },

	    getChildContext: function getChildContext() {
	        return {
	            muiTheme: ThemeManager.getCurrentTheme()
	        };
	    }

	});

	LeftNavMenu.contextTypes = {
	    router: React.PropTypes.func
	};

	LeftNavMenu.childContextTypes = {
	    muiTheme: React.PropTypes.object
	};

	module.exports = LeftNavMenu;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "LeftNavMenu.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 451 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var EventEmitter = __webpack_require__(439).EventEmitter;
	var AppConstants = __webpack_require__(438);
	var _ = __webpack_require__(452);

	var _menu = [];

	var MenuStore = _.extend({}, EventEmitter.prototype, {
	    getMenu: function getMenu() {
	        return _menu;
	    },

	    emitChange: function emitChange() {
	        this.emit(AppConstants.ChangeEvents.MENU_CHANGE_EVENT);
	    },

	    addChangeListener: function addChangeListener(callback) {
	        this.on(AppConstants.ChangeEvents.MENU_CHANGE_EVENT, callback);
	    },

	    removeChangeListener: function removeChangeListener(callback) {
	        this.removeListener(AppConstants.ChangeEvents.MENU_CHANGE_EVENT, callback);
	    }

	});

	AppDispatcher.register(function (payload) {
	    var action = payload.action;
	    console.log("MenuStore received payload: ", payload);
	    if (action == null) return;
	    switch (action.type) {
	        case AppConstants.ActionTypes.MENU_RESPONSE:
	            console.log("MenuStore received Menu:", action.json.out_Own);
	            _menu = action.json.out_Own;
	            MenuStore.emitChange();
	            break;
	        default:
	            return true;
	    }
	    return true;
	});

	module.exports = MenuStore;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "MenuStore.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 452 */,
/* 453 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var AppConstants = __webpack_require__(438);
	var $ = __webpack_require__(454);

	var ActionTypes = AppConstants.ActionTypes;

	module.exports = {

	    getMenu: function getMenu() {

	        $.ajax({
	            type: 'POST',
	            url: 'http://networknt.com:8080/api/rs',
	            data: JSON.stringify({
	                category: 'menu',
	                name: 'getMenu',
	                readOnly: true,
	                "data": {
	                    host: AppConstants.host
	                }
	            }),
	            contentType: 'application/json',
	            dataType: 'json',
	            error: function error(jqXHR, status, _error) {
	                console.log('MenuActions.getMenu error', _error);
	                /*
	                var errorText = jqXHR.responseText;
	                AppDispatcher.handleAction({
	                    type: ActionTypes.SIGNUP_RESPONSE,
	                    json: null,
	                    error: errorText
	                });
	                */
	            },
	            success: function success(result, status, xhr) {
	                console.log("MenuActions.getMenu success", result);
	                AppDispatcher.handleAction({
	                    type: ActionTypes.MENU_RESPONSE,
	                    json: result,
	                    error: null
	                });
	            }
	        });
	    }
	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "MenuActions.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 454 */,
/* 455 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);
	var InlineUser = __webpack_require__(445);
	var marked = __webpack_require__(456);

	var UserExample = React.createClass({
	    displayName: 'UserExample',

	    componentWillMount: function componentWillMount() {
	        marked.setOptions({
	            renderer: new marked.Renderer(),
	            gfm: true,
	            tables: true,
	            breaks: true,
	            pedantic: false,
	            sanitize: true,
	            smartLists: true,
	            smartypants: false
	        });
	    },
	    getInitialState: function getInitialState() {
	        return {
	            markedText: "#NetworkNT - Inline User Example# \n" + "This is an example where we pass the userId of an " + "example user as it would appear when referenced inline with some text.\n" + "This is the user <InlineUser id=\"nick\" /> who has id 'nick'. It's a work in progress... it should look like:"
	        };
	    },
	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            React.createElement('div', { dangerouslySetInnerHTML: {
	                    __html: this.processText(this.state.markedText)
	                } }),
	            React.createElement(InlineUser, { id: 'nick' })
	        );
	    },
	    processText: function processText(text) {
	        return marked(text, { sanitize: true });
	    }
	});

	module.exports = UserExample;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "UserExample.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 456 */,
/* 457 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	"use strict";

	var React = __webpack_require__(123);

	var UserProfile = React.createClass({
	    displayName: "UserProfile",

	    getInitialState: function getInitialState() {
	        return {
	            userId: this.props.params.userId != null ? this.props.params.userId : "Example"
	        };
	    },
	    render: function render() {
	        return React.createElement(
	            "span",
	            null,
	            "User Profile - Hello ",
	            this.state.userId,
	            "!"
	        );
	    }
	});

	module.exports = UserProfile;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "UserProfile.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 458 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var Router = __webpack_require__(225);

	var _require = __webpack_require__(270);

	var RaisedButton = _require.RaisedButton;
	var Styles = _require.Styles;

	var FullWidthSection = __webpack_require__(429);
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var Home = React.createClass({
	    displayName: 'Home',

	    render: function render() {
	        var styles = this.getStyles();
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                FullWidthSection,
	                { style: styles.root },
	                React.createElement(
	                    'div',
	                    { style: styles.tagline },
	                    React.createElement(
	                        'h1',
	                        { style: styles.h1 },
	                        'NetworkNT - Components Example'
	                    ),
	                    React.createElement(
	                        'h2',
	                        { style: styles.h2 },
	                        'Please select any page from the menu in the top left corner to view the example.'
	                    )
	                )
	            ),
	            React.createElement(
	                FullWidthSection,
	                { style: styles.githubSection },
	                React.createElement(
	                    'h2',
	                    { style: styles.githubSectionh2 },
	                    'To learn more about this project, Check out our repo!'
	                ),
	                React.createElement(RaisedButton, { label: 'GitHub', primary: true, linkButton: true, href: 'https://github.com/networknt' })
	            )
	        );
	    },
	    getStyles: function getStyles() {
	        return {
	            root: {
	                backgroundColor: Colors.green400,
	                overflow: 'hidden',
	                width: '100%'
	            },
	            tagline: {
	                margin: '16px auto 0 auto',
	                textAlign: 'center',
	                maxWidth: '575px'
	            },
	            h1: {
	                color: Colors.darkWhite,
	                fontWeight: Typography.fontWeightLight
	            },
	            h2: {
	                //.mui-font-style-title
	                fontSize: '20px',
	                lineHeight: '28px',
	                paddingTop: '19px',
	                marginBottom: '13px',
	                letterSpacing: '0',
	                color: Colors.darkWhite,
	                fontWeight: Typography.fontWeightLight
	            },
	            githubSection: {
	                backgroundColor: Colors.grey200,
	                textAlign: 'center'
	            },
	            githubSectionh2: {
	                color: Colors.grey900,
	                fontSize: '20px',
	                lineHeight: '28px',
	                paddingTop: '19px',
	                marginBottom: '13px',
	                letterSpacing: '0',
	                fontWeight: Typography.fontWeightLight
	            }
	        };
	    }
	});

	module.exports = Home;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Home.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 459 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);

	var Forum = React.createClass({
	    displayName: 'Forum',

	    componentWillMount: function componentWillMount() {},
	    getInitialState: function getInitialState() {
	        return {};
	    },
	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            'Forum'
	        );
	    }
	});

	module.exports = Forum;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Forum.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 460 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);

	var News = React.createClass({
	    displayName: 'News',

	    componentWillMount: function componentWillMount() {},
	    getInitialState: function getInitialState() {
	        return {};
	    },
	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            'News'
	        );
	    }
	});

	module.exports = News;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "News.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 461 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);

	var BlogRow = __webpack_require__(462);

	var _require = __webpack_require__(270);

	var List = _require.List;
	var ListItem = _require.ListItem;

	var Router = __webpack_require__(225);
	var RouteHandler = Router.RouteHandler;

	var BlogRoot = React.createClass({
	    displayName: 'BlogRoot',

	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            React.createElement(RouteHandler, null)
	        );
	    }
	});

	module.exports = BlogRoot;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogRoot.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 462 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);

	var _require = __webpack_require__(270);

	var ListItem = _require.ListItem;
	var Styles = _require.Styles;

	var BlogActions = __webpack_require__(463);
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var BlogRow = React.createClass({
	    displayName: 'BlogRow',

	    componentDidMount: function componentDidMount() {
	        console.log("BlogRow props:", this.props);
	    },
	    render: function render() {
	        return this._createItems(this.props.blog);
	    },

	    _onTouchTap: function _onTouchTap() {
	        console.log("Going to blog", this.props.blog);
	        BlogActions.gotoBlog(this.props.blog);
	    },

	    _createItems: function _createItems(blogs) {
	        var children;
	        var styles = this.getStyles();
	        if (blogs.out_Own) {
	            children = blogs.out_Own.map((function (child) {
	                return this._createItems(child);
	            }).bind(this));
	        }
	        return React.createElement(
	            ListItem,
	            {

	                primaryText: this.props.blog.blogId, secondaryText: this.props.blog.description, onTouchTap: this._onTouchTap },
	            children
	        );
	    },

	    getStyles: function getStyles() {
	        return {
	            primaryTextStyle: {
	                fontSize: '20px',
	                lineHeight: '28px',
	                paddingTop: '19px',
	                marginBottom: '13px',
	                letterSpacing: '0',
	                color: Colors.darkWhite,
	                fontWeight: Typography.fontWeightLight
	            },
	            secondaryText: {}
	        };
	    }

	});

	module.exports = BlogRow;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogRow.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 463 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var BlogConstants = __webpack_require__(464);
	var AppConstants = __webpack_require__(438);
	var BlogData = __webpack_require__(465);
	var $ = __webpack_require__(454);

	var BlogActions = {

	    getBlogs: function getBlogs() {
	        $.ajax({
	            type: 'POST',
	            url: 'http://networknt.com:8080/api/rs',
	            data: JSON.stringify({
	                category: 'blog',
	                name: 'getBlog',
	                readOnly: true,
	                "data": {
	                    host: AppConstants.host
	                }
	            }),
	            contentType: 'application/json',
	            dataType: 'json',
	            error: function error(jqXHR, status, _error) {
	                console.log('BlogActions.getBlogs error', _error);
	            },
	            success: function success(result, status, xhr) {
	                console.log("BlogActions.getBlogs success", result);
	                AppDispatcher.handleAction({
	                    type: AppConstants.ActionTypes.MENU_RESPONSE,
	                    json: result,
	                    error: null
	                });
	            }
	        });
	    },

	    initBlogs: function initBlogs() {
	        return BlogData.init();
	    },

	    receiveBlogs: function receiveBlogs() {
	        var data = JSON.parse(localStorage.getItem('blogs'));
	        if (data == null) {
	            data = this.initBlogs();
	        }
	        AppDispatcher.handleAction({
	            actionType: BlogConstants.RECEIVE_BLOGS,
	            data: data
	        });
	    },

	    /*
	    TODO: Actually use blogId for starters...
	     */
	    receiveBlogPosts: function receiveBlogPosts(blogId) {
	        var data = JSON.parse(localStorage.getItem('blogPosts'));
	        if (data == null) {
	            data = this.initBlogs();
	        }
	        AppDispatcher.handleAction({
	            actionType: BlogConstants.RECEIVE_BLOG_POSTS,
	            data: data
	        });
	    },

	    gotoBlog: function gotoBlog(blog) {
	        AppDispatcher.handleAction({
	            actionType: AppConstants.ActionTypes.REDIRECT,
	            route: 'blogView',
	            data: blog
	        });
	    },

	    addBlog: function addBlog(blogId, update) {
	        AppDispatcher.handleAction({
	            actionType: BlogConstants.BLOG_ADD,
	            blogId: blogId,
	            update: update
	        });
	    },

	    removeBlog: function removeBlog(blogId) {
	        AppDispatcher.handleAction({
	            actionType: BlogConstants.BLOG_REMOVE,
	            blogId: blogId
	        });
	    },

	    updateBlog: function updateBlog(blogId, updateData) {
	        AppDispatcher.handleAction({
	            actionType: BlogConstants.BLOG_UPDATE,
	            blogId: blogId,
	            updateData: updateData
	        });
	    }

	};

	module.exports = BlogActions;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogActions.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 464 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var keyMirror = __webpack_require__(75);

	module.exports = keyMirror({
	    BLOG_ADD: null,
	    BLOG_REMOVE: null,
	    BLOG_UPDATE: null,
	    RECEIVE_BLOGS: null,
	    RECEIVE_BLOG_POSTS: null
	});

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogConstants.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 465 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	"use strict";

	module.exports = {
	    init: function init() {
	        localStorage.clear();
	        localStorage.setItem('blogs', JSON.stringify([{
	            "@rid": "#33:12",
	            "host": "example",
	            "description": "New and improved??",
	            "blogId": "The new blog ID",
	            "createDate": "2015-05-22T00:22:37.607",
	            "$$hashKey": "object:241"
	        }, {
	            "@rid": "#33:1",
	            "host": "example",
	            "description": "sdgasdgag",
	            "blogId": "asdga",
	            "createDate": "2015-05-02T12:52:20.121",
	            "out_HasPost": ["#36:9", "#36:10", "#36:11"],
	            "out_Own": [{
	                "@rid": "#33:8",
	                "host": "example",
	                "description": "fgjdfgjdj",
	                "blogId": "hdfgjd",
	                "createDate": "2015-05-02T15:57:28.789",
	                "in_Own": ["#33:1"],
	                "out_Own": [{
	                    "@rid": "#33:9",
	                    "host": "example",
	                    "description": "dfhsdfhsdf",
	                    "blogId": "dgsdfhs",
	                    "createDate": "2015-05-02T19:15:53.034",
	                    "in_Own": ["#33:8"],
	                    "out_Own": [{
	                        "@rid": "#33:11",
	                        "host": "example",
	                        "description": "asdgasdg",
	                        "blogId": "sdfhsdfhs",
	                        "createDate": "2015-05-02T21:22:25.813",
	                        "in_Own": ["#33:9"]
	                    }]
	                }, {
	                    "@rid": "#33:10",
	                    "host": "example",
	                    "description": "dgasdgasdg",
	                    "blogId": "asdsdfhgasdg",
	                    "createDate": "2015-05-02T21:19:58.117",
	                    "in_Own": ["#33:8"]
	                }],
	                "blog": {
	                    "@rid": "#33:1",
	                    "host": "example",
	                    "description": "sdgasdgag",
	                    "blogId": "asdga",
	                    "createDate": "2015-05-02T12:52:20.121",
	                    "out_HasPost": ["#36:9", "#36:10", "#36:11"]
	                }
	            }],
	            "$$hashKey": "object:242"
	        }, {
	            "@rid": "#33:2",
	            "host": "example",
	            "description": "asdgasdg",
	            "blogId": "asdgasdg",
	            "createDate": "2015-05-02T12:52:23.067",
	            "$$hashKey": "object:243"
	        }, {
	            "@rid": "#33:3",
	            "host": "example",
	            "description": "sdgasdga",
	            "blogId": "asdgasdga",
	            "createDate": "2015-05-02T12:52:25.675",
	            "$$hashKey": "object:244"
	        }, {
	            "@rid": "#33:7",
	            "host": "example",
	            "description": "dfgjdfgjdj",
	            "blogId": "dfgjdfgjdfgj",
	            "createDate": "2015-05-02T12:52:43.251",
	            "$$hashKey": "object:245"
	        }, {
	            "@rid": "#33:5",
	            "host": "example",
	            "description": "jfdgdfjhdfgjh",
	            "blogId": "dfgjdsdfsdfh",
	            "createDate": "2015-05-02T12:52:36.714",
	            "$$hashKey": "object:246"
	        }]));
	        localStorage.setItem('blogPosts', JSON.stringify([{
	            "createUserId": "stevehu",
	            "postId": "GT3ZmMIxTxiE8WzGudooQA",
	            "createRid": "#14:0",
	            "rid": "#36:11",
	            "title": "TEst",
	            "content": "This is the post - Edited -5/21/2015",
	            "parentId": "asdga",
	            "createDate": "2015-05-02T14:20:13.512"
	        }, {
	            "createUserId": "stevehu",
	            "postId": "uGRKOudDR4e3EGwrNYi6cQ",
	            "createRid": "#14:0",
	            "rid": "#36:10",
	            "title": "jdfgjdfgjd",
	            "content": "fgjdfgj",
	            "parentId": "asdga",
	            "createDate": "2015-05-02T12:57:12.315"
	        }, {
	            "createUserId": "stevehu",
	            "postId": "FY4pUJ1CSzSURhihDlLg5g",
	            "createRid": "#14:0",
	            "rid": "#36:9",
	            "title": "sdfhsdfhsdf",
	            "content": "hsdfhsdfhsdf",
	            "parentId": "asdga",
	            "createDate": "2015-05-02T12:55:51.351"
	        }]));
	        return JSON.parse(localStorage.getItem('blogs'));
	    }
	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "MockBlogData.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 466 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);
	var BlogStore = __webpack_require__(467);
	var BlogAction = __webpack_require__(463);
	var BlogRow = __webpack_require__(462);

	var _require = __webpack_require__(270);

	var List = _require.List;
	var ListItem = _require.ListItem;
	var Paper = _require.Paper;
	var Styles = _require.Styles;

	var BlogStore = __webpack_require__(467);
	var BlogAction = __webpack_require__(463);
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var Blogs = React.createClass({
	    displayName: 'Blogs',

	    getInitialState: function getInitialState() {
	        return {
	            blogs: []
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        BlogStore.addChangeListener(this._onChange);
	        BlogAction.getBlogs();
	    },

	    _onChange: function _onChange() {
	        this.setState({
	            blogs: BlogStore.getBlogs()
	        });
	    },

	    render: function render() {
	        var styles = this.getStyles();
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                FullWidthSection,
	                { style: styles.root },
	                React.createElement(
	                    'div',
	                    null,
	                    React.createElement(
	                        'h2',
	                        { style: styles.h2 },
	                        'Blog Component'
	                    )
	                )
	            ),
	            React.createElement(
	                FullWidthSection,
	                { style: styles.blogsSection },
	                React.createElement(
	                    List,
	                    null,
	                    this.state.blogs.map(function (blog) {
	                        return React.createElement(BlogRow, { blog: blog });
	                    })
	                )
	            )
	        );
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        BlogStore.removeChangeListener(this._onChange);
	    },

	    getStyles: function getStyles() {
	        return {
	            root: {
	                backgroundColor: Colors.green400,
	                overflow: 'hidden',
	                width: '100%',
	                textAlign: 'center'
	            },
	            blogsSection: {
	                backgroundColor: Colors.white,
	                textAlign: 'center',
	                display: 'inline-block',
	                width: '100%'
	            },
	            h2: {
	                //.mui-font-style-title
	                fontSize: '20px',
	                lineHeight: '28px',
	                paddingTop: '19px',
	                marginBottom: '13px',
	                letterSpacing: '0',
	                color: Colors.darkWhite,
	                fontWeight: Typography.fontWeightLight
	            }
	        };
	    }

	});

	module.exports = Blogs;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Blogs.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 467 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var EventEmitter = __webpack_require__(439).EventEmitter;
	var BlogConstants = __webpack_require__(464);
	var AppConstants = __webpack_require__(438);
	var _ = __webpack_require__(452);

	var _blogs = [];
	var _blogPosts = [];

	var BlogStore = _.extend({}, EventEmitter.prototype, {
	    getBlogs: function getBlogs() {
	        return _blogs;
	    },

	    getBlogPostsState: function getBlogPostsState() {
	        return {
	            "blogPosts": _blogPosts
	        };
	    },

	    emitChange: function emitChange() {
	        console.log("Emiting change event...");
	        this.emit(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT);
	    },

	    addChangeListener: function addChangeListener(callback) {
	        this.on(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT, callback);
	    },

	    removeChangeListener: function removeChangeListener(callback) {
	        this.removeListener(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT, callback);
	    }

	});

	AppDispatcher.register(function (payload) {
	    var action = payload.action;
	    console.log("BlogStore received payload: ", payload);
	    if (action == null) return;
	    switch (action.actionType) {
	        case BlogConstants.RECEIVE_BLOGS:
	            console.log("BlogStore received BLOGS:", action.data);
	            _blogs = action.data;
	            BlogStore.emitChange();
	            break;
	        case BlogConstants.RECEIVE_BLOG_POSTS:
	            console.log("BlogStore received BLOG_POSTS:", action.data);
	            _blogPosts = action.data;
	            BlogStore.emitChange();
	            break;
	        default:
	            return true;
	    }
	    return true;
	});

	module.exports = BlogStore;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogStore.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 468 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);

	var _require = __webpack_require__(225);

	var Link = _require.Link;

	var FullWidthSection = __webpack_require__(429);
	var BlogStore = __webpack_require__(467);
	var BlogAction = __webpack_require__(463);
	var BlogRow = __webpack_require__(462);

	var _require2 = __webpack_require__(270);

	var List = _require2.List;
	var ListItem = _require2.ListItem;
	var Paper = _require2.Paper;
	var RaisedButton = _require2.RaisedButton;

	var BlogPostsView = __webpack_require__(469);

	var BlogView = React.createClass({
	    displayName: 'BlogView',

	    getInitialState: function getInitialState() {
	        return {
	            blogPosts: []
	        };
	    },
	    getDefaultProps: function getDefaultProps() {
	        blogId: '';
	    },

	    componentDidMount: function componentDidMount() {
	        BlogStore.addChangeListener(this._receivedBlog);
	        BlogAction.receiveBlogPosts(this.props.blogId);
	    },

	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            React.createElement(
	                Link,
	                { to: '/blogs' },
	                React.createElement(RaisedButton, { label: 'Back' })
	            ),
	            React.createElement(BlogPostsView, { blogPosts: this.state.blogPosts })
	        );
	    },
	    _receivedBlog: function _receivedBlog(data) {
	        this.setState(BlogStore.getBlogPostsState());
	    }
	});

	module.exports = BlogView;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogView.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 469 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);

	var _require = __webpack_require__(270);

	var List = _require.List;
	var ListItem = _require.ListItem;
	var Paper = _require.Paper;
	var Avatar = _require.Avatar;
	var Styles = _require.Styles;
	var SvgIcon = _require.SvgIcon;
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	// var {ActionAssignment} = SvgIcon;
	// using leftAvatar={<Avatar icon={<ActionAssignment />}/>} in ListItem causing an error... figure out why.
	var BlogPostsView = React.createClass({
	    displayName: 'BlogPostsView',

	    getDefaultProps: function getDefaultProps() {
	        blogPosts: [];
	    },
	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            React.createElement(
	                Paper,
	                { rounded: true, transitionEnabled: true },
	                React.createElement(
	                    List,
	                    null,
	                    this.props.blogPosts.map(function (post) {
	                        return React.createElement(ListItem, { primaryText: post.title, secondaryText: post.content });
	                    })
	                )
	            )
	        );
	    }
	});

	module.exports = BlogPostsView;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogPostsView.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 470 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);
	var FullWidthSection = __webpack_require__(429);
	var BlogStore = __webpack_require__(467);
	var BlogAction = __webpack_require__(463);

	var BlogPostView = React.createClass({
	    displayName: 'BlogPostView',

	    render: function render() {
	        return React.createElement(
	            FullWidthSection,
	            null,
	            'Blog Post View'
	        );
	    }

	});

	module.exports = BlogPostView;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "BlogPostView.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 471 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var React = __webpack_require__(123);
	var AuthActions = __webpack_require__(472);
	var AuthStore = __webpack_require__(433);
	var ErrorNotice = __webpack_require__(475);

	var _require = __webpack_require__(270);

	var TextField = _require.TextField;
	var RaisedButton = _require.RaisedButton;
	var Paper = _require.Paper;
	var Styles = _require.Styles;
	var Dialog = _require.Dialog;

	var FullWidthSection = __webpack_require__(429);
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var Signup = React.createClass({
	    displayName: 'Signup',

	    contextTypes: {
	        router: React.PropTypes.func
	    },

	    getInitialState: function getInitialState() {
	        return {
	            error: "",
	            signupSuccessful: false
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        AuthStore.addChangeListener(this._onChange);
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        AuthStore.removeChangeListener(this._onChange);
	    },

	    _onChange: function _onChange() {
	        console.log("Signup._onChange");
	        this.setState({
	            error: AuthStore.getError(),
	            signupSuccessful: AuthStore.isLoggedIn()
	        });

	        if (this.state.error === "") {
	            this.refs.signupSuccessful.show();
	        } else {
	            this.refs.signupFailed.show();
	        }
	    },

	    _onSubmit: function _onSubmit(e) {
	        console.log("This.refs:", this.refs);
	        e.preventDefault();
	        this.setState({ errors: [] });
	        var email = this.refs.email.getValue();
	        var username = this.refs.username.getValue();
	        var password = this.refs.password.getValue();
	        var passwordConfirmation = this.refs.passwordConfirmation.getValue();
	        if (password !== passwordConfirmation) {
	            this.setState({
	                error: "Password and password confirmation should match"
	            });
	        } else {
	            AuthActions.signup(email, username, password, passwordConfirmation);
	        }
	    },

	    render: function render() {
	        var styles = this.getStyles();
	        var signupSuccessActions = [{ text: 'Great!', onTouchTap: this._onDialogAck, ref: 'submit' }];
	        var signupFailedActions = [{ text: 'Try Again' }, { text: 'Contact Us...' } // Todo....
	        ];

	        return React.createElement(
	            FullWidthSection,
	            { style: styles.root },
	            React.createElement(
	                Dialog,
	                {
	                    title: 'Welcome Aboard!',
	                    actions: signupSuccessActions,
	                    ref: 'signupSuccessful',
	                    modal: false,
	                    openImmediately: false,
	                    onDismiss: this._dismissSignupSuccess },
	                'An email has been sent to activate the account.'
	            ),
	            React.createElement(
	                Dialog,
	                {
	                    title: 'Error occured during singup',
	                    actions: signupFailedActions,
	                    ref: 'signupFailed',
	                    modal: false,
	                    openImmediately: false },
	                this.state.error
	            ),
	            React.createElement(
	                'div',
	                { style: styles.div },
	                React.createElement(
	                    'form',
	                    { onSubmit: this._onSubmit },
	                    React.createElement(TextField, {
	                        hintText: 'Email',
	                        floatingLabelText: 'Email',
	                        type: 'email',
	                        ref: 'email',
	                        name: 'email',
	                        onChange: this._handleErrorInputChangeEmail,
	                        errorText: this.state.errorTextEmail }),
	                    React.createElement('br', null),
	                    React.createElement(TextField, {
	                        hintText: 'Username',
	                        floatingLabelText: 'Username',
	                        type: 'text',
	                        ref: 'username',
	                        name: 'username',
	                        onChange: this._handleErrorInputChangeUsername,
	                        errorText: this.state.errorTextUsername }),
	                    React.createElement('br', null),
	                    React.createElement(TextField, {
	                        hintText: 'Password',
	                        floatingLabelText: 'Password',
	                        type: 'password',
	                        ref: 'password',
	                        name: 'password',
	                        onChange: this._handleErrorInputChangePassword,
	                        errorText: this.state.errorTextPassword }),
	                    React.createElement('br', null),
	                    React.createElement(TextField, {
	                        hintText: 'Password Confirmation',
	                        floatingLabelText: 'Password Confirmation',
	                        type: 'password',
	                        ref: 'passwordConfirmation',
	                        name: 'passwordConfirmation',
	                        onChange: this._handleErrorInputChangePasswordConfirmation,
	                        errorText: this.state.errorTextPasswordConfirmation }),
	                    React.createElement('br', null),
	                    React.createElement(RaisedButton, { label: 'Signup', primary: true, type: 'submit', style: styles.submitButton })
	                )
	            )
	        );
	    },

	    getStyles: function getStyles() {
	        return {
	            root: {
	                overflow: 'hidden',
	                width: '100%',
	                textAlign: 'center',
	                display: 'center',
	                backgroundColor: Colors.white,
	                padding: '0px',
	                marginBottom: '0px'
	            },
	            div: {
	                width: '70%',
	                margin: 'auto',
	                paddingTop: '2%',
	                paddingBottom: '2%'
	            },
	            submitButton: {
	                marginTop: '15px'
	            }
	        };
	    },

	    _handleErrorInputChangeEmail: function _handleErrorInputChangeEmail(e) {
	        this.setState({
	            emailErrorText: e.target.value ? '' : 'This field is required.'
	        });
	    },
	    _handleErrorInputChangeUsername: function _handleErrorInputChangeUsername(e) {
	        this.setState({
	            emailErrorUsername: e.target.value ? '' : 'This field is required.'
	        });
	    },
	    _handleErrorInputChangePassword: function _handleErrorInputChangePassword(e) {
	        this.setState({
	            emailErrorPassword: e.target.value ? '' : 'This field is required.'
	        });
	    },
	    _handleErrorInputChangePasswordConfirmation: function _handleErrorInputChangePasswordConfirmation(e) {
	        this.setState({
	            emailErrorPasswordConfirmation: e.target.value ? '' : 'This field is required.'
	        });
	    }
	});

	module.exports = Signup;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Signup.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 472 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var AppConstants = __webpack_require__(438);
	var WebAPIUtils = __webpack_require__(473);
	var $ = __webpack_require__(454);

	var ActionTypes = AppConstants.ActionTypes;

	module.exports = {

	    signup: function signup(email, username, password, passwordConfirmation) {
	        AppDispatcher.handleAction({
	            type: ActionTypes.SIGNUP_REQUEST,
	            email: email,
	            username: username,
	            password: password,
	            passwordConfirmation: passwordConfirmation
	        });
	        $.ajax({
	            type: 'POST',
	            url: 'http://networknt.com:8080/api/rs',
	            data: JSON.stringify({
	                category: 'user',
	                name: 'signUpUser',
	                readOnly: false,
	                "data": {
	                    email: email,
	                    userId: username,
	                    password: password,
	                    passwordConfirm: passwordConfirmation,
	                    clientId: AppConstants.ClientId
	                }
	            }),
	            contentType: 'application/json',
	            //dataType: 'json',
	            error: function error(jqXHR, status, _error) {
	                console.log('signup error', _error);
	                var errorText = jqXHR.responseText;
	                AppDispatcher.handleAction({
	                    type: ActionTypes.SIGNUP_RESPONSE,
	                    json: null,
	                    error: errorText
	                });
	            },
	            success: function success(result, status, xhr) {
	                console.log('signup success', result);
	                AppDispatcher.handleAction({
	                    type: ActionTypes.SIGNUP_RESPONSE,
	                    json: result,
	                    error: null
	                });
	            }
	        });
	    },

	    login: function login(userIdEmail, password, rememberMe) {
	        AppDispatcher.handleAction({
	            type: ActionTypes.LOGIN_REQUEST,
	            userIdEmail: userIdEmail,
	            password: password,
	            rememberMe: rememberMe
	        });

	        $.ajax({
	            type: 'POST',
	            url: 'http://networknt.com:8080/api/rs',
	            data: JSON.stringify({
	                category: 'user',
	                name: 'signInUser',
	                readOnly: false,
	                "data": {
	                    userIdEmail: userIdEmail,
	                    password: password,
	                    rememberMe: rememberMe,
	                    clientId: AppConstants.ClientId
	                }
	            }),
	            contentType: 'application/json',
	            dataType: 'json',
	            error: function error(jqXHR, status, _error2) {
	                console.log('Login error received', _error2, jqXHR, status);
	                AppDispatcher.handleAction({
	                    type: ActionTypes.LOGIN_RESPONSE,
	                    json: null,
	                    error: JSON.parse(jqXHR.responseText)
	                });
	            },
	            success: function success(result, status, xhr) {
	                console.log('Login success received', result);
	                AppDispatcher.handleAction({
	                    type: ActionTypes.LOGIN_RESPONSE,
	                    json: result,
	                    error: null
	                });
	            }
	        });
	    },

	    logout: function logout() {
	        AppDispatcher.handleAction({
	            type: ActionTypes.LOGOUT
	        });
	    },

	    init: function init() {
	        console.log('the inti action is called', AppDispatcher);
	        AppDispatcher.handleAction({
	            type: ActionTypes.INIT
	        });
	    },

	    refresh: function refresh(accessToken) {
	        console.log('refresh in AuthActionCreators is called.');
	        AppDispatcher.handleAction({
	            type: ActionTypes.REFRESH,
	            accessToken: accessToken
	        });
	    }
	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "AuthActions.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 473 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var ServerActionCreators = __webpack_require__(474);
	var AppConstants = __webpack_require__(438);
	var $ = __webpack_require__(454);

	function _getErrors(res) {
	    var errorMsgs = ["Something went wrong, please try again"];
	    var json = JSON.parse(res.text);
	    if (json) {
	        if (json['errors']) {
	            errorMsgs = json['errors'];
	        } else if (json['error']) {
	            errorMsgs = [json['error']];
	        }
	    }
	    return errorMsgs;
	}

	var APIEndpoints = AppConstants.APIEndpoints;
	var APIRoot = AppConstants.APIRoot;
	var host = AppConstants.host;
	var ClientId = AppConstants.ClientId;

	module.exports = {

	    signup: function signup(email, username, password, passwordConfirmation) {
	        $.ajax({
	            type: 'POST',
	            url: 'http://example:8080/api/rs',
	            data: JSON.stringify({
	                user: {
	                    email: email,
	                    username: username,
	                    password: password,
	                    password_confirmation: passwordConfirmation,
	                    clientId: ClientId
	                }
	            }),
	            contentType: 'application/json',
	            dataType: 'json',
	            error: function error(jqXHR, status, _error) {
	                console.log('signup error', _error);
	                ServerActionCreators.receiveLogin(null, _error);
	            },
	            success: function success(result, status, xhr) {
	                console.log('signup success', result);
	                ServerActionCreators.receiveLogin(result, null);
	            }
	        });
	    },

	    login: function login(userIdEmail, password, rememberMe) {
	        console.log('login in WebAPIUtils is been called');

	        APIEndpoints.SIGNIN.data = {
	            userIdEmail: userIdEmail,
	            password: password,
	            rememberMe: rememberMe,
	            clientId: ClientId
	        };

	        console.log('SIGNIN', APIEndpoints.SIGNIN);
	        $.ajax({
	            type: 'POST',
	            contentType: 'application/json',
	            url: 'http://example:8080/api/rs',
	            data: JSON.stringify(APIEndpoints.SIGNIN),
	            dataType: 'json',
	            error: function error(jqXHR, status, _error2) {
	                console.log('login error', _error2);
	                ServerActionCreators.receiveLogin(null, _error2);
	            },
	            success: function success(result, status, xhr) {
	                console.log('login success', result);
	                ServerActionCreators.receiveLogin(result, null);
	            }
	        });
	    },

	    loadMenu: function loadMenu() {
	        console.log('WebAPIUtils loadMenus is called');
	        $.ajax({
	            type: 'POST',
	            url: 'http://example:8080/api/rs',
	            data: JSON.stringify(APIEndpoints.GETMENU),
	            contentType: 'application/json',
	            dataType: 'json'
	        }).done(function (data) {
	            console.log('done', data);
	            ServerActionCreators.receiveMenu(data, null);
	        }).fail(function (error) {
	            console.log('error', error);
	            ServerActionCreators.receiveMenu(null, error);
	        });
	    },

	    loadBlogs: function loadBlogs() {
	        var getBlogs = {
	            category: 'demo',
	            name: 'getDropdown',
	            readOnly: true
	        };
	        console.log('WebAPIUtils logBlogs is called');
	        $.ajax({
	            type: 'GET',
	            url: 'http://example:8080/api/rs',
	            data: { cmd: encodeURIComponent(JSON.stringify(getBlogs)) }
	        }).done(function (data) {
	            console.log('done', data);
	            ServerActionCreators.receiveBlogs(data, null);
	        }).fail(function (error) {
	            console.log('error', error);
	            ServerActionCreators.receiveBlogs(null, error);
	        });
	    },

	    loadBlog: function loadBlog(blogId) {
	        request.get(APIEndpoints.STORIES + '/' + storyId).set('Accept', 'application/json').end(function (error, res) {
	            if (res) {
	                var json = JSON.parse(res.text);
	                ServerActionCreators.receiveBlog(json);
	            }
	        });
	    },

	    createBlog: function createBlog(title, body) {
	        request.post(APIEndpoints.STORIES).set('Accept', 'application/json').send({ blog: { title: title, body: body } }).end(function (error, res) {
	            if (res) {
	                if (res.error) {
	                    var errorMsgs = _getErrors(res);
	                    ServerActionCreators.receiveCreatedBlog(null, errorMsgs);
	                } else {
	                    var json = JSON.parse(res.text);
	                    ServerActionCreators.receiveCreatedBlog(json, null);
	                }
	            }
	        });
	    }

	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "WebAPIUtils.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 474 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var AppConstants = __webpack_require__(438);

	var ActionTypes = AppConstants.ActionTypes;

	module.exports = {

	    receiveLogin: function receiveLogin(json, error) {
	        AppDispatcher.dispatch({
	            type: ActionTypes.LOGIN_RESPONSE,
	            json: json,
	            error: error
	        });
	    },

	    receiveBlogs: function receiveBlogs(json, error) {
	        AppDispatcher.dispatch({
	            type: ActionTypes.RECEIVE_BLOGS,
	            json: json,
	            error: error
	        });
	    },

	    receiveMenu: function receiveMenu(json, error) {
	        AppDispatcher.dispatch({
	            type: ActionTypes.RECEIVE_MENU,
	            json: json,
	            error: error
	        });
	    },

	    receiveStory: function receiveStory(json) {
	        AppDispatcher.dispatch({
	            type: ActionTypes.RECEIVE_STORY,
	            json: json
	        });
	    },

	    receiveCreatedStory: function receiveCreatedStory(json, errors) {
	        AppDispatcher.dispatch({
	            type: ActionTypes.RECEIVE_CREATED_STORY,
	            json: json,
	            errors: errors
	        });
	    }

	};

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ServerActionCreators.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 475 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	"use strict";

	var React = __webpack_require__(123);

	var ErrorNotice = React.createClass({
	    displayName: "ErrorNotice",

	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "error-notice" },
	            React.createElement(
	                "ul",
	                null,
	                this.props.errors.map(function (error, index) {
	                    return React.createElement(
	                        "li",
	                        { className: "error-notice__error", key: "error-" + index },
	                        error
	                    );
	                })
	            )
	        );
	    }
	});

	module.exports = ErrorNotice;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "ErrorNotice.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 476 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	/**
	 * Created by steve on 08/07/15.
	 */
	'use strict';

	var React = __webpack_require__(123);
	var AuthActions = __webpack_require__(472);
	var AuthStore = __webpack_require__(433);
	var ErrorNotice = __webpack_require__(475);

	var _require = __webpack_require__(270);

	var TextField = _require.TextField;
	var RaisedButton = _require.RaisedButton;
	var Paper = _require.Paper;
	var Styles = _require.Styles;
	var Checkbox = _require.Checkbox;
	var Dialog = _require.Dialog;

	var FullWidthSection = __webpack_require__(429);
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

	var Login = React.createClass({
	    displayName: 'Login',

	    contextTypes: {
	        router: React.PropTypes.func
	    },

	    getInitialState: function getInitialState() {
	        return {
	            error: "",
	            loginSuccessful: false
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        AuthStore.addChangeListener(this._onChange);
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        AuthStore.removeChangeListener(this._onChange);
	    },

	    _onChange: function _onChange() {
	        this.setState({
	            error: AuthStore.getError(),
	            loginSuccessful: AuthStore.isLoggedIn()
	        });

	        if (this.state.loginSuccessful) {
	            this.refs.loginSuccessful.show();
	        } else {
	            this.refs.loginFailed.show();
	        }

	        console.log("Login._onChange: error set to:", AuthStore.getError());
	        console.log("Login._onChange: ");
	    },

	    _onSubmit: function _onSubmit(e) {
	        e.preventDefault();
	        this.setState({ errors: [] });
	        var userIdEmail = this.refs.userIdEmail.getValue();
	        var password = this.refs.password.getValue();
	        var rememberMe = this.refs.rememberMe.isChecked();
	        AuthActions.login(userIdEmail, password, rememberMe);
	    },

	    _dismissLoginSuccess: function _dismissLoginSuccess() {
	        this.context.router.transitionTo('/home');
	    },

	    render: function render() {
	        var styles = this.getStyles();
	        var loginSuccessActions = [{ text: 'Thank you!', onTouchTap: this._onDialogAck, ref: 'submit' }];
	        var loginFailedActions = [{ text: 'Try Again' }, { text: 'I forgot it...' } // Todo....
	        ];
	        return React.createElement(
	            FullWidthSection,
	            { style: styles.root },
	            React.createElement(
	                Dialog,
	                {
	                    title: 'Log in successful!',
	                    actions: loginSuccessActions,
	                    ref: 'loginSuccessful',
	                    modal: false,
	                    openImmediately: false,
	                    onDismiss: this._dismissLoginSuccess },
	                'You are now logged in!'
	            ),
	            React.createElement(
	                Dialog,
	                {
	                    title: 'Error occured during login',
	                    actions: loginFailedActions,
	                    ref: 'loginFailed',
	                    modal: false,
	                    openImmediately: false },
	                this.state.error
	            ),
	            React.createElement(
	                'center',
	                null,
	                React.createElement(
	                    'form',
	                    { onSubmit: this._onSubmit },
	                    React.createElement(TextField, {
	                        hintText: 'User ID or Email',
	                        floatingLabelText: 'User ID or Email',
	                        type: 'text',
	                        ref: 'userIdEmail',
	                        name: 'userIdEmail' }),
	                    React.createElement('br', null),
	                    React.createElement(TextField, {
	                        hintText: 'Password',
	                        floatingLabelText: 'Password',
	                        type: 'password',
	                        ref: 'password',
	                        name: 'password' }),
	                    React.createElement('br', null),
	                    React.createElement(Checkbox, {
	                        name: 'rememberMe',
	                        value: 'rememberMe',
	                        ref: 'rememberMe',
	                        label: 'Remember Me',
	                        style: styles.rememberMe }),
	                    React.createElement('br', null),
	                    React.createElement(RaisedButton, { label: 'Signup', primary: true, type: 'submit', style: styles.submitButton })
	                )
	            )
	        );
	    },

	    getStyles: function getStyles() {
	        return {
	            root: {
	                display: 'center',
	                backgroundColor: Colors.white,
	                padding: '0px',
	                marginBottom: '0px'
	            },
	            div: {
	                width: '70%',
	                paddingTop: '2%',
	                paddingBottom: '2%'
	            },
	            submitButton: {
	                marginTop: '15px'
	            },
	            rememberMe: {
	                marginLeft: 'auto',
	                marginRight: 'auto',
	                width: '170px',
	                paddingTop: '15px'
	            }
	        };
	    }
	});

	module.exports = Login;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Login.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 477 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var React = __webpack_require__(123);

	var _require = __webpack_require__(270);

	var Dialog = _require.Dialog;

	var AuthActions = __webpack_require__(472);

	var Logout = React.createClass({
	    displayName: 'Logout',

	    contextTypes: {
	        router: React.PropTypes.func
	    },

	    componentDidMount: function componentDidMount() {
	        AuthActions.logout();
	    },

	    getInitialState: function getInitialState() {
	        return {};
	    },

	    render: function render() {
	        var standardActions = [{ text: 'Thank you!', onTouchTap: this._onDialogAck, ref: 'submit' }];
	        return React.createElement(
	            Dialog,
	            {
	                title: 'Log out successful',
	                actions: standardActions,
	                actionFocus: 'submit',
	                ref: 'logoutDialog',
	                modal: false,
	                openImmediately: true,
	                onDismiss: this._onDialogAck },
	            'You are now logged out.'
	        );
	    },

	    _onDialogAck: function _onDialogAck() {
	        this.context.router.transitionTo('/home');
	    }
	});

	module.exports = Logout;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Logout.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 478 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	'use strict';

	var AppDispatcher = __webpack_require__(434);
	var AppConstants = __webpack_require__(438);
	var EventEmitter = __webpack_require__(439).EventEmitter;
	var assign = __webpack_require__(83);

	var Router = __webpack_require__(225);
	var routes = __webpack_require__(268);

	var router = Router.create({
	    routes: routes,
	    location: Router.HistoryLocation,
	    scrollBehavior: Router.ScrollToTopBehavior
	});

	var ActionTypes = AppConstants.ActionTypes;

	var RouteStore = assign({}, EventEmitter.prototype, {

	    emitChange: function emitChange() {
	        this.emit(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT);
	    },

	    addChangeListener: function addChangeListener(callback) {
	        this.on(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT, callback);
	    },

	    removeChangeListener: function removeChangeListener() {
	        this.removeListener(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT, callback);
	    },

	    getRouter: function getRouter() {
	        return router;
	    },

	    redirectHome: function redirectHome() {
	        router.transitionTo('root');
	    }
	});

	RouteStore.dispatchToken = AppDispatcher.register(function (payload) {
	    console.log('RouteStore received payload:', payload);
	    var action = payload.action;

	    if (action == null) return;

	    var type = action.actionType;
	    var data = action.data;

	    switch (type) {
	        case ActionTypes.REDIRECT:
	            console.log("Routing to...", action);
	            router.transitionTo(action.route, data);
	            break;
	        default:
	            return true;
	    }

	    return true;
	});

	module.exports = RouteStore;

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(430), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "RouteStore.js" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ },
/* 479 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var RootInstanceProvider = __webpack_require__(67);

	module.exports = {
	  RootInstanceProvider: RootInstanceProvider.injection
	};

/***/ }
]);