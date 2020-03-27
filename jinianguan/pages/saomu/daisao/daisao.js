// pages/saomu/daisao/daisao.js
const app = getApp();
const http = require("../../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg: app.globalData.server + 'upload/saomu2.jpg',
    date: "",
    time1: "08:00",
    time2: "08:00",
    cemetery: "",
    name: "",
    card: "",
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var day2 = new Date();
    day2 = day2.setDate(day2.getDate() + 1);
    day2 = new Date(day2);
    day2.setTime(day2.getTime());
    var month = day2.getMonth() + 1 > 9 ? day2.getMonth() + 1 : '0' + (day2.getMonth() + 1);
    var day = day2.getDate() > 9 ? day2.getDate() : '0' + day2.getDate();
    var s2 = day2.getFullYear() + "-" + month + "-" + day;

    this.setData({
      date: s2
    })
  },
  cemeteryInput(e) {
    this.setData({
      cemetery: e.detail.value
    })
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  cardInput(e) {
    this.setData({
      card: e.detail.value
    })
  },
  yuyueBtn() {
    if (!this.data.cemetery){
      wx.showToast({
        title: '请输入墓园名称',
        icon: 'none'
      });
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
    }
    if (!this.data.card) {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none'
      });
    }
    http({
      url: 'api/appointmentcreate',
      data: {
        cemetery: this.data.cemetery,
        date: this.data.date,
        start: this.data.date + " " + this.data.time1,
        end: this.data.date + " " + this.data.time2,
        name: this.data.name,
        phone: this.data.phone,
        idcard: this.data.card
      }
    }).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  Time1Change(e) {
    this.setData({
      time1: e.detail.value
    })
  },
  Time2Change(e) {
    this.setData({
      time2: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})