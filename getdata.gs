function getData() {
  var url="https://www.phitloktoday.com/api/v1/station";
  var options = {
  'method':'post'
  };
  var response=UrlFetchApp.fetch(url,options);
  var json=response.getContentText();
  var data=JSON.parse(json);
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = 1;
  for(var i=0; i<data.length-1;i++){
    var row = row+1;
    sheet.getRange(row,1).setValue(data[i].serial);
    sheet.getRange(row,2).setValue(data[i].name);
    sheet.getRange(row,3).setValue(data[i].dtm);
    sheet.getRange(row,4).setValue(data[i].status);
    sheet.getRange(row,5).setValue(data[i].pm1);
    sheet.getRange(row,6).setValue(data[i].pm10);
    sheet.getRange(row,7).setValue(data[i].pm25);
    sheet.getRange(row,8).setValue(data[i].temp);
    sheet.getRange(row,9).setValue(data[i].humi);
    sheet.getRange(row,10).setValue(data[i].fw);
    sheet.getRange(row,11).setValue(data[i].lat);
    sheet.getRange(row,12).setValue(data[i].lng);
    sheet.getRange(row,13).setValue(data[i].pm25_avg);
    sheet.getRange(row,14).setValue(data[i].us_aqi);
    sheet.getRange(row,15).setValue(data[i].th_aqi);
    sheet.getRange(row,16).setValue(data[i].ch_aqi);
  } 
}
