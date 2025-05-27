import { Button } from "@material-ui/core";

const LoadMoreButton = ({
  nextPage,
  setNextPage,
  hasNextPage,
  isFetchingNextPage,
  handleFetchNextPage,
}) => (
  <div
    data-testid="load-more-button"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "2px",
    }}
  >
    <Button
      onClick={() => {
        setNextPage((nextPage) => nextPage + 1);
        handleFetchNextPage(true);
      }}
      style={{
        color: isFetchingNextPage ? "#8A8A8A" : "#535353",
        fontSize: "14px",
        fontWeight: 600,
        textTransform: "none",
        fontFamily: "'Avenir','Inter'",
        border: "1px solid #535353",
        borderRadius: "5px",
        padding: "4px 24px",
      }}
      disabled={!hasNextPage || isFetchingNextPage}
    >
      {!isFetchingNextPage ? "Load more" : "Loading..."}
    </Button>
  </div>
);

export default LoadMoreButton;
