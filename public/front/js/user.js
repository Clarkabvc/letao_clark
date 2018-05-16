//进入页面渲染用户信息
$(function(){
$.ajax({
	type: 'get',
	url: '/user/queryUserMessage',
	success: function(info){
		//渲染用户信息
		var str = template('usertmp', info);
		$('.user_info').html( str );
	}
});



//用户退出功能
//给退出按钮绑定点击事件
$('.logout button').click(function(){
	$.ajax({
		type:'get',
		url: '/user/logout',
		success: function(info){
			if(info.success){
				location.href = "login.html";
			}
		}

	});

});




});