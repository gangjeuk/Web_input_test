import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useSocket } from "../use-chat/useSocket";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { Flex, Box } from "@radix-ui/themes";

export const ChatContainer = () => {
    const { onSending } = useSocket();
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    return (
        <Box
            flexBasis="80%"
            display={{
                initial: activeRoom === undefined ? "none" : "block",
                sm: "block",
            }}
            height="88vh"
        >
            <ChatContentHeader activeRoom={activeRoom} />
            <ChatContentItemList activeRoom={activeRoom} />
            <InputItem onSending={onSending} activeRoom={activeRoom} />
        </Box>
    );
};
