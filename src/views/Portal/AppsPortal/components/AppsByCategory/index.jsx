import { Collapse, TablePagination, Typography } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowRight } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { MdAnalytics } from "react-icons/md";
import { Link } from "react-router-dom";
import { unprotectedUrls } from "../../../../common/utils/lists";

import { Skeleton } from "@mui/material";
import useGetUserPortalCustomisation from "../../../../SettingsLayout/Pages/Customizations/utils/useGetUserPortalCustomisation";
import { hexToRgba } from "../../../../SettingsLayout/Pages/Customizations/utils/customizationutils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const AppsByCategory = (props) => {
  const {
    classes,
    filteredAppsData,
    categoryAppsData,
    colors,
    isAppsLoading,
    perPage,
    pageNo,
    onPageChange,
    onRowsPerPageChange,
  } = props;
  const [categoryOpenStates, setCategoryOpenStates] = useState({});

  const { internalPage, brandTheme } = useGetUserPortalCustomisation();

  const internalPageTheme = internalPage?.isEnabled
    ? internalPage?.theme?.primaryColor
    : brandTheme ?? "#DE5439";

  useEffect(() => {
    if (filteredAppsData?.length) {
      const openStates = {};
      filteredAppsData?.forEach((category) => {
        openStates[category.name] = false;
      });
      setCategoryOpenStates(openStates);
    }
  }, [filteredAppsData]);

  const toggleCategory = (name) => {
    setCategoryOpenStates((prev) => {
      const newState = { ...prev };
      newState[name] = !prev[name];
      return newState;
    });
  };

  return (
    <div className={classes.rightSect}>
      <Typography
        style={{
          margin: "24px 24px 26px",
          fontSize: "16px",
          fontWeight: "800",
          color: "#292929",
        }}
        noWrap
      >
        All Categories
      </Typography>
      {isAppsLoading ? (
        <div
          style={{
            margin: "auto",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              width="90%"
              height="40px"
              data-testid="app-skeleton"
            />
          ))}
        </div>
      ) : (
        <div>
          {filteredAppsData?.length ? (
            <div>
              {filteredAppsData.map((category, index) => (
                <div key={category._id || index}>
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(category.name)}
                    style={{
                      width: "100%",
                      background: `${hexToRgba(internalPageTheme, 0.12)}`,
                      cursor: "pointer",
                      padding: "1px 6px 0px 27px",
                      height: "40px",
                      marginBottom: categoryOpenStates[category.name] ? 0 : 24,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        background: colors[index % colors.length].pri,
                      }}
                      className={classes.appsIcon}
                    >
                      <MdAnalytics
                        color={colors[index % colors.length].sec}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    <Typography
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        color: internalPageTheme,
                      }}
                    >
                      {category.name}
                    </Typography>
                    {categoryOpenStates[category.name] ? (
                      <KeyboardArrowDown
                        style={{ marginLeft: "auto", color: "#292929" }}
                      />
                    ) : (
                      <KeyboardArrowRight
                        style={{ marginLeft: "auto", color: "#292929" }}
                      />
                    )}
                  </div>

                  {/* Category Apps */}
                  <Collapse
                    in={categoryOpenStates[category.name]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div style={{ padding: "10px 30px" }}>
                      {category.apps?.map((app) => (
                        <div
                          key={app._id}
                          style={{
                            padding: "8px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: "3rem",
                          }}
                        >
                          <Link
                            style={{ textDecoration: "none" }}
                            to={`${unprotectedUrls.RUN}/${category?.account?.slug}/${app?.slug}`}
                            target="_blank"
                          >
                            <Typography
                              style={{
                                fontWeight: "500",
                                fontSize: "16px",
                                color: internalPageTheme,
                              }}
                              noWrap
                              className={classes.onHover}
                            >
                              {app.name}
                            </Typography>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </Collapse>
                </div>
              ))}
              {/* Pagination */}
              <div>
                {!!categoryAppsData?._meta?.pagination?.total_count && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      paddingRight: "0px",
                    }}
                  >
                    <TablePagination
                      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                      count={
                        categoryAppsData?._meta?.pagination?.total_count || 0
                      }
                      rowsPerPage={perPage}
                      page={pageNo}
                      onPageChange={(event, newPage) => onPageChange(newPage)}
                      onRowsPerPageChange={(event) =>
                        onRowsPerPageChange(
                          parseInt(event.target.value, ROWS_PER_PAGE_OPTIONS[1])
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h4
                style={{
                  width: "90%",
                  marginLeft: "5rem",
                  marginTop: "15%",
                  fontStyle: "italic",
                }}
              >
                No data found
              </h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppsByCategory;
