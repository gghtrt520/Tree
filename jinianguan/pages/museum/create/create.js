// pages/museum/create/create.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    sex: "0",
    religionInd: "0",
    authorityInd: "0",
    avatarUrl: null,
    picker: ['男', '女'],
    authority: ['公开', '仅自己可见'],
    religion: ['无', '道教', '佛教', '基督教'],
    date1: '1900-01-01',
    date2: '1900-01-01',
    region: ['北京市', '北京市', '东城区'],
    showCut: false,
    coordinate: {
      px: 0,
      py: 0,
      x: 0,
      y: 0,
      x1: 0,
      y2: 0,
      img: '',
    },
    a0: {
      type: Number,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var day2 = new Date();
    day2.setTime(day2.getTime());
    var month = day2.getMonth() + 1 > 9 ? day2.getMonth() + 1 : '0' + (day2.getMonth() + 1);
    var day = day2.getDate() > 9 ? day2.getDate() : '0' + day2.getDate();
    var s2 = day2.getFullYear() + "-" + month + "-" + day;

    var _this = this
    var coordinate = _this.data.coordinate //取可用屏幕长宽
    const res = wx.getSystemInfoSync()
    coordinate.px = res.windowWidth
    coordinate.py = res.windowHeight

    this.setData({
      date1: s2,
      date2: s2,
      coordinate: coordinate,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  sexPickerChange(e) {
    console.log(e)
    this.setData({
      sex: e.detail.value
    })
  },
  religionPickerChange(e) {
    this.setData({
      religionInd: e.detail.value
    })
  },
  authorityPickerChange(e) {
    this.setData({
      authorityInd: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  birthDateChange(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  deathDateChange(e) {
    this.setData({
      date2: e.detail.value
    })
  },
  RegionChange: function(e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  ChooseImage() {
    var _this = this;
    var coordinate = _this.data.coordinate;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        coordinate.img = res.tempFilePaths[0]
        _this.setData({
          avatarUrl: res.tempFilePaths[0]
        })
        // _this.setData({
        //   coordinate: coordinate,
        //   showCut: true
        // })
        // var ctx = wx.createCanvasContext('map_id');
        // console.log(coordinate);
        // ctx.drawImage(coordinate.img, 0, 0, coordinate.px, coordinate.px);
        // ctx.setLineWidth(3)
        // ctx.setStrokeStyle('#0065fa')
        // ctx.rect(coordinate.x, coordinate.y, coordinate.px - 100, coordinate.px - 100)
        // ctx.setLineJoin('round')
        // ctx.stroke()
        // ctx.draw()
      }
    })
  },
  button: function () {
    var _this = this
    var coordinate = _this.data.coordinate
    var a1 = _this.data.a1
    var a0 = _this.data.a0
    var a2 = _this.data.a2
    if (coordinate.img != '') {
      wx.canvasToTempFilePath({
        x: coordinate.x + 2,
        y: coordinate.y + 2,
        width: coordinate.px - 104,
        height: coordinate.px - 104,
        canvasId: 'map_id',
        fileType: 'jpg',
        quality: 0.5, //压缩
        destHeight: 250, //保存图片的长宽
        destWidth: 250, //三个属性决定了图片文件的大小
        success: function (res) {
          console.log(a0 + ',' + a1 + ',' + a2)
          console.log(res.tempFilePath)
          wx.showLoading({
            title: '照片上传中'
          })
          wx.uploadFile({
            url: app.globalData.url + 'img.php', //接口
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              a0: a0,
              a1: a1,
              a2: a2,
            },
            success: function (res) {
              wx.hideLoading() //加载完成
              console.log(res.data)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '没有选择图片',
        icon: 'none'
      })
    }
  },
  cancelCut: function(){
    this.setData({
      showCut: false,
    })
  },
  button1: function () {
    var _this = this
    var coordinate = _this.data.coordinate
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        coordinate.img = res.tempFilePaths[0]
        _this.setData({
          coordinate: coordinate,
          showCut: true
        })
        var ctx = wx.createCanvasContext('map_id');
        console.log(ctx);
        ctx.drawImage(coordinate.img, 0, 0, coordinate.px, coordinate.px);
        ctx.setLineWidth(3)
        ctx.setStrokeStyle('#0065fa')
        ctx.rect(coordinate.x, coordinate.y, coordinate.px - 100, coordinate.px - 100)
        ctx.setLineJoin('round')
        ctx.stroke()
        ctx.draw()
      }
    })
  },
  a1: function (e) {
    var _this = this
    var coordinate = _this.data.coordinate
    coordinate.x1 = e.changedTouches[0].x
    coordinate.y1 = e.changedTouches[0].y
    _this.setData({
      coordinate: coordinate
    })
  },
  a2: function (e) { //移动框框
    var x2 = e.changedTouches[0].x
    var y2 = e.changedTouches[0].y
    var _this = this
    var coordinate = _this.data.coordinate
    var a = x2 - coordinate.x1
    var b = y2 - coordinate.y1
    coordinate.x = coordinate.x + a
    coordinate.y = coordinate.y + b
    coordinate.x1 = x2
    coordinate.y1 = y2
    if (coordinate.x < 1) {
      coordinate.x = 1
    }
    if (coordinate.x > 100) {
      coordinate.x = 100
    }
    if (coordinate.y < 1) {
      coordinate.y = 1
    }
    if (coordinate.y > 100) {
      coordinate.y = 100
    }
    _this.setData({
      coordinate: coordinate
    })
    var ctx = wx.createCanvasContext('map_id');
    if (coordinate.img) {
      ctx.drawImage(coordinate.img, 0, 0, coordinate.px, coordinate.px);
      ctx.setLineWidth(3)
      ctx.setStrokeStyle('#0065fa')
      ctx.rect(coordinate.x, coordinate.y, coordinate.px - 100, coordinate.px - 100)
      ctx.setLineJoin('round')
      ctx.stroke()
      ctx.draw()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})