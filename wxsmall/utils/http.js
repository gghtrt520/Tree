const app = getApp();
const http = (params)=>{
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
        resolve(res)
        console.log(res.data)
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

module.exports = {
  http: http
}