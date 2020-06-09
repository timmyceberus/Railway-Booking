$('#ticket-no').on('blur change', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');

    if (value.search(/^[A-Z0-9]{15}/) !== -1) {
        $(this).addClass('is-valid');
    } else {
        $(this).addClass('is-invalid');
    }
})

$(document).on('click','.delete', function () {
    $('.delete-ticket').empty()
    $('.delete-ticket').append(
        $('<input id="ssn" type="radio" name="ssn-type" value="ssn" checked>'),
        $('<label for="ssn" style="margin-right: 10px">身份證字號</label>'),
        $('<input id="passport" type="radio" name="ssn-type" value="passport">'),
        $('<label for="passport">護照號碼</label>'),
        $('<input type="text" class="form-control ssn" name="ssn-value" required>'),
        $('<div class="invalid-tooltip">請輸入正確的值.</div>')
    )
    $('.delete-ticket-submit').append(
        $('<input class="btn btn-danger delete-submit" style="margin-top: 32px" type="button" value="submit">')
    )
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

$(document).on('click','.delete-submit', function (event) {
    event.preventDefault();
    let tid = $('#ticket-no').val()
    let ssn = $('.ssn').val()
    window.location.assign(`http://127.0.0.1:8000/TicketDelete/${tid}/${ssn}`);


})

/**
 * @param {Object} data - Ticket information
 */
function showTicketInfo(data){

    $('.ticket-info').show();

    $('.date').text(data['date']);
    $('.train-id').text(data['train_id']);
    $('.ticket-type').text(data['ticket_type']);
    $('.train-kind').text(data['train_kind']);
    $('.get-on-station').text(data['get_on_station']);
    $('.get-on-time').text(data['get_on_time']);
    $('.car-number').text(data['car_number']);
    $('.seat-number').text(data['seat_number']);
    $('.get-off-station').text(data['get_off_station']);
    $('.get-off-time').text(data['get_off_time']);
    $('.price').text(data['price']);
    $('.ticket-id').text(data['ticket_id']);
}

$('form').on('submit', function (event) {
    event.preventDefault();

    $.ajax({
            url: '/GetTicket/',
            data: {
                tid: $('#ticket-no').val()
            },
            success: function (data) {
                showTicketInfo(data);
            }
        }
    )
})