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
    jiyuImg: app.globalData.server + "/upload/liyi.jpg",
    jiyutext: "寄语",
    huaTxt: "鲜花",
    liTxt: "祭果",
    liyiTxt: "祭拜"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 3){
      this.setData({
        bgImg: app.globalData.server + "/upload/3.jpg",
        huaImg: app.globalData.server + "/upload/a.png",
        liImg: app.globalData.server + "/upload/j.png",
        liyiImg: app.globalData.server + "/upload/e.png",
        jiyuImg: app.globalData.server + "/upload/h.jpg",
        jiyutext: "圣经",
        huaTxt: "蜡盏",
        liTxt: "十字架",
        liyiTxt: "圣经"
      })
    }
    if (options.type == 2) {
      this.setData({
        bgImg: app.globalData.server + "/upload/1.jpg",
        huaImg: app.globalData.server + "/upload/k.png",
        liImg: app.globalData.server + "/upload/f.png",
        liyiImg: app.globalData.server + "/upload/l.png",
        jiyuImg: app.globalData.server + "/upload/4.jpg",
        jiyutext: "偈语",
        huaTxt:"长蜡",
        liTxt: "捧香",
        liyiTxt: "香火钱"
      })
    }else{
      this.setData({
        bgImg: app.globalData.server + "/upload/2.jpg",
        huaImg: app.globalData.server + "/upload/b.png",
        liImg: app.globalData.server + "/upload/j.png",
        liyiImg: app.globalData.server + "/upload/d.png",
        jiyuImg: app.globalData.server + "/upload/4.jpg",
        jiyutext: "寄语",
        huaTxt: "鲜花",
        liTxt: "祭果",
        liyiTxt: "祭拜"
      })
    }
  },
  gotoPagePhotos(e){
    wx.navigateTo({
      url: '/pages/museum/photos/photos',
    })
  },
  gotoPageArticle(e) {
    wx.navigateTo({
      url: '/pages/museum/article/article',
    })
  },
  gotoPageVideos(e) {
    wx.navigateTo({
      url: '/pages/museum/videos/videos',
    })
  },
  goToEdit(e) {
    wx.navigateTo({
      url: '/pages/museum/create/create',
    })
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