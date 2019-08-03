//app.js
App({
  onLaunch: function() {
    // 清除缓存数据
    wx.clearStorage()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    rule: 0, // 权限
    is_write: '不可录入',
    app_url: 'https://xcx.yongjinpin.cn', // 后台
    mapKey: 'PHDBZ-CPACF-TIRJY-J4UTB-J67TQ-F6BBV',// 腾讯地图
    sig: '9ntnqk4RMLdMVT4ffyPTs3ArncH2Jm9y',// 腾讯地图
    treeCategory:[]// 树种分类
  }
})