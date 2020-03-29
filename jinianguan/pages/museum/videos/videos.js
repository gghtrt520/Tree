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
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  delVideo(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除提示',
      content: '确认要删除该视频吗？',
      success: function (res) {
        if (res.confirm) {
          console.log(id)
          http({
            url: "api/videodelete",
            data: { video_id: id }
          }).then(res => {
            if (res.code == 1) {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
              that.getListVideo();
            } else {
              wx.showToast({
                title: '请重试',
                icon: 'none'
              })
            }
          })
        } else {
          console.log('点击取消回调')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getListVideo();
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
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    wx.uploadFile({
      url: app.globalData.server + 'api/videoupload?access_token=' + app.globalData.access_token, //上传地址
      filePath: that.data.videosUpload,
      name: 'Video[video_path]',
      success(res) {
        const data = JSON.parse(res.data)
        //do something
        if (res.statusCode === 200 && data.code == 1) {
          http({
            url: 'api/videocreate',
            data: {
              room_id: that.data.id,
              name: that.data.titleText,
              path: data.data.path
            }
          }).then(res => {
            if (res.code == 1) {
              that.hideModal();
              wx.hideLoading();
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
    console.log(11)
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: false,
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        if (res.size > 50 * 1024 * 1024) {
          wx.showToast({
            title: '视频不能大于50M',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        that.setData({
          videosUpload: res.tempFilePath
        })
      },
      fail:function(err){
        that.setData({
          videosUpload: ""
        })
      },
      complete: function (err) {
        console.log(err)
      },
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