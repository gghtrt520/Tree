// pages/addtree.js
const app = getApp()
const http = require("../../utils/http.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    categoryInd: 0,
    propertyInd: 0,
    constructionInd: 0,
    conservationInd: 0,
    treeCategory: [{
      id: -1,
      name: '无'
    }],
    propertyUnit: [{
      id: -1,
      name: '无'
    }],
    constructionUnit: [{
      id: -1,
      name: '无'
    }],
    conservationUnit: [{
      id: -1,
      name: '无'
    }],
    markers: {
      label: {
        content: '您的位置',
        anchorX: -24,
        textAlign: 'left',
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
  onLoad: function() {
    var that = this
    getLocPos(that)
    // 分类列表
    http({
      url: '/api/get-list',
    }).then(res => {
      if (res.status == 1) {
        this.setData({
          treeCategory: res.data.tree_category,
          propertyUnit: res.data.property_unit,
          constructionUnit: res.data.construction_unit,
          conservationUnit: res.data.conservation_unit,
        })
      }
    }).catch(err => {
      console.log(err)
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
  // 树种选择
  treeSortChange(e) {
    let obj = JSON.parse(`{"${e.currentTarget.id}":${e.detail.value}}`)
    console.log(obj)
    this.setData(obj)
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
  refreshMap() {
    var that = this
    getLocPos(that)
  },
  // 数据入库操作
  upload() {
    let openid = wx.getStorageSync('openid') || ''
    if (!this.data.imgPath) {
      wx.showToast({
        title: '请上传树木照片',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    wx.uploadFile({
      url: app.globalData.app_url + '/api/upload', //上传地址
      filePath: this.data.imgPath,
      name: 'image',
      formData: {
        'openid': openid
      },
      success(res) {
        const data = res.data
        //do something
        this.uploadData()
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败请重试',
          icon: 'none'
        })
      }
    })
  },
  // 上传数据
  uploadData(filepath) {
    wx.hideLoading()
    http({
      url: '',
      method: 'post',
      data: ''
    }).then(res => {
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      })
      backTime()
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '上传失败请重试',
        icon: 'none'
      })
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
                backTime()
              }
            })
          }
        })
      } else {
        wx.getLocation({
          type: 'gcj02',
          success(res) {
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

// 定时返回
function backTime() {
  setTimeout(() => {
    wx.navigateBack({
      delta: 1
    })
  }, 1500)
}