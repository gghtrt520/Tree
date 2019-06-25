const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    title:'点击选择',
    listArr:[],
    properStr:'',
    hidden: true
  },
  onLoad(options) {
    console.log(options)
    if (options.id == 'categoryInd'){
      this.setData({
        properStr: 'categoryInd',
        listArr: app.globalData.treeCategory
      })
    }
    if (options.id == 'propertyInd') {
      this.setData({
        properStr: 'propertyInd',
        listArr: app.globalData.propertyUnit
      })
    }
    if (options.id == 'constructionInd') {
      this.setData({
        properStr: 'constructionInd',
        listArr: app.globalData.constructionUnit
      })
    }
    if (options.id == 'conservationInd') {
      this.setData({
        properStr: 'conservationInd',
        listArr: app.globalData.conservationUnit
      })
    }
  },
  // 分类筛选
  searchKey(e){
    let val = e.detail.value
    if (this.data.properStr == 'categoryInd') {
      this.arrSort(val, app.globalData.treeCategory)
    }
    if (this.data.properStr == 'propertyInd') {
      this.arrSort(val, app.globalData.propertyUnit)
    }
    if (this.data.properStr == 'constructionInd') {
      this.arrSort(val, app.globalData.constructionUnit)
    }
    if (this.data.properStr == 'conservationInd') {
      this.arrSort(val, app.globalData.conservationUnit)
    }
  },
  arrSort(val='', list){
    let regex = new RegExp(val)
    let arr = list.map(item => {
      let newArr = { ...item }
      console.log(regex.test(item.name))
      if (regex.test(item.name)) {
        newArr.hide = false
      } else {
        newArr.hide = true
      }
      return newArr
    })
    this.setData({
      listArr: arr
    })
  },
  //获取文字信息
  selecTap(e) {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; 
    let ind = e.currentTarget.dataset.id
    if (this.data.properStr == 'categoryInd') {
      prevPage.setData({
        categoryInd: app.globalData.treeCategory[ind],
      })
    }
    if (this.data.properStr == 'propertyInd') {
      prevPage.setData({
        propertyInd: app.globalData.propertyUnit[ind],
      })
    }
    if (this.data.properStr == 'constructionInd') {
      prevPage.setData({
        constructionInd: app.globalData.constructionUnit[ind],
      })
    }
    if (this.data.properStr == 'conservationInd') {
      prevPage.setData({
        conservationInd: app.globalData.conservationUnit[ind],
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      properStr: '',
      listArr: []
    })
  }
  
});