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
  imgDetail: function (event) {
    var testId = event.currentTarget.dataset.testid;
    var testIdArr = [event.currentTarget.dataset.testid];
    console.log(testId);
    wx.previewImage({
      current: testId, // 当前显示图片的http链接
      urls: testIdArr // 需要预览的图片http链接列表
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    mDesc = [];
    mTimes = [];
    mTitles = [];
    mCurrentPage = 0
    console.log(123);
    that.setData({
      items: [],
      hidden: true,
    });
    requestData(that, mCurrentPage + 1);

    // wx.startPullDownRefresh({
    //   success: function () {
    //     // that.setData({
    //     //   hidden: false,
    //     // });
    //     // requestData(that, mCurrentPage);
    //   }
    // })
  },
  onReachBottom: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      hidden: false,
    });
    requestData(that, mCurrentPage + 1);
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    requestData(that, mCurrentPage + 1);
  }

})

/**
 * 定义几个数组用来存取item中的数据
 */
var mDesc = [];
var mTimes = [];
var mTitles = [];

var mCurrentPage = 0;

// 引入utils包下的js文件
var Constant = require('../../utils/happy.js');

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
      page: targetPage
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
            page: targetPage
          },
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            for (var i = 0; i < res.data.showapi_res_body.contentlist && res.data.showapi_res_body.contentlist.length; i++)
              bindData(res.data.showapi_res_body.newslist[i]);

            //将获得的各种数据写入itemList，用于setData
            var itemList = [];
            for (var i = 0; i < mDesc.length; i++)
              itemList.push({ desc: mDesc[i], time: mTimes[i], title: mTitles[i] });

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


      for (var i = 0; i < res.data.showapi_res_body.contentlist.length; i++)
        bindData(res.data.showapi_res_body.contentlist[i]);

      //将获得的各种数据写入itemList，用于setData
      var itemList = [];
      for (var i = 0; i < mDesc.length; i++)
        itemList.push({ desc: mDesc[i], time: mTimes[i], title: mTitles[i] });

      that.setData({
        items: itemList,
        hidden: true,
        // loadmorehidden:false,
      });

      mCurrentPage = targetPage;

      wx.hideToast();
      console.log(that.data.items);
    }
  });
}

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */
function bindData(itemData) {

  var desc = itemData.img;
  var title = itemData.title;
  var times = itemData.ct.split('.')[0];

  mDesc.push(desc);
  mTimes.push(times);
  mTitles.push(title);
}
