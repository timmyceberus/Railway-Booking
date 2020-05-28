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
 * @param {String} duration - Duration of taking train
 * @returns {Number} - Price of taking train
 */
function priceCalculate(duration) {
    const minutes = moment.duration(duration).asMinutes();
    return minutes * 2;
}

/**
 * @return {String} - Booking icon
 */
function ticketIcon() {
    return '<svg class="bi bi-app-indicator" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <path fill-rule="evenodd" d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"/>\n' +
        '  <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>\n' +
        '</svg>';
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
        const price = priceCalculate(duration);
        const kind = trainNames[train['kind']];
        const line = lineNames[train['line_no']];

        $('<tr>').append(
            $('<td>').append($(`<a class="route-info" data-tid="${train['tid']}" data-tkind="${kind}" data-toggle="modal"
                data-target="#myModal">`).text(`${kind} ${trainId}`)),
            $('<td>').text(beginTime),
            $('<td>').text(destTime),
            $('<td>').text(duration),
            $('<td>').text(line),
            $('<td>').text(`$${price}`),
            $('<td>').append($(`<a data-tid="${train['tid']}" href="">`).addClass('book-ticket').html(ticketIcon()))
        ).appendTo(tbody);
    });

    table.fadeIn(300);
}

/**
 * @param {Object[]}trainRoute
 * @param {String}tid
 * @param {String}tname
 */
function createRouteModal(trainRoute, tid, tname) {
    const modelTable = $('.modal-body .route-table');
    const banner = $('.modal-title');
    modelTable.empty()
    banner.empty()
    banner.text(`${tname}  ${tid}`)
    $('.route-table').append(
        $('<tr>').append(
            $('<th>').text('車站'),
            $('<th>').text('到站時間'),
            $('<th>').text('離站時間')
        )
    )

    trainRoute.forEach(trainR => {
        if ($('.begin-text').val().search(trainR['sname']) >= 0) {

            $('<tr class="bg-primary" style="color: white; opacity: 0.8">').append(
                $('<td>').text(`${trainR['sname']}`),
                $('<td>').text(`${trainR['arrtime']}`),
                $('<td>').text(`${trainR['deptime']}`)
            ).appendTo(modelTable)

        } else if ($('.dest-text').val().search(trainR['sname']) >= 0) {
            $('<tr class="bg-danger" style="color: white; opacity: 0.8">').append(
                $('<td>').text(`${trainR['sname']}`),
                $('<td>').text(`${trainR['arrtime']}`),
                $('<td>').text(`${trainR['deptime']}`)
            ).appendTo(modelTable)
        } else {
            $('<tr>').append(
                $('<td>').text(`${trainR['sname']}`),
                $('<td>').text(`${trainR['arrtime']}`),
                $('<td>').text(`${trainR['deptime']}`)
            ).appendTo(modelTable)
        }
    });
}

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

$(document).on('click','.book-ticket', function (event) {
    event.preventDefault();
    bsId = $('.begin-text').val().split(' ');
    dsId = $('.dest-text').val().split(' ');
    console.log(`http://127.0.0.1:8000/booking/${$(this).data('tid')}/${bsId[0]}/${dsId[0]}`)
    window.location.assign(`http://127.0.0.1:8000/booking/${$(this).data('tid')}/${bsId[0]}/${dsId[0]}`);
})

$(document).on('click', '.route-info', function () {
    const id = $(this).data('tid');
    const kind = $(this).data('tkind');
    $.ajax({ // Asyn request
        url: `TrainSchedule`,
        data: {
            'train_id': $(this).data('tid')
        },
        dataType: 'json',
        success: function (data) { // When request success
            createRouteModal(data, id, kind);
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
