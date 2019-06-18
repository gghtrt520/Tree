// pages/listtree/listtree.js
const app = getApp();
const util = require('../../utils/util.js')
const http = require("../../utils/http.js")
let sizepage = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    currentPage: 1,
    categoryId: '',
    CustomBar: app.globalData.CustomBar,  
    listTree:[],
    treeCategory: [{
      id: '',
      name: '全部'
    }],
    titleKey: '',
    hasdata: true,
    scrollLeft: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 分类列表
    http({
      url: '/api/get-list',
    }).then(res => {
      if (res.status == 1) {
        let arr = this.data.treeCategory.concat(res.data.tree_category)
        this.setData({
          treeCategory: arr
        })
        this.search()
      }
    }).catch(err => {
      console.log(err)
    })
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
      TabCur: e.currentTarget.dataset.index,
      categoryId: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.index - 1) * 60
    },()=>{this.search()})
  },
  // 加载更多
  loadMore() {
    this.data.currentPage++
    getCardData(this.data.currentPage, this.data.categoryId, this.data.titleKey).then(res => {
      let newArr = res.data.tree_list.map(item => {
        let ind = util.getArrInd(this.data.treeCategory, item.tree_category_id, 'id')
        item.treeCategory = this.data.treeCategory[ind].name
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
  // 砍伐
  cutBtn(e){
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 移植
  moveBtn(e) {
    wx.showToast({
      title: '此功能研发中',
      icon: 'none'
    })
  },
  // 关键字搜索
  search() {
    this.data.currentPage = 1
    getCardData(1, this.data.categoryId, this.data.titleKey).then(res => {
      let newArr = res.data.tree_list.map(item => {
        let ind = util.getArrInd(this.data.treeCategory, item.tree_category_id, 'id')
        item.treeCategory = this.data.treeCategory[ind].name
        return item
      })
      sizepage = res.data.per_page
      this.setData({
        listTree: newArr,
        hasdata: true
      })
    })
  },
  // 跳转详情页
  goDetail(e){
    let id = e.currentTarget.dataset.id
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
function getCardData(page = 1, sort = '', key = '') {
  let data = {}
  data.page = page
  data.tree_number = key
  data.tree_category_id = sort
  return new Promise((resolve,reject)=>{
    http({
      url: '/api/tree-list',
      data: data
    }).then(res=>{
      if(res.status==1){
        resolve({data:res.data})
      }else{
        resolve({data:[]})
      }
    }).catch(err=>{
      reject(err)
    })
  })
}