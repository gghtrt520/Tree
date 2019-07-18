// pages/detail/detail.js
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = ''
const util = require('../../utils/util.js')
const http = require("../../utils/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    tree_id: '',
    is_write: '不可录入',
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
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey // 必填
    });
    getLocPos(that)
    // 树木详情
    http({
      url: '/api/tree-detail',
      data: {tree_id: options.id}
    }).then(res => {
      if (res.status == 1) {
        console.log(res.data)
        this.data.markers.latitude = res.data.latitude
        this.data.markers.longitude = res.data.longitude
        if (res.data.tree_image && res.data.tree_image.length>0){
          res.data.tree_image = res.data.tree_image.map(item=>{
            item.tree_image = app.globalData.app_url + item.tree_image
            return item
          })
        }
        if (res.data.tree_video){
          res.data.tree_video = app.globalData.app_url + res.data.tree_video
        }
        this.setData({
          detail:res.data,
          tree_id: options.id,
          is_write: app.globalData.is_write,
          markers: this.data.markers
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 跳转修改页面
  goEditePage(e){
    wx.redirectTo({
      url: "/pages/addtree/addtree?id=" + this.data.tree_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 砍伐
  cutBtn(e) {
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 全屏预览图片
  fullImg(e) {
    console.log(e.target.dataset.url)
    let arr = []
    arr = this.data.detail.tree_image.map(item=>{
      return item.tree_image
    })
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  // 移植
  moveBtn(e) {
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 调起手机导航
  openMap(){
    var that = this
    // 坐标地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.markers.latitude - 0,
        longitude: that.data.markers.longitude - 0
      },
      sig: app.globalData.sig,
      success: function (res) { //成功后的回调
        console.log(res);
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: that.data.markers.latitude - 0, //要去的纬度-地址
          longitude: that.data.markers.longitude - 0, //要去的经度-地址
          name: res.result.ad_info.name,
          address: res.result.address
        })
      },
      fail: function (error) {
        console.error(error);
        wx.showToast({
          title: '导航失败请重试',
          icon: 'none'
        })
      }
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