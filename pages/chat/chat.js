const AV = require('../../libs/av-weapp-min.js');
const TextMessage = require('../../libs/realtime.weapp.min.js').TextMessage;
// pages/chat/chat.js
const realtime = getApp().globalData.realtime;
var toid;
var timer;
var toObject;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos: [],
    isIpx: getApp().globalData.isIpx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    toid = options.username;
    var query = new AV.Query('_User');
    query.get(toid).then(function (todo) {
      wx.setNavigationBarTitle({
        title: '与'+todo.get("nickName")+"聊天"
      })
      that.setData({ from: AV.User.current(), touser: todo });
      toObject = todo;
      that.fetchTodos();
      that.Countdown();
    }, function (error) {
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setTodos: function (todos) {
    this.setData({
      todos,
    });
    return todos;
  },
  addTodo: function () {
    var page = this;
    var value = this.data.draft && this.data.draft.trim()
    if (!value) {
      return;
    }
    realtime.createIMClient(AV.User.current()).then(function (user) {
      return user.createConversation({
        members: [toid],
        transient: false,
        unique: true,
      });
    }).then(function (conversation) {
      var CONVERSATION_ID = conversation.id;
      var message = new TextMessage(value);
      message.setAttributes({
        send_nickname: AV.User.current().get("nickName"),
        send_url: AV.User.current().get("avatarUrl"),
        to_nickname: toObject.get("nickName"),
        to_url: toObject.get("avatarUrl"),
      });
      return conversation.send(message);
    }).then(function (message) {
      //console.log('Message received: ' + message.text);
      page.setData({
        draft: ''
      });
      page.fetchTodos();
    }).catch(console.error);
  },
  updateDraft: function ({
    detail: {
      value
    }
  }) {
    // Android 真机上会诡异地触发多次时 value 为空的事件
    if (!value) return;
    this.setData({
      draft: value
    });
  },
  fetchTodos: function () {
    var that = this;
    realtime.createIMClient(AV.User.current()).then(function (user) {
      return user.createConversation({
        members: [toid],
        transient: false,
        unique: true,
      });
    }).then(function (conversation) {
      conversation.queryMessages({
        limit: 1000, // limit 取值范围 1~1000，默认 20
      }).then(function (messages) {
        // 最新的十条消息，按时间增序排列
        that.setData({ messages });
      }).catch(console.error.bind(console));
    });
  },
  Countdown: function () {
    var that = this;
    timer = setTimeout(function () {
      that.Countdown();
    }, 5000);
  },
})