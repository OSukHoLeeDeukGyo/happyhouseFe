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
        dealdates.push(deal.dealYear + " . " + deal.dealMonth);
      });
      let dealamounts = [];
      this.housedeals.forEach((deal) => {
        dealamounts.push(parseInt(deal.dealAmount.replace(",", "")));
      });
      //console.log(dealamounts);
      return {
        labels: dealdates,
        datasets: [
          {
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
  watch: {
    /* housedeals: function () {
      this._chart.destroy();
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    },*/
    /*housedeals(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      this.createChart();
    },*/
  },
  methods: {
    /*createChart() {
      if (chart !== undefined) {
        chart.destroy();
      }
      chart = new ChartJS(this.$refs.barChart, {
        type: "bar",
        data: this.chartData,
        options: this.options,
      });

      let dealdates = [];
      this.housedeals.forEach((deal) => {
        dealdates.push(deal.dealYear + deal.dealMonth);
      });

      let dealamounts = [];
      this.housedeals.forEach((deal) => {
        dealamounts.push(parseInt(deal.dealAmount));
      });

      chart.data.labels = dealdates;
      chart.data.datasets[0].data[0] = dealamounts;
      //chart.data.datasets[0].data[1] = this.secondData;
      chart.update();
    },*/
  },
  async mounted() {
    /*this.$store.watch(this.$store.getters.getDeals, () => {
      this.createChart();
    });*/
    /*
    this.loaded = false;

    try {
      //const { deals } = await fetch("/api/userlist");
      let dealdates = [];
      this.housedeals.forEach((deal) => {
        dealdates.push(deal.dealYear + deal.dealMonth);
      });
      this.chartData.labels = dealdates;

      let dealamounts = [];
      this.housedeals.forEach((deal) => {
        dealamounts.push(parseInt(deal.dealAmount));
      });
      this.chartData.datasets[0].data = dealamounts;

      this.loaded = true;
    } catch (e) {
      console.error(e);
    }*/
  },
};
</script>
