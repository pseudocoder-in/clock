
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './FlipClock.css';

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px; /* Add the desired gap value here */
`;

const Container = styled.div`
    width: 300px;
    height: 300px;
    background-color: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;


function getTime() {
    var t = new Date();
    return {
        'Total': t,
        'Hours': t.getHours(),
        'Minutes': t.getMinutes(),
        'Seconds': t.getSeconds()
    };
}


function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    return {
        'Total': t,
        'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
        'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
        'Minutes': Math.floor((t / 1000 / 60) % 60),
        'Seconds': Math.floor((t / 1000) % 60)
    };
}


function CountdownTracker(label, value) {

    var el = document.createElement('span');

    el.className = 'flip-clock__piece';
    el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>' +
        '<span class="flip-clock__slot">' + label + '</span>';

    this.el = el;

    var top = el.querySelector('.card__top'),
        bottom = el.querySelector('.card__bottom'),
        back = el.querySelector('.card__back'),
        backBottom = el.querySelector('.card__back .card__bottom');

    this.update = function (val) {
        val = ('0' + val).slice(-2);
        if (val !== this.currentValue) {

            if (this.currentValue >= 0) {
                back.setAttribute('data-value', this.currentValue);
                bottom.setAttribute('data-value', this.currentValue);
            }
            this.currentValue = val;
            top.innerText = this.currentValue;
            backBottom.setAttribute('data-value', this.currentValue);

            this.el.classList.remove('flip');
            void this.el.offsetWidth;
            this.el.classList.add('flip');
        }
    }

    this.update(value);
}

function Clock(countdown, callback) {

    countdown = countdown ? new Date(Date.parse(countdown)) : false;
    callback = callback || function () { };

    var updateFn = countdown ? getTimeRemaining : getTime;

    this.el = document.createElement('div');
    this.el.className = 'flip-clock';

    var trackers = {},
        t = updateFn(countdown),
        key, timeinterval;

    for (key in t) {
        if (key === 'Total') { continue; }
        trackers[key] = new CountdownTracker(key, t[key]);
        this.el.appendChild(trackers[key].el);
    }

    var i = 0;
    function updateClock() {
        timeinterval = requestAnimationFrame(updateClock);

        // throttle so it's not constantly updating the time.
        if (i++ % 10) { return; }

        var t = updateFn(countdown);
        if (t.Total < 0) {
            cancelAnimationFrame(timeinterval);
            for (key in trackers) {
                trackers[key].update(0);
            }
            callback();
            return;
        }

        for (key in trackers) {
            trackers[key].update(t[key]);
        }
    }

    setTimeout(updateClock, 500);
}


const FlipClock = (props) => {
    const divRef = useRef(null);
    const [clock] = useState(new Clock());

    useEffect(() => {
        let currEle = divRef.current;
        if (currEle) {
            divRef.current.appendChild(clock.el);
        }

        // Clean up when component unmounts
        return () => {
            if (currEle) {
                currEle.removeChild(clock.el);
            }
        };
    }, [clock.el]);

    const handleScaleChange = (increment, signedScale) => {
        const cardElements = document.querySelectorAll('.card');
        const cardLabelElements = document.querySelectorAll('.flip-clock__slot');
        let flag = increment ? 1 : -1;
        let scale = Math.abs(signedScale);
        cardElements.forEach(cardElement => {
            const currentFontSize = parseInt(window.getComputedStyle(cardElement).fontSize);
            const newFontSize = currentFontSize + (flag*scale*20);
            cardElement.style.fontSize = `${newFontSize}px`;
        });
        // cardLabelElements.forEach(cardElement => {
        //     const currentFontSize = parseInt(window.getComputedStyle(cardElement).fontSize);
        //     const newFontSize = currentFontSize + (flag*scale*20);
        //     cardElement.style.fontSize = `${newFontSize}px`;
        // });
    };

    useEffect(() => {
        handleScaleChange(props.incrementing, props.scale);
    }, [props.incrementing, props.scale]);

    useEffect(() => {
        const cardElements = document.querySelectorAll('.card');
        const cardLabelElements = document.querySelectorAll('.flip-clock__slot');
        cardElements[cardElements.length-1].style.display = props.showSecond ? 'block' : 'none';
        cardLabelElements[cardElements.length-1].style.display = props.showSecond ? 'block' : 'none';
    }, [props.showSecond]);

    return (
        <ContainerDiv ref={divRef}></ContainerDiv>
    );
};

export default FlipClock;

