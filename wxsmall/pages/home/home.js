// pages/home/home.js
const http = require("../../utils/http.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tip: '权限审核中,请耐心等待',
    type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.type == 0) {
      this.setData({
        tip: '账号已创建，请点击按钮申请用户权限',
        type: 0
      })
    }
    if (options.type == 1) {
      this.setData({
        tip: '权限审核中,请耐心等待',
        type: 1
      })
    }
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

  // 申请授权
  getApply(e) {
    http({
      url: '/api/apply'
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: 'none',
        content: '申请成功'
      })
      this.setData({
        tip: '权限审核中,请耐心等待',
        type: 1
      })
    }).catch(err => {
      console.log(err)
      sortList()
    })
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