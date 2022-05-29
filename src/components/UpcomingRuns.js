import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams , useNavigate} from 'react-router-dom'
import Stats from './Stats';
import moment from 'moment'

import '../modal.css'
import Modal from './Modal';


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function UpcomingRuns() {
    let navigate = useNavigate();
    // useState declarations
    const [userRuns, setUserRuns] = useState([]) // initial runs state, has both incomplete and complete
    const [userInfo, setUserInfo]=useState({}) // adding this because i need it keep it- 😈sara
    // run modal states
    const [modal, setModal] = useState(false);
    // const [runId, setRunId] = useState('');
    const [runKey, setRunKey] = useState('');

    const [runObjForModal, setRunObjForModal]=useState({})
    const [upcomingRuns, setUpcomingRuns]=useState([])

    const today = new Date();

    // get userId from url and store in userId
    const user = useParams()

    useEffect( () => {

        // make database connection using our userId
        const dbRef = firebase.database().ref(`/sample/${user.userId}`);

        // fetch user data stored in database
        dbRef.on('value', (response) => {
        
            // store user data in data variable
            const data = response.val();

            // store all user's runs in useState
            if(data.runs){ // added by 😈sara 
                setUserRuns(data.runs)
                let upcomingRuns=[]
                data.runs.forEach(run=>{
                    if(run.completed=== false){
                        upcomingRuns.push(run)
                    }
                })
                setUpcomingRuns(upcomingRuns)
            }
            setUserInfo(data) // added by 😈sara 

        })
    },[user.userId])
    // function to set and open modal
    function runModal(runId) {
        setModal(true);
        // setRunId(runId);
        userRuns.forEach((run, idx)=>{
            if(run.id === runId){
                setRunObjForModal(run)
            }
        })
        for(let i=0; i<userRuns.length;i++) {

            if(userRuns[i].id === runId) {
                setRunKey(i);
            }
        }
    }
    const editRun =(runObj)=>{
        console.log(runObj)
        navigate(`/editRun/${user.userId}/${runObj.id}`);
    }
    return (
        <>
        <div className="flex-container">
            <h2>Upcoming Runs</h2>
            {/* list the user's upcoming runs */}
            <div className="flex-horizontal">
                {
                    upcomingRuns.length===0 ? 
                        <p>No upcoming Run</p> : null
                    }

                {   
                    // using map to iterate through userRuns array
                    userRuns
                    .filter(run => run.completed === false)
                    .map((run) => {
                            return(
                                <div className="runs-panel" key={run.id}>
                                    {/* <Link key={user.userId} to={`/run/${run.id}`}> */}
                                        <button className="runs-item font-white" onClick={() => runModal(run.id)}>

                                            <p>{capitalize(run.timeOfDay)} Run: <span>
                                                { 
                                                    (run.date.split('-')[2] - today.getDate() ) < 7 ? 
                                                        (run.date.split('-')[2] - today.getDate() ) < 2 ? 
                                                            (run.date.split('-')[2] - today.getDate() ) === 0 ? 
                                                                (run.date.split('-')[2] - today.getDate() ) === -1 ? 
                                                                `Yesterday at ${run.departureTime}` 
                                                                :`Today at ${run.departureTime}` 
                                                            :`Tomorrow at ${run.departureTime}` 
                                                        :`${moment(run.date).format('dddd')} at ${run.departureTime}`

                                                    : moment(run.date).format('MMMM Do YYYY')
                                                }
                                                </span></p>
                                            <i className="fas fa-ellipsis-h"></i>
                                        </button>
                                </div>
                            )
                    })
                }
            </div>

            <Stats  showH2={true} userId={user.userId}/>

        </div>        
            {/* modal for displaying run info and note pad */}
            {
                modal === true ? (
                    <Modal 
                    runKey={runKey} 
                    user={user}
                    editRun={editRun}
                    runObjForModal={runObjForModal}
                    setRunKey={setRunKey}
                    userInfo={userInfo}
                    setUserRuns={setUserRuns}
                    setModal={setModal}
                    />
                ) : (
                    null
                )
            }

        </>
    )
}

export default UpcomingRuns