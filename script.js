const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromDisk('/models'),
  faceapi.nets.faceLandmark68Net.loadFromDisk('/models'),
  faceapi.nets.faceRecognitionNet.loadFromDisk('/models'),
  faceapi.nets.faceExpressionNet.loadFromDisk('/models'),
  faceapi.nets.ageGenderNet.loadFromDisk('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    console.log(detections)
  //   if(detections.length() > 0){
  //   faceapi.draw.drawDetections(detections, detections.map(res => res.detection))
  //   results.forEach(result => {
  //     const { age, gender, genderProbability } = result
  //     new faceapi.draw.DrawTextField(
  //       [
  //         `${faceapi.utils.round(age, 0)} years`,
  //         `${gender} (${faceapi.utils.round(genderProbability)})`
  //       ],
  //       result.detection.box.bottomLeft
  //     ).draw(out)
  //   })
  // }
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 1000)
})