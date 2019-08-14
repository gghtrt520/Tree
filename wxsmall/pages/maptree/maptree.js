// pages/listtree/listtree.js
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = ''
const util = require('../../utils/util.js')
const http = require("../../utils/http.js")
let sizepage = 10
var marker = {
  id: 0,
  latitude: '39.980014',
  longitude: '116.313972',
  iconPath: './tree.png', //图标路径
  width: 30,
  height: 30
}
var circles = {
  latitude: '39.980014',
  longitude: '116.313972',
  radius: 30
}
var markers = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    currentPage: 1,
    categoryId: '',
    rule: app.globalData.rule,
    is_write: app.globalData.is_write,
    CustomBar: app.globalData.CustomBar,
    treeCategory: [{
      id: '',
      name: '全部'
    }],
    myPosition: {
      latitude: '39.980014',
      longitude: '116.313972',
    },
    enableSatellite: true,
    address_component: {
      city: "",
      district: "",
      nation: "",
      province: "",
      street: "",
      street_number: ""
    },
    location: 'district',
    value: '',
    mapDialog: false,
    exportDialog: false,
    currentTree: {},
    indTree: '',
    markers: [],
    titleKey: '',
    scrollLeft: 0
  },
  // 隐藏弹窗
  hide() {
    this.setData({
      markers: markers,
      mapDialog: false
    })
  },
  markerTap(e) {
    console.log(e)
    let mk = JSON.parse(JSON.stringify(this.data.markers[e.markerId] ? this.data.markers[e.markerId] : {}))
    let center = {
      latitude: mk.latitude - 0,
      longitude: mk.longitude - 0,
    }
    mk.tree_image = encodeURI(mk.tree_image)
    mk.iconPath = './tree.png'
    let mks = markers.map(item => {
      let arr = {
        ...item
      }
      return arr;
    })
    mks[e.markerId] = mk
    this.setData({
      myPosition: center,
      markers: mks,
      mapDialog: true,
      indTree: e.markerId,
      currentTree: mk
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    console.log(app.globalData)
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey // 必填
    });
    getLocPos(this)
    // 分类列表
    let arr = this.data.treeCategory.concat(app.globalData.treeCategory)
    this.setData({
      treeCategory: arr,
      is_write: app.globalData.is_write,
      rule: app.globalData.rule
    })
    // 搜索
    this.search(false)
  },
  onReady: function(e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 树种分类选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.index,
      categoryId: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.index - 1) * 60
    }, () => {
      this.search(false)
    })
  },
  // 地图缩放
  regionchange(e) {
    var that = this
    if (e.type == 'end' && e.causedBy == 'scale') {
      this.mapCtx.getScale({
        success: function(res) {
          let scale = parseInt(res.scale)
          console.log(scale)
          if (scale < 9) {
            that.data.location = 'province'
            that.data.value = that.data.address_component.province
          }
          if (scale < 13 && scale > 8) {
            that.data.location = 'city'
            that.data.value = that.data.address_component.city
          }
          if (scale > 12) {
            that.data.location = 'district'
            that.data.value = that.data.address_component.district
          }
          // if (scale > 16) {
          //   that.data.location = 'street'
          //   that.data.value = that.data.address_component.street
          // }
          that.mapCtx.getCenterLocation({
            success: function (res) {
              that.parseLatLon(res)
            }
          })
          if (that.data.value != '') {
            that.search(false)
          }
        }
      })
    }
    if (e.type == 'end' && e.causedBy == 'drag') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          that.parseLatLon(res)
        }
      })
    }
  },
  // 地址定位
  goPlace() {
    if (!this.data.placeKey) {
      wx.showToast({
        title: '请输入定位地址',
        icon: 'none'
      })
      return false
    }
    var _this = this;     //调用地址解析接口
    qqmapsdk.geocoder({       //获取表单传入地址
      address: _this.data.placeKey, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      sig: app.globalData.sig,
      success: function(res) { //成功后的回调     
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;         //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          myPosition: {
            latitude: latitude,
            longitude: longitude
          },
          address_component: res.address_components
        });
        _this.search(false);
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
        if (res.status != 0) {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }
    })
  },
  // 我的位置
  getMyPosition() {
    getLocPos(this)
  },
  // 调起手机导航
  openMap() {
    var that = this
    // 坐标地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.currentTree.latitude - 0,
        longitude: that.data.currentTree.longitude - 0
      },
      sig: app.globalData.sig,
      success: function(res) { //成功后的回调
        console.log(res);
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: that.data.currentTree.latitude - 0, //要去的纬度-地址
          longitude: that.data.currentTree.longitude - 0, //要去的经度-地址
          name: res.result.ad_info.name,
          address: res.result.address
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

  // 坐标地址解析
  parseLatLon(latLon) {
    let that = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latLon.latitude - 0,
        longitude: latLon.longitude - 0
      },
      sig: app.globalData.sig,
      success: function(res) { //成功后的回调
        console.log(res.result)
        that.data.address_component = res.result.address_component
        that.data.myPosition.latitude = latLon.latitude
        that.data.myPosition.longitude = latLon.longitude
        that.setData({
          myPosition: that.data.myPosition
        })
      },
      fail: function(error) {
        console.error(error)
      }
    })
  },
  // 导出数据
  exportData() {
    let data = {}
    // data.page = page
    data.keyword = this.data.titleKey
    data.tree_category_id = this.data.categoryId
    data.location = this.data.location
    data.value = this.data.value
    http({
      url: '/api/save-file',
      data: data
    }).then(res => {
      console.log(res)
      if (res.status == 1) {
        wx.downloadFile({
          url: app.globalData.app_url + res.data.file_name, //仅为示例，并非真实的资源
          success(res) {
            console.log(res)
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success(res) {
                  console.log(res)
                  wx.openDocument({
                    filePath: res.savedFilePath,
                    success: function(res) {
                      console.log('打开文档成功')
                    },
                    complete(err) {
                      console.log(err)
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 关键字搜索
  search(e) {
    this.hide()
    this.data.currentPage = 1
    this.data.value = this.data.address_component[this.data.location]
    getCardData(1, this.data.categoryId, this.data.titleKey, this.data.location, this.data.value).then(res => {
      let marks = []
      if (res.data.tree_list.length == 0) {
        wx.showToast({
          title: '未找到树木',
          icon: 'none'
        })
        this.setData({
          markers: []
        })
      } else {
        if (e) {
          this.showModal()
          setTimeout(() => {
            this.hideModal()
          }, 10000)
        }
        let newArr = res.data.tree_list.map((item, index) => {
          let obj = {}
          marker.treeCategory = item.treeCategory.name
          if (item.treeCategory.category == '常绿') {
            if (item.health == '死亡') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree05.png'
            } else if (item.health == '非常差') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree04.png'
            } else if (item.health == '较差') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree03.png'
            } else if (item.health == '一般') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree02.png'
            } else if (item.health == '健康') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree01.png'
            } else {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree00.png'
            }
          }
          if (item.treeCategory.category == '落叶') {
            if (item.health == '死亡') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree15.png'
            } else if (item.health == '非常差') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree14.png'
            } else if (item.health == '较差') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree13.png'
            } else if (item.health == '一般') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree12.png'
            } else if (item.health == '健康') {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree11.png'
            } else {
              marker.iconPath = app.globalData.app_url + '/upload/marker/tree10.png'
            }
          }
          if (item.treeCategory.category == '无人机') {
            marker.iconPath = app.globalData.app_url + '/upload/marker/plane.png'
          }
          marker.latitude = item.latitude
          marker.longitude = item.longitude
          marker.created_at = item.created_at
          marker.tree_name = item.tree_name
          marker.tree_number = item.tree_number
          marker.tree_image = app.globalData.app_url + item.treeImage.tree_image
          marker.treeId = item.id
          marker.id = index
          obj = {
            ...marker
          }
          marks.push(obj)
          return item
        })
        sizepage = res.data.per_page
        // let centPosition = {
        //   latitude: marks[0].latitude,
        //   longitude: marks[0].longitude,
        // }
        markers = JSON.parse(JSON.stringify(marks))
        this.setData({
          markers: marks
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      exportDialog: true
    })
  },
  hideModal(e) {
    this.setData({
      exportDialog: false
    })
  },
  // 跳转详情页
  goDetail(e) {
    let id = this.data.currentTree.treeId
    this.hide()
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  // 搜索输入框
  searchInput(e) {
    this.setData({
      titleKey: e.detail.value
    })
  },
  placeInput(e) {
    this.setData({
      placeKey: e.detail.value
    })
  }
})

// 数据库查询
function getCardData(page = 1, sort = '', key = '', location, val) {
  let data = {}
  // data.page = page
  data.keyword = key
  data.tree_category_id = sort
  data.location = location
  data.value = val
  console.log(data)
  return new Promise((resolve, reject) => {
    http({
      url: '/api/tree-list',
      data: data
    }).then(res => {
      if (res.status == 1) {
        resolve({
          data: res.data
        })
      } else {
        resolve({
          data: []
        })
      }
    }).catch(err => {
      reject(err)
    })
  })
}

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
                that.parseLatLon(res)
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
            that.parseLatLon(res)
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