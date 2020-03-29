// pages/records/records.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_array:['器械归还记录', '器械借出记录', '器械报废记录', '器械损耗记录', '器械购买记录'],

    thead:[       //存放表格头的数据数组
      {id:1, name:"序号"},
      {id:2, name:"单号", isWidth:'width'},
      {id:3, name:"日期", isWidth:'width'},
      {id:4, name:"品名"},
      {id:5, name:"种类"},
      {id:6, name:"货架号"},
      {id:7, name:"数量"},
      {id:8, name:"批准人"},
      {id:9, name:"管理员"},
      {id:10, name:"备注"},
      {id:11, name:"图片"},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})