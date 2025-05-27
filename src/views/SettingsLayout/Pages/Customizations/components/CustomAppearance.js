import useStyles from "./style";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import { Typography } from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ColorPicker from "../../../../common/components/ColorPicker";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import FileUpload from "../../../../EditorLayout/Pages/UIEditor/components/actualObjects/FileUpload";
import { APP_DESIGN_MODES } from "../../../../common/utils/constants";
import { uploadFile } from "../../../../common/helpers/LiveData";
import {
  DEFAULT,
  defaultBrandColor,
  hexToRgba,
} from "../utils/customizationutils";
import { v4 } from "uuid";
import { useEffect, useRef, useState } from "react";

const CustomAppearance = ({ logo, theme, userAccountId, handleUpdate }) => {
  const classes = useStyles();
  const [appearanceBrandLogo, setAppearanceBrandLogo] = useState("");
  const [appearanceBrandColor, setAppearanceBrandColor] = useState("");

  useEffect(() => {
    setAppearanceBrandLogo(logo?.imageUrl ?? DEFAULT.LOGO);
    setAppearanceBrandColor(theme?.primaryColor ?? DEFAULT.COLOR);
  }, [theme, logo]);

  const logoRef = useRef(logo?.imageUrl);
  return (
    <>
      <Accordion
        style={{ borderRadius: "10px" }}
        data-testid="customise-appearance"
      >
        <AccordionSummary
          expandIcon={
            <ArrowDropDownRoundedIcon fontSize="large" htmlColor="#000000" />
          }
          aria-controls="custom-appearance-panel1a-content"
          id="custom-appearance-panel1a-header"
        >
          <Typography className={classes.heading}>
            Customise Appearance
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className={classes.subHeading}>
            Change how your organisation interface looks and feels
          </Typography>
          <Divider />
          <div className={classes.accordionAppearanceContent}>
            <div>
              <Typography className={classes.mainText} gutterBottom>
                Logo
              </Typography>
              <Typography className={classes.subText}>
                Change the company logo
              </Typography>
            </div>

            <div className={classes.logoBox}>
              <div className={classes.logoImagebox}>
                <img
                  src={
                    (appearanceBrandLogo !== "" ? appearanceBrandLogo : null) ??
                    "../../../images/plug-icon-custom.svg"
                  }
                  alt="logo"
                  style={{ objectFit: "cover", width: "100%" }}
                />
              </div>

              <div>
                <FileUpload
                  id={userAccountId}
                  showSvgIcon={false}
                  values={{
                    fileType: "image/*",
                    required: false,
                    numOfFiles: 1,
                    maxFileSize: 2,
                    buttonText: "Replace logo",
                  }}
                  onChange={(e) => {
                    setAppearanceBrandLogo(e?.toString());

                    if (!e?.length || logoRef.current === e?.toString()) {
                      return;
                    }

                    logoRef.current = e?.toString();
                    handleUpdate({
                      logo: {
                        imageSource: DEFAULT.UPLOAD,
                        imageUrl: e?.toString(),
                        altText: "custom_logo",
                      },
                    });
                  }}
                  uploadFile={uploadFile}
                  style={{
                    button: {
                      width: "100%",
                      color: "#FFFFFF",
                      textAlign: "center",
                      textTransform: "none",
                      borderWidth: 1,
                      borderRadius: 5,
                      font: "14px",
                      padding: "3px 5px",
                      borderColor: "#2457C1",
                      backgroundColor: "#2457C1",
                    },
                  }}
                  isAssetRoute={true}
                  appDesignMode={APP_DESIGN_MODES.LIVE}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div style={{ paddingBottom: "20px" }}>
            <div className={classes.brandColorBox}>
              <div>
                <Typography className={classes.mainText} gutterBottom>
                  Brand colour
                </Typography>
                <Typography className={classes.subText}>
                  Select or customise your brand colour
                </Typography>
              </div>

              <div className={classes.defaultBrandColorBox}>
                {defaultBrandColor.map((item, index) => {
                  return (
                    <ColorPicker
                      key={index}
                      color={item.color}
                      identity={`${item?.color}-${index}-customise-brand-color`}
                      borderRadius={18}
                      showPopOver={false}
                      border={"none"}
                      showSelectedColorCode={false}
                      colorCallback={(e) => {
                        setAppearanceBrandColor(e);
                        handleUpdate({
                          theme: {
                            usePlugDefault: false,
                            primaryColor: e,
                          },
                        });
                      }}
                      style={{
                        width: "26px",
                        height: "26px",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className={classes.customiseColorBox}>
              <Typography className={classes.subTextOff}>
                Customise colour:
              </Typography>
              <div className={classes.customiseColor}>
                <div className={classes.colorPickerBox}>
                  <Typography className={classes.subTextOffTwo}>
                    {/* {theme?.primaryColor ?? DEFAULT.COLOR} */}
                    {appearanceBrandColor}
                  </Typography>
                </div>
                <div
                  className={classes.customColorPickerBox}
                  style={{
                    backgroundColor: hexToRgba(appearanceBrandColor),
                  }}
                >
                  <ColorPicker
                    key={v4()}
                    color={appearanceBrandColor}
                    identity="customColor-Appearance"
                    borderRadius={18}
                    border={"none"}
                    showSelectedColorCode={false}
                    colorCallback={(e) => {
                      setAppearanceBrandColor(e);
                      handleUpdate({
                        theme: {
                          usePlugDefault: false,
                          primaryColor: e,
                        },
                      });
                    }}
                    style={{
                      width: "26px",
                      height: "26px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CustomAppearance;
