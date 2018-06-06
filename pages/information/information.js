const AV = require('../../libs/av-weapp-min.js');
var list;
var input;
// pages/information/information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    list = options.list;
    if (list == "search") {
      input = options.input;
      this.fetchSearch(input);
    } else {
      this.fetchTodos();
    }
  },
  onPullDownRefresh: function () {
    if (list == "search") {
      this.fetchSearch(input);
    } else {
      this.fetchTodos();
    }
    wx.stopPullDownRefresh();
  },
  fetchTodos: function () {
    const query = new AV.Query("Reagents")
      .equalTo('group', AV.User.current().get("group"))
      .descending('createdAt')
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  fetchSearch: function (input) {
    var that = this;
    const query = new AV.SearchQuery('Reagents');
    query.equalTo('group', AV.User.current().get("group"));
    query.queryString(input);
    query.find().then(function (todos) {
      console.log("Find " + query.hits() + " docs.");
      that.setData({ todos });
    }).catch(function (err) {
      //处理 err
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