//index.js
//获取应用实例
var util=require('../../utils/utils.js');
const app = getApp()

Page({
  data: {
    motto: '输入放进密码红包的金额，好友猜中密码才能获得赏金',
    userInfo: wx.getStorageSync('userInfo'),
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    selecting : 1,
    xcxUser : wx.getStorageSync('xcxUser'),
    list :[],
    url:["/weixin/api/redpacket/user-guess-success-list.post","/weixin/api/redpacket/user-create-list.post"],
    pageNum : 1,
    allLoaded : false,
    loading : false,
    hasMore : true,
    allMoney : 0,
    allSize : 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    var data = {
      currUserId : that.data.xcxUser.id,
      pageNum : that.data.pageNum
    };
    // util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/user-create-list.post",data,function(res){
    //   if(res.data.respData && res.data.respData.length){
    //       that.data.list = res.data.respData;
    //   }else{
    //       that.data.send = [];
    //   }
    // });
    that.getListData(0);
    // util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + that.data.url[0],data,function(res){
    //   if(res.data.respData && res.data.respData.length){
    //       that.data.list = res.data.respData;
    //   }else{
    //       that.data.list = [];
    //   }
    // });
  },
  switchTab:function(e){
    var that = this;
    if(+e.currentTarget.dataset.type === +that.data.selecting){
      return;
    }  
      that.setData({
        pageNum : 1
      }); 
    that.getListData(e.currentTarget.dataset.type-1,function(type){
      that.setData({
        pageNum : 1,
        hasMore : true,
      });     
      if(type){
        that.setData({
          selecting : type
        });
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
  getListData:function(type,callback){
    var that = this;
    var data = {
      currUserId : that.data.xcxUser.id,
      pageNum : that.data.pageNum,
      pageSize : 10
    };
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + that.data.url[+type],data,function(res){
      if(res.data.respData && res.data.respData.length){
          if(callback){
            that.data.list = [];
          }
          
          for (var i = 0; i <res.data.respData.length; i++) {
            res.data.respData[i].gmtCreateTime = that.timestampToTime(res.data.respData[i].gmtCreateTime);
          }
          that.setData({
            list : that.data.list.concat(res.data.respData),
            hasMore : res.data.hasMore,
            allMoney : res.data.extData,
            allSize : res.data.totalSize
          });

      }else{
          that.setData({
            list : []
          });
      }
      if(callback){
        callback(type+1);
      }
    });
  },
  // 上拉加载更多
  lower:function(e){
    // console.log(e);
    var that = this;
    if(!that.data.hasMore){
      return
    }
    
    that.setData({
      pageNum : that.data.pageNum+1
    });
    that.getListData(that.data.selecting-1);
  },
  goDetail:function(e){
    if(+e.currentTarget.dataset.status===1){
      wx.navigateTo({
        url: "/pages/package-detail/package-detail?id="+e.currentTarget.dataset.id
      });
    }else{
      wx.navigateTo({
        url: "/pages/package-detail-complete/package-detail-complete?id="+e.currentTarget.dataset.id
      });      
    }

  },
  timestampToTime : function (timestamp) {
          var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          return M+D;
  }
})
