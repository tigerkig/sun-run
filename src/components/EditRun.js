import React from 'react'
import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams , useNavigate, Link} from 'react-router-dom'
import moment from 'moment'
import runType from '../functions/runType';

import {convertH2M, convertM2H} from '../functions/runType.js'


import axios from 'axios';

function EditRun2() {
    const {userId} = useParams()
    const {runId} = useParams()
    const [userInfo, setUserInfo] = useState({})
    const [runObj, setRunObj] = useState({})

    const [showForm, setShowForm] =useState(true)
    const [showResult, setShowResult]=useState(false)

    const today = new Date();

    const [runResults, setRunResults] = useState({});
    
    let navigate = useNavigate();
    const handleChange = (e)=>{
        const {id, value} = e.target;
        setRunObj({...runObj, [id]:value})
    }

    const getSunTime=(e)=>{
        e.preventDefault()
        const totalTime = runType(runObj)
        console.log(`TotalTime to ${runObj.pace} a ${runObj.distance} is ${totalTime} mins`, )
        axios({
            url: `https://api.sunrise-sunset.org/json?lat=${userInfo.coords.lat}=${userInfo.coords.long}=${runObj.date}`,
            method: "GET",
            dataResponse: "json",
        }).then((response) => {
            const sunrise = response.data.results.sunrise;
            const sunset = response.data.results.sunset;
            console.log(' lat : ', userInfo.coords.lat)
            console.log(' long : ', userInfo.coords.long)
            console.log(' sunset : ', sunset)
            console.log(' sunrise : ', sunrise)

            let startTime;

            if( runObj.timeOfDay === "sunrise" ){
                const sunriseInMinute = convertH2M(sunrise);
                const startingTime = sunriseInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunrise")
            }else {
                const sunsetInMinute = convertH2M(sunset);
                const startingTime = sunsetInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunset")
            }
            console.log(`${runObj.timeOfDay} is at ${runObj.timeOfDay==="sunrise" ? sunrise : sunset } so you should start your ${runObj.pace} by ${startTime} to cover ${runObj.distance}`);
            setRunResults({
                ...runObj,
                sunTime: runObj.timeOfDay === "sunrise"? sunrise : sunset,
                departureTime: startTime,
                runDuration: totalTime            
            })
            setShowResult(true)
            setShowForm(false)
            
        })
    }
    const handleConfirmation=(e)=>{
        const editedRunObj ={
            id: runId,
            pace: runResults.pace,
            distance: runResults.distance,
            timeOfDay: runResults.timeOfDay,
            date: runResults.date,
            departureTime: runResults.departureTime,
            runDuration: runResults.runDuration,
            suntime: runResults.sunTime,
            completed: false
        }
        let key
        userInfo.runs.forEach((run, idx)=>{
            if(run.id === runId){
                key = idx
                }
            })
        const dbRef = firebase.database().ref(`/sample/${userId}/runs/${key}`);
        dbRef.update(editedRunObj);
        navigate(`/dashboard/${userId}`);

    }
    useEffect(() => {
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
            // store user data in data variable
            const data = response.val();
            console.log(data)
            setUserInfo(data)
            data.runs.forEach(element => {
                if(element.id ===runId){
                    setRunObj(element)
                    console.log(element)
                }
            });
        })
    }, [userId, runId])

    return (
        <main className="card-full">
            <section  className="runSetupPage signup-form wrapper">
                {showForm ?
                <>
                    <div>
                        <Link to={`/dashboard/${userId}`}>
                            <i class="fas fa-arrow-left"></i> Dashboard
                        </Link>
                        <h1>Edit Run</h1> 
                    </div>
                    <form action="" className="flex-column" onSubmit={getSunTime}>
                        <label  htmlFor="pace" className="sr-only">Pace</label>
                        <select name="pace" id="pace" onChange={handleChange} value={runObj.pace}>
                            <option value="Jog">Jog (8km/hr)</option>
                            <option value="Run">Run (16km/h)</option>
                        </select>
                        <label htmlFor="distance" className="sr-only">Distance</label>
                        <select name="distance" id="distance" onChange={handleChange} required value={runObj.distance}>
                            <option value="5km">5km</option>
                            <option value="10km">10km</option>
                            <option value="Half Marathon">Half Marathon</option>
                            <option value="Marathon">Marathon</option>
                        </select>
                        <label htmlFor="date" className="sr-only">Start date:</label>
                        <input type="date" id="date" name="date"
                        onChange={handleChange}
                        value={runObj.date}
                        min={moment(today).format('YYYY-MM-DD')}/>

                        <label htmlFor="timeOfDay" className="sr-only">Select Time of Day</label>
                        <select name="timeOfDay" id="timeOfDay" onChange={handleChange} required value={runObj.timeOfDay}>
                            <option value="sunrise">Sunrise</option>
                            <option value="sunset">Sunset</option>
                        </select>
                        <button className="btn-gray">Next</button>
                    </form>
                </>
                :null
                }
                {showResult ? 
                <div  className='runResults flex-column'>
                    <h3 style={{color: '#ffffff'}}>Here's our suggestion for you</h3>
                    {
                        runResults ?
                        <>
                            <div>
                                <h4>{moment(runResults.date).format('dddd')}</h4>
                                <h4>{runResults.date}</h4>
                                <p>Total Run Time:  {runResults.runDuration} mins</p>
                                <p>Departure Time:  {runResults.departureTime}</p>
                                <p>{runResults.timeOfDay === "sunrise"? "Sunrise" : "Sunset"  }: {runResults.sunTime}</p> 
                            </div>
                        </>
                        : null
                    }
                    <div className="select-box">
                        <button id='confirmRun' className="btn-red" onClick={handleConfirmation}>Save Run</button>
                        <button id='editRun' className="btn-red" onClick={()=>setShowForm(true)}>Edit Run</button>
                    </div>
                </div>
                : null}
            </section>
            
        </main>
    )
}

export default EditRun2
