import { useState } from "react";
import { Grid, Paper, Typography, Box } from "@material-ui/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BiGridAlt } from "react-icons/bi";

import useStyles from "./style";
import { getLiveUserChartAPI } from "../utils/administrationAPIs";
import useCustomQuery from "../../common/utils/CustomQuery";

const UsersChart = ({ handleModalOpen }) => {
  const classes = useStyles();
  const [filteredAppCategories, setFilteredAppCategories] = useState([]);
  const [entries, setEntries] = useState(0);
  const [allAppCategories, setAllAppCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [toggleCover, setToggleCover] = useState(true);

  const activateToggle = () => {
    setToggleCover(false);
  };
  const deActivateToggle = () => {
    setToggleCover(true);
  };
  const onGetUserGraphSuccess = ({ data }) => {
    //console.log(data.data.graphData);
    let newUserData = data?.data?.graphData;
    newUserData = newUserData.slice(
      newUserData.length - 4,
      newUserData.length - 1
    );
    const modifyData = newUserData.map((data) => {
      data.quarter = `Q${data?.quarter}`;
      return data;
    });
    //console.log(modifyData);
    setTotalUsers(data?.data?.totalUser);
    setChartData(modifyData);
  };

  // useEffect(() => {
  //   console.log(chartData);
  // });

  const { isLoading, isFetching } = useCustomQuery({
    queryKey: "userGraph",
    apiFunc: getLiveUserChartAPI,
    onSuccess: onGetUserGraphSuccess,
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
        className={[classes.chartSection, classes.chartBorder1]}
        onMouseEnter={() => activateToggle()}
        onMouseLeave={() => deActivateToggle()}
      >
        {toggleCover && (
          <Box>
            <Box style={{ zIndex: 3 }} className={classes.chartCover}></Box>
            <Box style={{ zIndex: 5 }} className={classes.chartLabels}>
              <Box>
                <Typography variant="h4" className={classes.labelText}>
                  {totalUsers}
                </Typography>
                <Typography
                  className={classes.labelText}
                  variant="h6"
                  gutterBottom
                >
                  Total users
                </Typography>
              </Box>
              <Box className={classes.iconWrapper}>
                <BiGridAlt size={21} color="#F9FBFD" />
                {/* <CgProfile color={color} />; */}
              </Box>
            </Box>
          </Box>
        )}
        <Box style={{ position: "relative", cusor: "pointer" }}>
          <ResponsiveContainer width={"100%"} height={180}>
            <AreaChart
              data={chartData.length && chartData}
              margin={{ top: 15, right: 10, left: -30, bottom: 10 }}
            >
              <defs>
                <linearGradient id="512B58" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="26%" stopColor="#512B58" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#512B58" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              {/* <CartesianGrid /> */}

              {!toggleCover && (
                <>
                  <XAxis dataKey={chartData.length && `quarter`} />
                  <YAxis />
                </>
              )}
              <Tooltip />
              <Area
                dataKey={chartData.length && "total"}
                stackId="1"
                stroke="rgba(81, 43, 88, 1)"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#512B58)"
              />
              {/* <Area dataKey="y" stackId="1" stroke="blue" fill="blue" /> */}
            </AreaChart>
          </ResponsiveContainer>
          <Typography variant="body2" className={classes.body2}>
            Quarterly increase in users
          </Typography>
        </Box>
      </Paper>
    </Grid>
    // </Grid>
  );
};

export default UsersChart;
