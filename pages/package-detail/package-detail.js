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
    useCheckPwd : ""
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
          that.setData({
              smallNum: res.data.respData.pwdMinRegion,
              bigNum : res.data.respData.pwdMaxRegion

          })   
         
        
      }
    });
    var recordData = {
      includeSelf:true,
      currUserId:wx.getStorageSync('xcxUser').id,
      redPacketId:options.id
    }
    //查询参加抢红包的人的记录信息（一人一条）
    var requestURL = app.globalData.serviceServer + "/weixin/api/redpacket/redpacket-guess-record.post";
    util.commonUTIL.netWorkRequestJsonFun(requestURL ,recordData,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        that.setData({
          recordList : res.data.respData,
          initLength : res.data.respData.length || 0,
          initRecordList : res.data.respData
        })
        var recordResult = [];
        var num = 0;
        for (var i = 0; i < that.data.recordList.length; i+=3) {
            recordResult.push(that.data.recordList.slice(i,i+3));
            // 最后一条不足3
            if(recordResult[num].length<3){
              var n = 3-recordResult[num].length;
              recordResult[num] = recordResult[num].concat(that.data.recordList.slice(0,n));
            }
            num++;
        }
        that.setData({
          recordResult:recordResult
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
               smallNum:that.data.useCheckPwd
            })  
          }else{
            that.setData({
               bigNum:that.data.useCheckPwd
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
  },
  onShow: function(){
    // var that = this;
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // var num = -40;
    // var n = 0;
    // setInterval(function() {
    //   n++
    //   animation.translate(0,num).step()
    //   that.setData({
    //     animationData:animation.export()
    //   })
    //   if(n%3==0){
    //     that.setData({
    //       recordList : that.data.recordList.concat(that.data.recordList)
    //     })      
    //   }
    //   num = num-40;
    // }.bind(this), 1000)

//     wx.createSelectorQuery().selectAll('.animationList').boundingClientRect(function(rects){
//       rects.forEach(function(rect){
// console.log(rect)
//       })
//     }).exec()
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
    return {
      title: "比一比谁的手速最快",
      path: '/pages/password-package/password-package?id='+that.data.redPacketId,
      imageUrl:"/imgs/kai.png"
    }
  }

})
