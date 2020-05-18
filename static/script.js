let station;
$.ajax({ // Asyn request
    url: 'http://127.0.0.1:8000/api/station/',
    success: function (data) { // When request success
        station = data;
        console.log(station);
    }
});
