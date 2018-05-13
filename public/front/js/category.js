$(function () {
  //页面加载时渲染左侧一级分类,同时加载返回数据第一个的二级分类
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    success: function (info) {
      //配合模板动态渲染数据
      var str = template('firsttmp', info);
      $('.aside ul').html( str );
      
      //默认加载返回数据第一个的二级分类
      renderById(info.rows[0].id);
    }
  });
  
  //点击左侧的导航,右侧切换对应的内容
  $('#nav').on('click','a',function(){
    $(this).addClass('current').siblings().removeClass('current');
    //获取点击分类的id,对应渲染在右侧
    var id = $(this).data('id');
    renderById( id );
  });

//右侧的内容要根据左侧的一级分类来渲染.通过一级分类的id拿到对应的数据配合模板引擎动态渲染
  function renderById( id ) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      success: function (info) {
        var str = template( 'infotmp',info );
        $('.content ul').html( str );
      }
    })
    
  }


});