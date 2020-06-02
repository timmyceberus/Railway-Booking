$(function () {
    const today = moment().format('YYYY-MM-DD');
    const oneMonthLater = moment().add(1, 'months').format('YYYY-MM-DD');
    $('input[type=date]').attr({
        'value': today,
        'min': today,
        'max': oneMonthLater
    });
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

    // event.preventDefault();

    if (!validateSuccessful()) {
        return false;
    }

    $.ajax({
        url: '',
        data: {
            'begin_station': '',
            'dest_station': '',
            'ssn_type': '',
            'ssn_value': '',
            'name': '',
            'schedule_kind': '',
            'date': '',
            'train_id': '',
            'ticket_count': '',
        }
    })
});
