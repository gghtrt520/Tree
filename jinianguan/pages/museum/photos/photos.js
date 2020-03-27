// pages/museum/photos/photos.js
const app = getApp();
const http = require("../../../utils/http.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    title:"",
    imgList:[],
    photos:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  imgYu: function (event) {
    var that = this;
    var src = that.data.discount.imgPath;//获取data-src
    var imgList = [that.data.discount.imgPath];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  inputTitle(e){
    this.setData({
      title: e.detail.value
    })
  },
  uploadFiles(){
    var that = this
    let promiseList = []
    if (this.data.photos.length==0){
      wx.showToast({
        title: '请选择照片',
        icon: 'none'
      })
      return;
    }
    if (!that.data.title){
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '上传中',
    })
    var resultsArr = [];
    this.data.photos.map((item, index) => {
      console.log(item)
      let path = "" + item
      let ind = path.indexOf('upload')
      // console.log(ind)
      if (ind != -1) {
        // item.path = urlSub(item.path)
        // this.data.imgUrl[index] = item
      } else {
        var p = this.imgUpload(item)
        p.then(res => {
          resultsArr.push(res.path)
        })
        promiseList.push(p)
      }
    })
    Promise.all(promiseList).then((res) => {
      console.log(resultsArr)
      http({
        url: "api/photocreate",
        data: { room_id: that.data.id, name: that.data.title, photo_list: resultsArr}
      }).then(res=>{
        console.log(res)
        if(res.code == 1){
          that.hideModal();
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          })
          that.getListImgs();
        }
      })
    });
  },
  // 上传拍照
  imgUpload(tempFilePaths) {
    var that = this;
    var p = new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.server + 'api/photoupload?access_token=' + app.globalData.access_token, //上传地址
        filePath: tempFilePaths,
        name: 'PhotoList[photo_url]',
        success(res) {
          const data = JSON.parse(res.data)
          //do something
          if (res.statusCode === 200 && data.code == 1) {
            resolve(data.data)
          } else {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '上传失败请重试',
              duration: 2000
            })
            reject('上传失败')
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '上传失败请重试',
            duration: 2000
          })
          reject('上传失败')
        }
      })
    })
    return p;
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      photos:[],
      title:""
    })
  },
  DelImg(e) {
    console.log(e)
    this.data.photos.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      photos: this.data.photos
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 8, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.photos.length != 0) {
          this.setData({
            photos: this.data.photos.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            photos: res.tempFilePaths
          })
        }
      }
    });
    console.log(this.data.photos)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getListImgs()
  },

  getListImgs(){
    http({
      url:"api/photodetail",
      data: { room_id: this.data.id }
    }).then(res=>{
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})