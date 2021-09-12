import '../styles/main.scss';
import { elements, renderLoader, clearLoader } from './base';
import { fetchConfStandings } from './fetchStandings';
import { mobileMenu } from './mobileMenu';

elements.hamburgerMenu.addEventListener('click', mobileMenu);


const sortConferences = async () => {
    const conf = {};
    const conferences = await fetchConfStandings();
    conf.east = conferences.east;
    conf.west = conferences.west;
    return conf;
};

const makeConferences = async (side) => {
    const data = await sortConferences();

    data[side].forEach(team => {
        const markup = `<tr class="team">
        <td>
            <a class="team__profile" href="#!">
                <div class="team__img">
                    <img src="https://cdn.nba.com/logos/nba/${team.teamId}/global/L/logo.svg" alt="NBA team logo">
                </div>
                <div class="team__name">
                    <p class="team__fullName">${team.teamSitesOnly.teamName + team.teamSitesOnly.teamNickname }</p>
                </div>
            </a>
        </td>
        <td>${team.win}</td>
        <td>${team.loss}</td>
        <td>${team.winPct}</td>
        <td>${team.confWin + team.confLoss}</td>
        <td>${team.divWin + team.divLoss}</td>
        <td>${team.homeWin + team.homeLoss}</td>
        <td>${team.awayWin + team.awayLoss}</td>
        <td>${team.lastTenWin + team.lastTenLoss}</td>
    </tr>`;

        elements[side].insertAdjacentHTML('beforeend', markup);
    }); 
};

renderLoader(elements.dataContainer);

const renderConferences = async () => {
    const allConfs = await sortConferences();
    clearLoader();
    for(let prop in allConfs) {
        makeConferences(prop);
    }
};
renderConferences();
