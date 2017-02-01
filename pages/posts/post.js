var postsData = require("../../data/posts-data.js");

Page({
  data:{
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({
      posts_key:postsData.postList
    });
  },
  //点击进入详情页面
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    });
  },
  onSwiperTap:function(event){
    //target 和和currentTarget的区别
    //target指的是当前选中的组件,currentTarget指的是事件捕获的组件
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  }
})