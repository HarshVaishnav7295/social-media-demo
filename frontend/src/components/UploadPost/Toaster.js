import React from 'react'
import { useToast, Button } from '@chakra-ui/react'

function ToastExample() {
    const toast = useToast()
    return (
      <Button
        onClick={() =>
          toast({
            title: 'pic uploaded',
            description: "Your pic is uploaded.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      >
        Show Toast
      </Button>
    )
  }

const Toaster = () => {
  return (
    <ToastExample/>
  )
}

export default Toaster