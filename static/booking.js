$(function () {
    const today = moment().format('YYYY-MM-DD');
    const oneMonthLater = moment().add(1, 'months').format('YYYY-MM-DD');
    $('input[type=date]').attr({
        'value': today,
        'min': today,
        'max': oneMonthLater
    });
});

$(document).on('input', '#ticket-count', function () {
    if ($(this).val() !== '1') {
        $('#car-number').attr('disabled', true).val('');
        $('#seat-number').attr('disabled', true).val('');
    } else {
        $('#car-number').removeAttr('disabled');
        $('#seat-number').removeAttr('disabled');
    }
});

$(document).on('change', 'input[name="ssn-type"]', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');
    if (value.length === 0) {
        $(this).addClass('is-invalid');
    } else if ($('input[name="ssn-type"]:checked').val() === 'ssn') {
        if (value.search(/^[A-Z][\d]{9}$/) !== -1) {
            $(this).addClass('is-valid');
        } else {
            $(this).addClass('is-invalid');
        }
    } else if ($('input[name="ssn-type"]:checked').val() === 'passport') {
        if (value.search(/^[A-Z0-9]{9}$/) !== -1) {
            $(this).addClass('is-valid');
        } else {
            $(this).addClass('is-invalid');
        }
    } else {
        $(this).addClass('is-valid');
    }
})

$(document).on('blur', 'input[name="ssn-value"]', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');
    if (value.length === 0) {
        $(this).addClass('is-invalid');
    } else if ($('input[name="ssn-type"]:checked').val() === 'ssn') {
        if (value.search(/^[A-Z][\d]{9}$/) !== -1) {
            $(this).addClass('is-valid');
        } else {
            $(this).addClass('is-invalid');
        }
    } else if ($('input[name="ssn-type"]:checked').val() === 'passport') {
        if (value.search(/^[A-Z0-9]{9}$/) !== -1) {
            $(this).addClass('is-valid');
        } else {
            $(this).addClass('is-invalid');
        }
    } else {
        $(this).addClass('is-valid');
    }
});

$(document).on('blur', 'input[name="name"]', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');

    if (value.length === 0) {
        $(this).addClass('is-invalid');
    } else {
        $(this).addClass('is-valid');
    }
});

$(document).on('blur', 'input[name="ticket-count"]', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');

    if (1 <= value && value <= 6) {
        $(this).addClass('is-valid');
    } else {
        $(this).addClass('is-invalid');
    }
});

function validateSuccessful() {
    return false;
}

$('form').on('submit', function (event) {
    event.preventDefault();

    let beginStationName, destStationName, ssnType, ssnValue;
    let name, scheduleKind, date, trainId, ticketCount;

    beginStationName = $('.begin-text').val()
    destStationName = $('.dest-text').val()

    $(this).serializeArray().forEach(element =>{
        if (element['name'] === 'ssn-type')
            ssnType = element['value'];
        if (element['name'] === 'ssn-value')
            ssnValue = element['value'];
        if (element['name'] === 'name')
            name = element['value'];
        if (element['name'] === 'schedule-kind')
            scheduleKind = element['value'];
        if (element['name'] === 'date')
            date = element['value'];
        if (element['name'] === 'ticket-count')
            ticketCount = element['value'];
        if (element['name'] === 'train-id')
            trainId = element['value'];
    });

    $.ajax({
        url: '../../../TicketInsert',
        data:{
            'begin_station': beginStationName,
            'dest_station': destStationName,
            'ssn_type': ssnType,
            'ssn_value': ssnValue,
            'name': name,
            'schedule_kind': scheduleKind,
            'date': date,
            'train_id': trainId,
            'ticket_count': ticketCount
        },
        dataType: 'json',
        success: function (data) { // When request success
        },
        error: function (data) { // An error occurred
        }
    })

});
