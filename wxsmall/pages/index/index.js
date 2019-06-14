//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName: '',
    userInfo: {},
    hasUserInfo: false,
    elements: [{
      title: '树木列表',
      name: 'list',
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        modalName: ''
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          modalName: ''
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            modalName: ''
          })
        }
      })
    }
    wx.getSetting({
      success: res => {
        if (!app.globalData.userInfo && !res.authSetting['scope.userInfo']) {
          this.setData({
            hasUserInfo: false,
            modalName: 'authorization'
          })
        } else {
          loginUser(app.globalData.userInfo)
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
      loginUser(app.globalData.userInfo)
    } else {
      this.setData({
        hasUserInfo: false,
        modalName: 'authorization'
      })
    }
  }
})

function loginUser(userInfo){
  // 登录
  wx.login({
    success: res => {
      console.log(res.code)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.status) {
        //发起网络请求
        wx.request({
          url: 'https://sapling.cnfay.com/site/synchronize-login',
          method: 'post',
          data: {
            nick_name: userInfo.nickName,
            avatar_url: userInfo.avatarUrl,
            gender: userInfo.gender,
            js_code: res.code
          },
          success(res) {
            console.log(res.data)
          },
          fail(err) {
            console.log(err)
          }
        })
      } else {
        console.log('登录失败')
      }
    }
  })
}