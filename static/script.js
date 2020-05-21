let stations, counties;

async function init() {
    stations = await getData();
    counties = getCounty();
    console.log(counties)


    const beginBlock = $('.begin-block .county');
    const destBlock = $('.dest-block .county');

    counties.forEach(county => {
        if (county === '基隆市') {
            $(`<button class="btn btn-outline-primary btn-sm county-btn active" type="button">${county}</button>`).appendTo(beginBlock);

            let stationFilterBegin = getCtyStations('基隆市');
            const beginBlockStation = $('.begin-block .station');
            stationFilterBegin.forEach(station => {
                $(`<button class="btn btn-outline-primary btn-sm station-btn" type="button">${station}</button>`).appendTo(beginBlockStation);
            });

            $(`<button class="btn btn-outline-danger btn-sm county-btn active"" type="button">${county}</button>`).appendTo(destBlock);

            let stationFilterDest = getCtyStations('基隆市');
            const destBlockStation = $('.dest-block .station');
            stationFilterDest.forEach(station => {
                $(`<button class="btn btn-outline-danger btn-sm station-btn" type="button">${station}</button>`).appendTo(destBlockStation);
            });
        } else {
            $(`<button class="btn btn-outline-primary btn-sm county-btn" type="button">${county}</button>`).appendTo(beginBlock);
            $(`<button class="btn btn-outline-danger btn-sm county-btn" type="button">${county}</button>`).appendTo(destBlock);
        }
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

function getCtyStations(stationCty) {
    let ctyStations = [];

    for (let i = 0; i < stations.length; i++) {
        if (stations[i]['cty'].indexOf(stationCty) !== -1) {
            ctyStations.push(stations[i]['sname']);
        }
    }
    return ctyStations;
}

$('form').on('submit', function (event) {
    event.preventDefault();

    let beginStationName, destStationName, time;
    $(this).serializeArray().forEach(element => { // Get values from 'form'
        if (element['name'] === 'begin_station')
            beginStationName = element['value'];
        if (element['name'] === 'dest_station')
            destStationName = element['value'];
        if (element['name'] === 'time')
            time = element['value'];
    });


    $.ajax({ // Asyn request
        url: `SearchTrain`,
        data: {
            'begin_station': beginStationName,
            'dest_station': destStationName,
            'time': time
        },
        dataType: 'json',
        success: function (data) { // When request success
            const train = data[0]; // Data
        },
        error: function (data) { // An error occurred
        }
    });
});


$(document).on('click', '.county-btn', function () {
    //let bottom in it's siblings only bright one
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
});


$(document).on('click', '.begin-block .county-btn', function () {
    $(".begin-block .station").empty();

    let stationFilterBegin = getCtyStations($(this).text());

    const beginBlockStation = $('.begin-block .station');

    stationFilterBegin.forEach(station => {
        $(`<button class="btn btn-outline-primary btn-sm station-btn" type="button">${station}</button>`).appendTo(beginBlockStation);
    });
});

$(document).on('click', '.station-btn', function () {
    if ($(this).hasClass('btn-outline-primary')) {
        const beginBlock_text = $('.begin-block .begin-text');
        beginBlock_text.empty();

        let contain = $(this).text();
        for (let i = 0; i < stations.length; i++) {
            if (stations[i]['sname'] === contain) {
                contain = stations[i]['sid'] + ' ' + contain;
                break
            }
        }

        $(".begin-text").val(contain);

    } else if ($(this).hasClass('btn-outline-danger')) {
        const destBlock_text = $('.dest-block .dest-text');
        destBlock_text.empty();

        let contain = $(this).text();
        for (let i = 0; i < stations.length; i++) {
            if (stations[i]['sname'] === contain) {
                contain = stations[i]['sid'] + ' ' + contain;
                break
            }
        }

        $(".dest-text").val(contain);
    }
});

$(document).on('click', '.dest-block .county-btn', function () {
    $(".dest-block .station").empty();

    let stationFilterDest = getCtyStations($(this).text());

    const destBlockStation = $('.dest-block .station');

    stationFilterDest.forEach(station => {
        $(`<button class="btn btn-outline-danger btn-sm station-btn" type="button">${station}</button>`).appendTo(destBlockStation);
    });

});

$(document).on('click', '.dropdown-menu', function (event) {
    // When user not clicked on the station buttons, don't hide the dropdown menu
    if (!$(event.target).hasClass('station-btn')) {
        event.stopPropagation();
    }
});
