$(function () {
  var currentPage = 1;
  var pageSize = 5;
  //加载页面,渲染数据
  render();
  
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        //结合模板引擎 渲染数据
        var str = template('sectmp', info);
        $('.table tbody').html(str);
        
        //加载分页标签
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  //点击添加按钮,弹出模态框
  $('#addCategory').on('click', function () {
    $('#addModal').modal('show');
    
    //向后台请求一级分类的所有数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 50
      },
      success: function (info) {
        //渲染下拉菜单列表
        var str = template('listtmp', info);
        $('.dropdown-menu').html(str);
      }
    })
  });
  
  //给下拉菜单中所有的a注册点击事件
  $('.dropdown-menu').on('click', 'a', function () {
  //获取点击a的文本,赋值给按钮
    var text=$(this).text();
    $('#dropdownText').text( text );
    
    //获取点击a上的id,赋值给下面的input,这样添加的二级分类就知道添加到哪个一级分类下面的
    var id= $(this).data("id");
    $('[name="categoryId"]').val( id );
    
    //手动设置隐藏域的校验状态
    $('#formadd').data("bootstrapValidator").updateStatus("categoryId","VALID");
  });
  
  //配置文件上传
  $('#fileUpload').fileupload({
  dataType: "json", //指定文件格式
    done:function (e, data) { //上传完成的回调函数
      var picUrl = data.result.picAddr; //得到图片地址
      
      $('#imgBox img').attr('src',picUrl);  //赋值给img的src
      
      $('[name="brandLogo"]').val( picUrl );  //表单提交时可以一起提交
      $('#formadd').data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  });
  
  //表单校验
  $('#formadd').bootstrapValidator({
    //默认对隐藏域不校验,需要重置
    excluded:[],
    
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //配置校验的字段
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators:{
          notEmpty:{
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
    
    
  });
  
  
  //注册校验成功事件,阻止默认行为,用ajax提交
  $('#formadd').on('success.form.bv',function (e) {
    e.preventDefault();
    
    $.ajax({
      type:'post',
      url: "/category/addSecondCategory",
      data: $('#formadd').serialize(),
      success:function(info){
        if(info.success){
          $('#addModal').modal('hide');
          currentPage=1;
          render();
          
          //重置表单内容
          $('#formadd').data("bootstrapValidator").resetForm( true );
          
          //重置文本
          $('#dropdownText').text('请选择一级分类');
          
          //图片重置
          $('#imgBox img').attr('src','./images/none.png');
        }
      }
    })
  })
  
  
});