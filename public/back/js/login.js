// 入口函数,可以防止全局变量污染
$(function(){
  //1-表单检验功能,在表单提交时,会进行校验
  //校验要求:(1):用户名不能为空,长度为2-6位
  //         (2):密码不能为空,长度为6-12位
  $('#form').bootstrapValidator({
    //指定校验时的图标显示
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //配置字段
    fields:{
      username:{
        validators:{
          //非空校验
          notEmpty:{
            message:'用户名不能为空' //提示信息
          },
          //长度校验
          stringLength:{
            min:2,
            max:6,
            message:'用户名必须是2-6位'
          },
          callback:{
            message:'用户名不存在'
          }
        }
      },
      password:{
        validators:{
          //非空校验
          nonEmpty:{
            message:'密码不能为空'
          },
          //长度校验
          stringLength:{
            min:6,
            max:12,
            message:'密码长度必须是6-12位'
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  });
  
  
  
});