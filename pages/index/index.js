//index.js
//获取应用实例
var util=require('../../utils/utils.js');
const app = getApp()

Page({
  data: {
    sendPrompt: '系统随机生成2位数密码，好友猜中密码才能获得赏金',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    money : "",
    moneyerror:{text:"金额不可小于1.00元",show:false},
    envelopesDescribe : "",
    creatBtnText : "生成密码包",
    balanceText : ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    var that = this;
    util.commonUTIL.getXcxUserInfo(function(res){
      console.log('---xcxUserInfo---')
      console.log(JSON.stringify(res.data.respData))
      console.log('---xcxUserInfo---')
      that.setData({
        userInfo: res.data.respData,
        hasUserInfo: true
      });
    })  
    that.setData({
      money: "",
      moneyerror : {show:false,text:"金额不可小于1.00元"},
      envelopesDescribe : "",
      creatBtnText : "生成密码包",
      balanceText : ""
    }) 
  },
  onLoad: function () {},
  buildEnvelopes: function(e){
    var that = this;
    var user = wx.getStorageSync('user');
    var userInfo = wx.getStorageSync('userInfo');
    var xcxUser = wx.getStorageSync('xcxUser');
    if(!+that.data.money){
      return;
    }
    if(that.data.money<1){
      that.setData({
        money: "",
        moneyerror : {show:true,text:"金额不可小于1.00元"}
      }) 
      return;
    }
    var data = {
      "userId":xcxUser.id,
      "money" : that.data.money*100
    };
    console.log(that.data.envelopesDescribe);
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/pay/unifiedorder.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        var unifiedorderId = res.data.respData.unifiedorderId;
        if(!+res.data.respData.status){
            util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/create.post",{userId:xcxUser.id,money:data.money,remark:that.data.envelopesDescribe||"恭喜发财，猜中有奖",unifiedOrderId:unifiedorderId},function(res){
              if(res.data.respData && res.data.code === "SUCCESS"){
                wx.navigateTo({
                  url: '/pages/password-package/password-package?id='+res.data.respData.id
                });  
              }
            });
        }else{
          var payData = res.data.respData.unifiedorderReqData;
          wx.requestPayment({
             'timeStamp': payData.timeStamp+"",
             'nonceStr': payData.nonceStr,
             'package': payData.packageStr,
             'signType': payData.signType,
             'paySign': payData.paySign,
             'success':function(res){
                util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/create.post",{userId:xcxUser.id,money:data.money,remark:that.data.envelopesDescribe||"恭喜发财，猜中有奖",unifiedOrderId:unifiedorderId},function(res){
                  if(res.data.respData && res.data.code === "SUCCESS"){
                    wx.navigateTo({
                      url: '/pages/password-package/password-package?id='+res.data.respData.id
                    });  
                  }
                });
             },
             'fail':function(res){

             }
          })
        }
      }
    });

    // wx.navigateTo({
    //   url: '/pages/password-package/password-package'
    // });  
  },
  bindblur : function(e){
      var that = this;
      var spotIndex = e.detail.value.indexOf(".");
      if(e.detail.value.slice(0,1)=='.'){
          that.setData({
            money: "0"+e.detail.value
          })       
      }
      if(+spotIndex!==-1){
        var spotAfterLen = e.detail.value.substring(spotIndex+1).length;
        var overranging = e.detail.value.length
        if(+spotAfterLen>2){
          that.setData({
            money: e.detail.value.substring(0,spotIndex+3)
          })
          return;
        }
      }
      if(e.detail.value && +e.detail.value<1){
        that.setData({
          moneyerror : {show:true,text:"金额不可小于1.00元"},
          creatBtnText : "生成密码包",
          balanceText : ""
        }) 
        return;
      }else{
        that.setData({
          moneyerror : {show:false,text:"金额不可小于1.00元"}
        })      
      }
      that.setData({
        money: e.detail.value
      }) 
      if(+that.data.money>that.data.userInfo.money/100){
        console.log(that.data.money);
        console.log((that.data.money-(that.data.userInfo.money/100)));
        that.setData({
          creatBtnText: "还需支付"+that.toFixed((that.data.money-(that.data.userInfo.money/100)),2)+"元",
          balanceText : "优先使用余额抵扣¥"+that.toFixed((that.data.userInfo.money/100),2)
        }) 
      }else{
        that.setData({
          creatBtnText: "还需支付0元",
          balanceText : "优先使用余额抵扣¥"+that.toFixed(that.data.money,2)
        })   
      }
  },
  bindInputMoney : function(e){
      var that = this;
      var spotIndex = e.detail.value.indexOf(".");
      if (e.detail.value.length-1 != spotIndex && e.detail.value.substring(e.detail.value.length-1) == '.') {
          that.setData({
            money: e.detail.value.substring(0,e.detail.value.length-1)
          })
        return;
      }
      if(+spotIndex!==-1){
        var spotAfterLen = e.detail.value.substring(spotIndex+1).length;
        var overranging = e.detail.value.length
        if(+spotAfterLen>2){
          that.setData({
            money: e.detail.value.substring(0,spotIndex+3)
          })
          return;
        }
      }
  },
  // toFixed 修复
  toFixed:function (num, s) {
      var times = Math.pow(10, s)
      var des = num * times + 0.5
      des = parseInt(des, 10) / times
      return des + ''
  },
  bindEnvelopesDescInput : function(e){
        this.setData({
          envelopesDescribe : e.detail.value
        })     
  }
})
