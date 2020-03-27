// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBack: false,
    times: 60,
    getCodeing: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        isBack:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getCode: function(){
    this.setData({
      getCodeing: true
    });
    this.timerGetCode();
  },
  timerGetCode: function(){
    var _this = this;
    if (_this.data.times>0){
      setTimeout(function(){
        var theTimes = _this.data.times - 1;
        _this.setData({
          times: theTimes
        })
        _this.timerGetCode();
      },1000);
    }else{
      this.setData({
        getCodeing: false
      });
    }
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