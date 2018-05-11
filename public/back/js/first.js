//页面加载时,发送请求,渲染数据
$(function () {
  
  
  var currentPage = 1;
  var pageSize = 3;
  //页面加载渲染数据
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
  
  //点击添加分类,模态框显示
  $('#addbtn').on('click', function () {
    $('#addCategory').modal("show");
  });
  
  //表单校验配置
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: { //非空验证
            message: '请输入一级分类'
          }
        }
      }
    }
  });
  
  //阻止默认提交后,用ajax提交,表单验证通过后,会触发此事件
  $('#form').on('success.form.bv',function( e ){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data: $('#form').serialize(),
      success:function(info){
        if(info.success){
          // 重置模态框的内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);
          
          $('#addCategory').modal("hide");  //隐藏模态框
          currentPage=1;  //重新渲染第一页
          render();
        }
      }
    })
  })
  
  
  
});