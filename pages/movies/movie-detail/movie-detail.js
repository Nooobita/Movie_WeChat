var app = getApp();
var util = require("../../../utils/util.js");

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var detailUrl = app.globalData.doubanBase + "/v2/movie/subject/"+movieId;
    util.http(detailUrl,this.processMovieData);
  },
  //查看图片
  onviewMovie:function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src]
    })
  },
  processMovieData:function(data){
    if(!data){
      return;
    }
    var director = {
      avatar: "",
      name : "",
      id : ""
    }
    if(data.directors[0] != null){
      if(data.directors[0].avatars != null){
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie={
      movieImg : data.images ? data.images.large : "",
      country : data.countries[0],
      title : data.title,
      originalTitle : data.original_title,
      wishCount : data.wish_count,
      commentCount: data.comments_count,
      year : data.year,
      generes : data.genres.join("、"),
      stars : util.convertToStartArray(data.rating.stars),
      score : data.rating.average,
      director : director,
      casts : util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary : data.summary
    }
    console.log(movie);
    this.setData({
      "movie" : movie
    });
  }
})