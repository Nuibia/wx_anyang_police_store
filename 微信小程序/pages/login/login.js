// pages/login/login.js
const fetch = require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    pwd: '',
    checked: true,
    limit: 1,
    isLogged: true
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
  // 获取账号
  hanldeAccount(ev) {
    this.setData({
      account: ev.detail.value
    })
  },
  //获取密码
  hanldePwd(ev) {
    this.setData({
      pwd: ev.detail.value
    })
  },
  //登陆
  handleLogin() {
    const account = this.data.account;
    const pwd = this.data.pwd;
    if (account == '' || account == undefined) {
      // wx.showToast({
      //   title: '账号不为空',
      // })
      fetch.wxShowToast('账号不能为空，请重新输入')
      return;
    }
    if (pwd == '' || pwd == undefined) {
      // wx.showToast({
      //   title: '密码不为空',
      // })
      fetch.wxShowToast('密码不为空，请重新输入')
      return;
    }
    fetch.wxRequest(
      '/ApiRoot/Login/UserLogin', {
        account: this.data.account,
        pwd: this.data.pwd,
        limit: this.data.limit
      },
      "post",
      "'content-type': 'application/json'"
    ).then(res => {
      if (res.data.Status == 'fail') {
        wx.showToast({
          title: res.data.Mess,
          icon:'none'
        })
        this.setData({
          pwd:''
        })
      } else {
        const cookies = res.cookies[0];
        const data = res.data;
        wx.setStorageSync('guid', data.Guid);
        wx.setStorageSync('cookies', cookies);
        wx.setStorageSync('account', this.data.account);
        wx.setStorageSync('limit', this.data.limit);
        this.setData({
          isLogged: false
        })
      }
    })
    // wx.request({
    //   url: app.baseUrl + '/ApiRoot/Login/UserLogin',
    //   method: 'post',
    // data: {
    //   account: this.data.account,
    //   pwd: this.data.pwd,
    //   limit: this.data.limit
    // },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: (res) => {
    //     console.log(res);
    //     if (res.data.Status == 'fail') {
    //       wx.showToast({
    //         title: res.data.Mess,
    //       })
    //     } else {
    //       const cookies = res.cookies[0];
    //       console.log(cookies)
    //       const data = res.data;
    //       wx.setStorageSync('guid', data.Guid);
    //       wx.setStorageSync('cookies', cookies);
    //       wx.setStorageSync('account', this.data.account);
    //       wx.setStorageSync('limit', this.data.limit);
    //       this.setData({
    //         isLogged: false
    //       })
    //     //   wx.showToast({
    //     //   title: '登陆成功!',
    //     //   success: () => {
    //     //     setTimeout(function() {
    //     //       wx.switchTab({
    //     //         url: '/pages/index/index'
    //     //       })

    //     //   }
    //     // })
    //     }
    //   },
    //   error(res) {
    //     console.log(res);
    //   }
    // })
  },
  //权限修改
  handleChange(ev) {
    const data = ev.detail.value;
    if (data) {
      this.setData({
        limit: 1
      })
    } else {
      this.setData({
        limit: 0
      })
    }
  },
  handleReset() {
    fetch.wxShowToast('请联系管理员');
  }
})