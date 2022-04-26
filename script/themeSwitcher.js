const modeSwitcher = document.querySelector(".mode-toggle-btn");
const modeIcon = document.querySelector("#theme-icon");
const modeText = document.querySelector(".mode-text");
const searchIcon = document.querySelector(".search-icon");

modeSwitcher.addEventListener("click", function () {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  modeIcon.classList.toggle("fa-sun");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    modeText.textContent = "Dark Mode";

    searchIcon.style.filter = "invert(0%)";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    modeText.textContent = "Light Mode";

    searchIcon.style.filter = "invert(100%)";
  }
});
