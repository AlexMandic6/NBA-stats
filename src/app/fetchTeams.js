export const fetchTeams = async function() {
    const season = 2021;
    const url = `https://data.nba.net/data/10s/prod/v1/${season}/teams.json`;
    try {
        const result = await fetch(url);
        const data = await result.json();
        const league = data.league.standard;
        const nbaTeams = league.filter(team => team.isNBAFranchise === true);
        // console.log(nbaTeams);
        return nbaTeams;
    } catch(error) {
        alert('Error Happened, try refreshing the page!');
    }
}