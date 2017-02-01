function convertToStartArray(starts){
    var num = starts.substring(0,1);
    var startArray = [];
    for(var i = 1 ; i<=5; i++){
        if(i <= num){
            startArray.push(1);
        }else{
            startArray.push(0);
        }
    }
    return startArray;
} 
function http(url,callback){
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          "Content-type":"application/xml"
      }, // 设置请求的 header
      success: function(res){
        // success
        callback(res.data);
      }
    })
}
function convertToCastString(casts){
    var castsjoin = "";
    for(var idx in casts){
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0,castsjoin.length-2);
}
function convertToCastInfos(casts){
    var castsArray = [];
    for(var idx in casts){
        var cast = {
            img : casts[idx].avatars? casts[idx].avatars.large : "",
            name : casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    convertToStartArray : convertToStartArray,
    http : http,
    convertToCastString : convertToCastString,
    convertToCastInfos : convertToCastInfos
}