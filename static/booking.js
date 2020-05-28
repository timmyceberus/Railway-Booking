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
})
