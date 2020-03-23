// pages/componts/cut-img/cut-img.js
const app = getApp();
Component({
  properties: {
    a0: {
      type:Number,
      value: 0
    },
    a1: {
      type: Number,
      value: 0
    },
    a2: {
      type: Number,
      value: 0
    },
  },
  data: {
    coordinate: {
      px: 0,
      py: 0,
      x: 0,
      y: 0,
      x1: 0,
      y2: 0,
      img: '',
    }
  },
  lifetimes: {
    attached() {
      console.log(this)
      var _this = this;
      var a0 = _this.__data__.a0
      var a1 = _this.__data__.a1
      var a2 = _this.__data__.a2
      var coordinate = _this.__data__.coordinate //取可用屏幕长宽
      const res = wx.getSystemInfoSync()
      coordinate.px = res.windowWidth
      coordinate.py = res.windowHeight
      this.setData({
        coordinate: coordinate,
        a0: a0,
        a1: a1,
        a2: a2
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})