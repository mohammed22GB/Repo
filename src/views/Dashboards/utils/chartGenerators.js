import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import moment from "moment";
import { transform } from "lodash";

const extractValues = (obj) => {
  return Object.values(obj)[0];
};

export const generateChart = (
  anchor,
  ctype,
  chartData,
  lineGraphTimeUnit = ""
) => {
  setTimeout(() => {
    switch (ctype) {
      case "barchart":
        createBarChart(anchor, chartData);
        break;

      case "piechart":
        createPieChart(anchor, chartData);
        break;

      case "donutchart":
        createDonutChart(anchor, chartData);
        break;

      case "linegraph":
        createLineGraph(anchor, chartData, lineGraphTimeUnit);
        break;

      case "multiplelinegraph":
        createMultipleLineGraph(anchor, chartData, lineGraphTimeUnit);
        break;

      case "clusteredbarchart":
        createClusteredBarChart(anchor, chartData, lineGraphTimeUnit);
        break;
      case "clusteredcolumnchart":
        createClusteredColumnChart(anchor, chartData, lineGraphTimeUnit);
        break;

      case "bandguage":
        createBandGuage(anchor, chartData);
        break;

      case "solidguage":
        createSolidGuage(anchor, chartData);
        break;

      default:
        break;
    }
  }, 1000);
};

const createBarChart = (anchor, chartData) => {
  try {
    let root = am5.Root.new(anchor);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        // panY: false,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout,
      })
    );

    let data = chartData?.map((dat) => {
      return {
        category: dat.reference.split(" ")[0],
        value1: Number(dat.value),
        // value2: Number(dat.value),
      };
    });

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 0 });

    xRenderer.grid.template.setAll({
      location: 1,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.data.setAll(data || []);

    // Create series
    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );
    series1.data.setAll(data || []);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));
  } catch (error) {}
};

const createPieChart = (anchor, chartData) => {
  let root = am5.Root.new(anchor);

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
    })
  );

  let series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      endAngle: 270,
    })
  );

  series.states.create("hidden", {
    endAngle: -90,
  });

  let data = chartData?.map((dat) => {
    return {
      category: dat.reference,
      value: Number(dat.value),
    };
  });

  series.data.setAll(data || []);

  series.appear(1000, 100);
};

const createDonutChart = (anchor, chartData) => {
  let root = am5.Root.new(anchor);

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
      y: am5.percent(-10),
      innerRadius: am5.percent(50),
    })
  );

  // let legend = chart.children.push(
  //   am5.Legend.new(root, {
  //     centerX: am5.percent(50),
  //     x: am5.percent(50),
  //     y: am5.percent(99),
  //     layout: root.horizontalLayout,
  //   })
  // );

  let series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "reference",
      endAngle: 270,
    })
  );

  series.states.create("hidden", {
    endAngle: -90,
  });

  let data = chartData?.map((dat) => {
    return {
      category: dat.reference,
      value: Number(dat.value),
    };
  });

  series.data.setAll(data || []);

  //legend.data.setAll(series.dataItems);

  series.appear(1000, 100);
};

const createLineGraph = (anchor, chartData, lineGraphTimeUnit) => {
  // Create root element
  let root = am5.Root.new(anchor);

  // Set themes
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  // Add cursor
  let cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "none",
    })
  );
  cursor.lineY.set("visible", false);

  // Generate random data
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  let value = 100;

  // Create axes
  let xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: lineGraphTimeUnit?.toLowerCase(),
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // Add series
  let series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
      }),
    })
  );

  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
    })
  );

  let data = chartData?.map((dat) => {
    let datey = moment(dat.reference).valueOf();

    value = Math.round(Math.random() * 10 - 5 + value);
    let daya = Math.floor(Math.random() * 30);
    am5.time.add(date, "month", daya);

    return {
      date: datey,
      value: Number(dat.value),
    };
  });

  series.data.setAll(data || []);

  series.appear(1000);
  chart.appear(1000, 100);
};

const createMultipleLineGraph = (anchor, chartData, lineGraphTimeUnit) => {
  const transformData = chartData?.map((obj) => ({
    data: Object.values(obj)?.map((innerObj) => {
      return innerObj.map((innerArrObj) => {
        am5.time.add(new Date(innerArrObj?.reference), lineGraphTimeUnit, 1);
        return {
          reference: new Date(innerArrObj?.reference).getTime(),
          value: Number(innerArrObj?.value),
        };
      });
    }),
  }));

  let root = am5.Root.new(anchor);

  const myTheme = am5.Theme.new(root);

  myTheme.rule("AxisLabel", ["minor"]).setAll({
    dy: 1,
  });

  myTheme.rule("Grid", ["x"]).setAll({
    strokeOpacity: 0.05,
  });

  myTheme.rule("Grid", ["x", "minor"]).setAll({
    strokeOpacity: 0.05,
  });

  root.setThemes([am5themes_Animated.new(root), myTheme]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0,
      pinchZoomX: true,
    })
  );

  let xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: lineGraphTimeUnit,
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );
  for (let i = 0; i < transformData?.length; i++) {
    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series " + i,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "reference",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}",
        }),
      })
    );

    series.data.setAll(transformData?.[i]?.data[0]);

    series.appear();
  }

  let cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "none",
    })
  );
  cursor.lineY.set("visible", false);

  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
    })
  );

  chart.set(
    "scrollbarY",
    am5.Scrollbar.new(root, {
      orientation: "vertical",
    })
  );

  let legend = chart.rightAxesContainer.children.push(
    am5.Legend.new(root, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100),
    })
  );

  legend.itemContainers.template.events.on("pointerover", function (e) {
    let itemContainer = e.target;

    let series = itemContainer.dataItem.dataContext;

    chart.series.each(function (chartSeries) {
      if (chartSeries != series) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 0.15,
          stroke: am5.color(0x000000),
        });
      } else {
        chartSeries.strokes.template.setAll({
          strokeWidth: 3,
        });
      }
    });
  });

  legend.itemContainers.template.events.on("pointerout", function (e) {
    let itemContainer = e.target;
    let series = itemContainer.dataItem.dataContext;

    chart.series.each(function (chartSeries) {
      chartSeries.strokes.template.setAll({
        strokeOpacity: 1,
        strokeWidth: 1,
        stroke: chartSeries.get("fill"),
      });
    });
  });

  legend.itemContainers.template.set("width", am5.p100);
  legend.valueLabels.template.setAll({
    width: am5.p100,
    textAlign: "right",
  });

  legend.data.setAll(chart.series.values);

  chart.appear(1000, 100);
};

const createClusteredBarChart = (anchor, chartData) => {
  if (!chartData) return;
  const transformOutput = chartData?.map((item) => {
    const key = Object.keys(item)[0];
    const values = item[key];

    const result = { column: key };
    values?.forEach(({ reference, value }) => {
      result[reference] = Number(value);
    });

    return result;
  });

  let root = am5.Root.new(anchor);

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout,
    })
  );

  // Add legend
  let legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  // Create axes
  let xRenderer = am5xy.AxisRendererX.new(root, {
    cellStartLocation: 0.1,
    cellEndLocation: 0.9,
    minorGridEnabled: true,
  });

  let xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "column",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  xRenderer.grid.template.setAll({
    location: 1,
  });

  xAxis.data.setAll(transformOutput);

  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );

  function makeSeries(name, fieldName) {
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "column",
      })
    );

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}:{valueY}",
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
    });

    series.data.setAll(transformOutput);

    series.appear();

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: am5.Label.new(root, {
          text: "{valueY}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true,
        }),
      });
    });

    legend.data.push(series);
  }

  const { column, ...rest } = transformOutput[0];
  delete rest?.null;
  const newObjectProps = Object.keys(rest);

  newObjectProps.map((dat) => makeSeries(`${dat}`, `${dat}`));

  chart.appear(1000, 100);
};

const createClusteredColumnChart = (anchor, chartData) => {
  if (!chartData) return;
  const transformOutput = chartData?.map((item) => {
    const key = Object.keys(item)?.[0];
    const values = item?.[key];

    const result = { column: key };
    values.forEach(({ reference, value }) => {
      result[reference] = Number(value);
    });

    return result;
  });

  let root = am5.Root.new(anchor);

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout,
    })
  );

  let yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "column",
      renderer: am5xy.AxisRendererY.new(root, {
        inversed: true,
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
      }),
    })
  );

  yAxis.data.setAll(transformOutput);

  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1,
        minGridDistance: 50,
      }),
      min: 0,
    })
  );

  function createSeries(field, name) {
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: field,
        categoryYField: "column",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}[/]\n{categoryY}: {valueX}",
        }),
      })
    );

    series.columns.template.setAll({
      height: am5.p100,
      strokeOpacity: 0,
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        locationY: 0.5,
        sprite: am5.Label.new(root, {
          centerY: am5.p50,
          text: "{valueX}",
          populateText: true,
        }),
      });
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        locationY: 0.5,
        sprite: am5.Label.new(root, {
          centerX: am5.p100,
          centerY: am5.p50,
          text: "{name}",
          fill: am5.color(0xffffff),
          populateText: true,
        }),
      });
    });

    series.data.setAll(transformOutput);
    series.appear();

    return series;
  }

  const { column, ...rest } = transformOutput[0];
  delete rest?.null;
  const newObjectProps = Object.keys(rest);

  newObjectProps?.map((dat) => createSeries(`${dat}`, `${dat}`));

  let legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  legend.data.setAll(chart.series.values);

  let cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "zoomY",
    })
  );
  cursor.lineY.set("forceHidden", true);
  cursor.lineX.set("forceHidden", true);

  chart.appear(1000, 100);
};

const createBandGuage = (anchor, chartData) => {
  let root = am5.Root.new(anchor);
  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 160,
      endAngle: 380,
    })
  );

  let axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -40,
  });

  axisRenderer.grid.template.setAll({
    stroke: root.interfaceColors.get("background"),
    visible: true,
    strokeOpacity: 0.8,
  });

  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: -40,
      max: 100,
      strictMinMax: true,
      renderer: axisRenderer,
    })
  );

  let axisDataItem = xAxis.makeDataItem({});

  let clockHand = am5radar.ClockHand.new(root, {
    pinRadius: am5.percent(20),
    radius: am5.percent(100),
    bottomWidth: 40,
  });

  let bullet = axisDataItem.set(
    "bullet",
    am5xy.AxisBullet.new(root, {
      sprite: clockHand,
    })
  );

  xAxis.createAxisRange(axisDataItem);

  let label = chart.radarContainer.children.push(
    am5.Label.new(root, {
      fill: am5.color(0xffffff),
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "3em",
    })
  );

  axisDataItem.set("value", 50);
  bullet.get("sprite").on("rotation", function () {
    let value = axisDataItem.get("value");
    let text = Math.round(axisDataItem.get("value")).toString();
    let fill = am5.color(0x000000);
    xAxis.axisRanges.each(function (axisRange) {
      if (
        value >= axisRange.get("value") &&
        value <= axisRange.get("endValue")
      ) {
        fill = axisRange.get("axisFill").get("fill");
      }
    });

    label.set("text", Math.round(value).toString());

    clockHand.pin.animate({
      key: "fill",
      to: fill,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
    clockHand.hand.animate({
      key: "fill",
      to: fill,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
  });

  setInterval(function () {
    axisDataItem.animate({
      key: "value",
      to: Math.round(Math.random() * 140 - 40),
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
  }, 2000);

  chart.bulletsContainer.set("mask", undefined);

  let bandsData = [
    {
      title: "Unsustainable",
      color: "#ee1f25",
      lowScore: -40,
      highScore: -20,
    },
    {
      title: "Volatile",
      color: "#f04922",
      lowScore: -20,
      highScore: 0,
    },
    {
      title: "Foundational",
      color: "#fdae19",
      lowScore: 0,
      highScore: 20,
    },
    {
      title: "Developing",
      color: "#f3eb0c",
      lowScore: 20,
      highScore: 40,
    },
    {
      title: "Maturing",
      color: "#b0d136",
      lowScore: 40,
      highScore: 60,
    },
    {
      title: "Sustainable",
      color: "#54b947",
      lowScore: 60,
      highScore: 80,
    },
    {
      title: "High Performing",
      color: "#0f9747",
      lowScore: 80,
      highScore: 100,
    },
  ];

  am5.array.each(bandsData, function (data) {
    let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

    axisRange.setAll({
      value: data.lowScore,
      endValue: data.highScore,
    });

    axisRange.get("axisFill").setAll({
      visible: true,
      fill: am5.color(data.color),
      fillOpacity: 0.8,
    });

    axisRange.get("label").setAll({
      text: data.title,
      inside: true,
      radius: 15,
      fontSize: "0.9em",
      fill: root.interfaceColors.get("background"),
    });
  });

  chart.appear(1000, 100);
};

const createSolidGuage = (anchor, chartData) => {
  let root = am5.Root.new(anchor);
  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      innerRadius: am5.percent(20),
      startAngle: -90,
      endAngle: 180,
    })
  );

  let data = [
    {
      category: "Research",
      value: 80,
      full: 100,
      columnSettings: {
        fill: chart.get("colors").getIndex(0),
      },
    },
    {
      category: "Marketing",
      value: 35,
      full: 100,
      columnSettings: {
        fill: chart.get("colors").getIndex(1),
      },
    },
    {
      category: "Distribution",
      value: 92,
      full: 100,
      columnSettings: {
        fill: chart.get("colors").getIndex(2),
      },
    },
    {
      category: "Human Resources",
      value: 68,
      full: 100,
      columnSettings: {
        fill: chart.get("colors").getIndex(3),
      },
    },
  ];

  let cursor = chart.set(
    "cursor",
    am5radar.RadarCursor.new(root, {
      behavior: "zoomX",
    })
  );

  cursor.lineY.set("visible", false);

  let xRenderer = am5radar.AxisRendererCircular.new(root, {
    //minGridDistance: 50
  });

  xRenderer.labels.template.setAll({
    radius: 10,
  });

  xRenderer.grid.template.setAll({
    forceHidden: true,
  });

  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  let yRenderer = am5radar.AxisRendererRadial.new(root, {
    minGridDistance: 20,
  });

  yRenderer.labels.template.setAll({
    centerX: am5.p100,
    fontWeight: "500",
    fontSize: 18,
    templateField: "columnSettings",
  });

  yRenderer.grid.template.setAll({
    forceHidden: true,
  });

  let yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer,
    })
  );

  yAxis.data.setAll(data || []);

  let series1 = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "full",
      categoryYField: "category",
      fill: root.interfaceColors.get("alternativeBackground"),
    })
  );

  series1.columns.template.setAll({
    width: am5.p100,
    fillOpacity: 0.08,
    strokeOpacity: 0,
    cornerRadius: 20,
  });

  series1.data.setAll(data || []);

  let series2 = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "value",
      categoryYField: "category",
    })
  );

  series2.columns.template.setAll({
    width: am5.p100,
    strokeOpacity: 0,
    tooltipText: "{category}: {valueX}%",
    cornerRadius: 20,
    templateField: "columnSettings",
  });

  series2.data.setAll(data || []);

  series1.appear(1000);
  series2.appear(1000);
  chart.appear(1000, 100);
};
