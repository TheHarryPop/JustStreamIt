/*************************************************************
*****************Récupération des catégories*****************/
async function getData(category) {
    let url;
    if (category !== "Best_rating" && category !== "Best_movie") {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=" + category
    }
    else {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score"
    }
    fetch(url).then(async function (response) {
        let data = await response.json();
        let ids = []
        let index = url.indexOf("genre=")
        let j = 0
        if (index !== -1) {
            for(let i=0; i<7; i++) {
                let result = data.results[i];
                if (result === undefined) {
                        let response_2 = await fetch(url + "&page=2" );
                        let data_2 = await response_2.json();
                        result = data_2.results[j];
                        let id = result.id;
                        ids.push(id);
                        j++;                
                }
                else {
                    let id = result.id;
                    ids.push(id);                
                }
            }
        createSkeleton(category);
        ids.forEach(async id => { 
        await img_movie(id, category)});
        ids = [];
        }
        else { 
        if (category === "Best_movie") {
            let result = data.results[0];
            let id = result.id;
            ids.push(id);
        } else {
            for(let i=0; i<7; i++) {
                let result = data.results[i];
                if (result === undefined) {
                        let response_2 = await fetch(url + "&page=2" );
                        let data_2 = await response_2.json();
                        result = data_2.results[j];
                        let id = result.id;
                        ids.push(id);
                        j++;                
                }
                else {
                    let id = result.id;
                    ids.push(id);                
                }
            }
        } 
        createSkeleton(category);
        ids.forEach(async id => { 
        await img_movie(id, category)});
        ids = [];
        }        
    })
    async category => {await showSlides(category)}
}

/*************************************************************
**********Récupération des informations pour un film*********/
function img_movie(id, category) {
    url = "http://localhost:8000/api/v1/titles/" + id;

    if (category === "Best_movie") {
        fetch(url).then(async function(response) {
            let data = await response.json();
            let img = data.image_url;
            let section = document.getElementById("Best_movie_section");
            let movie_img = document.createElement("img");
            movie_img.setAttribute("id", "movie_img_" + id);
            movie_img.setAttribute("class", "best_img");
            movie_img.setAttribute("src", img);
            movie_img.setAttribute("alt", "movie_img_" + id)
            movie_img.setAttribute("onclick", "modal(" + id + ")")
            section.appendChild(movie_img);
            createModal(data, id);
        });
    } 
    else {
        fetch(url).then(async function(response) {
            let data = await response.json();
            let img = data.image_url;
            let container = document.getElementById("slideShowContainer_" + category);
            let test = document.getElementsByClassName("Slide_" + category);
            let movie = document.createElement("div");
            movie.setAttribute("id", "Slide_" + id);
            movie.setAttribute("class", "Slide_" + category);
            if (test.length < 4) {
                movie.setAttribute("style", "display: block")
            }
            else {movie.setAttribute("style", "display: none")}
            let movie_img = document.createElement("img");
            movie_img.setAttribute("id", "movie_img_" + id);
            movie_img.setAttribute("class", "movie_img");
            movie_img.setAttribute("src", img);
            movie_img.setAttribute("alt", "movie_img_" + id)
            movie_img.setAttribute("onclick", "modal(" + id + ")")
            movie.appendChild(movie_img);
            container.appendChild(movie);
            createModal(data, id);
        });
    }

}

/*************************************************************
********************Création du squelette********************/
function createSkeleton(category) {
    section = document.createElement("section");
    section.setAttribute("id", category + "_section");
    section.setAttribute("class", "movies_section");
    document.body.appendChild(section);
    let title_el = document.createElement("h1");
    title_el.setAttribute("id", "title_" + category);
    let title_contents;
    if (category === "Best_movie") {
        title_contents = document.createTextNode("Best movie");
    } else if (category === "Best_rating") {
        title_contents = document.createTextNode("Best rating");
    } else {
        title_contents = document.createTextNode(category);
    }
    title_el.appendChild(title_contents);
    section.appendChild(title_el);
    if (category !== "Best_movie") {
        let container = document.createElement("div");
        container.setAttribute("id", "slideShowContainer_" + category);
        container.setAttribute("class", "slideShowContainer");
        let prev = document.createElement("a");
        prev.setAttribute("class", "prev");
        prev.setAttribute("onclick", "plusSlides(-1, " + "'" + category + "'" + ")");
        let prev_button = String.fromCharCode(10094);
        let prev_contents = document.createTextNode(prev_button)
        prev.appendChild(prev_contents);
        let next = document.createElement("a");
        next.setAttribute("class", "next");
        next.setAttribute("onclick", "plusSlides(1, " + "'" + category + "'" + ")");
        let next_button = String.fromCharCode(10095);
        let next_contents = document.createTextNode(next_button)
        next.appendChild(next_contents);
        container.appendChild(prev);
        container.appendChild(next);
        section.appendChild(container);
    }
}    

/*************************************************************
***************************Carousel**************************/
let slideIndex = 0;

function showSlides(category) {

    const toShow = 4;
    const slides = document.getElementsByClassName("Slide_" + category);
    const totalSlides = slides.length;

    for (let slide of slides) {
        slide.style.display = "none";
    }

    if (slideIndex === -1) {
        slideIndex = 3;

        slides[slideIndex].style.display = "block";
        slides[slideIndex+1].style.display = "block";
        slides[slideIndex+2].style.display = "block";
        slides[slideIndex+3].style.display = "block";
    }
    else
    {
        slides[slideIndex].style.display = "block";
        slides[slideIndex+1].style.display = "block";
        slides[slideIndex+2].style.display = "block";
        slides[slideIndex+3].style.display = "block";
    }
    if (slides[slideIndex + toShow] === undefined || slideIndex >= totalSlides) {
        slideIndex = -1;
    }

} 

function plusSlides(n, category){

    if (n === 1) {
        slideIndex++;
        showSlides(category)
    }
    
    else {
        if (slideIndex === -1) {
            slideIndex = 2;
        } 
        else if (slideIndex === 0) {
            slideIndex = -1
        }
        else {
            slideIndex--;
        }

    showSlides(category)
    }
}  
/*************************************************************
****************************Modal****************************/  
function createModal(data, id) {
    let modal = document.createElement("div");
    modal.setAttribute("id", "Modal_" + id);
    modal.setAttribute("class", "modal");
    let modal_content = document.createElement("div");
    modal_content.setAttribute("class", "modal_content");
    let title = document.createElement("p");
    let title_content = document.createTextNode("Title : " + data.title);
    title.appendChild(title_content);
    let close = document.createElement("span");
    close.setAttribute("id", "close_" + id);
    close.setAttribute("class", "close");
    let close_content = document.createTextNode("×");
    close.appendChild(close_content);
    let image_url = document.createElement("img");
    image_url.setAttribute("alt", "img_" + id);
    image_url.setAttribute("src", data.image_url);
    let genres = document.createElement("p");
    let genres_content = document.createTextNode("Genres : " + data.genres);
    genres.appendChild(genres_content);
    let date_published = document.createElement("p");
    let date_published_content = document.createTextNode("Date published : " + data.date_published);
    date_published.appendChild(date_published_content);
    let rated = document.createElement("p");
    let rated_content = document.createTextNode("Rated : " + data.rated);
    rated.appendChild(rated_content);
    let imdb_score = document.createElement("p");
    let imdb_score_content = document.createTextNode("IMDB score : " + data.imdb_score);
    imdb_score.appendChild(imdb_score_content);
    let directors = document.createElement("p");
    let directors_content = document.createTextNode("Directors : " + data.directors);
    directors.appendChild(directors_content);
    let actors = document.createElement("p");
    let actors_content = document.createTextNode("Actors : " + data.actors);
    actors.appendChild(actors_content);
    let duration = document.createElement("p");
    let duration_content = document.createTextNode("Duration : " + data.duration + " minutes")
    duration.appendChild(duration_content);
    let countries = document.createElement("p");
    let countries_content = document.createTextNode("Countries : " + data.countries)
    countries.appendChild(countries_content);
    let worldwide_gross_income = document.createElement("p");
    let worldwide_gross_income_content = document.createTextNode("Worldwide gross income : " + data.worldwide_gross_income);
    worldwide_gross_income.appendChild(worldwide_gross_income_content);
    let long_description = document.createElement("p");
    let long_description_content = document.createTextNode("Long description : " + data.long_description);
    long_description.appendChild(long_description_content);
    modal_content.appendChild(title);
    modal_content.appendChild(close);
    modal_content.appendChild(image_url);
    modal_content.appendChild(genres);
    modal_content.appendChild(date_published);
    modal_content.appendChild(rated);
    modal_content.appendChild(imdb_score);
    modal_content.appendChild(directors);
    modal_content.appendChild(actors);
    modal_content.appendChild(duration);
    modal_content.appendChild(countries);
    modal_content.appendChild(worldwide_gross_income);
    modal_content.appendChild(long_description);
    modal.appendChild(modal_content);
    document.body.appendChild(modal);
}

function modal(id) {
    let modal = document.getElementById("Modal_" + id);
    let span = document.getElementById("close_" + id);

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}


/*************************************************************
********************Lancement du script**********************/
categories = ["Best_movie",
"Best_rating", 
"Comedy",
"Action",
"Romance"
];

categories.forEach(async category => {await getData(category)});