// pages/museum/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.setData({
      date1: s2,
      date2: s2
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
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths.toString()
        })
      }
    });
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