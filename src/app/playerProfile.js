import '../styles/main.scss';
import './fetchPlayers';
import { fetchPlayers } from './fetchPlayers';
import { fetchTeams } from './fetchTeams';
import { fetchTeamColor } from './fetchTeamColors';


export const controlPlayer = async () => {
    const id = window.location.hash.replace('#', '');
    if(id) {
        const player = new Player(id);
        await player.getPlayer();
        renderPlayerProfile(player);
    }
};


export default class Player {
    constructor(id) {
        this.id = id;
    }

    async getPlayer() {
        const date = new Date();
        const year = date.getFullYear();
        try {
            const res = await fetch(`https://data.nba.net/data/10s/prod/v1/2021/players/${this.id}_profile.json`);
            const data = await res.json();
            const stats = data.league.standard;
            const playerStats = stats.stats.regularSeason.season[0].total;
            // console.log(stats);
            const teams = await fetchTeams();
            const [team] = teams.filter(el => el.teamId === stats.teamId);
            this.teamName = team.fullName;
            this.team = stats.teamId;
            this.ppg = playerStats.ppg;
            this.rpg = playerStats.rpg;
            this.apg = playerStats.apg;
            this.mpg = playerStats.mpg;

            const playerData = await fetchPlayers();
            const [filtered] = playerData.filter(e => e.personId === this.id);
            this.team = filtered.teamId;
            this.jersey = filtered.jersey;
            this.position = filtered.teamSitesOnly.posFull;
            this.firstName = filtered.firstName;
            this.lastName = filtered.lastName;

            this.country = filtered.country;
            this.experience = filtered.yearsPro;
            this.height = `${filtered.heightFeet}'${filtered.heightInches}''(${filtered.heightMeters}m)`;
            this.weight = `${filtered.weightPounds}lb (${filtered.weightKilograms}kg)`;
            this.age = year - parseInt(filtered.dateOfBirthUTC.split('').slice(0, 4).join(''));
            this.birthdate = filtered.dateOfBirthUTC;
            this.lastAttended = filtered.lastAffiliation;
            this.draft = `${filtered.draft.seasonYear} R${filtered.draft.roundNum} Pick${filtered.draft.pickNum}`;

            const teamColors = await fetchTeamColor();
            const [color] = teamColors.filter(el => el.teamId === this.team);
            const teamCol = color.primaryColor;
            this.teamColor = teamCol;
        } catch (error) {
            console.log(error);
            alert('Something went wrong!');
        }
    }
}

const renderPlayerProfile = player => {
    const header = document.querySelector('.header-wrapper');
    const markup = `<main class="profile-wrapper" style="background-color: ${player.teamColor};">
    <section class="profile">
        <div class="profile__team-logo">
          <div class="profile__team-image">
              <img src="https://cdn.nba.com/logos/nba/${player.team}/global/L/logo.svg" alt="NBA team logo">
          </div>
        </div>
        <div class="profile__player-wrapper">
          <div class="profile__player">
              <div class="profile__player-image-container">
                  <div class="profile__player-logo">
                      <a href="#!">
                          <img src="https://cdn.nba.com/logos/nba/${player.team}/global/D/logo.svg" alt="">
                      </a>
                  </div>
                  <img class="profile__player-image" src="https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png" alt="player image">
              </div>
              <div class="profile__player-info">
                  <div class="profile__player-text">
                      <p class="profile__player-text-team">${player.teamName} | #${player.jersey} | ${player.position}</p>
                      <p class="profile__player-text-name">${player.firstName}</p>
                      <p class="profile__player-text-name">${player.lastName}</p>
                  </div>
                  <div class="profile__player-btns"></div>
              </div>
          </div>
        </div>
    </section>
    <section class="stats">
        <div class="stats__game">
            <div class="stats__game-stat">
                <p class="stats__game-stat-header">ppg</p>
                <p class="stats__game-stat-row">${player.ppg}</p>
            </div>
            <div class="stats__game-stat">
                <p class="stats__game-stat-header">rpg</p>
                <p class="stats__game-stat-row">${player.rpg}</p>
            </div>
            <div class="stats__game-stat">
                <p class="stats__game-stat-header">apg</p>
                <p class="stats__game-stat-row">${player.apg}</p>
            </div>
            <div class="stats__game-stat">
                <p class="stats__game-stat-header">mpg</p>
                <p class="stats__game-stat-row">${player.mpg}</p>
            </div>
        </div>
        <div class="stats__bio">
            <div class="stats__bio-summary">
                <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">height</p>
                  <p class="stats__bio-playerInfo-row">${player.height}</p>
                </div>
                <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">weight</p>
                  <p class="stats__bio-playerInfo-row">${player.weight}</p>
                </div>
                <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">country</p>
                  <p class="stats__bio-playerInfo-row">${player.country}</p>
                </div>
                <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">last attended</p>
                  <p class="stats__bio-playerInfo-row">${player.lastAttended}</p>
                </div>
            </div>
            <div class="stats__bio-summary">
              <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">age</p>
                  <p class="stats__bio-playerInfo-row">${player.age} years</p>
              </div>
              <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">birthdate</p>
                  <p class="stats__bio-playerInfo-row">${player.birthdate}</p>
              </div>
              <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">draft</p>
                  <p class="stats__bio-playerInfo-row">${player.draft}</p>
              </div>
              <div class="stats__bio-playerInfo">
                  <p class="stats__bio-playerInfo-header">experience</p>
                  <p class="stats__bio-playerInfo-row">${player.experience} years</p>
              </div>
            </div>
        </div>
    </section>
</main>`;
    header.insertAdjacentHTML('beforeend', markup);
};
controlPlayer();