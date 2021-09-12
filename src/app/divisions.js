import '../styles/main.scss';
import { fetchTeams } from "./fetchTeams";
import { elements, renderLoader, clearLoader } from "./base";
import { mobileMenu } from './mobileMenu';

elements.hamburgerMenu.addEventListener('click', mobileMenu);

const sortDivisions = async () => {
    const divisions = {};
    const allTeams = await fetchTeams();
    allTeams.forEach(team => {
        if(divisions.hasOwnProperty(team.divName.toLowerCase())) {
            divisions[team.divName.toLowerCase()].push(team);
        } else if (!divisions.hasOwnProperty(team.divName)) {
            let prop = divisions[team.divName.toLowerCase()] = [];
            prop.push(team);
        }
    });
    return divisions;
};

const makeDivisions = async () => {
    const allDivisions = await sortDivisions();
    for(let div in allDivisions) {
        const division = document.createElement('div');
        division.classList.add('teams-divisions');
        elements.divisionWrapper.appendChild(division);
        const text = document.createElement('div');
        text.classList.add('teams-divisions__text');
        division.appendChild(text);
        const heading = document.createElement('h3');
        heading.classList.add('teams-divisions__heading');
        heading.innerHTML = div;
        text.appendChild(heading);

        //Adding sorted teams for every division
        allDivisions[div].forEach(team => {
            const markup = `<div class="teams-division">
        <div class="teams-division__logo">
          <img class="teams-division__img" src="https://cdn.nba.com/logos/nba/${team.teamId}/global/L/logo.svg" title="${team.fullName} Logo" alt="NBA team logo">
        </div>
        <div class="teams-division__info">
          <a href="#" class="teams-division__team">${team.fullName}</a>
          <div class="teams-division__sub-info">
            <a class="teams-division__sub-info-link" href="#">Profile</a>
            <a class="teams-division__sub-info-link" href="#">Stats</a>
          </div>
        </div>
      </div>`;

        division.insertAdjacentHTML('beforeend', markup);
        });
    }
    clearLoader();
    return allDivisions;
};

renderLoader(elements.dataContainer);

makeDivisions();
