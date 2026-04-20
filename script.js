//BASIC SEARCH LOGIC 
const searchBtn=document.getElementById("searchBtn");
const searchInput=document.getElementById("searchInput");
const moviesContainer=document.getElementById("moviesContainer");
const API_KEY="80d789e2";

searchBtn.addEventListener("click", searchMovies);

function searchMovies(){
    const query=searchInput.value.trim();
    if(!query) return;

    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    .then(res=>res.json())
    .then(data=>{
        if(data.Search){
            displayMovies(data.Search);
        } else {
            moviesContainer.innerHTML="<p>No movies found</p>";
        }
    });
}

function displayMovies(movies){
    moviesContainer.innerHTML="";

    movies.forEach(movie=>{
        const div=document.createElement("div");
        div.classList.add("movie");

        div.innerHTML=`
        <img src="${movie.Poster}"/>
        <h3>${movie.Title}</h3>
        <a href="#movieDetail"class="btn">Show Movie Details</a>
        `;

        div.addEventListener("click",()=>
            getMovieDetails(movie.imdbID)
        );

        moviesContainer.appendChild(div); 
    });
}

//MOVIE DETAILS 
const movieDetails=document.getElementById("movieDetail");

function getMovieDetails(id){
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`) 
    .then(res=>res.json())
    .then(movie=>showMovieDetails(movie));
} 

function showMovieDetails(movie){
    movieDetails.innerHTML=`
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster}"/>
    <p>${movie.Plot}</p>
    <p>⭐ rating:${movie.imdbRating}</p>
    <textarea id="reviewInput" placeholder="Write your review..."></textarea>
    <button onclick="saveReview('${movie.imdbID}')">Save Review</button>
    <div id="reviews"></div>
    `;
    loadReviews(movie.imdbID);
}

//SAVE REVIEWS 
function saveReview(id){
    const input=document.getElementById("reviewInput");
    const review=input.value;

    if(!review) return;

    let reviews=JSON.parse(localStorage.getItem(id))|| [];
    reviews.push(review);

    localStorage.setItem(id, JSON.stringify(reviews));
    input.value="";

    loadReviews(id);
}

function loadReviews(id){
    const reviewsDiv=document.getElementById("reviews");
    const reviews=JSON.parse(localStorage.getItem(id))|| [];

    reviewsDiv.innerHTML="<h3>Reviews:</h3>";

    reviews.forEach(r=>{
        const p=document.createElement("p");
        p.textContent=r;
        reviewsDiv.appendChild(p);
    });
}