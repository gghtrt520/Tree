const app = getApp();
Component({
  properties: {
    homeData1: {
      type: null,//类型
      value: []//默认值
    },
    homeData2: {
      type: null,//类型
      value: []//默认值
    }
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: app.globalData.server + '/upload/banner/banner2.jpg'
    }, {
      id: 1,
      type: 'image',
      url: app.globalData.server + '/upload/banner/banner1.jpg',
    }],
    listImg: []
  },
  lifetimes: {
    attached() {
      this.triggerEvent('refreshData');
    }
  },
  methods: {
    goToMuseum(e) {
      var obj = e.currentTarget.dataset;
      this.triggerEvent('goMuseum', e.currentTarget.dataset, {
        bubbles: true
      })
    },
    goTombstnoe(e) {
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
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/museum/sortDetail/sortDetail?id=" + id
      })
    }
  }
})