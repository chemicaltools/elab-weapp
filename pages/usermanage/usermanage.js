const AV = require('../../libs/av-weapp-min.js');
Page({
  data: {
    todos: [],
    user:null,
    isAdministrator:false,
  },
  onLoad: function () {
    this.fetchTodos();
  },
  onPullDownRefresh: function () {
    this.fetchTodos();
    wx.stopPullDownRefresh();
  },
  fetchTodos: function () {
    var page=this;
    AV.User.current().get("group").fetch();
    var userGroup = new AV.Query('userGroup')
      .equalTo('group', AV.User.current().get('group'))
      .equalTo('user', AV.User.current())
      .first().then(function (todo) {
        var isAdministrator = todo.get("isAdministrator");
        page.setData({ isAdministrator })
      });
    const query = new AV.Query("userGroup")
      .equalTo('group', AV.User.current().get("group"))
      .ascending('createdAt')
      .include('user')
      .find()
      .then(function (todos) {
          page.setData({ todos, user: AV.User.current() });
        }
        )
      .catch(console.error);
  },
  setAdministrator: function({target:{dataset:{id}},target:{dataset: {work}}}){
      var page=this;
      var setAdmin=false;
      if(work=="add")setAdmin=true;
      var todo = AV.Object.createWithoutData('userGroup', id)
        .set('isAdministrator', setAdmin).save().then(() => {
          wx.showToast({
            title: '更改权限成功！',
            icon: 'success',
          });
          page.fetchTodos();
        }).catch(error => {
          this.setData({
            error: error.message,
          });
        });
  },
  deleteTodo: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    var page = this;
    const { todos } = this.data;
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          const currentTodo = todos.filter(todo => todo.id === id)[0];                     
          currentTodo.destroy().then(() => {
              page.setTodos(todos.filter(todo => todo.id != currentTodo.id));
            }).catch(console.error);
        } else if (res.cancel) {

        }
      }
    })
  },
  setTodos: function (todos) {
    //const activeTodos = todos.filter(todo => !todo.done);
    this.setData({
      todos,
      //activeTodos,
    });
    return todos;
  }
})