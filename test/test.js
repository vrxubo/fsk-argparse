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
describe('argparse.parse', function () {
  it('无效参数', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    (function(){
      argparse.parse(['test','testValue', 'valid']);
    }).should.throw('valid是无效的参数');
  });
});
describe('argparse.parse', function () {
  it('事件', function (done) {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{callback: function(args){i = args.test;done();}});
    var obj = argparse.parse(['test', 'testValue']);
    i.should.be.eql('testValue');
  });
});
describe('argparse.parse', function () {
  it('defaultValue', function (done) {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{defaultValue: 'testValue', callback: function(args){i = args.test;done();}});
    var obj = argparse.parse();
    i.should.be.eql('testValue');
  });
});
describe('argparse.parse', function () {
  it('no value will be true, not defaultValue', function () {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{defaultValue: 'testValue', callback: function(args){i = args.test;}});
    argparse.add('test2');
    var obj = argparse.parse(['test']);
    i.should.be.true;
  });
});
describe('argparse.parse', function () {
  it('repeat', function (done) {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{callback: function(args){i = args.test;done();}});
    var obj = argparse.parse(['test', 'testValue', 'test','test','testValue2']);
    i.should.be.an.Array;
  });
});
describe('argparse.parse', function () {
  it('-h', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.parse(['-h']);
    }).should.not.throw();
  });
});
describe('argparse.parse', function () {
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
});
describe('argparse.parse', function () {
  it('required', function () {
    var argparse = new ArgumentParse();
    var i = '' ;
    argparse.add('test',{required: true});
    (function(){
      argparse.parse();
    }).should.throw('test is required');
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
