// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");

Page({
  data:{
    category : "",
    isEmpty: true,
    totalCount : 0,
    requestUrl : ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    var dataUrl = "";
    this.data.category = category; 
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase+"/v2/movie/in_theaters";
        util.http
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase+"/v2/movie/coming_soon";
        break;
      case "Top250":
        dataUrl = app.globalData.doubanBase+"/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl,this.processMovieData);
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.category
    })
  },
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    util.http(refreshUrl,this.processMovieData);
    //防止刷新读取重复数据
    this.data.movies = {};
    this.data.isEmpty=true;
    this.data.totalCount = 0;
    wx.showNavigationBarLoading();
  },
  //跳转到详情页
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+movieId
    })
  },
  //http请求的回调函数
  processMovieData:function(data){
     var movies =[];
     var totalMovies =[];
      for(var id in data.subjects){
        var subject = data.subjects[id];
        var title = subject.title;
        if(title.length >= 6){
          title = title.substring(0,6) + "...";
        }
        var temp = {
          title : title,
          average : subject.rating.average,
          coverUrl : subject.images.large,
          movieId : subject.id,
          stars : util.convertToStartArray(subject.rating.stars)
        }
        movies.push(temp);
      }
      //判断是否已经有数据
      if(!this.data.isEmpty){
        totalMovies = this.data.movies.concat(movies);
      }else{
        totalMovies = movies;
        this.data.isEmpty = false;
      }
      this.setData({
        movies : totalMovies
      });
      this.data.totalCount +=20;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
  },
  onReachBottom:function(event){
    var nextUrl = this.data.requestUrl + "?start="+this.data.totalCount + "&count=20";
    util.http(nextUrl,this.processMovieData);
    wx.showNavigationBarLoading();
  }
})