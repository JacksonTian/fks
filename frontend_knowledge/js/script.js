var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
        "id": "000",
        "name": "前端工程师",
        "children": [{
            "id": "001",
            "name": "Web服务",
            "children": [{
                "id": "001_01",
                "name": "YQL/Company Open Platform"
            },
            {
                "id": "001_02",
                "name": "APP Engine/Cloud"
            },
            {
                "id": "001_03",
                "name": "Google Open API/Github"
            }]
        },
        {"id": "002",
        "name": "前沿技术社区/会议",
        "children": [{
                "id": "002_01",
                "name": "YDN/YUIConf/JSConf"
            },
            {
                "id": "002_02",
                "name": "QCon/Velocity"
            },
            {
                "id": "002_03",
                "name": "D2/WebRebuild"
            },
            {
                "id": "002_04",
                "name": "NodeParty/HTML5研究小组"
            },
            {
                "id": "002_05",
                "name": "UED Teams"
            }]
        },
        {"id": "003",
        "name": "移动终端",
        "children": [{
                "id": "003_02",
                "name": "jQueryMobile"
            },
            {
                "id": "003_03",
                "name": "HTML5"
            },
            {
                "id": "003_04",
                "name": "CSS3"
            },
            {
                "id": "003_05",
                "name": "iOs/android"
            },
            {
                "id": "003_06",
                "name": "responsive UI Design"
            }]
        },
        {"id": "004",
        "name": "安全",
        "children": [{
                "id": "004_01",
                "name": "CSRF/XSS"
            },
            {
                "id": "004_02",
                "name": "ADsafe"
            },
            {
                "id": "004_03",
                "name": "Caja"
            },
            {
                "id": "004_04",
                "name": "FBJS"
            },
            {
                "id": "004_05",
                "name": "Sandbox"
            }]
        },
        {"id": "005",
        "name": "软技能",
        "children": [{
                "id": "005_01",
                "name": "知识管理/总结分享"
            },{
                "id": "005_02",
                "name": "沟通技巧/团队开发"
            },{
                "id": "005_03",
                "name": "需求管理/PM"
            },{
                "id": "005_04",
                "name": "代码模块化开发/代码版本管理"
            },{
                "id": "005_05",
                "name": "交互设计/可用性"
            },{
                "id": "005_06",
                "name": "可访问性知识"
            }]
        },
        {"id": "006",
        "name": "开发流程/部署",
        "children": [{
                "id": "006_01",
                "name": "JSLint"
            },{
                "id": "006_02",
                "name": "CSSLint"
            },{
                "id": "006_03",
                "name": "YUICompressor"
            },{
                "id": "006_04",
                "name": "JSMin"
            },{
                "id": "006_05",
                "name": "TPacker-minifier"
            },{
                "id": "006_06",
                "name": "Ant"
            },{
                "id": "006_07",
                "name": "Make"
            },{
                "id": "006_08",
                "name": "JSDoc"
            },{
                "id": "006_09",
                "name": "YUIDoc"
            },{
                "id": "006_10",
                "name": "LAMP"
            }]
        },
        {"id": "007",
        "name": "前端框架/库",
        "children": [{
                "id": "007_01",
                "name": "jQuery"
            },{
                "id": "007_02",
                "name": "YUI2/YUI3"
            },{
                "id": "007_03",
                "name": "Prototype"
            },{
                "id": "007_04",
                "name": "Mootools"
            },{
                "id": "007_05",
                "name": "ExtJS"
            },{
                "id": "007_06",
                "name": "Smarty"
            },{
                "id": "007_07",
                "name": "Django"
            },{
                "id": "007_08",
                "name": "Zend"
            },{
                "id": "007_09",
                "name": "YUITest"
            },{
                "id": "007_10",
                "name": "Quint"
            },{
                "id": "007_11",
                "name": "Jasmine"
            },{
                "id": "007_12",
                "name": "前端测试"
            },{
                "id": "007_13",
                "name": "前端MVC"
            }]
        },
        {"id": "008",
        "name": "浏览器兼容性",
        "children": [{
                "id": "008_01",
                "name": "IE6/7/8/9"
            },{
                "id": "008_02",
                "name": "Firfox"
            },{
                "id": "008_03",
                "name": "Chrome"
            },{
                "id": "008_04",
                "name": "Opera"
            },{
                "id": "008_05",
                "name": "Safari"
            }]
        },
        {"id": "009",
        "name": "切页面",
        "children": [{
                "id": "009_01",
                "name": "HTML"
            },{
                "id": "009_02",
                "name": "CSS"
            },{
                "id": "009_03",
                "name": "PhotoShop"
            }]
        },
        {"id": "010",
        "name": "编程语言",
        "children": [{
                "id": "010_01",
                "name": "JavaScript"
            },{
                "id": "010_02",
                "name": "PHP"
            },{
                "id": "010_03",
                "name": "Python"
            },{
                "id": "010_04",
                "name": "Perl"
            },{
                "id": "010_05",
                "name": "Python"
            },{
                "id": "010_06",
                "name": "Ruby"
            }]
        },
        {"id": "011",
        "name": "调试工具",
        "children": [{
                "id": "011_01",
                "name": "Firebug"
            },{
                "id": "011_02",
                "name": "Firebug-lite"
            },{
                "id": "011_03",
                "name": "Web Inspector"
            },{
                "id": "011_04",
                "name": "YSlow"
            },{
                "id": "011_05",
                "name": "Smushi"
            },{
                "id": "011_06",
                "name": "IEDeveloperToolBar"
            },{
                "id": "011_07",
                "name": "IETester"
            },{
                "id": "011_08",
                "name": "SuperPreview"
            },{
                "id": "011_09",
                "name": "JsBeautifier"
            },{
                "id": "011_10",
                "name": "Fiddler"
            },{
                "id": "011_11",
                "name": "WireShark"
            },{
                "id": "011_12",
                "name": "tcpdump"
            }]
        },
        {"id": "012",
        "name": "开发工具",
        "children": [{
                "id": "012_01",
                "name": "VIM"
            },{
                "id": "012_02",
                "name": "Aptana"
            },{
                "id": "012_03",
                "name": "Notepad++"
            },{
                "id": "012_04",
                "name": "EditPlus"
            },{
                "id": "012_05",
                "name": "Sublime Text"
            },{
                "id": "012_06",
                "name": "WebStorm"
            },{
                "id": "012_07",
                "name": "svn"
            },{
                "id": "012_08",
                "name": "git"
            }]
        },
        {"id": "013",
        "name": "计算机知识储备",
        "children": [{
                "id": "013_01",
                "name": "编程原理"
            },{
                "id": "013_02",
                "name": "计算机网络"
            },{
                "id": "013_03",
                "name": "操作系统"
            },{
                "id": "013_04",
                "name": "算法原理"
            },{
                "id": "013_05",
                "name": "软件工程"
            },{
                "id": "013_06",
                "name": "软件测试原理"
            }]
        },
        {"id": "014",
        "name": "前端标准/规范",
        "children": [{
                "id": "014_01",
                "name": "w3c"
            },{
                "id": "014_02",
                "name": "DOM/BOM"
            },{
                "id": "014_03",
                "name": "XHTML"
            },{
                "id": "014_04",
                "name": "XML"
            },{
                "id": "014_05",
                "name": "JSON"
            },{
                "id": "014_06",
                "name": "JONP"
            },{
                "id": "014_07",
                "name": "HTML5"
            },{
                "id": "014_08",
                "name": "CSS3"
            },{
                "id": "014_09",
                "name": "ECMAScript3"
            },{
                "id": "014_10",
                "name": "ECMAScript5"
            },{
                "id": "014_11",
                "name": "CommonJS"
            },{
                "id": "014_12",
                "name": "AMD"
            },{
                "id": "014_13",
                "name": "HTTP1.1"
            }]
        },
        {"id": "015",
        "name": "性能",
        "children": [{
                "id": "015_01",
                "name": "WebPageTest"
            },{
                "id": "015_02",
                "name": "ShowSlow"
            },{
                "id": "015_03",
                "name": "YSlow"
            },{
                "id": "015_04",
                "name": "34Rule"
            },{
                "id": "015_05",
                "name": "PageSpeed"
            },{
                "id": "015_06",
                "name": "HttpWatch"
            },{
                "id": "015_07",
                "name": "DynaTrace's Ajax"
            }]
        },
        {"id": "016",
        "name": "编程知识储备",
        "children": [{
                "id": "016_01",
                "name": "数据结构"
            },{
                "id": "016_02",
                "name": "MVC"
            },{
                "id": "016_03",
                "name": "面向对象"
            },{
                "id": "016_04",
                "name": "切面编程"
            },{
                "id": "016_05",
                "name": "函数式编程"
            },{
                "id": "016_06",
                "name": "JavaScript设计模式"
            },{
                "id": "016_07",
                "name": "JavaScript编程模式"
            }]
        }]
    };
    //end
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;
    
    //init Hypertree
    var ht = new $jit.Hypertree({
      //id of the visualization container
      injectInto: 'infovis',
      //canvas width and height
      width: w,
      height: h,
      //Change node and edge styles such as
      //color, width and dimensions.
      Node: {
          dim: 9,
          color: "#f00"
      },
      Edge: {
          lineWidth: 2,
          color: "#088"
      },
      onBeforeCompute: function(node){
          Log.write("centering");
      },
      //Attach event handlers and add text to the
      //labels. This method is only triggered on label
      //creation
      onCreateLabel: function(domElement, node){
          domElement.innerHTML = node.name;
          $jit.util.addEvent(domElement, 'click', function () {
              ht.onClick(node.id, {
                  onComplete: function() {
                      ht.controller.onComplete();
                  }
              });
          });
      },
      //Change node styles when labels are placed
      //or moved.
      onPlaceLabel: function(domElement, node){
          var style = domElement.style;
          style.display = '';
          style.cursor = 'pointer';
          if (node._depth <= 1) {
              style.fontSize = "0.8em";
              style.color = "#ddd";

          } else if(node._depth == 2){
              style.fontSize = "0.7em";
              style.color = "#555";

          } else {
              style.display = 'none';
          }

          var left = parseInt(style.left);
          var w = domElement.offsetWidth;
          style.left = (left - w / 2) + 'px';
      },
      
      onComplete: function(){
          Log.write("done");
          
          //Build the right column relations list.
          //This is done by collecting the information (stored in the data property) 
          //for all the nodes adjacent to the centered node.
          var node = ht.graph.getClosestNodeToOrigin("current");
          var html = "<h4>" + node.name + "</h4><b>关系列表:</b>";
          html += "<ul>";
          node.eachAdjacency(function(adj){
              var child = adj.nodeTo;
              if (child.data) {
                  var rel = (child.data.band == node.name) ? child.data.relation : node.data.relation;
                  html += "<li>" + child.name + "</li>";
              }
          });
          html += "</ul>";
          $jit.id('inner-details').innerHTML = html;
      }
    });
    //load JSON data.
    ht.loadJSON(json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
}

function toggleDuoshuoComments(container, id, url){
  if(jQuery(container).has("div").length>0){
    jQuery(container).empty();
    return;
  }
  var el = document.createElement('div');
  el.setAttribute('data-thread-key', id);
  el.setAttribute('data-url', url);
  DUOSHUO.EmbedThread(el);
  jQuery(container).append(el);
}
