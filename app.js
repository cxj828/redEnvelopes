 var util=require('utils/utils.js');
//app.js
App({
  onLaunch: function () {
    console.log('-------' + util.constantUTIL.serviceServer)
    // 展示本地存储能力
    var that = this;
    util.commonUTIL.getPromission();
    // 登录
    util.commonUTIL.weiXinUserOpenIdFun(function(){
      var user = wx.getStorageSync('user');
      var userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo);
      var data = {wxOpenId :user.openid,wxUnionId : "",nickName :userInfo.nickName,avatarUrl : userInfo.avatarUrl,gender : userInfo.gender};
      util.commonUTIL.netWorkRequestJsonFun(that.globalData.serviceServer + "/weixin/api/user/create-info.post",data,function(res){
        if(res.data.respData){
          wx.setStorageSync('xcxUser',res.data.respData);
        }
      });      
    });
    // /weixin/api/user/create-info.post

  },
  globalData: {
    userInfo: {},
    //serviceServer:"https://xcx.fuzyme.com",
    serviceServer: util.constantUTIL.serviceServer,
  }
})