// pages/museum/details/details.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "详情",
    bgImg: app.globalData.server + "/upload/peoplebg.jpg",
    avatarImg: app.globalData.server + "/upload/邵逸夫.jpg",
    huaImg: app.globalData.server + "/upload/hua.png",
    liImg: app.globalData.server + "/upload/lipin.png",
    liyiImg: app.globalData.server + "/upload/liyi.jpg",
    jiyuImg: app.globalData.server + "/upload/liyi.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 2){
      this.setData({
        bgImg: app.globalData.server + "/upload/peoplebg.jpg",
        huaImg: app.globalData.server + "/upload/hua.png",
        liImg: app.globalData.server + "/upload/lipin.png",
        liyiImg: app.globalData.server + "/upload/liyi.jpg",
        jiyuImg: app.globalData.server + "/upload/liyi.jpg"
      })
    }
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

  }
})