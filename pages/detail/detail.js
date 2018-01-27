//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '输入放进密码红包的金额，好友猜中密码才能获得赏金',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    partnerArray:[]
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
    this.setData({
        partnerArray: [{name:"111"},{name:"222"},{name:"333"},{name:"444"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"},{name:"555"}]
    })
  }
})
