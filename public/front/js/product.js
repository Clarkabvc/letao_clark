$(function () {
//页面加载获取地址栏的商品id
  
  var id = getSearch('productId');
  
  // 发送ajax请求
  
  $.ajax({
    type: 'get',
    url: '/product/queryProductDetail',
    data: {
      id: id
    },
    success: function (info) {
      
      //配合模板引擎 动态渲染商品详情
      var str = template('detailtmp', info);
      $('.lt_main .mui-scroll').html(str);
      
      //获得slider插件对象, 需要手动初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000
      });
      
      // 手动初始化 输入框
      mui(".mui-numbox").numbox();
    }
  });
  
  //选择尺码功能
  $('.lt_main').on('click', '.prosize span', function () {
    $(this).addClass('current').siblings().removeClass('current');
  });
  
  //加入购物车功能
  $('.btn-add').click(function () {
    //获取尺码
    var size = $('.prosize span.current').text();
    
    //获取数量
    var num = $('.pronum input').val();
    
    if (!size) {
      mui.toast('请选择尺码');
      return;
    }
    
    //发送ajax请求
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: id,
        num: num,
        size: size
      },
      success: function (info) {
        if (info.success) {
          mui.confirm('添加成功', '温馨提示', ["去购物车", "继续浏览"], function (e) {
            if (e.index === 0) {
              location.href = "cart.html";
            }
          })
        }
        if (info.error === 400) {
          //说明没有登录,拦截跳转到登录界面
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })
  })
  
  
});
