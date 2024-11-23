import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Diary from "../assets/opendiary2.png";

const ViewData = ({ selectedDate }) => {
    const Diary = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/imgup.png';
    const backend = 'http://123.0.0.1:5000' || 'http://localhost:5000';

    const [textValue, setTextValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const email = localStorage.getItem('email');

    const fetchDataByDateAndEmail = async (entryDate, email) => {
        try {
            const response = await axios.get(`${backend}/api/diary/get-entry`, {
                params: { entryDate, email }
            });
            const { content, imageUrl } = response.data;
            setTextValue(content || 'No content available for this date');
            setImageUrl(imageUrl || '');
        } catch (error) {
            console.error('Error fetching data:', error);
            setTextValue('Error fetching data');
            setImageUrl('');
        }
    };
    
    useEffect(() => {
        fetchDataByDateAndEmail(selectedDate, email);
    }, [selectedDate, email]);

    return (
        <div style={{ padding: '20px', paddingTop: '100px' }}>
            <div style={{
                width: '93%',
                height: '60px',
                display: 'flex',
                marginLeft: '50px',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            </div>

            <div style={{
                width: '803px',
                height: '552.5px',
                margin: 'auto',
                padding: '20px',
                backgroundImage: `url(${Diary}),url('https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/opendiary2.png')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{
                        width: '44%',
                        height: '510px',
                        marginLeft: '50px',
                        backgroundColor: 'transparent',
                        padding: '10px',
                        overflow: 'hidden',
                        display: 'flex',         // Added to enable flexbox centering
                        alignItems: 'center',   // Vertically center the image
                        justifyContent: 'center' // Horizontally center the image
                    }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="Diary entry" style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                        ) : (
                            <p>No image available for this date</p>
                        )}
                    </div>

                    
                    <div style={{
                        width: '47%',
                        height: '500px',
                        marginRight: '20px',
                        backgroundColor: 'transparent',
                        padding: '10px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Dancing Script, cursive',
                        boxSizing: 'border-box',
                    }}>
                        <span style={{ marginRight: '10px', color: 'black' }}>{selectedDate}</span><br/><br/>
                        {textValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewData;
