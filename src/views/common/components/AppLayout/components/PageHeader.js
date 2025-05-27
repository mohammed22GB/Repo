import { useHistory } from "react-router-dom";
import FilterBar from "../../ItemSelectFilter/ItemSelectFilter";
import { ArrowBack /*ArrowBackIosRounded*/ } from "@material-ui/icons";
import { IconButton, Typography } from "@material-ui/core";

const PageHeader = ({
  pageTitle,
  pageSubtitle,
  hideSubtitle,
  categories,
  hasGoBack,
  topBar,
}) => {
  const history = useHistory();

  return (
    <div
      style={{
        margin: "25px 0px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 45,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#535353",
            whiteSpace: "nowrap",
          }}
        >
          {hasGoBack && (
            <>
              {/* <div
              style={{ cursor: "pointer", display: "inline-block" }}
              onClick={() => history.goBack()}
            >
              <ArrowBack />
            </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  // className={classes.dataIcon}
                  // onClick={() => history.push("/dashboards")}
                  onClick={() => history.goBack()}
                >
                  <ArrowBack fontSize="small" style={{ fontSize: 18 }} />
                </IconButton>
                <Typography
                  style={{ fontSize: 12, cursor: "pointer", fontWeight: 500 }}
                  onClick={() => history.goBack()}
                >
                  Back
                </Typography>
              </div>
            </>
          )}{" "}
          {pageTitle}
        </div>

        <div>
          {!hideSubtitle && (
            <div style={{ fontSize: 12, color: "#535353" }}>{pageSubtitle}</div>
          )}
        </div>
      </div>
      {
        topBar || null /* (
        <FilterBar
          // category={paging?.[appsControlMode]?.currentCategory}
          filterOptions={[
            ["All", "All categories"],
            ...(categories || [])?.map((category) => [
              category.id,
              category.name,
            ]),
          ]}
        />
      ) */
      }
    </div>
  );
};

export default PageHeader;
