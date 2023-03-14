<template>
  <div class="container">
    <div v-for="(story, index) of stories" :key="index">
      <!-- <div v-for="(story, index) of this.$store.state.stories" :key="index"> -->
      <div
        @click.stop.prevent="changeStory(index)"
        :class="getClass(index)"
        v-if="this.currentStoryIndex - index < 3"
      >
        <div v-if="index === this.currentStoryIndex">
          <div class="progress-bar">
            <div
              class="progress"
              :style="{
                width: resumeProgressBar ? progress + '%' : savedProgress + '%',
              }"
            ></div>
          </div>
          {{ this.resumeProgressBar ? startProgress(index) : null }}
          <button @click="stopProgress">
            {{ resumeProgressBar ? "Stop" : "Start" }}
          </button>
        </div>
        <!-- <img
          v-if="this.currentStoryIndex - index < 3"
          :src="story.content"
          class="image"
        /> -->
        <div>{{ story }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import ProgressBar from "./ProgressBar.vue";
import VueProgressBar from "vue-progressbar";

export default {
  components: { VueProgressBar },
  name: "StoriesComponent",
  props: {
    story: Object,
  },
  mounted() {
    this.$store.dispatch("getStories");
  },
  data() {
    return {
      stories: [
        "story 1",
        "story 2",
        "story 3",
        "story 4",
        "story 5",
        "story 6",
        "story 7",
        "story 8",
        "story 9",
        "story 10",
        "story 11",
        "story 12",
      ],
      // stories: ["story 1"],
      currentStoryIndex: 0,
      progress: 0,
      savedProgress: 0,
      resumeProgressBar: true,
      intervalIds: {},
      numSteps: 100,
      stepSize: 0.0025,
      intervalTime: 50,
    };
  },
  methods: {
    changeStory(index) {
      clearInterval(this.intervalIds[this.currentStoryIndex]);
      this.resumeProgressBar = true;
      this.currentStoryIndex = index;
      this.progress = 0;
      this.startProgress(index);
    },
    getClass(index) {
      if (index === 0 && this.currentStoryIndex === 0) {
        return "first-feature-story";
      } else if (index === 0 && this.currentStoryIndex === 1) {
        return "first-secondary-story";
      } else if (index === 1 && this.currentStoryIndex === 1) {
        return "second-feature-story";
      } else if (index === this.currentStoryIndex) {
        return "feature-story";
      } else if (this.currentStoryIndex - index > 2) {
        return "before-feature-story-hidden";
      } else if (index > this.currentStoryIndex) {
        return "secondary-story";
      } else if (index < this.currentStoryIndex) {
        return "before-feature-story";
      }
    },
    startProgress(index) {
      // if (Number.isInteger(this.progress)) {
      //   this.console.log(
      //     "INDEX",
      //     index,
      //     "currentIndex",
      //     this.currentStoryIndex,
      //     "PROGRES",
      //     this.progress
      //   );
      // }
      // const numSteps = 100; // Increase the number of steps
      // const stepSize = 0.005; // Decrease the step size
      // const intervalTime = 500; // Increase the interval time

      const intervalId = setInterval(() => {
        if (this.progress < this.numSteps && this.resumeProgressBar) {
          this.progress += this.stepSize;
        } else if (this.progress >= this.numSteps && this.resumeProgressBar) {
          clearInterval(intervalId);
          this.progress = 0;
          if (this.currentStoryIndex < this.stories.length - 1) {
            this.changeStory(this.currentStoryIndex + 1);
          }
        }
      }, this.intervalTime);
      this.intervalIds[index] = intervalId;
    },
    stopProgress(event) {
      event.stopPropagation();
      this.resumeProgressBar = !this.resumeProgressBar;
      if (!this.resumeProgressBar) {
        this.savedProgress = this.progress;
      } else {
        this.console.log("XYZZZZ", this.savedProgress);
        this.progress = this.savedProgress;
      }
    },
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-left: 0 auto;
  overflow: hidden;
}

.container-shift {
  display: flex;
  align-items: center;
  flex-direction: row;
  /* overflow-x: hidden; */
  transform: translateX(300px);
}

.transition {
  transition: all 0.5s ease;
}

.image {
  width: 300px;
  display: flex;
  align-items: center;
}

.first-feature-story {
  /* margin-left: 550px; */
  margin-left: 36em;
  height: 500px;
  width: 19em;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  transform: scale(1.2);
  color: white;
  transition: all 0.5s ease;
  flex-direction: column;
  background-color: white;
}

.first-secondary-story {
  /* margin-left: 300px; */
  margin-left: 17em;
  height: 400px;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  color: white;
  transition: all 0.5s ease;
}

.second-feature-story {
  height: 500px;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  transform: scale(1.2);
  color: white;
  transition: all 0.5s ease;
}

.feature-story {
  height: 500px;
  width: 19em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  transform: scale(1.2);
  color: white;
  transition: all 0.5s ease;
}

.secondary-story {
  height: 400px;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  color: white;
  transition: all 0.5s ease;
}

.before-feature-story {
  height: 400px;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  color: white;
  transition: all 0.5s ease;
}

.progress-bar {
  width: 90%;
  height: 3px;
  background-color: grey;
  border-radius: 10px;
  z-index: 100;
  margin-left: 1em;
}

.progress {
  height: 100%;
  background-color: white;
  border-radius: 30px;
}

@media (max-width: 1000px) {
  .first-feature-story {
    margin-left: 2em;
    height: 300px;
    width: 15em;
  }
  .first-secondary-story {
    margin-left: 2em;
    height: 300px;
    width: 13em;
  }
  .second-feature-story {
    height: 300px;
    width: 15em;
  }
  .feature-story {
    height: 300px;
    width: 15em;
  }
  .secondary-story {
    height: 250px;
    width: 13em;
  }
  .before-feature-story {
    height: 250px;
    width: 13em;
  }
}
</style>
