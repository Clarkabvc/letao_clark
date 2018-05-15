$(function () {
  //1-页面加载后,解析地址栏传递的数据,根据数据查询数据,渲染到产品列表里
  var key = getSearch("key");
  $('.search input').val(key); //赋值给input
  //标记当前页
  var currentPage = 1;
  //标记每页多少条
  var pageSize = 2;
  
  
  //封装渲染方法
  function render(callback) {
    
    //后台接口要求的参数是一个对象
    var params = {};
    params.proName = $(".search input").val();
    params.page = currentPage;
    params.pageSize = pageSize;
    
    //商品排序,如果有current类的a,说明需要排序,再根据i的类名可判断排序类型
    var current = $('.sort a.current');
    
    if (current.length > 0) {
      //获取所有data-type的元素,判断其i的箭头类名
      var sortName = current.data('type');
      var sortValue = current.find('i').hasClass('fa-angle-down') ? 2 : 1;
      
      params[sortName] = sortValue;
    }
    
    
    //模拟网络延迟环境
    setTimeout(function () {
      
      //根据搜索框中的值,进行搜索渲染
      $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: params,
        success: function (info) {
          callback(info);
        }
      })
      
    }, 500);
  }
  
  //配置下拉刷新
  //1.下拉刷新初始化
  //2.配置回调函数,下拉时,发送请求,渲染页面
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true, //表示一进入页面,就下拉刷新一次
        callback: function () {
          //下拉刷新请求第一页的数据
          currentPage = 1;
          render(function (info) {
            var str = template('productTmp', info);
            $('.lt_main .product').html(str);
            
            // 需要在 ajax 请求回来最新数据, 渲染完页面之后, 需要关闭下拉刷新中的状态
            // mui('.mui-scroll-wrapper').pullRefresh() 可以生成下拉刷新实例
            // 注意天坑: 文档中, 还没有更新方法, 需要先通过 pullRefresh() 生成实例
            //          通过 endPulldownToRefresh() 进行关闭我们的下拉刷新状态
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            
            // 下拉刷新完成后, 因为进行了重新渲染, 需要重新启用上拉加载功能
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      //配置上拉加载,渲染时,在原有内容基础上,追加到后面
      up: {
        callback: function () {
          //请求下一页的数据,追加到页面的后面
          currentPage++;
          render(function (info) {
            //加载有两种情况:
            //1-后面还有数据,继续加载
            //2-后面没有数据了,给用户一个提示
            if (info.data.length > 0) {
              $('.lt_main .product').append(template('productTmp', info));
              //关闭正在加载的提示
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            } else {
              //不需要追加,提示用户没有数据了
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }
            
          })
        }
      }
    }
  });
  
  
  //2-点击搜索按钮,进行搜索,并持久化到历史记录中
  $('.search button').click(function () {
    //只需要出发一次下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    
    
    //获取输入框的值,同步到本地存储
    var key = $('.search input').val().trim();
    var history = localStorage.getItem('search_list') || "[]";
    var arr = JSON.parse(history);  //转成数组
    
    //删除重复的项
    var index = arr.indexOf(key);
    if (index > -1) {
      arr.splice(index, 1);
    }
    //数据长度不能大于10
    if (arr.length >= 10) {
      arr.pop();  //删除最后一项
    }
    
    //将新的搜索项添加到数组最前面
    arr.unshift(key);
    
    //同步到本地存储中
    localStorage.setItem('search_list', JSON.stringify(arr));
    
  });
  
  //3-商品排序
  //注册事件,筛选有data-type属性的
  $('.sort a[data-type]').on('tap', function () {
    if ($(this).hasClass('current')) {  //有current 切换箭头
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    } else {  //没有就添加current,同时排他
      $(this).addClass('current').siblings().removeClass('current');
      
      //将其他a里的将头重置为初始状态,都向下
      $(this).siblings().find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
    
    //触发下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })
  
  
});
