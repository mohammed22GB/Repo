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
  totalFields,
  populate,
  transformData,
  makeMenuItem,
  makeHeaders,
} from "../dumpHandlers";
import { kebabCase, startCase } from "lodash";
import { exportAccountsAPI } from "../../../common/components/Mutation/ProfileSetting/userMutations";

import useCustomMutation from "../../../common/utils/CustomMutation";
import useStyles from "../style";

import * as yup from "yup";

const schema = yup.object().shape({
  selection: yup.array().of(yup.string()).min(1).required().label("Account"),
  filename: yup.string().required().label("Filename"),
});

export const AccountDump = ({ handleClose }) => {
  const styles = useStyles();

  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const form = useForm({
    initialValues: {
      totalApps: [],
      totalUsers: [],
      selection: [],
      filename: "Account Dump",
    },
    validate: yupResolver(schema),
    transformValues: (values) => {
      const { totalApps, totalUsers, selection } = values;
      const population = populate({ totalApps, totalUsers });
      return { selection, population, all: true };
    },
  });

  const account = makeMenuItem(accountFields, form.values.selection);
  const totalApps = makeMenuItem(totalFields, form.values.totalApps);
  const totalUsers = makeMenuItem(totalFields, form.values.totalUsers);

  const onExportSuccess = ({ data }) => {
    successToastify("Account dump exported successfully");
    const transformedData = transformData(data.data);
    setCsvData(transformedData);
  };

  const onExportError = ({ error }) => {
    errorToastify("Failed to export account dump");
  };

  const { mutate: exportAccountDump, isLoading: isExportAccountDumpLoading } =
    useCustomMutation({
      apiFunc: exportAccountsAPI,
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
    setHeaders(makeHeaders(form.values, ["totalApps", "totalUsers"]));
    exportAccountDump(values);
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
              Select account fields
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
                    return "Select account";
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
              {account}
            </TextField>
          </Grid>

          {form.values.selection.includes("totalUsers") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select total users fields</FormLabel>

              <TextField
                margin="dense"
                name="totalUsers"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.totalUsers,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select total users";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {totalUsers}
              </TextField>
            </Grid>
          )}

          {form.values.selection.includes("totalApps") && (
            <Grid item style={{ maxWidth: "100%" }}>
              <FormLabel>Select total apps fields</FormLabel>

              <TextField
                margin="dense"
                name="totalApps"
                fullWidth
                SelectProps={{
                  multiple: true,
                  value: form.values.totalApps,
                  displayEmpty: true,
                  onChange: (e) => {
                    handleChange(e);
                  },
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return "Select total apps";
                    }

                    return selected.map(startCase).join(", ");
                  },
                }}
                onChange={handleChange}
                variant="outlined"
                size="small"
                select
              >
                {totalApps}
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
            disabled={isExportAccountDumpLoading}
          >
            {isExportAccountDumpLoading ? (
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
