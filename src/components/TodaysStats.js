import {useParams } from 'react-router-dom';
import firebase from '../firebase';
import { useEffect, useState } from 'react';
import moment from 'moment';
import '../usersCalendar.css'
import axios from 'axios';


function TodaysStats(){
const [todaySunrise, setTodaySunrise] = useState('');
const [todaySunset, setTodaySunset] = useState('');

const user = useParams()

useEffect( () => {

    const dbRef = firebase.database().ref(`/sample/${user.userId}`);

    dbRef.on('value', (response) => {
    
        const data = response.val();
        axios({
        url: `https://api.sunrise-sunset.org/json?lat=${data.coords.lat}=${data.coords.long}&date=today`,
        method: "GET",
        dataResponse: "json",
        }).then((response) => {

        const todaySunriseUTC = response.data.results.sunrise;
        const todaySunsetUTC = response.data.results.sunset;
        setTodaySunrise(todaySunriseUTC)
        setTodaySunset(todaySunsetUTC)
        })
    })   
    
}, [user.userId])

const todayDate = moment().format("dddd, MMMM Do")

return (
<div className="flex-column todays-metrics">
    <h2>{todayDate}</h2>
    <p>Sunrise: {todaySunrise}</p>
    <p>Sunset: {todaySunset}</p>
</div>
)
}

export default TodaysStats;
