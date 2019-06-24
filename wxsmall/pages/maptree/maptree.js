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
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    currentPage: 1,
    categoryId: '',
    CustomBar: app.globalData.CustomBar,  
    treeCategory: [{
      id: '',
      name: '全部'
    }],
    myPosition: {
      latitude: '39.980014',
      longitude: '116.313972',
    },
    mapDialog: false,
    currentTree:{},
    indTree: 0,
    markers: [],
    titleKey: '',
    scrollLeft: 0
  },
  // 隐藏弹窗
  hide(){
    this.setData({
      mapDialog:false
    })
  },
  markerTap(e){
    console.log(e)
    this.setData({
      mapDialog: true,
      indTree: e.markerId,
      currentTree: this.data.markers[e.markerId]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey // 必填
    });
    getLocPos(this)
    // 分类列表
    let arr = this.data.treeCategory.concat(app.globalData.treeCategory)
    this.setData({
      treeCategory: arr
    })
    // 初始化
    this.search()
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 树种分类选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.index,
      categoryId: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.index - 1) * 60
    },()=>{this.search()})
  },
  // 砍伐
  cutBtn(e){
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 移植
  moveBtn(e) {
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 地图缩放
  regionchange(e) {
    console.log(e)
    if (e.type == 'end' && e.causedBy == 'scale'){
      this.mapCtx.getScale({
        success: function (res) {
          console.log(res.scale)
          if (res.scale < 9){

          }
          if (res.scale < 13 && res.scale > 8) {

          }
          if (res.scale < 17 && res.scale > 12) {

          }
          if (res.scale > 16) {

          }
        }
      })
    }
  },
  // 全屏预览图片
  fullImg(e){
    console.log(e.target.dataset.url)
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: [e.target.dataset.url] // 需要预览的图片http链接列表
    })
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
      success: function (res) {//成功后的回调
        console.log(res);
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: that.data.currentTree.latitude - 0,//要去的纬度-地址
          longitude: that.data.currentTree.longitude - 0,//要去的经度-地址
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
  // 关键字搜索
  search() {
    this.data.currentPage = 1
    getCardData(1, this.data.categoryId, this.data.titleKey).then(res => {
      let marks = []
      if (res.data.tree_list.length==0){
        wx.showToast({
          title: '未找到树木',
          icon: 'none'
        })
        this.setData({
          markers: []
        })
      } else {
        let newArr = res.data.tree_list.map((item, index)=> {
          let obj = {}
          let ind = util.getArrInd(this.data.treeCategory, item.tree_category_id, 'id')
          marker.treeCategory = this.data.treeCategory[ind].name
          marker.latitude = item.latitude
          marker.longitude = item.longitude
          marker.created_at = item.created_at
          marker.tree_number = item.tree_number
          marker.tree_image = item.tree_image
          marker.id = index
          obj = {...marker}
          marks.push(obj)
          return item
        })
        sizepage = res.data.per_page
        // let centPosition = {
        //   latitude: marks[0].latitude,
        //   longitude: marks[0].longitude,
        // }
        this.setData({
          markers: marks
        })
      }
    })
  },
  // 跳转详情页
  goDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  // 搜索输入框
  searchInput(e) {
    this.setData({
      titleKey: e.detail.value
    })
  }
})

// 数据库查询
function getCardData(page = 1, sort = '', key = '') {
  let data = {}
  // data.page = page
  data.tree_number = key
  data.tree_category_id = sort
  return new Promise((resolve,reject)=>{
    http({
      url: '/api/tree-list',
      data: data
    }).then(res=>{
      if(res.status==1){
        resolve({data:res.data})
      }else{
        resolve({data:[]})
      }
    }).catch(err=>{
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
                that.data.myPosition.latitude = res.latitude
                that.data.myPosition.longitude = res.longitude
                that.setData({
                  myPosition: that.data.myPosition
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
            that.data.myPosition.latitude = res.latitude
            that.data.myPosition.longitude = res.longitude
            that.setData({
              myPosition: that.data.myPosition
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