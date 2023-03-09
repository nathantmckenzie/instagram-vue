<template>
  <div class="container">
    {{ this.console.log("THIS.CURRENTSOTY", this.currentStoryIndex) }}
    <div v-for="(story, index) in stories" :key="index">
      <div @click="changeStory(index)" :class="getClass(index)">
        <div>{{ stories[index] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoriesComponent",
  props: {
    story: Object,
  },
  data() {
    return {
      stories: ["story 1", "story 2", "story 3", "story 4", "story 5", "story 6"],
      currentStoryIndex: 0,
    };
  },
  methods: {
    changeStory(index) {
      this.currentStoryIndex = index;
    },
    getClass(index) {
      if (index === 0 && this.currentStoryIndex === 0) {
        return "first-feature-story";
      } else if (index === 0 && this.currentStoryIndex === 1) {
        return "secondary-story";
      } else if (index === 1 && this.currentStoryIndex === 0) {
        return "secondary-story";
      } else if (index === 1 && this.currentStoryIndex === 1) {
        return "second-feature-story";
      } else if (index === 2 && this.currentStoryIndex !== 2) {
        return "secondary-story";
      } else if (index === 2 && this.currentStoryIndex === 2) {
        return "feature-story";
      } else if (index === this.currentStoryIndex) {
        return "feature-story";
      } else {
        return "secondary-story";
      }
    },
  },
  computed: {
    middleStoryIndex() {
      return Math.floor(this.currentStoryIndex / 3) * 3 + 1;
    },
    storyIndices() {
      const start = this.middleStoryIndex - 1;
      const end = start + 5;
      return Array.from({ length: end - start }, (_, i) => start + i);
    },
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  flex-direction: row;
  margin-left: 40px;
}

.story {
  height: 400px;
  width: 200px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
}

.first-feature-story {
  margin-left: 1000px;
  height: 500px;
  width: 300px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  transform: scale(1.2);
}

.second-feature-story {
  margin-left: 1000px;
  height: 500px;
  width: 300px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  transform: scale(1.2);
}

.feature-story {
  height: 500px;
  width: 300px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  transform: scale(1.2);
}

.middle-story {
  height: 500px;
  width: 420px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
  transform: scale(1.2);
}

.secondary-story {
  height: 400px;
  width: 200px;
  background-color: black;
  border-radius: 5%;
  margin-right: 50px;
}
</style>
