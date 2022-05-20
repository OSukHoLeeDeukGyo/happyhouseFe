<template>
  <b-container class="bv-example-row">
    <b-row class="mt-4 mb-4 text-center">
      <b-col>
        <todo-list-item
          v-for="(todo, index) in todos"
          :key="index"
          :todo="todo"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import TodoListItem from "@/components/todo/TodoListItem";

<<<<<<< HEAD
const todoStore = "todoStore";

=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
export default {
  name: "TodoList",
  components: {
    TodoListItem,
  },
  computed: {
    //   1.
    // todos() {
    //   return this.$store.state.todos;
    // },
    // 2.
    // ...mapState({
    //   todos: 'todos',
    // }),
    // 3.
<<<<<<< HEAD
    ...mapState(todoStore, ["todos"]),
=======
    ...mapState(["todos"]),
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
  },
};
</script>

<style></style>
