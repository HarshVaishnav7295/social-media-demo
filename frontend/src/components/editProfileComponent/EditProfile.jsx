import React, { useState } from "react";
import { Box, Textarea } from "@chakra-ui/react";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import UserDetail from "./UserDetail";
import { updateUserAsync } from "../../Redux/userAction";
import { useDispatch, } from "react-redux";

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(props.user.name);
  const [bio, setBio] = useState(props.user.bio);
  const [avatar, setAvatar] = useState(props.user.avatar);

  const invalidNameInput = name === "";

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleBioChange(e) {
    setBio(e.target.value);
  }
  //   border={['none','none','none','1px solid gray','1px solid gray','1px solid gray']}

  function handleBtnClick() {
    const data = {
      name,
      avatar: avatar ? avatar : "",
      bio: bio ? bio : "",
      token: props.user.token,
    };
    dispatch(updateUserAsync(data));
  }

  return (
    <Box flexBasis="80%" paddingTop="20px">
      {/* userprofile and changeimg */}
      <UserDetail
        user={props.user}
        avatar={avatar}
        setAvatar={setAvatar}
        disabled={false}
      />
      {/* form */}
      <Box>
        <FormInput
          type="text"
          name="Name"
          placeholder="Enter Your Name"
          description="you can enter any user name as you want :)"
          enteredInputValue={name}
          handleInputChange={handleNameChange}
          invalidInput={invalidNameInput}
        />

        <FormInput
          type="text"
          name="Email"
          placeholder="Your username"
          isDisabled={true}
          enteredInputValue={props.user.email}
        />
        <FormInput
          type="text"
          name="DOB"
          placeholder="Your DOB"
          isDisabled={true}
          enteredInputValue={props.user.dob}
        />
        <FormInput
          type="text"
          name="Gender"
          placeholder="Your Gender"
          isDisabled={true}
          enteredInputValue={props.user.gender}
        />

        {/* <FormInput type='textarea' name="Bio" placeholder="Your Bio" value='Bio'/> */}
        <Box
          display="flex"
          flexDirection={["column", "column", "column", "row", "row", "row"]}
          gap={[".8rem", ".8rem", ".8rem", "2rem", "2rem", "2rem"]}
          mx="2rem"
        >
          <Box
            flex="20%"
            display="flex"
            justifyContent={[
              "flex-start",
              "flex-start",
              "flex-start",
              "flex-end",
              "flex-end",
              "flex-end",
            ]}
            fontWeight="bold"
          >
            Bio
          </Box>
          <Box flex="80%" float="left">
            <Textarea
              rows="3"
              flex={["100%", "100%", "100%", "80%", "80%", "80%"]}
              placeholder="Write something about you !"
              value={bio}
              onChange={handleBioChange}
            ></Textarea>
          </Box>
        </Box>
      </Box>

      {/* submit btn */}
      <SubmitBtn onClick={handleBtnClick} disabled={invalidNameInput} />
    </Box>
  );
};

export default EditProfile;
