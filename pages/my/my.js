const AV = require('../../libs/av-weapp-min.js');
// pages/my/my.js
var groupID;
var groupName;
var nickname;
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  onLoad: function () {
    var page = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var user = AV.User.current();
    var group = user.get("group");
    nickname = user.get("nickName");
    group.fetch().then(() => {
      groupID = group.id;
      groupName = group.get("name");
      page.setData({ groupName});
      if (group.get("administrator").id == user.id) {
        page.setData({ isAdministrator: true });
      }
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  exitGroup: function () {
    wx.showModal({
      title: '提示',
      content: '确认退出小组？',
      success: function (res) {
        if (res.confirm) {
          var userGroup = new AV.Query('userGroup');
          var user = AV.User.current();
          var group = user.get("group");
          userGroup.equalTo('group', group);
          userGroup.equalTo('user', user);
          userGroup.first().then(function (data) {
            data.destroy().then(() => {
              wx.switchTab({
                url: '../index/index',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              });
            }).catch(console.error);
          }).catch(console.error);
        }
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: nickname + '邀请你加入' + groupName,
      path: "/pages/invitesuccess/invitesuccess?group=" + groupID
    }
  },
  chemicaltools:function(){
    wx.navigateToMiniProgram({
      appId: 'wx59a108a0d63c98db',
      success(res) {
        // 打开成功
      }
    })
  }
})