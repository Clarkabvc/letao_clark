$(function () {
  
  // 主体区域滚动
  mui('.mui-scroll-wrapper').scroll({
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
    bounce: true //是否启用回弹
  });

//获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
  });
  
});

//根据传入的key值,解析地址栏的参数.获取对应的value值
function getSearch(key) {
  //获取地址栏参数
  var search = location.search;
  search = decodeURI(search); //解码
  search = search.slice(1);  //去掉?
  
  //根据&分割成数组
  var arr = search.split("&");
  var obj = {}; //解析的参数可能有多个,所以包装成对象
  
  arr.forEach(function (e, i) {
    var k = e.split("=")[0];
    var v = e.split("=")[1];
    
    obj[k] = v;
  });
  return obj[key];
}
