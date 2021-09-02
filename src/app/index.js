import '../styles/main.scss';
import { elements } from './base';
import { mobileMenu } from './mobileMenu';

elements.hamburgerMenu.addEventListener('click', mobileMenu);

elements.newsBtn.addEventListener('click', e => {
    const btn = e.target.closest('button');
    const selectedBtn = document.querySelector('.news__btn--selected');
    if(!btn.classList.contains('news__btn--selected')) {
        selectedBtn.classList.remove('news__btn--selected');
        btn.classList.add('news__btn--selected');
    }
});

