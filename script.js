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
    let response = await fetch(url);
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
    createSkull(category);
    ids.forEach(async id => { 
    await data_movie(id, category)});
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
    createSkull(category);
    ids.forEach(async id => { 
    await data_movie(id, category)});
    ids = [];
    }
}
/*************************************************************
**********Récupération des informations pour un film*********/
async function data_movie(id, category) {
    url = "http://localhost:8000/api/v1/titles/" + id
    let response = await fetch(url);
    let data = await response.json();
    let data_dict = {"image_url": data.image_url, "title": data.title, "genres": data.genres, "date_published": data.date_published, "rated": data.rated, "imdb_score": data.imdb_score, "directors": data.directors, "actors": data.actors, "duration": data.duration, "countries": data.countries, "worldwide_gross_income": data.worldwide_gross_income, "long_description": data.long_description};
    let container = document.getElementById("slideShowContainer_" + category);
    let movie = document.createElement("div");
    movie.setAttribute("id", "mySlide_" + category + "_" + id)
    movie.setAttribute("class", "mySlides_" + category + " fade");
    let movie_img = document.createElement("img");
    movie_img.setAttribute("id", "movie_img_" + id);
    movie_img.setAttribute("class", "movie_img");
    movie_img.setAttribute("src", data.image_url);
    movie.appendChild(movie_img);
    container.appendChild(movie);    
}
/*************************************************************
********************Création du squelette********************/
function createSkull(category) {
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
    if (title_contents !== "Best movie") {
        let container = document.createElement("div");
        container.setAttribute("id", "slideShowContainer_" + category);
        container.setAttribute("class", "slideShowContainer");
        let prev = document.createElement("a");
        prev.setAttribute("class", "prev");
        prev.setAttribute("onclick", plusSlides(-1));
        let prev_button = String.fromCharCode(10094);
        let prev_contents = document.createTextNode(prev_button)
        prev.appendChild(prev_contents);
        let next = document.createElement("a");
        next.setAttribute("class", "next");
        next.setAttribute("onclick", plusSlides(1));
        let next_button = String.fromCharCode(10095);
        let next_contents = document.createTextNode(next_button)
        next.appendChild(next_contents);
        container.appendChild(prev);
        container.appendChild(next);
        section.appendChild(title_el);
        section.appendChild(container);
    }
    
}    
/*************************************************************
***************************Carousel**************************/
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}
/*************************************************************
*************************************************************/


categories = ["Best_movie",
"Best_rating", 
"Comedy",
"Action",
"Romance"
];

categories.forEach(category => getData(category));