// pages/eqshow/eqshow.js
const fetch = require('../../utils/fetch')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  // 下拉选择框picker
  mixins: [require('../../mixin/themeChanged')],
  // 按钮
  mixins: [require('../../mixin/themeChanged')],
  data: {

    //picker数据初始化
    kindData: [],
    index: '',
    cName: '',

    // 搜索框数据初始化
    inputShowed: false,
    inputVal: "",
    //搜索框的模糊查询初始化
    eName: '',

    // 表格渲染数据初始化
    listData: [],
    pageSize: 10,
    pageIndex: 1,

  },

  // 搜索框设置
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getListData();
    this.getKindData();
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
    this.getListData();
    this.getKindData();
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

  //页面上拉加载
  onReachBottom: function() {
    //显示加载图标
    wx.showLoading({
      title: '加载更多数据',
    })
    const pageIndex = this.data.pageIndex
    if (pageIndex < this.data.length / pageSize) {
      this.setData({
        pageIndex: pageIndex + 1
      })
      console.log(this.data.length)
      wx.request({
        method: 'get',
        url: app.baseUrl + '/api/GoodsNameSearch',
        data: {
          pageSize: this.data.pageSize,
          pageIndex: this.data.pageIndex,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', //默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          //回调函数
          this.setData({
            getListData: res.data.Data,
          })
          //隐藏加载框
          wx.hideLoading();
          console.log(res.data)
        },
      })
    } else {
      wx.showToast({
        title: '已经到最后了',
        duration: 1000
      })
    }
  },

  // 页面下拉刷新
  onPullDownRefresh: function() {
    //显示加载图标
    wx.showLoading({
      title: '正在刷新',
      duration: 1000
    })
    this.getListData();
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        duration: 500
      })
    }, 500)
  },

  //获取列表信息,登录验证
  getListData() {
    const guid = wx.getStorageSync('guid')
    if (guid != '') {
      console.log(guid)
      wx.request({
        url: app.baseUrl + '/api/GoodsNameSearch',
        method: 'GET',
        data: {
          pageSize: this.data.pageSize,
          pageIndex: this.data.pageIndex,
          // cName=this.data.cName,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          console.log(res.data)
          if (this.data.Status == 2) {
            wx.showToast({
              title: '身份已过期请先登录',
              duration: 3000,
              icon: 'none',
              success: () => {
                wx.switchTab({
                  url: '/pages/login/login',
                })
                wx.clearStorage();
              }
            })
          } else if (res.data.Status == 0) {
            if (res.data.Data != '') {
              this.setData({
                listData: res.data.Data,
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
        duration: 3000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/login/login',
            })
          }, 3000)

        }
      })
    }

  },

  //点击picker获取所有器材的种类
  getKindData() {
    const guid = wx.getStorageSync('guid')
    console.log(guid)
    wx.request({
      url: app.baseUrl + '/api/Category/GetAllCategory',
      method: 'get',
      data: {
        guid: wx.getStorageSync('guid')
      },
      header: {
        'content-type': 'application/json', //默认值
        'Cookie': wx.getStorageSync('cookies'),
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          kindData: res.data.Data,
        })
      },


      error: (res) => {
        console.log(res)
      },
    })
  },
  //查看全部按钮
  lookAll: function(e) {
    this.getListData()
  },
  //搜索框模糊查询
  handleInput: function(e) {
    console.log(e.detail.value)
    const eName = this.data.eName;
    this.setData({
      eName: e.detail.value
    })
    console.log(this.data.eName)
    const guid = wx.getStorageSync('guid')
    if (this.data.eName != '') {
      wx.request({
        url: app.baseUrl + '/api/GoodsNameSearch',
        method: 'get',
        data: {
          eName: this.data.eName,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', //默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          console.log(res.data);
          this.setData({
            listData: res.data.Data
          })
        },
        error: (res) => {
          console.log(res)
        }
      })
    } else {
      this.getListData()
    }
  },

  //动态生成具体品名种类列表
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    // console.log(e);
    console.log(this.data.kindData)
    console.log(this.data.kindData[this.data.index].cName)
    this.setData({
      cName: this.data.kindData[this.data.index].cName
    })

    const guid = wx.getStorageSync('guid')
    if (this.data.cName != '') {
      wx.request({
        url: app.baseUrl + '/api/GoodsNameSearch',
        method: 'get',
        data: {
          pageSize: this.data.pageSize,
          pageIndex: this.data.pageIndex,
          cName: this.data.cName,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', //默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success: (res) => {
          console.log(res.data);
          this.setData({
            listData: res.data.Data
          })
        },
        error: (res) => {
          console.log(res)
        }
      })
    } else {
      this.getListData()
    }
  },

})