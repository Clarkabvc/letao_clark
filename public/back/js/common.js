//登录拦截功能,调用判断管理员登录接口,判断当前用户有没有登录
// 1-如果没有登录,直接拦截到登录页面
// 2-如果登录了,让用户继续访问
// 3-如果用户进入到了登录页面,不需要再进行登录拦截

if (location.href.indexOf("login.html") === -1) {
  //如果不是登录界面需要判断用户状态
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
      
        if(info.error === 400){
        location.href = 'login.html';
      }
    }
  })
}


//禁用进度条小圆圈旋转效果
NProgress.configure({showSpinner: false});

//每次ajax提交,都产生进度条,ajax完成,结束进度条
/* ajax 全局事件
*   ajaxComplete 只要请求完成就调用 (不管成功或者失败)
*   ajaxError 请求失败时调用
*   ajaxSuccess 请求成功时调用
*
*   ajaxSend  请求发送时调用
*
*   ajaxStart  第一个ajax开始发送的时候调用
*   ajaxStop   最后一个ajax结束时调用
* */
$(document).ajaxStart(function () {
  NProgress.start();  //开启进度条
});
$(document).ajaxStop(function () {
  //模拟网络环境
  setTimeout(function () {
    NProgress.done();
  }, 500);
});


$(function(){
  //点击退出,弹出模态框
  $('.logout').on('click', function () {
    $('#myModal').modal('toggle');
  })

//点击模态框确定按钮,退出用户登录,隐藏模态框
  $('#logoutbtn').on('click', function () {
    $('#myModal').modal('toggle');
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType:'json',
      success:function(info){
        if(info.success){
          location.href="login.html";
        }
      }
    })
  })
  
  //二级菜单切换功能
  $('.category').on('click',function(){
  $('.sidenav .child').slideToggle();
  })
  
  //点击头部菜单按钮,切换侧边导航菜单
  $('.topbar .menu').on('click',function(){
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
    $('.topbar').toggleClass('hidemenu');
  })
  
})

