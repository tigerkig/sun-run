import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import firebase from "../firebase";
import moment from "moment";
import '../usersCalendar.css'

// for modals:
import Modal from './Modal';

import TodaysStats from "./TodaysStats";


function UsersCalendar(props) {
    const userId = props.userId
    const user = useParams()

    let navigate = useNavigate();
    const [runDate, setRunDate] = useState(new Date());
    const [runs, setRuns] = useState([])

    // for modal
    const [runKey, setRunKey] = useState('');
    const [modal, setModal] = useState(false);
    const [runObjForModal, setRunObjForModal]=useState({})
    const [userInfo, setUserInfo]=useState({}) // adding this because i need it keep it- 😈sara

        // note validity check
    // const [isNoteValid, setIsNoteValid] = useState(0); // added by dallan
    // const [didNoteUpdate, setDidNoteUpdate] = useState(0);
    
    const editRun =(runObj)=>{
        console.log(runObj)
        navigate(`/editRun/${user.userId}/${runObj.id}`);
    }
    




    // function to set and open modal
    function runModal(runId) {
        setModal(true);
        // setRunId(runId);
        runs.forEach((run, idx)=>{
            if(run.id === runId){
                setRunObjForModal(run)
            }
        })
        for(let i=0; i<runs.length;i++) {
            if(runs[i].id === runId) {

                setRunKey(i);
            }
        }
    }

    const renderingRunsArray =({ date, view })=>{
        // "2021-11-30"
        let className = ''
        if(runs){

            if(runs.length>0){
                runs.forEach(run=>{
                    if(run.completed ===false){
                        if(run.date === moment(date).format("YYYY-MM-DD") ){
                            className=`runDay ${run.id}`
                        }
                    }
                    if(run.completed ===true){
                        if(run.date === moment(date).format("YYYY-MM-DD") ){
                            className='runDone'
                        }
                    }
                })
            }
            return className
        }
    }

    const addRun =(e)=>{
        e.preventDefault()
        console.log(
            'add new run'
        )
        navigate(`/settingUpRun/${userId}`)
    }
    const settings =(e)=>{
        e.preventDefault()
        navigate(`/settings/${userId}`)
    }
    const selectDate=(value, e)=>{
        let runId =''
        if (e.target.nodeName ==="ABBR"){
            const parent = e.target.parentElement
            const something =parent.classList
            const testArray = []
            something.forEach(some=>{
                testArray.push(some)
            })
            if(testArray[testArray.length-2] ==="runDay"){
                runId = testArray[testArray.length-1]
                runModal(runId)
            }
            else {
                navigate(`/settingUpRun/${userId}/${moment(value).format("YYYY-MM-DD")}`)
            }
        }
        if (e.target.nodeName ==="BUTTON"){
            
            const something =e.target.classList
            const testArray = []
            something.forEach(some=>{
                testArray.push(some)
            })
            if(testArray[testArray.length-2] ==="runDay"){
                runId = testArray[testArray.length-1]
                runModal(runId)

            }
            else {
                navigate(`/settingUpRun/${userId}/${moment(value).format("YYYY-MM-DD")}`)
            }
        }
        console.log(runId)
        // console.log(moment(value).format("YYYY-MM-DD"))
        // navigate(`/settingUpRun/${userId}/${moment(value).format("YYYY-MM-DD")}`)
    }
    
    useEffect(()=>{
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
            const data = response.val();
            setRuns(data.runs)
            setUserInfo(data) // added by 😈sara 

        })
    },[userId])
    return(
        <div className="calendar-container flex-column">
            <div className="btn-cont">
                <button className="btn-gray small" onClick={addRun}><i className="fas fa-plus"></i></button>
                <button className="btn-gray small" onClick={settings}><i className="fas fa-users-cog"></i></button>
            </div>

            <TodaysStats/>
            

            <div className="calendar-wrapper">
                <Calendar
                onChange={setRunDate}
                value={runDate}
                tileClassName={renderingRunsArray}
                minDate={new Date()}
                onClickDay={selectDate}
                />
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
                    setUserRuns={setRuns}
                    setModal={setModal}
                    />
                ) : (
                    null
                )
            }
        </div>
    )
}
export default UsersCalendar;