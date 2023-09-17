import { artistData as artistData } from '../examples/artistExample';
// Your original JSON response
// Create a new object with the "song" key
export const modifiedArtistData = {
    ...artistData,
    data: {
        ...artistData.data,
        songs: artistData.data.results,
    },
};

// Remove the original "results" key
delete modifiedArtistData.data.results;

// Now, "song" contains the data that was originally in "results"
console.log(modifiedArtistData);
