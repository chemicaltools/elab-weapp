const AV = require('../../libs/av-weapp-min.js');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    groupName: '未加入小组',
    todos: []
  },
  onLoad: function () {
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
    this.fetchTodos();
  },
  onPullDownRefresh: function () {
    this.fetchTodos();
    wx.stopPullDownRefresh();
  },
  fetchTodos: function () {
    var page = this;
    const user = AV.User.current();
    var group = user.get("group");
    if (group != null) {
      var userGroup = new AV.Query('userGroup');
      userGroup.equalTo('group', group);
      userGroup.equalTo('user', user);
      userGroup.count().then(function (count) {
        if (count > 0) {
          group.fetch().then(function () {
            var groupName = group.get("name");
            page.setData({
              groupName: groupName
            });
          });
          const annoucementQuery = new AV.Query("Annoucement")
            .equalTo('group', group)
            .descending('createdAt')
            .limit(3)
            .find()
            .then(todos => page.setData({ todos }))
            .catch(console.error);
        } else {
          user.set("group", null).save().then(() => {
            const query = new AV.Query("userGroup")
              .equalTo('user', AV.User.current())
              .ascending('createdAt')
              .include('group')
              .count()
              .then(function (count) {
                if (count > 0) {
                  wx.redirectTo({
                    url: "../groupchange/groupchange"
                  })
                } else {
                  wx.redirectTo({
                    url: "../creategroup/creategroup"
                  })
                }
              }
              )
              .catch(console.error);
          }).catch(console.error);
        }
      });
    } else {
      const query = new AV.Query("userGroup")
        .equalTo('user', AV.User.current())
        .ascending('createdAt')
        .include('group')
        .count()
        .then(function (count) {
          if (count > 0) {
            wx.redirectTo({
              url: "../groupchange/groupchange"
            })
          } else {
            wx.redirectTo({
              url: "../creategroup/creategroup"
            })
          }
        }
        )
        .catch(console.error);
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  open: function ({ target: {
    dataset: {
      page
    }
  }
  }) {
    wx.navigateTo({
      url: page
    })
  },
  update: function ({
    detail: {
      value
    }, target: {
    dataset: {
      name
    }
  }
  }) {
    if (name == "input") this.setData({ input: value });
  },
})
