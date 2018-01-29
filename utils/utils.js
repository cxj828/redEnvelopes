
var loginStatus = true;
var serviceServer = "https://xcx.fuzyme.com"

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getUserAccTockenFun(){
  wx.login({
    success: function (res) {//登录成功
      if (res.code) {
        var code = res.code;
        wx.getUserInfo({//getUserInfo流程
          success: function (res2) {//获取userinfo成功
            console.log(res2);
            var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
            var iv = res2.iv;
            //请求自己的服务器
            console.log('code=' + code + '  encryptedData=' + encryptedData + "   iv = " + iv);
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}

//常量
var constantUTIL = constantUTIL || {
  // myReqURL: 'http://ideal.51vip.biz',
  myReqURL: 'https://candy.candytour.club/',
  appid: 'wxcf203bd1b027ec98',
  secret: '833fad84b887a50816ac2dfa152b7f4c'
}


var commonUTIL = commonUTIL || {
  netWorkRequestJsonFun: function (reqURL, reqData, callBackFun ) {
    wx.request({
      url: reqURL,
      header: {"Content-Type": "application/json" },
      method: "POST",
      data: JSON.stringify(reqData),
      beforesend: function () {
        console.log('request url beforeSend.....')
      },
      complete: function (respData) {
        //console.log('respData ..... ' + JSON.stringify(respData));
        if (respData.data.resultCode == 100){
          console.log('查询成功...')
         // wx.showToast({ title: '查询成功', icon: 'loading', duration: 300, mask: true });
        }else{
          // wx.showToast({ title: respData.data.message, icon: 'loading', duration: 300, mask: true });
        }
      },
      success: function (respData) {
        if ( typeof callBackFun == 'function' ){
          callBackFun(respData);
        }
      }
    });
  },


  /***
   * 公共方法获取当前微信对应的服务器用户信息
   */
  getXcxUserInfo:function(successFun, errorFun){
    var userInfoURL = serviceServer + "/weixin/api/user/user-info.post";
    var xcxUserInfo = wx.getStorageSync('xcxUser') || {};
    console.log("------------xcxUserInfo-------------------")
    console.log(JSON.stringify(xcxUserInfo))
    console.log("------------xcxUserInfo-------------------")
    if ((!xcxUserInfo.id)) {
      commonUTIL.createXcxUserInfoFun(successFun, errorFun);
    }else{
      commonUTIL.netWorkRequestJsonFun(userInfoURL, { 'currUserId': xcxUserInfo.id}, function (res) {
        if (res.data.respData) {
          wx.setStorageSync('xcxUser', res.data.respData);
          if (typeof successFun == 'function') {
            successFun(res);
          }
        } else {
          console.error(JSON.stringify(res));
          if (typeof errorFun == 'function') {
            errorFun(res);
          }
        }
      });
    }
  },

  createXcxUserInfoFun: function (successFun, errorFun){
    var creatURL = serviceServer + "/weixin/api/user/create-info.post";
    commonUTIL.weiXinUserOpenIdFun(function () {
      var user = wx.getStorageSync('user');
      var userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo);
      var data = {
        'wxOpenId': user.openid,
        'wxUnionId': "",
        'nickName': userInfo.nickName,
        'avatarUrl': userInfo.avatarUrl,
        'gender': userInfo.gender
      };
      commonUTIL.netWorkRequestJsonFun(creatURL, data, function (res) {
        if (res.data.respData) {
          wx.setStorageSync('xcxUser', res.data.respData);
          if (typeof successFun == 'function') {
            successFun(res.data.respData);
          }
        } else {
          console.error(JSON.stringify(res));
          if (typeof errorFun == 'function') {
            errorFun(res);
          }
        }
      });
    });
  },



  weiXinUserOpenIdFun: function (callBackFun) {
    
    
    var that = this
    var user = wx.getStorageSync('user') || {};
    console.log("-------------------------------")
    console.log(JSON.stringify(user))
    console.log("-------------------------------")
    if ((!user.openid)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            var js_code = res.code;
            
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxcf203bd1b027ec98&secret=833fad84b887a50816ac2dfa152b7f4c&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                console.log(JSON.stringify(res));
                wx.setStorageSync('user', obj);//存储openid
                console.log(js_code + '---------------save user openid-------------' + JSON.stringify(obj))
                callBackFun && callBackFun();
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }else{
      callBackFun && callBackFun();
    }
  },
  
   
  getPromission: function () {
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  console.info("2成功获取用户返回数据");
                  console.info(data.userInfo);
                  wx.setStorageSync('userInfo', data.userInfo);
                },
                fail: function () {
                  console.info("2授权失败返回数据");
                }
              });
            }
          }
        },
        fail: function () {
          console.info("设置失败返回数据");
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                console.info("1成功获取用户返回数据");
                console.info(data.userInfo);
                wx.setStorageSync('userInfo', data.userInfo);
              },
              fail: function () {
                console.info("1授权失败返回数据");
                loginStatus = false;
                // 显示提示弹窗
                wx.showModal({
                  title: '我们需要你的一些信息',
                  content: '以下的操作需要获取的昵称，请同意',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      wx.openSetting({
                        success: function (data) {
                          if (data) {
                            if (data.authSetting["scope.userInfo"] == true) {
                              loginStatus = true;
                              wx.getUserInfo({
                                withCredentials: false,
                                success: function (data) {
                                  console.info("3成功获取用户返回数据");
                                  console.info(data.userInfo);
                                  wx.setStorageSync('userInfo', data.userInfo);
                                },
                                fail: function () {
                                  console.info("3授权失败返回数据");
                                }
                              });
                            }
                          }
                        },
                        fail: function () {
                          console.info("设置失败返回数据");
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        },
        fail: function () {
          console.info("登录失败返回数据");
        }
      });
    }
  } 




}


Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "H+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


module.exports = {
  formatTime: formatTime,
  commonUTIL: commonUTIL,
  constantUTIL: constantUTIL
}