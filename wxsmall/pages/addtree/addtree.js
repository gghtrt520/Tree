// pages/addtree.js
const app = getApp()
const http = require("../../utils/http.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    videoPath: '',
    videoUrl: '',
    imgList: [],
    imgUrl: [],
    numberId: '',
    other: '',
    categoryInd: {
      id: -1,
      name: '无'
    },
    propertyInd: {
      id: -1,
      name: '无'
    },
    constructionInd: {
      id: -1,
      name: '无'
    },
    conservationInd: {
      id: -1,
      name: '无'
    },
    treeCategory: [],
    propertyUnit: [],
    constructionUnit: [],
    conservationUnit: [],
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
    this.setData({
      treeCategory: app.globalData.treeCategory,
      categoryInd: app.globalData.treeCategory[0] ? app.globalData.treeCategory[0] : { id: -1, name: '无' },
      propertyUnit: app.globalData.propertyUnit ,
      propertyInd: app.globalData.propertyUnit [0] ? app.globalData.propertyUnit [0] : { id: -1, name: '无' },
      constructionUnit: app.globalData.constructionUnit,
      constructionInd: app.globalData.constructionUnit[0] ? app.globalData.constructionUnit[0] : { id: -1, name: '无' },
      conservationUnit: app.globalData.conservationUnit,
      conservationInd: app.globalData.conservationUnit[0] ? app.globalData.conservationUnit[0] : { id: -1, name: '无' }
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
  treeSortSelect(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/indexes/indexes?id=' + e.currentTarget.id
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        const tempFilePaths = this.data.imgList.concat(res.tempFiles)
        if (tempFilePaths.length > 4) {
          wx.showToast({
            title: '目前只能上传4张',
            icon: 'none',
            duration: 2000
          })
        } else {
          this.setData({
            imgList: tempFilePaths
          })
        }
      }
    });
  },
  // 上传图片数组
  mapImg(){
    let promiseList = []
    wx.showLoading({
      title: '上传中',
    })
    this.data.imgList.map((item, index) => {
      var p = this.imgUpload(item.path)
      p.then(res => {
        console.log(res)
        this.data.imgUrl[index] = res
      })
      promiseList.push(p)
    })
    Promise.all(promiseList).then((res) => {
      let data = {}
      wx.hideLoading()
      data.number = this.data.numberId
      data.other = this.data.other
      data.latitude = this.data.markers.latitude
      data.longitude = this.data.markers.longitude
      data.image = this.data.imgUrl
      data.property = this.data.propertyInd.id
      data.construction = this.data.constructionInd.id
      data.conservation = this.data.conservationInd.id
      data.category = this.data.categoryInd.id
      console.log(data)
      http({
        url: '/api/create',
        data: data
      }).then(res => {
        wx.showToast({
          title: '上传成功',
          mask: true,
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
    }).catch((err) => {
      console.log(err)
    })
  },
  // 上传拍照
  imgUpload(tempFilePaths) {
    var that = this
    const openid = wx.getStorageSync('openid') || ''
    var p = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.app_url + '/api/upload', //上传地址
        filePath: tempFilePaths,
        name: 'image',
        formData: {
          'openid': openid
        },
        success(res) {
          const data = JSON.parse(res.data)
          console.log(data)
          //do something
          if (res.statusCode === 200 && data.status == 1) {
            resolve(data.data)
          } else {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败请重试',
              duration: 2000
            })
            reject('上传失败')
          }
        },
        fail(err) {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '上传失败请重试',
            duration: 2000
          })
          reject('上传失败')
        }
      })
    })
    return p;
  },
  // 删除照片
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
    // let path = this.data.imgUrl
    // http({
    //   url: '/api/delete-image',
    //   data: { path: path}
    // }).then(res => {
    //   wx.showToast({
    //     title: '删除成功',
    //     icon: 'none'
    //   })
    //   this.setData({
    //     imgPath: '',
    //     imgUrl: ''
    //   })
    // }).catch(err => {
    //   console.log(err)
    //   wx.showToast({
    //     title: '删除失败请重试',
    //     icon: 'none'
    //   })
    // })
  },
  // 刷新地图
  refreshMap() {
    var that = this
    getLocPos(that)
  },
  // 编码输入
  idInput(e){
    this.setData({
      numberId:e.detail.value
    })
  },
  // 其他信息
  textareaBInput(e){
    this.setData({
      other:e.detail.value
    })
  },
  // 上传数据
  uploadData(filepath) {
    if (!this.data.numberId) {
      wx.showToast({
        title: '请填写编码',
        icon: 'none'
      })
      return false
    }
    if (this.data.imgList.length == 0) {
      wx.showToast({
        title: '请上传树木照片',
        icon: 'none'
      })
      return false
    }
    this.mapImg()
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