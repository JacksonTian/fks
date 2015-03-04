var fs = require('fs');
var path = require('path');

var readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');

var getItems = function (str) {
  var patt = /([ ]*)-(.*)/g;
  var result;

  var list = [];
  while ((result = patt.exec(str)) != null)  {
    list.push({level: result[1].length / 4, content: result[2].trim()});
  }
  return list;
};

var filter = function (list) {
  var j = 0;
  var f2e = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (item.level === 0) {
      j = j + 1;
      if (j === 2) {
        break;
      }
    }

    f2e.push(item);
  }
  return f2e;
};

var format = function (list) {
  var result = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var data = {
      id: '' + i,
      name: item.content,
      level: item.level
    };
    result.push(data);
  }
  return result;
};

var items = getItems(readme);
var f2e = filter(items);
var formated = format(f2e);

var buildTree = function (list) {
  var root = null;
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (root === null) {
      root = item;
      root.children = [];
    }

    var lastLevel0 = root.children;
    if (item.level === 1) {
      delete item.level;
      lastLevel0.push(item);
    }

    if (item.level === 2) {
      var lastLevel1 = lastLevel0[lastLevel0.length - 1];
      lastLevel1.children = lastLevel1.children || [];
      lastLevel1.children.push(item);
    }

    if (item.level === 3) {
      var lastLevel1Child = lastLevel0[lastLevel0.length - 1].children;
      var lastLevel2 = lastLevel1Child[lastLevel1Child.length - 1];
      lastLevel2.children = lastLevel2.children || [];
      lastLevel2.children.push(item);
    }
    delete item.level;
  }
  return root;
};

var tree = buildTree(formated);
fs.writeFileSync(path.join(__dirname, '../fks_chart/data/front-end.json'), JSON.stringify(tree, null, '  '));
