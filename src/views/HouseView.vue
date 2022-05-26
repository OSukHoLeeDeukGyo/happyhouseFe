<template>
  <div class="maparea">
    <house-map></house-map>
    <!-- <b-row>
      <b-col>
        <house-search-bar></house-search-bar>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" align="left">
        <house-list />
      </b-col>
      <b-col cols="6">
        <house-detail />
      </b-col>
    </b-row>-->
  </div>
</template>
<script>
//import HouseSearchBar from "@/components/house/HouseSearchBar.vue";
//import HouseList from "@/components/house/HouseList.vue";
//import HouseDetail from "@/components/house/HouseDetail.vue";
import HouseMap from "@/components/house/HouseMap.vue";
export default {
  name: "HouseView",
  components: {
    //HouseSearchBar,
    // HouseList,
    // HouseDetail,
    HouseMap,
  },
};
</script>
<style scoped>
.underline-orange {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(231, 149, 27, 0.3) 30%
  );
}
.maparea {
  width: 100%;
  height: 90%;
}
</style>
