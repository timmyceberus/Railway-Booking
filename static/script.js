let stations, counties;

async function init() {
    stations = await getData();
    counties = getCounty();


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

/**
 * @return {Promise} - Data of all stations.
 * */
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

/**
 * @return {Object[]} - All counties where stations exist.
 * */
function getCounty() {
    let counties = [];
    for (let i = 0; i < stations.length; i++) {
        if (counties.indexOf(stations[i]['cty']) === -1) {
            counties.push(stations[i]['cty']);
        }
    }
    return counties;
}

/**
 * @param  {Array} stationCty -
 * @return {Array} -Get all station name which same city.
 * */
function getCtyStations(stationCty) {
    let ctyStations = [];

    for (let i = 0; i < stations.length; i++) {
        if (stations[i]['cty'].indexOf(stationCty) !== -1) {
            ctyStations.push(stations[i]['sname']);
        }
    }
    return ctyStations;
}

$(document).on('mouseover', '.submit', function () {

    const beginBlock_text = $('.begin-block .begin-text');
    const destBlock_text = $('.dest-block .dest-text');
    if (!destBlock_text.val() || !beginBlock_text.val()) {
        $(this).attr("data-toggle", "tooltip");
        $(this).attr("title", "輸入不完整");
    } else {
        $(this).removeAttr("data-toggle");
        $(this).removeAttr("title");
    }
});

/**
 * @param {String} beginTime - String type of begin time in 'hh:mm' format
 * @param {String} destTime - String type of destination time in 'hh:mm' format
 * @returns {String} - String type of difference between begin time and destination time in 'hh:mm' format
 */
function timeDiff(beginTime, destTime) {
    const beginMoment = moment(beginTime, 'HH:mm');
    const destMoment = moment(destTime, 'HH:mm');
    let diff = destMoment.diff(beginMoment, 'minutes');

    // Cross Day
    if (diff < 0)
        diff += 1440;

    return moment.duration(diff, 'minutes').format('HH:mm', {trim: false}); // Time with leading 0 when trim set to false
}

/**
 * @param {Object[]} trains - List of train data get from Django.
 * */
async function createStationTable(trains) {
    const table = $('.station-table');
    const tbody = table.find('tbody');

    $('form').css('top', '0vh'); // A slide effect of form from middle to top

    if (!table.is(':visible')) // When table is not visible, wait for the form move to the top for 700ms.
        await sleep(700);

    tbody.empty();
    const trainNames = ['自強', '莒光', '復興'];
    const lineNames = ['-', '山線', '海線', '成追'];
    trains.forEach(train => {
        const trainId = train['tid'];
        const beginTime = moment(train['begin_time'], 'HH:mm:ss').format('HH:mm'); // Turn HH:mm:ss to HH:mm
        const destTime = moment(train['dest_time'], 'HH:mm:ss').format('HH:mm'); // Turn HH:mm:ss to HH:mm
        const duration = timeDiff(beginTime, destTime);
        const kind = trainNames[train['kind']];
        const line = lineNames[train['line_no']];

        $('<tr>').append(
            $('<td>').append($(`<a class="route-info" data-tid="${train['tid']}" data-toggle="modal" data-target="#myModal">`).text(`${kind} ${trainId}`)),
            $('<td>').text(beginTime),
            $('<td>').text(destTime),
            $('<td>').text(duration),
            $('<td>').text(line),
            $('<td>'),
            $('<td>')
        ).appendTo(tbody);
    });

    table.fadeIn(300);
}

async function createRouteModal(trainRoute) {
    console.log(trainRoute)
    const modelTable = $('.modal-body .route-table');
    modelTable.empty()
    const banner = $('.modal-title');
    banner.empty()


    trainRoute.forEach(trainR => {
        $('.route-table').append(
            $('<tr>').append(
                $('<td>').text(`${trainR['sname']}`),
                $('<td>').text(`${trainR['arrtime']}`),
                $('<td>').text(`${trainR['deptime']}`)
            )
        )
    });


}

// <td data-apple="105">105</td>
// $(this).data('apple')

/**
 * @param {Number} ms - Set sleep time.
 * */
function sleep(ms = 1000) {
    return new Promise(((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    }))
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
            createStationTable(data);
        },
        error: function (data) { // An error occurred
        }
    });

});

$(document).on('click', '.route-info', function () {

    $.ajax({ // Asyn request
        url: `TrainSchedule`,
        data: {
            'train_id': $(this).data('tid')
        },
        dataType: 'json',
        success: function (data) { // When request success
            createRouteModal(data);
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
        const beginBlockText = $('.begin-block .begin-text');
        beginBlockText.empty();

        let contain = $(this).text();
        for (let i = 0; i < stations.length; i++) {
            if (stations[i]['sname'] === contain) {
                contain = stations[i]['sid'] + ' ' + contain;
                break
            }
        }

        $(".begin-text").val(contain);

    } else if ($(this).hasClass('btn-outline-danger')) {
        const destBlockText = $('.dest-block .dest-text');
        destBlockText.empty();

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
