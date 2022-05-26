<template>
  <b-container class="bv-example-row mt-3 text-center">
    <h3 class="underline-orange">
      <b-icon icon="building"></b-icon> Amenity Service
    </h3>
    <b-row>
      <AmenityMap />
    </b-row>
  </b-container>
</template>

<script>
import AmenityMap from "@/components/amenity/AmenityMap.vue";
export default {
  name: "AmenityView",
  components: {
    AmenityMap,
  },
};
</script>

<style scoped>
.underline-orange {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 192, 91, 0.3) 30%
  );
}
</style>
