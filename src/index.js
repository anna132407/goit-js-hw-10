import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearch: document.querySelector("input#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),

}

let searchCountry = '';

refs.inputSearch.addEventListener('input', debounce(onSearchCountryInput, DEBOUNCE_DELAY));

function onSearchCountryInput(event) {
    event.preventDefault();

    searchCountry = event.target.value.trim();

    if (searchCountry === '') {
        refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
        return;
    } else fetchCountries(searchCountry).then(namesCountry => {
        if (namesCountry.length < 2) {
            showCountryInfo(namesCountry);
        } else if (namesCountry.length < 10 && namesCountry.length > 1) {
            showCountryList(namesCountry);
        } else {
            refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        };
    })
        .catch(() => {
            refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
}


function showCountryInfo(country) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    const languages = Object.values(country[0].languages).map(el => el.name).join(', ');
    console.log(languages);
    const countryFullMarkup = 
        `
        <img
            class="flag"
            src="${country[0].flags.svg}"
            alt="country flag"
            width=100
        />
        <h1>${country[0].name}</h1>
        <p>Capital: <span class="country-value">${country[0].capital}</span></p>
        <p>Population: <span class="country-value">${country[0].population}</span></p>
        <p>Languages: <span class="country-value">${languages}</span></p>
`;
    return refs.countryInfo.innerHTML = countryFullMarkup;
};

function showCountryList(country) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    const countryMarkup = country.map((item) => {
        return `
            <li class="country-list-item">
                <img
                    class="flag-svg"
                    src="${item.flags.svg}"
                    alt="flag"
                    width=50
                />
                <p class="country-name">${item.name}</p>
            </li>`
}).join('');
    refs.countryList.insertAdjacentHTML("beforeend", countryMarkup);
};



