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

/**
 *
 * @param SSN_type - Type which is ssn or passport number.
 * @param value - The ssn value.
 * @returns {boolean} - Valid SSN or not.
 */
function isSsnValid(SSN_type, value){
    if (value.length === 0) {
        return false;
    } else if ($('input[name="ssn-type"]:checked').val() === 'ssn') {
        return value.search(/^[A-Z][\d]{9}$/) !== -1;
    } else if ($('input[name="ssn-type"]:checked').val() === 'passport') {
        return value.search(/^[A-Z0-9]{9}$/) !== -1;
    } else {
        return true;
    }
}

$(document).on('blur keyup click', 'input[name="ssn-type"], input[name="ssn-value"]', function () {
    const ssnValue = $('input[name="ssn-value"]');
    const value = ssnValue.val();
    const ssnType = $('input[name="ssn-type"]:checked').val();

    ssnValue.removeClass('is-valid is-invalid');
    if(isSsnValid(ssnType, value)){
        ssnValue.addClass('is-valid');
    } else {
        ssnValue.addClass('is-invalid');
    }
});

$(document).on('blur keyup', 'input[name="name"], input[name="ticket-count"], input[name="date"]', function () {

    $(this).removeClass('is-valid is-invalid');

    if ($(this)[0].checkValidity()) {
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

    // If fields is not validate, do not reload page
    if (isSsnValid(ssnType, ssnValue) &&
        name.length !== 0 &&
        $('input[name=date]')[0].checkValidity() &&
        $('input[name=ticket-count]')[0].checkValidity()) {
        window.location.assign(`http://127.0.0.1:8000/TicketInsert/${bsId[0]}/${dsId[0]}/${ssnType}` +
            `/${ssnValue}/${name}/${scheduleKind}/${date}/${trainId}/${ticketCount}`);
    }
});


