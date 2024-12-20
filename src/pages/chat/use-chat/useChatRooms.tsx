import { useMutation } from "@tanstack/react-query";
import { useChatRoomStore } from "./Stores/ChatRoomStore";

export const useChatRooms = () => {
    const setChatRooms = useChatRoomStore((state) => state.setChatRooms);

    const { mutate, data, isError, isSuccess } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/chatroom", {
                method: "get",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            return data;
        },
    });

    return { mutate, data, setChatRooms, isError, isSuccess };
};
