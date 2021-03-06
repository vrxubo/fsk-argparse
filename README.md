# fsk-argparse #
参数解析工具

## 安装 ##
>npm install fsk-argparse

## 示例 ##

    var ArgumentParser = require('fsk-argparse');
    var argsParser = new ArgumentParser([options]);
    argsParser.add('-s', {
      dest: 'start',
      desc: '启动服务器',
      callback: function(args) {
        if (args && args.start === true){
          //启动服务器
        }
      }
    });
    var args = argsParser.parse();
+ options: 可选参数
    * sync: 是否同步, 默认异步
    * done: 所有事件完成后的回调
    * version: 版本号, 支持-v查看版本号

## add ##
    parser.add(argName[, options]);
    argName: 参数名 必选
    options: 参数配置项 可选
### options ###
    dest: 参数全名 不填默认为参数名
    desc: 说明
    defaultValue: 默认值
    sort: 回调函数执行顺序, 按从大到小的顺序执行 3 > 2 > 1这样
    required: 是否必选项 此项设为true之后 无此参数则抛出异常
    callback: 回调函数 参数 args 解析之后的args 与parse方法返回值相同; 此方法在parse解析完成后执行
## parse ##
    parser.parse([arguments])
    arguments: 字符串数组 可选, 没有则解析process.argv

## 更多示例 ##
    var ArgumentParser = require('fsk-argparse');
    var argsParser = new ArgumentParser();
    argsParser.add('-s', {
      dest: 'start',
      desc: '启动服务器',
      callback: function(args) {
        if (args && args.start === true){
          console.log('启动服务器');
        }
      }
    });
    argsParser.add('-c', {
      dest: 'close',
      desc: '关闭服务器'
    });
    argsParser.add('-t', {
      dest: 'switch',
      desc: '重置配置文件'
    });
    argsParser.parse();
    >test -s //{start: true, close: null, switch: null}
    >test -s start //{start: 'start', close: null, switch: null}
    >test -c -c close -t //{start: null, close: [true, close], switch; true}

    //同步
    var ArgumentParser = require('fsk-argparse');
    var argsParser = new ArgumentParser({sync:true});
    var result = [];
    argsParser.add('test2', {
      sort: 2,
      callback: function() {
        result.push(2)
      }
    });
    argsParser.add('test1', {
      sort: 3,
      callback: function() {
        result.push(3)
      }
    });
    argsParser.add('test3', {
      sort: 1,
      callback: function() {
        result.push(1)
      }
    });
    argsParser.parse(); // result = [3, 2, 1]



