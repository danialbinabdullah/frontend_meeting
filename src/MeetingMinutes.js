import React, { useState, useEffect, useRef } from 'react';
import './MeetingMinutes.css';
import profilePic from './assets/profilepic.png';
import noResultGif from './assets/noresult.gif';

// Import status icons
import liveIcon from './assets/live.png';
import upcomingIcon from './assets/upcoming.png';
import concludedIcon from './assets/concluded.png';

const MeetingMinutes = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const profileRef = useRef(null);

  const fetchMeetings = () => {
    fetch('http://127.0.0.1:5000/api/meetings')
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data);
        const sortedMeetings = parsedData.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        setMeetings(sortedMeetings);
        setFilteredMeetings(sortedMeetings);
      });
  };

  useEffect(() => {
    fetchMeetings();

    const intervalId = setInterval(fetchMeetings, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();

    const updatedMeetings = meetings.map(meeting => {
      const meetingDate = new Date(`${meeting.date} ${meeting.time}`);
      const meetingDateString = meetingDate.toDateString();
      let status = 'concluded';
      if (meetingDate > currentDate) {
        status = 'upcoming';
      } else if (meetingDateString === currentDateString) {
        status = 'live';
      }
      return { ...meeting, status };
    });

    // Sort meetings: live first, then upcoming, then concluded
    const sortedMeetingsByStatus = updatedMeetings.sort((a, b) => {
      const statusOrder = { live: 1, upcoming: 2, concluded: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      setFilteredMeetings(sortedMeetingsByStatus.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        const meetingDay = meetingDate.getDate().toString();
        const meetingMonth = meetingDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
        const meetingYear = meetingDate.getFullYear().toString();
        const meetingFullDate = meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase();
        const meetingHalfDate = meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toLowerCase();

        return (meeting.title && meeting.title.toLowerCase().includes(lowercasedSearchTerm)) ||
          (meeting.date && meeting.date.includes(lowercasedSearchTerm)) ||
          meetingDay.includes(lowercasedSearchTerm) ||
          meetingMonth.includes(lowercasedSearchTerm) ||
          meetingYear.includes(lowercasedSearchTerm) ||
          meeting.status.toLowerCase().includes(lowercasedSearchTerm) ||
          meetingFullDate.includes(lowercasedSearchTerm) ||
          meetingHalfDate.includes(lowercasedSearchTerm);
      }));
    } else {
      setFilteredMeetings(sortedMeetingsByStatus);
    }
  }, [searchTerm, meetings]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleLogout = () => {
    // Add your logout logic here, e.g., redirect to login screen
  };

  const handleTranscriptClick = (transcriptLink) => {
    const baseURL = "http://13.50.219.28:5000/";
    const fullURL = baseURL + transcriptLink;
    window.open(fullURL, "_blank");
  };

  return (
    <div className="meeting-minutes">
      <header>
        <h1>Meeting Minutes</h1>
        <div className="profile" ref={profileRef}>
          <span>Donna Stroupe</span>
          <img
            className="profile-pic"
            src={profilePic}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <div className="filter">
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search a meeting"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="search-icon fas fa-search"></i>
        </div>
      </div>
      <div className="meetings">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => {
            const [monthNum, day, year] = meeting.date.split('/');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[parseInt(monthNum) - 1];

            return (
              <div key={meeting._id.$oid} className={`meeting ${meeting.status}`}>
                <div className="date">
                  <span className="date-number">{day}</span>
                  <span className="date-text">{monthName} {year}</span>
                </div>
                <div className="details">
                  <h2>{meeting.title}</h2>
                  <span>{meeting.time}</span>
                  <img
                    className={`status-icon ${meeting.status === 'live' ? 'beep' : ''}`}
                    src={
                      meeting.status === 'live'
                        ? liveIcon
                        : meeting.status === 'upcoming'
                          ? upcomingIcon
                          : concludedIcon
                    }
                    alt={meeting.status}
                  />
                </div>
                <button
                  className={`transcript ${meeting.status}`}
                  disabled={meeting.status === 'upcoming'}
                  onClick={() => handleTranscriptClick(meeting.transcription_collection_name)}
                >
                  {meeting.status === 'live' ? 'Live Transcript' : 'Transcript'}
                </button>
              </div>
            );
          })
        ) : (
          <div className="no-meetings">
            <img src={noResultGif} alt="No Results" className="no-results-gif" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingMinutes;
