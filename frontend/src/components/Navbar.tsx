import {
  Button,
  Img,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import React, { useState } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsFillBellFill } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdOutlineAddToQueue } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { userAction } from "../Redux/userReducer";
import { getFeedAsync, setNewPostAsync } from "../Redux/postAction";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import MyDropzone from "./uploadContainer/Dropzone";

interface INavbarProps {
  showBell: boolean;
  notificationCount: number;
}

const Navbar = ({ showBell, notificationCount }: INavbarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [caption, setCaption] = useState("");
  const [imgLink, setImgLink] = useState("");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );
  const isProfileOpen = useAppSelector((state) => state.user.isProfileOpen);

  const user = useAppSelector((state) => state.user.user);

  const changeProfileVisibility = () => {
    dispatch(userAction.changeProfileVisiblity());
    if (user) {
      dispatch(userAction.setDisplayedUser(user));
    }
  };
  const uploadPostHandler = () => {
    // Call dispatch here
    if (user) {
      const data = {
        img: imgLink,
        desc: caption,
        token: user.token,
      };
      dispatch(setNewPostAsync(data));
      setCaption("");
      setImgLink("");
    }
  };
  return (
    <>
      {/* overlay of add post */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* image sectino  */}
            <MyDropzone imgLink={imgLink} setImgLink={setImgLink} />

            {/* caption */}
            <Text my="1rem">Caption : </Text>
            <Textarea
              placeContent="Enter your caption here !"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></Textarea>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                // onfail
                if (imgLink === "") {
                  toast({
                    title: "Failed !",
                    description: "You need to add a pic to post something!",
                    status: "warning",
                    duration: 1000,
                    isClosable: true,
                    position: "top",
                  });

                  return;
                }

                // on success
                toast({
                  title: "pic uploaded",
                  description: "Your pic is uploaded.",
                  status: "success",
                  duration: 1000,
                  isClosable: true,
                  position: "top",
                });
                uploadPostHandler();
                onClose();
              }}
            >
              <HiUpload
                color="white"
                display="none"
                // _hover={{ display: "block" }}
              />{" "}
              <Text mx="1rem" _hover={{}}>
                Upload
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* navbar  */}
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        backgroundColor="#636363"
        // backgroundColor="#636363"
        borderBottomRadius="7px"
        flexDir="row"
        px={["0.5rem", "0.5rem", "1rem", "1rem", "1rem", "1rem"]}
        py="0.5rem"
      >
        {/* Navbar Icon and Logo */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          color="white"
          // fontSize={["0.8rem", "1rem", "1.5rem", "1.5rem", "1.5rem", "1.5rem"]}
        >
          <Box cursor="pointer" display="flex" onClick={() => navigate("/")}>
            {/* <Img
              width="8rem"
              height="3.3rem"
              src="./img/logo.png"
              transition="200ms"
              backgroundColor="transparent"
              _hover={{ width: "8.2rem", height: "3.5rem" }}
            /> */}
            <Text>Media</Text>
          </Box>
        </Box>
        {/* Home, Search, AddPost and Notification */}
        <Box
          display="flex"
          flexDir="row"
          color="white"
          fontWeight="bold"
          gap={["0.5rem", "1rem", "1.3rem", "1.3rem", "1.3rem", "1.3rem"]}
          alignItems="center"
        >
          <Box
            cursor="pointer"
            fontSize={[
              "1rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
            ]}
            _hover={{
              fontSize: [
                "1.1rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
              ],
            }}
            transition="200ms"
            onClick={() => {
              if (user) {
                isUserAuthenticated && dispatch(getFeedAsync(user.token));
                if (isProfileOpen) {
                  dispatch(userAction.changeProfileVisiblity());
                }
                navigate("/");
              }
            }}
          >
            <AiOutlineHome />
          </Box>
          <Box
            cursor="pointer"
            fontSize={[
              "1rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
            ]}
            _hover={{
              fontSize: [
                "1.1rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
              ],
            }}
            transition="200ms"
            onClick={() => {
              navigate("/search");
              if (isProfileOpen) {
                dispatch(userAction.changeProfileVisiblity());
              }
            }}
          >
            <AiOutlineSearch />
          </Box>
          <Box
            cursor="pointer"
            fontSize={[
              "1rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
            ]}
            _hover={{
              fontSize: [
                "1.1rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
              ],
            }}
            transition="200ms"
            onClick={() =>
              isUserAuthenticated
                ? onOpen()
                : toast({
                    title: "Failed !",
                    description: "Login or Signup first",
                    status: "warning",
                    duration: 1000,
                    isClosable: true,
                    position: "top",
                  })
            }
          >
            <MdOutlineAddToQueue />
          </Box>
          {/* <Box
            cursor="pointer"
            fontSize={[
              "1rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
              "1.5rem",
            ]}
            _hover={{
              fontSize: [
                "1.1rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
                "1.6rem",
              ],
            }}
            transition="200ms"
          >
            <AiOutlineHeart />
          </Box> */}
        </Box>
        {/* Progile and Chat */}
        <Box
          display="flex"
          flexDir="row"
          gap={["0.5rem", "0.8rem", "1rem", "1rem", "1rem", "1rem"]}
          alignItems="center"
          color="white"
          fontWeight="bold"
        >
          {isUserAuthenticated && (
            <Box
              cursor="pointer"
              fontSize={[
                "1rem",
                "1.5rem",
                "1.5rem",
                "1.5rem",
                "1.5rem",
                "1.5rem",
              ]}
              _hover={{
                fontSize: [
                  "1.1rem",
                  "1.6rem",
                  "1.6rem",
                  "1.6rem",
                  "1.6rem",
                  "1.6rem",
                ],
              }}
              transition="200ms"
              onClick={() => {
                navigate("/chat");
                if (isProfileOpen) {
                  dispatch(userAction.changeProfileVisiblity());
                }
              }}
            >
              {!showBell ? (
                <RiSendPlaneFill />
              ) : (
                <Box position="relative">
                  <BsFillBellFill />
                  {notificationCount !== 0 ? null : (
                    <Box
                      position="absolute"
                      top="-5px"
                      right="-1px"
                      width="14px"
                      height="14px"
                      borderRadius="50%"
                      backgroundColor="red.600"
                      color="white"
                      fontSize="0.6rem"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {notificationCount}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* User Avatar Profile */}
          <Box cursor="pointer">
            {isUserAuthenticated ? (
              <Box
                onClick={() =>
                  isUserAuthenticated ? changeProfileVisibility() : null
                }
              >
                <Img
                  src={
                    user?.avatar
                      ? user?.avatar
                      : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  width={["1rem", "1.5rem", "2rem", "2rem", "2rem", "2rem"]}
                  height={["1rem", "1.5rem", "2rem", "2rem", "2rem", "2rem"]}
                  transition="200ms"
                  borderRadius="50%"
                  _hover={{
                    width: [
                      "1.1rem",
                      "1.6rem",
                      "2.1rem",
                      "2.1rem",
                      "2.1rem",
                      "2.1rem",
                    ],
                    height: [
                      "1.1rem",
                      "1.6rem",
                      "2.1rem",
                      "2.1rem",
                      "2.1rem",
                      "2.1rem",
                    ],
                  }}
                />
              </Box>
            ) : (
              <Box display="flex" flexDir="row" gap="0.5rem">
                <Button
                  variant="outline"
                  size="xs"
                  colorScheme="twitter"
                  fontSize="0.7rem"
                  px="1rem"
                  onClick={() => navigate("/login")}
                >
                  LogIn
                </Button>
                <Button
                  variant="solid"
                  size="xs"
                  colorScheme="twitter"
                  fontSize="0.7rem"
                  px="0.8rem"
                  onClick={() => navigate("/register")}
                >
                  SignUp
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
