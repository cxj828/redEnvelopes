//index.js
//获取应用实例
var util=require('../../utils/utils.js');
const app = getApp()

Page({
  data: {
    userInfo:{},
    packageDetail:{},
    recordList:[],
    shareBtnText : "再发一个",
    xcxUser : wx.getStorageSync('xcxUser')
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
      redPacketId : options.id,
      currUserId : wx.getStorageSync('xcxUser').id
    }
    util.commonUTIL.netWorkRequestJsonFun(app.globalData.serviceServer + "/weixin/api/redpacket/detail.post",data,function(res){
      if(res.data.respData && res.data.code === "SUCCESS"){
        that.setData({
          packageDetail:res.data.respData
        })
        if(res.data.respData.createUserId != that.data.xcxUser.id){
          that.setData({
            shareBtnText:"我也发一个"
          })
          
        }
        
      }
    });
    var recordData = {
      includeSelf:true,
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
  },
  btnbind : function(){
    wx.navigateTo({
      url: '/pages/package-detail/package-detail'
    });
  },
  goIndex : function(){
     wx.navigateTo({
      url: '/pages/index/index'
    });   
  }

})
