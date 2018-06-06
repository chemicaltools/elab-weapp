const AV = require('../../libs/av-weapp-min.js');
var groupID;
var groupName;
// pages/invitesuccess/invitesuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
    }).catch(console.error);
    groupID = options.group;
    var groupQuery = new AV.Query('Group');
    groupQuery.get(groupID).then(function (group) {
      groupName = group.get('name');
      var userGroup = new AV.Query('userGroup');
      userGroup.equalTo('group', group);
      const user = AV.User.current();
      userGroup.equalTo('user', user);
      userGroup.count().then(function (count) {
        if (count == 0) {
          user.set("group", group);
          var UserGroupObject = AV.Object.extend('userGroup');
          var userGroupObject = new UserGroupObject();
          userGroupObject.set("user", user);
          userGroupObject.set("group", group);
          userGroupObject.save().then(() => {
            wx.showToast({
              title: '加入' + groupName + '成功！',
              icon: 'success',
            });
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              });
            }, 2000);
          }).catch(error => {
            this.setData({
              error: error.message,
            });
          });
        } else {
          wx.showToast({
            title: '您已加入' + groupName + '！',
            icon: 'loading',
          });
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index'
            });
          }, 2000);
        }
      }, function (error) {
        wx.showToast({
          title: '错误！',
          icon: 'loading',
        });
      });
    }, function (error) {
      wx.showToast({
        title: '小组不存在！',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index'
        });
      }, 2000);
    });
  }
})