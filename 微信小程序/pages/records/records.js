// pages/records/records.js
const fetch = require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker_array:['器械归还记录', '器械借出记录', '器械报废记录', '器械损耗记录', '器械购买记录'],
    picker_value:'', //picker的value值
    beginTime:'',     //开始时间值
    overTime:'',      //结束时间值
    thead:[   //默认表头是归还记录
      {id:1, name:"序号"},
      {id:2, name:"单号", isWidth:'width'},
      {id:3, name:"日期", isWidth:'width'},
      {id:4, name:"品名"},
      {id:5, name:"种类"},
      {id:6, name:"货架号"},
      {id:7, name:"数量"},
      {id:8, name:"使用人"},
      {id:9, name:"管理员"},
      {id:10, name:"备注"}
    ],
    displayArray:[],
  },
  pageData:{
    //是否是按照时间查询的记录
    isTimeDisplay:false,
    controller:'BackLogsSearch',
    //header
    header:{
      'content-type': 'application/json' ,
      'Cookie': wx.getStorageSync('cookies'),
    },
    //发送请求的参数
    params:{
      pageSize:12,
      pageIndex:1,
      guid:'',
    },
    withTimeparams:{
      pageSize:12,
      pageIndex:1,
      guid:'',
      startTime:'',
      endTime:'',
    },
    //归还和借出表头数组
    guihuanAndjiechu:[
      {id:1, name:"序号"},
      {id:2, name:"单号", isWidth:'width'},
      {id:3, name:"日期", isWidth:'width'},
      {id:4, name:"品名"},
      {id:5, name:"种类"},
      {id:6, name:"货架号"},
      {id:7, name:"数量"},
      {id:8, name:"使用人"},
      {id:9, name:"管理员"},
      {id:10, name:"备注"}
    ],
    //报废表头数组
    baofei:[
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
    //损耗和购买表头数组
    sunhaoAndgoumai:[
      {id:1, name:"序号"},
      {id:3, name:"日期", isWidth:'width'},
      {id:4, name:"品名", isWidth:'width'},
      {id:5, name:"种类"},
      {id:6, name:"货架号"},
      {id:7, name:"数量"},
      {id:9, name:"管理员"},
      {id:10, name:"备注"}
    ],
  },
  onLoad: function (options) {
    const guid = wx.getStorageSync('guid');
    const cookies = wx.getStorageSync('cookies');
    this.pageData.header = {
      'content-type': 'application/json' ,
      'Cookie': cookies,
    },
    this.pageData.params.guid = guid;
    this.pageData.withTimeparams.guid = guid;
    console.log(this.pageData.params);
    this.getData('BackLogsSearch', this.pageData.params, this.pageData.header);
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },
  //触底继续加载事件
  onReachBottom: function () {
    console.log('触底事件触发');
    if(this.pageData.isTimeDisplay == false){
      //如果不是按照时间查询的记录
      this.pageData.params.pageIndex ++;
      this.getData(this.pageData.controller, this.pageData.params, this.pageData.header);
    }else{
      //是按照时间查询的记录
      this.pageData.withTimeparams.pageIndex ++;
      this.getData(this.pageData.controller, this.pageData.withTimeparams, this.pageData.header);
    }
  },
  //pickerchange事件
  handlePickerChange(e){
    // console.log(e);
    this.pageData.isTimeDisplay = false;
    const picker_value = this.data.picker_array[e.detail.value];
    this.setData({
      picker_value,
    })
    if(picker_value === '器械归还记录'){
      this.pageData.controller = 'BackLogsSearch';
      this.pageData.params.pageIndex = 1;
      this.setData({
        thead:this.pageData.guihuanAndjiechu,
        displayArray:[]
      })
    }
    if(picker_value === '器械借出记录'){
      this.pageData.controller = 'LendLogsSearch';
      this.pageData.params.pageIndex = 1;
      this.setData({
        thead:this.pageData.guihuanAndjiechu,
        displayArray:[]
      })
    }
    if(picker_value === '器械报废记录'){
      this.pageData.controller = 'ScrapLogsSearch';
      this.pageData.params.pageIndex = 1;
      this.setData({
        thead:this.pageData.baofei,
        displayArray:[]
      })
    }
    if(picker_value === '器械损耗记录'){
      this.pageData.controller = 'LossLogsSearch';
      this.pageData.params.pageIndex = 1;
      this.setData({
        thead:this.pageData.sunhaoAndgoumai,
        displayArray:[]
      })
    }
    if(picker_value === '器械购买记录'){
      this.pageData.controller = 'NewLogsSearch';
      this.pageData.params.pageIndex = 1;
      this.setData({
        thead:this.pageData.sunhaoAndgoumai,
        displayArray:[]
      })
    }
    //知道picker_value后就根据picker_value发送请求
    this.getData(this.pageData.controller, this.pageData.params, this.pageData.header);
  },
  //开始时间pickerchange事件
  handleBeginPickerChange(e){
    // console.log(e);
    const beginTime = e.detail.value;
    this.pageData.withTimeparams.startTime = beginTime;
    this.setData({
      beginTime,
    })
  },
  //结束时间pickerchange事件
  handleOverPickerChange(e){
    // console.log(e);
    const overTime = e.detail.value;
    this.pageData.withTimeparams.endTime = overTime;
    this.setData({
      overTime,
    })
  },
  //封装请求记录的方法
  getData(controller, params, header){
    fetch.wxRequest(
      '/api/' + controller,
      params,
      "GET",
      header,
    ).then(res=>{
      console.log(res);
      if(res.data.Status == 2){
        const msg = res.data.Msg;
        wx.showToast({
          title: msg,
          icon: 'none',
          mask: true,
        });
      }else if(res.data.Status == 2){
        const msg = res.data.Msg;
        wx.showToast({
          title: msg,
          icon: 'none',
          mask: true,
        });
      }else{
        const displayArray = res.data.Data;
        this.setData({
          // displayArray:displayArray
          displayArray:[...this.data.displayArray, ...displayArray]
        })
        if(displayArray.length<=0){
          wx.showToast({
            title: '暂时没有更多数据',
            icon: 'none',
            mask: true,
          });
        }
      }
    })
  },
  //封装请求时间段内记录的方法
  // getDataWithTime(controller, withTimeparams, header){
  //   fetch.wxRequest(
  //     '/api/' + controller,
  //     withTimeparams,
  //     "GET",
  //     header,
  //   ).then(res=>{
  //     console.log(res);
  //     // const displayArray = res.data.Data;
  //     // this.setData({
  //     //   // displayArray:displayArray
  //     //   displayArray:[...this.data.displayArray, ...displayArray]
  //     // })
  //   })
  // },
  //点击查询按钮事件
  handleClickSearch(){
    this.pageData.withTimeparams.pageIndex = 1; //每次点击查询时都将pageindex变成1
    if(this.data.beginTime == ''||this.data.overTime == ''){
      wx.showToast({
        title: '时间不能为空',
        icon: 'none',
        mask: true,
      });
    }else{
      this.setData({
        displayArray:[],
      })
      this.pageData.isTimeDisplay = true;  //每次点击查询都将下拉事件设为按照时间查询
      this.getData(this.pageData.controller, this.pageData.withTimeparams, this.pageData.header);
    }
    this.setData({
      beginTime:'',
      overTime:'',
    })
    // this.pageData.withTimeparams.startTime = '';
    // this.pageData.withTimeparams.endTime = '';
  }
})