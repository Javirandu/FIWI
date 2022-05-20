

// // CommonJS
// const Swal = require('.sweetAlert2/dist/sweetalert2');

function checkData(data) {
    "Need to check repeated links. Solution provided from https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects "

    let duplicateRemover = new Set();

    let distinctArrObj = data.filter((obj) => {
        if (duplicateRemover.has(JSON.stringify(obj))) return false;
        duplicateRemover.add(JSON.stringify(obj));
        return true;
    });
    return distinctArrObj;
}
function checkAlreadyAppended(items) {
    "Checks every card appended to the web to avoid repeated cars when update"
    let final_cards = items;
    let children = document.getElementsByClassName('fa-heart-circle-xmark');
    let keys = ['platform', 'web_url', 'poster'];
    let results = [];
    // let card = saveCards[i].previousElementSibling //tag  that includes data to save
    for (i = 0; i < children.length; i++) {
        let cards = {};
        let web_url = children[i].previousElementSibling.getAttribute('href').split('target=')[0];
        let poster = children[i].previousElementSibling.querySelector('img').getAttribute('src');
        let platform = children[i].previousElementSibling.querySelector('img').getAttribute('title');
        // cards.push(children[i].parentElement)
        cards[keys[0]] = platform; //revisar formato de datos
        cards[keys[1]] = web_url;
        cards[keys[2]] = poster;

        results.push(cards);
    }
    if (results.length > 0) {
        let parent = document.querySelector('.fa-heart-circle-xmark').parentElement.parentElement;
        while (parent.firstChild) {
            parent.firstChild.remove(); //https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        }
        final_cards = items.filter(e => !results.includes(e));
    }

    return final_cards;
}
function user_cards(data) {
    items = checkData(data);
    final_cards = checkAlreadyAppended(items);
    for (i = 0; i < items.length; i++) {
        if (items[i].platform == "Netflix") {
            $('#saved_cards').append('<div class="card netflix">\
                            <a href=' + items[i].web_url + ' target="_blank">\
                            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
                            </a>\
                            <i class="fa-solid fa-heart-circle-xmark x-heart"></i>\
                            </div>');


        }
        else if (items[i].platform == "Amazon Prime" || items[i].platform == "Amazon") {
            $('#saved_cards').append('<div class="card amazon">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i class="fa-solid fa-heart-circle-xmark x-heart"></i>\
            </div>');

        }
        else if (items[i].platform == "Disney+") {
            $('#saved_cards').append('<div class="card disney">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i class="fa-solid fa-heart-circle-xmark x-heart"></i>\
            </div>');

        }
        else if (items[i].platform == "HBO MAX") {
            $('#saved_cards').append('<div class="card hbo">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i class="fa-solid fa-heart-circle-xmark x-heart"></i>\
            </div>');

        }
        else {
            //generic
            $('#saved_cards').append('<div class="card generic">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i class="fa-solid fa-heart-circle-xmark x-heart"></i>\
            </div>');
        }

    }
    $('.netflix').animate({ right: '220px', opacity: 0 }, 0);
    $('.netflix').animate({ right: '0px', opacity: 1 }, 'slow');
    $('.amazon').animate({ right: '220px', opacity: 0 }, 0);
    $('.amazon').animate({ right: '0px', opacity: 1 }, 'slow');
    $('.disney').animate({ right: '220px', opacity: 0 }, 0);
    $('.disney').animate({ right: '0px', opacity: 1 }, 'slow');
    $('.hbo').animate({ right: '220px', opacity: 0 }, 0);
    $('.hbo').animate({ right: '0px', opacity: 1 }, 'slow');
    $('.generic').animate({ right: '220px', opacity: 0 }, 0);
    $('.generic').animate({ right: '0px', opacity: 1 }, 'slow');
    //After adding the cards, adds an eventListener to them
    let toDeleteCards = document.getElementsByClassName('fa-heart-circle-xmark');
    for (let i = 0; i < toDeleteCards.length; i++) {
        toDeleteCards[i].addEventListener('click', function () {
            //jquery gets the entire div to save it as an entry in database with id as primary key
            let card = toDeleteCards[i].previousElementSibling //tag  that includes data to save
            let web_url = card.getAttribute('href').split('target=')[0];

            fetch('/deleteCard', {
                method: 'POST',
                headers: {
                    // Authorization: 'key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    web_url
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    if (res.retStatus == 'deleted') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Deleted',
                            text: res.msg
                        })
                        getUser(); //call again to update everything

                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: res.msg
                        })
                    }
                })

        })
    }
}




function getUser() {
    $.ajax({
        type: "POST",
        url: '/home',
        success: function (data) {
            $('#name_placeholder').text(data.username);
            user_cards(data.cards);
            console.log(data.cards);
        }
    })
}


const form = document.getElementById('form');
const title = document.getElementById('title');
let check_title = '';
let check_use_region = null;
const button = document.querySelector('button');

function append_home_card(data) {
    items = checkData(data);
    for (i = 0; i < items.length; i++) {
        if (items[i].platform == "Netflix") {
            $('#cards').append('<div class="card netflix">\
                            <a href=' + items[i].web_url + ' target="_blank">\
                            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
                            </a>\
                            <i onclick="saveCard(this)"class="fa-solid fa-heart-circle-check"></i>\
                            </div>');
        }
        else if (items[i].platform == "Amazon Prime" || items[i].platform == "Amazon") {
            $('#cards').append('<div class="card amazon">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i onclick="saveCard(this)"class="fa-solid fa-heart-circle-check check-heart"></i>\
            </div>');
        }
        else if (items[i].platform == "Disney+") {
            $('#cards').append('<div class="card disney">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i onclick="saveCard(this)"class="fa-solid fa-heart-circle-check check-heart"></i>\
            </div>');
        }
        else if (items[i].platform == "HBO MAX") {
            $('#cards').append('<div class="card hbo">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i onclick="saveCard(this)"class="fa-solid fa-heart-circle-check check-heart"></i>\
            </div>');
        }
        else {
            //generic
            $('#cards').append('<div class="card generic">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            <i onclick="saveCard(this)"class="fa-solid fa-heart-circle-check check-heart"></i>\
            </div>');
        }


    }
    //After adding the cards, adds an eventListener to them
    let saveCards = document.getElementsByClassName('fa-heart-circle-check');
    for (let i = 0; i < saveCards.length; i++) {
        saveCards[i].addEventListener('click', function () {
            //jquery gets the entire div to save it as an entry in database with id as primary key
            let card = saveCards[i].previousElementSibling //tag  that includes data to save
            let web_url = card.getAttribute('href').split('target=')[0];
            let poster = card.querySelector('img').getAttribute('src');
            let platform = card.querySelector('img').getAttribute('title');

            fetch('/saveCard', {
                method: 'POST',
                headers: {
                    // Authorization: 'key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform,
                    web_url,
                    poster,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res.retStatus == 'saved') {
                        // alert(res.msg);
                        getUser();
                    }
                    else {
                        alert(res.msg);
                    }
                })

        })
    }
}
//enabling country selector
function checkRegion() {
    let use_region = document.querySelector('input[name="use_region"]');
    if (use_region) {
        let region_options = document.getElementsByName('use_region');
        region_options[0].onclick = function () {
            document.querySelector('#advance-search').style.display = 'none';

        }
        region_options[1].onclick = function () {
            document.querySelector('#advance-search').style.display = 'block';
        }
    }
}






$(document).ready(function () {
    checkRegion();

    let submitButton = document.querySelector('#myBtn');

    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            //checking values
            e.preventDefault();
            const title = document
                .querySelector('#title').value;
            let country = ''
            //country selector
            use_region = document.querySelector('input[name="use_region"]:checked');
            let region = use_region.value;
            if (use_region !== null) {
                check_use_region = true;
                use_region.value;
                if (use_region.value === "no") {
                    country = document.querySelector('select').value
                }
                else {
                    country = '';
                }
            }
            if (title.value !== "") {
                check_title = true;
            }
    
            if (check_title !== true || check_use_region !== true) {
                button.disabled;
                //alert errors
                if (check_title == "") {
                    alert("title is required.");
                }
                if (check_use_region === null) {
                    Swal.fire({
                        title: 'Region!',
                        text: 'Select yes or no to use a region',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#004D4D'
                    })
                }
    
            }

            else {
                fetch('/search', {
                    method: 'POST',
                    headers: {
                        // Authorization: 'key',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        region,
                        country
                    }),
                })
                .then((res) => {
                            return res.json();
                        })
                        .then((res) => {
                            console.log(res);
                            if (res.retStatus == 'not found') {
                                Swal.fire({
                                    title: 'Error!',
                                    text: res.msg,
                                    icon: 'warning',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#004D4D'
                                })
                            }else{
                                append_home_card(res);  
                            }
                        })
            }
        });
    }

    getUser();
    // checkRegion();


});

