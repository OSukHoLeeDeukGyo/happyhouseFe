<template>
  <b-container v-if="houses && houses.length != 0" class="bv-example-row mt-3">
    <house-list-item
      v-for="(house, index) in houses"
      :key="index"
      :house="house"
    />
  </b-container>
  <b-container v-else class="bv-example-row mt-3">
    <b-row>
      <b-col><b-alert show>주택 목록이 없습니다.</b-alert></b-col>
    </b-row>
  </b-container>
</template>

<script>
import HouseListItem from "@/components/house/HouseListItem.vue";
import { mapState } from "vuex";

<<<<<<< HEAD
const houseStore = "houseStore";

=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
export default {
  name: "HouseList",
  components: {
    HouseListItem,
  },
  data() {
    return {};
  },
  computed: {
<<<<<<< HEAD
    ...mapState(houseStore, ["houses"]),
=======
    ...mapState(["houses"]),
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
};
</script>

<style></style>
