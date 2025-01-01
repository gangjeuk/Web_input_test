import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { APIType } from "api_spec";
import CorpNumInput from "../components/CorpNumInput";
import {
    BarNavigationCard,
    CorpProfileInput,
    StudentStepperCard,
} from "web_component";
import { useForm, useWatch } from "react-hook-form";
import ConsumerInfoInput from "../components/ConsumerInfoInput";

interface CorpInfoInputProps {
    onNext: () => void;
    onPrevious: () => void;
    handleConsumerInfo: (corpId: number, phoneNumber: string) => void;
}
const CorpInfoInputContainer: React.FC<CorpInfoInputProps> = ({
    onNext,
    onPrevious,
    handleConsumerInfo,
}) => {
    const { control, handleSubmit } = useForm();
    const [corpData, setCorpData] =
        useState<APIType.CorporationType.ReqCreateCorpProfile>();

    const phoneNumber = useWatch({
        control,
        name: "phoneNumber",
    });

    const onSubmit = async (
        corpInfo: APIType.CorporationType.ReqCreateCorpProfile,
    ) => {
        try {
            const response = await fetch("/api/corporations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(corpInfo),
            });
            const corpId = await response.json();
            handleConsumerInfo(corpId, phoneNumber);
            if (response.ok) {
                console.log("Data Submitted Successfully");
                onNext();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const handleCorpNumSubmit = (
        data: APIType.CorporationType.ReqCreateCorpProfile,
    ) => {
        setCorpData(data);
        console.log("Received Data:", data);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                <CorpNumInput onCorpNumSubmit={handleCorpNumSubmit} />
                {corpData && (
                    <CorpProfileInput
                        control={control}
                        initialData={corpData}
                    />
                )}
                <ConsumerInfoInput control={control} />
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" },
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" },
                    top: { md: "50%" },
                    transform: { md: "translateY(-50%)" },
                    order: { xs: -1, md: 1 },
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                <StudentStepperCard currentStep={1} />
                <BarNavigationCard
                    onNext={handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                />
            </Container>
        </Box>
    );
};

export default CorpInfoInputContainer;
