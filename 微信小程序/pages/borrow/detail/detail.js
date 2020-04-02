// pages/borrow/detail/detail.js
const fetch = require('../../../utils/fetch')
const appDatas = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailData:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { id } = options
    const guid = wx.getStorageSync('guid')
    const cookie = wx.getStorageSync('cookies')
    const data = [appDatas.data.returnInfo]
    // console.log(data)
    fetch.wxRequest('/api/BackGoods/GetUseDetial', {
        useLogsId: id,
        guid
      },
      "GET",
      {
        'content-type': 'application/json', // 默认值
        'Cookie': wx.getStorageSync('cookies'), 
      },
    ).then((res) => {
        this.setData({
          detailData: [...res.data.Data, ...data]
        })
    })

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})