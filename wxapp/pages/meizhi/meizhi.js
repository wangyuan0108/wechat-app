//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    items: [],
    hidden: false,
    loading: false,
    // loadmorehidden:true,
    plain: false
  },
  onPullDownRefresh: function () {
    var that = this;
    mUrl = [];
    mDesc = [];
    mWho = [];
    mTimes = [];
    mTitles = [];
    that.setData({
      items: [],
      hidden: true,
    });
    requestData(that, mCurrentPage);

    // wx.startPullDownRefresh({
    //   success: function () {
    //     // that.setData({
    //     //   hidden: false,
    //     // });
    //     // requestData(that, mCurrentPage);
    //   }
    // })
  },
  onItemClick: function (event) {
    var targetUrl = "/pages/image/image";
    if (event.currentTarget.dataset.url != null)
      targetUrl = targetUrl + "?url=" + event.currentTarget.dataset.url;
    wx.navigateTo({
      url: targetUrl
    });
  },

  // loadMore: function( event ) {
  //   var that = this
  //   requestData( that, mCurrentPage + 1 );
  // },

  onReachBottom: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      hidden: false,
    });
    requestData(that, mCurrentPage);
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    requestData(that, mCurrentPage);
  }

})

/**
 * 定义几个数组用来存取item中的数据
 */
var mUrl = [];
var mDesc = [];
var mWho = [];
var mTimes = [];
var mTitles = [];

var mCurrentPage = 10;

// 引入utils包下的js文件
var Constant = require('../../utils/constant.js');

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 * @param targetPage 请求的目标页码
 */
function requestData(that, targetPage) {
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  });
  wx.request({
    url: Constant.GET_MEIZHI_URL,
    data: {
      showapi_appid: '53576',
      showapi_sign: '7ebc023ec10447e8b556b2c3dce63d5f',
      num: targetPage
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res);
      if (!res.showapi_res_error) {
        wx.request({
          url: Constant.GET_MEIZHI_URL,
          data: {
            showapi_appid: '53576',
            showapi_sign: res.showapi_res_error,
            num: targetPage
          },
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            for (var i = 0; i < res.data.showapi_res_body.newslist && res.data.showapi_res_body.newslist.length; i++)
              bindData(res.data.showapi_res_body.newslist[i]);

            //将获得的各种数据写入itemList，用于setData
            var itemList = [];
            for (var i = 0; i < mUrl.length; i++)
              itemList.push({ url: mUrl[i], desc: mDesc[i], who: mWho[i], time: mTimes[i], title: mTitles[i] });

            that.setData({
              items: itemList,
              hidden: true,
              // loadmorehidden:false,
            });

            mCurrentPage = targetPage;

            wx.hideToast();
          }
        })
      }


      for (var i = 0; i < res.data.showapi_res_body.newslist.length; i++)
        bindData(res.data.showapi_res_body.newslist[i]);

      //将获得的各种数据写入itemList，用于setData
      var itemList = [];
      for (var i = 0; i < mUrl.length; i++)
        itemList.push({ url: mUrl[i], desc: mDesc[i], who: mWho[i], time: mTimes[i], title: mTitles[i] });

      that.setData({
        items: itemList,
        hidden: true,
        // loadmorehidden:false,
      });

      mCurrentPage = targetPage;

      wx.hideToast();
    }
  });
}

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */
function bindData(itemData) {

  var url = itemData.picUrl;
  var desc = itemData.description;
  var who = itemData.title;
  var times = itemData.ctime;

  mUrl.push(url);
  mDesc.push(desc);
  mWho.push(who);
  mTimes.push(times);
  mTitles.push("@" + who + " —— " + times);
}