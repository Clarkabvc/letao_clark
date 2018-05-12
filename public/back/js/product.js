$(function () {
  var currentPage = 1;
  var pageSize = 3;
  
  render();
  
  //发送请求,获取数据,渲染商品列表和分页标签
  function render() {
    //请求数据
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        //配合模板动态渲染数据
        var str = template('producttmp', info);
        $('.table-bordered tbody').html(str);
        
        //加载分页标签
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定版本
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),  //总页数
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          },
          size: "normal", //控制按钮大小
          itemTexts: function (type, page, current) {  //设置按钮为中文
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "第" + page + "页";
            }
          },
          useBootstrapTooltip: true
        })
      }
    })
  }
  
  //点击按钮,设置商品上架或者下架,事件委托
  $('.table tbody').on('click', 'button',function(){
    //获取点击商品的id
    var id=$(this).parent().data("id");
    alert("没有后台接口,无法操作!");
  })
  
  
});