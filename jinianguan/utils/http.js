const app = getApp();
const http = (params) => {
  const openid = app.globalData.openid || '';
  const user_id = app.globalData.user_id || '';
  const access_token = app.globalData.access_token || '';
  params.data = params.data ? params.data : {}
  params.header = params.header ? params.header : { "Content-Type": "application/x-www-form-urlencoded" }
  // params.header["access_token"] = access_token
  // params.data.user_id = user_id
  if (!user_id){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
  // console.log(params)
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.server + params.url + "?access_token=" + access_token,
      method: params.method || 'post',
      header: params.header,
      data: params.data,
      success(res) {
        if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204 || res.statusCode === 304) {
          resolve(res.data)
        }
        // console.log(res)
      },
      fail(err) {
        reject(err)
        // console.log(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}

module.exports = http