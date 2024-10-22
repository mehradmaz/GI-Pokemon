async function fetchPokemonData() {
    try {
        // Display loading message
        const moduleContainer = document.getElementById('moduleContainer');
        moduleContainer.innerHTML = '<p>Loading Pokémon...</p>';

        const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=50');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Fetch details for each Pokémon in parallel
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonResponse = await fetch(pokemon.url);
                if (!pokemonResponse.ok) {
                    throw new Error(`Failed to fetch data for ${pokemon.name}`);
                }
                const pokemonData = await pokemonResponse.json();

                return {
                    name: pokemonData.name,
                    weight: pokemonData.weight,
                    image: pokemonData.sprites.front_default
                };
            })
        );

        displayPokemon(pokemonDetails);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        displayErrorMessage();
    }
}

function displayPokemon(pokemonDetails) {
    const moduleContainer = document.getElementById('moduleContainer');

    // Clear loading or previous content
    moduleContainer.innerHTML = '';

    pokemonDetails.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.image}" alt="${pokemon.name}" />
            <p>Weight: ${pokemon.weight}</p>
        `;
        moduleContainer.appendChild(pokemonCard);
    });
}

function displayErrorMessage() {
    const moduleContainer = document.getElementById('moduleContainer');
    moduleContainer.innerHTML = '<p>Failed to load Pokémon. Please try again later.</p>';
}

document.addEventListener('DOMContentLoaded', fetchPokemonData);
