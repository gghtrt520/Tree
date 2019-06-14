// pages/addtree.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    selectInd: 0,
    treeSort: [{
      id: 0,
      name: '无脊柱动物'
    },
    {
      id: 1,
      name: '脊柱动物'
    }],
    markers: {
      label: {
        content: '您的位置',
        anchorX: -24,
        textAlign: 'left'
        ,
      },
      latitude: '39.980014',
      longitude: '116.313972',
      iconPath: './markers.png', //图标路径
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
  // 树种选择
  treeSortChange(e) {
    this.setData({
      selectInd: e.detail.value
    })
  },
  // 拍照
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        this.setData({
          imgPath: res.tempFilePaths[0]
        })
      }
    });
  },
  // 删除照片
  DelImg(e) {
    this.setData({
      imgPath: ''
    })
  },
  // 刷新地图
  refreshMap(){
    var that = this
    getLocPos(that)
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

function getLocPos(that){
  // 获取用户信息
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
                that.data.markers.latitude = res.latitude
                that.data.markers.longitude = res.longitude
                that.setData({
                  markers: that.data.markers
                })
                console.log(res)
              }
            })
          },
          fail() {
            wx.showToast({
              title: '定位失败',
              icon: 'none',
              complete() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        })
      } else {
        wx.getLocation({
          type: 'gcj02',
          success(res) {
            console.log(res)
            that.data.markers.latitude = res.latitude
            that.data.markers.longitude = res.longitude
            that.setData({
              markers: that.data.markers
            })
          }
        })
      }
    }
  })
}