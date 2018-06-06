const AV = require('../../libs/av-weapp-min.js');
// pages/reagentAdd/reagentAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    company: '',
    place: '',
    number: '',
    error: null,
  },
  updateName: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      name: value
    });
  },
  updateCompany: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      company: value
    });
  },
  updatePlace: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      place: value
    });
  },
  updateNumber: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      number: value
    });
  },
  save: function () {
    var page = this;
    this.setData({
      error: null,
    });
    const { name, company, place, number } = this.data;
    const user = AV.User.current();
    var group = user.get("group");
    var reagentQuery = new AV.Query('Reagents');
    reagentQuery.equalTo('group', group);
    reagentQuery.equalTo('name', name);
    reagentQuery.equalTo('company', company);
    reagentQuery.equalTo('place', place);
    reagentQuery.count().then(function (count) {
      if (count > 0) {
        reagentQuery.first().then(function (data) {
          data.increment('number', parseFloat(number));
          data.save().then(() => {
            wx.showToast({
              title: '添加成功！',
              icon: 'success',
            });
            page.setData({
              name: '',
              company: '',
              place: '',
              number: '',
            });
          }).catch(error => {
            this.setData({
              error: error.message,
            });
          });
        }).catch(error => {
          this.setData({
            error: error.message,
          });
        });
      } else {
        var ReagentObject = AV.Object.extend('Reagents');
        var reagentObject = new ReagentObject();
        reagentObject.set("group", group);
        reagentObject.set("name", name);
        reagentObject.set("company", company);
        reagentObject.set("place", place);
        reagentObject.set("number", parseFloat(number));
        reagentObject.save().then(() => {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
          });
          page.setData({
            name: '',
            company: '',
            place: '',
            number: '',
          });
        }).catch(error => {
          this.setData({
            error: error.message,
          });
        });
      }
    }).catch(error => {
      this.setData({
        error: error.message,
      });
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})