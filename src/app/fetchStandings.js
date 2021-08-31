export const fetchConfStandings = async function() {
    const date = 'current';
    const url = `https://data.nba.net/data/10s/prod/v1/${date}/standings_conference.json`;
    try{
        const result = await fetch(url);
        const data = await result.json();
        const standings = data.league.standard.conference;
        // console.log(standings);
        return standings;
    } catch(err) {
        alert('Error happened, try refreshing!');
    };
};