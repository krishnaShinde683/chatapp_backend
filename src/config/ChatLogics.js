
    
    export const isSameSender = (messages, message, index, userId) => {
      if (index > 0 && messages[index - 1].sender?.id === userId) {
        return true;
      }
      return false;
    };

    export const isLastMessage = (messages, i, userId) => {

      return (
        i === messages.length - 1 &&
        messages[i].sender &&
        messages[i].sender?.id !== userId
      );
    };

