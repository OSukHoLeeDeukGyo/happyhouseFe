<template>
  <b-tr>
    <b-td>{{ articleno }}</b-td>
    <b-th class="text-left">
      <router-link
        :to="{ name: 'qnaDetail', params: { articleno: articleno } }"
        >{{ subject }}</router-link
      >
    </b-th>
    <b-td v-if="this.reply"><b-img :src="require('@/assets/ans1.png')" /></b-td>
    <b-td v-else><b-img :src="require('@/assets/ans2.png')" /></b-td>
    <b-td>{{ userid }}</b-td>
    <b-td>{{ regtime | dateFormat }}</b-td>
    <b-td>{{ hit }}</b-td>
  </b-tr>
</template>

<script>
import moment from "moment";

export default {
  name: "QnaListItem",
  props: {
    articleno: Number,
    userid: String,
    subject: String,
    hit: Number,
    regtime: String,
    reply: String,
  },
  filters: {
    dateFormat(regtime) {
      return moment(new Date(regtime)).format("YY.MM.DD");
    },
  },
};
</script>

<style></style>
