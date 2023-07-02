const modal = document.querySelector(".modal");
const buyBtn = document.querySelectorAll(".buy-btn");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");

const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const sidebarList = document.querySelector(".nav");

const book = document.querySelector(".btn");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closeModal);

const fetcMovieDefault = function () {
  fetch("http://localhost:3000/films/1")
    .then((res) => res.json())
    .then(function (data) {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      let availableTickets = data.capacity - data.tickets_sold;

      movieCard.innerHTML = `
          <img src="${data.poster}" alt="" class="movie-img" />
          <div class="movie-details">
            <h2 class="movie-title">Movie Name: ${data.title}</h2>
            <p class="movie-description">
              Description: ${data.description}
            </p>
            <p class="movie-showtime">Showtime: ${data.showtime}</p>
            <p class="movie-runtime">Runtime: ${data.runtime} minutes</p>
            <p class="movie-tickets">Available Tickets: ${availableTickets}</p>
           <button class="buy-btn">Buy Ticket</button>
      `;

      let ticketsText = movieCard.querySelector(".movie-tickets");
      let buyBtn = movieCard.querySelector(".buy-btn");
      buyBtn.addEventListener("click", openModal);

      if (availableTickets <= 0) {
        ticketsText.innerHTML = `<p class="movie-error">All tickets have been Sold!</p>`;
      } else {
        book.addEventListener("click", function (e) {
          e.preventDefault();
          availableTickets--;
          if (availableTickets <= 0) {
            console.log("less than 0");
            buyBtn.remove();
            ticketsText.innerHTML = `<p class="movie-error">All tickets have been Sold!</p>`;
          }
          e.preventDefault();
          ticketsText.innerHTML = `<p class="movie-tickets">Remaining Tickets: ${availableTickets}</p>`;
          closeModal();
        });
      }

      main.appendChild(movieCard);
    });
};

fetcMovieDefault();

const fetchOneMovie = function (movie) {
  fetch(`http://localhost:3000/films/${movie.id}`)
    .then((res) => res.json())
    .then(function (data) {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      let availableTickets = data.capacity - data.tickets_sold;
      const checkTickets =
        availableTickets > 0
          ? '<button class="buy-btn">Buy Ticket</button>'
          : '<p class="movie-error">All tickets have been Sold!</p>';

      movieCard.innerHTML = `
          <img src="${data.poster}" alt="" class="movie-img" />
          <div class="movie-details">
            <h2 class="movie-title">Movie Name: ${data.title}</h2>
            <p class="movie-description">
              Description: ${data.description}
            </p>
            <p class="movie-showtime">Showtime: ${data.showtime}</p>
            <p class="movie-runtime">Runtime: ${data.runtime} minutes</p>
            <p class="movie-tickets">Available Tickets: ${availableTickets}</p>
            ${checkTickets}
      `;

      let ticketsText = movieCard.querySelector(".movie-tickets");
      let buyBtn = movieCard.querySelector(".buy-btn");
      if (checkTickets === '<button class="buy-btn">Buy Ticket</button>') {
        buyBtn.addEventListener("click", openModal);
      }

      if (availableTickets <= 0) {
        ticketsText.innerHTML = `<p class="movie-error">All tickets have been Sold!</p>`;
      } else {
        book.addEventListener("click", function (e) {
          e.preventDefault();
          availableTickets--;
          if (availableTickets <= 0) {
            console.log("less than 0");
            buyBtn.remove();
            ticketsText.innerHTML = `<p class="movie-error">All tickets have been Sold!</p>`;
          }
          e.preventDefault();
          ticketsText.innerHTML = `<p class="movie-tickets">Remaining Tickets: ${availableTickets}</p>`;
          closeModal();
        });
      }

      main.appendChild(movieCard);
    });
};

const fetchMovieList = function () {
  fetch("http://localhost:3000/films")
    .then((res) => res.json())
    .then((movies) =>
      movies.forEach(function (movie) {
        const movieTitle = document.createElement("li");
        movieTitle.innerHTML = `
          <a href="#">
              <span class="movie-link">${movie.title}</span>
            </a>
          `;
        sidebarList.appendChild(movieTitle);

        const movieLink = movieTitle.querySelector(".movie-link");
        movieLink.addEventListener("click", function (e) {
          e.preventDefault();
          main.innerHTML = "";
          fetchOneMovie(movie);
        });
      })
    );
};

// fetchOneMovie(undefined);
fetchMovieList();
