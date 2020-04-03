// components/Table/Table.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //接收表格头部数组
    thead:{
      type:Array,
      value:[]
    },
    tbody:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // thead:[
    //   {id:1, name:"序号"},
    //   {id:2, name:"品名"},
    //   {id:3, name:"类名"},
    //   {id:4, name:"单位"},
    //   {id:5, name:"备注"},
    // ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePreviewImg(e){
      console.log(e);
      const current = e.currentTarget.dataset.url;
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls: [current] // 需要预览的图片http链接列表
      })
    }
  }
})
