// pages/detail/detail.js
const app = getApp();
const util = require('../../utils/util.js')
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    markers: {
      label: {
        content: '树木位置',
        anchorX: -24,
        textAlign: 'left',
      },
      latitude: '39.980014',
      longitude: '116.313972',
      iconPath: './tree.png', //图标路径
      width: 20,
      height: 20
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    getLocPos(that)
    // 分类列表
    http({
      url: '/api/tree-detail',
      data: {tree_id: options.id}
    }).then(res => {
      if (res.status == 1) {
        console.log(res.data)
        this.data.markers.latitude = res.data.latitude
        this.data.markers.longitude = res.data.longitude
        this.setData({
          detail:res.data,
          markers: this.data.markers
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 调起手机导航
  openMap(){
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: this.data.markers.latitude - 0,//要去的纬度-地址
      longitude: this.data.markers.longitude - 0,//要去的经度-地址
      name: this.data.city + this.data.district,
      address: this.data.city + this.data.district
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

  }
})

// 获取用户定位
function getLocPos(that) {
  wx.getSetting({
    success: res => {
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          success() {
            // 用户已经同意小程序使用
            wx.getLocation({
              type: 'gcj02',
              success(res) {
                console.log(res)
              }
            })
          },
          fail() {
            wx.showToast({
              title: '定位失败',
              icon: 'none',
              complete() {
                backTime()
              }
            })
          }
        })
      }
    }
  })
}
// 定时返回
function backTime() {
  setTimeout(() => {
    wx.navigateBack({
      delta: 1
    })
  }, 1500)
}