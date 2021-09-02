import '../styles/main.scss';
import { fetchPlayers } from './fetchPlayers';
import { fetchTeamColor } from './fetchTeamColors';
import { elements } from './base';
import { mobileMenu } from './mobileMenu';

elements.hamburgerMenu.addEventListener('click', mobileMenu);


const clearResults = () => {
    elements.playerTable.innerHTML = '';
}
const clearDropdown = () => {
    elements.pageSelect.innerHTML = '';
}


const getTricode = async (id) => {
    const data = await fetchTeamColor();
    const filteredData = data.filter(el => el.teamId === id.teamId);
    const tricode = filteredData[0].tricode;
    return tricode;
} 


const renderPlayer = async playerData => {
    const tricode = await getTricode(playerData);
    const markup = `<tr class="player">
        <td>
            <a class="player__profile" href="player.html#${playerData.personId}">
                <div class="player__img">
                    <img src="https://cdn.nba.com/headshots/nba/latest/260x190/${playerData.personId}.png" onerror="this.onerror=null;this.src='../img/no-profile-image.jpg';" alt="Player image">
                </div>
                <div class="player__name">
                    <p class="player__name-first">${playerData.firstName}</p>
                    <p class="player__name-last">${playerData.lastName}</p>
                </div>
            </a>
        </td>
        <td>
            <a class="player__team" href="#!">${tricode}</a>
        </td>
        <td>${playerData.jersey}</td>
        <td>${playerData.pos}</td>
        <td>${playerData.heightMeters + ' m'}</td>
        <td>${playerData.weightKilograms + ' kg'}</td>
        <td>${playerData.country}</td>
    </tr>`;

    elements.playerTable.insertAdjacentHTML('beforeend', markup);
}


const createDropdown = (pages) => {
    let option;
    for(let i = 0; i < pages; i++) {
        option = `<option value="${i}">${i + 1}</option>`;
        elements.pageSelect.insertAdjacentHTML('beforeend', option);
    }
    elements.pageSelect.options[0].setAttribute('selected', '');
    showNumOfPages(pages)
};

const changeSelectOption = opt => {
    let pageData = parseInt(elements.pageBtn.dataset.goto);
    opt.forEach(option => {
        if(option.hasAttribute('selected')) {
            option.removeAttribute('selected');
        }
    });
    opt[pageData -1].setAttribute('selected', '');
};


const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);
    const next = elements.nextBtn;
    const prev = elements.prevBtn;

    if(elements.pageSelect.length < pages) {
        createDropdown(pages);
    }
   
    if (page === 1 && pages > 1) {
        prev.disabled = true;
        prev.classList.add('disabled');

    } else if (page > 1 && page < pages) {
        next.disabled = false;
        next.classList.remove('disabled');
        prev.disabled = false;
        prev.classList.remove('disabled');
    } else if (page === pages && pages >1) {
        next.disabled = true
        next.classList.add('disabled');
    }
};


export const renderResults = (players, page = 1, resPerPage = 50) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    if(elements.playerSearchBar.value === '') {
        players.slice(start, end).forEach(renderPlayer);
    }; 

    renderButtons(page, players.length, resPerPage,);
}

const changePageBtns = async (button) => {
    const parentBtn = elements.pageBtn;
    const pageToGo = parseInt(parentBtn.dataset.goto);
    
    if(button.classList.contains('btn-next')) {
        fetchPlayers().then(res => {
                clearResults();
                renderResults(res, pageToGo + 1);
            });
        parentBtn.dataset.goto ++;
    } else if (button.classList.contains('btn-prev')) {
        fetchPlayers().then(res => {
            clearResults();
            renderResults(res, pageToGo - 1);
        });
        parentBtn.dataset.goto --;
    }
};

const selectPage = page => {
    const dropdownOptions = Array.from(document.querySelectorAll('option'));
    page = elements.pageSelect.options[elements.pageSelect.selectedIndex].text;
    elements.pageBtn.dataset.goto = parseInt(page);
    changeSelectOption(dropdownOptions);
    fetchPlayers().then(res => {
        clearResults();
        renderResults(res, page);
    });
};

elements.pageSelect.addEventListener('change', selectPage);


elements.pageBtn.addEventListener('click', e => {
    const button = e.target.closest('.players__filter-btn');
    const dropdownOptions = Array.from(document.querySelectorAll('option'));

    if(button.disabled === false) {
        changePageBtns(button);
        //Change selected option in dropdown
        changeSelectOption(dropdownOptions);
    }
});

elements.playerSearchBar.addEventListener('keyup', e => {
    const searchString = e.target.value.toLowerCase();

    if(searchString.length > 0) {
        const fetchedPlayers = async () => {
            const players = await fetchPlayers();
            const filteredPlayers = players.filter(player => {
                return player.firstName.toLowerCase().includes(searchString) ||
                       player.lastName.toLowerCase().includes(searchString)
                ;
            });
            clearResults();
            filteredPlayers.forEach(player => renderPlayer(player));
            showNumberOfPlayers(filteredPlayers);
            clearDropdown();
            createDropdown(filteredPlayers.length / 50);
        }
        fetchedPlayers();
    } else if(searchString.length === 0) {
        fetchPlayers().then(data => {
            clearResults();
            renderResults(data);
            showNumberOfPlayers(data);
        })
    }
});

function showNumberOfPlayers(res) {
    let numOfPlayers = elements.numOfPlayers;
    numOfPlayers.innerHTML = res.length + '&nbsp';
};

function showNumOfPages(numPages) {
    elements.numOfPages.innerHTML ='&nbsp' + Math.ceil(numPages);
};


fetchPlayers().then(data => {
   renderResults(data);
   showNumberOfPlayers(data);
});


