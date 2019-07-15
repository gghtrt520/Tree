// pages/addtree.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = ''
const http = require("../../utils/http.js")
const util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    rule: app.globalData.rule,
    videoPath: '',
    delArr: [],
    videoUrl: '',
    isEdite: false,
    imgList: [],
    imgUrl: [],
    numberId: '',
    treeName: '',
    crown: '',
    diameter: '',
    heightTree: '',
    other: '',
    modalName: null,
    treeState: ['非常健康', '健康', '一般', '较差', '非常差', '死亡'],
    stateInd: 0,
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
    currentId: '',
    tree_id: 0,
    treeCategory: [],
    propertyUnit: [],
    constructionUnit: [],
    conservationUnit: [],
    markers: {
      latitude: '39.980014',
      longitude: '116.313972',
      iconPath: './markers.png', //图标路径
      width: 20,
      height: 20
    },
    localInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey // 必填
    });
    console.log(options)
    if (options.id) {
      this.getDetail(options.id)
    } else {
      getLocPos(that)
    }
    this.setData({
      rule: app.globalData.rule,
      treeCategory: app.globalData.treeCategory,
      categoryInd: app.globalData.treeCategory[0] ? app.globalData.treeCategory[0] : {
        id: -1,
        name: '无'
      },
      propertyUnit: app.globalData.propertyUnit,
      propertyInd: app.globalData.propertyUnit[0] ? app.globalData.propertyUnit[0] : {
        id: -1,
        name: '无'
      },
      constructionUnit: app.globalData.constructionUnit,
      constructionInd: app.globalData.constructionUnit[0] ? app.globalData.constructionUnit[0] : {
        id: -1,
        name: '无'
      },
      conservationUnit: app.globalData.conservationUnit,
      conservationInd: app.globalData.conservationUnit[0] ? app.globalData.conservationUnit[0] : {
        id: -1,
        name: '无'
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 获取中心定位
  getCenterLocation: function(e) {
    var that = this
    if (e.type == 'end' && e.causedBy == 'drag') {
      this.mapCtx.getCenterLocation({
        success: function(res) {
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
  // 获取详情
  getDetail(id) {
    http({
      url: '/api/tree-detail',
      data: {
        tree_id: id
      }
    }).then(res => {
      if (res.status == 1) {
        console.log(res.data)
        this.data.markers.latitude = res.data.latitude
        this.data.markers.longitude = res.data.longitude
        if (res.data.tree_image && res.data.tree_image.length > 0) {
          res.data.tree_image = res.data.tree_image.map(item => {
            item.tree_image = app.globalData.app_url + item.tree_image
            item.path = item.tree_image
            return item
          })
        }
        if (res.data.tree_video) {
          res.data.tree_video = app.globalData.app_url + res.data.tree_video
        }
        this.setData({
          detail: res.data,
          isEdite: true,
          numberId: res.data.tree_number,
          categoryInd: {
            id: res.data.category_id,
            name: res.data.category
          },
          propertyInd: {
            id: res.data.property_unit_id,
            name: res.data.property_unit
          },
          conservationInd: {
            id: res.data.conservation_unit_id,
            name: res.data.conservation_unit
          },
          constructionInd: {
            id: res.data.construction_unit_id,
            name: res.data.construction_unit
          },
          stateInd: util.getArrInd(this.data.treeState, res.data.health),
          treeName: res.data.tree_name,
          crown: res.data.crown,
          diameter: res.data.diameter,
          heightTree: res.data.height,
          other: res.data.other,
          videoPath: res.data.tree_video,
          imgList: res.data.tree_image,
          tree_id: id,
          markers: this.data.markers
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 添加新数据
  uploadTree(data){
    http({
      url: '/api/create',
      data: data
    }).then(res => {
      if (res.status) {
        wx.showToast({
          title: '上传成功',
          mask: true,
          icon: 'success'
        })
        backTime()
      } else {
        wx.showToast({
          title: res.message,
          mask: true,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '上传失败请重试',
        icon: 'none'
      })
    })
  },
  // 更新老数据
  updateTree() {
    var data = {}
    data.id = this.data.tree_id
    data.image = this.data.imgUrl
    data.TreeInformation = {
      tree_number: this.data.numberId,
      tree_name: this.data.treeName,
      other: this.data.other,
      latitude: this.data.markers.latitude,
      longitude: this.data.markers.longitude,
      tree_video: this.data.videoUrl,
      health: this.data.treeState[this.data.stateInd],
      crown: this.data.crown,
      diameter: this.data.diameter,
      height: this.data.heightTree,
      property_unit_id: this.data.propertyInd.id,
      construction_unit_id: this.data.constructionInd.id,
      conservation_unit_id: this.data.conservationInd.id,
      tree_category_id: this.data.categoryInd.id
    }
    this.delImgArr(this.data.delArr)
    this.delVideoStr(this.data.tree_id)
    setTimeout(()=>{
      http({
        url: '/api/update',
        data: data
      }).then(res => {
        if (res.status) {
          wx.showToast({
            title: '上传成功',
            mask: true,
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/admin/admin'
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.message,
            mask: true,
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '上传失败请重试',
          icon: 'none'
        })
      })
    },500)
  },
  // 模态窗
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 树木健康状态
  radioChange: function(e) {
    this.setData({
      stateInd: e.detail.value
    })
  },
  // 全屏地图
  goFullmap() {
    wx.navigateTo({
      url: '/pages/fullmap/fullmap?lat=' + this.data.markers.latitude + '&lon=' + this.data.markers.longitude
    })
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
  // 视频选择与删除
  ChooseVideo() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 10,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        that.setData({
          videoPath: res.tempFilePath
        })
      }
    })
  },
  Delvideo() {
    this.setData({
      videoPath: ''
    })
  },
  // 上传图片数组
  mapImg() {
    var that = this
    let promiseList = []
    wx.showLoading({
      title: '上传中',
    })
    this.data.imgList.map((item, index) => {
      let path = "" + item.path
      let ind = path.indexOf('upload')
      // console.log(ind)
      if (ind != -1){
        // item.path = urlSub(item.path)
        // this.data.imgUrl[index] = item
      } else {
        var p = this.imgUpload(item.path)
        p.then(res => {
          console.log(res)
          this.data.imgUrl.push(res)
        })
        promiseList.push(p)
      }
    })
    let vpath = "" + this.data.videoPath
    let vind = this.data.videoPath.indexOf('upload')
    console.log(vind)
    if (this.data.videoPath && vind == -1) {
      const openid = wx.getStorageSync('openid')
      var vp = new Promise((resolve, reject) => {
        wx.uploadFile({
          url: app.globalData.app_url + '/api/video', //上传地址
          filePath: that.data.videoPath,
          name: 'video',
          formData: {
            'openid': openid
          },
          success(res) {
            const data = JSON.parse(res.data)
            console.log(data)
            //do something
            if (res.statusCode === 200 && data.status == 1) {
              resolve(data.data)
              that.data.videoUrl = data.data.path
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
      promiseList.push(vp)
    } else {
      this.data.videoUrl = urlSub(this.data.videoPath)
    }
    Promise.all(promiseList).then((res) => {
      let data = {}
      wx.hideLoading()
      data.number = this.data.numberId
      data.other = this.data.other
      data.latitude = this.data.markers.latitude
      data.longitude = this.data.markers.longitude
      data.image = this.data.imgUrl
      data.video = this.data.videoUrl
      data.crown = this.data.crown
      data.diameter = this.data.diameter
      data.height = this.data.heightTree
      data.name = this.data.treeName
      data.health = this.data.treeState[this.data.stateInd]
      data.property = this.data.propertyInd.id
      data.construction = this.data.constructionInd.id
      data.conservation = this.data.conservationInd.id
      data.category = this.data.categoryInd.id
      console.log(data)
      if (this.data.isEdite){
        this.updateTree()
      } else {
        this.uploadTree(data)
      }
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
    let del = this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    let path = "" + del[0].path
    let ind = path.indexOf('upload')
    this.setData({
      imgList: this.data.imgList
    })
    if (ind != -1){
      this.data.delArr.push(del[0]) 
    }
  },
  // 删除照片数组
  delImgArr(arr){
    arr.map((item)=>{
      console.log(item)
      http({
        url: '/api/delete-image',
        data: { id: item.id }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    })
  },
  // 删除照片数组
  delVideoStr(id) {
    let path = "" + this.data.videoPath
    let ind = path.indexOf('upload')
    if(ind != -1){
      return false
    }
    http({
      url: '/api/delete-video',
      data: { id: id }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  // 刷新地图
  refreshMap() {
    var that = this
    getLocPos(that)
  },
  // 编码输入
  idInput(e) {
    this.setData({
      numberId: e.detail.value
    })
  },
  // 名称输入
  nameInput(e) {
    this.setData({
      treeName: e.detail.value
    })
  },
  // 冠幅输入
  crownInput(e) {
    this.setData({
      crown: e.detail.value
    })
  },
  // 胸径输入
  diameterInput(e) {
    this.setData({
      diameter: e.detail.value
    })
  },
  // 高度输入
  heightInput(e) {
    this.setData({
      heightTree: e.detail.value
    })
  },
  // 其他信息
  textareaBInput(e) {
    this.setData({
      other: e.detail.value
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
    if (!this.data.treeName) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return false
    }
    if (!this.data.diameter) {
      wx.showToast({
        title: '请填写冠幅',
        icon: 'none'
      })
      return false
    } else {
      if (!validNumber(this.data.diameter - 0)) {
        return false
      }
    }
    if (!this.data.crown) {
      wx.showToast({
        title: '请填写胸径',
        icon: 'none'
      })
      return false
    } else {
      if (!validNumber(this.data.crown - 0)) {
        return false
      }
    }
    if (!this.data.heightTree) {
      wx.showToast({
        title: '请填写高度',
        icon: 'none'
      })
      return false
    } else {
      if (!validNumber(this.data.heightTree - 0)) {
        return false
      }
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
  // 地址解析
  getLocalInfo(latLon) {
    var that = this
    // 坐标地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latLon.latitude - 0,
        longitude: latLon.longitude - 0
      },
      sig: app.globalData.sig,
      success: function(res) { //成功后的回调
        console.log(res);
        that.setData({
          localInfo: res.result.formatted_addresses ? res.result.formatted_addresses.recommend : res.result.address
        })
      },
      fail: function(error) {
        console.error(error);
        wx.showToast({
          title: '导航失败请重试',
          icon: 'none'
        })
      }
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
                that.getLocalInfo(res)
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
            that.getLocalInfo(res)
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
// 去除服务器地址
function urlSub(str){
  let reg = new RegExp(app.globalData.app_url)
  return str.replace(reg, "")
}
// 输入数字校验
function validNumber(num) {
  if (isNaN(num - 0) || !num){
    wx.showToast({
      title: '请输入大于0的数字',
      icon: 'none'
    })
    return false
  } else {
    return true
  }
}