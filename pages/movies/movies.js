var util = require("../../utils/util.js");
var app = getApp();
Page({
  //初始化数据
  data:{
    "inTheater":{},
    "comingTheater":{},
    "top250":{},
    "containerShow": true,
    "searchPanelShow": false,
    "searchResult":{}
  },
  //页面加载触发
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var inTheaterUrl = app.globalData.doubanBase+ "/v2/movie/in_theaters?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase+"/v2/movie/coming_soon?start=0&count=3";
    var top250Url = app.globalData.doubanBase+"/v2/movie/top250?start=0&count=3";
    
    this.getMovieListData(inTheaterUrl,"inTheater","正在热映");
    this.getMovieListData(comingSoonUrl,"comingTheater","即将上映");
    this.getMovieListData(top250Url,"top250","Top250");
  },
  //更多 处理函数
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category
    })
  },
  //获取电影数据函数
  getMovieListData:function(url,selectKey,categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type":"application/xml"
      }, // 设置请求的 header
      success: function(res){
        // success  
        console.log(res.data);
        that.processDoubanData(res.data,selectKey,categoryTitle);
      },
      fail: function() {
        // fail
      }
    })
  },
  //点击输入框函数
  onBindFocus:function(event){
    this.setData({
      "containerShow" : false,
      "searchPanelShow": true
    });
  },
  //取消函数
  cancelImg:function(event){
    this.setData({
      "containerShow" : true,
      "searchPanelShow" : false
    });
  },
  //输入框改变
  onConfirm:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q="+text;
    this.getMovieListData(searchUrl,"searchResult",text+"搜索结果");
  },
  //跳转到电影详情页
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId
    })
  },
  //加载电影数据函数
  processDoubanData:function(moviesDouban,selectKey,categoryTitle){
    var movies =[];
    for(var id in moviesDouban.subjects){
      var subject = moviesDouban.subjects[id];
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
    //动态绑定数据
    var readyData={};
    readyData[selectKey] = {
      categoryTitle:categoryTitle,
      movies : movies
    }
    this.setData(readyData);
  }
})