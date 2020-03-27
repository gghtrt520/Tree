const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    bgImg: app.globalData.server + 'upload/jisao.png'
  },
  methods: {
    toChild(e) {
      wx.navigateTo({
        url: '/pages/plugin' + e.currentTarget.dataset.url
      })
    },
    goPage(){
      wx.showToast({
        title: '功能研发中',
        icon: 'none'
      })
    }
  }
});