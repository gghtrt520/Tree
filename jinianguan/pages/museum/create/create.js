// pages/museum/create/create.js
const app = getApp();
const http = require("../../../utils/http.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    id: null,
    sex: "0",
    name: "",
    jiyuText: "",
    havedPay: false,
    religionInd: "0",
    authorityInd: "0",
    typeInd: "0",
    roomPrice: 0,
    age: "",
    avatarUrl: null,
    picker: ['男', '女'],
    type: ['免费', '付费'],
    authority: ['仅自己可见', '公开'],
    religion: ['无', '传统', '佛教', '基督教'],
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
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getMuseumInfo(options.id)
    }
    this.getsetting();

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
  onReady: function () {

  },
  getsetting() {
    var that = this;
    http({
      url: "api/setting"
    }).then(res => {
      if (res.code == 1) {
        that.data.roomPrice = res.data.price;
      }
    })
  },
  getMuseumInfo(id) {
    var that = this;
    http({
      url: "api/detail",
      data: { id: id }
    }).then(res => {
      if (res.code == 1) {
        that.setData({
          age: res.data.age,
          avatarUrl: res.data.avatar_url,
          name: res.data.name,
          sex: that.data.picker.indexOf(res.data.gender).toString(),
          jiyuText: res.data.description,
          date1: res.data.birthdate,
          date2: res.data.death,
          typeInd: res.data.is_pay,
          havedPay:res.data.is_pay == 1 ? true : false,
          region: [res.data.province, res.data.city, res.data.area],
          religionInd: that.data.religion.indexOf(res.data.religion).toString(),
          authorityInd: res.data.rule
        })
      }
    })
  },
  typePickerChange(e) {
    this.setData({
      typeInd: e.detail.value
    })
  },
  sexPickerChange(e) {
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
  // 姓名
  inputName(e) {
    var value = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },
  // 寄语
  inputJiyu(e) {
    var value = e.detail.value
    this.setData({
      jiyuText: e.detail.value
    })
  },
  // 保存2
  saveInfo(e) {
    var _this = this
    if (this.data.name == "") {
      wx.showToast({
        title: '请输入逝者姓名',
        icon: 'none'
      })
      return;
    }
    if (this.data.jiyuText == "") {
      wx.showToast({
        title: '请输入寄语',
        icon: 'none'
      })
      return;
    }
    if (this.data.age == "") {
      wx.showToast({
        title: '请选择生辰忌日',
        icon: 'none'
      })
      return;
    }
    if (!this.data.avatarUrl) {
      wx.showToast({
        title: '请选头像照片',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    var reg = /^http/;
    var params = {};
    params.data = {
      "user_id": app.globalData.user_id,
      "name": _this.data.name,
      "gender": _this.data.picker[_this.data.sex],
      "birthdate": _this.data.date1,
      "death": _this.data.date2,
      "age": _this.data.age,
      "description": _this.data.jiyuText,
      "province": _this.data.region[0],
      "city": _this.data.region[1],
      "area": _this.data.region[2],
      "religion": _this.data.religion[_this.data.religionInd],
      "category": _this.data.type[_this.data.typeInd],
      "is_pay": _this.data.typeInd, // is_pay 0 免费  1 付费
      "rule": _this.data.authorityInd
    }
    if (_this.data.id) {
      params.data.id = _this.data.id;
      params.url = "api/change";
    } else {
      params.data.is_pay = 0;
      params.url = "api/add";
    }
    if (reg.test(_this.data.avatarUrl)) {
      params.data["avatar_url"] = _this.data.avatarUrl
      _this.saveMuseum(params);
      return;
    }
    wx.uploadFile({
      url: app.globalData.server + 'api/upload?access_token=' + app.globalData.access_token, //接口
      filePath: this.data.avatarUrl,
      name: 'Room[avatar_url]',
      formData: {
        access_token: app.globalData.access_token
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        if (data.code == 1) {
          params.data["avatar_url"] = data.data.path;
          _this.saveMuseum(params);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  // 保存
  saveInfoStep(id, isEdit) {
    var _this = this;
    if (!_this.data.havedPay) {
      http({
        url: 'api/paysuccess',
        data: {
          type: 1, // type  付费产品 1: 房间 2: 背景 3: 贡品 4: 预约
          pay_num: _this.data.roomPrice, // 支付金额
          type_id: id,
        }
      }).then(res => {
        if (res.code == 1) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(res) {
              wx.showToast({
                title: "保存成功",
                icon: 'none'
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000);
            },
            fail(res) {
              if(!isEdit){
                http({
                  url: "api/roomdelete",
                  data: { room_id: id }
                }).then(res => {
                  console.log(res);
                })
              }
              wx.showToast({
                title: "支付失败",
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      });
    } else {
      wx.showToast({
        title: "保存成功",
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
    }
  },
  saveMuseum(params) {
    var that = this;
    http(params).then(res => {
      console.log(that)
      if (params.data.category == "付费") {
        if (params.data.id) {
          that.saveInfoStep(params.data.id, true)
        } else {
          that.saveInfoStep(res.data.id, false)
        }
      } else {
        wx.showToast({
          title: "保存成功",
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
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
    if (this.data.date2) {
      var age = GetAge(e.detail.value, this.data.date2);
      this.setData({
        age: age
      })
    }
  },
  deathDateChange(e) {
    this.setData({
      date2: e.detail.value
    })
    if (this.data.date1) {
      var age = GetAge(this.data.date1, e.detail.value);
      this.setData({
        age: age
      })
    }
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  ChooseImage() {
    var _this = this;
    if (_this.data.id) {
      return false;
    }
    var coordinate = _this.data.coordinate;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        // _this.setData({
        //   showCut: true
        // })
        // coordinate.img = res.tempFilePaths[0]
        // //获取到image-cropper实例
        // _this.cropper = _this.selectComponent("#image-cropper");
        // //开始裁剪
        _this.setData({
          avatarUrl: res.tempFilePaths[0],
        });
        // wx.navigateTo({
        //   url: '/pages/museum/cutImg/cutImg?url=' + res.tempFilePaths[0],
        // })
        // wx.showLoading({
        //   title: '加载中'
        // })
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
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);
    wx.hideLoading();
    //重置图片角度、缩放、位置
    setTimeout(() => {
      this.cropper.imgReset();
    })
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接 
      urls: [e.detail.url] // 需要预览的图片http链接列表
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
  cancelCut: function () {
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
  onShow: function () {

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
function GetAge(strBirthday, deathDay) {
  var returnAge,
    strBirthdayArr = strBirthday.split("-"),
    birthYear = strBirthdayArr[0],
    birthMonth = strBirthdayArr[1],
    birthDay = strBirthdayArr[2],
    d = new Date(),
    deathDayArr = deathDay.split("-"),
    nowYear = deathDayArr[0],
    nowMonth = deathDayArr[1],
    nowDay = deathDayArr[2];
  if (nowYear == birthYear) {
    returnAge = 0;//同年 则为0周岁
  }
  else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay;//日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth;//月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge;//返回周岁年龄
}