
// // CommonJS
const form = document.getElementById('form');
const title = document.getElementById('title');
let check_title = '';
let check_use_region = null;
const button = document.querySelector('button');

function checkData(data) {
    "Need to check repeated links"

    let duplicateRemover = new Set();

    let distinctArrObj = data.filter((obj) => {
        if (duplicateRemover.has(JSON.stringify(obj))) return false;
        duplicateRemover.add(JSON.stringify(obj));
        return true;
    });
    return distinctArrObj;
}
function append_card(data) {
    items = checkData(data);
    for (i = 0; i < items.length; i++) {
        if (items[i].platform == "Netflix") {
            $('#cards').append('<div class="card netflix">\
                            <a href=' + items[i].web_url + ' target="_blank">\
                            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
                            </a>\
                            </div>');

        }
        else if (items[i].platform == "Amazon Prime" || items[i].platform == "Amazon") {
            $('#cards').append('<div class="card amazon">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            </div>');

        }
        else if (items[i].platform == "Disney+") {
            $('#cards').append('<div class="card disney">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            </div>');

        }
        else if (items[i].platform == "HBO MAX") {
            $('#cards').append('<div class="card hbo">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
            </div>');

        }
        else {
            //generic
            $('#cards').append('<div class="card generic">\
            <a href=' + items[i].web_url + 'target="_blank">\
            <img src='+ '"' + items[i].poster + '"' + ' title=' + items[i].platform + '>\
            </a>\
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

}

//enabling country selector
let use_region = document.querySelector('input[name="use_region"]');
if (use_region) {
    let region_options = document.getElementsByName('use_region');
    region_options[0].onclick = function () {
        //yes option
        document.querySelector('#advance-search').style.display = 'none';

    }
    region_options[1].onclick = function () {
        document.querySelector('#advance-search').style.display = 'block';
    }
}
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
        let region = '';
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
            fetch('/', {
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
                        append_card(res);

                    }
                });
        }

    });
}

