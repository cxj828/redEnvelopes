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
    promptText :"1积分可以兑换1个破解机会，兑换后不可退回并仅对本密码包有效，是否确认兑换?",
    redEnvelopesPrompt : {show:false,success:true},
    userInfo:{},
    recordList:[],
    redPacketId:"",
    integral:0,
    btnText : "确定",
    pos : 1,
    inputT : 0,
    jitterN : 0,
    pwdStatus:0,
    scrollTop : 0,
    animationData : {},
    initLength : 0,
    initRecordList : [],
    indicatorDots: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loopTimes:[1,2],
    autoplay: true,
    interval: 3000,
    duration: 1000,
    recordResult:[],
    useCheckPwd : "",
    remark:"",
    rulePrompt:{
      show:false,
      content:"由系统为每个红包设置一个1-100之间的任意数字。所有玩家默认有5次破解机会，玩家每输入一个数字，系统会给出新的数字区间；例子：比如红包的密码是23 ，玩家第一次输入数字68，系统会更新密码范围提示为0-68之间，玩家第二次可以输入0-68之间的数字，直到有玩家输入密码23即可获得密码包内的全部赏金；",
      title:"终极密码包玩法介绍",
      btn:"我知道了"
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function(){
    var that = this;
    var data = {
      redPacketId : that.data.redPacketId,
      currUserId : wx.getStorageSync('xcxUser').id
    };
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/detail.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        if(+res.data.respData.status===1){
          that.setData({
             userInfo : {
                avatarUrl : res.data.respData.avatarUrl,
                nickName : res.data.respData.createUserNickName
             },
             chance :res.data.respData.usableGuessTimes,
             redPacketId : res.data.respData.id
          })          
        }else if(+res.data.respData.status===2){
          that.setData({
             redEnvelopesPrompt:{show:true,success:false},
             userInfo : {
                avatarUrl : res.data.respData.avatarUrl,
                nickName : res.data.respData.createUserNickName
             }
          })   
        }else if(+res.data.respData.status===3){
          that.setData({
             redEnvelopesPrompt:{show:true,success:false,overdue :true},
             userInfo : {
                avatarUrl : res.data.respData.avatarUrl,
                nickName : res.data.respData.createUserNickName
             }
          })   
        }
          that.setData({
              smallNum: res.data.respData.pwdMinRegion,
              bigNum : res.data.respData.pwdMaxRegion,
              remark : res.data.respData.remark
          })   
         
        
      }
    });
    var recordData = {
      includeSelf:true,
      currUserId:wx.getStorageSync('xcxUser').id,
      redPacketId:that.data.redPacketId
    }
    //查询参加抢红包的人的记录信息（一人一条）
    var requestURL = app.globalData.serviceServer + "/weixin/api/redpacket/redpacket-guess-record.post";
    util.commonUTIL.netWorkRequestJsonFun(requestURL ,recordData,function(res){
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
  onLoad: function (options) {
    var that = this;
    that.setData({
      redPacketId:options.id
    })
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
               smallNum:that.data.useCheckPwd
            })  
          }else{
            that.setData({
               bigNum:that.data.useCheckPwd
            })     
          }
          that.setData({
              btnText:"确定",
              password : "",
              reason :""
          })  
          return;
    }

    if(!+that.data.chance){
        that.setData({
          reason: "破解机会已用完，可使用积分兑换"
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
               pwdStatus:res.data.respData.pwdStatus,
               useCheckPwd : that.data.password
            })  
          that.setData({
            reason: res.data.respData.message,
            chance : res.data.respData.usableGuessTimes,
            btnText : "再猜一次",
            jitterN : 0
          }) 
          that.shake_funct();
          that.reloadRecord();
          // 猜中
        }else{
          if(res.data.respData.guessSuccess == 1){
            that.setData({
               redEnvelopesPrompt:{show:true,success:true}
            })  
          }else{
            that.setData({
               redEnvelopesPrompt:{show:true,success:false}
            })             
          }

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
  reloadRecord : function(){
    var that = this;
    var recordData = {
      includeSelf:true,
      currUserId:wx.getStorageSync('xcxUser').id,
      redPacketId:that.data.redPacketId
    }
    //查询参加抢红包的人的记录信息（一人一条）
    var requestURL = app.globalData.serviceServer + "/weixin/api/redpacket/redpacket-guess-record.post";
    util.commonUTIL.netWorkRequestJsonFun(requestURL ,recordData,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        that.setData({
          recordList : res.data.respData
        })
      }
    });
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
        showIntegralPrompt: false,
        rulePrompt : {show:false}
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
          chance:res.data.respData.usableGuessTimes,
          integral : that.data.integral-1
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
    wx.vibrateLong({});
    
  },
  goIndex : function(){
    wx.navigateTo({
      url:  "/pages/index/index"
    });
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onShareAppMessage: function () {
    var that = this;
    var data = {
      currUserId : wx.getStorageSync('xcxUser').id,
      redPacketId : that.data.redPacketId
    };
    return {
      title: that.data.remark,
      path: '/pages/password-package/password-package?id='+that.data.redPacketId,
      imageUrl:"/imgs/share.jpeg",
      success:function(){
        util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/user/user-share-redpacket.post",data,function(res){
          that.onShow();
        });
      }
    }
  },
  showRule : function(){
    var that = this;
    that.setData({
      rulePrompt:{
        show:true,
        content:"由系统为每个红包设置一个1-100之间的任意数字。所有玩家默认有5次破解机会，玩家每输入一个数字，系统会给出新的数字区间；例子：比如红包的密码是23 ，玩家第一次输入数字68，系统会更新密码范围提示为0-68之间，玩家第二次可以输入0-68之间的数字，直到有玩家输入密码23即可获得密码包内的全部赏金；",
        title:"终极密码包玩法介绍",
        btn:"我知道了"
      }
    })
  },
  showInterval : function(){
    var that = this;
    that.setData({
      rulePrompt:{
        show:true,
        content:"您发出的密码包被破解时（包括自己破解），您可获得1个积分",
        title:"积分规则",
        btn:"我知道了"
      }
    })
  }
})
