let width = window.innerWidth * 0.4;
let height = window.innerHeight;
let margin = { top: 20, bottom: 50, left: 60, right: 70 };

let state = {
  geojson: [],
  data: [],
  salary: null,
  fill: null,
};

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/jramadani/housing-data/master/data/zip-code-tabulation-area.json",
    d3.autotype
  ),
  d3.csv(
    "https://raw.githubusercontent.com/jramadani/housing-data/master/data/dataset.csv",
    d3.autotype
  ),
]).then(([geojson, data]) => {
  state.geojson = geojson;
  state.data = data;
  console.log(state.data);
  init();
});

function init() {
  // form building

  const enter = d3.select("#salgo").on("click", function () {
    state.salary = document.getElementById("salary").value;
    draw();
  });

  // MAP;
  const map = L.map("map").setView([45, -120], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let statesLayer = L.geoJson(state.geojson, {
    style: function (feature) {
      return {
        color: "black",
        weight: 0.1,
        // fillColor: state.fill,
        // // fillColor: fill[feature.properties.ZCTA5CE10],
        // fillOpacity: 0.7,
      };
    },
  }).addTo(map);

  // statesLayer.bindPopup((layer) => {
  //   return layer.feature.properties.ZCTA5CE10;
  // });
}

function draw() {
  let prices = [];
  state.data.forEach((d) => {
    let p = d.priceIndex * 0.2;
    let yp = (d.priceIndex - p) / 30;
    let fym = yp + p;
    if (state.salary * 0.3 - fym > 0) {
      return prices.push(d);
    }
  });
  console.log(prices);
  console.log(state.salary);
  // // REMEMBER TO FILTER FOR THE YEAR BEFORE ATTACHING THE FILTER TO THE MAP.
  let prices09 = prices.filter((d) => d.year == 2009);
  let prices19 = prices.filter((d) => d.year == 2019);
  console.log(prices19);

  // COLOR
  const color = d3
    .scaleSequential()
    .domain(d3.extent(prices19, (d) => d.priceIndex))
    .range(["#6ea5c6", "#494197"]);

  // REFACTOR THIS CODE -- FILL FOR MAP
  let fill = () => {
    return prices19.reduce((acc, d) => {
      const zip = `${d.regionName}`;
      acc[zip] = color(d.priceIndex);
      return acc;
    }, {});
  };

  //  MAP -- REDRAWN WITH COLOR LAYERS

  //CALCULATIONS FOR SUMMARY + INFO PANEL SETUP

  //on click of the map, set a global variable (state.zip) to a zip code

  //const filtered = state.zip.find((d) => d.zip == zip)

  function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
  }

  const avgarray = average(filtered.map((d) => d.priceIndex));
  console.log(avgarray);

  const summstats = d3.select("#summary");

  summstats
    .selectAll(".stats")
    .data()
    .join("div", (d) => {
      if (state.zip) {
        summstats.html(``);
      }
    });

  // LINE CHART CAN GO HERE--IT GETS DRAWN ON CLICK OF THE MAP.
  //statesLayer.click((layer) => {
  //     return linechart();
  //   })
}
