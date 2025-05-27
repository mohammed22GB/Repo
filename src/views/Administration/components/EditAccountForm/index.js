import { useForm, yupResolver, Form } from "@mantine/form";
import { successToastify, errorToastify } from "../../../common/utils/Toastify";
import { updateUserAccount } from "../../../common/components/Mutation/ProfileSetting/userMutations";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormLabel,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";
import {
  countryDropDown,
  employeeDropDown,
  industryDropDown,
} from "../../../common/components/DropDown/util/utils";
import { useQueryClient } from "react-query";

import useStyles from "../style";
import useCustomMutation from "../../../common/utils/CustomMutation";

import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(1)
    .required("Name is required")
    .label("Organization name"),
  industry: yup
    .string()
    .min(1)
    .required("Industry is required")
    .label("Industry"),
  noOfEmployee: yup
    .string()
    .min(1)
    .required("Number of employees is required")
    .label("Number of employees"),
  country: yup.string().min(1).required("Country is required").label("Country"),
});

/**
 * @param {{
 *  id: string;
 *  handleClose: () => void;
 *  initialValues: User;
 * }} props
 */
export const EditAccountForm = ({
  id,
  handleClose,
  initialValues = {
    name: "",
    industry: "",
    noOfEmployee: "",
    country: "",
  },
}) => {
  const styles = useStyles();
  const queryClient = useQueryClient();

  const onUpdateAccountSuccess = ({ data }) => {
    successToastify("Account updated successfully");

    queryClient.invalidateQueries({
      queryKey: ["allOrganizations"],
      exact: false,
    });

    handleClose();
  };

  const onUpdateAccountError = ({ error }) => {
    errorToastify("Failed to update account");
  };

  const { mutate: updateAccount, isLoading: isUpdateAccountLoading } =
    useCustomMutation({
      apiFunc: updateUserAccount,
      onSuccess: onUpdateAccountSuccess,
      onError: onUpdateAccountError,
      retries: 0,
    });

  const form = useForm({
    initialValues,
    validate: yupResolver(schema),
    validateInputOnChange: true,
  });

  /**
   * @param {Plug.Account} values
   */
  const handleSubmit = (values) => {
    const { name, industry, noOfEmployee, country } = values;

    updateAccount({
      id,
      name,
      industry,
      noOfEmployee,
      country,
    });
  };

  /**
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    form.setFieldValue(name, value);
  };

  const industry = industryDropDown.map(([value, label]) => {
    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });

  const countries = countryDropDown.map(([value, label]) => {
    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });

  const employees = employeeDropDown.map(([value, label]) => {
    return (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    );
  });

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <DialogContent classes={{ root: styles.dialogContent }}>
        <Grid container direction="column" spacing={2}>
          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              Organization name
            </FormLabel>
            <TextField
              margin="dense"
              name="name"
              fullWidth
              required
              InputLabelProps={{
                style: { color: "#010A43" },
              }}
              value={form.values.name}
              helperText={form.errors.name}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              placeholder="Enter organization name"
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              Industry
            </FormLabel>
            <TextField
              margin="dense"
              name="industry"
              fullWidth
              value={form.values.industry}
              helperText={form.errors.industry}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              placeholder="Select industry"
              onChange={handleChange}
              variant="outlined"
              size="small"
              select
            >
              {industry}
            </TextField>
          </Grid>

          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              Country
            </FormLabel>
            <TextField
              margin="dense"
              name="country"
              fullWidth
              value={form.values.country}
              helperText={form.errors.country}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              placeholder="Select country"
              onChange={handleChange}
              variant="outlined"
              size="small"
              select
            >
              {countries}
            </TextField>
          </Grid>

          <Grid item style={{ maxWidth: "100%" }}>
            <FormLabel required classes={{ asterisk: styles.asterisk }}>
              Number of employees
            </FormLabel>
            <TextField
              margin="dense"
              name="noOfEmployee"
              fullWidth
              value={form.values.noOfEmployee}
              helperText={form.errors.noOfEmployee}
              FormHelperTextProps={{ style: { color: "crimson" } }}
              placeholder="Select number of employees"
              onChange={handleChange}
              variant="outlined"
              size="small"
              select
            >
              {employees}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={isUpdateAccountLoading}
        >
          {isUpdateAccountLoading ? (
            <CircularProgress size={24} style={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Form>
  );
};
