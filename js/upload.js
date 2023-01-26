const uploadForm = document.getElementById("upload-form");

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// function to upload a video
async function uploadVideo(evt) {
  evt.preventDefault();

  // get form inputs
  const videoFile = document.getElementById("video-file").files[0];
  const thumbnailFile = document.getElementById("thumbnail-file").files[0];
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  console.log(await fileToBase64(videoFile), await fileToBase64(thumbnailFile));
  OrchidServices.custom.uploadVideo({
    title: title,
    description: description,
    video: await fileToBase64(videoFile),
    thumbnail: await fileToBase64(thumbnailFile),
    tags: []
  });
}
uploadForm.addEventListener('submit', uploadVideo);
