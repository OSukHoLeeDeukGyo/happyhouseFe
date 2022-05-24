<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>Q&A</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <!-- <b-col class="text-left">
        <input v-model="searchInput" />
        <b-button
          style="margin-left: 0.5rem"
          variant="outline-danger"
          type="submit"
          @click="searchQna"
          >검색</b-button
        >
      </b-col> -->
      <b-col class="text-right">
        <b-button variant="outline-primary" @click="moveWrite()"
          >글쓰기</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="articles.length">
        <b-table-simple hover responsive id="qna-list">
          <b-thead head-variant="dark">
            <b-tr>
              <b-th>글번호</b-th>
              <b-th>제목</b-th>
              <b-th>답변여부</b-th>
              <b-th>작성자</b-th>
              <b-th>작성일</b-th>
              <b-th>조회수</b-th>
            </b-tr>
          </b-thead>
          <tbody>
            <!-- 하위 component인 ListRow에 데이터 전달(props) -->
            <qna-list-item
              v-for="article in articles"
              :key="article.articleno"
              v-bind="article"
            />
          </tbody>
        </b-table-simple>
      </b-col>
      <b-col v-else class="text-center">
        <hr />
        작성된 Q&A가 없습니다.</b-col
      >
    </b-row>
  </b-container>
</template>

<script>
import { listArticle } from "@/api/qna.js";
import QnaListItem from "@/components/qna/item/QnaListItem";
import { mapState } from "vuex";
const memberStore = "memberStore";

export default {
  name: "QnaList",
  components: {
    QnaListItem,
  },
  data() {
    return {
      articles: [],
      isAdmin: false,
    };
  },
  created() {
    let param = {
      pg: 1,
      spp: 20,
      key: null,
      word: null,
    };
    listArticle(
      param,
      (response) => {
        this.articles = response.data;
      },
      (error) => {
        console.log(error);
      },
    );
    if (this.userInfo.userid === "admin") {
      this.isAdmin = true;
    }
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "qnaRegister" });
    },
  },
};
</script>

<style scope>
.tdClass {
  width: 50px;
  text-align: center;
}
.tdSubject {
  width: 300px;
  text-align: left;
}
</style>
