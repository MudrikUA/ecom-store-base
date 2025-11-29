import { useState } from "react";
import { useRecordContext } from "react-admin";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const imgLink = `${import.meta.env.VITE_API_URL}/static/`;

export const ImagesCarousel = () => {
    const record = useRecordContext();
    const [open, setOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    if (!record || !record.images || !Array.isArray(record.images)) return <span>No images</span>;

    const handleThumbnailClick = (index: number) => {
        setCurrentImage(index);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Images</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Мініатюри (thumbnails) */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", overflowX: "auto", padding: "10px" }}>
                        {record.images.map((img, index) => (
                            <img
                                key={index}
                                src={`${imgLink}${img}`}
                                alt={`Thumbnail ${index}`}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    border: currentImage === index ? "2px solid #000" : "2px solid transparent",
                                    transition: "border 0.3s"
                                }}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                    {/* Головне зображення */}
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <img
                            src={`${imgLink}${record.images[currentImage]}`}
                            alt="Main Product"
                            style={{
                                width: "100%",
                                maxHeight: "400px",
                                objectFit: "contain",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer"
                            }}
                            onClick={handleOpen}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
};
