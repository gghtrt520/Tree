// pages/museum/details/details.js
const app = getApp();
const http = require("../../../utils/http.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    isMy: false,
    isMyself: false,
    title: "详情",
    giftNum: 0,
    giftList: [],
    commentList: [],
    textJiyu: "无",
    bgImg: app.globalData.server + "/upload/peoplebg.jpg",
    huaImg: app.globalData.server + "upload/b.png",
    liImg: app.globalData.server + "upload/j.png",
    liyiImg: app.globalData.server + "upload/d.png",
    jiyuImg: app.globalData.server + "upload/4.jpg",
    jiyutext: "寄语",
    huaTxt: "鲜花",
    liTxt: "祭果",
    liyiTxt: "祭拜"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },
  getMuseumInfo(id) {
    var that = this;
    http({
      url: "api/detail",
      data: {
        id: id
      }
    }).then(res => {
      if (res.code == 1) {
        var autho = false;
        if (res.data.user_id == app.globalData.user_id) {
          autho = true;
          that.setData({
            isMyself: true
          })
        } else {
          autho = false;
          that.setData({
            isMyself: false
          })
        }
        if (res.data.is_pay == 0) {
          autho = false;
        }
        that.setData({
          title: res.data.name,
          textJiyu: res.data.description ? res.data.description : "无",
          isMy: autho
        })
        if (res.data.religion == "佛教") {
          that.writeData(2)
        }
        if (res.data.religion == "基督教") {
          that.writeData(3)
        }
      }
    })
  },
  uploadMusic() {
    var that = this;
    if (!this.data.isMy){
      wx.showToast({
        title: '需付费开通此功能',
        icon: 'none'
      })
      return false;
    }
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFiles[0];
        let FileExt = tempFilePath.path.replace(/.+\./, "").toLocaleLowerCase();
        wx.showLoading({
          title: '上传中',
          mask: true
        })
        if (FileExt == 'mp3' || FileExt == 'wav') {
          wx.uploadFile({
            url: app.globalData.server + 'api/uploadmusic?access_token=' + app.globalData.access_token, //上传地址
            filePath: tempFilePath.path,
            name: 'Music[video_url]',
            formData: { room_id:that.data.id},
            success(res) {
              const data = JSON.parse(res.data)
              wx.hideLoading()
              if (res.statusCode === 200 && data.code == 1) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'none'
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  icon: 'none',
                  title: '上传失败请重试',
                  duration: 2000
                })
              }
            },
            fail(err) {
              wx.showToast({
                icon: 'none',
                title: '上传失败请重试',
                duration: 2000
              })
            }
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '请选择MP3或WAV格式音频',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      },
    })
  },
  // 数据展示
  writeData(type) {
    if (type == 3) {
      this.setData({
        bgImg: app.globalData.server + "/upload/peoplebg.jpg",
        huaImg: app.globalData.server + "upload/a.png",
        liImg: app.globalData.server + "upload/j.png",
        liyiImg: app.globalData.server + "upload/e.png",
        jiyuImg: app.globalData.server + "upload/h.jpg",
        jiyutext: "圣经"
      })
    }
    if (type == 2) {
      this.setData({
        bgImg: app.globalData.server + "/upload/peoplebg.jpg",
        huaImg: app.globalData.server + "upload/k.png",
        liImg: app.globalData.server + "upload/f.png",
        liyiImg: app.globalData.server + "upload/l.png",
        jiyuImg: app.globalData.server + "upload/4.jpg",
        jiyutext: "偈语"
      })
    } else {
      this.setData({
        bgImg: app.globalData.server + "/upload/peoplebg.jpg",
        huaImg: app.globalData.server + "upload/b.png",
        liImg: app.globalData.server + "upload/j.png",
        liyiImg: app.globalData.server + "upload/d.png",
        jiyuImg: app.globalData.server + "upload/4.jpg",
        jiyutext: "寄语"
      })
    }
  },
  getMuseumGift(id) {
    var that = this;
    http({
      url: "api/plist",
      data: {
        room_id: id
      }
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          giftList: res.data.gift,
          commentList: res.data.comment
        })
      }
    })
  },
  gotoPagePhotos(e) {
    wx.navigateTo({
      url: '/pages/museum/photos/photos?id=' + this.data.id + '&isMy=' + this.data.isMy,
    })
  },
  gotoPageArticle(e) {
    wx.navigateTo({
      url: '/pages/museum/article/article',
    })
  },
  gotoPageVideos(e) {
    wx.navigateTo({
      url: '/pages/museum/videos/videos?id=' + this.data.id + '&isMy=' + this.data.isMy,
    })
  },
  goToEdit(e) {
    wx.navigateTo({
      url: '/pages/museum/create/create?id=' + this.data.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMuseumGift(this.data.id);
    this.getMuseumInfo(this.data.id);
    this.getListImgs();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  getListImgs() {
    var that = this;
    http({
      url: "api/photodetail",
      data: {
        room_id: this.data.id
      }
    }).then(res => {
      if (res.code == 1) {
        if (res.data.length > 0) {
          that.setData({
            bgImg: res.data[0].detail[0].photo_url
          })
        } else {
          that.setData({
            bgImg: app.globalData.server + "/upload/peoplebg.jpg"
          })
        }
      }
    })
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