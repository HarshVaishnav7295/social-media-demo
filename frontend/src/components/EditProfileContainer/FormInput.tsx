import React from "react";
import { Box, Text, Input } from "@chakra-ui/react";
interface IFormInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  description?: string;
  enteredInputValue?: string | undefined;
  handleInputChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | undefined
  ) => void | undefined;
  invalidInput?: boolean;
  handleInputBlur?: React.FocusEventHandler<HTMLInputElement>;
  isDisabled?: boolean;
}
const FormInput = (props: IFormInputProps) => {
  return (
    <Box
      display="flex"
      flexDirection={["column", "column", "column", "row", "row", "row"]}
      gap={[".8rem", ".8rem", ".8rem", "2rem", "2rem", "2rem"]}
      my="1rem"
      mx="2rem"
    >
      {/* profile */}
      <Box
        flex={["100%", "100%", "100%", "20%", "20%", "20%"]}
        display="flex"
        justifyContent={[
          "flex-start",
          "flex-start",
          "flex-start",
          "flex-end",
          "flex-end",
          "flex-end",
        ]}
        alignItems="start"
      >
        <Text fontWeight="bold" fontSize=".8rem">
          {props.name}
        </Text>
      </Box>

      {/* input */}
      <Box
        display="flex"
        flexDirection="column"
        flex={["100%", "100%", "100%", "80%", "80%", "80%"]}
      >
        <Input
          type={props.type}
          placeholder={props.placeholder}
          width={["100%", "100%", "100%", "60%", "60%", "60%"]}
          fontSize="1rem"
          height="30px"
          borderColor={props.invalidInput ? "red" : ""}
          disabled={props.isDisabled}
          value={props.enteredInputValue}
          onChange={props.handleInputChange}
          onBlur={props.handleInputBlur}
        />

        {/* description */}
        <Text fontSize=".9rem" color="#a1a1aa" fontWeight="normal" my=".3rem">
          {props.description}
        </Text>
      </Box>
    </Box>
  );
};

export default FormInput;
