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
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        modalName: ''
      })
      loginUser(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          modalName: ''
        })
        loginUser(app.globalData.userInfo)
      }
    }
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            hasUserInfo: false,
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
        modalName: 'authorization'
      })
    }
  }
})

function loginUser(userInfo){
  console.log(userInfo)
  // 登录
  wx.login({
    success: res => {
      console.log(res.code)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
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
          success(data) {
            console.log(data)
            if(data.status){
              
            } else {
              console.log('登录失败')
            }
          },
          fail(err) {
            console.log(err)
          }
        })
      }
    }
  })
}