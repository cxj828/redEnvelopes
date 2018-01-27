 var util=require('utils/utils.js');
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    util.commonUTIL.weiXinUserOpenIdFun();
    // 获取用户信息
    util.commonUTIL.getPromission();
    // /weixin/api/user/create-info.post
    util.commonUTIL.netWorkRequestJsonFun(that.globalData.serviceServer + "/weixin/api/user/create-info.post",{wxOpenId : "",wxUnionId : "",nickName : "",avatarUrl : "",gender : ""},function(){

    });
  },
  globalData: {
    userInfo: util.commonUTIL.getPromission(),
    serviceServer:"https://xcx.fuzyme.com"
  }
})