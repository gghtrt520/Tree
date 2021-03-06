// pages/search/search.js
const http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listImg:[],
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  searchData(e){
    this.getData(this.data.key);
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    let is_show = e.currentTarget.dataset.is_show
    if(is_show == 1){
      wx.showToast({
        title: '该纪念馆未开放',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: "/pages/tombstone/tombstone?id=" + id
    })
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

  },
  keyInput(e){
    this.setData({
      key: e.detail.value
    })
  },
  getData(key) {
    var that = this;
    http({
      url: "api/self",
      data: { name: key }
    }).then(res => {
      console.log(res);
      if (res.code == 1) {
        that.setData({
          listImg: res.data
        })
      }
    });
  },
})