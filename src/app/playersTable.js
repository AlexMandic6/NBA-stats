import '../styles/main.scss';
import { fetchPlayers } from './fetchPlayers';
import { fetchTeamColor } from './fetchTeamColors';
import { fetchTeams } from "./fetchTeams";
import { elements, renderLoader, clearLoader } from './base';
import { mobileMenu } from './mobileMenu';

const clearResults = () => {
    elements.playerTable.innerHTML = '';
}
const clearDropdown = () => {
    elements.pageSelect.innerHTML = '';
}


const getTricode = async (id) => {
    const data = await fetchTeams();
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

const renderResults = (players, page = 1, resPerPage = 50) => {
    clearResults();
    if(players.length > resPerPage) {
        const start = (page - 1) * resPerPage;
        const end = page * resPerPage;
        players.slice(start, end).forEach(renderPlayer);
        controlButtons(page, players.length, resPerPage,);
    } else {
        players.forEach(renderPlayer);
    }
}
            
const createDropdown = (pages) => {
    let option;
        for(let i = 0; i < pages; i++) {
            option = `<option value="${i}">${i + 1}</option>`;
            elements.pageSelect.insertAdjacentHTML('beforeend', option);
        }
    if(option) {
        elements.pageSelect.options[0].setAttribute('selected', '');
        showNumOfPages(pages);
    }
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


const controlButtons = (page, numOfResults, resPerPage) => {
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

const changePageBtns = button => {
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

function showNumberOfPlayers(res) {
    let numOfPlayers = elements.numOfPlayers;
    numOfPlayers.innerHTML = res.length + '&nbsp';
};

function showNumOfPages(numPages) {
    elements.numOfPages.innerHTML ='&nbsp' + Math.ceil(numPages);
};

elements.pageSelect.addEventListener('change', selectPage);
elements.hamburgerMenu.addEventListener('click', mobileMenu);

elements.pageBtn.addEventListener('click', e => {
    const button = e.target.closest('.players__filter-btn');
    const dropdownOptions = Array.from(document.querySelectorAll('option'));

    if(button.disabled === false) {
        changePageBtns(button);
        //Change selected option in dropdown
        changeSelectOption(dropdownOptions);
    }
});


function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  const filteredPlayers = async (searchText) => {
    const players = await fetchPlayers();
    const filtered = players.filter(el => {
        return el.firstName.toLowerCase().includes(searchText) ||
        el.lastName.toLowerCase().includes(searchText);
    });
    clearResults();
    clearLoader();
    renderResults(filtered);
    showNumberOfPlayers(filtered);
    clearDropdown();
    createDropdown(filtered.length / 50);
}
  
  let efficientSearch = debounce((e) => {
      const searchString = e.target.value.toLowerCase();
      
      if(searchString.length > 0) {
        renderLoader(elements.dataContainer);
        filteredPlayers(searchString);
    } else if(searchString.length === 0) {
        fetchPlayers().then(data => {
            clearResults();
            renderResults(data);
            showNumberOfPlayers(data);
        })
    }
  });

elements.playerSearchBar.addEventListener('input', efficientSearch);

renderLoader(elements.dataContainer);

fetchPlayers().then(data => {
   clearLoader();
   renderResults(data);
   showNumberOfPlayers(data);
});
