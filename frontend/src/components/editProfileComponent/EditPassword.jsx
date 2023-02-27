import React from "react";
import { Box } from "@chakra-ui/react";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import UserDetail from "./UserDetail";
import useInput from "../../Hook/UseInput";
import { useDispatch } from "react-redux";
import { updateUserPasswordAsync } from "../../Redux/userAction";
import { ToastContainer, toast } from "react-toastify";
import { ToastOption } from "../Register";

const EditPassword = ({ user }) => {
  const dispatch = useDispatch();
  const {
    value: oldPasswordInputValue,
    hasError: invalidOldPasswordInput,
    handleEnteredValueChange: handleOldPasswordInputChange,
    handleBlur: handleOldPasswordInputBlur,
    reset: handleOldPasswordReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: passwordInputValue,
    hasError: invalidPasswordInput,
    handleEnteredValueChange: handlePasswordInputChange,
    handleBlur: handlePasswordInputBlur,
    reset: handlePasswordReset,
  } = useInput((value) => value.trim() !== "" && value.length >= 6);

  const {
    value: confPassInputValue,
    hasError: invalidConfPassInput,
    handleEnteredValueChange: handleConfPassInputChange,
    handleBlur: handleConfPassInputBlur,
    reset: handleConfPassReset,
  } = useInput((value) => value === passwordInputValue && value.trim() !== "");

  function handleBtnClick() {
    const data = {
      token: user.token,
      oldPassword: oldPasswordInputValue,
      newPassword: confPassInputValue,
    };

    dispatch(updateUserPasswordAsync(data))
      .then((newdata) => {
        if (newdata === "Invalid Credentials") {
          toast.error(newdata, ToastOption);
        } else {
          toast.info("Password has been changed.", ToastOption);
        }
      })
      .catch((error) => {});

    handleOldPasswordReset();
    handleConfPassReset();
    handlePasswordReset();
  }

  return (
    <Box flexBasis="80%" paddingTop="20px">
      <ToastContainer />
      {/* userprofile and changeimg */}
      <UserDetail user={user} avatar={user.avatar} disabled={true} />
      {/* form */}
      <Box>
        <FormInput
          name="Old Password"
          placeholder="Enter Old Password"
          enteredInputValue={oldPasswordInputValue}
          handleInputChange={handleOldPasswordInputChange}
          handleInputBlur={handleOldPasswordInputBlur}
          invalidInput={invalidOldPasswordInput}
        />

        <FormInput
          name="Password"
          placeholder="Enter Your New Password"
          enteredInputValue={passwordInputValue}
          handleInputChange={handlePasswordInputChange}
          handleInputBlur={handlePasswordInputBlur}
          invalidInput={invalidPasswordInput}
        />
        <FormInput
          name="Retry Password"
          placeholder="Conform password"
          enteredInputValue={confPassInputValue}
          handleInputChange={handleConfPassInputChange}
          handleInputBlur={handleConfPassInputBlur}
          invalidInput={invalidConfPassInput}
        />
      </Box>

      <SubmitBtn
        onClick={handleBtnClick}
        disabled={
          invalidConfPassInput ||
          invalidPasswordInput ||
          invalidOldPasswordInput ||
          passwordInputValue === "" ||
          confPassInputValue === "" ||
          oldPasswordInputValue === ""
        }
      />
    </Box>
  );
};

export default EditPassword;
