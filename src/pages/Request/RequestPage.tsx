import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RequestProfile } from "web_component";
import { StickyButton } from "web_component";
import { Flex, Box, Separator, Container, Button } from "@radix-ui/themes";
import { useSession } from "../../hooks/Session";
import { APIType } from "api_spec";

interface RequestProfileProps {
    request_id: number;
    consumer_id: number;
    title: string;
    subtitle: string;
    head_count: number;
    reward_price: number;
    currency: "USD" | "KRW" | "JPY" | "";
    content: string;
    are_needed: string;
    are_required: string;
    request_status: number;
    start_time: string;
    end_time: string;
    address: string;
    address_coordinate: { lat: number; lng: number };
    provide_food: boolean;
    provide_trans_exp: boolean;
    prep_material: string;
    created_at: Date;
    updated_at: Date;
    start_date: Date;
    end_date: Date;
    corp_id: number;
    corp_name: string;
    nationality: string;
    corp_num: number;
}

const RequestPage = () => {
    const [request, setRequest] = useState<RequestProfileProps | null>(null);
    const [sticky, setSticky] = useState<
        React.ComponentProps<typeof StickyButton>
    >({
        viewerType: 1,
        innerText: "신청하기",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { data: session, status } = useSession();
    const roles = session?.user?.roles || [];
    const { request_id } = useParams<{ request_id: string }>();

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/requests/${request_id}`);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch data: ${response.statusText}`,
                    );
                }

                const body = await response.json();

                setRequest({
                    request_id: body.request_id,
                    consumer_id: body.consumer_id,
                    title: body.title,
                    subtitle: body.subtitle,
                    head_count: body.head_count,
                    reward_price: body.reward_price,
                    currency: body.currency,
                    content: body.content,
                    are_needed: body.are_needed,
                    are_required: body.are_required,
                    request_status: body.request_status,
                    start_time: body.start_time,
                    end_time: body.end_time,
                    address: body.address,
                    address_coordinate: body.address_coordinate,
                    provide_food: body.provide_food,
                    provide_trans_exp: body.provide_trans_exp,
                    prep_material: body.prep_material,
                    created_at: new Date(body.created_at),
                    updated_at: new Date(body.updated_at),
                    start_date: new Date(body.start_date),
                    end_date: new Date(body.end_date),
                    corp_id: body.corp_id,
                    corp_name: body.corp_name,
                    nationality: body.nationality,
                    corp_num: body.corp_num,
                });

                setSticky({
                    viewerType: roles.includes("student") ? 1 : 2,
                    innerText: roles.includes("student")
                        ? "신청하기"
                        : "추천학생",
                });
            } catch (error) {
                console.error("Error fetching request data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData(); //eslint-disable-line
    }, [request_id]);

    const handleStickyButtonClick = async () => {
        if (roles.includes("student")) {
            try {
                const response = await fetch("/api/message/chatroom", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        request_id: request_id,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to send chatroom request");
                }

                const data = await response.json();
                console.log("Chatroom created:", data);
            } catch (error) {
                console.error("Error creating chatroom:", error);
            }
        } else {
            navigate(`/student/list/${request_id}`);
        }
    };

    if (loading) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>Loading...</h2>
                    </Box>
                </Flex>
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>Error</h2>
                        <p>{error}</p>
                    </Box>
                </Flex>
            </Container>
        );
    }

    if (!request) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>No Request Found</h2>
                    </Box>
                </Flex>
            </Container>
        );
    }

    const goToCorporationProfile = () => {
        navigate(`/corporation/${request.corp_id}`);
    };

    return (
        <Container
            width={{
                initial: "300px",
                xs: "520px",
                sm: "768px",
                md: "100%",
            }}
        >
            <Flex direction="column" align="center" justify="center">
                <RequestProfile {...request} />
                <Box my="3">
                    <Button onClick={goToCorporationProfile}>
                        Corporation Profile
                    </Button>
                </Box>
            </Flex>
            <StickyButton {...sticky} onClick={handleStickyButtonClick} />
        </Container>
    );
};

export default RequestPage;
