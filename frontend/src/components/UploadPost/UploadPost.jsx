import React from "react";
import { HiUpload } from "react-icons/hi";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Textarea,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import MyDropzone from "./Dropzone";

function BasicUsage(props) {
  const toast = useToast();
  // eslint-disable-next-line no-unused-vars
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MyDropzone />
            <Text my="1rem">Caption : </Text>
            <Textarea></Textarea>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                toast({
                  title: "pic uploaded",
                  description: "Your pic is uploaded.",
                  status: "success",
                  duration: 1000,
                  isClosable: true,
                });
                onClose();
              }}
            >
              <HiUpload
                color="white"
                display="none"
                _hover={{ display: "block" }}
              />{" "}
              <Text mx="1rem">Upload</Text>
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const UploadPost = (props) => {
  return (
    <>
      <BasicUsage />
    </>
  );
};

export default UploadPost;
