let movieSearchResults = []
let movieSearchResultCardsDeck = []
let movieSearchResultsMap = new Map()
let savedMovieCards = []
let duplicateSearches = []
let undoPile = []
let expandIsAlive = false 
let cardPosition
let returnScrollValue
let firstSearch = true 
let savedListModeActive = false
let movieNeedsDeleting = false
let itemIsGettingDeleted = false
let returningToSearchScreen= false
let movieToDelete = ""
let movieToDeleteIndex 


const appHeightAndWidth = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    doc.style.setProperty('--app-height', `${window.innerWidth}px`)
}
window.addEventListener('resize', appHeightAndWidth)
appHeightAndWidth()





document.getElementById("search-bar-container").onscroll = function(){
    document.getElementById("search-results-container").style.visibility = "hidden"

}

function generateBlankCards(){
    let i = 0
    while (i<10){
        document.getElementById("search-results-container").innerHTML += '<div class="movie-card"></div>'
        i++
    }
}




function searchForMovie(){
    if (document.getElementById("no-results-results")){
        document.getElementById("no-results-message").remove()
    }

    document.getElementById("left-top-container").style.animation = ""
    document.getElementById("middle-top-container").style.animation = ""
    document.getElementById("search-results-container").style.animation = ""
    document.getElementById("background-container").style.animation = ""
    document.getElementById("search-bar-container").style.animation = ""
    document.getElementById("search-results-container").classList.remove("save-mode")
    document.body.classList.remove("save-mode")
    const movieToSearchFor = document.getElementById("search-field").value 
    document.getElementById("background-container").style.animation = "blurOut3 1s linear both"
    document.body.innerHTML += "<img id='waiting-animation' src='images/waiting.gif'>"
    // document.getElementById("search-results-container").innerHTML = ""
    // generateBlankCards()

    // if (firstSearch){
    //     generateBlankCards()
    //     firstSearch = false
    // }
    document.getElementById("search-results-container").style.animation = "none"
    if (!returningToSearchScreen){
        movieSearchResults = []
        movieSearchResultCardsDeck = []
        duplicateSearches = []
    }
    // document.getElementById("search-results-container").innerHTML = ""
    document.getElementById("search-results-container").style.animation = "blurOut .5s linear both"


   


    if (returningToSearchScreen){
        generateMovieCards()
        checkForMoviesAlreadySaved()
        returningToSearchScreen = false 
    } else{

    fetch (`https://www.omdbapi.com/?s=${movieToSearchFor}&apikey=c9565f8b&type=movie`)
    .then (data => data.json())
    .then (data => {
        if (data.Response === "False"){
            console.log ("hellO!")
            document.getElementById("waiting-animation").remove()
            document.getElementById("background-container").style.animation ="none"
            document.getElementById("search-results-container").style.animation = "none"
            document.getElementById("search-results-container").innerHTML = '<p id="no-results-message">Sorry, no results. Try another search</p>'
            document.documentElement.style.setProperty('--background-brightness-value', '1')
        }else{
            console.log(data)

        movieSearchResults = [...data.Search]
        // document.getElementById("search-results-container").style.animation = "none"
        // document.getElementById("search-results-container").style.animation = "blurInAndOut .75s linear both"
        // setTimeout(()=>{
        //     document.getElementById("search-results-container").style.animation = "none"
        // }, 751)
        let fetchCount = 0 
        for (let movie of movieSearchResults){
                 fetch (`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=c9565f8b`)
                 .then (data => data.json())
                  .then (data => {
                    fetchCount++
                    movie = Object.assign(movie, data)
                    movie.ShortPlot = movie.Plot
                    if (fetchCount === movieSearchResults.length){
                        document.getElementById("search-results-container").innerHTML = ""
                        // document.body.style.backgroundImage = "none"
                        generateMovieCards()
                        checkForMoviesAlreadySaved()
                    }

                        // let movieCardId = movieSearchResultCard.generateMovieCardId() 
                        // let expandButtonId = movieSearchResultCard.generateExpandButtonId() 
                        // let saveButtonId = movieSearchResultCard.generateExpandButtonId() 
                        // let movieCardHtml = movieSearchResultCard.generateMovieCardHtml()
                          
                })  } }})}

        function generateMovieCards(){
            let generationCount = 0 
            // document.getElementById("search-results-container").style.animation = "blurIn .5s linear both"
            document.getElementById("waiting-animation").remove()
        for (let movie of movieSearchResults){
            generationCount++
            let movieSearchResultCard = new MovieCard(movie)
            movieSearchResultsMap.set(movieSearchResultCard.movieCardId, movieSearchResultCard)
            movieSearchResultCardsDeck.push(movieSearchResultCard)
            document.getElementById("search-results-container").innerHTML += movieSearchResultCard.generateMovieCardHtml()
            document.getElementById(movieSearchResultCardsDeck[movieSearchResultCardsDeck.length - 1].movieCardId).classList.add("blur-in")
            // checkIfMovieIsAlreadySaved()
            // function checkIfMovieIsAlreadySaved(){
            //     let alreadySavedMovie = savedMovieCards.find(savedMovie => savedMovie.imdbID === movieSearchResultCard.imdbID)
            //     console.log(`Already saved movie = ${alreadySavedMovie}`)
            //     if (alreadySavedMovie){
            //         let i = movieSearchResultCardsDeck.indexOf(movieSearchResultCard)
            //         movieSearchResultCardsDeck.splice(movieSearchResultCardsDeck[i], 1, alreadySavedMovie )
            //         document.getElementById(movieSearchResultCard.addButtonId).classList.add("saved")
            //     }
            // }
            if (generationCount >= movieSearchResults.length / 2){
                document.getElementById("search-results-container").style.animation = "blurIn .5s linear both"
            }
        }
    }

    function checkForMoviesAlreadySaved(){
        for (let card of movieSearchResultCardsDeck){
            for (let savedMovie of savedMovieCards){
                if (card.imdbID === savedMovie.imdbID){
                    Object.assign(card, savedMovie)
                    // movieSearchResults.splice(movieSearchResults.indexOf(searchResult), 1)
                    // duplicateSearches.push(searchResult)
                    document.getElementById(card.addButtonId).classList.add("saved")
                    // console.log(movieSearchResults)
                    // console.log(duplicateSearches)
                }
            }
        }
    }

     
            
       
   
    // .then (data => showResults())
 
}

function showResults(){
    document.getElementById("search-results-container").innerHTML = ""
    for (let movie of movieSearchResults){
        new MovieCard(movie)
    }
}

function MovieCard(data){
    Object.assign(this, data)

    if (this.Poster === "N/A"){
        this.Poster = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
    }

    if (this.Genre === "N/A"){
        this.Genre = "Genre unlisted"
    }

    if (this.Runtime === "N/A"){
        this.Runtime = "Runtime unlisted"
    }

    if (this.Plot === "N/A"){
        this.Plot = "Synopsis not provided."
    }

    if (this.imdbRating === "N/A"){
        this.imdbRating = "Rating unlisted"
    }

    this.generateMovieCardHtml = function() {
        this.movieCardId = `movie-card-${this.imdbID}`
        this.movieCardContent = this.generateMovieCardContent()

        let optionalSaveModeClass = ""
        if (savedListModeActive){
            optionalSaveModeClass = "save-mode"
        }

        return  `
            <div class="movie-card ${optionalSaveModeClass}" id="${this.movieCardId}">
              
                ${this.movieCardContent}

            </div> `

        }

    this.generateStarsAndRatingClasses = function(whichOne){

        let stars = ""
        let classToAddToRating 
        let classToAddToStars

        if (Number(this.imdbRating) >= 7){
            classToAddToStars = "green-stars"
            classToAddToRating = "green-text"
            // document.getElementById(`${idTagRoot}-rating`).style.color = "rgb(25, 255, 25)"
        } else if (Number(this.imdbRating) >= 5){
            classToAddToStars = "yellow-stars"
            classToAddToRating = "yellow-text"
            // document.getElementById(`${idTagRoot}-rating`).style.color = "yellow"
        } else if (Number(this.imdbRating) < 5){
            classToAddToStars = "red-stars"
            classToAddToRating = "red-text"
            // document.getElementById(`${idTagRoot}-rating`).style.color = "red"
        }

        for (let i=0; i < Math.floor(this.imdbRating); i++ ) {
            stars += `<img class="star ${classToAddToStars}" src="images/star-solid.svg">`
        }

        if (this.imdbRating - Math.floor(this.imdbRating) >= .4 ){
            stars += `<img class="star ${classToAddToStars}" src="images/star-half-solid.svg">`
        }

        if (whichOne === "getStars"){
            return stars}

        if (whichOne === "getRatingClass"){
            return classToAddToRating}


    }

    this.generateMovieCardContent = function(){
        this.expandButtonId = `expand-button-${this.imdbID}`
        this.addButtonId = `save-button-${this.imdbID}`
        this.undoButtonId = `undo-button-${this.imdbID}`
        let optionalSavedClass = ""
        let stars = this.generateStarsAndRatingClasses("getStars")
        let classToAddToRating = this.generateStarsAndRatingClasses("getRatingClass")

        if (this.CardSaved){
            optionalSavedClass = "saved"
        }
        let optionalSaveModeClass = ""
        if (savedListModeActive){
            optionalSaveModeClass = "save-mode"
        }



             return   ` <div class="movie-image-container">
                    <img class="movie-poster ${optionalSaveModeClass}" src="${this.Poster}">
                </div>

                <div class="movie-info-container ${optionalSaveModeClass}">

                    <div class="title-and-rating-container">
                        <p class="movie-title ${optionalSaveModeClass}">${this.Title}</p>
                    </div>

                    <div class="stats-and-add-button-container ${optionalSaveModeClass}">
                        <p class="movie-rating ${classToAddToRating}">${stars}${this.imdbRating}</p>
                        <p>${this.Runtime}</p>
                    </div>

                    <div class="stats-and-add-button-container ${optionalSaveModeClass}">
                        <p>${this.Genre}</p> 
                        <p>${this.Year}</p>
                    </div>

                    <div class="summary-container ${optionalSaveModeClass}">
                        ${this.ShortPlot}
                    </div>

                    <div class="add-and-expand-button-container">
                        <button class="more-info-button" id="${this.expandButtonId}">More info</button>
                        <div class="add-button-container"><button class="add-button ${optionalSavedClass}" id=${this.addButtonId}></button> </div>
                    
                    </div>

                </div>`

    }

    this.generateExpandedMovieCardHtml = function(){
        this.goBackButtonId = `go-back-button-${this.imdbID}`
        this.littleGoBackButtonId = `go-back-button-${this.imdbID}-little`
        this.expandedAddButtonId = `expanded-add-button-${this.imdbID}`
        let stars = this.generateStarsAndRatingClasses("getStars")
        let classToAddToRating = this.generateStarsAndRatingClasses("getRatingClass")

        return ` 
        <img class="expanded-image" src="${this.Poster}">
        <div class="expanded-info-overall-container">
            <div class="expanded-info-container one">
                <p class="expanded-title">${this.Title}</p>
                <div class="two-button-container">
                <div class="little-back-button-container"><button class="little-back-button" id="${this.littleGoBackButtonId}"></button></div>
                <div class="add-button-container"><button class="add-button" id="${this.expandedAddButtonId}"></button> </div> 
                </div>
            </div>
            <div class="separator"></div>
            <div class="expanded-info-container two">
                <p><span>Rating:</span> ${this.Rated} </p>
                <p><span>Year of Release:</span> ${this.Year} </p>
                <p><span>Length:</span> ${this.Runtime} </p>
                <p><span>Genre:</span> ${this.Genre} </p>
                <p><span>Language:</span> ${this.Language} </p>
                <p><span>Country:</span> ${this.Country} </p>
            </div>
            <div class="separator"></div>
            <div class="expanded-info-container three">
                <p><span>Directed by</span> ${this.Director} </p>
                <p><span>Written by</span> ${this.Writer}</p>
                <p><span>Starring</span> ${this.Actors} </p>
            </div>
            <div class="separator"></div>
            <div class="expanded-info-container four">
                <p><span>Awards:</span> ${this.Awards} </p>
                <p><span>Metacritic Score:</span> ${this.Metascore}</p>
                <p><span>IMDB Votes:</span> ${this.imdbVotes}</p>
                <p class="movie-rating ${classToAddToRating}"><span>IMDB Rating:&nbsp</span> ${stars}${this.imdbRating}</p>
            </div>
            <div class="separator"></div>
            <div class="expanded-info-container five">
                <p>${this.LongPlot} </p>
           </div>
           <button class="go-back-button" id="${this.goBackButtonId}">Go Back</button>
           <p class="ghost-spacer">&nbsp</p>

        </div>

       
    
        
        `
    }

    this.generateMovieCardId = function (){
        this.movieCardId = `movie-${this.imdbID}-card`
        return this.movieCardId
    }
    this.addMovieCardEventListeners = function(){
        document.getElementById(`more-info-about-${this.imdbID}-button`).addEventListener("click", function(){
            console.log(`Movie ID = ${this.imdbID}`)})
    }

    this.generateDummyCard = function() {
        let optionalSaveModeClass = ""
        if (savedListModeActive){
            optionalSaveModeClass = "save-mode"
        }
        this.dummyCardId = `dummy-card-${this.imdbID}`
        return  `
        <div class="movie-card ${optionalSaveModeClass}"id="${this.dummyCardId}">
          
            ${this.movieCardContent}

        </div> `
    }
    



}





let prevScrollpos = window.pageYOffset;

window.onscroll = function() {
  let currentScrollPos = window.pageYOffset
  if (!expandIsAlive && !itemIsGettingDeleted && currentScrollPos > window.innerHeight * .075){
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("search-bar-container").style.animation = "fade-in .25s linear both"
    } else {
        document.getElementById("search-bar-container").style.animation = "fade-out .5s linear both"
    }
}
  prevScrollpos = currentScrollPos;
}


document.addEventListener("click", function(event){

	if (event.target.matches('.more-info-button')) {
        // let cardId = event.target.id.replace("-button", "-card")
        expandMovieCard(event.target.id)
		// Run your code to open a modal
	}  
    
    if(event.target.matches('.go-back-button')){
        console.log(event.target.id)
        minimizeMovieCard(event.target.id)
    } 

    if(event.target.matches('.little-back-button')){
        console.log(event.target.id.replace("-little", ""))
        minimizeMovieCard(event.target.id.replace("-little", ""))
    } 
    
    if(event.target.matches('.add-button')){
        addMovieToWatchList(event.target.id)
    } if (event.target.matches("#search-button")){
        savedListModeActive = false
        if (document.getElementById("search-field").value != ""){
        searchForMovie()}
    }
    if (event.target.matches("#open-saved-movies-button")){
        openSavedMovies()
    }

    if (event.target.matches("#back-to-search-button")){
        savedListModeActive = false
        returnToSearchScreen()
    }

}, false)


function openSavedMovies(){

    document.getElementById("left-top-container").style.animation = "blurOut .25s linear both"
    document.getElementById("middle-top-container").style.animation = "blurOut .25s linear both"
    
    setTimeout(() => {
        
        document.getElementById("left-top-container").innerHTML = `
        <button id="back-to-search-button"><img id ="search-icon" src="images/magnifying-glass-solid.svg">Search</button> `

        document.getElementById("middle-top-container").innerHTML = `
        <p id="saved-movies-title">My Saved Movies List</p>`

        document.getElementById("left-top-container").style.animation = "blurIn .25s linear both"
        document.getElementById("middle-top-container").style.animation = "blurIn .25s linear both"
    }, 250)
    
    if (savedMovieCards.length === 0){
        document.documentElement.style.setProperty('--background-brightness-value', '1')
    } else {
        document.documentElement.style.setProperty('--background-brightness-value', '1.5')
    }
    savedListModeActive = true 
    // document.getElementById("background-container").style.animation = 'blurInAndOut2 10s linear both'
    document.getElementById("search-results-container").style.animation = "blurOut .25s linear both"
    document.getElementById("background-container").style.animation = "blurOut3 .25s linear both"
    setTimeout(() => {
        document.getElementById("search-results-container").innerHTML = ""
        if (savedMovieCards.length === 0){
            document.getElementById("search-results-container").innerHTML = '<p id="no-results-message">No movies are currently saved.</p>'
        }
        window.scrollTo(0, 0)
        for (let movie of savedMovieCards){
            document.getElementById("search-results-container").classList.add("save-mode")
            document.body.classList.add("save-mode")
            document.getElementById("search-results-container").innerHTML += movie.generateMovieCardHtml()
        }
        // if (savedMovieCards.length > 0){
        //     document.body.style.backgroundImage = "none"
        // }
        document.getElementById("search-results-container").style.animation = "blurIn .25s linear both"
        
    }, 250);


}

function addMovieToWatchList(buttonId){
    let cardsToUse = movieSearchResultCardsDeck
    if (savedListModeActive){
        cardsToUse = savedMovieCards 
    }
    let movieToAddOrRemove = cardsToUse.find(card => card.addButtonId === buttonId || card.expandedAddButtonId === buttonId)
    if (!movieToAddOrRemove.CardSaved){
        movieNeedsDeleting = false
        movieToAddOrRemove.CardSaved = true
        savedMovieCards.push(movieToAddOrRemove)
        localStorage.setItem("savedMovies", JSON.stringify(savedMovieCards))
        document.getElementById(movieToAddOrRemove.addButtonId).classList.add("saved")
        if(document.getElementById(movieToAddOrRemove.expandedAddButtonId)){document.getElementById(movieToAddOrRemove.expandedAddButtonId).classList.add("saved")}
    } else {
        document.getElementById(movieToAddOrRemove.addButtonId).classList.remove("saved")
        if(document.getElementById(movieToAddOrRemove.expandedAddButtonId)){document.getElementById(movieToAddOrRemove.expandedAddButtonId).classList.remove("saved")}
        movieToAddOrRemove.CardSaved = false
        if (savedListModeActive && expandIsAlive){
            movieNeedsDeleting = true
        } else {
            savedMovieCards.splice(savedMovieCards.indexOf(movieToAddOrRemove), 1)
            localStorage.setItem("savedMovies", JSON.stringify(savedMovieCards))
        }

        if (savedListModeActive){
            if (!expandIsAlive){
                itemIsGettingDeleted = true
                if (savedListModeActive){
                    document.getElementById(movieToAddOrRemove.movieCardId).style.animation = "blurOutAndMinimize2 .5s linear both"
                } else {
                    document.getElementById(movieToAddOrRemove.movieCardId).style.animation = "blurOutAndMinimize .5s linear both" 
                }
                setTimeout(() => {
                    document.getElementById(movieToAddOrRemove.movieCardId).remove()
                    if (savedMovieCards.length === 0){
                           document.documentElement.style.setProperty('--background-brightness-value', '1')
                            document.getElementById("search-results-container").innerHTML = '<p id="no-results-message">No movies are currently saved.</p>'
                    }
                }, 501)

                setTimeout(() => {
                    itemIsGettingDeleted = false
                    if (savedMovieCards.length === 0){
                            document.getElementById("search-bar-container").style.animation = "fade-in .25s linear both"
                    }
                }, 550);
            } else {undoPile.push(movieToAddOrRemove)}
        }
    } 
   
}

function expandMovieCard(buttonId){
    for (let movieCard of document.getElementsByClassName("movie-card")){
        movieCard.classList.remove("blur-in")
    }
    let cardToExpand
    let movieCard
    expandIsAlive = true
    returnScrollValue = window.scrollY
    document.getElementById("search-bar-container").style.animation = "fade-out .15s linear both"
    document.body.style.overflow = "hidden"
    document.getElementById("search-results-container").classList.add("fix")
    let movieArrayToUse = movieSearchResultCardsDeck
    if (savedListModeActive){
        movieArrayToUse = savedMovieCards
    }
    for (let movie of movieArrayToUse){
        if (movie.expandButtonId === buttonId ){
            cardToExpand = document.getElementById(`${movie.movieCardId}`)
            movieCard = movie 
            // cardPosition = getPosition(cardToExpand)
            // document.documentElement.style.setProperty('--starting-left-value', cardPosition.left + "px")
            // document.documentElement.style.setProperty('--starting-top-value', cardPosition.top + "px")
            // document.documentElement.style.setProperty('--ending-left-value', (0 - cardPosition.left) + "px")
            // document.documentElement.style.setProperty('--ending-top-value', (0 - cardPosition.top) + "px")

            document.documentElement.style.setProperty('--starting-left-value', cardToExpand.offsetLeft + "px")
            document.documentElement.style.setProperty('--starting-top-value', cardToExpand.offsetTop + "px")
            document.documentElement.style.setProperty('--ending-left-value', 0)
            document.documentElement.style.setProperty('--ending-top-value', window.scrollY  + "px")
        } else {
            document.getElementById(`${movie.movieCardId}`).classList.add("blur-out")
         }
    }
    cardToExpand.innerHTML = ""
    document.getElementById("search-bar-container").style.visibility = "hidden"
    document.getElementById("search-results-container").classList.add("expand-to-full-screen")
    fetch (`https://www.omdbapi.com/?i=${movieCard.imdbID}&apikey=c9565f8b&plot=full`)
        .then(data => data.json())
        .then((data) => {
            Object.assign(movieCard, data)
            movieCard.LongPlot = movieCard.Plot 
            cardToExpand.innerHTML = movieCard.generateExpandedMovieCardHtml()
            if (movieCard.CardSaved){
                document.getElementById(movieCard.expandedAddButtonId).classList.add("saved")
            }
        }) 
    // document.getElementById("search-bar-container").style.height = "0"
    let dummyCard = movieCard.generateDummyCard()
    cardToExpand.insertAdjacentHTML("beforebegin", dummyCard)
    if (movieCard.CardSaved){
        document.getElementById(movieCard.addButtonId).classList.add("saved")
    }
    document.getElementById(movieCard.dummyCardId).classList.add("blur-out")
    cardToExpand.classList.add("expanded-card")
}

function minimizeMovieCard(buttonId){
    let movieArrayToUse = movieSearchResultCardsDeck
    if (savedListModeActive){
        movieArrayToUse = savedMovieCards
    }
    let objectOfCardToMinimize
    document.getElementById("search-results-container").classList.remove("fix")
    document.getElementById("search-results-container").classList.remove("expand-to-full-screen")
    document.documentElement.style.setProperty('--background-brightness-value', '1.5')
    document.getElementById("search-bar-container").style.visibility = "visible"
    document.body.style.overflow = "visible"
    // document.getElementById("search-bar-container").style.opacity = "1"
    for (let movie of movieArrayToUse){
        if (movie.goBackButtonId === buttonId){
            objectOfCardToMinimize = movie
            cardToMinimize = document.getElementById(`${movie.movieCardId}`)
            cardToMinimize.style.animation = "minimize ease .5s both"
            setTimeout(() => {
                cardToMinimize.innerHTML = movie.generateMovieCardContent()
               
            }, 250);
            setTimeout(() => {
                document.getElementById(`${movie.dummyCardId}`).remove()
                cardToMinimize.style.animation = ""
                cardToMinimize.classList.add("temporary-blur")
                cardToMinimize.classList.remove("expanded-card")
            }, 500);

            setTimeout(() => {
                cardToMinimize.classList.remove("temporary-blur")
                if (movie.CardSaved){
                    document.getElementById(movie.addButtonId).classList.add("saved")
                }
            }, 750);
            
            window.scrollTo(0, returnScrollValue) 
        } else{
            document.getElementById(`${movie.movieCardId}`).classList.remove("blur-out") 
            document.getElementById(`${movie.movieCardId}`).classList.add("blur-in") 
            setTimeout(() => {
                document.getElementById(`${movie.movieCardId}`).classList.remove("blur-in") 
                
            }, 750)
        }
        
     }
     if (window.pageYOffset < window.innerHeight * .075){
            //  document.getElementById("search-bar-container").style.animation = "fade-in .25s linear both"
            document.getElementById("search-bar-container").style.animation = ""
            document.getElementById("search-bar-container").classList.add("blur-in-search-bar")
        
        setTimeout(() => {
            document.getElementById("search-bar-container").classList.remove("blur-in-search-bar")
        }, 750)
    }
    if (movieNeedsDeleting){
        setTimeout(() => {
            // cardToMinimize.CardSaved = false
            movieNeedsDeleting = false 
            expandIsAlive = false
            objectOfCardToMinimize.CardSaved = true
            addMovieToWatchList(objectOfCardToMinimize.addButtonId)
        
        }, 500)

        // savedMovieCards.splice(savedMovieCards[0], 1)
        // localStorage.setItem("savedMovies", JSON.stringify(savedMovieCards))
        // document.getElementById(movieToDelete.movieCardId).style.animation = "blurOutAndMinimize .5s linear both" 
        //     setTimeout(() => {
        //         document.getElementById(movieToDelete.movieCardId).remove()
        //     }, 501)

       
    }else{    expandIsAlive = false
    }
} 



function getPosition(element) {
    let position = element.getBoundingClientRect()
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { top: position.top + scrollTop, left: position.left + scrollLeft}
}

function checkForSavedMoviesInLocalStorage(){
    let savedMoviesToLoad = [...JSON.parse(localStorage.getItem("savedMovies"))]
    for (let movie of savedMoviesToLoad){
        let movieCardToConstructAndPush = new MovieCard(movie)
        savedMovieCards.push(movieCardToConstructAndPush)
    }
}

function returnToSearchScreen(){

    document.getElementById("left-top-container").style.animation = "blurOut .25s linear both"
    document.getElementById("middle-top-container").style.animation = "blurOut .25s linear both"
    document.getElementById("search-results-container").style.animation = "blurOut .25s linear both"
    setTimeout(() => {
        
        document.getElementById("left-top-container").innerHTML = `
           <button id="open-saved-movies-button"><img id ="list-icon" src="images/list-solid.svg">My Movies</button>`

        document.getElementById("middle-top-container").innerHTML = `
            <div id="overall-search-container">

            <div id="search-field-container">
                <img src="images/magnifying-glass-solid.svg">
                <input type="text" id="search-field" placeholder="Enter a word, phrase, or movie title">
            </div>

            <button id="search-button">Search</button>

            </div>`
        
        document.getElementById("search-results-container").innerHTML = ""
        returningToSearchScreen = true
        searchForMovie()
        document.getElementById("left-top-container").style.animation = "blurIn .25s linear both"
        document.getElementById("middle-top-container").style.animation = "blurIn .25s linear both"
        document.getElementById("search-results-container").style.animation = "blurIn .25s linear both"
        document.getElementById("background-container").style.animation = "blurIn .25s linear both"
    }, 250)

}

checkForSavedMoviesInLocalStorage()

