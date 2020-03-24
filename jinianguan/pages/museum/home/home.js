const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
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
    }],
    listImg2:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/tombstone/tombstone?id=" + id
      })
    }
  }
})
