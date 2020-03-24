const app = getApp();
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    PageCur: 'home'
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      loginUser(app.globalData.userInfo,this)
    } else if (this.data.canIUse) {
      console.log(app.globalData)
      if (!app.globalData.hasAtuo) {
        wx.showToast({
          icon: 'none',
          title: '您未授权登录'
        })
        this.setData({
          PageCur: 'my'
        })
      }
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(app.globalData)
        loginUser(res.userInfo, this)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          loginUser(res.userInfo, this)
        }
      })
    }
  },
  onShow:function(){
    // if (!this.data.userInfo){
    //   this.setData({
    //     PageCur: 'my'
    //   })
    //   // wx.redirectTo({
    //   //   url: '/pages/register/register',
    //   // })
    // }
  },
  NavChange(e, options) {
    let cur;
    if (!app.globalData.hasAtuo) {
      wx.showToast({
        icon: 'none',
        title: '您未授权登录'
      })
      this.setData({
        PageCur: 'my'
      })
      return;
    }
    if (e.currentTarget.dataset.cur) {
      cur = e.currentTarget.dataset.cur
    } else {
      cur = e.detail.cur
    }
    this.setData({
      PageCur: cur
    })
  },
  onShareAppMessage() {
    return {
      title: '西户云纪念馆',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})
function loginUser(userInfo, that) {
  // 登录
  wx.login({
    success: res => {
      console.log(res.code)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        //发起网络请求
        wx.request({
          url: app.globalData.server + 'api/login',
          method: 'post',
          data: {
            nick_name: userInfo.nickName,
            avatar_url: userInfo.avatarUrl,
            gender: userInfo.gender,
            js_code: res.code
          },
          success(response) {
            let data = response.data
            if (data.code == 1) {
              wx.setStorageSync('openid', data.data.openid)
              app.globalData.openid = data.data.openid
              app.globalData.access_token = data.data.access_token
              console.log(app.globalData)
            } else {
              wx.showToast({
                icon: 'none',
                title: '登录失败，请重试'
              })
            }
          },
          fail(err) {
            wx.showToast({
              icon: 'none',
              title: '登录失败，请重试'
            })
          }
        })
      }
    }
  })
}