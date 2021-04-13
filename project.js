const searchBtn = document.getElementById("search-btn");
const showList = document.getElementById("show");
const showDetailsContent = document.querySelector(".show-details-content");
const showCloseBtn = document.getElementById("intro-close-btn");

// event listeners
searchBtn.addEventListener("click", getShowList);
showList.addEventListener("click", getShowIntro);
showCloseBtn.addEventListener("click", () => {
  showDetailsContent.parentElement.classList.remove("showIntro");
});

// get show list
function getShowList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(`https://api.tvmaze.com/search/shows?q=${searchInputTxt}`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (Array.isArray(data) && data.length > 0) {
        html = data.reduce((html, searchResult) => {
          html += `
          <div class = "show-item" data-id = "${searchResult.show.id}">
                              <div class = "show-name">
                                  <h3>${searchResult.show.name}</h3>
                                  <a href = "#" class = "intro-btn">Learn More</a>
                              </div>
                          </div>
        `;
          return html;
        }, "");
        showList.classList.remove("notFound");
      } else {
        html = "Sorry, the search did not have any matches.";
        showList.classList.add("notFound");
      }
      showList.innerHTML = html;
    });
}
// get instruction of the shows
function getShowIntro(e) {
  e.preventDefault();
  if (e.target.classList.contains("intro-btn")) {
    let showItem = e.target.parentElement.parentElement;
    fetch(`https://api.tvmaze.com/shows/${showItem.dataset.id}`)
      //https: secure protocol
      .then((response) => response.json())
      .then((data) => showIntroModal(data));
  }
}
// show  a paper
function showIntroModal(show) {
  let html = `
        <h2 class = "intro-title">${show.name}</h2>
        <div class = "intro-instruct">
            <h3>Genres:</h3>  
            <p>${show.genres[0]}</p>
            <h3>Schedule:</h3>
            <p>${show.schedule.days} ${show.schedule.time}</p>
            <h3>Duration:</h3>
            <p>${show.runtime} min.</p>
            <h3>Language:</h3>
            <p>${show.language}</p>
            <h3>Instructions:</h3>
            <p>${show.summary}</p>
            <h3>Status:</h3>
            <p>${show.status}</p>
        </div>
        <div class = "intro-show-img">
            <img src = "${show.image.medium}" alt = "">
        </div>
        <div class = "intro-link">
            <a href = "${show.url}" target = "_blank">Watch now</a>
        </div>
    `;
  showDetailsContent.innerHTML = html;
  showDetailsContent.parentElement.classList.add("showIntro");
}
