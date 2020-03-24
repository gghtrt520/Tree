const app = getApp();
Component({
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
    listImg: [{
      id: 1,
      type: 'image',
      name: '邵逸夫邵逸夫',
      url: app.globalData.server + '/upload/邵逸夫.jpg'
    }, {
      id: 2,
      type: 'image',
      name: '邵逸夫',
      url: app.globalData.server + '/upload/邵逸夫.jpg'
    }]
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
        url: "/pages/tombstone/tombstone?id=" + id
      })
    }
  }
})