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
        createSkeleton(category);
        ids.forEach(async id => { 
        await data_movie(id, category)});
        ids = [];
        }
    }) 
}
/*************************************************************
**********Récupération des informations pour un film*********/
function data_movie(id, category) {
    url = "http://localhost:8000/api/v1/titles/" + id;
    fetch(url).then(async function(response) {
        let data = await response.json();
        let data_dict = {"image_url": data.image_url, "title": data.title, "genres": data.genres, "date_published": data.date_published, "rated": data.rated, "imdb_score": data.imdb_score, "directors": data.directors, "actors": data.actors, "duration": data.duration, "countries": data.countries, "worldwide_gross_income": data.worldwide_gross_income, "long_description": data.long_description};
        if (category !== "Best_movie") {
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
        else {
            let section = document.getElementById("Best_movie_section");
            let movie_img = document.createElement("img");
            movie_img.setAttribute("id", "movie_img_" + id);
            movie_img.setAttribute("class", "best_img");
            movie_img.setAttribute("src", data.image_url);
            section.appendChild(movie_img);
        }
        
    });
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
        prev.setAttribute("onclick", plusSlides(-1, category));
        let prev_button = String.fromCharCode(10094);
        let prev_contents = document.createTextNode(prev_button)
        prev.appendChild(prev_contents);
        let next = document.createElement("a");
        next.setAttribute("class", "next");
        next.setAttribute("onclick", plusSlides(1, category));
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
let slideIndex = 1;
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
    let count = slideIndex;
    let slide_1 = count;
    let slide_2 = count + 1;
    let slide_3 = count + 2;
    let slide_4 = count + 3;
    let img_1 = document.getElementById("img_1");
    let img_2 = document.getElementById("img_2");
    let img_3 = document.getElementById("img_3");
    let img_4 = document.getElementById("img_4");

    //if (slideIndex < 1) {slideIndex = 7}
    //if (slideIndex > 7) {slideIndex = 1}
    if (slideIndex > 4) {
        if (slideIndex === 5) {slide_4 = count - 4}
        else if (slideIndex === 6) {
            slide_4 = count - 4;
            slide_3 = count - 5;
        }
        else if (slideIndex === 7) {
            slide_4 = count - 4;
            slide_3 = count - 5;
            slide_2 = count - 6;
        }
        else {
            slideIndex = 1;
            count = slideIndex;
            n = count;
            slide_1 = count;
            slide_2 = count + 1;
            slide_3 = count + 2;
            slide_4 = count + 3;
        }
    }
    else if (slideIndex < 1) {
        if (slideIndex === 0) {slide_1 = count + 7}
        else if (slideIndex === -1) {
            slide_1 = count + 7
            slide_2 = count + 8
        }
        else if (slideIndex === -2) {
            slide_1 = count + 7
            slide_2 = count + 8
            slide_3 = count + 9
        }
        else if (slideIndex === -3) {
            slide_1 = count + 7
            slide_2 = count + 8
            slide_3 = count + 9
            slide_4 = count + 10
        }
        else if (slideIndex === -4) {
            slide_1 = count + 7
            slide_2 = count + 8
            slide_3 = count + 9
            slide_4 = count + 10
        }
        else if (slideIndex === -5) {
            slide_1 = count + 7
            slide_2 = count + 8
            slide_3 = count + 9
            slide_4 = count + 10
        }
        else {
            slideIndex = 1;
            count = slideIndex;
            n = count;
            slide_1 = count;
            slide_2 = count + 1;
            slide_3 = count + 2;
            slide_4 = count + 3;
        }
    }
    img_1.setAttribute("src", "img" + slide_1 + ".jpg");
    img_2.setAttribute("src", "img" + slide_2 + ".jpg");
    img_3.setAttribute("src", "img" + slide_3 + ".jpg");
    img_4.setAttribute("src", "img" + slide_4 + ".jpg");
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
