import React, { useState, useEffect }  from 'react'
import firebase from "../firebase";

function Stats(props) {
    const userId = props.userId
    const [stats, setStats] = useState({numOfRunsCompleted : 0,
        numOfSunriseSeen: 0, 
        numOfSunsetSeen: 0, 
        totalDistanceCovered: 0})

    useEffect(()=>{
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
            const data = response.val();
            let numOfRunsCompleted = 0
            let numOfSunriseSeen = 0
            let numOfSunsetSeen = 0
            let totalDistanceCovered = 0
            if(data.runs){
                data.runs.forEach(run=>{
                    if(run.completed === true){
                        numOfRunsCompleted = numOfRunsCompleted + 1
                        if(run.timeOfDay==="sunrise"){
                            numOfSunriseSeen = numOfSunriseSeen + 1
                        }
                        if(run.timeOfDay==="sunset"){
                            numOfSunsetSeen = numOfSunsetSeen + 1
                        }
                        if(run.distance === '5km'){
                            totalDistanceCovered = totalDistanceCovered + 5
                        }
                        if(run.distance === "10km"){
                            totalDistanceCovered = totalDistanceCovered + 10
                        }
                        if(run.distance === "Half Marathon"){
                            totalDistanceCovered = totalDistanceCovered + 21.0975
                        }
                        if(run.distance === "Marathon"){
                            totalDistanceCovered = totalDistanceCovered + 42.195
                        }
                    }
                })

            }
            const runstats = {
                numOfRunsCompleted : numOfRunsCompleted,
                numOfSunriseSeen: numOfSunriseSeen, 
                numOfSunsetSeen: numOfSunsetSeen, 
                totalDistanceCovered: totalDistanceCovered
            }
            setStats(runstats)
        })
    },[userId])

    return (
        
        <div className='stats'>
            {props.showH2 && <h2>Stats</h2>}
            <div className='statsSection'>
                <div className="sunBox">
                    <h3>Sunrise Seen</h3>
                    <h4 className="statValue">{stats.numOfSunriseSeen}</h4>
                </div>
                <div className="sunBox">
                    <h3>Sunsets Seen</h3>
                    <h4 className="statValue">{stats.numOfSunsetSeen}</h4>
                </div>
                <div className="sunBox">
                    <h3>Runs Completed</h3>
                    <h4 className="statValue">{stats.numOfRunsCompleted}</h4>
                </div>
                <div className="sunBox">
                    <h3>Distance Covered</h3>
                    <h4 className="statValue">{stats.totalDistanceCovered.toFixed(2)}Km</h4>
                </div>
            </div>
        </div>
    )
}

export default Stats
