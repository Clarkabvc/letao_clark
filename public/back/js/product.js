$(function () {
  var currentPage = 1;
  var pageSize = 3;
  
  //申明一个数组,用于存储要进行提交上传的图片对象(地址,名称)
  var picArr = [];
  
  render();
  
  //1-发送请求,获取数据,渲染商品列表和分页标签
  function render() {
    //请求数据
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        //配合模板动态渲染数据
        var str = template('producttmp', info);
        $('.table-bordered tbody').html(str);
        
        //加载分页标签
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定版本
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),  //总页数
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          },
          size: "normal", //控制按钮大小
          itemTexts: function (type, page, current) {  //设置按钮为中文
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "第" + page + "页";
            }
          },
          useBootstrapTooltip: true
        })
      }
    })
  }
  
  //2-点击按钮,设置商品上架或者下架,事件委托
  $('.table tbody').on('click', 'button', function () {
    //获取点击商品的id
    var id = $(this).parent().data("id");
    alert("没有后台接口,无法操作!");
  });
  
  //3-点击添加商品,请求所有二级分类,显示模态框
  $('#addProduct').click(function () {
    $('#productModal').modal('show');
    //请求所有二级分类,渲染到下拉菜单里
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        //渲染二级分类列表
        var str = template('secondTmp', info);
        $('.dropdown-menu').html(str);
      }
    })
  });
  
  //4-给下拉列表注册点击事件,改变按钮文本,id传给input,事件委托
  $('.dropdown-menu').on('click', 'a', function () {
    //获取点击分类id和文本
    var id = $(this).data('id');
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    $('[name="brandId"]').val(id);
    
    //手动设置表单校验状态
    $('#form').data("bootstrapValidator").updateStatus('brandId', 'VALID');
  });
  
  //5-多文件上传功能
  //在jquery.fileupload 内部对文件上传的ajax操作进行了封装
  //如果是单一文件,发送一次上传请求
  //如果是多个文件,发送多次请求,遍历所选择的文件,进行多次请求,会有多次响应
  $('#fileUpload').fileupload({
    dataType: 'json', //返回数据类型
    done: function (e, data) {  //每张图片响应回来都会触发这个回调函数
      var picUrl = data.result.picAddr; //获取图片地址
      
      var picObj = data.result;   //图片对象,包括图片地址和名称
      
      //响应一次,生成一个img标签添加到imgbox中
      $('#imgBox').prepend('<img src ="' + picUrl + '" width="100">');
      
      //把图片对象存到数组里
      picArr.unshift(picObj); //每次放到第一个位置
      
      //如果图片超过3张,把最后一个删掉
      if (picArr.length > 3) {
        picArr.pop();
        //同时删掉imgbox里最后一个图片
        $('#imgBox img:last-of-type').remove();
      }
      
      //如果满足3张图片,手动更新校验状态
      if (picArr.length === 3) {
        $('#form').data('bootstrapValidator').updateStatus('imgChecked', 'VALID');
      }
      
    }
    
    
  });
  
  //6-表单校验功能
  $('#form').bootstrapValidator({
    excluded: [], //默认不校验隐藏域,需要重置
    //指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验的字段
    fields: {
      //选择二级分类
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      //商品名称
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      //商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      //商品库存 要求:必须是非零开头的数字
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '必须是非零开头的数字'
          }
        }
      },
      //商品尺码 要求:dd-dd
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是dd-dd格式,如35-44'
          }
        }
      },
      //商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      //商品现价
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品现价'
          }
        }
      },
      //图片上传3张
      imgChecked: {
        validators: {
          notEmpty: {
            message: '请上传3张图片'
          }
        }
      }
    }
  });
  
  
  //7-点击添加按钮,保留表单的校验功能,阻止表单提交,改用ajax提交数据
  $('#addbtn').on('click', function (e) {
    e.preventDefault();
    //将表单内容拼接字符串,提交给后台
    var str = $('#form').serialize();
    str += "&picName1=" + picArr[0].picName + "&picAdd1=" + picArr[0].picAddr;
    str += "&picName2=" + picArr[1].picName + "&picAdd2=" + picArr[1].picAddr;
    str += "&picName3=" + picArr[2].picName + "&picAdd3=" + picArr[2].picAddr;
    
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: str,
      success: function (info) {
        if (info.success) {
          //添加成功,重置并关闭模态框
          $('#form').data('bootstrapValidator').resetForm(true);
          $('#productModal').modal('hide');
          
          //重新渲染第一页
          currentPage = 1;
          render();
          
          //重置文本
          $('#dropdownText').text('请选择二级分类');
          
          //删除所有图片
          $('#imgBox img').remove();
          
          //清空数组,否则校验一直通过
          picArr = [];
        }
      }
    });
    
  });
  
  
});