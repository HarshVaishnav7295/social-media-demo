import React, { useRef } from "react";
import { Box, Img, Input, Text } from "@chakra-ui/react";
import { IUser } from "../../types/reduxTypes";

interface IUserDetailProps {
  user: IUser | undefined;
  avatar: string | undefined;
  disabled: boolean;
  setAvatar?: (arg0: string) => void;
}
const UserDetail = (props: IUserDetailProps) => {
  const inputFile = useRef<any>(null);
  const handleChange = (e: any) => {
    if (!props.disabled) {
      const reader = new FileReader();
      const mainFile = e?.target?.files[0];
      if (mainFile) {
        reader.readAsDataURL(mainFile);
        reader.onload = function () {
          if (typeof reader.result === "string") {
            if (props.setAvatar) {
              props.setAvatar(reader.result);
            }
          }
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      }
    }
  };

  return (
    <Box display="flex" gap="2rem" mx="2rem" alignItems="center">
      <Box
        flex={["10%", "10%", "10%", "20%", "20%", "20%"]}
        display="flex"
        justifyContent="end"
        borderRadius="50%"
        cursor="pointer"
        onClick={() => (!props.disabled ? inputFile.current.click() : null)}
      >
        <Img
          src={props.avatar}
          // width="3rem" height='3rem'

          minWidth="5rem"
          borderRadius="50%"
          maxWidth="5rem"
          minHeight="5rem"
          maxHeight="5rem"
        />
      </Box>
      <Box flex={["92%", "92%", "92%", "80%", "80%", "80%"]} float="left">
        <Text as="h3" fontWeight="600">
          {props?.user?.name}
        </Text>
        {!props.disabled && (
          <Input
            type="file"
            onChange={handleChange}
            ref={inputFile}
            border="none"
            display="none"
          />
        )}
        <Text
          as={"p"}
          fontSize=".8rem"
          fontWeight="700"
          width="-moz-fit-content"
          color="#38bdf8"
          cursor="pointer"
          p="0px"
          onClick={() => (!props.disabled ? inputFile.current.click() : null)}
        >
          Change Profile Photo
        </Text>
      </Box>
    </Box>
  );
};

export default UserDetail;
