let stations, counties;

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

function getData() {
    return new Promise(((resolve, reject) => {
        $.get({
            url: 'allstations',
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

$('form').on('submit', function (event) {
    event.preventDefault();

    let beginStationName, destStationName;
    $(this).serializeArray().forEach(element => { // Get values from 'form'
        if (element['name'] === 'begin_station')
            beginStationName = element['value'];
        if (element['name'] === 'dest_station')
            destStationName = element['value'];
    });


    $.ajax({ // Asyn request
        url: `station`,
        data: {
            'begin_station': beginStationName,
            'dest_station': destStationName
        },
        dataType: 'json',
        success: function (data) { // When request success
            const station = data[0]; // Data
        },
        error: function (data) { // An error occurred

        }
    });
});


$(document).on('click', '.county-btn', function () {
    //let bottom in it's siblings only bright one
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
})


$(document).on('click', '.begin-block .county-btn', function () {
    $(".begin-block .station").empty();

    let station_filter_b = [];

    for (let i = 0; i < stations.length; i++) {
        if ($(this).text().indexOf(stations[i]['cty']) !== -1) {
            station_filter_b.push(stations[i]['sname']);
        }
    }

    const beginBlock_station = $('.begin-block .station');

    station_filter_b.forEach(station => {
        $(`<button class="btn btn-outline-primary btn-sm station-btn" type="button">${station}</button>`).appendTo(beginBlock_station);
    });
})

$(document).on('click', '.station-btn', function () {
    if ($(this).hasClass('btn-outline-primary')) {
        const beginBlock_text = $('.begin-block .begin-text');
        beginBlock_text.empty()
        const contain = $(this).text()

        $(`<div >${contain}</div>`).appendTo(beginBlock_text);

    } else if ($(this).hasClass('btn-outline-danger')) {
        const destBlock_text = $('.dest-block .dest-text');
        destBlock_text.empty()
        const contain = $(this).text()

        $(`<div >${contain}</div>`).appendTo(destBlock_text);
    }
})

$(document).on('click', '.dest-block .county-btn', function () {
    $(".dest-block .station").empty();

    let station_filter_d = [];

    for (let i = 0; i < stations.length; i++) {
        if ($(this).text().indexOf(stations[i]['cty']) !== -1) {
            station_filter_d.push(stations[i]['sname']);
        }
    }

    const destBlock_station = $('.dest-block .station');

    station_filter_d.forEach(station => {
        $(`<button class="btn btn-outline-danger btn-sm station-btn" type="button">${station}</button>`).appendTo(destBlock_station);
    });

})

$(document).on('click', '.dropdown-menu', function (event) {
    // When user not clicked on the station buttons, don't hide the dropdown menu
    if (!$(event.target).hasClass('station-btn')) {
        event.stopPropagation();
    }
});
