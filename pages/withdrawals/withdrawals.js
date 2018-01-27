//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '输入放进密码红包的金额，好友猜中密码才能获得赏金',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isdisable : true,
    allBalance : '16.00',
    inputval : "",
    showerror:false,
    promptText : '提现成功！金额在1-3个工作日转到微信钱包',
    btnText : '确定',
    showPrompt : false
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
    console.log('调用支付 todo');
    wx.navigateTo({
      url: '/pages/detail/detail'
    });
  },
  oninput: function(e){
    var that = this;
    that.data.inputval = e.detail.value;
    if(parseFloat(that.data.inputval) > parseFloat(that.data.allBalance)){
      that.setData({
        "showerror":true,
        "isdisable":true
      });
    }else{
        that.setData({
          "showerror":false,
          "isdisable":false
        });
    }
  },
  withdrawalsAll: function(){
    var that = this;
    that.setData({
      "inputval":that.data.allBalance
    });
  },
  submit: function(){
    var that = this;
    if(that.data.isdisable){
      return;
    }
    that.setData({
      "showPrompt":true
    });  
  },
  closePrompt:function(){
    this.setData({
      "showPrompt":false
    });
  }

})
