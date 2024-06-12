import React, { useState, useEffect, useRef } from 'react';
import './MeetingMinutes.css';
import profilePic from './black.jpeg'; // Import the profile picture
import noResultGif from './assets/noresult.gif'; // Import the no results gif

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

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/meetings')
      .then(response => response.json())
      .then(data => {
        const statusOrder = { 'live': 1, 'upcoming': 2, 'concluded': 3 };
        const sortedMeetings = data.sort((a, b) => {
          const dateA = new Date(a.date.split(' ')[1] + ' ' + a.date.split(' ')[0]);
          const dateB = new Date(b.date.split(' ')[1] + ' ' + b.date.split(' ')[0]);
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return dateA - dateB;
        });
        setMeetings(sortedMeetings);
        setFilteredMeetings(sortedMeetings);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date.split(' ')[1] + ' ' + meeting.date.split(' ')[0]);
      return meeting.status === 'live' || meetingDate >= now;
    });

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      setFilteredMeetings(filtered.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        const meetingDay = meetingDate.getDate().toString();
        const meetingMonth = meetingDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
        const meetingYear = meetingDate.getFullYear().toString();
        const meetingStatus = meeting.status.toLowerCase();
        const meetingFullDate = meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase();
        const meetingHalfDate = meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toLowerCase();

        return meeting.title.toLowerCase().includes(lowercasedSearchTerm) ||
          meeting.date.includes(lowercasedSearchTerm) ||
          meetingDay.includes(lowercasedSearchTerm) ||
          meetingMonth.includes(lowercasedSearchTerm) ||
          meetingYear.includes(lowercasedSearchTerm) ||
          meetingStatus.includes(lowercasedSearchTerm) ||
          meetingFullDate.includes(lowercasedSearchTerm) ||
          meetingHalfDate.includes(lowercasedSearchTerm);
      }));
    } else {
      setFilteredMeetings(filtered);
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
            const [monthNum, day, year] = meeting.date.split('/'); // Corrected order
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[parseInt(monthNum) - 1];

            return (
              <div key={meeting.id} className={`meeting ${meeting.status}`}>
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
