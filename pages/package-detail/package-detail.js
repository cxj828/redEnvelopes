//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    password:"",
    bigNum : 100,
    smallNum : 0,
    relPassword : 50,
    reason:"",
    chance : 3,
    btnText: "兑换一次",
    showIntegralPrompt : false,
    promptText :"可使用发包积分获取1次额外竞猜机会。您当前发包积分为4分，是否确认兑换？",
    redEnvelopesPrompt : {show:true,success:true},
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
  buildEnvelopes: function(e){
    var that = this;
    console.log('调用支付 todo');
    wx.navigateTo({
      url: '/pages/detail/detail'
    });
  },
  shareFriend:function(){
    var that = this;
  },
  goDetails:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/package-detail/package-detail'
    });
  },
  checkNumber:function(){
    var that = this;
    if(!+that.data.chance){
      return;
    }
    if(!(/(^[1-9]\d*$)/.test(that.data.password))){
        that.setData({
          reason: "请输入X－Y中间的整数",
          password:""
        })
        return;
    }
    if(that.data.password>=that.data.smallNum&&that.data.password<=that.data.bigNum){
        that.data.bigNum = that.data.password;
    }
    if(that.data.password>that.data.relPassword){
        that.setData({
          reason: "哎呦喂大了点",
          bigNum : that.data.password,
          chance : that.data.chance-1,
          btnText : "再猜一次",
          password:""
        })
        return;
    }
    if(that.data.password<that.data.relPassword){
        that.setData({
          reason: "哎呦喂小了点",
          smallNum : that.data.password,
          chance : that.data.chance-1,
          btnText : "再猜一次",
          password:""
        })
        return;
    }
    if(that.data.password == that.data.relPassword){

    }
  },
  bindKeyInput:function(e){
      this.setData({
        password: e.detail.value
      })
  },
  exchange : function(){
      this.setData({
        showIntegralPrompt: true
      })
  },
  closePrompt : function(){
      this.setData({
        showIntegralPrompt: false
      })
  },
  btnbind : function(){
    wx.navigateTo({
      url: '/pages/package-detail-complete/package-detail-complete'
    });
  }

})
