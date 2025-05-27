const API_URL = 'https://hp-api.onrender.com/api/characters';

const characterContainer = document.getElementById('character-container');
const houseFilter = document.getElementById('house-filter');
const loadingIndicator = document.getElementById('loading-indicator');

let allCharacters = [];
let filteredCharacters = [];

async function fetchCharacters() {
    try {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allCharacters = data;
        filteredCharacters = [...allCharacters];
        renderCharacters();
    } catch (error) {
        console.error(error);
        characterContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load characters. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

function renderCharacters() {
    characterContainer.innerHTML = '';
    const charactersToDisplay = filteredCharacters.slice(0, 16);
    
    if (charactersToDisplay.length === 0) {
        characterContainer.innerHTML = `<div class="no-results">
        <p>No characters found for this house.</p>
        </div>
        `;
        return;
    }
    charactersToDisplay.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        if (character.house) {
        card.classList.add(character.house.toLowerCase());
        }
        const dob = character.dateOfBirth ? character.dateOfBirth : 'Unknown';
        const imageUrl = character.image && character.image.trim() !== '' 
        ? character.image 
        : './images/not-found.png';
        
        card.innerHTML = `<div class="character-image">
            <img src="${imageUrl}" alt="${character.name}" onerror="this.src=not-found.jpeg;">
            </div>
            <div class="character-info">
            <h3>${character.name}</h3>
            <p class="house">House: ${character.house || 'Unknown'}</p>
            <p class="dob">Date of Birth: ${dob}</p>
            </div>
        `;
        
        characterContainer.appendChild(card);
    });
}

function filterByHouse(house) {
    if (house === 'all') {
        filteredCharacters = [...allCharacters];
    } else {
        filteredCharacters = allCharacters.filter(character => 
            character.house && character.house.toLowerCase() === house.toLowerCase()
        );
    }
    renderCharacters();
}

if (houseFilter) {
    houseFilter.addEventListener('change', (event) => {
        const selectedHouse = event.target.value;
        filterByHouse(selectedHouse);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters();
});
