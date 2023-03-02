import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker, { IEmojiData } from "emoji-picker-react";
import { Socket } from "socket.io-client";
import { IChat, IUser } from "../../types/reduxTypes";
import { useAppDispatch } from "../../Redux/store";
import { useState } from "react";
import { addOneChatAsync } from "../../Redux/chatAction";
import { Box, Input } from "@chakra-ui/react";
interface IInputContainerProps {
  socket: Socket | undefined;
  clickedFollowingUser: IUser;
  user: IUser | undefined;
}

const InputContainer = ({
  socket,
  clickedFollowingUser,
  user,
}: IInputContainerProps) => {
  //const roomId = useSelector((state)=>state.chat.roomId)

  const dispatch = useAppDispatch();
  const [showEmojji, setShowEmoji] = useState<boolean>(false);
  const [msg, setMsg] = useState("");
  const enterKeyPressed = (
    e: React.KeyboardEvent<HTMLInputElement> | undefined
  ) => {
    if (e?.code === "Enter" || e?.code === "NumpadEnter") {
      submitMessage();
    }
  };
  const newMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const emojiClicked = (
    e: React.MouseEvent<Element, MouseEvent>,
    emoji: IEmojiData
  ) => {
    setShowEmoji(!showEmojji);
    const emojiMessage = emoji.emoji;
    setMsg(msg + emojiMessage);
  };
  const submitMessage = () => {
    if (msg.trim() === "") {
    } else {
      // Call dispatch here for send msg
      const data = {
        text: msg,
        sender: user?._id,
        receiver: clickedFollowingUser._id,
      };
      //dispatch(addOneChatAsync(data));
      socket?.emit(
        "sendMessage",
        {
          text: data.text,
          sender: data.sender,
          receiver: data.receiver,
        },
        (data: IChat) => {
          dispatch(addOneChatAsync(data));
        }
      );
      setMsg("");
    }
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        // border="1.5px solid black"
        borderRadius="3px"
        display="flex"
        flexDir="row"
        justifyContent="space-evenly"
        alignItems="center"
        position="relative"
        boxShadow="0px 0px 6px -3px grey"
      >
        <Box
          width="fit-content"
          height="fit-content"
          fontSize={["0.8rem", "1rem", "1.1rem", "1.3rem", "1.3rem", "1.3rem"]}
        >
          <BsEmojiSmileFill
            cursor="pointer"
            onClick={() => setShowEmoji(!showEmojji)}
          />
        </Box>

        <Box
          position="absolute"
          bottom="80%"
          left="0%"
          display={["none", "block", "block", "block", "block", "block"]}
          className="emoji"
        >
          {showEmojji && <EmojiPicker onEmojiClick={emojiClicked} />}
        </Box>

        <Input
          placeholder="Aa"
          variant="flushed"
          width={["60%", "65%", "65%", "70%", "70%", "70%"]}
          borderRadius="5px"
          height="50%"
          backgroundColor="white"
          pl="5px"
          value={msg}
          onChange={(e) => newMessage(e)}
          onKeyDown={enterKeyPressed}
        />
        <Box
          display="flex"
          width="fit-content"
          justifyContent="center"
          alignItems="center"
          fontSize={["1rem", "1rem", "1.2rem", "1.5rem", "1.5rem", "1.5rem"]}
          transition="100ms"
          cursor="pointer"
          _hover={{ fontSize: "1.7rem" }}
          onClick={submitMessage}
        >
          <RiSendPlaneFill />
        </Box>
      </Box>
    </>
  );
};

export default InputContainer;
