//index.js
//获取应用实例
const app = getApp()
const http = require("../../utils/http.js")
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName: '',
    bgimg: app.globalData.app_url + '/upload/marker/login2.jpg',
    bgimg2: app.globalData.app_url + '/upload/images/mac.jpg',
    userInfo: {},
    hasUserInfo: false,
    errinfo: '未授权您将不能使用该应用',
    elements: [{
      title: '树木地图',
      name: 'map',
      color: 'green',
      icon: 'newsfill'
    },
    {
      title: '树木入库',
      name: 'add',
      color: 'blue',
      icon: 'pick'
    }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 页面跳转
  goPage(e){
    console.log(e)
    let url = e.currentTarget.dataset.url
    if (url =="/pages/addtree/addtree"){
      if (app.globalData.is_write == '不可录入'){
        wx.showToast({
          title: '请管理员开通录入权限',
          icon: 'none'
        })
        return false
      }
    }
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        modalName: ''
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.hasOwnProperty('userInfo')) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        modalName: ''
      })
      loginUser(e.detail.userInfo)
    } else {
      this.setData({
        hasUserInfo: false,
        errinfo: '未授权您将不能使用该应用',
        modalName: 'authorization'
      })
    }
  }
})
// 分类列表
function sortList(){
  http({
    url: '/api/get-list',
  }).then(res => {
    if (res.status == 1) {
      app.globalData.treeCategory = res.data.tree_category;
      app.globalData.propertyUnit = res.data.property_unit;
      app.globalData.conservationUnit = res.data.construction_unit;
      app.globalData.constructionUnit = res.data.conservation_unit;
    }
  }).catch(err => {
    console.log(err)
    sortList()
  })
}

function loginUser(userInfo,that){
  var openid = wx.getStorageSync('openid') || ''
  if(openid){
    console.log('已存在', openid)
    return false
  }
  // 登录
  wx.login({
    success: res => {
      console.log(res.code)
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        //发起网络请求
        wx.request({
          url: app.globalData.app_url + '/site/synchronize-login',
          method: 'post',
          data: {
            nick_name: userInfo.nickName,
            avatar_url: userInfo.avatarUrl,
            gender: userInfo.gender,
            js_code: res.code
          },
          success(response) {
            let data = response.data
            console.log(data)
            if (data.status){
              wx.setStorageSync('openid', data.data.openid)
              if (data.data.apply_rule == 0){
                wx.redirectTo({
                  url: '/pages/home/home?type=0'
                })
              }
              if (data.data.apply_rule == 1) {
                wx.redirectTo({
                  url: '/pages/home/home?type=1'
                })
              }
              sortList()
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            } else {
              wx.hideLoading()
              that.setData({
                hasUserInfo: true,
                errinfo: '登录失败，请退出重试',
                modalName: 'authorization'
              })
            }
          },
          fail(err) {
            wx.hideLoading()
            that.setData({
              hasUserInfo: true,
              errinfo: '登录失败，请退出重试',
              modalName: 'authorization'
            })
          }
        })
      }
    }
  })
}