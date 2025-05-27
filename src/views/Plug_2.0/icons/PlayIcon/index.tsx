import React from "react";

interface Props {}

const PlayIcon = (props: Props) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.56152 12.0795V8.59589C4.56152 4.10011 7.73916 2.28768 11.6229 4.5238L14.6358 6.26561L17.6487 8.00743C21.5325 10.2435 21.5325 13.9155 17.6487 16.1516L14.6358 17.8934L11.6229 19.6352C7.73916 21.8714 4.56152 20.0354 4.56152 15.5632V12.0795Z"
        fill="#292929"
      />
    </svg>
  );
};

export default PlayIcon;
