Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/banner/banner2.jpg'
    }, {
      id: 1,
      type: 'image',
      url: '/images/banner/banner1.jpg',
    }],
    listImg: [{
      id: 1,
      type: 'image',
      name: '邵逸夫邵逸夫',
      url: '/images/邵逸夫.jpg'
    }, {
      id: 2,
      type: 'image',
      name: '邵逸夫',
      url: '/images/邵逸夫.jpg'
    }]
  },
  methods: {
    goToMuseum(e) {
      var obj = e.currentTarget.dataset;
      this.triggerEvent('goMuseum', e.currentTarget.dataset, {
        bubbles: true
      })
    }
  }
})