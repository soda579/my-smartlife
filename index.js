"use strict";

const functions = require("firebase-functions");
const {
  WebhookClient,
  Payload
} = require("dialogflow-fulfillment");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// const serviceAccount = require('./key.json')
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://pizzanulok-vfwchf.firebaseio.com'
// });

const db = admin.firestore();

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({
      request,
      response
    });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    // ทดสอบการ แสดงค่า user id ที่ได้จาก webhook (โดยพิมพ์กับ bot ด้วยคำว่า  who )
    function getUser(agent) {
      let userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      let timeStamp =
        request.body.originalDetectIntentRequest.payload.data.timestamp;
      db.collection("users")
        .doc(timeStamp)
        .set({
          userId: `${userId}`
        });
      let show = "your user id : " + userId;
      return agent.add(show);
    }

    //สร้างสติ๊กเกอร์ payload แสดงข้อความตอนอัพเดตข้อมูลเสร็จ
    const successJson = {
      type: "sticker",
      packageId: "11537",
      stickerId: "52002745"
    };
    let payloadSuccess = new Payload(`LINE`, successJson, {
      sendAsMessage: true
    });

    //สร้างสติ๊กเกอร์ payload แสดงข้อความตอนไม่พบข้อมูล
    const failJson = {
      type: "sticker",
      packageId: "11538",
      stickerId: "51626522"
    };
    let payloadFail = new Payload(`LINE`, failJson, {
      sendAsMessage: true
    });

    // รับค่าจาก Intent : SelectStation ***พิมพ์ชื่อสถานีวัดมาแบบตรงๆ***
    function showStation(agent) {
      let station = request.body.queryResult.parameters.station;
      return db
        .collection("stations")
        .where("name", "==", `${station}`)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) return agent.add(`ขออภัย!! ไม่พบข้อมูล!!`);
          let position;
          if (agent.requestSource !== agent.LINE) {
            position = `สภาพอากาศ :\n${snapshot.docs
              .map((station) => `- ${station.data().name}`)
              .sort()
              .join("\n")}`;
          } else {
            const carousel = showDetails(snapshot.docs);
            position = carousel;
            position = new Payload(agent.LINE, carousel, {
              sendAsMessage: true
            });
          }
          return agent.add(position);
        });
    }

    // รับค่าจาก Intent : LiveWeather ***แสดงทุกๆสถานี แบบ carousel ***
    // โดยดึงข้อมูลจาก firebase มาแสดงค่า
    function showWeather(agent) {
      return db
        .collection("stations")
        .limit(5)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) return agent.add(`ขออภัย!! ไม่พบข้อมูล!!`);
          let position;
          if (agent.requestSource !== agent.LINE) {
            position = `สภาอากาศ :\n${snapshot.docs
              .map((station) => `- ${station.data().name}`)
              .sort()
              .join("\n")}`;
          } else {
            const carousel = getFlexMessage(snapshot.docs);
            position = carousel;
            position = new Payload(agent.LINE, carousel, {
              sendAsMessage: true
            });
          }
          return agent.add(position);
        });
    }

    // รับค่าจาก Intent : PlaceSetting - Selection แล้วให้เลือกสถานีวัด
    function getSelection(agent) {
      //แสดงตัวเลือกสถานีตรวจวัดแบบ carousel
      return db
        .collection("stations")
        .limit(5)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) return agent.add(`ขออภัย!! ไม่พบข้อมูล`);
          let position;
          if (agent.requestSource !== agent.LINE) {
            position = `สภาพอากาศ :\n${snapshot.docs
              .map((station) => `- ${station.data().name}`)
              .sort()
              .join("\n")}`;
          } else {
            const carousel = getFlexMessage(snapshot.docs);
            position = carousel;
            position = new Payload(agent.LINE, carousel, {
              sendAsMessage: true
            });
          }
          return agent.add(position);
        });
    }

    // รับค่าจาก Intent : PlaceSetting - Selection - Check - yes
    // ทำการบันทึกค่าสถานที่ของผู้ใช้งาน [บ้าน/ที่ทำงาน/ที่ออกกำลังกาย] ว่าเป็น station ไหน
    function confirmSelect(agent) {
      let userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      let station = request.body.queryResult.parameters.station;
      let member_location = request.body.queryResult.parameters.member_location;
      let timeStamp =
        request.body.originalDetectIntentRequest.payload.data.timestamp;
      let data = {
        timeStamp: timeStamp
      };

      switch (member_location) {
        case "ที่บ้าน":
          data.home = station;
          break;
        case "ที่ทำงาน":
          data.office = station;
          break;
        case "ที่ออกกำลังกาย":
          data.exercise = station;
          break;
      }

      return db
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) {
            data.userId = userId;
            db.collection("users")
              .doc(userId)
              .set(data);
          } else {
            db.collection("users")
              .doc(userId)
              .update(data);
          }
          agent.add("แก้ไขข้อมูลเรียบร้อยจร้าาาา");
          agent.add(payloadSuccess);
        });
    }

    // แสดงค่าจาก Intent : MemberPlace ***รับค่าที่อยู่ของ Member แล้วเทียบค่าใน table station***
    function showPlace(agent) {
      let location = request.body.queryResult.parameters.member_location;
      let userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      let station = null;
      //เช็คข้อมูลใน table  user ว่าได้บันทึกไว้ไหม?
      return db
        .collection("users")
        .doc(`${userId}`)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) {
            let msg = "คุณยังไม่ได้บันทึกข้อมูล " + location + " เลยจร้าาาา";
            agent.add(msg);
            agent.add(payloadFail);
          } else {
            switch (location) {
              case "ที่บ้าน":
                station = snapshot.data().home;
                break;
              case "ที่ทำงาน":
                station = snapshot.data().office;
                break;
              case "ที่ออกกำลังกาย":
                station = snapshot.data().exercise;
                break;
            }

            let successMsg = "นี่คือสภาพอากาศ " + location + " ของคุณ";
            let failMsg =
              "คุณยังไม่ได้ตั้งค่าข้อมูล " + location + " เลยจร้าาาา";

            // return agent.add(station);
            return db
              .collection("stations")
              .where("name", "==", `${station}`)
              .get()
              .then((snapshot) => {
                if (snapshot.empty)
                  return agent.add(failMsg), agent.add(payloadFail);
                let position;
                if (agent.requestSource !== agent.LINE) {
                  position = `สภาพอากาศ :\n${snapshot.docs
                    .map((station) => `- ${station.data().name}`)
                    .sort()
                    .join("\n")}`;
                } else {
                  const carousel = showDetails(snapshot.docs);
                  position = carousel;
                  position = new Payload(agent.LINE, carousel, {
                    sendAsMessage: true
                  });
                }
                agent.add(successMsg);
                return agent.add(position);
              });
          }
        });
    }

    // แสดง flex Message จาก สถานีทั้งหมด
    function getFlexMessage(stations) {
      const rows = stations.map((item) => {
        const station = item.data();
        console.log("station: " + JSON.stringify(station));
        return {
          type: "bubble",
          hero: {
            type: "image",
            url: station.pic,
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover"
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [{
                type: "text",
                text: station.name,
                size: "xl",
                weight: "bold",
                wrap: true
              },
              {
                type: "text",
                text: "ค่าเฉลี่ย  " + station.pm25_avg,
                size: "xl",
                weight: "regular",
                wrap: true
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [{
              type: "button",
              action: {
                type: "message",
                label: "เลือก",
                text: station.name
              },
              color: "#C40019",
              style: "primary"
            }]
          }
        };
      });
      const seeMoreBubble = {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [{
            type: "button",
            action: {
              type: "uri",
              label: "ดูทั้งหมด",
              uri: "https://liff.line.me/1654109074-3wPzWOV8" // TODO: change this to your LIFF app
            },
            color: "#ffffff",
            gravity: "center",
            offsetTop: "150px"
          }]
        },
        styles: {
          body: {
            backgroundColor: "#C40019"
          }
        }
      };
      rows.push(seeMoreBubble);
      console.log("rows: " + JSON.stringify(rows));
      return {
        type: "flex",
        altText: "สภาพอากาศ",
        contents: {
          type: "carousel",
          contents: rows
        }
      };
    }

    // แสดง flex message เฉพาะ station ที่เลือกดู
    function showDetails(stations) {
      const rows = stations.map((item) => {
        const station = item.data();
        console.log("station: " + JSON.stringify(station));
        let aqi = station.th_aqi;
        let aqiResult = "";
        if (aqi > 0 && aqi <= 25) {
          aqiResult = "คุณภาพอากาศดีมาก"
        } else if (aqi > 25 && aqi <= 50) {
          aqiResult = "คุณภาพอากาศดี"
        } else if (aqi > 50 && aqi <= 100) {
          aqiResult = "คุณภาพอากาศปานกลาง"
        } else {
          aqiResult = "อากาศเริ่มมีผลต่อสุขภาพ"
        }
        return {
          type: "bubble",
          direction: "ltr",
          header: {
            type: "box",
            layout: "vertical",
            contents: [{
                type: "text",
                text: station.name,
                size: "xxl",
                weight: "bold",
                color: "#0000FF"
              },
              {
                type: "text",
                text: station.dtm + " (GMT+7)",
                size: "xs",
                color: "#2F4F4F"
              },
              {
                type: "text",
                text: aqiResult,
                size: "lg",
                align: "center",
                margin: "md",
                color: "#009813"
              }
            ]
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
                type: "separator",
                color: "#006400"
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    text: "ค่า PM 2.5",
                    align: "start",
                    color: "#FF4500"
                  },
                  {
                    type: "text",
                    text: `${station.pm25}`,
                    align: "end",
                    color: "#FF4500"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    text: "อุณหภูมิ(C)",
                    align: "start",
                    color: "#000099"
                  },
                  {
                    type: "text",
                    text: `${station.temp}`,
                    align: "end",
                    color: "#000099"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    align: "start",
                    text: "ความชื้น(%)",
                    color: "#FF00FF"
                  },
                  {
                    type: "text",
                    text: `${station.humi}`,
                    align: "end",
                    color: "#FF00FF"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    text: "ดัชนีคุณภาพอากาศ",
                    color: "#006400"
                  },
                  {
                    type: "text",
                    text: `${station.th_aqi}`,
                    align: "end",
                    color: "#006400"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    text: "ค่า PM 2.5 เฉลี่ย",
                    align: "start",
                    color: "#8B4513"
                  },
                  {
                    type: "text",
                    text: `${station.pm25_avg}`,
                    align: "end",
                    color: "#8B4513"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                margin: "lg",
                contents: [{
                    type: "text",
                    text: "ค่า PM 10",
                    align: "start",
                    color: "#9400D3"
                  },
                  {
                    type: "text",
                    text: `${station.pm10}`,
                    align: "end",
                    color: "#9400D3"
                  }
                ]
              },
              {
                type: "separator",
                margin: "lg",
                color: "#006400"
              }
            ]
          },
          footer: {
            type: "box",
            layout: "horizontal",
            contents: [{
              type: "text",
              text: "View All",
              size: "lg",
              align: "center",
              color: "#0000FF",
              action: {
                type: "uri",
                label: "View All",
                uri: "https://www.phitloktoday.com/"
              }
            }]
          }
        };
      });
      rows.push();
      console.log("rows: " + JSON.stringify(rows));
      return {
        type: "flex",
        altText: "สภาพอากาศ",
        contents: {
          type: "carousel",
          contents: rows
        }
      };
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("GetUser", getUser);

    //แสดงสภาพอากาศทั้งหมด
    intentMap.set("LiveWeather", showWeather);

    //แสดงสภาพอากาศจากสถานีที่ user เลือก
    intentMap.set("SelectStation", showStation);

    //แสดงสภาพอากาศจากสถานที่ที่ user บันทึกไว้
    intentMap.set("MemberPlace", showPlace);

    //ตั้งค่าสถานที่
    intentMap.set("PlaceSetting - Selection", getSelection);
    intentMap.set("PlaceSetting - Selection - Check - yes", confirmSelect);

    return agent.handleRequest(intentMap);
  }
);