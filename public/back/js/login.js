// 入口函数,可以防止全局变量污染
$(function () {
  //1-表单检验功能,在表单提交时,会进行校验
  //校验要求:(1):用户名不能为空,长度为2-6位
  //         (2):密码不能为空,长度为6-12位
  $('#form').bootstrapValidator({
    //指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //配置字段
    fields: {
      username: {
        validators: {
          //非空校验
          notEmpty: {
            message: '用户名不能为空' //提示信息
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名必须是2-6位'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      password: {
        validators: {
          //非空校验
          nonEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须是6-12位'
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });
  
  //2-基本登录功能
  //ajax提交表单,如果信息错误,可以很友好的提示
  //但是又要使用表单校验插件,该插件会在表单校验成功后提交表单,因此,要阻止插件的提交,然后使用ajax进行提交
  //success.form.bv 事件可以在表单验证通过时触发,该事件为插件内置的事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault(); //阻止默认的行为
    //验证通过后,使用ajax提交表单信息
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),  //表单序列化
      success: function (info) {
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
        if (info.error === 1000) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
      }
    })
  });
  
  //重置功能.点击重置后,表单文本和提示都需要重置
  $('[type=reset]').on('click', function () {
    $('#form').data('bootstrapValidator').resetForm(true);
  })
});