$(function () {
  //1-页面加载后,解析地址栏传递的数据,根据数据查询数据,渲染到产品列表里
  var key = getSearch("key");
  $('.search input').val(key); //赋值给input
  render();
  
  //封装渲染方法
  function render() {
    //每次更新先,先将产品展示区置换成loading
    $('.product').html('<div class="loading"></div>');
    
    //后台接口要求的参数是一个对象
    var params = {};
    params.proName = $(".search input").val();
    params.page = 1;
    params.pageSize = 100;
    
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
          var str = template('productTmp', info);
          $('.lt_main .product').html(str);
        }
      })
      
    },500);
  }
  
  //2-点击搜索按钮,进行搜索
  $('.search button').click(function () {
    
    render();
    
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
  $('.sort a[data-type]').click(function () {
    if ($(this).hasClass('current')) {  //有current 切换箭头
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    } else {  //没有就添加current,同时排他
      $(this).addClass('current').siblings().removeClass('current');
      
      //将其他a里的将头重置为初始状态,都向下
      $(this).siblings().find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
    
    //重新渲染列表
    render();
  })
  
  
});
