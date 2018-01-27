//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  btnbind : function(){
    wx.navigateTo({
      url: '/pages/package-detail/package-detail'
    });
  }

})
