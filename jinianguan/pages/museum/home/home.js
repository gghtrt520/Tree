const app = getApp();
const http = require("../../../utils/http.js");
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
    listImg: [],
    listImg2:[]
  },
  lifetimes: {
    attached() {
    this.getHomeData();
    }
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/museum/sortDetail/sortDetail?id=" + id
      })
    },
    getHomeData() {
      var that = this;
      http({
        url: "api/self",
        data: {}
      }).then(res => {
        console.log(res);
        if (res.code == 1) {
          that.setData({
            listImg: res.data
          })
        }
      });
    },
  }
})
