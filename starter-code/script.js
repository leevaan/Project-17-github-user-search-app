"use strict"
const changeLightTheme = document.querySelector("#change-light-theme");
const changeDarkTheme = document.querySelector("#change-dark-theme");
const theme = document.querySelector(".theme");
const userValue = document.querySelector(".value");
const submitButton = document.querySelector("#submit-button");
const noResult = document.querySelector("#no-result");
const searchCount = document.querySelector(".search-cont");

// focus value;
document.querySelector(".search-cont").addEventListener("click", (event) =>{
    console.log('event: ', event.target.alt);
    if(event.target.className == "search-cont"|| event.target.alt == "search icon" && event.target.id != "submit-button") userValue.focus();
})

// ========= DARK, LIGHT MODE LOGIC START===========>
//* When loading a document, it first checks local storages to see if the theme is selected.
//* Then it checks whether dark or light is selected in the browser settings.
//* Enables the light theme by default.

// Color scheme media reading check
const prefersScheme = window.matchMedia("(prefers-color-scheme: dark)");

// template of dark, light mode.
const themeModeTemplate = (scheme) => {
    if (scheme === 'dark') {
        changeLightTheme.disabled = true;
        changeDarkTheme.disabled = false;
        theme.textContent = scheme;
    } else {
        changeLightTheme.disabled = false;
        changeDarkTheme.disabled = true
        theme.textContent = scheme;
    }
}
// If the user changes the theme from the browser settings, it will automatically change on the web as well.
prefersScheme.addEventListener("change", (event) => {
    themeModeTemplate(event.matches ? 'dark': 'light');
});

//  Event listener for the button
theme.addEventListener("click", () => {
    // Function to toggle the theme
    if (changeLightTheme.disabled) {
        themeModeTemplate('light');
        localStorage.setItem('theme', 'light');
    } else {
        themeModeTemplate('dark');
        localStorage.setItem('theme', 'dark');
    }
})

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    themeModeTemplate('dark');
} else if(savedTheme === 'light'){
    themeModeTemplate('light');
} else if(savedTheme == null){ // როდესაც იტვირთება გვერდი თუ localStorage ში არ გვაქვს ინფორმაცია შენახული მასინ ნახოს ბრაზერში რომელ თემას იყენებს მომხმარებელი და ის დააყენოს.
    themeModeTemplate(prefersScheme.matches ? 'dark' : 'light');
}

// =========> DARK, LIGHT MODE LOGIC end ===========

async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw `Status code: ${response.status}`;
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        // When the user could not be found
        console.error('Error fetching GitHub user:', error);
        if(noResult.textContent == "") noResult.textContent = 'No Result';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function updateUserDetails(data) {
    // for not available style
    const notAvailable = (id, availableData) =>{
        console.log('availableData: ', availableData);
        let element = document.querySelector(id);
        if(availableData){
            if(element.parentNode.className == "not-available"){
               element.parentNode.classList.remove("not-available");
               element.textContent = availableData;
            }
        }else{
            element.parentNode.classList.add("not-available");
            element.textContent = 'Not Available';
        }
    }
    
    document.querySelector("#user-img").src = data.avatar_url;
    document.querySelector("#user-name").textContent = data.name ?? 'No name available';
    document.querySelector("#user-nick").textContent =`@${data.login}`;
    document.querySelector("#join-data-gb").textContent = formatDate(data.created_at);
    document.querySelector("#repos").textContent = data.public_repos;
    document.querySelector("#followers").textContent = data.followers;
    document.querySelector("#following").textContent = data.following;

    document.querySelector("#user-bio").textContent = data.bio ?? 'This profile has no bio';

    notAvailable("#location",data.location);
    document.querySelector("#blog").href = data.blog ?? '#';
    notAvailable("#blog",  data.blog);
    notAvailable("#company",  data.company);
    notAvailable("#twitter_username",  data.twitter_username);
}

userValue.addEventListener("focus", () => {
    console.log('noResult.textContent: ', noResult.textContent);
    if(noResult.textContent != ""){
        noResult.textContent = '';
    }
});

submitButton.addEventListener("click", async () => {
    const username = userValue.value.trim();
    if (username) {
        const userData = await fetchGitHubUser(username);
        if (userData) {
            updateUserDetails(userData);
        }
    } else {
        //If nothing is written in the value, press the button, write no result in value color red.
        if(noResult.textContent == "") noResult.textContent = 'No Result';
    }
});
