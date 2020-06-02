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

$('form').on('submit', function () {
    $.ajax({
        url: '',
        data:{
            'begin_station':'',
            'dest_station': '',
            'ssn_type': '',
            'ssn_value': '',
            'name': '',
            'schedule_kind': '',
            'date': '',
            'train_id': '',
            'ticket_count': '',
            'car_number':'',
            'seat_number': ''
        }
    })
});
