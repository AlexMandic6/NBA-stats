export const fetchTeamColor = async () => {
    const date = 2020;
    const url = `https://data.nba.net/data/10s/prod/${date}/teams_config.json`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const teams = data.teams.config;
        // console.log(teams)
        return teams;

    } catch(error) {
        alert('Error, try refreshing the page!');
    }
};