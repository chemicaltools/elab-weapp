const AV = require('../../libs/av-weapp-min.js');
// pages/groupchange/groupchange.js
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
    var page = this;
    const query = new AV.Query("userGroup")
      .equalTo('user', AV.User.current())
      .ascending('createdAt')
      .include('group')
      .find()
      .then(function (todos) {
        page.setData({ todos });
      }
      )
      .catch(console.error);
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  change: function ({ target: {
    dataset: {
      id
    }
  }
  }) {
    var group = AV.Object.createWithoutData('Group', id);
    AV.User.current().set("group", group).save()
      .then(() => {
        wx.showToast({
          title: '切换成功！',
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
      });;
  }
})