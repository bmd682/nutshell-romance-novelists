//author: Samantha Maas
//purpose: To create the HTML reprsentation for each invididual event. This module also listens for the events attached to the Edit and Delete buttons and updates

import { deleteEvent, useEvents } from "./EventsDataProvider.js"
import { useUsers } from "../users/usersDataProvider.js"
import {closestDate} from "./EventsList.js"
import {getOneDayWeatherData, useOneDayWeatherData} from "../weather/WeatherProvider.js"



const eventHub = document.querySelector(".container")
let weatherTarget = document.querySelector(".eventWeatherContainer")

//eventListener listening for the Delete Button to be click and then invoking the deleteEvent function to update database
eventHub.addEventListener("click", clickEvent => {
    if (clickEvent.target.id.startsWith("deleteEventButton--")) {
        const [prompt, eventId] = clickEvent.target.id.split("--")

        deleteEvent(eventId)
       localStorage.setItem("event", "eventsChanged")

    }
})

eventHub.addEventListener("showWeatherButtonClicked", customEvent => {
    
    const eventId = event.detail.eventId
    const allEvents = useEvents()
    const eventObj = allEvents.find(event => event.id === eventId)
    const eventZip = eventObj.zip
    getOneDayWeatherData(eventZip).then(() => {
       const eventWeather = useOneDayWeatherData()
       renderWeather(eventWeather)
    })

})

eventHub.addEventListener("click", clickEvent => {
if(clickEvent.target.id === "closeWeatherButton"){

    weatherTarget.innerHTML = ""
}
})

const renderWeather = (weather) => {
    weatherTarget.innerHTML = `
    <dialog class="eventWeatherForm">
    <h3> Weather for Chosen Event</h3>
        <div>${weather.name}</div>
        <div>${weather.weather[0].main}</div>
        <div>${weather.main.temp_max}&deg; F</div>
        <button id="closeWeatherButton">Close </button>
    </dialog>
    `
}

//dispatching the click for the Event Edit button. Attaches the event Id to the event so the form can listen for that and know which event needs to be edited. 
eventHub.addEventListener("click", clickEvent => {
    if (clickEvent.target.id.startsWith("editEventButton--")) {
        const [prompt, eventId] = clickEvent.target.id.split("--")

        const customEvent = new CustomEvent("editEventButtonClicked", {
            detail: {
                eventId: parseInt(eventId)
            }
        })
        eventHub.dispatchEvent(customEvent)
    }
})

eventHub.addEventListener("click", clickEvent => {
    if(clickEvent.target.id.startsWith("weatherButton--")){
        const [prompt, weatherId] = clickEvent.target.id.split("--")
        const customEvent = new CustomEvent("showWeatherButtonClicked", {
            detail: {
                eventId: parseInt(weatherId)
            }
        })
        eventHub.dispatchEvent(customEvent)
    }
})

export const eventHTML = (eventObj ) => {
    let currentUserId = parseInt(sessionStorage.getItem("activeUser"))
    const events = useEvents()
    const nextEvent = closestDate(events)
    

    if (eventObj.userId === currentUserId) {
        if (eventObj.date === nextEvent) {
            return `
            <section class="nextEvent">
                <div class="event--name"> ${eventObj.name} </div>
                <div id="event--date"> ${eventObj.date} </div>
                <div class="event--time"> ${eventObj.time} </div>
                <div class="event--location">Location: ${eventObj.location}</div>
                <div class="eventDescription">Description: ${eventObj.description}</div>
        
                <button class="button" id="weatherButton--${eventObj.id}"> Show Weather </button>
                <button class="button" id="editEventButton--${eventObj.id}"> Edit </button>
                <button class="button" id="deleteEventButton--${eventObj.id}"> Delete </button>
                <br></br> 
            </section>`
        } else {
            return `
            <section class="event">
                <div class="event--name"> ${eventObj.name} </div>
                <div id="event--date"> ${eventObj.date} </div>
                <div class="event--time"> ${eventObj.time} </div>
                <div class="event--location">Location: ${eventObj.location}</div>
                <div class="eventDescription">Description: ${eventObj.description}</div>
        
                <button class="button" id="weatherButton--${eventObj.id}"> Show Weather </button>
                <button class="button" id="editEventButton--${eventObj.id}"> Edit </button>
                <button class="button" id="deleteEventButton--${eventObj.id}"> Delete </button>
                <br></br>
                
            </section>`
        }


    } else {
        return `
        <section class="event friendEvent">
            <div class="friend--name">${getFriendName(eventObj)}'s event</div>
            <div class="event--name"><i> ${eventObj.name}</i> </div>
            <div id="event--date"><i> ${eventObj.date} </i></div>
            <div class="event--time"> <i>${eventObj.time}</i> </div>
            <div class="event--location"><i>Location: ${eventObj.location}</i></div>
            <div class="eventDescription"><i>Description: ${eventObj.description}</i></div>
    
            <button class="button" id="weatherButton--${eventObj.id}"> Show Weather </button>
            <br><br/>
           
           
        </section>`
    }

}

const getFriendName = (eventObj) => {

    const users = useUsers()
    const friendObj = users.find(u => u.id === eventObj.userId)
    const name = friendObj.username
    return name
}


