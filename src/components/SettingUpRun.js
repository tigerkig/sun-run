import React, {useState, useEffect, useRef} from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import firebase from '../firebase';
import runType from '../functions/runType';
import {convertH2M, convertM2H} from '../functions/runType.js'
import { v4 as uuidv4 } from 'uuid';
import Footer from './Footer';

function SettingUpRun() {
    const inputPace = useRef();
    const inputDistance = useRef();
    const inputSunTime = useRef();


    let navigate = useNavigate();
    const {selectedDate} = useParams()
    const {userId} = useParams()
      // handleChange targets User's choice of Pace and Distance
    const today = new Date();
    const [showResult, setShowResult]=useState(false)
    const [showForm, setShowForm] =useState(true)
    const [user, setUser]=useState({})
    const [firstRun, setFirstRun] = useState({
    pace :'Select your Pace',
    distance: 'Select the Distance you would like to cover',
    // date: moment(today).format('YYYY-MM-DD'), //be default the value will be the current date
    date: !selectedDate ? moment(today).format('YYYY-MM-DD') : selectedDate, //be default the value will be the current date
    timeOfDay:'Sunrise or Sunset'
    })
    const [alert, setAlert] =useState({alert: false, message: ''})
    // react-calendar__tile react-calendar__month-view__days__day react-calendar__month-view__days__day--neighboringMonth 
    const [runResults, setRunResults]= useState({})

    const handleChange = (e)=>{
        const {id, value} = e.target;
        setFirstRun({...firstRun, [id]:value})
    }
    const getSunTime =(e)=>{
        e.preventDefault()
        console.log(firstRun)
        // getting the total run time for the selected distance
        const totalTime = runType(firstRun)
        console.log(`TotalTime to ${firstRun.pace} a ${firstRun.distance} is ${totalTime} mins`, )
        if(firstRun.pace === 'Select your Pace'){
            inputPace.current.focus();
            setAlert({alert: true, message: 'Please select your pace!'})
            return
        }
        if(firstRun.distance === 'Select the Distance you would like to cover'){
            inputDistance.current.focus();
            setAlert({alert: true, message: 'Please select the Distance you would like to cover!'})
            return
        }
        if(firstRun.timeOfDay === 'Sunrise or Sunset'){
            inputSunTime.current.focus();
            setAlert({alert: true, message: 'Please select Sunrise or Sunset!'})
            return
        }

        axios({
            url: `https://api.sunrise-sunset.org/json?lat=${firstRun.lat}=${firstRun.long}=${firstRun.date}`,
            method: "GET",
            dataResponse: "json",
        }).then((response) => {
            const sunrise = response.data.results.sunrise;
            const sunset = response.data.results.sunset;
            let startTime;
            if( firstRun.timeOfDay === "sunrise" ){
                const sunriseInMinute = convertH2M(sunrise);
                const startingTime = sunriseInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunrise")
            }else {
                const sunsetInMinute = convertH2M(sunset);
                const startingTime = sunsetInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunset")
            }
            console.log(`${firstRun.timeOfDay} is at ${firstRun.timeOfDay==="sunrise" ? sunrise : sunset } so you should start your ${firstRun.pace} by ${startTime} to cover ${firstRun.distance}`);
            setRunResults({
                ...firstRun,
                sunTime: firstRun.timeOfDay === "sunrise"? sunrise : sunset,
                departureTime: startTime,
                runDuration: totalTime            
            })
            setAlert({alert: false, message: ''})

            setShowResult(true)
            setShowForm(false)
        })
    }
    const confirmRun = async()=>{
        const runId = uuidv4();

        console.log(runResults)
        if(user.runs){
            const newRun ={
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
            let usersCurrenRunArray = [...user.runs]
            usersCurrenRunArray.push(newRun)
            const updateUsersRun={
                runs: usersCurrenRunArray
            }
            await firebase.database().ref(`/sample/${userId}`).update(updateUsersRun);
            navigate(`/dashboard/${userId}`);
            
        }else {
            const runObj ={
                runs:[
                    {
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
                ]
            }
            await firebase.database().ref(`/sample/${userId}`).update(runObj);
            navigate(`/dashboard/${userId}`);
        }
    }
    useEffect(() => {
        firebase.database().ref(`/sample/${userId}`).on('value', (response) => {
    const data = response.val();
    console.log('data: ', data)
    setUser({...data})
    setFirstRun({...firstRun, lat: data.coords.lat, long: data.coords.long})
    })
    // eslint-disable-next-line
    }, [])

    return (
        <main className="card-full">
            <section className="runSetupPage signup-form wrapper">
                {
                    showForm? 
                    <> 
                        
                        {user.runs?
                            <div>
                                <Link to={`/dashboard/${userId}`}>
                                    <i className="fas fa-arrow-left"></i> Dashboard

                                </Link>
                                <h1>Add New Run</h1> 
                            </div>
                            : <h1>Let's setup your first run!</h1>
                        }
                        <form action="" className="flex-column" onSubmit={getSunTime}>
                                <label  htmlFor="pace" className="sr-only">Pace</label>
                                  <select ref={inputPace} name="pace" id="pace" onChange={handleChange} defaultValue={firstRun.pace}>
                                    <option  value="Pace" hidden>Pace</option>
                                    <option value="Run">Run (16km/h)</option>
                                    <option value="Jog">Jog (8km/hr)</option>
                                </select>
                                <label htmlFor="distance" className="sr-only">Distance</label>
                  <select ref={inputDistance} name="distance" id="distance" onChange={handleChange} defaultValue={firstRun.distance} required>
                                    <option hidden>Distance</option>
                                    <option value="5km">5km</option>
                                    <option value="10km">10km</option>
                                    <option value="Half Marathon">Half Marathon</option>
                                    <option value="Marathon">Marathon</option>
                                </select>
                                <label htmlFor="date" className="sr-only">Start date:</label>
                                <input type="date" id="date" name="date"
                                onChange={handleChange}
                                value={firstRun.date}
                                min={moment(today).format('YYYY-MM-DD')}/>

                                <label htmlFor="timeOfDay" className="sr-only">Select Time of Day</label>
                  <select ref={inputSunTime} name="timeOfDay" id="timeOfDay" onChange={handleChange} required defaultValue={firstRun.timeOfDay}>
                                    <option hidden>Sunrise or Sunset</option>
                                    <option value="sunrise">Sunrise</option>
                                    <option value="sunset">Sunset</option>
                                </select>
                                <button className="btn-gray">Next</button>
                        </form>
                    </> 
                    : null
                }
                {
                    alert ?  <p className="alert">{alert.message}</p> : null
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
                                <p>{runResults.timeOfDay === "sunrise" ? "Sunrise" : "Sunset"  } : {runResults.sunTime}</p> 
                            </div>
                        </>
                        : null
                    }
                    <div className="select-box">
                        <button id='confirmRun' className="btn-red" onClick={confirmRun}>Save Run</button>
                        <button id='editRun' className="btn-red" onClick={()=>setShowForm(true)}>Edit Run</button>
                    </div>
                </div>
                : null}
            </section>
        <Footer/>
        </main>
    )
}

export default SettingUpRun
