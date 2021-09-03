import React from "react";
import {
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import Colors from "../../constants/Colors";

const FormikInput = (props) => {
  const FieldWrapper = ({ children, label, formikProps, formikKey }) => (
    <View style={{ marginVertical: 5 }}>
      <Text style={{ marginBottom: 3, color: "#C0C0C0" }}>{label}</Text>
      {children}
      <Text style={{ color: "red" }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );

  const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
    const inputStyles = {
      // borderWidth: "0,0,2",
      // borderColor: "black",
      // padding: 10,
      // marginBottom: 3,
      // borderRadius: 10,
      // color: "black",
    };

    if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
      inputStyles.borderColor = "red";
    }

    return (
      <FieldWrapper
        label={props.formikLabel}
        formikKey={props.formikKey}
        formikProps={formikProps}
      >
        <TextInput
          style={inputStyles}
          returnKeyType="next"
          onChangeText={formikProps.handleChange(props.FormikKey)}
          onBlur={formikProps.handleBlur(props.FormikKey)}
          {...rest}
        />
      </FieldWrapper>
    );
  };

  const validationSchema = yup.object().shape({
    Nombre: yup.string().label("Nombre"),
    // last: yup.string().label("Apellido").required(),
    // title: yup.string().label("title").required(),
  });

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.submit}
      validationSchema={props.schema}
    >
      {(formikProps) => (
        <React.Fragment>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StyledInput
                style={{ fontSize: 25 }}
                label={props.formikLabel}
                formikProps={formikProps}
                formikKey={props.FormikKey}
                // keyboardType={props.formikKeyboard}
                maxLength={props.formikMaxLength}
                placeholder={props.formikPlaceholder}
                placeholderTextColor={"black"}
              />
            </View>
          </View>

          {/* {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <Button
              title="Guardar Cambios"
              color={Colors.noExprimary}
              onPress={formikProps.handleSubmit}
            />
          )} */}
        </React.Fragment>
      )}
    </Formik>
  );
};

export default FormikInput;
