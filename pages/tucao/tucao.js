// pages/tucao/tucao.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    is_auth:'',
    this_tap: 1,
    page:2,
    page_add: true,
    doman : app.doman,
    openid: app.openid,
    data_loding:false,
    no_data:false,
    loding:false,
    share_info: [
      { 'title': '天王盖地虎，宝塔镇河妖', 'share_img':'http://static.phpshiti.top/static/uploadeImg/images/shareImg/share_005.jpg'},
      { 'title': '歪！110吗？有人开车，我跟不上啊！', 'share_img': 'http://static.phpshiti.top/static/uploadeImg/images/shareImg/share_004.jpg' },
      { 'title': '快上车，营养充足~', 'share_img': 'http://static.phpshiti.top/static/uploadeImg/images/shareImg/share_003.jpg' },
      { 'title': '车门已经锁死，谁都别想下车', 'share_img': 'http://static.phpshiti.top/static/uploadeImg/images/shareImg/share_002.jpg' },
      { 'title': '快停车，这不是去幼儿园的路', 'share_img': 'http://static.phpshiti.top/static/uploadeImg/images/shareImg/share_001.jpg' }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('ssss', wx.getLaunchOptionsSync())
    var that = this;
    if (options.id != undefined) {
      that.setShareData(options.id);
    }
    if (options.this_tap != undefined) {
      that.setData({
        this_tap: options.this_tap,
      })
    }
    if (!that.data.openid) {
      var openid = wx.getStorageSync('openid');
      that.setData({
        openid: openid,
      })
      app.openid = openid;
    }
    that.setData({
      data_loding: true,
      loding:true,
    })
    wx.request({
      url: that.data.doman + '/dz/ajaxindex', 
      data:{
        'this_tap': that.data.this_tap,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Auth-Token': that.data.openid
      },
      success(res) {
        if (res.data.data.length == 0) {
          that.setData({
            data_loding: false,
            no_data: true,
            loding: false,
          })
          return true;
        }
        if (res.data.data.length < 20) {
          that.setData({
            page_add:false,
          })
        }
        var list = that.data.list;
        var new_list = res.data.data;
        for( var i in new_list) {
          list.push(new_list[i]);
        }
        // console.log(list.concat(new_list))
        that.setData({
          list: list,
          no_data: false,
          data_loding: false,
          loding: false,
        })
      }
    })
  },
  showBigImg: function(e) {
    if (e.currentTarget.dataset == undefined) {
      return true;
    }
    var img = e.currentTarget.dataset.img;
    var images = e.currentTarget.dataset.images;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: images
    })
  },
  setShareData: function(id){
    var that = this;
    wx.request({
      url: that.data.doman + '/dz/getdetail',
      data:{
        id:id,
        this_tap: that.data.this_tap,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Auth-Token': that.data.openid
      },
      success(res) {
        var res_data = res.data.data;
        if (res_data.id == undefined) {
          return false;
        }
        var list = that.data.list;
        list.push(res_data);
        that.setData({
          list: list
        })
      }
    })
  },
  detail: function(e) {
    var id =  0;
    if (e.currentTarget) {
      id = e.currentTarget.dataset.id || 0;
    }
    if (id == 0) {
      return true;
    }
  },
  this_tap:function (e) {
    var titles = {
      1: '推荐',
      2: '最新',
      3: '最热',
      4: '趣图'
    }
    var this_tap = e.currentTarget.dataset.this_tap || 1;
    var title = titles[this_tap];
    wx.setNavigationBarTitle({ title: title});
    this.setData({
      this_tap: this_tap,
      page:2,
      page_add:true,
      loding:true,
    });
    this.reload();
    return true;
  },
  reload: function() {
    var that = this;
    if (!that.data.openid) {
      var openid = wx.getStorageSync('openid');
      that.setData({
        openid: openid,
      })
      app.openid = openid;
    }
    wx.request({
      url: that.data.doman + '/dz/ajaxindex',
      data: {
        'this_tap': that.data.this_tap,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Auth-Token': that.data.openid
      },
      success(res) {
        var list = res.data.data;
        if (res.data.data.length < 20) {
          that.setData({
            page_add: false,
          })
        }
      
        if (res.data.data.length == 0) {
          that.setData({
            data_loding: false,
            no_data: true,
            page_add: false,
          })
          return true;
        }
        that.setData({
          list: list,
          loding:false,
        }),
          wx.pageScrollTo({
            scrollTop: 0
          })
      }
    })
    return true;
  },
  
  isLike: function (event) {
    var that = this;
    var data = event.currentTarget.dataset;
    var id = data.id;
    var like = data.like;
    var type = data.type;
    var index = data.index;
    if (!id || like) {
      return true;
    }
    if (type == 2) {
      that.data.list[index].unlike = 1;
      that.data.list[index].article_unlike_num = that.data.list[index].article_unlike_num + 1;
      that.setData({
        list: that.data.list
      })
    } else{
      that.data.list[index].like = 1;
      that.data.list[index].article_like_num = that.data.list[index].article_like_num + 1;
      that.setData({
        list: that.data.list
      })
    }
    that.setData({
      list: that.data.list
    })
    var openid = that.data.openid;
    // console.log('openid', openid)
    wx.request({
      url: that.data.doman + '/dz/islike',
      method:'GET',
      data:{
        id:id,
        type:type,
        f:'3',
        },
      header: {
        'content-type': 'application/json', // 默认值
        'Auth-Token': openid
      },
      success(res) {
      }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.page_add) {
      that.setData({
        no_data: true,
      })
      return true;
    }
    if (!that.data.openid) {
      var openid = wx.getStorageSync('openid');
      that.setData({
        openid: openid,
      })
      app.openid = openid;
    }
    that.setData({
      data_loding: true,
    })
    wx.request({
      url: that.data.doman + '/dz/ajaxindex',
      data:{
        'this_tap': that.data.this_tap,
        'page':that.data.page,
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Auth-Token': that.data.openid
      },
      success(res) {
        if (res.data.data.length == 0) {
          that.setData({
            data_loding:false,
            no_data:true,
            page_add:false,
            loding:false
          })
          return true;
        }
        if (res.data.data.length < 20) {
          that.setData({
            page_add: false,
          })
        }
        var page = that.data.page;
        page = Number(page) + 1;
        var data = that.data.list.concat(res.data.data);
        that.setData({
          list: data,
          no_data:false,
          page:page,
          loding: false,
          data_loding:false,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this;
    var id = 0;
    if (e.target) {
      id = e.target.dataset.id | 0;
    }
    var url = '/pages/tucao/tucao?this_tap=' + that.data.this_tap;

    if (id) {
      url = url + '&id=' + id;
    } 
    var share_num = Math.floor(Math.random() * 5);
    var share_info = this.data.share_info[share_num];
    var title = share_info['title'] || '这个段子真有趣，快来看下吧~';
    var share_img = e.target.dataset.img != undefined ? e.target.dataset.img[0] : '' ;
    if (this.data.this_tap != 4 || e.from == "menu") {
      // share_img = share_info['share_img'] || '';
    } else {
      title = e.target != undefined ? e.target.dataset.title : title;
    }
    return {
      title: title,
      imageUrl: share_img,
      path:url,
    }
  }
})