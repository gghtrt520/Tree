const app = getApp();
const http = require("../../../utils/http.js");
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    bgImg: app.globalData.server + 'upload/background.png',
    taocanInd: null,
    taocanText: '',
    taocanList: [{
      name: "免费套餐",
      description: "擦拭墓碑+敬香",
      price: 0
    }],
    date: "",
    time1: "08:00",
    time2: "08:00",
    cemetery: "",
    cemeteryNum: "",
    name: "",
    card: "",
    phone: ""
  },
  lifetimes: {
    attached() {
      var day2 = new Date();
      day2 = day2.setDate(day2.getDate() + 1);
      day2 = new Date(day2);
      day2.setTime(day2.getTime());
      var month = day2.getMonth() + 1 > 9 ? day2.getMonth() + 1 : '0' + (day2.getMonth() + 1);
      var day = day2.getDate() > 9 ? day2.getDate() : '0' + day2.getDate();
      var s2 = day2.getFullYear() + "-" + month + "-" + day;

      this.setData({
        date: s2
      })

      this.combinationlist();
    }
  },
  methods: {
    combinationlist() {
      var that = this;
      http({
        url: "api/combinationlist"
      }).then(res => {
        console.log(res)
        that.setData({
          taocanList: res.data
        })
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    cemeteryInput(e) {
      this.setData({
        cemetery: e.detail.value
      })
    },
    cemeteryNumInput(e) {
      this.setData({
        cemeteryNum: e.detail.value
      })
    },
    nameInput(e) {
      this.setData({
        name: e.detail.value
      })
    },
    phoneInput(e) {
      this.setData({
        phone: e.detail.value
      })
    },
    payMoney() {
      http({
        url: 'api/paysuccess'
      }).then(res => {
        console.log(res)
      })
    },
    cardInput(e) {
      this.setData({
        card: e.detail.value
      })
    },
    yuyueBtn() {
      if (!this.data.cemetery) {
        wx.showToast({
          title: '请输入墓园名称',
          icon: 'none'
        });
        return;
      }
      if (!this.data.cemeteryNum) {
        wx.showToast({
          title: '请输入墓位号码',
          icon: 'none'
        });
        return;
      }
      if (!this.data.name) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.data.phone) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      if (!this.data.card) {
        wx.showToast({
          title: '请输入身份证号',
          icon: 'none'
        });
        return;
      }
      var that = this;
      var taoCan = this.data.taocanList[this.data.taocanInd]
      if (taoCan.price > 0) {
        http({
          url: 'api/paysuccess',
          data: {
            type: 4, // type  付费产品 1: 房间 2: 背景 3: 贡品 4: 预约
            pay_num: taoCan.price, // 支付金额
            type_id: taoCan.id
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
                that.saveInfo();
              },
              fail(res) {
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
        })
      } else {
        this.saveInfo()
      }
    },
    saveInfo() {
      var that = this;
      wx.showLoading({
        title: '保存中',
        mask: true
      })
      http({
        url: 'api/appointmentcreate',
        data: {
          cemetery: this.data.cemetery,
          date: this.data.date,
          start: this.data.date + " " + this.data.time1,
          end: this.data.date + " " + this.data.time2,
          name: this.data.name,
          phone: this.data.phone,
          idcard: this.data.card,
          cemetery_num: this.data.cemeteryNum,
          combination_id: this.data.taocanList[this.data.taocanInd].id
        }
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          });
          that.setData({
            name: "",
            card: "",
            phone: ""
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      })
    },
    radioChange: function(e) {
      this.setData({
        taocanInd: e.detail.value,
        taocanText: this.data.taocanList[e.detail.value].name
      })
      this.hideModal()
    },
    DateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },
    Time1Change(e) {
      this.setData({
        time1: e.detail.value
      })
    },
    Time2Change(e) {
      this.setData({
        time2: e.detail.value
      })
    }
  }
});