$('form').on('submit', function (event) {
    event.preventDefault();

    let stationName;
    $(this).serializeArray().forEach(element => { // Get values from 'form'
        if (element['name'] === 'station')
            stationName = element['value'];
    });


    $.ajax({ // Asyn request
        url: `api/station?sname=${stationName}`,
        success: function (data) { // When request success
            const station = data[0]; // Data
        },
        error: function (data) { // An error occurred

        }
    });
});

let stations, counties;

function getData() {
    return new Promise(((resolve, reject) => {
        $.ajax({
            url: '/api/station/',
            success: function (data) {
                resolve(data)
            }
        });
    }));
}

function getCounty() {
    let counties = [];
    for (let i = 0; i < stations.length; i++) {
        if (counties.indexOf(stations[i]['cty']) === -1) {
            counties.push(stations[i]['cty']);
        }
    }
    return counties;
}

async function init() {
    stations = await getData();
    counties = getCounty();

    const beginBlock = $('.begin-block .county');
    const destBlock = $('.dest-block .county');

    counties.forEach(county => {
        $(`<button class="btn btn-outline-primary btn-sm county-btn" type="button">${county}</button>`).appendTo(beginBlock);
        $(`<button class="btn btn-outline-danger btn-sm county-btn" type="button">${county}</button>`).appendTo(destBlock);
    });
}

init();

$(document).on('click', '.dest-station-select-btn', function () {
    const block = $('.dest-station-select');
    block.css({left: $(this).offset().left, top: $(this).offset().top + 38})
    block.toggle();
})

$(document).on('click', '.county-btn', function () {
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
})

$(document).on('click', '.dropdown-menu', function (e) {

    // When user clicked on county button, don't hide the dropdown menu
    if(!$(e.target).hasClass('station-btn')){
        e.stopPropagation();
    }
});
