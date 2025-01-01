import React from "react";
import { Box, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import StudentProfileInput from "../components/StudentProfileInput";
import StudentStepperCard from "../components/StudentStepperCard";
import NavigationButtons from "../components/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../hooks/Session";
import { APIType } from "api_spec";
import AcademicHistoryListInput from "../components/AcademicHistoryListInput";
import LanguageHistoryListInput from "../components/LanguageHistoryListInput";
import { BarNavigationCard } from "web_component";

interface StudentInfoInputProps {
    onNext: () => void;
    onPrevious: () => void;
}
const StudentInfoInputContainer: React.FC<StudentInfoInputProps> = ({
    onNext,
    onPrevious,
}) => {
    const { control, handleSubmit } =
        useForm<APIType.StudentType.ReqCreateStudentProfile>();

    const onSubmit = async (
        studentInfo: APIType.StudentType.ReqCreateStudentProfile,
    ) => {
        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(studentInfo),
            });
            if (response.ok) {
                console.log("Student Data Submitted Successfully");
                onNext();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    <StudentProfileInput control={control} />
                    <AcademicHistoryListInput control={control} />
                    <LanguageHistoryListInput control={control} />
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
        </form>
    );
};

export default StudentInfoInputContainer;
