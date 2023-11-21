
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const isSameSenderMargin = (messages, message, index, userId) => {
    if (index > 0 && isSameSender(messages, message, index - 1, userId)) {
      return "0px";
    }
    return "15px"; // Adjust the margin as needed
  };

  const isSameUser = (messages, message, index, userId) => {
    if (index > 0 && isSameSender(messages, message, index - 1, userId)) {
      return true;
    }
    return false;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isUserMessage = m.senderId === user._id;

          return (
            <div
              style={{
                display: "flex",
                justifyContent: isUserMessage ? "flex-end" : "flex-start",
              }}
              key={m.id}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender?.name}
                  placement={isUserMessage ? "bottom-end" : "bottom-start"}
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    ml={1}
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender?.name}
                    src={m.sender?.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    isUserMessage ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.message}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

