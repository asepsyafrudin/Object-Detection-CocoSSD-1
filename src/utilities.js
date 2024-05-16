export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    //get prediction result;
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];

    ctx.strokeStyle = "red";
    ctx.font = "18px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(text, x, y);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};
