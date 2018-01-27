//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '输入放进密码红包的金额，好友猜中密码才能获得赏金',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    selecting : 1
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
    console.log(this.data.userInfo)
  },
  buildEnvelopes: function(e){
    var that = this;
    console.log('调用支付 todo');
    wx.navigateTo({
      url: '/pages/detail/detail'
    });
  }
})
