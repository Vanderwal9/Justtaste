// let spice = ["ham", "cheese", "pepper", "curry"];
// let sour = ["ham", "curry", "cheese", "pepper"];
// let sweet = ["curry", "ham", "pepper", "cheese"];
// let bitter = ["cheese", "ham", "curry", "pepper"];
// let umami = ["cheese", "ham", "curry", "pepper"];
// let salt = ["curry", "pepper", "ham", "cheese"];

// // Define which items are hot or cold
// let hotItems = ["ham", "curry"]; // Example items that are hot
// let coldItems = ["cheese", "pepper"]; // Example items that are cold

// Function to fetch and display flavor data
let spice = [];
let sour = [];
let sweet = [];
let bitter = [];
let umami = [];
let salt = [];

// Define which items are hot or cold
let hotItems = [];
let coldItems = [];

// Function to fetch and display food data
function fetchFoods() {
    fetch('http://localhost:3000/api/foods')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(foods => {
            // Clear existing data
            spice = []; sour = []; sweet = []; bitter = []; umami = []; salt = [];
            hotItems = []; coldItems = [];

            foods.forEach(food => {
                // Populate flavor arrays based on ratings
                if (food.spice_rating > 0) spice.push(food.name);
                if (food.sour_rating > 0) sour.push(food.name);
                if (food.sweet_rating > 0) sweet.push(food.name);
                if (food.bitter_rating > 0) bitter.push(food.name);
                if (food.umami_rating > 0) umami.push(food.name);
                if (food.salt_rating > 0) salt.push(food.name);

                // Populate hot and cold categories
                if (food.is_hot) hotItems.push(food.name);
                if (food.is_cold) coldItems.push(food.name);
            });

            // Log the fetched foods for debugging
            console.log(foods);

            // Update UI based on fetched data
            // Implement UI update logic here, if necessary
        })
        .catch(error => console.error('Error fetching foods:', error));
}

// Call the function to fetch foods
fetchFoods();



// Function to assign scores based on the chosen position
function assignScores(array, position, isHotChecked, isColdChecked) {
    let scores = {};
    let baseScore = 100;
    let decrement = 5;

    for (let i = 0; i < array.length; i++) {
        if (!isHotChecked && !isColdChecked) {
            continue; // Neither hot nor cold is checked, skip both
        } else if (isHotChecked && isColdChecked) {
            // Both hot and cold are checked, include both
        } else {
            if ((isHotChecked && !hotItems.includes(array[i])) || (isColdChecked && !coldItems.includes(array[i]))) {
                continue; // Skip items that don't match the hot/cold preference
            }
        }

        if (i < position) {
            scores[array[i]] = baseScore - ((position - i) * decrement);
        } else if (i > position) {
            scores[array[i]] = baseScore - ((i - position) * decrement);
        } else {
            scores[array[i]] = baseScore;
        }
    }
    return scores;
}

// Function to calculate the average score of an element across all arrays
function calculateAverageScore(element, ...arrays) {
    let totalScore = 0;
    arrays.forEach(array => {
        if (array[element] !== undefined) {
            totalScore += array[element];
        }
    });
    return totalScore / arrays.length;
}

// Function to handle user input and calculate scores
function calculateFlavorScores() {
    let isHotChecked = document.getElementById("hotCheckbox").checked;
    let isColdChecked = document.getElementById("coldCheckbox").checked;

    let positionSpice = document.getElementById("spiceInput").value - 1;
    let positionSour = document.getElementById("sourInput").value - 1;
    let positionSweet = document.getElementById("sweetInput").value - 1;
    let positionBitter = document.getElementById("bitterInput").value - 1;
    let positionUmami = document.getElementById("umamiInput").value - 1;
    let positionSalt = document.getElementById("saltInput").value - 1;

    if (positionSpice < 0 && positionSour < 0 && positionSweet < 0 && positionBitter < 0 && positionUmami < 0 && positionSalt < 0) {
        alert("Please enter in at least one preference.");
        return;
    }

    let scoresSpice = assignScores(spice, positionSpice, isHotChecked, isColdChecked);
    let scoresSour = assignScores(sour, positionSour, isHotChecked, isColdChecked);
    let scoresSweet = assignScores(sweet, positionSweet, isHotChecked, isColdChecked);
    let scoresBitter = assignScores(bitter, positionBitter, isHotChecked, isColdChecked);
    let scoresUmami = assignScores(umami, positionUmami, isHotChecked, isColdChecked);
    let scoresSalt = assignScores(salt, positionSalt, isHotChecked, isColdChecked);

    let highestScore = 0;
    let highestScoringElement = "";
    spice.forEach(element => {
        let averageScore = calculateAverageScore(element, scoresSpice, scoresSour, scoresSweet, scoresBitter, scoresUmami, scoresSalt);
        if (averageScore > highestScore) {
            highestScore = averageScore;
            highestScoringElement = element;
        }
    });

    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `According to your preferences, you're going to like: ${highestScoringElement}`;
}

// Function to show information about each taste and display an image based on slider value
function showInfo(taste) {
    let infoText = "";
    let imageSrc = "";
    let sliderValue = document.getElementById(`${taste}Input`).value;

    switch (taste) {
        case 'spice':
            infoText = "Information about Spice...";
            imageSrc = `images/spice${sliderValue}.jpg`; // Path to spice images
            break;
        case 'sweet':
            infoText = "Information about Sweet...";
            imageSrc = `images/sweet${sliderValue}.jpg`; // Path to sweet images
            break;
        case 'sour':
            infoText = "Information about Sour...";
            imageSrc = `images/sour${sliderValue}.jpg`; // Path to sour images
            break;
        case 'bitter':
            infoText = "Information about Bitter...";
            imageSrc = `images/bitter${sliderValue}.jpg`; // Path to bitter images
            break;
        case 'umami':
            infoText = "Information about Umami...";
            imageSrc = `images/umami${sliderValue}.jpg`; // Path to umami images
            break;
        case 'salt':
            infoText = "Information about Salt...";
            imageSrc = `images/salt${sliderValue}.jpg`; // Path to salt images
            break;
        default:
            infoText = "No information available.";
            imageSrc = ""; // Default or placeholder image
    }

    alert(infoText);
    if (imageSrc) {
        let image = new Image();
        image.src = imageSrc;
        image.alt = `${taste} ${sliderValue}`;
        image.onload = () => {
            document.body.appendChild(image);
        };
    }
}

// Function to search flavors based on user input
// Function to search foods based on user input
function searchFlavors() {
    let searchTerm = document.getElementById("searchBar").value.toLowerCase();

    // Retrieve the user ID from local storage or session storage
    let userId = localStorage.getItem('userId');
    saveSearch(userId, searchTerm);
    fetch('http://localhost:3000/api/foods')
        .then(response => response.json())
        .then(foods => {
            let foundFood = foods.find(food => food.name.toLowerCase() === searchTerm);
            if (foundFood) {
                alert(`Found ${searchTerm} with ratings - Spice: ${foundFood.spice_rating}, Sweet: ${foundFood.sweet_rating}, Sour: ${foundFood.sour_rating}, Bitter: ${foundFood.bitter_rating}, Umami: ${foundFood.umami_rating}, Salt: ${foundFood.salt_rating}`);
            } else {
                alert("No matches found.");
            }
        })
        .catch(error => console.error('Error:', error));
}



// Function to update the number input when the slider value changes
function updateNumberInput(inputId, value) {
    document.getElementById(inputId).value = value;
}

// Function to update the slider value when the number input changes
function updateSlider(sliderId, value) {
    document.getElementById(sliderId).value = value;
}

// Function to add a new flavor
function addFood(name, spiceRating, sourRating, sweetRating, bitterRating, umamiRating, saltRating, isHot) {
    fetch('http://localhost:3000/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, spiceRating, sourRating, sweetRating, bitterRating, umamiRating, saltRating, isHot })
    })
    .then(response => response.json())
    .then(data => console.log('Food added:', data))
    .catch(error => console.error('Error:', error));
}

// Function to update an existing food item
function updateFood(id, name, spiceRating, sourRating, sweetRating, bitterRating, umamiRating, saltRating, isHot) {
    fetch(`http://localhost:3000/api/foods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, spiceRating, sourRating, sweetRating, bitterRating, umamiRating, saltRating, isHot })
    })
    .then(response => response.json())
    .then(data => console.log('Food updated:', data))
    .catch(error => console.error('Error updating food:', error));
}

// Function to delete a food item
function deleteFood(id) {
    fetch(`http://localhost:3000/api/foods/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log('Food deleted:', data))
    .catch(error => console.error('Error deleting food:', error));
}
// Function to handle user registration
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value; // Add this line

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }) // Include email here
    })
    .then(response => response.json())
    .then(data => {
        console.log('Registration successful', data);
        toggleRegisterForm();
        toggleLoginForm();
    })
    .catch(error => console.error('Error registering user:', error));
}


// Function to handle user login
// Function to handle user login
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login successful', data);
        displayGreeting(data.user.username);
        localStorage.setItem('userId', data.userId);
        // Removed the call to displayUserDashboard here
        toggleLoginForm();
    })
    .catch(error => {
        console.error('Error logging in:', error);
        alert('Login failed: ' + error.message);
    });
}


// Function to display greeting message and dashboard link
function displayGreeting(username) {
    // Hide the login/register button
    document.querySelector('.login-register-btn').style.display = 'none';

    // Create greeting message
    const greeting = document.createElement('div');
    greeting.textContent = 'Hello, ' + username;
    greeting.classList.add('greeting');
    document.querySelector('.top-bar').appendChild(greeting);

    // Show dashboard link/button
    const dashboardLink = document.createElement('button');
    dashboardLink.textContent = 'Go to Dashboard';
    dashboardLink.onclick = () => toggleUserDashboard(); // Call a new function to toggle the dashboard
    document.querySelector('.top-bar').appendChild(dashboardLink);
}


// Function to toggle the login form
function toggleLoginForm() {
    var loginForm = document.getElementById("loginForm");
    loginForm.style.display = loginForm.style.display === "block" ? "none" : "block";
    document.getElementById("registerForm").style.display = "none";
}

// Function to toggle the registration form
function toggleRegisterForm() {
    var registerForm = document.getElementById("registerForm");
    registerForm.style.display = registerForm.style.display === "block" ? "none" : "block";
    document.getElementById("loginForm").style.display = "none";
}


function toggleUserDashboard() {
    var userDashboard = document.getElementById("userDashboard");
    var isDashboardVisible = userDashboard.style.display === "block";

    if (isDashboardVisible) {
        userDashboard.style.display = "none";
    } else {
        userDashboard.style.display = "block";

        // Assuming the user ID is stored in localStorage when the user logs in
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchRecentSearches(userId);
            fetchFavorites(userId);
        } else {
            console.error("User ID not found in localStorage");
        }
    }
}


// Function to fetch and display recent search  es
function fetchRecentSearches(userId) {
    fetch(`http://localhost:3000/api/recent-searches/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Recent Searches Data:', data); // Log for debugging
            updateRecentSearchesUI(data);
        })
        .catch(error => console.error('Error fetching recent searches:', error));
}

function fetchFavorites(userId) {
    fetch(`http://localhost:3000/api/favorites/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Favorites Data:', data); // Log for debugging
            // Logic to update UI here
        })
        .catch(error => console.error('Error fetching favorites:', error));
}

function saveSearch(userId, searchTerm) {
    fetch('http://localhost:3000/api/recent-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, searchTerm })
    })
    .then(response => response.json())
    .then(data => console.log('Search saved:', data))
    .catch(error => console.error('Error saving search:', error));
}
function addFavorite(userId, foodId) {
    fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId })
    })
    .then(response => response.json())
    .then(data => console.log('Added to favorites:', data))
    .catch(error => console.error('Error adding to favorites:', error));
}

function removeFavorite(favoriteId) {
    fetch(`http://localhost:3000/api/favorites/${favoriteId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log('Removed from favorites:', data))
    .catch(error => console.error('Error removing from favorites:', error));
}
function updateRecentSearchesUI(searches) {
    const list = document.getElementById('recentSearchesList');
    list.innerHTML = ''; // Clear existing list items
    searches.forEach(search => {
        const listItem = document.createElement('li');
        listItem.textContent = search.query; // or whatever field holds the search term
        list.appendChild(listItem);
    });
}


