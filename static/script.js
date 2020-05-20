let stations, counties;

async function init() {
    stations = await getData();
    counties = getCounty();
    console.log(stations)

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

$(document).on('click', '.county-btn', function () {
    //let bottom in it's siblings only bright one
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    $(".station").empty();

    let station_filter = [];

    for (let i = 0;i <stations.length ;i ++){
        if ($(this).text().indexOf(stations[i]['cty'])!==-1){
            station_filter.push(stations[i]['sname']);
        }
    }
    console.log(station_filter)
    const beginBlock_station = $('.begin-block .station');



    station_filter.forEach(station=>{
        $(`<button class="btn btn-outLine-primary btn-sm station-btn" type="button">${station}</button>`).appendTo(beginBlock_station);
    });

    //btn-outLine-primary btn-sm
    // console.log($(this).text())
})

$(document).on('click', '.station-btn', function () {
    $(this).siblings().removeClass('station-btn');
})

$(document).on('click', '.dropdown-menu', function (event) {
    // When user not clicked on the station buttons, don't hide the dropdown menu
    if(!$(event.target).hasClass('station-btn')){
        event.stopPropagation();
    }
});


