export const elements = {
    playerTable: document.querySelector('.tableBody'),
    playerSearchBar: document.querySelector('.data__input'),
    dataContainer: document.querySelector('.data-container'),
    numOfPlayers: document.querySelector('#players__filter-span'),
    numOfPages: document.querySelector('#players__filter-pages-span'),
    pageSelect: document.querySelector('.players__filter-page-select'),
    prevBtn: document.querySelector('.btn-prev'),
    nextBtn: document.querySelector('.btn-next'),
    pageBtn: document.querySelector('.players__filter-buttons'),
    divisionWrapper: document.querySelector('.teams-divisions__wrapper'),
    east: document.querySelector('.tableBody-east'),
    west: document.querySelector('.tableBody-west'),
    newsBtn: document.querySelector('.news'),
    header: document.querySelector('.header'),
    nav: document.querySelector('nav'),
    hamburgerMenu: document.querySelector('.hamburger'),
    emptySpace: document.querySelector('.empty-space')
}


export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/sprites/solid.svg#spinner"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};