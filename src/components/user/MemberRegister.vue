<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>회원가입</h3></b-alert>
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
                @blur="idChk"
              />
              <p class="idchkmsg" v-if="user.userid && !idValidate">
                이미 존재하는 아이디입니다.
              </p>
            </b-form-group>
            <b-form-group label="비밀번호:" label-for="userpwd">
              <b-form-input
                type="password"
                id="userpwd"
                v-model="user.userpwd"
                required
                placeholder="비밀번호"
                @blur="pwdChk"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="비밀번호확인:" label-for="userpwdchk">
              <b-form-input
                type="password"
                id="userpwdchk"
                v-model="user.userpwdchk"
                required
                placeholder="비밀번호체크"
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
              @click="signUp"
              >회원가입</b-button
            >
            <b-button
              type="button"
              variant="success"
              class="m-1"
              @click="goHome"
              >로그인화면</b-button
            >
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import http from "@/api/http";
import { chkId } from "@/api/member";

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
      idValidate: true,
      pwdValidate: true,
    };
  },
  methods: {
    idChk() {
      if (!this.user.userid) return;
      chkId(
        this.user.userid,
        (response) => {
          console.log(response);
          if (response.data === "success") this.idValidate = false;
          else this.idValidate = true;
        },
        () => {},
      );
    },
    pwdChk() {
      console.log("작동!");
      if (this.user.userpwd === this.user.userpwdchk) this.pwdValidate = true;
      else this.pwdValidate = false;
    },
    signUp() {
      if (this.user.userid == "") {
        alert("아이디를 입력하세요.");
        return;
      }
      if (!this.idValidate) {
        alert("아이디를 확인하세요.");
        return;
      }
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
        .post("/user/signup", {
          userid: this.user.userid,
          userpwd: this.user.userpwd,
          username: this.user.username,
          email: this.user.email,
        })
        .then((response) => {
          if (response.data == "success") {
            alert("성공적으로 가입 하였습니다. 로그인 하십시오.");
            this.$router.push({ name: "signIn" });
          } else {
            alert("오류가 생겨 가입을 하지 못했습니다.");
            this.clearInput();
          }
        })
        .catch(() => {
          alert("오류가 생겨 가입을 하지 못했습니다.");
          this.visablelogin = false;
          this.submitted = false;
          this.clearInput();
        });
    },
    clearInput() {
      this.user.userid = "";
      this.user.userpwd = "";
      this.user.userpwdchk = "";
      this.user.username = "";
      this.user.email = "";
    },
    goHome() {
      this.$router.push({ name: "signIn" });
    },
  },
};
</script>

<style lang="scss" scoped>
.idchkmsg,
.pwdchkmsg {
  color: red;
}
</style>
