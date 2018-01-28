//index.js
//获取应用实例
var util=require('../../utils/utils.js');
const app = getApp()

Page({
  data: {
    detail:{},
    redPacketId : ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    var data = {
      redPacketId:options.id
    }
    that.setData({
        redPacketId:options.id
    }) 
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/detail.post",data,function(res){
      if(res.data.respData){
          that.setData({
             detail:res.data.respData
          }) 
      }
    });

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
      url: '/pages/package-detail/package-detail?id='+that.data.redPacketId
    });
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "比一比谁的手速最快",
      path: '/pages/password-package/password-package?id='+that.data.redPacketId,
      imageUrl:"/imgs/kai.png"
    }
  }
})
