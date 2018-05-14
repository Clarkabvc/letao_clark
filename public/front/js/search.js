// var arr = ["耐克", "阿迪", "阿迪王", "耐克王"];
// localStorage.setItem( "search_list", JSON.stringify( arr ));

$(function () {
  //1-进入页面获取历史记录,渲染到历史记录框中
  render();
  
  //封装获取历史记录的方法
  function getHistory() {
    //从本地存储读取历史记录
    var history = localStorage.getItem('search_list') || '[]';
    //转换成数组
    var arr = JSON.parse(history);
    return arr;
  }
  
  //封装渲染历史记录的方法
  function render() {
    var arr = getHistory();
    //配合模板引擎渲染数据
    var str = template('searchTmp', {list: arr});
    $('.history').html(str);
  }
  
  //2-清空历史记录,清空按钮动态渲染的,所以要委托
  $('.history').on('click', '.btn_empty', function () {
    mui.confirm('你是否要清空所有的历史记录?', '温馨提示', ['取消', '确定'], function (e) {
      if (e.index === 1) { //点击了确定按钮
        localStorage.removeItem('search_list'); //移除本地历史记录
        render(); //重新渲染
      }
    })
  });
  
  //3-点击删除某一条 事件委托
  $('.history').on('click', '.btn_delete', function (e) {
    var index = $(this).data('index');
    mui.confirm('你确定要删除这一条记录吗?', '温馨提示', ['取消', '确定'], function (e) {
      if (e.index === 1) { //点击了确定按钮
        var arr = getHistory();
        arr.splice(index, 1);  //删除对应索引的项
        localStorage.setItem('search_list', JSON.stringify(arr));
        render();   //重新渲染
      }
    })
  });
  
  //4-添加一条搜索记录
$('.search button').click(function () {
  //获取输入的关键字
  var key = $('.search input').val().trim();
  if(key === ""){
    mui.toast("请输入要搜索的关键字");
    return;
  }
  
  //获取数组
  var arr = getHistory();
  //a.如果有重复项,删掉之前的
  var  index = arr.indexOf(key);
  if(index > -1 ){
    arr.splice(index,1);
  }
  //b.历史记录长度不能大于10
  if(arr.length >= 10){
    arr.pop();
  }
  
  //添加到数组最前面
  arr.unshift( key );
  
  //同步数组到本地存储
  localStorage.setItem('search_list', JSON.stringify( arr ));
  
  //重新渲染搜索记录
  render();
  
  //清空搜索框
  $('.search input').val('');
  
  //跳转到搜索列表页
  location.href = "searchlist.html?key=" + key;
  
})
  
  
});