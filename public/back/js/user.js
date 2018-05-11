$(function () {
  //加载页面,获取用户数据,渲染表格
  var currentPage = 1;
  var pageSize = 5;
  
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        //根据模板,渲染数据
        var str = template('tmp', info);
        $('.table tbody').html(str);
        
        //渲染分页导航
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //设置版本
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  
});