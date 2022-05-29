
const runType =(object)=>{
    let totalTime
    // Logic for Jog Choice
    if(object.pace ==="Jog" ){
        if(object.distance === '5km'){
        totalTime = 37.5
        }
        if(object.distance === '10km'){
        totalTime = 75
        }
        if(object.distance === 'Half Marathon'){
        totalTime = 157.5
        }
        if(object.distance === 'Marathon'){
        totalTime = 315
        }
    }
    // Logic for Run Choice
    if(object.pace ==="Run"){
        if(object.distance === '5km'){
        totalTime = 18.75
        }
        if(object.distance === '10km'){
        totalTime = 37.5
        }
        if(object.distance === 'Half Marathon'){
        totalTime = 78.75
        }
        if(object.distance === 'Marathon'){
        totalTime = 157.5
        }
    }
    return totalTime
}
export const convertH2M=(timeInHour)=>{
    let timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}
export const convertM2H=(timeInMinute, sunTime)=>{
    let hours = (timeInMinute / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return  rhours + ":" + (rminutes<10? `0${rminutes}` : rminutes) + (sunTime==="sunrise" ? ' AM' : ' PM');
}
export default runType
