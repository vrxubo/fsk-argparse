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
  it('each������callback����������һ������', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.each();
    }).should.throw('callback ������һ������');
  });
});
describe('argparse.each', function () {
  it('��Ҫֱ�Ӳ���˽�б���', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    argparse.add('test2');
    argparse._keys[1] = {};
    (function(){
      argparse.each(function(o) {});
    }).should.throw('��Ҫֱ�Ӳ���_keys _indexs');
  });
});
describe('argparse.get', function () {
  it('û�����õĲ�����Ȼ��ȡ����', function () {
    var argparse = new ArgumentParse();
    (function(){
      argparse.get('test');
    }).should.throw('��Ϊtest�Ĳ���������');
  });
});
describe('argparse.get', function () {
  it('���õĲ�����һ������', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    argparse.get('test').should.be.an.Object;
  });
});
describe('argparse.parse', function () {
  it('��Ч����', function () {
    var argparse = new ArgumentParse();
    argparse.add('test');
    (function(){
      argparse.parse(['test','testValue', 'valid']);
    }).should.throw('valid����Ч�Ĳ���');
  });
});
describe('argparse.parse', function () {
  it('�¼�', function (done) {
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
