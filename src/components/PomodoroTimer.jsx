import React, { useState, useEffect, useRef } from 'react';
import timerEndSound from '../assets/TimesUp.mp3';

const PomodoroTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const [showPrompt, setShowPrompt] = useState(false);
    const [learningItems, setLearningItems] = useState([]);
    const [learningItemsChecked, setLearningItemsChecked] = useState([]);
    const [currentItem, setCurrentItem] = useState('');

    const timerEndAudioRef = useRef(null);
  
    useEffect(() => {
      let interval;
  
      if (isActive) {
        interval = setInterval(() => {
          if (seconds === 0) {
            if (minutes === 0) {
              setIsBreak(!isBreak);
              setMinutes(isBreak ? 5 : 25);
            if (!isBreak) {
                setMinutes(5);
            }

            // Play the sound at timer end
          // timerEndAudioRef.current.play();
          if (timerEndAudioRef.current) {
            timerEndAudioRef.current.currentTime = 0; // Reset audio to the beginning
            timerEndAudioRef.current.play();
          }

          setShowPrompt(true);

            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          } else {
            setSeconds(seconds - 1);
          }
        }, 1000);
      } else {
        clearInterval(interval);
      }

      // if (minutes === 0 && seconds === 0) {
      //   setShowPrompt(true);
      // }
  
      return () => {
        clearInterval(interval);
      };
    }, [isActive, minutes, seconds, isBreak]);
  
    const toggleTimer = () => {
      setIsActive(!isActive);
    };
  
    const resetTimer = () => {
      setIsActive(false);
      setIsBreak(false);
      setMinutes(25);
      setSeconds(0);
    };

    // const handleAddItem = () => {
    //     if (currentItem.trim() !== '') {
    //       setLearningItems([...learningItems, currentItem]);
    //       setCurrentItem('');
    //     }
    //   };

      const handleDurationChange = (selectedMinutes) => {
        if (!isActive) {
          setMinutes(selectedMinutes);
          setSeconds(0);
          setShowPrompt(false); // Reset the prompt when changing duration
        }
      };
      const handleToggleItem = (index, checked) => {
        const updatedCheckedState = [...learningItemsChecked];
        updatedCheckedState[index] = checked;
        setLearningItemsChecked(updatedCheckedState);
      };
    
      const handleAddItem = () => {
        if (currentItem.trim() !== '') {
          setLearningItems([...learningItems, currentItem]);
          setLearningItemsChecked([...learningItemsChecked, false]);
          setCurrentItem('');
        }
      };
      const handleDeleteCheckedItems = () => {
        const updatedLearningItems = learningItems.filter(
          (_, index) => !learningItemsChecked[index]
        );
        const updatedLearningItemsChecked = learningItemsChecked.filter(
          (_, index) => !learningItemsChecked[index]
        );
      
        setLearningItems(updatedLearningItems);
        setLearningItemsChecked(updatedLearningItemsChecked);
      };

    return (
        <div className="pomodoro-timer">
        <h1>{isBreak ? "Break Time ": "Let's Work"}</h1>
        <div className="timer">
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
        <div className="buttons">
          <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
        <div className="duration-options">
        <button onClick={() => handleDurationChange(25)}>25 Min</button>
        <button onClick={() => handleDurationChange(15)}>15 Min</button>
        <button onClick={() => handleDurationChange(1)}>1 Min</button>
      </div>
        <div className="audio-container">
          {/* Embed the YouTube video here */}
          <iframe
            title="YouTube Video"
            width="500"
            height="300"
            src="https://www.youtube.com/embed/jfKfPfyJRdk"
            allowFullScreen
          ></iframe>
        </div>
        <audio ref={timerEndAudioRef}>
      <source src={timerEndSound} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
        {showPrompt && (
          <div className="prompt">
            <p>What are we learning next?</p>
            <input
              type="text"
              value={currentItem}
              onChange={(e) => setCurrentItem(e.target.value)}
            />
            <button onClick={handleAddItem}>Add</button>
            <button onClick={handleDeleteCheckedItems}>Delete Checked</button>
            <ul>
              {learningItems.map((item, index) => (
                <li key={index}>
                  <input type="checkbox" 
                  onChange={(e) => handleToggleItem(index, e.target.checked)}
                  />
                  <span className={learningItemsChecked[index] ? 'strikethrough' : ''}>
                  {item}
                </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  
  export default PomodoroTimer;