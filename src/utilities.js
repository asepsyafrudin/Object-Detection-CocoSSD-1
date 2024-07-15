export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    //get prediction result;
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];
    const x1 = 10;
    const y1 = 10;
    const width1 = 300;
    const height1 = 400;
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
        ctx.fillStyle = "red";
        ctx.fillText(text, x, y);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.rect(x, y, width, height);
        ctx.stroke();
      } else {
        ctx.strokeStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(text, x, y);
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.rect(x, y, width, height);
        ctx.stroke();
      }
    }
  });
};
