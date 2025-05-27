import { CssBaseline, Tooltip } from "@material-ui/core";
import { useSelector } from "react-redux";
import ReactSpinnerTimer from "react-spinner-timer";
import { AddRounded } from "@material-ui/icons";

import ErrorBoundary from "../ProtectedRoute/ErrorBoundary";
import GeneralError from "../ProtectedRoute/components/GeneralError";
import AppLayout from ".";
import PageHeader from "./components/PageHeader";
import { handleRoleActionAccess } from "../../utils/userRoleEvaluation";

const MainPageLayout = ({
  headerTitle,
  pageTitle,
  pageSubtitle,
  categories,
  isNotMainPages,
  isLoading,
  handleChange,
  topBar,
  hideSearbar,
  hasGoBack,
  hideSubtitle,
  onAddNew,
  children,
}) => {
  const { user } = useSelector(({ auth }) => auth);

  return (
    <ErrorBoundary render={() => <GeneralError />}>
      <div>
        <CssBaseline />
        <AppLayout
          headerTitle={headerTitle}
          pageTitle={pageTitle}
          hideSearbar={hideSearbar}
        >
          <div className="main-page-layout-outer">
            <div
              className="main-page-layout-inner"
              style={{
                backgroundColor: isNotMainPages ? "#FFFFFF" : "#F4F8FF",
              }}
            >
              {/* <div
                style={{
                  marginBottom: 30,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography
                  style={{
                    marginRight: 10,
                    color: "#999999",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssessmentOutlinedIcon
                    style={{ color: "#0C7B93", fontSize: 24 }}
                    color="#0C7B93"
                    size={24}
                  />{" "}
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#424874",
                      paddingLeft: 10,
                    }}
                  >
                    Admin Dashboard
                  </span>{" "}
                </Typography>
                {(isFetching || isLoading) && (
                  <div className={classes.loading}>
                    Loading... please wait...
                    <img
                      src="../../../images/loading-anim.svg"
                      alt="Clone"
                      width={20}
                    />
                  </div>
                )}
              </div> */}
              <PageHeader
                pageTitle={pageTitle}
                pageSubtitle={pageSubtitle}
                categories={categories}
                hasGoBack={hasGoBack}
                hideSubtitle={hideSubtitle}
                topBar={topBar}
              />

              {/* here for the filter and search bar */}
              {/* <Grid
                  container
                  item
                  sm={12}
                  xs={12}
                  style={{ marginBottom: 30 }}
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Grid item md={6} sm={12} xs={12}>
                    <CustomizedSelects
                      title="Filter By:"
                      data={filterSelect}
                      doFilter={_doFilter}
                    />
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <CustomizedSelects
                      title="Sort By:"
                      data={filter2}
                      doFilter={_doFilter}
                    />
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <ActionSearchBar doFilter={_doFilter} />
                  </Grid>
                </Grid> */}

              {/* here for the main area and contents */}
              {children}
              {isLoading && (
                <div className="page-spinner-loader">
                  <ReactSpinnerTimer
                    timeInSeconds={3}
                    totalLaps={100}
                    isRefresh={false}
                    onLapInteraction={handleChange}
                  />
                </div>
              )}
            </div>
          </div>
        </AppLayout>

        {!!onAddNew &&
          handleRoleActionAccess({ pageTitle, headerTitle }, "POST") && (
            <>
              <Tooltip title={onAddNew?.tooltip}>
                <div
                  data-testid="createButton"
                  className="floatingCircularBtn"
                  onClick={onAddNew?.fn}
                >
                  <AddRounded style={{ fontSize: 34 }} />
                </div>
              </Tooltip>
              {onAddNew?.menu}
            </>
          )}
      </div>
    </ErrorBoundary>
  );
};

export default MainPageLayout;
