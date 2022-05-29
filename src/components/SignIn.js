import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"
import firebase from '../firebase';



function SignIn() {
  let navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [userKeys, setUserKeys] = useState([]);
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    const dbRef = firebase.database().ref(`sample`);

    dbRef.once('value', snapshot => {
      setUserKeys(Object.keys(snapshot.val()))
    })


  }, [])

  const handleInputChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setUserId(e.target.value)
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const userInput = userId;

    console.log('user keys: ', userKeys)

    if (userKeys.includes(userInput)){
      navigate(`/dashboard/${userInput}`)
      console.log('YES')
    } else {
      setIsValid(false);
      console.log('nothing here')
    }

  }

  return (
    <main className="card-full">
      <section className="signup-form wrapper flex-column">
        <h1>Welcome Back</h1>
        <form action="" className="flex-column" onSubmit={handleSignIn}>
          <label htmlFor="name" className="sr-only">Please enter your user Id</label>
          <input type="text" id="name" name="name" onChange={handleInputChange} placeholder="Your User ID" value={userId} />
          {!isValid && <p>Can't find that user id, please try again!</p>}
          <button className="btn-gray" onSubmit={handleSignIn}>Sign In</button>
          <Link className="signin-links" to="/signup">Don't Have an account? Sign Up</Link>
        </form>
      </section>
    </main>
  )
}

export default SignIn
