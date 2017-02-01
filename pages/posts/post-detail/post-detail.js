var postsData = require("../../../data/posts-data.js")
var app = getApp();
Page({
  data:{
    isPlayingMusic : false
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var postId = options.id;
    this.data.currentPostId = postId;
    
    var postData = postsData.postList[postId];
    this.setData({
      postData:postData 
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if(postsCollected){
      var postCollected = postsCollected[postId];
      this.setData({
        collected:postCollected
      });
    }else{
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == postId){
      this.setData({
        isPlayingMusic:true
      });
    }
    this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    var that = this;
    //监听音乐开始事件
    wx.onBackgroundAudioPlay(function() {
      // callback
      that.setData({
        isPlayingMusic : true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    //监听音乐暂停事件
    wx.onBackgroundAudioPause(function() {
      // callback
      that.setData({
        isPlayingMusic : false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function() {
      // callback
      that.setData({
        isPlayingMusic : false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },
  onCollectionTap:function(event){
      var postsCollected = wx.getStorageSync('posts_collected');
      var postCollected = postsCollected[this.data.currentPostId];
      //收藏变未收藏，未收藏变成收藏
      postCollected = !postCollected;
      postsCollected[this.data.currentPostId] = postCollected;
     //调用函数
    //  this.showModal(postsCollected,postCollected);
     this.showToast(postsCollected,postCollected);

  },
  onShareTap:function(event){
      var itemList = [
        "分享给微信好友",
        "分享到朋友圈",
        "分享到到QQ",
        "分享到微博"
      ];
      wx.showActionSheet({
        itemList: itemList,
        itemColor: "#405f80",
        success: function(res){
          //res.cancel 用户是否点击了取消按钮
          //res.tapIndex 数组元素的序号,从0开始
          wx.showModal({
            title:"用户"+itemList[res.tapIndex],
            content:"用户是否取消?"+res.cancel+"现在无法实现分享功能"
          });
        }
      });
  },
  onMusicTap:function(event){
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      });
    }else{
      wx.playBackgroundAudio({
      dataUrl: postData.music.dataUrl,
      title: postData.music.title,
      coverImgUrl: postData.music.coverImgUrl
     });
     this.setData({
       isPlayingMusic:true
     });
    }

  },
  showModal:function(postsCollected,postCollected){
    var that = this;
    wx.showModal({
      title:"收藏",
      content:postCollected?"收藏该文章?":"取消收藏该文章",
      showCancel:"true",
      cancelText:"取消",
      cancelColor:"#333",
      confirmText:"确认",
      confirmColor:"#405f80",
      success:function(res){
        if(res.confirm){
           //更新文章是否的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量,从而实现切换图片
          that.setData({
            collected:postCollected
          });
        }
      }
    });
  },
  showToast:function(postsCollected,postCollected){
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量,从而实现切换图片
    this.setData({
      collected:postCollected
    });
    wx.showToast({
      title:postCollected?"收藏成功":"取消成功",
      duration:1000,
      icon:"success"
    });
  }
})