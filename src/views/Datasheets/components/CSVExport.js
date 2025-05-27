import { useState, useEffect, useRef, Fragment } from "react";
import propsTypes from "prop-types";
import { CSVLink } from "react-csv";
import { useDispatch } from "react-redux";
import { SetAppStatus } from "../../common/helpers/helperFunctions";

const CsvExport = ({ asyncExportMethod, children, disable }) => {
  const dispatch = useDispatch();
  const [csvData, setCsvData] = useState(false);
  const csvInstance = useRef();
  useEffect(() => {
    if (csvData && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvData(false);
      });
    }
  }, [csvData]);
  return (
    <Fragment>
      <div
        onClick={async () => {
          if (disable) {
            return;
          }
          const newCsvData = await asyncExportMethod();
          setCsvData(newCsvData);
          dispatch(SetAppStatus({ type: "info", msg: "Download successful" }));
        }}
      >
        {children}
      </div>
      {csvData ? (
        <CSVLink
          data={csvData.data}
          headers={csvData.headers}
          filename={csvData.filename}
          ref={csvInstance}
        />
      ) : undefined}
    </Fragment>
  );
};

export default CsvExport;

CsvExport.defaultProps = {
  children: undefined,
  asyncExportMethod: () => null,
  disable: false,
};

CsvExport.propTypes = {
  children: propsTypes.node,
  asyncExportMethod: propsTypes.func,
  disable: propsTypes.bool,
};
