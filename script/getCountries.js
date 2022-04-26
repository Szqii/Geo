const countryList = document.querySelector(".country-list");
const mainList = document.querySelector("#main-list");
const mainDetail = document.querySelector("#main-detail");
const backButton = document.querySelector(".back-btn");
const searchInput = document.querySelector(".search-input");

const selectItems = document.querySelector(".select-items");
const selectItem = selectItems.querySelectorAll("div");
const regionFilter = document.querySelector(".select-selected");

const countries = [];

// Fetch Funcs.
fetchCountries = () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el) => {
        countries.push(el);
      });
      updateCard();
      var countryItemList = document.querySelectorAll(".country-item");
      showDetail(countryItemList);
    });
};

fetchCountryDetail = (countryName) => {
  fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((response) => response.json())
    .then((data) => {
      /* data[0].borders.forEach((code) => fetchBorders(code)); */

      data.forEach((el) => {
        mainDetail.appendChild(createDetailDiv(el));
      });

      if (data[0].borders) {
        fetchBorders(data[0].borders, false);
      } else {
        fetchBorders([], true);
      }
    });
};

fetchBorders = (borderArray, isEmpty) => {
  if (isEmpty) {
    const bordersDiv = document.querySelector(".borders");
    bordersDiv.innerHTML = `<span> No Borders </span>`;
  } else {
    var bordersString = borderArray.toString();

    fetch(`https://restcountries.com/v3.1/alpha?codes=${bordersString}`)
      .then((response) => response.json())
      .then((data) => {
        // Data = Array of borders
        // data[0].name.common = Country Name
        createBorderDiv(data);
        var border = document.querySelectorAll(".border");
        border.forEach((el) => {
          // Click border country to see its details.
          el.addEventListener("click", () => {
            const countryDetail = document.querySelector(".country-detail");
            mainDetail.removeChild(countryDetail);
            fetchCountryDetail(el.innerHTML.toLowerCase());
          });
        });
      });
  }
};

fetchRegion = (region) => {
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el) => {
        countryList.appendChild(createDiv(el));
      });
      var countryItemList = document.querySelectorAll(".country-item");
      showDetail(countryItemList);
    });
};

fetchCountries();

createDiv = (el) => {
  const div = document.createElement("div");
  div.classList.add("country-item");
  div.id = el.name.common.toLowerCase();
  div.innerHTML = `
  <div class="country-flag">
    <img src="${el.flags.svg}" alt="">
  </div>
  <div class="country-info">
    <h3 class="country-name">${el.name.common}</h3>
    <p class="population">Population: <span> ${el.population}</span> </p>
    <p class="region">Region: <span> ${el.region}</span></p>
    <p class="capital">Capital: <span> ${el.capital}</span></p>
  </div>
  `;
  return div;
};

createDetailDiv = (el) => {
  var nativeName = el.name.nativeName[Object.keys(el.name.nativeName)[0]];
  var currency = el.currencies[Object.keys(el.currencies)[0]];
  var languages = Object.values(el.languages);

  const div = document.createElement("div");
  div.classList.add("country-detail");
  div.innerHTML = ` 
  <div class="details"> 
          <div class="details-flag">
            <img src="${el.flags.svg}" alt="" />
          </div>
          <div class="details-description">
            <div class="details-country-name">${el.name.common} ${el.flag}</div>
            <div class="country-details">

            
              <span> Native Name: <span class="detail-text"> ${
                nativeName.common
              }</span> </span>
              <span>Population: <span class="detail-text"> ${
                el.population
              }</span> </span>
              <span>Region: <span class="detail-text"> ${el.region}
              </span></span>
              <span> Sub Region: <span class="detail-text"> ${
                el.subregion
              }  </span></span>
              <span>Capital: <span class="detail-text"> ${
                el.capital
              } </span></span>
              <span>Top Level Domain: <span class="detail-text"> ${
                el.tld
              } </span></span>
              <span>Currencies: <span class="detail-text"> ${currency.name} (${
    currency.symbol
  }) </span></span>
              <span> Languages: <span class="detail-text"> ${languages.join(
                ", "
              )} </span></span>
            </div>

            <div class="borders">
              <span> Border Countries: </span> 
            </div>
          </div>
          </div>
  `;
  return div;
};

createBorderDiv = (borderArray) => {
  const bordersDiv = document.querySelector(".borders");
  borderArray.forEach((el) => {
    const div = document.createElement("div");
    div.classList.add("border");
    div.id = el.name.common.toLowerCase();
    div.innerHTML = `${el.name.common}`;
    bordersDiv.appendChild(div);
  });
};

updateCard = () => {
  shuffle(countries);
  countries.forEach((el) => {
    countryList.appendChild(createDiv(el));
  });
};

shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

backButton.addEventListener("click", () => {
  const countryDetail = document.querySelector(".country-detail");

  mainList.style.display = "block";
  mainDetail.style.display = "none";

  mainDetail.removeChild(countryDetail);
});

// Search Input
searchInput.addEventListener("keyup", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const countryItems = document.querySelectorAll(".country-item");

  countryItems.forEach((el) => {
    const countryName = el.id;

    if (countryName.startsWith(searchValue)) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
});

// Filter by region
selectItem.forEach((el) => {
  el.addEventListener("click", () => {
    while (countryList.firstChild) {
      countryList.removeChild(countryList.lastChild);
    }
    var region = el.innerHTML.toLowerCase();
    if (region == "all") {
      updateCard();
      var countryItemList = document.querySelectorAll(".country-item");
      showDetail(countryItemList);
    } else fetchRegion(region);
  });
});

showDetail = (list) => {
  list.forEach((el) => {
    el.addEventListener("click", () => {
      mainList.style.display = "none";
      mainDetail.style.display = "block";

      fetchCountryDetail(el.id);
    });
  });
};
