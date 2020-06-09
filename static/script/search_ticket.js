$('#ticket-no').on('blur change', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');

    if (value.search(/^[A-Z0-9]{15}/) !== -1) {
        $(this).addClass('is-valid');
    } else {
        $(this).addClass('is-invalid');
    }
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