// pages/shelves_show/shelves_show.js
const fetch = require('../../utils/fetch')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shelvesList: [],
    pageSize: 12,
    pageIndex: 1,
    sName: '',
    length: 0
    // hasMore: true
    // inputShowed:true
    // searchList:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getShelvesList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getShelvesList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // wx.showNavigationBarLoading();
    wx.showLoading({
      title: '正在加载',
      duration: 1000
    })
    this.getShelvesList();
    setTimeout(function() {

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        duration: 500
      })
    }, 500)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    const pageIndex = this.data.pageIndex
    const pageSize=this.data.pageSize
    if (pageIndex < this.data.length / pageSize) {
      this.setData({
        pageIndex: pageIndex + 1
      })
      console.log(this.data.length)
      wx.request({
        url: app.baseUrl + '/api/ShelveSearch',
        method: 'GET',
        data: {
          pageSize: this.data.pageSize,
          pageIndex: this.data.pageIndex,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: () => {
          this.setData({
            shelvesList: res.data.Data
          })
          wx.hideLoading();
          console.log(res.data)
        },



      })
    } else {
      wx.showToast({
        title: '加载完毕',
        duration: 2000
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getShelvesList() {
    const guid = wx.getStorageSync('guid')
    if (guid != '') {
      console.log(guid)
      wx.request({
        url: app.baseUrl + '/api/ShelveSearch',
        method: 'GET',
        data: {
          pageSize: this.data.pageSize,
          pageIndex: this.data.pageIndex,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          console.log(11)
          console.log(res.data)
          if (res.data.Status==2) {
            wx.showToast({
              title: '身份已过期请先登录',
              icon: 'none',
              success: () => {
                // setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/login/login',
                  })
                // }, 2000)
              wx.clearStorage();
              }
            })
          } 
          else if (res.data.Status==0) {
            if (res.data.Data != '') {
              this.setData({
                shelvesList: res.data.Data,
                length: res.data.length
              })
            } 
          }
          
          
        },
        error: (res) => {
          console.log(res)
        }

      })
    } else {
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/login/login',
            })
          }, 2000)

        }
      })
    }

  },


  handleInput(e) {
    console.log(e.detail.value)
    const sName = this.data.sName;
    this.setData({
      sName: e.detail.value
    })
    console.log(this.data.sName)
    const guid = wx.getStorageSync('guid')
    if (this.data.sName != '') {
      wx.request({
        url: app.baseUrl + '/api/ShelveSearch',
        method: 'GET',
        data: {
          sName: this.data.sName,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          console.log(res.data);
          this.setData({
            shelvesList: res.data.Data
          })
        },
        error: (res) => {
          console.log(res)
        }
      })
    } else {
      this.getShelvesList()
    }

  },

})