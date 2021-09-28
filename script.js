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
            section.appendChild(movie_img);
        });
    } 
    else {
        fetch(url).then(async function(response) {
            let data = await response.json();
            let img = data.image_url;
            let container = document.getElementById("slideShowContainer_" + category);
            let test = document.getElementsByClassName("Slide_" + category + " fade");
            let movie = document.createElement("div");
            movie.setAttribute("id", "Slide_" + id);
            movie.setAttribute("class", "Slide_" + category + " fade");
            if (test.length < 4) {
                movie.setAttribute("style", "display: block")
            }
            else {movie.setAttribute("style", "display: none")}
            let movie_img = document.createElement("img");
            movie_img.setAttribute("id", "movie_img_" + id);
            movie_img.setAttribute("class", "movie_img");
            movie_img.setAttribute("src", img);
            movie.appendChild(movie_img);
            container.appendChild(movie);

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
    const slides = document.getElementsByClassName("Slide_" + category + " fade" );
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

//ShowSlides("Best_rating");
//ShowSlides("Comedy");
//ShowSlides("Action");
//ShowSlides("Romance");

    
/*************************************************************
********************Lancement du script**********************/
categories = ["Best_movie",
"Best_rating", 
"Comedy",
"Action",
"Romance"
];

categories.forEach(async category => {await getData(category)});