import { useState } from 'react';

const useInput = validator => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const validInput = validator(enteredValue);
  const invalidInput = isTouched && !validInput;

  function handleEnteredValueChange(e) {
    setEnteredValue(e.target.value);
  }

  function handleBlur(e) {
    setIsTouched(true);
  }

  function reset() {
    setEnteredValue('');
    setIsTouched(false);
  }

  // handleFormSubmit(e){
  //     e.preventDefault();
  //     setIsTouched(true);
  //     if(invalidInput){
  //         return
  //     }
  //     console.log(enteredValue);

  // }

  return {
    value: enteredValue,
    hasError: invalidInput,
    handleEnteredValueChange,
    handleBlur,
    reset,
  };
};

export default useInput;
