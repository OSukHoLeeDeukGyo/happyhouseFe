<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import { mapState } from "vuex";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";
//let chart;

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
);

export default {
  name: "LineChart",
  components: { LineChartGenerator },
  data() {
    return {
      loaded: false,
    };
  },

  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 200,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("houseStore", ["house", "housedeals"]),
    chartData() {
      let dealdates = [];
      this.housedeals.forEach((deal) => {
        dealdates.push(deal.dealYear + ". " + deal.dealMonth);
      });
      let dealamounts = [];
      this.housedeals.forEach((deal) => {
        dealamounts.push(
          parseInt(deal.dealAmount.replace(",", "")) / deal.area,
        );
      });
      //console.log(dealamounts);
      return {
        labels: dealdates,
        datasets: [
          {
            label: "총 거래 평당가격",
            data: dealamounts,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
      };
    },
  },
  watch: {},
  methods: {},
  async mounted() {},
};
</script>
