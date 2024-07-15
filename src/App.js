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
import { drawRect } from "./utilities";
// import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";

function App() {
  const [totalPerson, setTotalPerson] = useState(0);
  const [statusPerson, setStatusPerson] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const areaCheck = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 300);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
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

      // areaCheck.current.width = videoWidth;
      // areaCheck.current.height = videoHeight;

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video);
      let person = 0;
      obj.forEach((element) => {
        if (element.class === "person") {
          person += 1;
        }
      });

      setTotalPerson(person);

      if (person > 0) {
        setStatusPerson(true);
      } else {
        setStatusPerson(false);
      }

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      drawRect(obj, ctx);
    }
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
    width: 1920,
    height: 1080,
    facingMode: "user",
  };
  return (
    <div className="App">
      <Header />
      <div style={{ padding: 20 }}>
        <Row>
          <Col md={7}>
            <Card>
              <Card.Header>Vision System Human Detector</Card.Header>
              <Card.Body>
                <div style={{ position: "relative", width: 500, height: 480 }}>
                  <Webcam
                    ref={webcamRef}
                    muted={true}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 15,
                      right: 0,
                      textAlign: "center",
                      zindex: 9,
                      width: 600,
                      height: 480,
                    }}
                    videoConstraints={videoConstraints}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 15,
                      right: 0,
                      textAlign: "center",
                      zindex: 10,
                      width: 600,
                      height: 480,
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
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
