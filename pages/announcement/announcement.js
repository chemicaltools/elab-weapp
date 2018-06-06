const AV = require('../../libs/av-weapp-min.js');
// pages/announcement/announcement.js
Page({
  data: {
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
    isAdministrator: false,
  },
  updateDraft: function ({
    detail: {
      value
    }
  }) {
    if (!value) return;
    this.setData({
      draft: value
    });
  },
  addTodo: function () {
    var page = this;
    var value = this.data.draft && this.data.draft.trim()
    if (!value) {
      return;
    }
    var Todo = AV.Object.extend('Annoucement');
    var todo = new Todo();
    todo.set('group', AV.User.current().get("group"))
    todo.set('content', value);
    todo.save().then(function (todo) {
      page.setData({
        draft: ''
      });
      page.setTodos([todo, ...page.data.todos]);
    }, function (error) {
      console.error(error);
    });
  },
  onReady: function (options) {
    this.fetchTodos();
  },
  onPullDownRefresh: function () {
    this.fetchTodos();
    wx.stopPullDownRefresh();
  },
  fetchTodos: function () {
    var page = this;
    var userGroup = new AV.Query('userGroup')
      .equalTo('group', AV.User.current().get('group'))
      .equalTo('user', AV.User.current())
      .first().then(function (todo) {
        var isAdministrator = todo.get("isAdministrator");
        page.setData({ isAdministrator })
      });
    const query = new AV.Query("Annoucement")
      .equalTo('group', AV.User.current().get("group"))
      .descending('createdAt')
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  editTodo: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    this.setData({
      editDraft: null,
      editedTodo: this.data.todos.filter(todo => todo.id === id)[0] || {}
    });
  },
  updateEditedContent: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      editDraft: value
    });
  },
  doneEdit: function ({
    target: {
      dataset: {
        id
      }
    }
  }) {
    const { todos, editDraft } = this.data;
    this.setData({
      editedTodo: {},
    });
    if (editDraft === null) return;
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    if (editDraft === currentTodo.content) return;
    currentTodo.set('content', editDraft);
    currentTodo.save().then(() => {
      this.setTodos(todos);
    }).catch(error => {
      console.log(error);
    }// console.error
      );
  },
  setTodos: function (todos) {
    //const activeTodos = todos.filter(todo => !todo.done);
    this.setData({
      todos,
      //activeTodos,
    });
    return todos;
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
    this.setData({
      editedTodo: {},
    });
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
});