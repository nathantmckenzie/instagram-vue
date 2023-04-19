<template>
  <div class="container">
    <div v-for="(story, index) of this.$store.state.stories" :key="index">
      <div
        @click.stop.prevent="changeStory(index)"
        :class="getClass(index)"
        v-if="this.currentStoryIndex - index < 3"
      >
        {{ this.resumeProgressBar ? startProgress(index) : null }}
        <div v-if="index === this.currentStoryIndex">
          <div class="progress-bar">
            <div
              class="progress"
              :style="{
                width: resumeProgressBar ? progress + '%' : savedProgress + '%',
              }"
            ></div>
          </div>
          <div class="top-row">
            <div class="profile-name">
              <img :src="story.user.profile_picture" class="profile_picture" />
              <span @click="getProfile(story.user.id)">{{ story.user.name }}</span>
              <span class="timestamp">{{
                timeSinceCommentWasPosted(story.timestamp)
              }}</span>
            </div>
            <div @click="stopProgress">
              <img
                v-if="resumeProgressBar"
                src="./pause-symbol.png"
                width="20"
                alt="Pause Symbol"
              />
              <img
                v-else-if="!resumeProgressBar"
                src="./play-symbol.png"
                width="20"
                alt="Play Symbol"
              />
            </div>
          </div>
        </div>
        <img
          v-if="this.currentStoryIndex - index < 3"
          :src="story.content"
          class="image"
        />
        <!-- <div>{{ story }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import VueProgressBar from "vue-progressbar";
import PlaySVG from "./play-svg.svg";

export default {
  components: { VueProgressBar, PlaySVG },
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
      stepSize: 0.0005,
      intervalTime: 50,
      PlaySymbol: "./play-svg.svg",
    };
  },
  methods: {
    changeStory(index) {
      if (index !== this.currentStoryIndex) {
        clearInterval(this.intervalIds[this.currentStoryIndex]);
        this.resumeProgressBar = true;
        this.currentStoryIndex = index;
        this.progress = 0;
        this.startProgress(index);
      }
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
        this.progress = this.savedProgress;
      }
    },
    returnToPreviousPage() {
      this.$router.go(-1);
    },
    timeSinceCommentWasPosted(time) {
      // Create a new date object from the timestamp in GMT
      const gmtDate = new Date(time);

      // Get the timezone offset for the PST timezone
      const pstOffset = -8 * 60; // PST is 8 hours behind GMT

      // Convert the timestamp from GMT to PST by subtracting the timezone offset
      const pstTimestamp = gmtDate.getTime() + pstOffset * 60 * 1000;

      const diffMs = new Date() - new Date(pstTimestamp);

      // Calculate the difference in seconds, minutes, hours, days, and weeks
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

      if (diffSecs <= 1) {
        return "Now";
      } else if (diffSecs > 1 && diffSecs <= 59) {
        return `${diffSecs}s`;
      } else if (diffSecs > 59 && diffMins <= 59) {
        return `${diffMins}m`;
      } else if (diffMins > 59 && diffHours <= 23) {
        return `${diffHours}h`;
      } else if (diffHours > 23 && diffDays <= 6) {
        return `${diffDays}d`;
      } else if (diffDays > 6) {
        return `${diffWeeks}w`;
      }
    },
    getProfile(userID) {
      //redirect user to /profile/:userID route
      this.$store.dispatch("getTargetUserFollowerMap", userID);
      this.$store.dispatch("getProfileData", userID).then(() => {
        this.$nextTick(() => {
          this.$router.push({ name: "profile", params: { userID } });
        });
      });
      // axios.get(`http://localhost:7002/profile/${userID}`).then((res) => {
      // this.$nextTick(() => {
      //   this.$router.push({ name: "profile", params: { userID: 1 } });
      // });
    },
  },
  computed: {
    console: () => console,
    window: () => window,
    allStoriesLooped() {
      return this.currentStoryIndex === this.$store.state.stories.length;
    },
  },
  watch: {
    allStoriesLooped(newValue) {
      if (newValue) {
        this.returnToPreviousPage();
      }
    },
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

.profile_picture {
  width: 25px;
  border-radius: 50%;
  margin-right: 5px;
}

.image {
  width: 100%;
  display: flex;
  align-items: center;
}

.top-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.timestamp {
  margin-left: 5px;
}

.profile-name {
  display: flex;
  align-items: center;
}

.first-feature-story {
  /* margin-left: 550px; */
  margin-left: 36em;
  height: 30em;
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
  height: 26em;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  color: white;
  transition: all 0.5s ease;
}

.second-feature-story {
  height: 30em;
  width: 19em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  transform: scale(1.2);
  color: white;
  transition: all 0.5s ease;
}

.feature-story {
  height: 30em;
  width: 19em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  transform: scale(1.2);
  color: white;
  transition: all 0.5s ease;
}

.secondary-story {
  height: 26em;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 3em;
  color: white;
  transition: all 0.5s ease;
}

.before-feature-story {
  height: 26em;
  width: 16em;
  background-color: black;
  border-radius: 5%;
  margin-right: 5em;
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
    height: 25em;
    width: 15em;
  }
  .first-secondary-story {
    margin-left: 2em;
    height: 20em;
    width: 13em;
  }
  .second-feature-story {
    height: 25em;
    width: 15em;
  }
  .feature-story {
    height: 25em;
    width: 15em;
  }
  .secondary-story {
    height: 20em;
    width: 13em;
  }
  .before-feature-story {
    height: 20em;
    width: 13em;
  }
}
</style>
