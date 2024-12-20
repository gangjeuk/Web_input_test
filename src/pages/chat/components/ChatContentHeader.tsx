import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { ChatRoom, useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Flex, Separator, Strong, Text } from "@radix-ui/themes";
import { Button, DialogTitle } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

/*
export const ChatContentHeader = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    const chatRooms = useChatRoomStore((state) => state.chatRooms);

    const [currentUserAvatar, currentUserName] = useMemo(() => {

        if (activeRoom) {
            const chatRoom = chatRooms.find((val: any) => val.chatRoomId === activeRoom)
            console.log(chatRoom)
            if (chatRoom) {
                return [<Avatar src="https://www.w3schools.com/howto/img_avatar.png"/>, chatRoom.consumerName]
            }
        }
        return [undefined, undefined];
    }, [activeRoom]);

    console.log("ChatContentHeader");
    return (
        <>
            {activeRoom && <ConversationHeader>
                {currentUserAvatar}
                <ConversationHeader.Content userName={currentUserName} />
            </ConversationHeader>}
        </>
    )
}
*/

interface ModalButtonProps {
    onExist: MouseEventHandler;
    onApprove: MouseEventHandler;
    onDone: MouseEventHandler;
}
const ModalButton = ({ onExist, onApprove, onDone }: ModalButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
            >
                Modal
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <Button onClick={onExist}>Exit Room</Button>
                    <Button onClick={onApprove}>Approve</Button>
                    <Button onClick={onDone}>Request Done</Button>
                </ModalDialog>
            </Modal>
        </>
    );
};

export const ChatContentHeader = ({
    activeRoom,
}: {
    activeRoom?: ChatRoom;
}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);
    const handleClick = () => {
        setActiveRoom(undefined);
    };
    const handleAlert = () => {
        if (activeRoom === undefined) {
            return;
        }
        alert("a");
    };
    const handleExit = () => {
        if (activeRoom === undefined) {
            return;
        }
    };
    const handleApprove = () => {
        if (activeRoom === undefined) {
            return;
        }
        fetch("/api/message/request", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({ chatRoomId: activeRoom.chatRoomId }),
        })
            .then((val) => val)
            .catch((e) => e);
    };
    const handleDone = () => {
        if (activeRoom === undefined) {
            return;
        }
    };

    useEffect(() => {}, [activeRoom?.chatRoomId]);

    // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
    return (
        <Box
            p="1"
            height="5vh"
            style={{
                border: "1px solid #ccc",
                borderColor: "indigo",
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
            }}
        >
            <Flex
                direction="row"
                gapX="5"
                align="center"
                justify="between"
                p="2"
            >
                <Button
                    onClick={handleClick}
                    startDecorator={<ArrowBackIcon />}
                >
                    Leave Chat
                </Button>

                <Text>
                    <Strong>{activeRoom?.title}</Strong>
                </Text>

                <Box flexGrow="1" />
                <ModalButton
                    onApprove={handleApprove}
                    onDone={handleDone}
                    onExist={handleExit}
                />
            </Flex>
        </Box>
    );
};
