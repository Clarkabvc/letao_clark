$(function () {
  //1.点击登录按钮,注册点击事件
  //2.获取用户输入的用户名和密码
  //3.发送ajax请求
  
  $('.btn_go').click(function () {
    var username = $("[name='username']").val().trim();
    var password = $('[name="password"]').val().trim();
    if (username === "") {
      mui.toast('请输入用户名');
      return;
    }
    if (password == "") {
      mui.toast('请输入密码');
      return;
    }
    
    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      success: function (info) {
        if (info.error === 403) {
          mui.toast('用户名或者密码错误!');
        }
        if (info.success) {
          //登录成功有两种情况
          //1-从其他页面拦截过来的,登录后,再返回之前的页面
          //2-直接从登录页面登录的,不需要返回,直接进入会员中心
          if (location.href.indexOf('retUrl') > -1) {
            //说明是拦截过来登录的,需要返回
            var url = location.search.replace("?retUrl=", "");
            location.href = url;
          }
          else {
            location.href = 'user.html';
          }
        }
      }
    })
    
  })
  
  
});