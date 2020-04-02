// components/search/search.js
const fetch = require('../../utils/fetch')
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    //是图标生效
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sName:1,
    searchList:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e){
      const sName=this.data.sName;
      this.setData({
        sName
      })
      const guid = wx.getStorageSync('guid')
      wx.request({
        url: app.baseUrl + '/api/ShelveSearch',
        method:'GET',
        data:{
          sName:this.data.sName,
          guid: wx.getStorageSync('guid')
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Cookie': wx.getStorageSync('cookies'),
        },
        success:(res)=>{
          // if(res.data.code=200){
          //   wx.showToast({
          //     title: '成功',
          //     duration:2000
          //   })
          // }
          // console.log(res.data)
          // if(e.detail.value==sName){
          //   console.log(e.detail.data)
          //   this.setData({
             
             
          //   })
          // }
         console.log(res);
         this.setData({
           searchList:res.data.Data
         })
         
        },
        error: (res) => {
          console.log(res)
        }
      })
    }
  }
})
