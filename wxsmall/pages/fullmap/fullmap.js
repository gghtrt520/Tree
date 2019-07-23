// pages/fullmap/fullmap.js
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    enableSatellite: false,
    title: '地点选择',
    markers: {
      latitude: '39.980014',
      longitude: '116.313972',
      iconPath: './markers.png', //图标路径
      width: 20,
      height: 20
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey // 必填
    });
    this.data.markers.latitude = options.lat
    this.data.markers.longitude = options.lon
    this.setData({
      markers: this.data.markers
    })
  },
  /**
   * 地图显示模式
   */
  getMapModel(e) {
    let type = e.target.dataset.type;
    if (type - 0) {
      this.setData({
        enableSatellite: true
      })
    } else {
      this.setData({
        enableSatellite: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    console.log('a' + options)
    this.mapCtx = wx.createMapContext('myMap')
  },

  // 获取中心定位
  getCenterLocation: function (e) {
    var that = this
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    if (e.type == 'end' && e.causedBy == 'drag') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          that.data.markers.latitude = res.latitude
          that.data.markers.longitude = res.longitude
          that.setData({
            markers: that.data.markers
          })
          that.getLocalInfo(res)
        }
      })
    }
  },

  // 地址解析
  getLocalInfo(latLon) {
    var that = this
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    // 坐标地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latLon.latitude - 0,
        longitude: latLon.longitude - 0
      },
      sig: app.globalData.sig,
      success: function (res) { //成功后的回调
        console.log(res);
        that.setData({
          localInfo: res.result.formatted_addresses ? res.result.formatted_addresses.recommend : res.result.address
        })
        prevPage.setData({
          markers: that.data.markers,
          localInfo: res.result.formatted_addresses ? res.result.formatted_addresses.recommend : res.result.address
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
