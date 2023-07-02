// selecting the elements in the dom
const modal = document.querySelector(".modal");
const buyBtn = document.querySelectorAll(".buy-btn");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");

const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const sidebarList = document.querySelector(".nav");

const book = document.querySelector(".btn");

// cresting a modal function for when user clicks the buy button
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// creating a close modal function for closing the modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// event listener for the close modal button
btnCloseModal.addEventListener("click", closeModal);

// fetching the mdefault movie that appears at first when the page loads
const fetcMovieDefault = function () {
  fetch("http://localhost:3000/films/1") // id is passed as 1
    .then((res) => res.json())
    .then(function (data) {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      let availableTickets = data.capacity - data.tickets_sold; // creating a variable for available movies

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

      // selecting the elements
      let ticketsText = movieCard.querySelector(".movie-tickets");
      let buyBtn = movieCard.querySelector(".buy-btn");
      buyBtn.addEventListener("click", openModal);

      if (availableTickets <= 0) {
        // checking if movies available is greater than one
        ticketsText.innerHTML = `<p class="movie-error">All tickets have been Sold!</p>`;
      } else {
        // happens if movies available is greater than one
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

// fetching one movie when one is clicked on the sidebar
const fetchOneMovie = function (movie) {
  fetch(`http://localhost:3000/films/${movie.id}`)
    .then((res) => res.json())
    .then(function (data) {
      const movieCard = document.createElement("div"); // creating an element for each movie
      movieCard.classList.add("movie-card");
      let availableTickets = data.capacity - data.tickets_sold; // creating variable for available tickets
      const checkTickets =
        availableTickets > 0
          ? '<button class="buy-btn">Buy Ticket</button>'
          : '<p class="movie-error">All tickets have been Sold!</p>'; // checking if movies is greater than one in the backend and message to display

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
        // check if the tickets is more than one and displays this.
        buyBtn.addEventListener("click", openModal); // adds an event listener if the button is present
      }

      if (availableTickets <= 0) {
        // checking if movies available is greater than one
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

// fetching the movie list that appears on the sidebar
const fetchMovieList = function () {
  fetch("http://localhost:3000/films")
    .then((res) => res.json())
    .then((movies) =>
      movies.forEach(function (movie) {
        const movieTitle = document.createElement("li"); // creating an element to enclose each movie after it has been fetched
        movieTitle.innerHTML = `
          <a href="#">
              <span class="movie-link">${movie.title}</span>
            </a>
          `;
        sidebarList.appendChild(movieTitle); // apppends wach movie to the sidebar

        const movieLink = movieTitle.querySelector(".movie-link"); // selecting each movie
        movieLink.addEventListener("click", function (e) {
          e.preventDefault();
          main.innerHTML = ""; // clearing the main element to remove the previous movie
          fetchOneMovie(movie); // fetching one movie and displaying it to the page
        });
      })
    );
};

fetchMovieList();
