// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
// import { drawRect } from "./utilities";
// import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import ImgWarning from "../src/Assets/Image/alert.png";
import Blink from "react-blink-text";
import Header from "./Component/Header";

const position = {
  x: 600,
  y: 10,
  width: 680,
  height: 500,
};

function App() {
  const [totalPerson, setTotalPerson] = useState(0);
  const [statusPerson, setStatusPerson] = useState(false);
  const [warning, setWarning] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const areaCheck = useRef(null);

  const drawRect = (detections, ctx) => {
    let person = 0;
    // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach((prediction) => {
      //get prediction result;
      const [x, y, width, height] = prediction["bbox"];
      const text = prediction["class"];
      // const text = prediction["label"];
      const x1 = position.x;
      const y1 = position.y;
      const width1 = position.width;
      const height1 = position.height;
      if (text === "person") {
        if (
          x > x1 &&
          y > y1 &&
          x < x1 + width1 &&
          y < y1 + height1 &&
          x + width < x1 + width1 &&
          y + height < y1 + height1
        ) {
          ctx.strokeStyle = "green";
          ctx.font = "18px Arial";
          ctx.fillStyle = "green";
          ctx.fillText(text, x, y);
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.rect(x, y, width, height);
          ctx.stroke();
          person += 1;
        } else {
          ctx.strokeStyle = "red";
          ctx.font = "18px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(text, x, y);
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.rect(x, y, width, height);
          ctx.stroke();
        }
      }
    });

    if (person > 0) {
      setWarning(true);
      setStatusPerson(true);
    } else {
      setWarning(false);
      setStatusPerson(false);
    }
    setTotalPerson(person);
  };

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
      // detect();
    }, 300);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // const imageSrc = webcamRef.current.getScreenshot();
      // const file = dataURLToFile(imageSrc, "captured_image.png");
      // const formData = new FormData();
      // formData.append("image", file);

      // axios
      //   .post("http://localhost:5000/realtime", formData)
      //   .then((response) => {
      //     const jsonResponse = response.data;
      //     console.log(jsonResponse);
      //     const obj = jsonResponse.objects_detected;
      //     setTotalPerson(jsonResponse.num_objects);

      //     const videoWidth = webcamRef.current.video.videoWidth;
      //     const videoHeight = webcamRef.current.video.videoHeight;

      //     // Set video width
      //     webcamRef.current.video.width = videoWidth;
      //     webcamRef.current.video.height = videoHeight;

      //     // Set canvas height and width
      //     canvasRef.current.width = videoWidth;
      //     canvasRef.current.height = videoHeight;

      //     // Draw mesh
      //     const ctx = canvasRef.current.getContext("2d");

      //     drawRect(obj, ctx);
      //   });

      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      areaCheck.current.width = videoWidth;
      areaCheck.current.height = videoHeight;
      const area = areaCheck.current.getContext("2d");
      const x1 = position.x;
      const y1 = position.y;
      const width1 = position.width;
      const height1 = position.height;
      area.strokeStyle = "green";
      area.font = "18px Arial";
      area.fillStyle = "red";
      area.fillText("area check", x1, y1);
      area.beginPath();
      area.lineWidth = 4;
      area.rect(x1, y1, width1, height1);
      area.stroke();

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      drawRect(obj, ctx);
    }
  };

  const dataURLToFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    runCoco();
  }, []);

  useEffect(() => {
    if (statusPerson === false) {
      axios
        .post("http://localhost:8080/api/turnoff")
        .then(() => {
          console.log("Turned off");
          setStatusPerson(false);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:8080/api/turnon")
        .then(() => {
          console.log("Turned on");
          setStatusPerson(true);
        })
        .catch((error) => console.log(error));
    }
  }, [statusPerson]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  return (
    <div className="App">
      <Header />
      <div style={{ padding: 20 }}>
        <Row>
          <Col md={9}>
            <Card>
              <Card.Header>Vision System Human Detector</Card.Header>
              <Card.Body>
                <div style={{ position: "relative", width: 500, height: 900 }}>
                  <Webcam
                    ref={webcamRef}
                    muted={true}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zindex: 9,
                      width: 1280,
                      height: 720,
                    }}
                    videoConstraints={videoConstraints}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zindex: 10,
                      width: 1280,
                      height: 720,
                    }}
                  />
                  <canvas
                    ref={areaCheck}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zindex: 11,
                      width: 1280,
                      height: 720,
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Row>
              <Col>
                <Card>
                  <Card.Header> Total Person Detected</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <span style={{ fontSize: 100 }}>{totalPerson}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: 30 }}>
              <Col>
                {warning && (
                  <>
                    <img src={ImgWarning} alt="warning" width={200} /> <br />
                    <h1>
                      <Blink color="red" text="Human Detected" />
                    </h1>
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* <canvas
        ref={areaCheck}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 7,
          width: 1920,
          height: 1080,
        }}
      /> */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
