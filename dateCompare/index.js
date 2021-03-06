function dateCompare (time) {
  if(new Date(time).getDate().toString() === "NaN"){
	  return "Invalid Date"
  }else{
    time = new Date(time);
  }
  
  var delta = parseInt((new Date() - time) /1000);

  if ( delta / 60 < 1 ) 
    return "刚刚"
  else if ( delta / 60 >= 1 && delta / 60 < 60 )
    return parseInt(delta / 60) +"分钟前"
  else if ( delta / 60 / 60 >= 1 && delta / 60 / 60 < 24 )
    return parseInt(delta / 60 / 60) +"小时前"
  else if( delta / 60 / 60 / 24 >= 1 &&  delta / 60 / 60 / 24 < 30 )
    return parseInt(delta / 60 / 60 / 24) +"天前"
  else if( delta / 60 / 60 / 24 / 30 >= 1 && delta / 60 / 60 / 24 / 30 < 12 )
    return parseInt(delta / 60 / 60 / 24 / 30) +"个月前"
  else if( delta / 60 / 60 / 24 / 30 > 12 && delta / 60 / 60 / 24 / 30 < 13 )
    return "一年前"
  else
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
    if( month < 10 ) month = '0'+ month
    if( day < 10 ) day = '0' + day
    return [year, month, day].join('-')
}

