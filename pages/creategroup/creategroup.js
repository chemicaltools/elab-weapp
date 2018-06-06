const AV = require('../../libs/av-weapp-min.js');
// pages/creategroup/creategroup.js
Page({
  data: {
    groupname: "",
  },
  updateGroupname: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      groupname: value
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  save: function () {
    this.setData({
      error: null,
    });
    const { groupname } = this.data;
    var GroupObject = AV.Object.extend('Group');
    var groupObject = new GroupObject();
    var UserGroup = AV.Object.extend('userGroup');
    var userGroup = new UserGroup();
    const user = AV.User.current();
    groupObject.set("name", groupname);
    groupObject.set("administrator", user);
    user.set("group", groupObject);
    userGroup.set("user", user);
    userGroup.set("group", groupObject);
    userGroup.set("isAdministrator", true);
    userGroup.save().then(() => {
      wx.showToast({
        title: '创建成功',
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
  }
})