$(function () {
  //进入页面,发送ajax请求所有购物车里的商品信息渲染到列表里
  render();
  
  function render() {
    $.ajax({
      type: 'get',
      url: '/cart/queryCart',
      success: function (info) {
        console.log(info);
        var str = template('listtmp',{ info:info});
        $('#OA_task_2').html( str );
      }
    })
  
    
    
  }
 
  
});