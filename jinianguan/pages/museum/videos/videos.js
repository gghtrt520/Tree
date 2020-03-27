// pages/museum/videos/videos.js
const app = getApp();
const http = require("../../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    videosUpload: "",
    titleText: '',
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      videosUpload: '',
      titleText: ''
    })
  },
  inputTitle(e) {
    this.setData({
      titleText: e.detail.value
    })
  },
  uploadFiles() {
    var that = this;
    if (!that.data.titleText) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return;
    }
    if (!this.data.videosUpload) {
      wx.showToast({
        title: '请选择视频',
        icon: 'none'
      })
      return;
    }
    wx.uploadFile({
      url: app.globalData.server + 'api/videoupload?access_token=' + app.globalData.access_token, //上传地址
      filePath: that.data.videosUpload,
      name: 'Video[video_path]',
      success(res) {
        const data = JSON.parse(res.data)
        //do something
        if (res.statusCode === 200 && data.code == 1) {
          console.log(data.data)
          http({
            url: 'api/videocreate',
            data: {
              room_id: that.data.id,
              name: that.data.titleText,
              path: data.data
            }
          }).then(res => {
            if (res.code == 1) {
              that.hideModal();
              wx.showToast({
                title: '上传成功',
                icon: 'none'
              })
              that.getListVideo();
            }
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
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '上传失败请重试',
          duration: 2000
        })
      }
    })
  },
  getListVideo() {
    var that = this;
    http({
      url: "api/videolist",
      data: {
        room_id: this.data.id
      }
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          videoList: res.data
        })
      }
    })
  },
  ChooseVedio() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 120,
      camera: 'back',
      success: function(res) {
        that.setData({
          videosUpload: res.tempFilePath
        })
      }
    })
  },
  DelVedio() {
    this.setData({
      videosUpload: ""
    })
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