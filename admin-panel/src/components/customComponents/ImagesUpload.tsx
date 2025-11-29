import React, { useEffect, useState } from 'react';
import { useRecordContext, useDataProvider, useNotify } from 'react-admin';
import { Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface ImageUploadProps {
    source?: string;
}

const imgLink = `${import.meta.env.VITE_API_URL}/static/`;
const API_URL = import.meta.env.VITE_API_URL;

export const ImagesUpload: React.FC<ImageUploadProps> = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const [images, setImages] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<Array<{
        file: File;
        preview: string;
    }>>([]);

    useEffect(() => {
        if (record?.images) {
            setImages(record.images);
        }
    }, [record]);

    // Очищаємо URL превью при розмонтуванні компонента
    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [uploadedFiles]);

    const handleRemoveImage = async (image: string) => {
        try {
            await dataProvider.delete('product', {
                id: record.id,
                data: { image },
            });

            setImages(prevImages => prevImages.filter(img => img !== image));
            notify('Image removed successfully', { type: 'success' });
        } catch (error) {
            notify('Error removing image', { type: 'error' });
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveSelectedFile = (index: number) => {
        setUploadedFiles(prev => {
            // Очищаємо URL превью перед видаленням
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleUpload = async () => {
        if (!uploadedFiles.length) return;

        try {
            const formData = new FormData();
            uploadedFiles.forEach(({ file }) => {
                formData.append('images', file);
            });

            const response = await fetch(`${API_URL}/product/${record.id}/uploadImages`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error('Upload failed');
            }

            const newImages = [...images, ...result.data];
            const updateResponse = await dataProvider.update('product', {
                id: record.id,
                data: { 
                    ...record,
                    images: newImages 
                },
                previousData: record,
            });

            setImages(newImages);
            // Очищаємо всі URL превью
            uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
            setUploadedFiles([]);
            notify('Images uploaded successfully', { type: 'success' });
        } catch (error) {
            notify('Error uploading images', { type: 'error' });
        }
    };

    return (
        <Box>
            {/* Галерея існуючих зображень */}
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                {images.map((img, index) => (
                    <Box key={index} position="relative">
                        <img
                            src={`${imgLink}${img}`}
                            alt={`Product ${index}`}
                            width={100}
                            height={100}
                            style={{
                                borderRadius: '5px',
                                objectFit: 'cover',
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(img)}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            {/* Форма завантаження */}
            <Box>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ marginBottom: '10px' }}
                />
                
                {/* Список вибраних файлів з превью */}
                {uploadedFiles.length > 0 && (
                    <Box mb={2}>
                        {uploadedFiles.map(({ file, preview }, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginBottom: 1,
                                    padding: 1,
                                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                    borderRadius: '4px'
                                }}
                            >
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                                <Box sx={{ 
                                    flexGrow: 1,
                                    fontSize: '14px',
                                    color: 'gray'
                                }}>
                                    {file.name}
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveSelectedFile(index)}
                                    sx={{
                                        padding: '4px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Кнопка завантаження */}
                {uploadedFiles.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                    >
                        Upload {uploadedFiles.length} Images
                    </Button>
                )}
            </Box>
        </Box>
    );
};