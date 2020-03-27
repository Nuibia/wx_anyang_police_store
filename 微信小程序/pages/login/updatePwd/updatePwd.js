// pages/login/updatePwd/updatePwd.js
const app = getApp();
const fetch = require('../../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd: '',
    newPwd: '',
    newPwdAg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    fetch.userLogin(this);
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
    fetch.userLogin(this);
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

  },
  hanldePwd(ev) {
    // console.log(ev);
    this.setData({
      pwd: ev.detail.value
    })
  },
  hanldeNewPwd(ev) {
    this.setData({
      newPwd: ev.detail.value
    })
  },
  hanldeNewPwdAg(ev) {
    this.setData({
      newPwdAg: ev.detail.value
    })
  },
  handleUpdate() {
    const pwd = this.data.pwd;
    const newPwd = this.data.newPwd;
    const newPwdAg = this.data.newPwdAg;
    if (pwd == '' || pwd == undefined) {
      // wx.showToast({
      //   title: '原密码不能空',
      // })
      fetch.wxShowToast('原密码不能为空，请重新输入')
      return;
    }
    if (newPwd == "" || newPwd == undefined) {
      fetch.wxShowToast('新密码不能为空，请重新输入')
      return;
    }
    if (newPwd != newPwdAg) {
      fetch.wxShowToast('两次输入新密码不一致，请重新输入')
      return;
    }
    var account = wx.getStorageSync('account');
    var guid = wx.getStorageSync('guid');
    wx.request({
      url: app.baseUrl + '/api/ModifyUserPwd/ModifyPwd',
      method: 'post',
      data: {
        account,
        pwd: this.data.pwd,
        newPwd: this.data.newPwd,
        guid
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': wx.getStorageSync('cookies'),
      },
      success: (res) => {
        console.log(res);
        if (res.data.Status == 'authFail') {
          wx.showToast({
            title: '登陆超时,请重新登录',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '修改成功,请重新登录！',
            icon: 'none'
          });
        }
        wx.clearStorageSync();
        wx.switchTab({
          url: '/pages/login/login'
        })
      },
      error(res) {
        fetch.wxShowToast('网络错误！');
      }
    })
  },
  // login() {
  //   var guid = wx.getStorageSync('guid');
  //   if (guid == "" || guid == undefined) {
  //     wx.showToast({
  //       title: '暂无登录，请登录!',
  //       success: () => {
  //         wx.switchTab({
  //           url: '/pages/login/login'
  //         })
  //       }
  //     })

  //   }
  // }
})