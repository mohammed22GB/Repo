import React from "react";
import {
  Grid,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import { Search, Cancel } from "@material-ui/icons";
import useStyles from "./style";

export default function ActionsnSearchBar({ doFilter, showBtn, searchTerm }) {
  const classes = useStyles();

  return (
    <div style={{ width: "75%" }}>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item sm={12} xs={6} className={classes.asbSearchBar}>
          <FormControl
            variant="outlined"
            className={classes.asbForm}
            size="small"
            margin="none"
          >
            <OutlinedInput
              id="input-with-icon-adornment"
              value={searchTerm}
              placeholder="Enter search item here"
              onChange={(e) => doFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Search style={{ fontSize: 20, color: "#CCCCCC" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Cancel style={{ fontSize: 18, color: "#E7E9EE" }} />
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              labelWidth={0}
            />
          </FormControl>
          {/* <FormControl className={classes.margin}>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl> */}
        </Grid>
      </Grid>
    </div>
  );
}
