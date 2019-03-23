// pages/mycenter/mycenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_auth: false,
    data:[],
    userInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
        is_auth:true,
      });
    }
    wx.request({
      url: app.xcx_doman + '/xcx/shareservicelist/' + app.state,
      success(res){
        if (res.data.data.length > 0) {
          that.setData({
            data: res.data.data,
          });
        }
      }
    })
  },
  getUserInfo:function(e){
    var that = this;
    if (e.detail.userInfo == undefined) {
      return false;
    }
    that.setData({
      is_auth:true,
      userInfo: e.detail.userInfo
    });
      wx.setStorageSync('userInfo', e.detail.userInfo);
      that.getUserForServer(e.detail);
  },
  getUserForServer: function (data) {
    var that = this;
    var session_key = wx.getStorageSync('session_key');
    if (!session_key || !data) {
      return false;
    }
    var login_data = { encryptedData: data.encryptedData, iv: data.iv, rawData: data.rawData, signature: data.signature, session_key: session_key }
    wx.request({
      url: app.doman + '/xcx/getuserinfo', //仅为示例，并非真实的接口地址
      data: login_data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log('user', res)
      }
    })
  },
  goNewPage:function(e) {
    var url = e.currentTarget.dataset.url;
    if (url == undefined) {
      return false;
    }
    wx.navigateTo({
      url: url,
      complete: function(res) {
      },
    })
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

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})