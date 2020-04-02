// pages/borrow/borrow.js

const fetch = require('../../utils/fetch.js')
const {
  PAGE_SIZE
} = require('../../utils/constant.js')
let appDatas = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2019-01-01', //查询的开始时间
    endTime: '00-00-00', //查询的结束时间
    isShow: true, // 没有数据显示无
    table: [], //表格页面数据
    totalArr: [], // 页面总数 和 当前页面是否被选中
    isReturn: false, // 是否归还的样式
    isChecked: true, //页面号样式的改变
    pageIndex: 1, //记录当前的页面号
    isClickFind:false

  },
  //开始日期
  bindStartDateChange(e) {
    // console.log(e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  //结束日期
  bindEndDateChange(e) {
    // console.log(e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //时间查询
  handleCatchtap() {
    let {
      startTime,
      endTime,
      pageIndex
    } = this.data
    this.setData({
      isClickFind:true
    })
    startTime = startTime.replace(/-/g, '/')
    endTime = endTime.replace(/-/g, '/')
    console.log(startTime)
    const guid = wx.getStorageSync('guid')
    if (startTime < endTime) {
      fetch.wxRequest('/api/BackGoods/GetGoodsForBack', {
          startTime,
          endTime,
          pageIndex: pageIndex.toString(),
          pageSize: PAGE_SIZE.toString(),
          guid
        },
        'GET', {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
      ).then(res => {
        const {
          Data,
          Status,
          length
        } = res.data
        console.log(length)

        if (parseInt(Status) === 0) {
          let totalArr = []
          this.paging(totalArr, length)
          this.setData({
            table: Data,
            totalArr
          })
        }
      })
    } else {
      fetch.wxShowToast('截至日期必须比开始日期大')
      this.setData({
        startTime: '2019-01-01',
        endTime: '00-00-00'
      })
    }
  },
  //处理点击改变状态
  handleReturn(e) {
    const {
      id
    } = e.target.dataset
    let {
      table,
      isReturn
    } = this.data
    const guid = wx.getStorageSync('guid')
    let tableIndex = table.findIndex(item => item.id === id)
    if (!table[tableIndex].ustate) {
      wx.showModal({
        title: '提示',
        content: '是否归还器材',
        success: (res) => {
          if (res.confirm) {
            // console.log('用户点击确定')
            fetch.wxRequest('/api/BackGoods/GetUseDetial', {
                useLogsId: id,
                guid
              },
              "GET", {
                'content-type': 'application/json', // 默认值
                'Cookie': wx.getStorageSync('cookies'),
              },
            ).then(res => {
              // console.log(res)
              let dataArr = res.data.Data[0]
              dataArr['guid'] = guid
              return fetch.wxRequest('/apiroot/BackEquipment/BackEquipmentInfo', [dataArr],
                'POST', {
                  'content-type': 'application/json', // 默认值
                  'Cookie': wx.getStorageSync('cookies'),
                }
              )
            }).then(res => {
              // console.log(res)
              if (res.data.Status === 'ok') {
                table[tableIndex].ustate = !table[tableIndex].ustate
                this.setData({
                  table
                })
                wx.showToast({
                  title: '修改成功',
                  icon: 'success'
                })
              }

            })


          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }

  },
  //获取表单信息函数,两种情况 一种是点击了查询的 一种是没有点击查询的
  getData(pageIndex = 1, url,startTime,endTime) {
    if(!this.data.isClickFind){
      console.log(1)
      return fetch.wxRequest(url, {
        pageSize: PAGE_SIZE,
        pageIndex: pageIndex,
        guid: wx.getStorageSync('guid')
      },
        'GET', {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
      )
    }
    return fetch.wxRequest(url, {
      pageSize: PAGE_SIZE,
      pageIndex: pageIndex,
      startTime,
      endTime,
      guid: wx.getStorageSync('guid')
    },
      'GET', {
        'content-type': 'application/json', // 默认值
        'Cookie': wx.getStorageSync('cookies'),
      },
    )
  },
  //上一页
  handlePrev() {
    let {
      pageIndex,
      totalArr,
      isChecked
    } = this.data
    if (pageIndex > 1) {
      pageIndex--
      this.selectedPage(pageIndex)
      this.setData({
        pageIndex,
      })
    } else {
      fetch.wxShowToast('已经是第一页了')
    }
  },
  //下一页
  handleNext() {
    let {
      pageIndex,
      totalArr
    } = this.data
    if (pageIndex < totalArr.length) {
      pageIndex++
      this.selectedPage(pageIndex)
      this.setData({
        pageIndex,
      })
    } else {
      fetch.wxShowToast('已经是最后页了')
    }
  },
  //切换到选中的页面 的请求数据和样式改变
  selectedPage(pageIndex) {
    let {totalArr,isClickFind,startTime,endTime} = this.data
    for (let i = 0; i < totalArr.length; i++) {
      totalArr[i].isChecked = false
    }
    for (let i = 0; i < totalArr.length; i++) {
      if (i === pageIndex - 1) {
        totalArr[i].isChecked = true
        continue
      }
      totalArr[i].isChecked = false
    }
    this.setData({
      totalArr
    })
    if(!isClickFind){
      this.getData(pageIndex, '/api/BackGoods/GetGoodsForBack').then(res => {
        if (parseInt(res.data.Status) === 2) {
          fetch.wxShowToast('用户身份过期')
          wx.clearStorage();
          return wx.switchTab({
            url: '/pages/login/login',
          })
        }
        this.setData({
          table: res.data.Data,
          pageIndex
        })
      })
    } else {
      this.getData(pageIndex, '/api/BackGoods/GetGoodsForBack', startTime, endTime).then(res => {
        if (parseInt(res.data.Status) === 2) {
          fetch.wxShowToast('用户身份过期')
          wx.clearStorage();
          return wx.switchTab({
            url: '/pages/login/login',
          })
        }
        this.setData({
          table: res.data.Data,
          pageIndex
        })
      })
    }
  
  },
  // 点击页码页面切换
  handleClickPageIndex(e) {
    const pageIndex = e.target.dataset.pageindex
    this.selectedPage(pageIndex)
  },
  //点击首、尾页切换
  handleClickHeadPageAndTailPage(e) {
    const {
      status
    } = e.target.dataset
    const {
      totalArr
    } = this.data
    // status=== 0 是首页 1 是尾页
    if (parseInt(status) === 0) {
      this.selectedPage(1)
    } else {
      this.selectedPage(totalArr.length)
    }
  },

  //页面初始加载函数
  onLoad: function(options) {
    const limit = wx.getStorageSync('limit')
    if (limit !== 1) {
      return wx.switchTab({
        url: '/pages/login/login',
      })
    }
    this.getData(1, '/api/BackGoods/GetGoodsForBack').then(res => {
      if (parseInt(res.data.Status) === 2) {
        fetch.wxShowToast('用户身份过期')
        wx.clearStorage();
        return wx.switchTab({
          url: '/pages/login/login',
        })
      }
      let totalArr = []
      this.paging(totalArr, res.data.length)
      this.setData({
        table: res.data.Data,
        totalArr
      })
    })
  },
  //进入详情页 把数据存入appDatas中
  handleDetail(e) {
    const {
      table
    } = this.data
    const {
      id
    } = e.target.dataset
    const infoItem = table.find(item => item.id === id)
    appDatas.data.returnInfo = infoItem

  },
  //分页器
  paging(totalArr, length) {
    for (let i = 0; i < Math.floor(length / PAGE_SIZE); i++) {
      if (i === 0) {
        totalArr.push({
          isChecked: true,
          pageIndex: i + 1
        })
        continue
      }
      totalArr.push({
        isChecked: false,
        pageIndex: i + 1
      })
      if (length % PAGE_SIZE !== 0 && i === Math.floor(length / PAGE_SIZE) - 1) {
        totalArr.push({
          isChecked: false,
          pageIndex: i + 2
        })
      }
    }
  }
})