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
  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.getHomeData();
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    delMuseum(e){
      var that = this;
      var id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '删除提示',
        content: '确认要删除纪念馆吗？',
        success: function (res) {
          if (res.confirm) {
            http({
              url: "api/roomdelete",
              data: {room_id:id}
            }).then(res=>{
              console.log(res);
              if(res.code == 1){
                wx.showToast({
                  title: '操作成功',
                  icon:'null'
                })
                that.getHomeData();
              }else{
                wx.showToast({
                  title: '请重试',
                  icon: 'null'
                })
              }
            })
          } else {
            console.log('点击取消回调')
          }
        }
      })
    },
    goDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/tombstone/tombstone?id=" + id
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
