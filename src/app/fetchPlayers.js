export const fetchPlayers = async function() {
    const season = 2021;
    const url = `https://data.nba.net/data/10s/prod/v1/${season}/players.json`;

    try {
        const result = await fetch(url);
        const data = await result.json();
        const obj = data.league.standard;
        // console.log(obj);
        return obj;
    } catch(error) {
        alert('Something went wrong!');
    }
}