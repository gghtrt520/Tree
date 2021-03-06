//index.js
// '/upload/images/mac.jpg'
//获取应用实例
const app = getApp()
const http = require("../../utils/http.js")
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    is_write: app.globalData.is_write,
    modalName: '',
    bgimg: app.globalData.app_url + '/upload/marker/login2.jpg',
    bgimg2: app.globalData.app_url + '/upload/images/mac.jpg',
    userInfo: {},
    hasUserInfo: false,
    logined: false,
    errinfo: '未授权您将不能使用该应用',
    elements: [{
      title: '树',
      name: 'map',
      color: 'green',
      icon: 'newsfill'
    },
    {
      title: '库',
      name: 'add',
      color: 'blue',
      icon: 'pick'
    }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        modalName: ''
      })
      loginUser(app.globalData.userInfo, this)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          modalName: ''
        })
        loginUser(app.globalData.userInfo, this)
      }
    }
    // 再次检查授权状态
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            hasUserInfo: false,
            errinfo: '未授权您将不能使用该应用',
            modalName: 'authorization'
          })
        }
      }
    })
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
function sortList() {
  http({
    url: '/api/get-list',
  }).then(res => {
    if (res.status == 1) {
      app.globalData.treeCategory = res.data.tree_category;
      app.globalData.propertyUnit = res.data.property_unit;
      app.globalData.conservationUnit = res.data.conservation_unit;
      app.globalData.constructionUnit = res.data.construction_unit;
    }
  }).catch(err => {
    console.log(err)
    sortList()
  })
}

function loginUser(userInfo, that) {
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
            if (data.status) {
              wx.setStorageSync('openid', data.data.openid)
              app.globalData.rule = data.data.rule
              app.globalData.is_write = data.data.is_write
              console.log(app.globalData)
              sortList()
              setTimeout(function () {
                if (data.data.apply_rule == 0) {
                  wx.redirectTo({
                    url: '/pages/home/home?type=0'
                  })
                } else if (data.data.apply_rule == 1) {
                  wx.redirectTo({
                    url: '/pages/home/home?type=1'
                  })
                } else {
                  if (data.data.rule == 0) {
                    if (data.data.is_write == '可录入') {
                      wx.redirectTo({
                        url: '/pages/addtree/addtree'
                      })
                    } else {
                      wx.redirectTo({
                        url: '/pages/home/home?type=1'
                      })
                    }
                  } else {
                    if (data.data.is_write == '可录入') {
                      that.setData({
                        logined: true
                      })
                    } else {
                      wx.redirectTo({
                        url: '/pages/maptree/maptree'
                      })
                    }
                  }
                }
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