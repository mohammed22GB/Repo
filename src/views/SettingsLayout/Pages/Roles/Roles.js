import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Box,
  Typography,
} from "@material-ui/core";
import { Search, Cancel } from "@material-ui/icons";
import { withRouter, Link } from "react-router-dom";
// import { errorToastify, successToastify, } from "../../../../CommonCompnents/react_toastify/toastify";
// import { handleUserActions } from "../../../../utils/userServices";
import useStyles from "./components/style";
import SingleRole from "./components/SingleRole";
import ViewRolesModal from "./components/ViewRolesModal";
import { roleOptions } from "./utils";
import { useSelector } from "react-redux";

const SettingsRoles = ({ history }) => {
  const classes = useStyles();
  const [searchtext, setSearchtext] = React.useState();
  const [filters, setFilters] = useState({ status: "All", search: "" });
  const [formData, setFormData] = useState({});
  const [toggleRolesModal, setToggleRolesModal] = useState(false);
  const [roleIndex, setRoleIndex] = useState();
  const [rolePermissions, setRolePermissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  useEffect(() => {
    document.title = "Settings | Roles";
  }, []);

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const handleSearchChange = (input) => {
    const rows = !!input
      ? roleOptions?.filter((row) =>
          row?.name?.toLowerCase().includes(input.toLowerCase())
        )
      : roleOptions;
    setFilteredData(rows);
  };

  const doFilter = (filt) => {
    let filtr = { ...filters, ...filt };
    setFilters(filtr);
  };
  const handleOpenModal = (index) => {
    setRoleIndex(index);
    setToggleRolesModal(true);
  };
  const _handleModalDone = ({ data }) => {
    setToggleRolesModal(false);
    //   //addAppCategory({ data });
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        item
        direction="row"
        spacing={3}
        sm={12}
        xs={12}
        justifyContent="flex-end"
        // style={{ marginTop: 15 }}
      >
        <Grid item>
          {/* <FormControl>
            <Button
              variant="contained"
              classes={{
                root: classes.customInvertedButton,
                label: classes.customInvertedButtonLabel,
              }}
              // onClick={() => setIsRolePermissionsVisible(true)}
            >
              Change Permissions
            </Button>
          </FormControl> */}
        </Grid>
        {/* <Grid item xs={4} className={classes.asbActionButton}></Grid> */}
      </Grid>
      <Grid
        container
        style={{ marginTop: "1.8rem" }}
        item
        xs={12}
        sm={12}
        direction="row"
        spacing={3}
      >
        {filteredData.map((roleOption, index) => (
          <SingleRole
            //key={data.id}
            item={roleOption}
            handleOpenModal={() => handleOpenModal(index)}
            //deleteMe={() => _deleteMe(data.id)}
          />
        ))}
        {!filteredData?.length && (
          <div className={classes.noRecord}>
            <Typography>No running instance at the moment.</Typography>
          </div>
        )}
      </Grid>
      {toggleRolesModal && (
        <ViewRolesModal
          closeModal={_handleModalDone}
          roleDetails={roleOptions[roleIndex]}
        />
      )}
    </div>
  );
};

export default withRouter(SettingsRoles);
