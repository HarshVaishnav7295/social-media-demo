import { useState } from "react";
import { ChangeEvent } from "react";

const useInput = (validator: (enteredValue: string) => boolean) => {
  const [enteredValue, setEnteredValue] = useState<string>("");
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const validInput = validator(enteredValue);
  const invalidInput = isTouched && !validInput;

  function handleEnteredValueChange(
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | undefined
  ) {
    if (typeof event === "undefined") {
    } else {
      setEnteredValue(event.target.value);
    }
  }

  function handleBlur() {
    setIsTouched(true);
  }

  function reset() {
    setEnteredValue("");
    setIsTouched(false);
  }

  return {
    value: enteredValue,
    hasError: invalidInput,
    handleEnteredValueChange,
    handleBlur,
    reset,
  };
};

export default useInput;
