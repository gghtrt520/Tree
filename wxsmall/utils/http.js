const app = getApp();
const http = (params)=>{
  const openid = wx.getStorageSync('openid') || ''
  params.data = params.data ? params.data : {}
  params.data['openid'] = openid
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.app_url + params.url,
      method: params.method || 'post',
      header: params.header,
      data: params.data,
      success(res) {
        if (res.statusCode === 200){
          resolve(res.data)
        }
        console.log(res)
      },
      fail(err){
        reject(err)
        console.log(err)
      },
      complete(){
        wx.hideLoading()
      }
    })
  })
}

module.exports = http