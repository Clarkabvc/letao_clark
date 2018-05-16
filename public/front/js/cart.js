$(function () {
  //进入页面,发送ajax请求所有购物车里的商品信息渲染到列表里
  
  function render() {
    $.ajax({
      type: 'get',
      url: '/cart/queryCart',
      success: function (info) {
        if (info.error === 400) {
          //说明没有登录,需要跳转到登录页
          location.href = "login.html?retUrl=" + location.href;
          return;
        }
        
        //执行到这里说明登录了
        var str = template('listtmp', {info: info});
        $('#OA_task_2').html(str);
        
        //渲染完成,结束下拉刷新文本提示
        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
      }
    })
  }
  
  //1-配置下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback: function () {
          render();
        }
      }
    }
  });
  
  //2-删除功能,事件委托
  $('#OA_task_2').on('tap', '#OA_task_2 .mui-icon-trash', function () {
    //获取要删除商品的id
    var id = $(this).parent().data('id');
    
    //弹出消息提示框
    mui.confirm('确定要删除这个商品吗?', '温馨提示', ["确定", "取消"], function (e) {
      if (e.index === 0) {
        //发送ajax请求
        $.ajax({
          type: 'get',
          url: '/cart/deleteCart',
          data: {
            id: [id]
          },
          success: function (info) {
            
            if (info.success) {
              //触发下拉刷新
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }
    });
  });
  
  //修改购物车商品信息功能
  $('#OA_task_2').on('tap', '#OA_task_2 .mui-icon-compose', function () {
    //获取商品id,size,num信息,传递到模态框中进行修改
    var info = $(this).parent()[0].dataset;
    
    var str = template('changetmp', info);
    
    //mui.confirm 渲染时,会把模板中的\n替换成换行,这里要把所有的\n去掉
    str = str.replace(/\n/g, "");
    
    mui.confirm(str, '编辑商品', ["确定", "取消"], function (e) {
      if (e.index === 0) {
        //点击了确定,就把商品的更新信息发给后台保存
        //获取商品更新后的信息(size,num)
        var size = $('.productSize span.current').text();
        var num = $('.productNum input').val();
        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: info.id,
            size: size,
            num: num
          },
          success: function (info) {
            if (info.success) {
              //触发下拉刷新
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }
    });
    //动态生成的数字输入框,需要手动初始化,否则无法点击
    mui('.mui-numbox').numbox();
  });
  
  //添加修改商品尺码功能,模态框是直接添加在body下面,所以事件委托时要委托给body
  $('body').on('click', '.productSize span', function () {
    $(this).addClass('current').siblings().removeClass('current');
  });
  
  //添加勾选商品,订单总金额动态更新功能
  $('#OA_task_2').on('click', '[type="checkbox"]', function () {
    var total = 0;
    //筛选出所有选中的盒子
    var checked = $('#OA_task_2 input:checked');
    //遍历,统计出所有商品的价格
    checked.each(function (i, e) {
      total += $(this).data('num') * $(this).data('price');
    });
  
    // toFixed 表示保留两位小数
    total = total.toFixed(2);
    
    $('.priceTotal').text( total );
  });
  
  
});