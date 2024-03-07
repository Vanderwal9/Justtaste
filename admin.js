// Function to handle adding a new food item
document.getElementById('addFoodForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('foodName').value;
    const spiceRating = document.getElementById('spiceRating').value;
    const sweetRating = document.getElementById('sweetRating').value;
    const sourRating = document.getElementById('sourRating').value;
    const bitterRating = document.getElementById('bitterRating').value;
    const umamiRating = document.getElementById('umamiRating').value;
    const saltRating = document.getElementById('saltRating').value;
    const isHot = document.getElementById('addIsHot').checked;
    const isCold = document.getElementById('addIsCold').checked;

    fetch('http://localhost:3000/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name, 
            spiceRating, 
            sweetRating, 
            sourRating, 
            bitterRating, 
            umamiRating, 
            saltRating,
            isHot,
            isCold
        })
    })
    .then(response => response.json())
    .then(data => console.log('Food item added:', data))
    .catch(error => console.error('Error adding food item:', error));
});

// Function to handle updating an existing food item
document.getElementById('updateFoodForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('updateFoodName').value;
    // Assuming inputs for each taste rating exist in your form
    const spiceRating = document.getElementById('updateSpiceRating').value;
    const sweetRating = document.getElementById('updateSweetRating').value;
    const sourRating = document.getElementById('updateSourRating').value;
    const bitterRating = document.getElementById('updateBitterRating').value;
    const umamiRating = document.getElementById('updateUmamiRating').value;
    const saltRating = document.getElementById('updateSaltRating').value;
    const isHot = document.getElementById('updateIsHot').checked;
    const isCold = document.getElementById('updateIsCold').checked;

    fetch(`http://localhost:3000/api/foods/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            spiceRating, 
            sweetRating, 
            sourRating, 
            bitterRating, 
            umamiRating, 
            saltRating,
            isHot,
            isCold
        })
    })
    .then(response => response.json())
    .then(data => console.log('Food item updated:', data))
    .catch(error => console.error('Error updating food item:', error));
});

// Function to handle deleting a food item
document.getElementById('deleteFoodForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('deleteFoodName').value;

    fetch(`http://localhost:3000/api/foods/${name}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log('Food item deleted:', data))
    .catch(error => console.error('Error deleting food item:', error));
});
