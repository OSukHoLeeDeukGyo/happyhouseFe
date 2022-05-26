<template>
  <b-container class="bv-example-row mt-3">
    <qna-input-item type="register" />
  </b-container>
</template>

<script>
import QnaInputItem from "@/components/qna/item/QnaInputItem.vue";

export default {
  name: "QnaWrite",
  components: {
    QnaInputItem,
  },
};
</script>

<style></style>
