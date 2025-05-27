export const APPS_CONTROL_MODES = {
  APP: "Apps",
  TEMPLATE: "Templates",
};
export const APPS_PER_PAGE = 10;
export const VARIABLES_LENGTH_THRESHOLD = 200;

export const APP_RUN_MAX_WIDTH = 900;

export const plugDataSourceTypes = {
  VARIABLES: "variables",
  DATASHEET: "datasheet",
  GOOGLESHEET: "googleSheet",
  EXTERNALDATABASE: "externalDatabase",
  OTHER: "other",
};

export const decisionNodeOutputHandles = [
  { handle: "b", color: "#3dd60b" },
  { handle: "c", color: "#9b0bd6" },
  { handle: "d", color: "#0b9ed6" },
];

export const dataNodeUpdateMethods = {
  NEW: "new",
  UPDATE: "update",
  RETRIEVE: "retrieve",
};

export const variableGroups = {
  FORM: "Form",
  INPUT_TABLE: "InputTable",
  EXECUTOR: "Executor",
  DOCUMENT: "Document",
  SCREENS: "Screens",
  DATA: "Data",
};

export const unrenderableVariables = [variableGroups.SCREENS];

export const WORKFLOWS_DATASOURCE_TYPES = [
  [plugDataSourceTypes.VARIABLES, "Workflow Variables", ["source"]],
  [plugDataSourceTypes.DATASHEET, "Plug Datasheet", ["source", "destination"]],
  [plugDataSourceTypes.GOOGLESHEET, "GoogleSheet", ["source", "destination"]],
  [
    plugDataSourceTypes.EXTERNALDATABASE,
    "External Database",
    ["source", "destination"],
  ],
  [plugDataSourceTypes.OTHER, "Other Database", ["source", "destination"]],
];

export const allAggregationFunctions = {
  None: "None",
  SUM: "SUM",
  AVERAGE: "AVERAGE",
  COUNT: "COUNT",
  MIN: "MIN",
  MAX: "MAX",
};

export const WORKFLOWS_DATASOURCE_AGGREGATIONS = [
  ["None", "None"],
  ["SUM", "SUM"],
  ["AVERAGE", "AVERAGE"],
  ["COUNT", "COUNT"],
  ["MIN", "MIN"],
  ["MAX", "MAX"],
];

export const allOperators = {
  PLUS: "PLUS",
  MINUS: "MINUS",
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  IS_EMPTY: "IS_EMPTY",
  NOT_EMPTY: "NOT_EMPTY",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  GREATER_THAN_OR_EQUALS: "GREATER_THAN_OR_EQUALS",
  LESS_THAN_OR_EQUALS: "LESS_THAN_OR_EQUALS",
  IN: "IN",
};

export const allComputedTimeUnits = {
  HOUR: "hour",
  MINUTE: "minute",
  SECOND: "second",
  DAY: "day",
};

export const ArithmeticOperators = [
  { value: allOperators.PLUS, symbol: "+", title: "(plus)" },
  { value: allOperators.MINUS, symbol: "-", title: "(minus)" },
  { value: allOperators.MULTIPLY, symbol: "*", title: "(times)" },
  { value: allOperators.MODULO, symbol: "%", title: "(modulo)" },
  {
    value: allOperators.DIVIDE,
    symbol: "/",
    title: "(divided by)",
  },
];

// it's sending the values
export const ComputedTimeUnits = [
  { value: allComputedTimeUnits.SECOND, symbol: "SS", title: "seconds" },
  { value: allComputedTimeUnits.MINUTE, symbol: "MM", title: "minutes" },
  { value: allComputedTimeUnits.HOUR, symbol: "HH", title: "hours" },
  { value: allComputedTimeUnits.DAY, symbol: "DD", title: "days" },
];

export const ConditionalOperators = [
  { value: allOperators.EQUALS, symbol: "==", title: "(equals)" },
  {
    value: allOperators.NOT_EQUALS,
    symbol: "!=",
    title: "(not equals)",
  },
  {
    value: allOperators.IS_EMPTY,
    symbol: '""',
    title: "(is empty)",
  },
  {
    value: allOperators.NOT_EMPTY,
    symbol: '!""',
    title: "(not empty)",
  },
  {
    value: allOperators.GREATER_THAN,
    symbol: ">",
    title: "(greater than)",
  },
  {
    value: allOperators.LESS_THAN,
    symbol: "<",
    title: "(less than)",
  },
  {
    value: allOperators.GREATER_THAN_OR_EQUALS,
    symbol: ">=",
    title: "(greater than or equals)",
  },
  {
    value: allOperators.LESS_THAN_OR_EQUALS,
    symbol: "<=",
    title: "(less than or equals)",
  },
  {
    value: allOperators.IN,
    symbol: "IN",
    title: "(is contained in)",
  },
];

export const durationList = [
  ["minutes", "Minutes"],
  ["hours", "Hours"],
  ["days", "Days"],
  // ["date", "Date"],
  // ["months", "Months"],
  // ["years", "Years"],
];

export const googleSheetDefaultColumns = [
  { name: "A", id: 1 },
  { name: "B", id: 2 },
  { name: "C", id: 3 },
  { name: "D", id: 4 },
  { name: "E", id: 5 },
  { name: "F", id: 6 },
  { name: "G", id: 7 },
  { name: "H", id: 8 },
  { name: "I", id: 9 },
  { name: "J", id: 10 },
  { name: "K", id: 11 },
  { name: "L", id: 12 },
  { name: "M", id: 13 },
  { name: "N", id: 14 },
  { name: "O", id: 15 },
  { name: "P", id: 16 },
  { name: "Q", id: 17 },
  { name: "R", id: 18 },
  { name: "S", id: 19 },
  { name: "T", id: 20 },
  { name: "U", id: 21 },
  { name: "V", id: 22 },
  { name: "W", id: 23 },
  { name: "X", id: 24 },
  { name: "Y", id: 25 },
  { name: "Z", id: 26 },
];

export const INVALID_FIELD_LABEL_STYLE = { color: "#e41919" };

export const DEFAULT_APP_CATEGORY_COLOR = "#000000";

export const CONDITION_OPERATORS = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  GREATER_THAN_OR_EQUALS: "GREATER_THAN_OR_EQUALS",
  LESS_THAN_OR_EQUALS: "LESS_THAN_OR_EQUALS",
  IS_NULL: "IS_NULL",
  IS_NOT_NULL: "IS_NOT_NULL",
  AND: "AND",
  OR: "OR",
};

export const getOperators = (typ, MenuItem, classes, disableds = []) => {
  const operators = {
    comparison: [
      {
        value: CONDITION_OPERATORS.EQUALS,
        symbol: "==",
        title: "(equals)",
        disabled: disableds.includes(CONDITION_OPERATORS.EQUALS),
      },
      {
        value: CONDITION_OPERATORS.NOT_EQUALS,
        symbol: "!=",
        title: "(not equals)",
        disabled: disableds.includes(CONDITION_OPERATORS.NOT_EQUALS),
      },
      {
        value: CONDITION_OPERATORS.GREATER_THAN,
        symbol: ">",
        title: "(greater than)",
        disabled: disableds.includes(CONDITION_OPERATORS.GREATER_THAN),
      },
      {
        value: CONDITION_OPERATORS.LESS_THAN,
        symbol: "<",
        title: "(less than)",
        disabled: disableds.includes(CONDITION_OPERATORS.LESS_THAN),
      },
      {
        value: CONDITION_OPERATORS.GREATER_THAN_OR_EQUALS,
        symbol: ">=",
        title: "(greater than or equals)",
        disabled: disableds.includes(
          CONDITION_OPERATORS.GREATER_THAN_OR_EQUALS
        ),
      },
      {
        value: CONDITION_OPERATORS.LESS_THAN_OR_EQUALS,
        symbol: "<=",
        title: "(less than or equals)",
        disabled: disableds.includes(CONDITION_OPERATORS.LESS_THAN_OR_EQUALS),
      },
      {
        value: CONDITION_OPERATORS.AND,
        symbol: "&&",
        title: "(and)",
        disabled: disableds.includes(CONDITION_OPERATORS.AND),
      },
      {
        value: CONDITION_OPERATORS.OR,
        symbol: "||",
        title: "(or)",
        disabled: disableds.includes(CONDITION_OPERATORS.OR),
      },
      {
        value: CONDITION_OPERATORS.IS_NULL,
        symbol: "= null",
        title: "(is null/empty)",
        disabled: disableds.includes(CONDITION_OPERATORS.IS_NULL),
      },
      {
        value: CONDITION_OPERATORS.IS_NOT_NULL,
        symbol: "!= null",
        title: "(is not null/empty)",
        disabled: disableds.includes(CONDITION_OPERATORS.IS_NOT_NULL),
      },
    ],
    arithmetic: ArithmeticOperators,
  };

  return operators?.[typ]?.map((oper, i) => (
    <MenuItem value={oper.value} key={i} disabled={oper.disabled}>
      <span
        style={{
          width: 20,
          textAlign: "center",
          display: "inline-block",
          minWidth: "fit-content",
        }}
      >
        {oper.symbol}
      </span>
      <span className={classes.spaceSpanInLI}>{oper.title}</span>
    </MenuItem>
  ));
};

export const exemptCurrentTaskVariables = (variables, activeTaskId) => {
  const vars = [...(variables || [])];
  return vars.filter((v) => v?.info?.parent !== activeTaskId);
};
