import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import Diary from "../assets/opendiary2.png";
// import POSITIVEIMG from '../assets/POSITIVE.png'; 
// import NEGATIVEIMG from '../assets/NEGATIVE.png'; 
// import MIXEDIMG from '../assets/MIXED.png';
// import NEUTRALIMG from '../assets/NEUTRAL.png'; 
// import save from '../assets/save.png';
// import imgup from '../assets/imgup.png';
// import mic from '../assets/mic.png';
// import translate from '../assets/translate.png';

const AddData = ({ setCurrentPage }) => {

    const backend = 'http://127.0.0.1:5000' || 'http://localhost:5000';
    const POSITIVEIMG = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/POSITIVE.png';
    const NEGATIVEIMG = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/NEGATIVE.png';
    const MIXEDIMG = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/MIXED.png';
    const NEUTRALIMG = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/NEUTRAL.png';
    const save = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/save.png';
    const imgup = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/imgup.png';
    const mic = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/mic.png';
    const translate = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/translate.png';
    const Diary = 'https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/opendiary2.png';
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
    const [textValue, setTextValue] = useState(new Date().toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }));
    const [image, setImage] = useState(null); // State to hold a single uploaded image
    const [sentimentImage, setSentimentImage] = useState(null);
    const [reply, setReply] = useState('');
    const [entry, setEntry] = useState(''); // State to hold the diary text
    const [existingEntry, setExistingEntry] = useState(null); // State to hold the existing entry (if any)
    const imageInput = useRef(null);
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
    const [showSubmit, setShowSubmit] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);
    const [showMic, setShowMic] = useState(false); // eslint-disable-next-line no-unused-vars
    const [audioFile, setAudioFile] = useState(null);// eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [recording, setRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleTranslate = async () => {
        try {
        const response = await axios.post(`${backend}/api/translate`, { text: entry });
        setEntry(response.data.translatedText);
        } catch (error) {
        console.error("Translation error:", error);
        }
    }
    const [mediaRecorder, setMediaRecorder] = useState(null); // Store MediaRecorder instance

    const handleToggleRecording = async () => {
        if (recording) {
            // Stop recording
            mediaRecorder.stop();
            setRecording(false);
        } else {
            // Start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const newMediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            newMediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            newMediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });
                const file = new File([audioBlob], 'recording.m4a', { type: 'audio/m4a' });
                setAudioFile(file);
                await uploadAudio(file);
            };

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder); // Store the MediaRecorder instance
            setRecording(true);
        }
    };

    useEffect(() => {
        let intervalId;
        if (recording) {
            intervalId = setInterval(() => {
              setTimer((prevTime) => prevTime + 1);
            }, 1000);
        }   else {
            clearInterval(intervalId);
            setTimer(0); // Reset the timer when stopping
          }
          return () => clearInterval(intervalId);
        }, [recording]);

    const uploadAudio = async (file) => {
        const formData = new FormData();
        formData.append('audio', file);
        
        try {
            const response = await axios.post(`${backend}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await checkTranscriptionStatus(response.data.jobName);
        } catch (error) {
            console.error('Error uploading audio:', error);
            setErrorMessage('Failed to upload audio. Please try again.');
        }
    };

    const checkTranscriptionStatus = async (jobName) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${backend}/transcription-status/${jobName}`);
                const { TranscriptionJob } = response.data;
                if (TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
                    clearInterval(interval);
                    const transcriptUri = TranscriptionJob.Transcript.TranscriptFileUri;
                    await fetchTranscriptionText(transcriptUri); // Fetch the transcription text
                } else if (TranscriptionJob.TranscriptionJobStatus === 'FAILED') {
                    clearInterval(interval);
                    setErrorMessage('Transcription job failed.');
                    console.error('Transcription job failed');
                }
            } catch (error) {
                console.error('Error checking transcription status:', error);
                setErrorMessage('Error checking transcription status. Please try again.');
                clearInterval(interval);
            }
        }, 5000); // Check status every 5 seconds
    };

    const fetchTranscriptionText = async (transcriptUri) => {
        try {
            const transcriptResponse = await axios.get(transcriptUri);
            const text = transcriptResponse.data.results.transcripts[0].transcript; 
            setEntry(text);
        } catch (error) {
            console.error('Error fetching transcription text:', error);
            setErrorMessage('Error fetching transcription text. Please try again.');
        }
    };
//==================================================================
    // Fetch existing entry when date changes
    const fetchExistingEntry = async (entryDate) => {
        try {
            const response = await axios.get(`${backend}/api/diary/get-entry`, {
                params: { entryDate, email }
            });
            const { content, imageUrl } = response.data;
            
            // Populate the form with the existing data
            setEntry(content || '');
            setImage(imageUrl ? await fetchImageFromUrl(imageUrl) : null);
            setExistingEntry(response.data); // Store the fetched entry
        } catch (error) {
            console.log('No entry found for this date');
            setEntry(''); // Clear the entry field if no entry exists
            setImage(null); // Clear the image if no entry exists
        }
    };

    // Helper to fetch image blob from the URL
    const fetchImageFromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], "existingImage", { type: blob.type });
    };

    // Call fetchExistingEntry when the date changes
    useEffect(() => {
        const dateString = selectedDate.toISOString().substr(0, 10); // Format the date as YYYY-MM-DD
        fetchExistingEntry(dateString);// eslint-disable-next-line
    }, [selectedDate]);

    // Handle text area input change
    const handleDataChange = (event) => {
        setEntry(event.target.value); // Update entry state
    };

    // Handle date change
    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
        setTextValue(newDate.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }));
    };
    const [imageVisible, setImageVisible] = useState(false); // State for controlling image visibility

    useEffect(() => {
        // If sentimentImage is set, start a timer to hide it after 10 seconds
        if (imageVisible) {
            const timer = setTimeout(() => {
                setSentimentImage(null); // Hide the sentiment image after 10 seconds
                setImageVisible(false); // Hide the image
            }, 10000); // 10 seconds delay

            // Cleanup function to clear the timeout if the component is unmounted or image is reset earlier
            return () => clearTimeout(timer);
        }
    }, [imageVisible]); // Run when imageVisible changes
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const entryId = `entry-${Date.now()}`; // Generate unique entry ID
    
        let imageUrl = null;
        if (image) {
            try {
                const formData = new FormData();
                formData.append('image', image);
    
                const uploadResponse = await axios.post(`${backend}/api/diary/upload-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadResponse.data.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    
        // Store or update the diary entry (with image URL if it was uploaded)
        try {
            await axios.post(`${backend}/api/diary/add-entry`, {
                entryId: existingEntry ? existingEntry.entryId : entryId, // Use existing entryId if updating
                email,
                entryDate: selectedDate.toISOString().substr(0, 10),
                content: entry,
                imageUrl, // Store image URL in DynamoDB
            });
            console.log('Diary entry added/updated successfully');
    
            // Fetch sentiment after adding/updating the entry using the new endpoint
            const sentimentResponse = await axios.get(`${backend}/api/diary/get-sentiment-by-email-and-date`, {
                params: {
                    entryDate: selectedDate.toISOString().substr(0, 10), // Use the same date
                    email
                }
            });
            if (entry.length < 20) {
                setReply("You could always say more");
                setSentimentImage(NEUTRALIMG); // Set neutral sentiment image
                return; // Exit early since we don't need to fetch sentiment
            }
            if (sentimentResponse.status === 200) {
                const { randomReply, sentiment } = sentimentResponse.data;
                setReply(randomReply);
                if (sentiment === 'POSITIVE') {
                    setSentimentImage(POSITIVEIMG);
                } else if (sentiment === 'NEGATIVE') {
                    setSentimentImage(NEGATIVEIMG);
                } else if (sentiment === 'MIXED') {
                    setSentimentImage(MIXEDIMG);
                } else {
                    setSentimentImage(NEUTRALIMG);
                }
            }
            setImageVisible(true);
        } catch (error) {
            console.error('Error adding/updating diary entry:', error);
        }
    };
    
    

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Store only the first uploaded image file
        if (file) {
            setImage(file); // Update image state with the file
        }
    };

    const triggerFileInput = () => {
        imageInput.current.click(); // Trigger file input click when the div is clicked
    };

    return (
        <div style={{ padding: '20px' ,paddingTop: '100px' }}>
            <div
                style={{
                    width: '93%',
                    height: '60px',
                    display: 'flex',
                    marginLeft: '50px',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{
                            cursor: 'pointer',
                            width: '360px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            fontSize: '1.125em',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            color: 'black',
                            backgroundColor: '#644dff',
                            border: '2px solid #4836bb',
                            borderRadius: '0.75rem',
                            boxShadow: '0 8px 0 #4836bb',
                            transition: 'all 0.1s ease',
                            filter: 'drop-shadow(0 15px 20px rgba(101, 77, 255, 0.39))',
                            marginTop: '-30px'}}
                >
                <label style={{color:'white', marginRight:'10px', marginTop: '5px'}}>Select Date:</label>
                <input
                    type="date"
                    value={selectedDate.toISOString().substr(0, 10)}
                    onChange={handleDateChange}
                    style={{backgroundColor:'#644dff',
                        borderRadius:'10px',
                        color:'white',
                        fontWeight:'700',
                        height:'40px',
                        width:'150px',
                        paddingLeft:'10px',
                        paddingRight:'10px'
                    }}
                />
                </div>
            </div>
            <div
                style={{
                    width: '803px',
                    height: '552.5px',
                    margin: 'auto',
                    padding: '20px',
                    backgroundImage: `url(${Diary}),url('https://lifelens-images.s3.ap-southeast-2.amazonaws.com/assets/opendiary2.png')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    {/* Left Div for Uploaded Image */}
                    <div
                        style={{
                            width: '44%',
                            height: '510px',
                            marginLeft: '50px',
                            backgroundColor: 'transparent',
                            padding: '10px',
                            overflow: 'hidden',
                            display: 'flex',         // Added to enable flexbox centering
                            alignItems: 'center',   // Vertically center the image
                            justifyContent: 'center' // Horizontally center the image
                        }}
                        onClick={triggerFileInput} // Trigger file input on click
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInput}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} // Hide file input
                        />
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)} // Generate a URL for the selected image
                                alt="Uploaded"
                                style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} // Show the selected image
                            />
                        ) : (
                            // <p style={{ color: 'grey' }}>Click to upload image</p>
                            <img src={imgup} alt='imgup'style={{width:'50px',height:'50px',cursor:'pointer'}}/>
                        )}
                    </div>

                    {/* Right Div for Text Area */}
                    <div
                        style={{
                            width: '47%',
                            height: '490px',
                            marginTop: '5px',
                            marginRight: '5px',
                            backgroundColor: 'transparent',
                            padding: '10px',
                            position:'relative'
                        }}
                    >
                        <span style={{ marginRight: '10px', color: 'black' ,fontWeight:600}}>{textValue}</span>
                        <textarea
                            style={{
                                height: '100%',
                                width: '100%',
                                padding: '10px',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                boxSizing: 'border-box',
                                backgroundColor: 'transparent',
                                fontFamily: 'Dancing Script, cursive',
                                overflow: 'hidden',
                            }}
                            value={entry}
                            onChange={handleDataChange}
                            spellCheck="false" 
                        />
                        <img
                            src={save}
                            alt="save"
                            style={{
                                width: '30px',
                                height: '30px',
                                position: 'absolute',
                                bottom: '0', // Position at the bottom
                                right: '70px', // Position at the right
                                cursor: 'pointer',
                            }}
                            onClick={handleSubmit} // Trigger save action on click
                            onMouseEnter={() => setShowSubmit(true)}
                            onMouseLeave={() => setShowSubmit(false)}
                        />
                        {showSubmit && (
                            <div style={{
                                position: 'absolute',
                                bottom: '35px', // Adjust to position above the icon
                                right: '60px',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap', // Prevent text from wrapping
                            }}>
                                Submit
                            </div>
                        )}    
                        <img
                            src={translate}
                            alt="translate"
                            style={{
                                width: '35px',
                                height: '35px',
                                position: 'absolute',
                                bottom: '-1px', // Position at the bottom
                                right: '160px', // Position at the right
                                cursor: 'pointer'
                            }}
                            onClick={handleTranslate}
                            onMouseEnter={() => setShowTranslate(true)}
                            onMouseLeave={() => setShowTranslate(false)}
                        />
                        {showTranslate && (
                            <div style={{
                                position: 'absolute',
                                bottom: '35px', // Adjust to position above the icon
                                right: '150px',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap', // Prevent text from wrapping
                            }}>
                                Translate
                            </div>
                        )} 
                        <img
                            src={mic}
                            alt="mic"
                            style={{
                                width: '30px',
                                height: '30px',
                                position: 'absolute',
                                bottom: '0', // Position at the bottom
                                right: '250px', // Position at the right
                                cursor: 'pointer',
                                backgroundColor: recording ? 'red' : 'transparent',
                                borderRadius:'10px'
                            }}
                            onClick={handleToggleRecording}
                            onMouseEnter={() => setShowMic(true)}
                            onMouseLeave={() => setShowMic(false)}
                        />
                        {recording && (
                        <div style={{ fontSize: '24px', fontWeight: 'bold' ,width: '30px',
                                height: '30px',
                                position: 'absolute',
                                bottom: '15px', // Position at the bottom
                                right: '270px',}}>
                            {formatTime(timer)}
                        </div>)}
                        {/* Tooltip for Submit text */}
                        {showMic && (
                            <div style={{
                                position: 'absolute',
                                bottom: '35px', // Adjust to position above the icon
                                right: '215px',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap', // Prevent text from wrapping
                            }}>
                                {recording ? 'Stop Recording' : 'Start Recording'}
                            </div>
                        )}                     
                    </div>
                </div>
            </div>
            {/* Sentiment Image Display */}
            {sentimentImage && imageVisible && (
                <div style={{
                    position: 'fixed', // Change to fixed
                    bottom: '0px', // Distance from the bottom
                    left: '0px', // Distance from the left
                    zIndex: 100, // Ensure it's above other components
                }}>
                    <img
                        src={sentimentImage}
                        alt="Sentiment"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Adjust size as needed
                    />
                </div>
            )}
            {sentimentImage && imageVisible && (
            <div style={{
                position: 'fixed',
                bottom: '10px', // Distance from the bottom
                left: '200px', // Distance from the left
                zIndex: 101, // Ensure it's above other components
            }}>
                <div
                    style={{
                        width: '200px', // Adjust width as needed
                        height: '100px', // Adjust height as needed
                        padding: '10px', // Padding for text area
                        borderRadius: '5px', // Rounded corners
                        border: '1px solid #ccc', // Border style
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
                        fontSize: '16px', // Font size
                        overflowY: 'auto', // Allow scrolling if content overflows
                    }}
                >
                    {reply} {/* Display the reply; nothing shown if empty or null */}
                </div>
            </div>
            )}
            
        </div>
    );
};

export default AddData;
