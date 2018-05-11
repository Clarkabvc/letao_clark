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
  
  //点击设置用户状态,因为是动态渲染的,所以要用事件委托
  var userId = 0;  //记录点击的用户id
  var isDelete = 0; //记录用户状态
  
  $('tbody').on('click', '.btn', function () {
    $('#userModal').modal('show');   //显示模态框
    userId = $(this).parent().data('id'); //获取用户id
    
    //判断用户状态, 1 正常  0  禁用
    // 根据当前按钮的类名,有success的代表禁用,点击需要启用 就设置1  反之设置0
    
    isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    
  });
  
  
  //点击模态框的确定按钮,设置用户
  $('#submitBtn').on('click', function () {
    //发送请求到后台,修改用户状态,并且重新渲染页面
    
   
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: userId,
        isDelete: isDelete
      },
      success: function (info) {
        $('#userModal').modal('hide');
        render();
      }
    })
  })
  
});