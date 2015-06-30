var ArgumentParse = require('../lib/argparse');
var should = require('should');
describe('argparse.add', function () {
  it('the first arg of add must be a string', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.add();
    }).should.throw('argument name must be a string');
  });
});
describe('argparse.add', function () {
  it('_keys length should +1 when add success', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    argparse._keys.should.length(2);
    argparse._index.test.should.eql(1);
    argparse.add('test');
    argparse._keys.should.length(2);
    argparse._index.test.should.eql(1);
    argparse.add('test2');
    argparse._keys.should.length(3);
    argparse._index.test2.should.eql(2);
  });
});
describe('argparse.each', function () {
  it('each方法的callback参数必须是一个函数', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.each();
    }).should.throw('callback 必须是一个函数');
  });
});
describe('argparse.each', function () {
  it('不要直接操作私有变量', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    argparse.add('test2');
    argparse._keys[1] = {};
    (function(){
      argparse.each(function(o) {});
    }).should.throw('不要直接操作_keys _indexs');
  });
});
describe('argparse.get', function () {
  it('没有设置的参数当然获取不到', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.get('test');
    }).should.throw('名为test的参数不存在');
  });
});
describe('argparse.get', function () {
  it('设置的参数是一个对象', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    argparse.get('test').should.be.an.Object;
  });
});
describe('argparse.showHelp', function () {
  it('noError', function () {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{required: true});
    (function(){
      argparse.showHelp();
    }).should.not.throw();
  });
});
describe('argparse.version', function () {
  it('noError', function () {
    var argparse = new ArgumentParse({version:'1.0.0'});
    (function(){
      argparse.parse(['-v']);
    }).should.not.throw();
  });
});
describe('argparse.parse', function () {
  it('无效参数', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    (function(){
      argparse.parse(['test','testValue', 'valid']);
    }).should.throw('valid是无效的参数');
  });

  it('事件', function (done) {
    var argparse = new ArgumentParse({
        done:function(){
        i.should.be.eql('testValue');
        done();
      }
    });
    argparse.add('test',{callback: function(args){i = args.test;}});
    var i = '' ;
    var obj = argparse.parse(['test', 'testValue']);
  });

  it('defaultValue', function (done) {
    var argparse = new ArgumentParse({
      done: function(){
        i.should.be.eql('testValue');
        done();
      }
    });
    var i = '' ;
    argparse.add('test',{defaultValue: 'testValue', callback: function(args){i = args.test;}});
    var obj = argparse.parse();
  });

  it('no value will be true, not defaultValue', function (done) {
    var argparse = new ArgumentParse({
      done: function() {
        i.should.be.true;
        done();
      }
    });
    var i = '' ;
    argparse.add('test',{defaultValue: 'testValue', callback: function(args){i = args.test;}});
    argparse.add('test2');
    var obj = argparse.parse(['test']);

  });
  it('repeat', function (done) {
    var argparse = new ArgumentParse({
      done: function() {
        i.should.be.an.Array;
        done();
      }
    });
    var i = '' ;
    argparse.add('test', {
      callback: function(args){
        i = args.test;
        console.log(123);
      }
    });
    var obj = argparse.parse(['test', 'testValue', 'test','test','testValue2']);
  });

  it('-h', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.parse(['-h']);
    }).should.not.throw();
  });

  it('dest', function (done) {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('-s',{
      dest: 'start',
      callback: function(args){
        i = args.test;done();
      }
    });
    var obj = argparse.parse(['-s', 'testValue']);
    obj.should.be.have.property('start', 'testValue');
  });

  it('required', function () {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{required: true});
    (function(){
      argparse.parse();
    }).should.throw('test is required');
  });
});

describe('argparse.parse', function () {
  it('同步', function () {
    var result = [];
    var argparse = new ArgumentParse({sync: true, done: function(){}});
    argparse.add('test1',{defaultValue: 'testValue1', sort: 3, callback: function(args){result.push(1);}});
    argparse.add('test2',{defaultValue: 'testValue2', sort: 2, callback: function(args){result.push(2);}});
    argparse.add('test3',{defaultValue: 'testValue3', sort: 1, callback: function(args){result.push(3);}});
    var obj = argparse.parse(['test1', 'test2', 'test3']);
    result.should.be.eql([1,2,3]);
  });
  it('同步2', function () {
    var result = [];
    var argparse = new ArgumentParse({sync: true, done: function(){}});
    argparse.add('test1',{defaultValue: 'testValue1', sort: 1, callback: function(args){result.push(1);}});
    argparse.add('test2',{defaultValue: 'testValue2', sort: 2, callback: function(args){result.push(2);}});
    argparse.add('test3',{defaultValue: 'testValue3', callback: function(args){result.push(3);}});
    var obj = argparse.parse(['test1', 'test2', 'test3']);
    result.should.be.eql([2,1,3]);
  });
  it('异步', function (done) {
    var result = [];
    var argparse = new ArgumentParse({
      done: function(){
        result.should.be.length(3);
        result.should
        done();
      }
    });
    argparse.add('test1',{
      defaultValue: 'testValue1',
      sort: 1,
      callback: function(args){
        result.push(1);
        var start = Date.now();
      }
    });
    argparse.add('test2',{defaultValue: 'testValue2', sort: 2, callback: function(args){result.push(2); }});
    argparse.add('test3',{defaultValue: 'testValue3', callback: function(args){result.push(3); }});
    var obj = argparse.parse(['test1', 'test2', 'test3']);
  });
});
