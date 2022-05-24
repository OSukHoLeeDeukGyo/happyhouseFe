<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>회원정보수정</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <b-card class="text-center mt-3" style="max-width: 40rem" align="left">
          <b-form class="text-left">
            <b-form-group label="아이디:" label-for="userid">
              <b-form-input
                id="userid"
                v-model="user.userid"
                required
                placeholder="아이디"
                readonly
              />
            </b-form-group>
            <b-form-group label="새로운 비밀번호:" label-for="userpwd">
              <b-form-input
                type="password"
                id="userpwd"
                v-model="user.userpwd"
                required
                placeholder="새로운 비밀번호"
                @blur="pwdChk"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="새로운 비밀번호 확인:" label-for="userpwdchk">
              <b-form-input
                type="password"
                id="userpwdchk"
                v-model="user.userpwdchk"
                required
                placeholder="비밀번호 확인"
                @blur="pwdChk"
              ></b-form-input>
              <p class="pwdchkmsg" v-if="user.userpwdchk && !pwdValidate">
                비밀번호가 일치하지 않습니다.
              </p>
            </b-form-group>
            <b-form-group label="이름:" label-for="username">
              <b-form-input
                type="text"
                id="username"
                v-model="user.username"
                required
                placeholder="이름"
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="이메일:" label-for="email">
              <b-form-input
                type="text"
                id="email"
                v-model="user.email"
                required
                placeholder="이름"
                @keyup.enter="confirm"
              ></b-form-input>
            </b-form-group>
            <b-button
              type="button"
              variant="primary"
              class="m-1"
              @click="goModify"
              >정보수정</b-button
            >
            <b-button
              type="button"
              variant="success"
              class="m-1"
              @click="goInfo"
              >돌아가기</b-button
            >
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import http from "@/api/http";
import { mapState, mapActions } from "vuex";

const memberStore = "memberStore";

export default {
  name: "MemberRegister",
  data() {
    return {
      user: {
        userid: "",
        userpwd: "",
        userpwdchk: "",
        username: "",
        email: "",
      },
      pwdValidate: true,
    };
  },
  created() {
    this.user.userid = this.userInfo.userid;
    this.user.username = this.userInfo.username;
    this.user.email = this.userInfo.email;
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["setUserInfo"]),
    pwdChk() {
      if (this.user.userpwd === this.user.userpwdchk) this.pwdValidate = true;
      else this.pwdValidate = false;
    },
    goModify() {
      console.log(this.user);
      if (this.user.userpwd == "") {
        alert("비밀번호를 입력하세요.");
        return;
      }
      if (this.user.userpwdchk == "") {
        alert("비밀번호를 한번 더 입력하세요.");
        return;
      }
      if (!this.pwdValidate) {
        alert("입력한 패스워드가 일치하지 않습니다.");
        return;
      }
      if (this.user.username == "") {
        alert("이름을 입력하세요.");
        return;
      }
      if (this.user.email == "") {
        alert("이메일을 입력하세요.");
        return;
      }

      http
        .put("/user/update", {
          userid: this.user.userid,
          userpwd: this.user.userpwd,
          username: this.user.username,
          email: this.user.email,
        })
        .then((response) => {
          if (response.data == "success") {
            this.setUserInfo({
              ...this.userInfo,
              username: this.user.username,
              email: this.user.email,
            });
            alert("성공적으로 개인정보를 수정했습니다.");
            this.$router.push({ name: "mypage" });
          } else {
            alert("오류가 생겨 정보수정에 실패했습니다. 다시 시도해보세요!");
            this.clearInput();
          }
        })
        .catch(() => {
          alert("오류가 생겨 정보수정에 실패했습니다. 다시 시도해보세요!");
          this.clearInput();
        });
    },
    clearInput() {
      this.user.userid = this.userInfo.userid;
      this.user.username = this.userInfo.username;
      this.user.email = this.userInfo.email;
      this.user.userpwd = "";
      this.user.userpwdchk = "";
    },
    goInfo() {
      this.$router.push({ name: "mypage" });
    },
  },
};
</script>

<style lang="scss" scoped>
.pwdchkmsg {
  color: red;
}
</style>
