<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>글목록</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-left">
        <input v-model="searchInput" />
        <b-button
          style="margin-left: 0.5rem"
          variant="outline-danger"
          type="submit"
          @click="searchQna"
          >검색</b-button
        >
      </b-col>
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
              <b-th>조회수</b-th>
              <b-th>작성자</b-th>
              <b-th>작성일</b-th>
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
      <!-- <b-col v-else class="text-center">도서 목록이 없습니다.</b-col> -->
    </b-row>
    <b-row>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalItemsCnt"
        :per-page="perPage"
        aria-controls="qna-list"
      ></b-pagination>
    </b-row>
  </b-container>
</template>

<script>
import http from "@/api/http";
import QnaListItem from "@/components/qna/item/QnaListItem";

export default {
  name: "QnaList",
  components: {
    QnaListItem,
  },
  data() {
    return {
      articles: [],
      searchInput: "",
      perPage: 10,
      currentPage: 1,
      totalItemsCnt: 0,
    };
  },
  created() {
    http.get(`/qna`).then(({ data }) => {
      this.totalItemsCnt = data;
      console.log(data);
    });
    http.get(`/qna/1`).then(({ data }) => {
      this.articles = data;
    });
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "qnaRegister" });
    },

    searchQna() {
      http.get(`/qna/search/${this.searchInput}`).then(({ data }) => {
        this.articles = data;
      });
    },
  },
  watch: {
    currentPage(newPage) {
      http.get(`/qna/${newPage}`).then(({ data }) => {
        this.articles = data;
      });
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
