import queryString from "query-string";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LoadingScreen from "./LoadingScreen";
import Error from "./Error";
import { getLiveData, runCurrentTask } from "../common/helpers/LiveData";
import Appendage from "../common/components/AppendageForm/Appendage";

const ApprovalScreen = ({ match, location }) => {
  const [approvalData, setApprovalData] = useState({
    nextTask: "",
    comment: "",
    decision: "",
  });
  const queryParams = queryString?.parse(location.search);
  const dispatch = useDispatch();
  const appSlug = match.params.appSlug;
  const accountSlug = match.params.accountSlug;
  const history = useHistory();
  const { error, loading, task, workflowInstance, app, taskRunning } =
    useSelector(({ liveData }) => liveData);

  useEffect(() => {
    const loopingIdString = queryParams.loopingId
      ? `&loopingId=${queryParams.loopingId}`
      : "";

    dispatch(
      getLiveData({
        appSlug,
        accountSlug,
        queryParam: `workflowInstanceId=${queryParams.workflowInstanceId}&taskId=${queryParams.taskId}${loopingIdString}&isApproval=true`,
        relaunch: true,
      })
    );
  }, [
    appSlug,
    accountSlug,
    dispatch,
    queryParams.taskId,
    queryParams.workflowInstanceId,
  ]);

  const getTextAfterDelimiter = (str) => {
    if (!str) return "";

    const delimiter = ">>";

    const index = str.indexOf(delimiter);

    if (index === -1) {
      return str;
    }

    return str.substring(index + delimiter.length);
  };

  const onApprovalCommentChange = ({ name, value }) => {
    setApprovalData((prev) => ({ ...prev, [name]: value }));
  };
  const approveOrDeny = async (e) => {
    e.preventDefault();
    const prepareData = {
      taskId: queryParams.taskId,
      workflowInstanceId: queryParams.workflowInstanceId,
      data: approvalData,
      loopingId: queryParams.loopingId,
    };
    const loopingIdString = queryParams.loopingId
      ? `&loopingId=${queryParams.loopingId}`
      : "";
    const queryParam = `workflowInstanceId=${queryParams.workflowInstanceId}&taskId=${queryParams.taskId}${loopingIdString}`;

    dispatch(
      runCurrentTask({
        payload: prepareData,
        isApproval: queryParams.isApproval,
        queryParams: queryParam,
        history,
        accountSlug,
      })
    );
  };

  function extractReuseNum(str) {
    const regex = /\(R(\d+)\)/;

    const match = str.match(regex);

    if (match) {
      return `Reusable Screens`;
    }

    return null;
  }

  function groupByScreenName(arr) {
    return arr.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];

      const screenName =
        value.approval?.reuseName || value.approval?.screenName || key;

      if (!acc[screenName]) {
        acc[screenName] = [];
      }
      acc[screenName].push(value);

      return acc;
    }, {});
  }

  const prepareUserInputs = ({
    variables = [],
    metadata = {},
    approvalItems = {},
  }) => {
    let mappedVariables = [],
      tableColumns = [],
      tableRows = [],
      tableAggregates = [],
      mappedValues = [],
      tableHead = "";

    variables.forEach((variable) => {
      if (
        variable?.info?.matching?.valueSourceType === "form" ||
        variable?.info?.matching?.valueSourceType === "user"
      ) {
        mappedVariables.push({
          id: variable?.id,
          name: variable?.info?.name,
          group: variable?.info?.group,
          approval: approvalItems[variable?.id],
        });
      }
      if (variable?.info?.matching?.valueSourceType === "column") {
        tableColumns.push({
          id: variable?.id,
          type: variable?.info?.matching?.valueSourceType,
          name: getTextAfterDelimiter(variable?.info?.name),
        });
        tableHead = variable?.info?.name?.substring(
          0,
          variable?.info?.name.indexOf(">")
        );
      } else if (
        variable?.info?.matching?.valueSourceType === "aggregateCell"
      ) {
        tableAggregates.push({
          id: variable?.id,
          name: variable?.info?.name?.substring(
            variable?.info?.name.lastIndexOf(">") + 1,
            variable?.info?.name.length
          ),
        });
      }
    });

    Object.keys(metadata).forEach((metaValue) => {
      tableColumns.forEach((colObject) => {
        if (metaValue === colObject?.id) {
          colObject.values = metadata[colObject?.id];
          colObject.approval = {
            ...approvalItems[colObject.id],
            reuseName: extractReuseNum(colObject?.name) ?? "",
          };
          tableRows.push(colObject);
        }
      });
      tableAggregates.forEach((colObject) => {
        if (metaValue === colObject?.id) {
          colObject.value = metadata[colObject?.id];
          colObject.approval = {
            ...approvalItems[colObject.id],
            reuseName: extractReuseNum(colObject?.name) ?? "",
          };
          tableRows.push(colObject);
        }
      });
    });

    mappedVariables.forEach((mVariable) => {
      if (Object.keys(metadata).length) {
        if (mVariable?.group.toLowerCase() !== "initiator") {
          metadata[mVariable?.id] &&
            mappedValues.push({
              [mVariable?.name]: {
                approvalValue: metadata[mVariable?.id],
                approval: {
                  ...approvalItems[mVariable?.id],
                  metaDataTitle: [mVariable?.name],
                  reuseName: extractReuseNum(mVariable?.name) ?? "",
                },
              },
            });
        } else {
          if (mVariable?.name === "Initiator (name)" && !app.ispublic) {
            mappedValues.unshift({
              [mVariable?.name]: {
                approval: {
                  metaDataTitle: [mVariable?.name],
                  screenName: "Initiator",
                  label: mVariable?.name,
                  name: metadata[mVariable?.id],
                },
                approvalValue: metadata[mVariable?.id],
              },
            });
          }
        }
      }
    });
    mappedValues = groupByScreenName(mappedValues);
    // console.log(mappedVariables, mappedValues, tableColumns, {
    //   tableRows,
    //   tableHead,
    //   tableAggregates,
    // });

    return {
      mappedValues,
      tableProp: { tableRows, tableHead, tableAggregates },
    };
  };
  return (
    <div style={{ background: "#F4F6F8", paddingBottom: 15 }}>
      <LoadingScreen
        loading={loading || taskRunning}
        message={"Loading your application..."}
      />
      <Appendage
        error={error?.code}
        history={workflowInstance?.approvalHistory || []}
        decisions={task?.properties?.approvalActions || []}
        onChange={onApprovalCommentChange}
        onSubmit={approveOrDeny}
        taskName={task.name}
        app={app}
        loading={loading}
        taskRunning={taskRunning}
        userInputs={prepareUserInputs({
          metadata: workflowInstance?.metadata,
          variables: workflowInstance?.variables,
          approvalItems: workflowInstance?.approvalItems,
        })}
      />
      <Error status={error?.code} message={error?.message} />
    </div>
  );
};

export default ApprovalScreen;
