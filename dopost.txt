var ss = SpreadsheetApp.openById(
    "16xKF66OU7PcDSgETQb7pVFKvibBaHhtrLCqBh7Cpul0"
  );
  var sheet = ss.getSheetByName("sheet1");
  
  function doPost(e) {
    var dialogflowDATA = JSON.parse(e.postData.contents);
    var station = dialogflowDATA.queryResult.parameters.station;
    var intent = dialogflowDATA.queryResult.intent.displayName;
  
    //var message = 'อู่ทอง';
    var tableArray = sheet
      .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
      .getValues();
    var botReply = "";
    var j = "";
    var botResult = 0;
    var bubble_list = [];
    var bubble_msg = {};
    const pics = [
      {
        serial: "1",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/phai.jpg"
      },
      {
        serial: "2",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/east.jpg"
      },
      {
        serial: "3",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/psru.jpg"
      },
      {
        serial: "4",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/nu.jpg"
      },
      {
        serial: "5",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/indochina.jpg"
      },
      {
        serial: "7",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/authong.jpg"
      },
      {
        serial: "9",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/pacha.jpg"
      },
      {
        serial: "8",
        url:
          "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/hostpital.jpg"
      },
      {
        serial: "10",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/samaidang.jpg"
      },
      {
        serial: "11",
        url:"https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/airport.jpg"
      },
      {
        serial: "12",
        url:"https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/west.jpg"
      },
      {
        serial: "14",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/samorkhae.jpg"
      },
      {
        serial: "15",
        url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/watbot.jpg"
      },
      {
        serial: "16",
        url:  "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/malabieng.jpg"
      }
    ];
      if (intent == "Default Welcome Intent") {
      for (var i = 0; i < tableArray.length; i++) {
        j = i + 2;
        var sn = sheet.getRange(j, 1).getValue();
        var stt = sheet.getRange(j, 4).getValue();
        if(sn != "8" && sn != "9" && sn != "15" && stt == "1"){
          const img = pics.find((pic) => {
              return pic.serial == sn;
            });
            bubble_msg = {
              direction: "ltr",
              type: "bubble",
              size: "micro",
              hero: {
                type: "box",
                backgroundColor: "#26A69A",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url: `${img.url}`,
                    align: "center",
                    gravity: "center",
                    aspectRatio: "2:1",
                    aspectMode: "cover",
                    size: "full",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                ],
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    color: "#C3C3C3",
                    type: "separator",
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        color: "#005500",
                        type: "text",
                        text: `${sheet.getRange(j, 2).getValue()}`,
                        align: "center",
                        weight: "bold",
                        size: "md",
                      },
                    ],
                    margin: "lg",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        color: "#000000",
                        type: "text",
                        text: "PM2.5 :  " + `${sheet.getRange(j, 7).getValue()}` + " µg/m3",
                        align: "center",
                        weight: "bold",
                        size: "sm",
                      },
                    ],
                    margin: "sm",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                  {
                    type: "separator",
                    color: "#C3C3C3",
                    margin: "lg",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    style: "primary",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                    color: "#26A69A",
                    type: "button",
                    height: "sm",
                    margin: "none",
                  },
                ],
              },
            };
            bubble_list.push(bubble_msg);          
        }    
      }
      bubble_msg = {
        direction: "ltr",
        type: "bubble",
        size: "micro",
        hero: {
          type: "box",
          backgroundColor: "#26A69A",
          layout: "vertical",
          contents: [
            {
              type: "image",
              url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/logo.png",
              align: "center",
              gravity: "center",
              aspectRatio: "2:1",
              aspectMode: "cover",
              size: "full",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              color: "#C3C3C3",
              type: "separator",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  color: "#005500",
                  type: "text",
                  text: "ดูสถานที่ทั้งหมด",
                  align: "center",
                  weight: "bold",
                  size: "md",
                },
              ],
              margin: "lg",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
            },
            {
              type: "separator",
              color: "#C3C3C3",
              margin: "lg",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              style: "primary",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
              color: "#26A69A",
              type: "button",
              height: "sm",
              margin: "none",
            },
          ],
        },
      };
      bubble_list.push(bubble_msg);
      botReply = {
        fulfillmentMessages: [
           {
            platform: "line",
            payload: {
              line: {
              stickerId: "52002738",
              type: "sticker",
              packageId: "11537"
              },
            },
          },
          {
            platform: "line",
            text: {
              text: ["สวัสดีครับ คุณสามารถพิมพ์ชื่อสถานที่ \nหรือเลือกจากด้านล่างนี้ได้เลยครับ"]
            }
          },
          {
            platform: "line",
            type: 4,
            payload: {
              line: {
                type: "flex",
                altText: "สภาพอากาศ",
                contents: {
                  type: "carousel",
                  contents: bubble_list,
                },
              },
            },
          },
        ],
      };
    }
    if (intent == "LiveWeather") {
      for (var i = 0; i < tableArray.length; i++) {
        j = i + 2;
        var sn = sheet.getRange(j, 1).getValue();
        var stt = sheet.getRange(j, 4).getValue();
        if(sn != "8" && sn != "9" && sn != "15" && stt == "1"){
          const img = pics.find((pic) => {
              return pic.serial == sn;
            });
            bubble_msg = {
              direction: "ltr",
              type: "bubble",
              size: "micro",
              hero: {
                type: "box",
                backgroundColor: "#26A69A",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url: `${img.url}`,
                    align: "center",
                    gravity: "center",
                    aspectRatio: "2:1",
                    aspectMode: "cover",
                    size: "full",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                ],
              },
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    color: "#C3C3C3",
                    type: "separator",
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        color: "#005500",
                        type: "text",
                        text: `${sheet.getRange(j, 2).getValue()}`,
                        align: "center",
                        weight: "bold",
                        size: "md",
                      },
                    ],
                    margin: "lg",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        color: "#000000",
                        type: "text",
                        text: "PM2.5 :  " + `${sheet.getRange(j, 7).getValue()}` + " µg/m3",
                        align: "center",
                        weight: "bold",
                        size: "sm",
                      },
                    ],
                    margin: "sm",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                  },
                  {
                    type: "separator",
                    color: "#C3C3C3",
                    margin: "lg",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    style: "primary",
                    action: {
                      type: "message",
                      label: "เลือก",
                      text: `${sheet.getRange(j, 2).getValue()}`,
                    },
                    color: "#26A69A",
                    type: "button",
                    height: "sm",
                    margin: "none",
                  },
                ],
              },
            };
            bubble_list.push(bubble_msg);          
        }    
      }
      bubble_msg = {
        direction: "ltr",
        type: "bubble",
        size: "micro",
        hero: {
          type: "box",
          backgroundColor: "#26A69A",
          layout: "vertical",
          contents: [
            {
              type: "image",
              url: "https://raw.githubusercontent.com/soda579/my-smartlife/master/pic/logo.png",
              align: "center",
              gravity: "center",
              aspectRatio: "2:1",
              aspectMode: "cover",
              size: "full",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
            },
          ],
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              color: "#C3C3C3",
              type: "separator",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  color: "#005500",
                  type: "text",
                  text: "ดูสถานที่ทั้งหมด",
                  align: "center",
                  weight: "bold",
                  size: "md",
                },
              ],
              margin: "lg",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
            },
            {
              type: "separator",
              color: "#C3C3C3",
              margin: "lg",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              style: "primary",
              action: {
                type: "uri",
                label: "ดูทั้งหมด",
                uri: "https://www.phitloktoday.com/",
              },
              color: "#26A69A",
              type: "button",
              height: "sm",
              margin: "none",
            },
          ],
        },
      };
      bubble_list.push(bubble_msg);
      botReply = {
        fulfillmentMessages: [
          {
            platform: "line",
            type: 4,
            payload: {
              line: {
                type: "flex",
                altText: "สภาพอากาศ",
                contents: {
                  type: "carousel",
                  contents: bubble_list,
                },
              },
            },
          },
        ],
      };
    }
  
    if (intent == "SelectStation") {
      for (var i = 0; i < tableArray.length; i++) {
        if (tableArray[i][1] == station) {
          i = i + 2;
          j = i;
          botResult = 1;
        }
      }
      if (botResult == 1) {
        let pm = sheet.getRange(j, 7).getValue();
        let pmResult = "";
        let colorResult = "";
        if (pm > 0 && pm <= 25) {
          pmResult = "คุณภาพอากาศดีมาก";
          colorResult = "#0F76C8";
        } else if (pm > 25 && pm <= 37) {
          pmResult = "คุณภาพอากาศดี";
          colorResult = "#009813";
        } else if (pm > 37 && pm <= 50) {
          pmResult = "คุณภาพอากาศปานกลาง";
          colorResult = "#FEC411";
        } else if (pm > 50 && pm <= 90) {
          pmResult = "อากาศเริ่มมีผลต่อสุขภาพ";
          colorResult = "#EC5629";
        } else {
          pmResult = "อากาศมีผลกระทบต่อสุขภาพ";
          colorResult = "#FF0000";
        }
        var today = Utilities.formatDate(
          new Date(),
          "GMT+7",
          "dd/MM/yyyy HH:mm:ss"
        );
        botReply = {
          fulfillmentMessages: [
            {
              platform: "line",
              type: 4,
              payload: {
                line: {
                  //"type": "text",
                  type: "flex",
                  altText: "สภาพอากาศ",
                  contents: {
                    type: "bubble",
                    direction: "ltr",
                    header: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: `${sheet.getRange(j, 2).getValue()}`,
                          size: "xxl",
                          weight: "bold",
                          color: "#26A69A",
                        },
                        {
                          type: "text",
                          text: `${today}` + " (Bangkok, Thailand)",
                          size: "xs",
                          color: "#B2B2B2",
                        },
                        {
                          type: "text",
                          weight: "bold",
                          text: pmResult,
                          margin: "lg",
                          size: "xl",
                          align: "center",
                          color: colorResult,
                        },
                      ],
                    },
                    body: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "separator",
                          color: "#C3C3C3",
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          margin: "lg",
                          contents: [
                            {
                              type: "text",
                              text: "ค่า PM2.5",
                              size: "sm",
                              color: "#C3C3C3",
                            },
                            {
                              type: "text",
                              text: `${sheet.getRange(j, 7).getValue()}`,
                              weight: "bold",
                              align: "end",
                              color: "#000000",
                            },
                            {
                              type: "text",
                              text: "µg/m3",
                              align: "end",
                              size: "sm",
                              color: "#C3C3C3",
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          margin: "lg",
                          contents: [
                            {
                              type: "text",
                              text: "อุณหภูมิ",
                              // size: "sm",
                              color: "#C3C3C3",
                            },
                            {
                              type: "text",
                              text: `${sheet.getRange(j, 8).getValue()}`,
                              weight: "bold",
                              align: "end",
                              color: "#000000",
                            },
                            {
                              type: "text",
                              text: "*C",
                              align: "end",
                              size: "sm",
                              color: "#C3C3C3",
                            },
                          ],
                        },
  
                        {
                          type: "box",
                          layout: "baseline",
                          margin: "lg",
                          contents: [
                            {
                              type: "text",
                              text: "คุณภาพอากาศ",
                              size: "sm",
                              color: "#C3C3C3",
                            },
                            {
                              type: "text",
                              text: `${sheet.getRange(j, 15).getValue()}`,
                              weight: "bold",
                              align: "end",
                              color: "#000000",
                            },
                            {
                              type: "text",
                              text: "(AQI)",
                              size: "sm",
                              align: "end",
                              color: "#C3C3C3",
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          margin: "lg",
                          contents: [
                            {
                              type: "text",
                              text: "PM2.5 เฉลี่ย",
                              size: "sm",
                              color: "#C3C3C3",
                            },
                            {
                              type: "text",
                              text: `${sheet.getRange(j, 13).getValue()}`,
                              weight: "bold",
                              align: "end",
                              color: "#000000",
                            },
                            {
                              type: "text",
                              text: "µg/m3",
                              size: "sm",
                              align: "end",
                              color: "#C3C3C3",
                            },
                          ],
                        },
                        {
                          type: "separator",
                          margin: "lg",
                          color: "#C3C3C3",
                        },
                      ],
                    },
                    footer: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "button",
                          action: {
                            type: "uri",
                            label: "View Map",
                            uri: "https://www.phitloktoday.com/",
                          },
                          color: "#26A69A",
                          style: "primary",
                        },
                      ],
                    },
                    styles: {
                      header: {
                        backgroundColor: "#F9F9F9",
                      },
                    },
                  },
  
                  // "text": sheet.getRange(i, 7).getValue()
                },
              },
            },
          ],
        };
      } else {
        botReply = {
          fulfillmentMessages: [
            {
              platform: "line",
              type: 4,
              payload: {
                line: {
                  type: "text",
                  text: "เราไม่รู้จักสถานที่นี้ กรุณาพิมพ์ชื่อหรือเลือกสถานที่อีกครั้งครับ",
                },
              },
            },
          ],
        };
      }
    }
  
    //Logger.log(monthName)
    var replyJSON = ContentService.createTextOutput(
      JSON.stringify(botReply)
    ).setMimeType(ContentService.MimeType.JSON);
    return replyJSON;
  }
  