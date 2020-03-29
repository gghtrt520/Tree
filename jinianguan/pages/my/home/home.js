// pages/my/home/home.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    // bgImg: "/images/20200328005307.jpg",
    bgImg: app.globalData.server + "upload/20200328005307.jpg",
    ColorList: app.globalData.ColorList
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cropperload(e) {
      console.log("cropper初始化完成");
    },
    loadimage(e) {
      console.log("图片加载完成", e.detail);
      wx.hideLoading();
      //重置图片角度、缩放、位置
      this.cropper.imgReset();
    },
    clickcut(e) {
      console.log(e.detail);
      //点击裁剪框阅览图片
      wx.previewImage({
        current: e.detail.url, // 当前显示图片的http链接
        urls: [e.detail.url] // 需要预览的图片http链接列表
      })
    },
    goToRegister: function(){
      wx.navigateTo({
        url: '/pages/register/register?id=1'
      })
    },
    goToSuggest:function(){
      wx.navigateTo({
        url: '/pages/suggest/suggest?id=1'
      })
    },
    goToAbout: function () {
      wx.navigateTo({
        url: '/pages/about/about?id=1'
      })
    },
    getUserInfo: function (e) {
      console.log(e)
      if (e.detail.userInfo){
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        app.globalData.hasAtuo = true
        loginUser(e.detail.userInfo, this)
      }else{
        this.setData({
          userInfo: null,
          hasUserInfo: false
        })
      }
    }
  }
})
function loginUser(userInfo, that) {
  // 登录
  wx.login({
    success: res => {
      console.log(res.code)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        //发起网络请求
        wx.request({
          url: app.globalData.server + 'api/login',
          method: 'post',
          data: {
            nick_name: userInfo.nickName,
            avatar_url: userInfo.avatarUrl,
            gender: userInfo.gender,
            js_code: res.code
          },
          success(response) {
            let data = response.data
            if (data.code == 1) {
              wx.setStorageSync('openid', data.data.openid)
              app.globalData.openid = data.data.openid
              app.globalData.user_id = data.data.user_id
              app.globalData.access_token = data.data.access_token
              console.log(app.globalData)
            } else {
              wx.showToast({
                icon: 'none',
                title: '登录失败，请重试'
              })
            }
          },
          fail(err) {
            wx.showToast({
              icon: 'none',
              title: '登录失败，请重试'
            })
          }
        })
      }
    }
  })
}