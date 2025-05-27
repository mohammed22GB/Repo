import { useState } from "react";
import { Grid, Paper, Typography, Box } from "@material-ui/core";
import useStyles from "./style";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CgProfile } from "react-icons/cg";

import { getLiveAppChartAPI } from "../utils/administrationAPIs";
import useCustomQuery from "../../common/utils/CustomQuery";

const Chart = ({ handleModalOpen }) => {
  const classes = useStyles();
  const [filteredAppCategories, setFilteredAppCategories] = useState([]);
  const [totalApps, setTotalApps] = useState(0);
  const [allAppCategories, setAllAppCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [toggleCover, setToggleCover] = useState(true);

  const activateToggle = () => {
    setToggleCover(false);
  };
  const deActivateToggle = () => {
    setToggleCover(true);
  };
  const onGetAppGraphSuccess = ({ data }) => {
    //console.log(data.data);
    const monthsArr = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let newAppData = data?.data?.graphData;
    const modifyData = newAppData?.map((data) => {
      data.month = monthsArr[data?.month]?.substring(0, 3);
      return data;
    });
    //console.log(modifyData);
    setTotalApps(data?.data?.totalLiveApps);
    setChartData(modifyData);
  };

  // useEffect(() => {
  //   console.log(chartData);
  // });
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: "appGraph",
    apiFunc: getLiveAppChartAPI,
    onSuccess: onGetAppGraphSuccess,
  });

  return (
    // <Grid
    //   container
    //   item
    //   sm={12}
    //   xs={12}
    //   //justifyContent="flex-start"
    //   className={classes.topMargin0}
    // >
    <Grid container item sm={3} xs={3}>
      <Paper
        elevation={3}
        className={[classes.chartSection, classes.chartBorder2]}
        onMouseEnter={() => activateToggle()}
        onMouseLeave={() => deActivateToggle()}
      >
        {toggleCover && (
          <Box>
            <Box style={{ zIndex: 2 }} className={classes.chartCover}></Box>
            <Box style={{ zIndex: 3 }} className={classes.chartLabels}>
              <Box>
                <Typography variant="h4" className={classes.labelText2}>
                  {totalApps}
                </Typography>
                <Typography
                  className={classes.labelText2}
                  variant="h6"
                  gutterBottom
                >
                  Total apps
                </Typography>
              </Box>
              <Box className={classes.iconWrapper2}>
                <CgProfile size={21} color="white" />
              </Box>
            </Box>
          </Box>
        )}
        <Box style={{ position: "relative", cusor: "pointer" }}>
          <ResponsiveContainer width={"100%"} height={180}>
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 7, left: -35, bottom: 10 }}
            >
              <defs>
                <linearGradient id="0c7b93" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="26%" stopColor="#0c7b93" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0c7b93" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              {/* <CartesianGrid /> */}

              {!toggleCover && (
                <>
                  <XAxis dataKey="month" />
                  <YAxis />
                </>
              )}
              <Tooltip />
              <Area
                dataKey="total"
                stackId="1"
                stroke="#0c7b93"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#0c7b93)"
              />
              {/* <Area dataKey="y" stackId="1" stroke="blue" fill="blue" /> */}
            </AreaChart>
          </ResponsiveContainer>
          <Typography variant="body2" className={classes.body2}>
            Monthly increase in apps
          </Typography>
        </Box>
      </Paper>
    </Grid>
    // </Grid>
  );
};

export default Chart;
