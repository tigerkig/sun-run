import React from 'react'
import firebase from '../firebase';


function MarkComplete(props) {

    // function to mark user's run complete
    const markRunComplete = () => {

        // make db connection
        const dbRef = firebase.database().ref(`/sample/${props.userId}/runs/${props.runKey}`);

        // set 'completed' to be true
        const mark = {completed:true}
        
        // push mark obj to db
        dbRef.update(mark);

        // close the modal
        props.closeModal();
    }

    return (
        <button aria-label="mark run complete" className="runs-item" onClick={() => markRunComplete()}>
            <i className="fas fa-check-circle"></i>
        </button>
    )
}

export default MarkComplete
