$('#ticket-no').on('blur keyup', function () {
    const value = $(this).val();

    $(this).removeClass('is-valid is-invalid');

    if (value.search(/^[0-9]{15}/) !== -1) {
        $(this).addClass('is-valid');
    } else {
        $('.invalid-feedback').text('請輸入正確格式的車票代號');
        $(this).addClass('is-invalid');
    }
})

$(document).on('click', '.delete', function () {
    $('.delete-ticket').empty()
    $('.delete-ticket-submit').empty()
    $('.delete-ticket').append(
        $('<input id="ssn" type="radio" name="ssn-type" value="ssn" checked>'),
        $('<label for="ssn" style="margin-right: 10px">身份證字號</label>'),
        $('<input id="passport" type="radio" name="ssn-type" value="passport">'),
        $('<label for="passport">護照號碼</label>'),
        $('<input type="text" class="form-control ssn" name="ssn-value" placeholder="輸入訂票人的身份證/護照號碼" required>'),
        $('<div class="invalid-tooltip">請輸入正確的值.</div>')
    )
    $('.delete-ticket-submit').append(
        $('<input class="btn btn-danger delete-submit" style="margin-top: 32px" type="submit" value="提交">')
    )
})

$(document).on('blur keyup click', 'input[name="ssn-type"], input[name="ssn-value"]', function () {
    const ssnValue = $('input[name="ssn-value"]');
    const value = ssnValue.val();
    const ssnType = $('input[name="ssn-type"]:checked').val();

    ssnValue.removeClass('is-valid is-invalid');
    if (isSsnValid(ssnType, value)) {
        ssnValue.addClass('is-valid');
    } else {
        ssnValue.addClass('is-invalid');
    }
});

$('form.find-ssn').on('submit', function (event) {
    event.preventDefault();

    const ticketNumber = $('#ticket-no').val();

    let ssnType, ssnValue;
    $(this).serializeArray().forEach(element => { // Get values from 'form'
        if (element['name'] === 'ssn-type')
            ssnType = element['value'];
        if (element['name'] === 'ssn-value')
            ssnValue = element['value'];
    });

    if(isSsnValid(ssnType, ssnValue)) {
        window.location.assign(`http://127.0.0.1:8000/TicketDelete/${ticketNumber}/${ssnValue}`);
    }
});

/**
 *
 * @param SSN_type - Type which is ssn or passport number.
 * @param value - The ssn value.
 * @returns {boolean} - Valid SSN or not.
 */
function isSsnValid(SSN_type, value) {
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

/**
 * @param {Object} data - Ticket information
 */
function showTicketInfo(data) {

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

function showDeleteButton() {
    $('.delete-button')
        .empty()
        .append(
            $('<input class="btn btn-danger delete" style="margin-top: 32px" type="button" value="取消車票">')
        )
}

function hideDeleteButton() {
    $('.delete-button').empty()
    $('.delete-ticket').empty()
    $('.delete-ticket-submit').empty()
}

$('form.find-ticket').on('submit', function (event) {
    event.preventDefault();

    $.ajax({
            url: '/GetTicket/',
            data: {
                tid: $('#ticket-no').val()
            },
            success: function (data) {
                showTicketInfo(data);
                if(data['status']==='success'){
                    showTicketInfo(data);

                    // If the train has not departure, you can delete the ticket
                    console.log(moment(data['date'] + " " + data['get_on_time']));
                    console.log(moment())
                    console.log(moment(data['date'] + " " + data['get_on_time']).isAfter(moment()))
                    if(moment(data['date'] + " " + data['get_on_time']).isAfter(moment())){
                        showDeleteButton();
                    } else {
                        hideDeleteButton();
                    }
                }
                else {
                    hideDeleteButton();
                    $('#ticket-no')
                        .removeClass('is-valid')
                        .addClass('is-invalid');
                    $('.invalid-feedback').text('找不到車票');
                    $('.ticket-info').hide();
                }
            }
        }
    )
})