<template>
  <!-- <dialog
    @dragenter.prevent="this.toggleActive"
    @dragleave.prevent="this.toggleActive"
    @dragover.prevent="this.drop"
    @drop.prevent="this.drop"
    class="media-upload-modal"
    ref="mediaUploadModalContainer"
  >
    <span @click="closeModal">x</span>
    <div>Create new post</div>
    <div v-if="!this.dropzoneFile" class="label-input">
      <div>Drag photos and videos here</div>
      <label for="dropzoneFile">
        <div class="select-from-computer">Select from computer</div>
      </label>
      <input type="file" id="dropzoneFile" @change="this.drop" />
      <span>FILE NAME:{{ this.dropzoneFile.name }}</span>
    </div>
    <img v-else-if="this.dropzoneFile" id="imagePreview" src="#" alt="Image Preview" />
    <button @click="submit">Submit</button>
  </dialog> -->
  <dialog
    @dragenter.prevent="this.toggleActive"
    @dragleave.prevent="this.toggleActive"
    @dragover.prevent="this.drop"
    @drop.prevent="this.drop"
    class="media-upload-modal2"
    ref="mediaUploadModalContainer"
  >
    <div class="header">
      <span @click="closeModal">x</span>
      <div class="create-new-post-title">Create new post</div>
    </div>
    <div v-if="!this.dropzoneFile" class="label-input">
      <div>Drag photos and videos here</div>
      <label for="dropzoneFile">
        <div class="select-from-computer">Select from computer</div>
      </label>
      <input type="file" id="dropzoneFile" @change="this.drop" />
    </div>
    <div v-else-if="this.dropzoneFile" class="media-edit-container">
      <div v-if="this.contentType === 1" class="image-container">
        <button @click="cropImage">Crop Image</button>
        <img
          id="imagePreview"
          ref="originalImage"
          src="#"
          alt="Image Preview"
          class="media-preview"
        />
      </div>
      <div v-else-if="this.contentType === 2" class="image-container">
        <video ref="videoPlayer" width="300" height="480" autoplay muted>
          <source id="videoPreview1" src="#" type="video/mp4" />
          <source id="videoPreview2" src="#" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="edit-container">
        <div class="top-row-edit">
          {{ console.log("RANDOM IMAGE KEY", this.randomImageKey) }}
          <img
            :key="this.randomImageKey"
            :src="this.$store.state.currentUser.profile_picture"
            class="profile-picture"
          />
          <div>{{ this.$store.state.currentUser.username }}</div>
        </div>
        <textarea
          placeholder="Write a caption..."
          :value="captionInput"
          @input="captionInput = $event.target.value"
        />
        <input
          placeholder="Add location"
          :value="locationInput"
          @input="locationInput = $event.target.value"
        />
      </div>
    </div>
    <button class="submit-button" @click="submit">Submit</button>
  </dialog>
</template>

<script>
import contentTypeEnum from "../mappers/content-type";

import axios from "axios";

export default {
  name: "MediaUploadModalComponent",
  data() {
    return {
      active: false,
      dropzoneFile: "",
      modal: 1,
      captionInput: "",
      locationInput: "",
      contentType: null,
      contentTypeEnum: contentTypeEnum,
      randomImageKey: this.generateKey(),
    };
  },
  props: {
    updateMediaUploadModalStatus: Function,
  },
  components: {},
  methods: {
    generateKey() {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let key = "";
      for (let i = 0; i < 30; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        key += charset[randomIndex];
      }
      return key;
    },
    closeModal() {
      this.$refs.mediaUploadModalContainer.close();
      this.dropzoneFile = "";
    },
    toggleActive() {
      this.active = !this.active;
    },
    async cropImage() {
      const originalImage = this.$refs.originalImage;
      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");
      const aspectRatio = 3 / 3;
      const width = originalImage.width;
      const height = width / aspectRatio;

      // Calculate the scale factor of the image based on its aspect ratio and the dimensions of the canvas
      const scaleX = width / originalImage.naturalWidth;
      const scaleY = height / originalImage.naturalHeight;
      const scale = Math.max(scaleX, scaleY);

      // Set the dimensions of the canvas and draw the cropped image with the appropriate size and position
      croppedCanvas.width = width;
      croppedCanvas.height = height;

      croppedCtx.drawImage(
        originalImage,
        0,
        0,
        originalImage.naturalWidth,
        originalImage.naturalHeight,
        -(originalImage.naturalWidth * scale - width) / 2,
        -(originalImage.naturalHeight * scale - height) / 2,
        originalImage.naturalWidth * scale,
        originalImage.naturalHeight * scale
      );

      // Create a new Image object with the cropped image data
      const croppedImage = new Image();
      const croppedImageDataUrl = croppedCanvas.toDataURL();

      croppedImage.src = croppedImageDataUrl;

      const croppedBlob = await (await fetch(croppedImageDataUrl)).blob();
      this.console.log("ORIGNALLL IMAGE.name", originalImage.name);
      // Create a new File object with the updated metadata and the cropped image data
      const updatedFile = new File([croppedBlob], "IMG_1643.JPG", {
        type: "image/jpeg",
        lastModified: originalImage.lastModified,
      });

      this.console.log("UPDATE FILE", updatedFile);

      this.dropzoneFile = updatedFile;

      croppedImage.src = croppedCanvas.toDataURL();
      console.log("CROPPED IMAGE", croppedImage);
      this.console.log("ORGINAL IMAGE", originalImage);
      // Replace the original image with the cropped image
      this.console.log("WTFFF", originalImage);
      originalImage.parentNode.replaceChild(croppedImage, originalImage);
      return croppedImage;
    },
    drop(event) {
      this.dropzoneFile = event.dataTransfer.files[0];
      this.console.log("THIS.DROPZONEFILE", this.dropzoneFile);
      this.contentType = contentTypeEnum[this.dropzoneFile?.type];

      if (this.dropzoneFile && this.contentType === 1) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imagePreview = document.getElementById("imagePreview");
          console.log("e.target.result", e.target.result);
          imagePreview.src = e.target.result;
          setTimeout(() => {
            this.cropImage();
            // this.dropzoneFile.dataURL = cropped;
          }, 200);
        };
        reader.readAsDataURL(this.dropzoneFile);
      } else if (this.dropzoneFile && this.contentType === 2) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const videoPreview1 = document.getElementById("videoPreview1");
          videoPreview1.src = e.target.result;
          const videoPreview2 = document.getElementById("videoPreview2");
          videoPreview2.src = e.target.result;
        };
        reader.readAsDataURL(this.dropzoneFile);
      }
    },
    submit() {
      console.log("LINE 57", this.dropzoneFile);
      let formData = new FormData();

      formData.append("file", this.dropzoneFile);
      formData.append("caption", this.captionInput);
      formData.append("location", this.locationInput);

      this.console.log("weooo line 130", formData.get("file"));
      this.console.log("ID TOKEN MFF", this.$store.state.token);
      axios
        .post("http://localhost:7002/uploadMedia", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.state.token,
          },
        })
        .then((response) => {
          this.console.log("RESPONSEEE", response);
          this.closeModal();
          this.locationInput = "";
          this.captionInput = "";
        })
        .catch((error) => {
          this.console.error(error);
        });
    },
  },
  computed: {
    console: () => console,
  },
};
</script>

<style scoped>
.media-upload-modal {
  width: 400px;
  height: 500px;
  border-radius: 3%;
}

.media-upload-modal2 {
  width: 800px;
  height: 1200px;
  border-radius: 3%;
  overflow: hidden;
}

.label-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 93%;
}

input {
  display: none;
}

.select-from-computer {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 50px;
  background-color: #405de6;
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  width: 120px;
}

.select-from-computer:hover,
.select-from-computer:focus {
  background-color: #2e3a8b;
  outline: none;
}

.media-preview {
  width: 400px;
  height: 90%;
  object-fit: cover;
}

.profile-picture {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

.media-edit-container {
  display: flex;
  flex-direction: row;
}

.edit-container {
  margin-left: 15px;
}

.top-row-edit {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.image-container {
  display: flex;
  height: 62vh;
}

.header {
  height: 30px;
  display: flex;
  flex-direction: row;
}

.submit-button {
  margin-right: 50px;
}
.create-new-post-title {
  margin-left: 50px;
}
</style>
