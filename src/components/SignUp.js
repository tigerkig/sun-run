import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import firebase from '../firebase';
import Footer from './Footer';

function SignUp() {

  // declare navigate to next page
  let navigate = useNavigate();

  // useState declarations
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('canada');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isZipValid, setIsZipValid] = useState(false);
  const [isPostalValid, setIsPostalValid] = useState(false);
  const [isSignupValid, setIsSignupValid] = useState(' ');
  const [isBackendValid, setIsBackendValid] = useState(true);

  // uid generator (for now)
  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // handleNameChange -> setName -> name
  const handleNameChange = (event) => {

    setIsNameValid(false)
    // set name
    setName(event.target.value);

    // this regex requires first and last name
    const nameRegex = /\s*([A-Za-z]{1,}([.,] |[-']| ))+[A-Za-z]+\.?\s*$/g; //first last

    if(nameRegex.test(event.target.value)) {
      setIsNameValid(true);
    }
  }
  // handleEmailChange -> setEmail -> email
  const handleEmailChange = (event) => {
    
    setIsEmailValid(false)

    // set email
    setEmail(event.target.value);

    // check if email is in proper format and is not empty -> set email validation to true
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(emailRegex.test(event.target.value)) {
      setIsEmailValid(true); 
    }  
  }

  // handleCountryChange ->
  const handleCountryChange = (event) => {

    setIsPostalValid(false);
    setIsZipValid(false);

    // set Country
    setCountry(event.target.value);
    setZipcode('');
    setPostalCode('');

  }
  // handlePostalCodeChange ->
  const handlePostalCodeChange = (event) => {
    setIsPostalValid(false);

    // set Country
    setPostalCode(event.target.value);

    const nameRegex = /^[a-zA-z][\d][a-zA-z]$/g; // postal regex

    if (nameRegex.test(event.target.value)) {
      setIsPostalValid(true);
    }
  }
  // handleZipCodeChange ->
  const handleZipcodeChange = (event) => {
    setIsZipValid(false);
    
    // set Country
    setZipcode(event.target.value);

    const nameRegex = /^\d{5}(?:[-\s]\d{4})?$/g; // zip code regex

    if (nameRegex.test(event.target.value)) {
      setIsZipValid(true);
    }
  }

  

  // handleSignup (handle all error checking, submit to firebase, proceed to runsetup)
  const handleSignup = async (event) => {

    event.preventDefault();
    
    setIsSignupValid((isNameValid && isEmailValid && (isZipValid || isPostalValid)) ? true : false)
    console.log('signupvalidation:', isSignupValid)

    // check all form inputs are valid
    if(isNameValid && isEmailValid && (isZipValid || isPostalValid)) {
      
      // generate uid for user
      const userId = uid();

      const userObj = {
        uid: userId,
        name: name,
        email: email,
        location: "",
        country: country,
        postalCode: "",
        zipcode: "",
        registrationDate: "",
        coords: {
          lat: 0,
          long: 0
        }
      }

      // fetch long lat based on user location input
      const axiosCanada = {
        method: "GET",
        url: "https://us1.locationiq.com/v1/search.php?",
        params: {
          key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
          format: 'json',
          postalcode: postalCode,
          matchquality: 1
        }}

      const axiosUSA = {
        method: "GET",
        url: "https://us1.locationiq.com/v1/search.php?",
        params: {
          key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
          format: 'json',
          postalcode: zipcode,
          country: 'USA',
          matchquality: 1
        }
      }

      let axiosParams = (country === 'canada') ? { ...axiosCanada } : { ...axiosUSA };

      await axios(axiosParams)
        .then((res) => {
          console.log('data', res.data)
          console.log('number of results: ', res.data.length)
          
          userObj.coords.lat = res.data[0].lat
          userObj.coords.long = res.data[0].lon
          userObj.location = res.data[0].display_name
          userObj.postalCode = (country === 'canada') ? postalCode : null;
          userObj.zipcode = (country === 'USA') ? zipcode : null;

          // create a timestamp
          const currentDate = new Date()
          userObj.registrationDate = currentDate.toLocaleTimeString() + " " + currentDate.toLocaleDateString();

          console.log(userObj);
          // set up firebase prepare statement/reference
          const dbRef = firebase.database().ref(`sample/${userObj.uid}`);
          // update db to user object
          dbRef.update(userObj);
          
          // check to see if userObj was updated
          navigate(`/settingUpRun/${userObj.uid}`)
        })
        .catch((err) => {
          setIsBackendValid(false)
          console.error(err)
        })

    }
  }

  return (
    /*
      This component is used to display the sign up form
      The user is required to type in their name, email and postal/zip code
    */
    <main className="card-full">

      <section className="signup-form wrapper">

        <h1>Welcome</h1>

        {/* Form for signup which takes the user's: name, email, postal/zip code to retrieve location */}
        <form aria-label="Welcome wizard form" onSubmit={handleSignup} className="flex-column">
          <p>Sun Run is an app that helps you catch the Sunrise or Sunset during your run! We calculate when you should start your run so you don't have to!</p>

          <p>First, please sign up and enter your postal code so we can get the accurate sunrise/sunset times for your region.</p>

          <label htmlFor="name" className="sr-only">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={handleNameChange} placeholder="Full name"></input>

          <label htmlFor="email" className="sr-only">Email</label>
          <input type="text" id="email" name="email" value={email} onChange={handleEmailChange} placeholder="Email address"></input>

          <label htmlFor="country" className="sr-only">Country</label>
          <select name="country" id="country" onChange={handleCountryChange}>
            <option value="canada">Canada</option>
            <option value="usa">USA</option>
          </select>

          {/* Render either postal or zip code input depending on selected country */}
          {country === 'canada' ?
          <>
            <label htmlFor="postalcode" className="sr-only">Postal Code</label>
            <input type="text" id="postalcode" name="postalcode" value={postalCode} onChange={handlePostalCodeChange} placeholder="First 3 digits of Postal Code" maxLength="3"></input>
          </>
          :
          <>
            <label htmlFor="zipcode" className="sr-only">Zip Code</label>
            <input type="text" id="zipcode" name="zipcode" value={zipcode} placeholder="Zipcode" onChange={handleZipcodeChange} maxLength="5"></input>
          </>
          }
        
          {/* Submit button to sign up and pass info to input handlers */}
          <button className="btn-gray" aria-label="Sign up for account" id="submit" name="submit">Sign up</button>

          <Link className="signin-links" to="/login">Have an account? Sign In</Link>

          {/* Input validation messages */}
          <ul className="validation-box flex-column">
            {!isSignupValid && <li className="error-text">Form is invalid, please try again.</li> }
            {!isBackendValid && <li className="error-text">Something's wrong on our end it's not your fault, try again later.</li> }
            {!isNameValid && <li className="error-text"><i className="far fa-times-circle"></i> Enter your full name</li> }
            {!isEmailValid && <li className="error-text"><i className="far fa-times-circle"></i> Enter a valid email address</li> }
            {!isPostalValid && country === 'canada' && <li className="error-text"><i className="far fa-times-circle"></i> Enter a valid postal code.</li> }
            {!isZipValid && country === 'usa' && <li className="error-text"><i className="far fa-times-circle"></i> Enter a valid zip code.</li> }
          </ul>

        </form>

      </section>

    <Footer/>
    </main>

  )
}



export default SignUp;
