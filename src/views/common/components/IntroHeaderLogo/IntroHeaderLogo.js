import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  img: {
    [theme?.breakpoints?.down("sm")]: {
      width: "100px",
    },
    [theme?.breakpoints?.down("xs")]: {
      width: "110px",
    },
  },
}));
const IntroHeaderLogo = () => {
  const [logo, setLogo] = useState(window.innerWidth);
  const classes = useStyles();

  useEffect(() => {
    function handleResize() {
      setLogo(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
  });

  return (
    <div>
      {logo > 959 ? (
        <img alt="Logo" src="/images/newplug/plug-logo.png" />
      ) : (
        <img alt="Logo" src="/images/plug-logo.png" className={classes.img} />
      )}
    </div>
  );
};

export default IntroHeaderLogo;
