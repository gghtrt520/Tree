// pages/listtree/listtree.js
const app = getApp();
const sizepage = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    currentPage: 0,
    CustomBar: app.globalData.CustomBar,  
    listTree:[],
    titleKey: '',
    hasdata: true,
    scrollLeft: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //滑动到底部触发事件
  bindDownLoad: function () {
    var that = this;
    //调用商品信息方法
    if (that.data.hasdata) {
      this.loadMore()
    }
  },
  // 树种分类选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  // 加载更多
  loadMore() {
    this.data.currentPage++
    getCardData(this.data.currentPage, sizepage, this.data.titleKey).then(res => {
      let newArr = res.data.map(item => {
        return item
      })
      this.setData({
        listTree: this.data.listTree.concat(newArr)
      })
      if (newArr.length < sizepage) {
        this.setData({
          hasdata: false
        })
      }
    })
  },
  // 关键字搜索
  search() {
    this.data.currentPage = 0
    getCardData(0, sizepage, this.data.titleKey).then(res => {
      console.log(res)
      let newArr = res.data.map(item => {
        return item
      })
      this.setData({
        listTree: newArr,
        hasdata: true
      })
    })
  },
  // 跳转详情页
  goDetail(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  // 搜索输入框
  searchInput(e) {
    this.setData({
      titleKey: e.detail.value
    })
  }
})

// 数据库查询
function getCardData(page, size, key = '') {
  console.log(page, size, key)
  return new Promise((resolve,reject)=>{
    resolve({data:[1, 2, 3, 4]})
  })
}