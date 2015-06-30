var events = require('events');
var util = require('util');
var emptyFn = function(){};
module.exports = ArgumentParse = function() {
  this._keys = [];
  this._index = Object(null);
  var _args = Object(null);
  var self = this;
  this.add('-h', {
    desc: 'help',
    dest: 'help',
    callback: function(args) {
      if (args.help === true) {
        self.showHelp();
      }
    }
  });
  this._addArgs = function(key, value) {
    var obj = this.get(key);
    key = obj.dest;
    value = value ? value : value === null && obj.defaultValue !== undefined ? obj.defaultValue : null;
    if ( key in _args) {
      _args = [].concat(_args[key]).concat(value);
    } else {
      _args[key] = value;
    }
  }
  this.getArgs = function() {
    return _args;
  }
}
util.inherits(ArgumentParse, events.EventEmitter);

//添加一个参数
ArgumentParse.prototype.add = function(key, options) {
  //key是必须的而且必须是个string
  if (!key || typeof key !== 'string') {
    throw new Error('argument name must be a string')
  }
  //已经有的就不要再加了
  if ( key in this._index) return;
  var opt = options || {};
  //_index记录了参数在 _keys里的位置
  this._index[key] = this._keys.length;
  this._keys.push({
    name: key,
    dest: opt.dest || key,
    alias: opt.alias || [],
    desc: opt.desc || '',
    defaultValue: opt.defaultValue,
    required : opt.required || false
  });
  var callback = typeof opt.callback === 'function' ? opt.callback : emptyFn;
  this.once(key, callback);
}
ArgumentParse.prototype.get = function(key) {
  var indexArr = this._index;
  if (!(key in indexArr)) {
    throw new Error('名为' + key + '的参数不存在');
  }
  var keys = this._keys;
  var index = indexArr[key];
  var keyObj = keys[index];
  if (key !== keyObj.name && key !== keyObj.dest) {
    throw new Error('不要直接操作_keys _indexs');
  }
  return keyObj;
}

ArgumentParse.prototype.each = function(callback) {
  if (!callback || typeof callback !== 'function') {
    throw new Error('callback 必须是一个函数');
  }
  for (var key in this._index) {
    callback.call(this, this.get(key));
  }
}
ArgumentParse.prototype.showHelp = function() {
  this.each(function(obj) {
    console.log(obj.name, obj.dest, obj.desc, '默认值', obj.defaultValue || '');
  });
}
ArgumentParse.prototype.parse = function(args) {
  args = args && args.slice() || [].slice.call(process.argv, 2);
  var indexArr = this._index;
  while (args.length) {
    var val = args.pop(), key;
    if (val in indexArr) {
      key = val;
      val = true;
    } else {
      key = args.pop();
      if (!(key in indexArr)) {
        throw new Error(val + '是无效的参数');
      }
    }
    this._addArgs(key, val);
  }
  this._valid();
  return this.getArgs();
}

ArgumentParse.prototype._valid = function() {
  var args = this.getArgs();
  var self = this;
  this._keys.forEach(function(k) {
    var dest = k.dest;
    //如果是必选项且为空 抛出异常
    if (k.required && !(dest in args)) {
      throw new Error(k.name + ' is required');
    }
    //如果不是必选项 赋默认值
    if (!(dest in args)) {
      self._addArgs(k.name, null);
    }
    //触发事件
    self.emit(k.name, args);
  });
}
