$(function () {

    // Cannot book the ticket which is departure
    getOnTime = moment(getOnTime, "HH:mm");
    const current = moment().toDate().getTime();
    const isPast = getOnTime.isBefore(current)

    const today = moment();
    const oneMonthLater = moment().add(1, 'months');

    if (isPast) {
        today.add(1, 'days');
        oneMonthLater.add(1, 'days');
    }

    $('input[type=date]').attr({
        'value': today.format('YYYY-MM-DD'),
        'min': today.format('YYYY-MM-DD'),
        'max': oneMonthLater.format('YYYY-MM-DD')
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

$(document).on('click', '.submit-ticket', function (event) {
    event.preventDefault();
    let bsId = $('.begin-text').val().split(' ');
    let dsId = $('.dest-text').val().split(' ');

    let ssnType = $('input[name=ssn-type]:checked').val();
    let ssnValue = $('input[name=ssn-value]').val();
    let name = $('input[name=name]').val();
    let scheduleKind = $('input[name=schedule-kind]').val();
    let date = $('input[name=date]').val();
    let trainId = $('input[name=train-id]').val();
    let ticketCount = $('input[name=ticket-count]').val();

    console.log(ssnType)


    window.location.assign(`http://127.0.0.1:8000/TicketInsert/${bsId[0]}/${dsId[0]}/${ssnType}` +
        `/${ssnValue}/${name}/${scheduleKind}/${date}/${trainId}/${ticketCount}`);
});


