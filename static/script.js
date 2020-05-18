$('form').on('submit', function (event) {
    event.preventDefault();

    let stationName;
    $(this).serializeArray().forEach(element => { // Get values from 'form'
        if (element['name'] === 'station')
            stationName = element['value'];
    });


    $.ajax({ // Asyn request
        url: `http://127.0.0.1:8000/api/station/?sname=${stationName}`,
        success: function (data) { // When request success
            const station = data[0];
            if (station !== undefined)
                $('p').text(`車站代碼：${station['sid']}, 車站名稱：${station['sname']}`);
            else
                $('p').text('Station not found');
        },
        error: function (data) { // An error occurred
            $('p').text("Fatal Error");
        }
    });
});
