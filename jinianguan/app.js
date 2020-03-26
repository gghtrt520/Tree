//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        console.log(e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.pixelRatio = e.pixelRatio;
        this.globalData.windowView = [e.windowWidth, e.windowHeight];
      }
    })
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res)
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    hasAtuo: false,
    user_id: "",
    access_token:"",
    openid:"",
    server: 'https://xcx.xhbinyi.com/'
  }
})