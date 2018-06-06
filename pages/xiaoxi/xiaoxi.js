const AV = require('../../libs/av-weapp-min.js');
const TextMessage = require('../../libs/realtime.weapp.min.js').TextMessage;
const realtime = getApp().globalData.realtime;
// pages/xiaoxi/xiaoxi.js
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
    var that = this;
    that.setTodos({ currentUser: AV.User.current() });
    realtime.createIMClient(AV.User.current()).then(function (user) {
      user.getQuery().containsMembers([AV.User.current().id]).withLastMessagesRefreshed(true).find().then(function (conversations) {
        var memberArray = [];
        conversations.map(function (conversation) {
          var member = conversation.members;
          var members = "";
          if (member.length > 1) {
            if (member[0] == AV.User.current().id) {
              members = member[1];
            } else {
              members = member[0];
            }
          } else {
            members = member[0];
          }
          that.setTodos([{ members, message: conversation.lastMessage /*, time: conversation.lastMessageAt.toString()*/ }, ...that.data.todos]);
          console.log(conversation.lastMessage);
          memberArray.push(members);
        });
      }).catch(console.error.bind(console));
    });
    /*
        var query = new AV.Query('_User');
        query.include('avatarUrl', 'nickName');
        query.find().then(function (users) {
          that.setData({ users });
        }, function (error) {
        });
        */

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
})