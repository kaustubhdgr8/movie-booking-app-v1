<template>
  <div>
    <b-alert show variant="primary" fade v-if="showHelpMsg">Please select a show to see the available seats</b-alert>
    <div class="row">
      <div
        class="col-sm-12 col-md-4"
        v-for="(show, index) in showsList"
        :key="index"
        @click="viewSeats(index)"
      >
        <b-card
          img-top
          tag="article"
          class="mb-2"
          :img-src="show.img"
          :img-alt="show.title + ' poster'"
          :title="show.name"
          :class="{'active-show': selectedShow === index}"
        >
          <b-card-text>{{show.desc}}</b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import Shows from '../assets/shows.json';

export default {
  data() {
    return {
      showsList: Shows,
      selectedShow: null,
      showHelpMsg: true
    };
  },
  methods: {
    viewSeats(showIndex) {
      this.showHelpMsg = false;
      this.selectedShow = showIndex;
      this.$emit("showSeats", showIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
  $primaryBorderColor: #007bff;
  $primaryBgColor: #cce5ff;
  $primaryTextColor: #004085;

  article {
    cursor: pointer;
  }
  .active-show {
    border: 1px solid $primaryBorderColor;
    background-color: $primaryBgColor;
    color: $primaryTextColor;

    &::after, &::before {
      top: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    &::after {
      border-top-color: $primaryBgColor;
      border-width: 30px;
      margin-left: -30px;
    }

    &::before {
      border-top-color: $primaryBorderColor;
      border-width: 31px;
      margin-left: -31px;
    }
  }
</style>