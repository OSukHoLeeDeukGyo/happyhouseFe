<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>회원삭제</h3></b-alert>
      </b-col>
    </b-row>
    <b-row> 정말 삭제하시겠습니까? 이 선택은 되돌릴 수 없습니다! </b-row>
    <b-row>
      <b-card class="text-center mt-3" style="max-width: 40rem" align="left">
        <b-button type="button" variant="primary" class="m-1" @click="goDelete"
          >삭제하기</b-button
        >
        <b-button type="button" variant="success" class="m-1" @click="goInfo"
          >돌아가기</b-button
        >
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import http from "@/api/http";
import { mapState, mapMutations } from "vuex";

const memberStore = "memberStore";

export default {
  name: "MemberDelete",
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    ...mapMutations(memberStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
    async goDelete() {
      await http.post(`/user/delete`, this.userInfo.userid);
      alert("삭제가 완료되었습니다.");
      this.SET_IS_LOGIN(false);
      this.SET_USER_INFO(null);
      sessionStorage.removeItem("access-token");
      if (this.$route.path != "/") this.$router.push({ name: "home" });
    },
    goInfo() {
      this.$router.push({ name: "mypage" });
    },
  },
};
</script>
