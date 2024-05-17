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

function App() {
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
    }, 10);
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

      areaCheck.current.width = videoWidth;
      areaCheck.current.height = videoHeight;

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)
      drawRect(obj, ctx);

      const ctxArea = areaCheck.current.getContext("2d");

      const x = 10;
      const y = 10;
      const width = 300;
      const height = 400;
      const text = "Area Check";
      ctxArea.strokeStyle = "red";
      ctxArea.font = "18px Arial";
      ctxArea.fillStyle = "red";
      ctxArea.fillText(text, x, y);
      ctxArea.beginPath();
      ctxArea.lineWidth = 2;
      ctxArea.rect(x, y, width, height);
      ctxArea.stroke();
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      {/* <Header /> */}
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
          width: 640 * 2,
          height: 480 * 2,
        }}
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
          zindex: 8,
          width: 640 * 2,
          height: 480 * 2,
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
          zindex: 7,
          width: 640 * 2,
          height: 480 * 2,
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
