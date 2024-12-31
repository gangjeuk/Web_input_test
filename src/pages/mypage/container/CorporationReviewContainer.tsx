import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import { ReviewOfCorpCard } from "web_component";
import { APIType } from "api_spec";

const CorporationReviewContainer = () => {
    const [corpReview, setCorpReviews] =
        useState<APIType.CorporationReviewType.ResGetCorpReview>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/corporation-review`, {
                    method: "GET",
                    credentials: "include",
                });
                const data: APIType.CorporationReviewType.ResGetCorpReview =
                    await response.json();
                setCorpReviews(data);
            } catch (error) {
                console.error("Error fetching corporation review data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    return (
        <>
            <Box sx={{ marginTop: "16px" }}>
                <Grid container spacing={3}>
                    {corpReview?.review.map((review, index) => (
                        <Grid size={6} key={index}>
                            <ReviewOfCorpCard {...review} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default CorporationReviewContainer;
