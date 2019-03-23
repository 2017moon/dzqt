//app.js
App({
  xcx_doman: '',
  doman: '',
  openid: '',
  max_size: 3145728,
  state: 'baoxiao',
  
  onLaunch: function (options) {
    // console.log('options', options);
    var that = this;
    wx.login({
      success(res) {
        var code = res.code;
        wx.request({
          url: that.doman + '/xcx/login',
          data: {
            code: code
          },
          success(res) {
            // console.log('login',res)
            var login_data = res.data.data;
            if (login_data.session_key) {
              wx.setStorageSync('session_key', login_data.session_key);
              wx.setStorageSync('openid', login_data.openid);
              that.openid = login_data.openid;
            }
          }
        })
      }
    })
  },
  isAuth: function (url, isSelf = false) {
    var user_info = wx.getStorageSync("user_info");
    if (user_info) {
      if (!isSelf) {
        wx.navigateTo({
          url: url
        })
      }
    } else {
      wx.setStorageSync('goto', url)
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
})
