//页面加载时,发送请求,渲染数据
$(function () {
  
  
  var currentPage = 1;
  var pageSize = 3;
  render();
  
  //请求数据并渲染
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        //动态渲染分类列表
        var str = template('tmp', info);
        $('.table-bordered tbody').html(str);
        //根据数据动态渲染分页标签
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,  //指定bootstrap版本
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size),  //总页数
          onPageClicked: function (a, b, c, page) {  //分页标签点击事件
            currentPage = page; //将当前页更新成page
            render(); //根据点击的页数重新渲染
          }
        })
      }
    })
    
  }
  
  
});