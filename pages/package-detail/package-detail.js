//index.js
//获取应用实例
var util=require('../../utils/utils.js');
const app = getApp()

Page({
  data: {
    password:"",
    bigNum : 100,
    smallNum : 0,
    relPassword : 50,
    reason:"",
    chance : 3,
    chanceBtnText: "兑换一次",
    showIntegralPrompt : false,
    promptText :"使用1积分兑换1次竞猜机会，兑换后不可退回并仅对本密码包有效，是否确认兑换？",
    redEnvelopesPrompt : {show:false,success:true},
    userInfo:{},
    recordList:[],
    redPacketId:"",
    integral:0,
    btnText : "确定",
    pos : 1,
    inputT : 0,
    jitterN : 0,
    pwdStatus:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      redPacketId:options.id
    })
    var data = {
      redPacketId : options.id,
      currUserId : wx.getStorageSync('xcxUser').id
    };
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/detail.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        if(+res.data.respData.status===1){
          that.setData({
             chance :res.data.respData.usableGuessTimes,
             redPacketId : res.data.respData.id
          })          
        }else if(+res.data.respData.status===2){
          that.setData({
             redEnvelopesPrompt:{show:true,success:false},
             userInfo : {
                avatarUrl : res.data.respData.avatarUrl,
                nickName : res.data.respData.nickName
             }
          })   
        }else if(+res.data.respData.status===3){
          that.setData({
             redEnvelopesPrompt:{show:true,success:false},
             userInfo : {
                avatarUrl : res.data.respData.avatarUrl,
                nickName : res.data.respData.nickName
             }
          })   
        }

        
      }
    });
    var recordData = {
      includeSelf:false,
      currUserId:wx.getStorageSync('xcxUser').id,
      redPacketId:options.id
    }
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/redpacket-guess-record.post",recordData,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        that.setData({
          recordList : res.data.respData
        })
      }
    });
    
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/user/user-info.post",{currUserId:wx.getStorageSync('xcxUser').id},function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        that.setData({
          integral : res.data.respData.integral
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
      url: '/pages/package-detail/package-detail'
    });
  },
  checkNumber:function(e){
    var that = this;
    if(that.data.btnText == "再猜一次"){
          if(!+that.data.pwdStatus){
            that.setData({
               smallNum:that.data.password
            })  
          }else{
            that.setData({
               bigNum:that.data.password
            })     
          }
          that.setData({
              btnText:"确定",
              password : ""
          })  
          return;
    }

    if(!+that.data.chance){
        that.setData({
          reason: "红包次数用完了"
        })
      return;
    }
    if(!(/(^[1-9]\d*$)/.test(that.data.password)) || !that.data.password || +that.data.password<+that.data.smallNum || +that.data.password>+that.data.bigNum){
        that.setData({
          reason: "请输入"+that.data.smallNum+"－"+that.data.bigNum+"中间的整数",
          password:""
        })
      
        return;
    }
    var data = {
      redPacketId : that.data.redPacketId,
      currUserId : wx.getStorageSync('xcxUser').id,
      inPwd : that.data.password
    }
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/redpacket-guess.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        if(!+res.data.respData.guessSuccess){
            that.setData({
               pwdStatus:res.data.respData.pwdStatus
            })  
          that.setData({
            reason: res.data.respData.message,
            chance : res.data.respData.usableGuessTimes,
            btnText : "再猜一次",
            jitterN : 0
          }) 
          that.shake_funct();
          // 猜中
        }else{
          that.setData({
             redEnvelopesPrompt:{show:true,success:true}
          })  
        }
        
      }
    });
    // if(that.data.password>=that.data.smallNum&&that.data.password<=that.data.bigNum){
    //     that.data.bigNum = that.data.password;
    // }
    // if(that.data.password>that.data.relPassword){
    //     that.setData({
    //       reason: "哎呦喂大了点",
    //       bigNum : that.data.password,
    //       chance : that.data.chance-1,
    //       btnText : "再猜一次",
    //       password:""
    //     })
    //     return;
    // }
    // if(that.data.password<that.data.relPassword){
    //     that.setData({
    //       reason: "哎呦喂小了点",
    //       smallNum : that.data.password,
    //       chance : that.data.chance-1,
    //       btnText : "再猜一次",
    //       password:""
    //     })
    //     return;
    // }
    // if(that.data.password == that.data.relPassword){

    // }
  },
  bindKeyInput:function(e){
      this.setData({
        password: e.detail.value
      })
      console.log(e);
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
      url: '/pages/package-detail-complete/package-detail-complete?id='+this.data.redPacketId
    });
  },
  doExchange : function(){
    var that = this;
    if(!+that.data.integral){
      this.setData({
        showIntegralPrompt: true
      })
      return;
    }
    var data = {
      currUserId : wx.getStorageSync('xcxUser').id,
      redPacketId:that.data.redPacketId
    }
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/integral-convert-times.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        
        that.setData({
          chance:res.data.respData.usableGuessTimes
        })     
        that.closePrompt();
        wx.showToast({
          title: '兑换成功',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  shake_funct : function (object,speed){
    var that = this;
        that.setData({
          jitterN:that.data.jitterN+1
        })    
    if(that.data.pos == -1){
        that.setData({
          inputT: '2rpx',
          pos : 1
        })      
    }else{
        that.setData({
          inputT: '-2rpx',
          pos : -1
        })        
    }  
    var time = setTimeout(function(){
        that.shake_funct();
      },10); 
    if(that.data.jitterN>30){
        clearTimeout(time);
    }
    
  },
  goIndex : function(){
    wx.navigateTo({
      url:  "/pages/index/index"
    });
  }

})
