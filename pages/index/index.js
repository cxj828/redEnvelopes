//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    sendPrompt: '系统随机生成2位数密码，好友猜中密码才能获得赏金',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    money : "",
    moneyerror:{text:"金额不可小于1.00元",show:false}
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
  buildEnvelopes: function(e){
    var that = this;
    
    if(that.data.money<1){
      that.setData({
        money: "",
        moneyerror : {show:true,text:"金额不可小于1.00元"}
      }) 
      return;
    }
    wx.requestPayment({
       'timeStamp': '',
       'nonceStr': '',
       'package': '',
       'signType': 'MD5',
       'paySign': '',
       'success':function(res){
       },
       'fail':function(res){
       }
    })
    wx.navigateTo({
      url: '/pages/password-package/password-package'
    });  
  },
  bindInputMoney : function(e){
      var that = this;
      var spotIndex = e.detail.value.indexOf(".");
      if(+spotIndex!==-1){
        var spotAfterLen = e.detail.value.substring(spotIndex+1).length;
        var overranging = e.detail.value.length
        if(+spotAfterLen>2){
          that.setData({
            money: e.detail.value.substring(0,spotIndex+3)
          })
        }
      }
  }
})
