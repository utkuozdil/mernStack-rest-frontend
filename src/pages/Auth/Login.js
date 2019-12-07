import React, { useState } from "react";

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

const Login = props => {
  const [loginForm, setLoginForm] = useState({
    email: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, email]
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    },
    formIsValid: false
  });

  const inputChangeHandler = (input, value) => {
    let isValid = true;
    for (const validator of loginForm[input].validators) {
      isValid = isValid && validator(value);
    }
    const updatedForm = {
      ...loginForm,
      [input]: {
        ...loginForm[input],
        valid: isValid,
        value: value
      }
    };
    let formIsValid = true;
    for (const inputName in updatedForm) {
      formIsValid =
        formIsValid && (updatedForm[inputName] && updatedForm[inputName].valid);
    }

    updatedForm.formIsValid = formIsValid;

    setLoginForm(updatedForm);
  };

  const inputBlurHandler = input => {
    setLoginForm({
      ...loginForm,
      [input]: {
        ...loginForm[input],
        touched: true
      }
    });
  };

  return (
    <Auth>
      <form
        onSubmit={e =>
          props.onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value
          })
        }
      >
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "email")}
          value={loginForm["email"].value}
          valid={loginForm["email"].valid}
          touched={loginForm["email"].touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "password")}
          value={loginForm["password"].value}
          valid={loginForm["password"].valid}
          touched={loginForm["password"].touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
