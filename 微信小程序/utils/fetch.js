const app = getApp();

0//判定是否登录，$符号，在实际应用中，填写this即可
const userLogin = ($) => {
  var account = wx.getStorageSync('account')
  if (account == '' || account == undefined) {
    $.setData({
      isLogged: true,
      account,
    })
  } else {
    $.setData({
      isLogged: false,
      account,
    })
  }
}
//封装wx.request
const wxRequest = (url, data, method, header) => {
  wx.showLoading({
    title: 'Loading...'
  })
  return new Promise((resolve) => {
    wx.request({
      url: app.baseUrl + url,
      data,
      header,
      method,
      dataType: 'json',
      success: resolve,
      fail: ()=>{
        wx.showToast({
          title: '网络错误',
          icon:"none"
        })
      }, 
      complete: wx.hideLoading
    })
  })
}
//改造showToast,脱离字数限制
const wxShowToast=(title)=>{
  wx.showToast({
    title,
    icon:'none'
  })
}
module.exports = {
  userLogin,
  wxRequest,
  wxShowToast
}