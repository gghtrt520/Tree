// pages/tombstone/tombstone.js
const app = getApp();
const http = require("../../utils/http.js");
var backMusic = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 拖拽参数
    id: null,
    modalName: null,
    showAnimation: false,
    animationImg: "",
    writePosition: [50, 50], //默认定位参数
    writesize: [0, 0], // X Y 定位
    window: [0, 0], //屏幕尺寸
    write: [0, 0], //定位参数
    scrolltop: 0, //据顶部距离
    CustomBar: app.globalData.CustomBar,
    backImg: "",
    avatarImg: "",
    kuangImg: app.globalData.server + 'upload/kuang.png',
    title: "",
    isPalaying: false,
    musicUrl: app.globalData.server + 'upload/2255039574.mp3',
    liNums: [{
      id: "1",
      writePosition: [50, 50], //默认定位参数
      writesize: [0, 0], // X Y 定位
      write: [0, 0], //定位参数
      isMy: 0
    }, {
      id: "2",
      writePosition: [30, 30], //默认定位参数
      writesize: [0, 0], // X Y 定位
      write: [0, 0], //定位参数
      isMy: 1
    }],
    giftListArr: [],
    giftCountArr: [],
    bgListArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSysdata();
    this.setData({
      id: options.id
    })
  },
  palyMusic: function() {
    backMusic.title = "音乐播放";
    backMusic.src = this.data.musicUrl;
    backMusic.loop = true;
    backMusic.play();
    backMusic.onPlay(() => {
      console.log("音乐播放开始");
      this.setData({
        isPalaying: true
      })
    });
    backMusic.onPause(() => {
      console.log("音乐播放暂停");
      this.setData({
        isPalaying: false
      })
    })
  },
  toggleMusic(e) {
    if (this.data.isPalaying) {
      backMusic.pause();
    } else {
      backMusic.play();
    }
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
        var bgImgUrl = app.globalData.server + '/admin/upload/background/2020-03-28/1585414302.7689.jpg';
        that.data.bgListArr.map(item => {
          if (item.id == res.data.background_id) {
            bgImgUrl = item.background;
          }
        })
        that.setData({
          avatarImg: res.data.avatar_url,
          backImg: bgImgUrl,
          title: res.data.name
        })
      }
    })
  },
  getGiftList() {
    var that = this;
    http({
      url: "api/list"
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          giftListArr: res.data
        })
      }
    })
    http({
      url: "api/bglist"
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          bgListArr: res.data
        })
        that.getMuseumInfo(that.data.id);
      }
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
    if (!backMusic) {
      backMusic = wx.createInnerAudioContext();
    }
    this.getGiftList();
    this.palyMusic();
    this.presentcount();
  },
  presentcount: function() {
    var that = this;
    http({
      url: "api/presentcount",
      data: {
        room_id: that.data.id
      }
    }).then(res => {
      if (res.code == 1) {
        console.log(res)
        that.setData({
          giftCountArr: res.data
        })
      }
    })
  },
  gotoDetail() {
    wx.navigateTo({
      url: '/pages/museum/sortDetail/sortDetail?id=' + this.data.id
    })
  },
  sendGift: function(imgUrl, giftid) {
    var that = this;
    http({
      url: "api/present",
      data: {
        room_id: that.data.id,
        product_id: giftid
      }
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          showAnimation: true,
          animationImg: imgUrl
        })
        setTimeout(() => {
          that.setData({
            animationImg: "",
            showAnimation: false
          })
          that.presentcount();
        }, 2100);
      } else {
        wx.showToast({
          title: '操作失败请重试',
          icon: 'none'
        })
      }
    })
  },
  selectGiftImg(e) {
    let imgUrl = e.currentTarget.dataset.img;
    let giftid = e.currentTarget.dataset.giftid;
    this.hideModal()
    this.sendGift(imgUrl, giftid);
  },
  //计算默认定位值
  getSysdata: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(e) {
        that.data.window = [e.windowWidth, e.windowHeight];
        var write = [];
        write[0] = that.data.window[0] * that.data.writePosition[0] / 100;
        write[1] = that.data.window[1] * that.data.writePosition[1] / 100;
        console.log(write, 45);
        that.setData({
          write: write
        }, function() {
          // 获取元素宽高
          wx.createSelectorQuery().select('.content').boundingClientRect(function(res) {
            console.log(res.width)
            that.data.writesize = [res.width, res.height];
          }).exec();
        });
      },
      fail: function(e) {
        console.log(e);
      }
    });
  },
  //开始拖拽  
  touchmove: function(e) {
    var that = this;
    var position = [e.touches[0].pageX, e.touches[0].pageY - this.data.scrolltop];
    that.setData({
      write: position
    });
    console.log(that.data.write)
  },
  // 弹窗
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    if (e.currentTarget.dataset.target = "bottomLiwu") {
      let newArr = this.data.giftListArr.concat();
      this.setData({
        giftListArr: newArr
      })
    }
    if (e.currentTarget.dataset.target = "bottomModal") {
      let newArr = this.data.bgListArr.concat();
      this.setData({
        bgListArr: newArr
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  selectBgImg(e) {
    let imgUrl = e.currentTarget.dataset.img;
    let id = e.currentTarget.dataset.bgid;
    this.hideModal()
    this.swapBgImg(imgUrl, id);
  },
  swapBgImg(imgUrl, id) {
    var that = this;
    http({
      url: "api/changepg",
      data: {
        id: that.data.id,
        bg_id: id
      }
    }).then(res => {
      if (res.code == 1) {
        console.log(imgUrl)
        that.setData({
          backImg: imgUrl
        })
      } else {
        wx.showToast({
          title: '操作失败请重试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    backMusic.destroy();
    backMusic = null;
    this.data.isPalaying = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (backMusic) {
      backMusic.destroy();
      backMusic = null;
      this.data.isPalaying = false;
    }
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
    var title = this.data.title;
    var imgUrl = this.data.avatarImg;
    return {
      title: title,
      imageUrl: imgUrl,
      path: 'pages/tombstone/tombstone?id=' + this.data.id
    }
  }
})