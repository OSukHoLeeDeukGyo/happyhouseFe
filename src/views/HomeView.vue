<template>
  <b-container class="bv-example-row mt-3 text-center">
    <h3 class="underline-steelblue main-name">
      <b-icon icon="house"></b-icon> HOME
    </h3>
    <b-row>
      <b-col cols="6">
        <b-jumbotron
          bg-variant="muted"
          text-variant="dark"
          border-variant="dark"
        >
          <h3 style="font-weight: 600">실시간 부동산 뉴스</h3>
          <hr class="my-4" />

          <h5 style="font-weight: 600">{{ news[0] }}</h5>
          <p>{{ news[1] }}</p>

          <hr class="my-4" />

          <h5 style="font-weight: 600">{{ news[2] }}</h5>
          <p>{{ news[3] }}</p>

          <hr class="my-4" />

          <h5 style="font-weight: 600">{{ news[4] }}</h5>
          <p>{{ news[5] }}</p>
        </b-jumbotron>
      </b-col>
      <b-col cols="6" class="ad">
        <b-img :src="require('@/assets/Frame1.png')" />
        <b-img :src="require('@/assets/Frame2.png')" />
        <b-img :src="require('@/assets/Frame3.png')" />
        <b-img :src="require('@/assets/Frame4.png')" />
        <b-img :src="require('@/assets/Frame5.png')" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import http from "@/api/http";
export default {
  name: "HomeView",
  props: {
    msg: String,
  },
  data() {
    return {
      news: [],
    };
  },
  created() {
    http.get("/home/news").then(({ data }) => {
      this.news = data;
      console.log(data);
    });
  },
};
</script>

<style scoped>
.underline-steelblue {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(72, 190, 233, 0.3) 30%
  );
}

.main-name {
  margin-bottom: 2rem;
}

.ad * {
  width: 600px;
  margin-bottom: 2rem;
}
</style>
