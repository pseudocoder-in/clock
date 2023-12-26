
import React, { useEffect, useRef, useState } from 'react';
import NoSleep from 'nosleep.js';
import FlipClock from '../views/FlipClock';
import styled from 'styled-components';
import Switch from "react-switch";


const TransparentButton = styled.button`
    background-color: transparent;
    border: none;
`;

const IsFullscreen = () => {
    return document.fullscreenElement !== null;
};

//const noSleep = new NoSleep();

const Clock = () => {
    const [isFullscreen, setIsFullscreen] = useState(IsFullscreen());
    const [noSleep] = useState(new NoSleep());
    const [scale, setScale] = useState(0);
    const [incrementing, setIncrementing] = useState(false);
    const [showSecond, setShowSecond] = useState(false);

    console.log("clock")
    const handleFullScreenChange = () => {
        if (!document.fullscreenElement) {
          // Perform actions when leaving full-screen mode
          console.log('Left full-screen mode');
          // Add your callback logic here
        }
      };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
      }, []);
    
    const toggleFullscreen = () => {
        const element = document.documentElement;
        const isFullscreen = IsFullscreen();
        if (!isFullscreen) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            if (noSleep.current) noSleep.current.enable();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            if (noSleep.current) noSleep.current.disable();
        }
        setIsFullscreen(!isFullscreen);
        console.log(!isFullscreen)
    };

    const handleChange = (event) => {
        let incrementing  = scale < parseInt(event.target.value); 
        setScale(parseInt(event.target.value));
        setIncrementing(incrementing);
    };

    const handleSecondToggle = (checked) => { 
        setShowSecond(checked);
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <FlipClock scale={scale} incrementing = {incrementing} showSecond= {showSecond}/>
            </div>
            <div style={{ position: 'fixed', bottom: '30px', right: '10px', display : 'flex' }}>
            { !isFullscreen && 
                
                <div style={{ display: 'flex'}} >
                <div style={{ display: 'flex', flexDirection: 'column', color: 'white', fontSize: 'small'}}>
                <Switch onChange={handleSecondToggle} checked={showSecond} checkedIcon={false} uncheckedIcon = {false} height={20} borderRadius={10} width={40}/>
                <div> Seconds </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', color: 'white', fontSize: 'small'}}>
                <input style={{background: 'transparent'}}
                    type="range"
                    min="-10"
                    max="10"
                    value={scale}
                    onChange={handleChange}
                    onInput={handleChange}
                />
                <div> Scale </div>
                </div>
                </div>
            }
            <TransparentButton onClick={toggleFullscreen}>
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </TransparentButton>
            </div>
        </div>
    );
};

export default Clock;
