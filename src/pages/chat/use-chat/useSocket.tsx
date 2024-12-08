import { useMutation } from "@tanstack/react-query";
import {
    useSentMessages,
    useFailedMessages,
    useSendingMessages,
} from "./Stores/MessageStore";
import { useChatRoomStore } from "./Stores/ChatRoomStore";
import { Socket } from "socket.io-client";
import { useSession } from "../../../hooks/Session";
type MessageStates = "SENDING" | "SENT" | "UNREAD" | "READ";

interface ChatMessageBase {
    _id: string; // Id should set by server-side. Before that tag Id with randomly generated string
    seq: number;
    unreadCount: number;
    senderName?: string;
    direction: "outgoing" | "inbound";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TextContent extends ChatMessageBase {
    contentType: "text";
    content: string;
}

export interface ImageContent extends ChatMessageBase {
    contentType: "image";
    url: string;
    data: ArrayBuffer;
}

export interface FileContent extends ChatMessageBase {
    contentType: "file";
    url: string;
    data: ArrayBuffer;
}

export interface MapContent extends ChatMessageBase {
    contentType: "map";
    content: string;
}

export type MessageContentType =
    | TextContent
    | FileContent
    | MapContent
    | ImageContent;

interface ReqSendMessage {
    _id: string; // set random string to identify sending and failed message object
    senderId: string;
    chatRoomId: string;
    state: MessageStates;
    message: MessageContentType;
}

export interface resMessage {
    _id: string;
    seq: number;
    chatRoomId: string;
    unreadCount: number;
    senderName: string;
    contentType: "text";
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export const useSocket = () => {
    const {
        socket,
        tempId,
        activeRoom,
        setTempId,
        updateChatRoom,
        updateOnConnect,
    } = useChatRoomStore((state) => state);
    const session = useSession();

    const pushToSent = useSentMessages((state) => state.push);
    const setSentMessageByIdx = useSentMessages(
        (state) => state.setMessageByIdx,
    );
    const getSentMessageLength = useSentMessages(
        (state) => state.getMessageLength,
    );
    const updateSentUnread = useSentMessages((state) => state.updateUnread);

    const pushToSending = useSendingMessages((state) => state.push);
    const removeSending = useSendingMessages((state) => state.removeMessage);

    const pushToFailed = useFailedMessages((state) => state.push);

    const { mutate, isError, isSuccess } = useMutation({
        mutationFn: async ({
            socket,
            req,
            chatRoomId,
        }: {
            socket: Socket | null;
            req: ReqSendMessage;
            chatRoomId: string;
        }) => {
            if (socket === null) return new Promise(() => null);

            pushToSending(chatRoomId, req.message);
            const res = await socket.emit("sendMessage", JSON.stringify(req));
            //const res = await fetch(`http://localhost:8080/sendMessage`, {method: 'post', headers: {"Content-Type": "application/json"}, body: JSON.stringify({chatRoomId: chatRoomId, message: message})});
            console.log("Mutations response", res);
            return res;
        },
        onError: (error, variables, context) => {
            removeSending(variables.chatRoomId, variables.req.message._id);
            pushToFailed(variables.chatRoomId, variables.req.message);
            console.log("error: ", error);
        },
        onSuccess: (data, variables, context) => {
            console.log("success", data);
            console.log("success context", context);
            console.log("success context", variables);
            // remove sending message with variables
            removeSending(variables.chatRoomId, variables.req.message._id);
            // add received message from server
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter
        },
    });

    const onJoin = (chatRoomId: string) => {
        socket.on("userJoined", (res, callback) => {
            console.log("Joined to room", res);
            const { messages, lastReadSequences } = JSON.parse(res);
            console.log("Joined", messages, lastReadSequences, session);
            setSentMessageByIdx(
                chatRoomId,
                messages,
                getSentMessageLength(chatRoomId),
            );
            updateSentUnread(chatRoomId, lastReadSequences);
            if (messages.length !== 0) {
                updateChatRoom(messages.at(-1));
            }
            // TODO: update device last seq
            callback({
                status: "ok",
            });
        });
        socket.on("someoneSent", (res, callback) => {
            const data = JSON.parse(res);
            pushToSent(chatRoomId, data);
            updateChatRoom(data);
            console.log(
                "Someone sent message: ",
                data,
                " - ",
                getSentMessageLength(chatRoomId),
            );
            callback({
                id: tempId,
                lastReadSeq: getSentMessageLength(chatRoomId),
                status: "ok",
            });
        });
        socket.on("updateUnread", (res) => {
            const lastReadSequences = res;
            console.log("Updateunread", res);
            updateSentUnread(chatRoomId, lastReadSequences);
        });
        socket.emit("userTryJoin", {
            chatRoomId: chatRoomId,
            deviceLastSeq: getSentMessageLength(chatRoomId),
            id: tempId,
        });
    };

    const onUnjoin = () => {
        socket.off("someoneSent");
        socket.off("updateUnread");
        socket.off("userJoined");
        socket.emit("userTryUnjoin");
    };

    const onSending = (chatRoomId: string, content: MessageContentType) => {
        if (activeRoom === undefined) {
            console.log("Sending on no activeRoom");
            return undefined;
        }
        if (tempId === undefined) {
            return undefined;
        }
        const req: ReqSendMessage = {
            _id: Math.floor(Math.random() * 100000).toString(),
            state: "SENDING",
            senderId: tempId,
            chatRoomId: chatRoomId,
            message: content,
        };

        mutate({ socket: socket, req: req, chatRoomId: chatRoomId });

        return { isError, isSuccess };
    };
    const onConnecting = () => {
        socket.once("connected", (res, callback) => {
            console.log("Chat user tmp ID: ", res);

            setTempId(res.id);

            updateOnConnect(res.chatRooms);

            callback({
                id: res.id,
                status: "ok",
            });
        });

        socket.connect();

        socket.on("updateChatRoom", (res, callback) => {
            const data = JSON.parse(res);
            // @ts-ignore
            console.log("Update chatroom");
            data.direction = "inbound";
            if (activeRoom?.chatRoomId !== data.chatRoomId) {
                console.log("Update chatroom: ", data, ", ", socket.id);
                updateChatRoom(data);
            }
            if (activeRoom !== undefined) {
                pushToSent(activeRoom.chatRoomId, data);
            }
        });
    };
    const onDestroying = () => {
        console.log("Destroying on remove");
        // remove all events
        socket.off();
        socket.disconnect();
    };

    return { onJoin, onUnjoin, onSending, onConnecting, onDestroying };
};
