import { Form, useForm, yupResolver } from "@mantine/form";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { CSVLink } from "react-csv";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import { useEffect, useState } from "react";
import {
  accountFields,
  lastLoginFields,
  populate,
  transformData,
  userFields,
  userGroupFields,
  makeMenuItem,
  makeHeaders,
} from "../dumpHandlers";
import { kebabCase, startCase } from "lodash";
import { exportUserAPI } from "../../../common/components/Mutation/ProfileSetting/userMutations";

import useCustomMutation from "../../../common/utils/CustomMutation";
import useStyles from "../style";

import * as yup from "yup";

const schema = yup.object().shape({
  selection: yup.array().of(yup.string()).min(1).required().label("User"),
  filename: yup.string().required().label("Filename"),
});

export const UserDump = ({ handleClose, accountId }) => {
  const styles = useStyles();

  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const form = useForm({
    initialValues: {
      account: [],
      userGroups: [],
      lastLogin: [],
      lineManager: [],
      selection: [],
      filename: "User Dump",
    },
    validate: yupResolver(schema),
    transformValues: (values) => {
      const { account, userGroups, lastLogin, lineManager, selection } = values;

      const query = { account: accountId };
      const population = populate({
        account,
        userGroups,
        lastLogin,
        lineManager,
      });

      return {
        selection,
        population,
        all: true,
        query,
      };
    },
  });

  const account = makeMenuItem(accountFields, form.values.account);
  const lastLogin = makeMenuItem(lastLoginFields, form.values.lastLogin);
  const lineManager = makeMenuItem(userFields, form.values.lineManager);
  const user = makeMenuItem(userFields, form.values.selection);
  const userGroups = makeMenuItem(userGroupFields, form.values.userGroups);

  const onExportSuccess = ({ data }) => {
    successToastify("User dump exported successfully");
    const transformedData = transformData(data.data);
    setCsvData(transformedData);
  };

  const onExportError = ({ error }) => {
    errorToastify("Failed to export user dump");
  };

  const { mutate: exportUserDump, isLoading: isExportUserDumpLoading } =
    useCustomMutation({
      apiFunc: exportUserAPI,
      onSuccess: onExportSuccess,
      onError: onExportError,
      retries: 0,
    });

  /**
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    form.setFieldValue(name, value);
  };

  /**
   * @param {{
   *  selection: string[];
   *  population: { path: string, select: string }[];
   *  all: boolean;
   * }} values
   *
   * @returns {void}
   */
  const handleSubmit = (values) => {
    setHeaders(
      makeHeaders(form.values, [
        "account",
        "userGroups",
        "lineManager",
        "lastLogin",
      ])
    );
    exportUserDump(values);
  };

  const handleReset = () => {
    setCsvData([]);
    setHeaders([]);
  };

  useEffect(handleReset, [form.values]);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <DialogContent classes={{ root: styles.dialogContent }}>
        <Grid container direction="column" spacing={2}>
          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              Select user fields
            </FormLabel>

            <TextField
              margin="dense"
              name="selection"
              fullWidth
              SelectProps={{
                multiple: true,
                value: form.values.selection,
                displayEmpty: true,
                onChange: (e) => {
                  handleChange(e);
                },
                renderValue: (selected) => {
                  if (!selected.length) {
                    return "Select user";
                  }

                  return selected.map(startCase).join(", ");
                },
              }}
              helperText={form.errors.selection}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              onChange={handleChange}
              variant="outlined"
              size="small"
              select
            >
              {user}
            </TextField>
          </Grid>

          {form.values.selection.includes("account") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select account fields</FormLabel>

              <TextField
                margin="dense"
                name="account"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.account,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select account";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {account}
              </TextField>
            </Grid>
          )}

          {form.values.selection.includes("userGroups") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select user group fields</FormLabel>

              <TextField
                margin="dense"
                name="userGroups"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.userGroups,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select user groups";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {userGroups}
              </TextField>
            </Grid>
          )}

          {form.values.selection.includes("lineManager") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select line manager fields</FormLabel>

              <TextField
                margin="dense"
                name="lineManager"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.lineManager,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select line manager";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {lineManager}
              </TextField>
            </Grid>
          )}

          {form.values.selection.includes("lastLogin") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select last login fields</FormLabel>

              <TextField
                margin="dense"
                name="lastLogin"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.lastLogin,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select last login";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {lastLogin}
              </TextField>
            </Grid>
          )}

          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              File name
            </FormLabel>

            <TextField
              margin="dense"
              name="filename"
              fullWidth
              helperText={form.errors.filename}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              value={form.values.filename}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>

        {csvData.length ? (
          <CSVLink
            data={csvData}
            headers={headers}
            filename={kebabCase(form.values.filename) + ".csv"}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClickCapture={handleReset}
            >
              Download
            </Button>
          </CSVLink>
        ) : (
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            disabled={isExportUserDumpLoading}
          >
            {isExportUserDumpLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Export"
            )}
          </Button>
        )}
      </DialogActions>
    </Form>
  );
};
