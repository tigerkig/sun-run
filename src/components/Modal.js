import React,{useState} from 'react'
// import components
import MarkComplete from './MarkComplete';
import DeleteRun from './DeleteRun';
import raw from '../includes/list.txt'; // profanity list! >:)

import firebase from '../firebase';

function Modal(props) {
        // const [runObj, setRunObj] = useState([]);
    const [note, setNote] = useState({note: props.runObjForModal.note?props.runObjForModal.note :''});
            // note validity check
    const [isNoteValid, setIsNoteValid] = useState(0); // added by dallan
    const [didNoteUpdate, setDidNoteUpdate] = useState(0);


        // function to add a note to your run
        const addNote = (event) => { // by dallan
            event.preventDefault();
            // fetch the imported profanity list >:) by dallan
            fetch(raw)
            .then(r => r.text())
            .then(text => {
                // create an items array which adds each word by new line
                const keywords = text.split("\n");
            
                // remove empty word at bottom of array
                keywords.splice(452, 1);
    
                // regex for finding specific substring
                const regex = new RegExp('\\b('+keywords.join('|')+')\\b','i');
                
                // function finds if a string contains a value, not case sensitive, from array of words
                function anyValueMatches( o, r ) {
                    // if a word matches any keyword return true
                    for( const k in o ) if( r.test(o[k]) ) return true;
    
                    // if no keyword is found return false
                    return false;
                }
    
                let noteString = note.note;
                
                if(noteString === undefined) {
                    noteString = '';
                }
                let errorCheck = 'false';
                // set isNoteValid to 1 if note contains profanity
                if(anyValueMatches(note,regex)) { 
                    setIsNoteValid(1);
                    setDidNoteUpdate(0);
    
                    setTimeout(function(){
                        setIsNoteValid(0);
                    }, 7000);
    
                    console.log('noteisvalid: ', isNoteValid)
                    errorCheck = 'true';
                }
    
                // set isNoteValid to 2 if note has more than 250 characters
                if(noteString.length > 250) {
                    setIsNoteValid(2);
                    setDidNoteUpdate(0);
    
                    setTimeout(function(){
                        setIsNoteValid(0);
                    }, 9000);
    
                    console.log('noteisvalid: ', isNoteValid)
                    errorCheck = 'true';
                }
    
                // if isNoteValid === 0 then add note to database
                if(errorCheck === 'false') {
                    // make db connection
                    const dbRef = firebase.database().ref(`/sample/${props.user.userId}/runs/${props.runKey}`);
    
                    // push note to db
                    if(dbRef.update(note)) {
                        setDidNoteUpdate(1);
                        setIsNoteValid(0);
    
                        setTimeout(function(){
                            setDidNoteUpdate(0)
                        }, 9000);
                    }
                }
    
            })
        }

            // handle note change
    const handleNoteChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        // set the data to note state
        setNote({
            ...note,
            [name]: value,
        })
    }
    // function to close the modal
    function closeModal() {
        props.setModal(false);

        // reset note validation messages
        setIsNoteValid(0)
        setDidNoteUpdate(0)
    }
    
    return (
        <>
        {/* set modal overlay overtop of entire page */}
        <div className="modal-overlay" onClick={() => closeModal()}></div>
            {/* set modal card overtop of overlay */}
            <div className="modal-card">

                <div className="modal-grid modal-title">
                    <h3>Run information</h3>
                    <div className="modal-options">
                        {/* mark run complete button */}
                        <MarkComplete 
                            runKey={props.runKey} 
                            userId={props.user.userId} 
                            closeModal={closeModal}
                        />

                        {/* edit the run settings */}
                        <button aria-label="edit the run settings" onClick={()=>props.editRun(props.runObjForModal)}>
                            <i className="fas fa-edit"></i>
                        </button>

                        {/* delete the run */}
                        <DeleteRun run={props.runObjForModal} setRunKey={props.setRunKey} userId={props.user.userId} userInfo={props.userInfo} closeModal={closeModal} runReRender={props.setUserRuns}/> {/* added by 😈sara  */}
                    </div>
                </div>

                <div className="modal-grid modal-content">

                    {/* sara  😈 sara */}
                    <p>Date: {props.runObjForModal.date}</p>
                    <p>Departure time: {props.runObjForModal.departureTime}</p>
                    <p>Distance: {props.runObjForModal.distance}</p>
                    <p>Pace: {props.runObjForModal.pace}</p>
                    <p>Duration: {props.runObjForModal.runDuration}</p>
                    <p>Sun time: {props.runObjForModal.suntime}</p>
                    <p>Time of Day: {props.runObjForModal.timeOfDay}</p>
                </div>
                

                {/* set modal card overtop of overlay */}
                <h3>Run notes</h3>

                {/* add sr-only label to textarea */}
                <form className="modal-notepad-form" aria-label="Display income data with a remove income option" onSubmit={addNote}>
                    
                    {didNoteUpdate === 1 && <div className="modal-msg modal-success">Success! You've updated your notes.</div> }
                    {isNoteValid === 1 && <div className="modal-msg modal-error">Watch the language there chief.</div> }
                    {isNoteValid === 2 && <div className="modal-msg modal-error">The note cannot be more than 250 characters long! </div> }
                    
                    <textarea className="modal-notepad" name="note" id="note" onChange={handleNoteChange} value={note.note}></textarea>
                    <button aria-label="Add note" className="btn-green">Update notes</button>
                
                </form>
                <button aria-label="Close run info popup modal" className="modal-close" onClick={() => closeModal()}>
                    <i className="far fa-times-circle"></i>
                </button>
            </div>
        </>
    )
}

export default Modal
