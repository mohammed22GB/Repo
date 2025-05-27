import { Radio, Typography } from "@material-ui/core";
import { quickAccessImages } from "../utils/customizationutils";

const CustomSingleAppOption = ({ index, appItem, apps, onSelection }) => {
  return (
    <div
      key={index ?? appItem?._id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={
            quickAccessImages[
              Math.floor(Math.random() * quickAccessImages.length)
            ]
          }
          alt="logo"
          style={{ objectFit: "cover", width: "32px" }}
        />
        <Typography
          style={{
            color: "#535353",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          {appItem?.name}
        </Typography>
      </div>
      <Radio
        checked={apps.content?._id === appItem?._id}
        onChange={(e) => {
          onSelection(e.target.value);
        }}
        value={appItem?._id}
        name="radio-button-demo"
        inputProps={{ "aria-label": "A" }}
      />
    </div>
  );
};

export default CustomSingleAppOption;
