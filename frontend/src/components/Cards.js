import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";

const Timeline = ({ setCurrentPage, setSelectedDate }) => { 

  const backend = 'http://123.0.0.1:5000' || 'http://localhost:5000';


  const [entries, setEntries] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(10);
  const fetchedDates = new Set();

  useEffect(() => {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      dates.push(date.toISOString().substr(0, 10));
    }
    setDateList(dates);
    setCurrentIndex(0);
    setEntries([]);
    fetchedDates.clear();
  }, [year, month]);

  const fetchDataByDateAndEmail = async (entryDate, email) => {
    try {
      const response = await axios.get(`${backend}/api/diary/get-entry`, {
        params: { entryDate, email },
      });
      return {
        date: entryDate,
        imageUrl: response.data.imageUrl || null,
      };
    } catch (error) {
      console.error(`Error fetching data for ${entryDate}:`, error);
      return { date: entryDate, imageUrl: null };
    }
  };

  const loadEntries = async () => {
    if (loading || currentIndex >= dateList.length) return;

    setLoading(true);
    const email = localStorage.getItem("email");
    const newEntries = [];
    const endIndex = Math.min(currentIndex + 5, dateList.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const entryDate = dateList[i];
      if (!fetchedDates.has(entryDate)) {
        const entry = await fetchDataByDateAndEmail(entryDate, email);
        if (entry.imageUrl !== null) {
          newEntries.push(entry);
          fetchedDates.add(entryDate);
        }
      }
    }

    setEntries((prevEntries) => [
      ...prevEntries,
      ...newEntries.filter(entry => !prevEntries.some(prev => prev.date === entry.date)),
    ]);
    
    setCurrentIndex(endIndex);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, [dateList]);

  const handleCardClick = (entryDate) => {
    setSelectedDate(entryDate); // Set the selected date
    setCurrentPage('viewdata'); // Change page to 'viewdata'
  };

  return (
    <div style={{ width: "90%", margin: "0 auto", paddingTop: "100px", paddingLeft: "40px", paddingRight: "40px" }}>
      <h1 style={{ position: "sticky", top: "0", padding: "10px 0", textAlign: "center" ,color:'white'}}>
        Diary Entries
      </h1>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <select 
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{
            cursor: 'pointer',
            appearance: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '1.125em',
            fontWeight: '800',
            letterSpacing: '2px',
            color: '#fff',
            backgroundColor: '#644dff',
            border: '2px solid #4836bb',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 0 #4836bb',
            transition: 'all 0.1s ease',
            filter: 'drop-shadow(0 15px 20px rgba(101, 77, 255, 0.39))',
            padding: "5px",
            marginRight: '10px'}}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>

        <select 
          value={year}
          onChange={(e) => setYear(Number(e.target.value))} 
          style={{
            cursor: 'pointer',
            appearance: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '1.125em',
            fontWeight: '800',
            letterSpacing: '2px',
            color: '#fff',
            backgroundColor: '#644dff',
            border: '2px solid #4836bb',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 0 #4836bb',
            transition: 'all 0.1s ease',
            filter: 'drop-shadow(0 15px 20px rgba(101, 77, 255, 0.39))',
            padding: "5px",
            marginRight: '10px'}}         
        >
          {Array.from({ length: 10 }, (_, index) => year - index).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <InfiniteScroll
        pageStart={0}
        loadMore={loadEntries}
        hasMore={currentIndex < dateList.length}
        loader={
          <div style={{ textAlign: "center", margin: "20px 0", color:'white' }} key={0}>
            Loading ...
          </div>
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {entries.map((entry) => (
            <div
              key={entry.date}
              onClick={() => handleCardClick(entry.date)}
              style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "10px",
                width: "30%",
                margin: "10px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                color:'white'
              }}
            >
              {entry.imageUrl ? (
                <img
                  src={entry.imageUrl}
                  alt={`Diary entry for ${entry.date}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    color:'white'
                  }}
                />
              ) : (
                <div style={{ padding: "20px", color: "#888", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  No image available for {entry.date}
                </div>
              )}
              <div style={{ padding: "10px" }}>
                <h5 style={{ margin: "10px 0", fontSize: "1.1em" }}>{entry.date}</h5>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Timeline;
