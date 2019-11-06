import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png'
import User from './user';
import Hotel from './hotel';
import 'jquery-ui/ui/widgets/tabs';
import 'jquery-ui/ui/widgets/datepicker';

let userData;
let roomData;
let bookingData;
let user;
let hotel;
const currentDate = getDate()
const formatData = (data) => {
  const result = data.reduce((formattedData, dataset) => {
    const key = Object.keys(dataset)[0];
    formattedData[key] = dataset[key];
    return formattedData;
  }, {});
  return result;
};

Promise.all([
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users').then(response => response.json()),
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms').then(response => response.json()),
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings').then(response => response.json()),
]).then(data => {
  let allData = formatData(data)
  userData = allData.users
  roomData = allData.rooms
  bookingData = allData.bookings
  hotel = new Hotel(userData, roomData, bookingData);
});

//  ********** Event Listeners *************
$('.login_username').keyup(function() {
  $('.login_button').attr('disabled', false);
  $('.login_button').addClass('button_active');
})

$('.login_button').on('click', function() {
  if(($('.login_username').val().toLowerCase() === 'manager') && ($('.login_password').val() === 'overlook2019')) {
    doThis();
  } else if (($('.login_username').val() === '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '10' || '11' || '12' || '13' || '14' || '15' || '16' || '17' || '18' || '19' || '20') &&  ($('.login_password').val() === 'overlook2019')) {
    orThis();
  } else {
    $('.form_p').text('Invalid Username or Password')
    $('.form_p').addClass('error')
  }
});

$('.datepicker_button').on('click', function() {
  displayRoomsAvailable();
})

$('.datepicker_button2').on('click', function() {
  displayRoomsAvailable2();
})

$('.room_header').on('click', function() {
  let prop = $(this).attr('data-sort');
  let today = $('.datepicker').val() || $('.datepicker2').val();
  let newTable = user.roomsAvailableToday(today);
  let sortTable = sortByType(newTable, prop);
  displayRoomsAvailable(sortTable)
  displayRoomsAvailable2(sortTable)
});

$('.user_searchbar').on('keydown', customerSearch);

$('.roompicker_button').on('click', function() {
  bookRoom();
  $('.confirm').text('Your Room has been booked');
  displayBookings()

});

$('.roompicker_button2').on('click', function () {
  bookRoom2();
  $('.confirm2').text('Your Room has been booked');
  displayBookings()

})

$('.search_list').on('click', '.search_customer', function() {
  let currentName = this.innerText;
  hotel.currentUser = hotel.findCustomerName(currentName);
  user = new User(hotel.currentUser, hotel.bookings, hotel.rooms);
  $('.search_list').empty();
  appendSearchCustomer();
});

$('.booking_delete').on('click', function() {
  let deleteThis = findDeleteBooking()
  deleteData(deleteThis)
  $('.delete_text').text('Booking Deleted')
})

// *********** Functions ************
$( function() {
  $( "#tabs" ).tabs();
} );

$( function() {
  $( "#tabs2" ).tabs();
} );

function getDate() {
  var m = new Date();
  var dateString =
    m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2)
    return dateString
}

function doThis() {
  $('.login_form').toggle('hidden');
  $('header').toggle('hidden');
  $('.manager_dashboard').toggle('hidden');
  $('.header_p_span').text('Manager');
  $('.total_rooms').text(hotel.totalRoomsAvailableToday(currentDate));
  $('.total_rev').text(hotel.totalRevenueToday(currentDate));
  $('.total_perc').text(hotel.percentRoomsOccupied(currentDate));
}

function orThis() {
  $('.login_form').toggle('hidden');
  $('header').toggle('hidden');
  $('.customer_dashboard').toggle('hidden');
  let id = parseInt($('.login_username').val());
  hotel.findUser(id);
  user = new User(hotel.currentUser, hotel.bookings, hotel.rooms);
  $('.header_p_span').text(user.name.split(' ')[0]);
  $('.customer_total').text(user.totalSpent());
  displayBookings()
}

function displayBookings() {
  $('.booking_body').empty();
  let allBookings = user.allUserBookings()  
  allBookings.forEach(currentBooking => {
      $('.booking_body').append(`
      <tr class="room-number" data-room="${currentBooking.roomNumber}">
      <td>${currentBooking.roomNumber}</td>
      <td>${currentBooking.date}</td>
      </tr>
      `)
    })
  }

function sortByType(table, prop) {
  let rooms = table
  if(prop === 'roomType') {
    return rooms.sort((a, b) => {
      if(a[prop] < b[prop]) { 
        return -1; 
      }
      if(a[prop] > b[prop]) { 
        return 1 
      }
    })
  }
  return rooms.sort((a, b) => a[prop] - b[prop]);
}

function displayRoomsAvailable(table) {
  $('.room_body').empty();
  if(table) {
    table.forEach(room => {
      $('.room_body').append(`
      <tr class="table_room-number" data-room="${room.number}">
        <td>${room.number}</td>
        <td>${room.roomType}</td>
        <td>${room.bidet}</td>
        <td>${room.bedSize}</td>
        <td>${room.numBeds}</td>
        <td>$${room.costPerNight}</td>
      </tr>
      `)
    })
  } else {
  let today = $('.datepicker').val()
  let todaysRooms = user.roomsAvailableToday(today)
  todaysRooms.forEach(room => {
    $('.room_body').append(`
    <tr class="table_room-number" data-room="${room.number}">
      <td>${room.number}</td>
      <td>${room.roomType}</td>
      <td>${room.bidet}</td>
      <td>${room.bedSize}</td>
      <td>${room.numBeds}</td>
      <td>$${room.costPerNight}</td>
    </tr>
    `)
  })
  }
}

function bookRoom() {
  let roomID = parseInt($('.room_number').val());
  let dataToPost = {
    "id": date.now(),
    "userID": user.id,
    "date": $('.datepicker').val(),
    "roomNumber": roomID,
  }
  postData('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', dataToPost);
}

function bookRoom2() {
  let roomID = parseInt($('.room_number2').val());
  let dataToPost = {
    "id": date.now(),
    "userID": user.id,
    "date": $('.datepicker2').val(),
    "roomNumber": roomID,
  }
  postData('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', dataToPost);
}

function postData(destination, data) {
  fetch(destination, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function customerSearch() {
  let searchText = $('.user_searchbar').val().toLowerCase();
  let matches = hotel.users.filter(user => {
    return user.name.toLowerCase().includes(searchText);
  })
  if(searchText.length === 0) {
    matches = [];
    $('.search_list').empty();
  }
  displaySearchResults(matches);
}

function displaySearchResults(matches) {
  $('.search_list').empty();
  if(matches.length > 0 && matches.length < 100) {
    let searchHtml = matches.slice(0, 10).map(match => `
    <article  class="search_customer">
    <h4>${match.name}</h4>
    </article>
    `).join('');
    $('.search_list').append(searchHtml);
  }
}

function appendSearchCustomer() {
  $('.customer_info').toggle('hidden');
  $('.customer_name').text(user.name);
  $('.customer_total').text(user.totalSpent());
  displayBookings();
}

function displayRoomsAvailable2(table) {
  $('.room_body2').empty();
  if(table) {
    table.forEach(room => {
      $('.room_body2').append(`
      <tr class="table_room-number" data-room="${room.number}">
        <td>${room.number}</td>
        <td>${room.roomType}</td>
        <td>${room.bidet}</td>
        <td>${room.bedSize}</td>
        <td>${room.numBeds}</td>
        <td>$${room.costPerNight}</td>
      </tr>
      `)
    })
  } else {
  let today = $('.datepicker2').val()
  let todaysRooms = user.roomsAvailableToday(today)
  todaysRooms.forEach(room => {
    $('.room_body2').append(`
    <tr class="table_room-number" data-room="${room.number}">
      <td>${room.number}</td>
      <td>${room.roomType}</td>
      <td>${room.bidet}</td>
      <td>${room.bedSize}</td>
      <td>${room.numBeds}</td>
      <td>$${room.costPerNight}</td>
    </tr>
    `)
  })
  }
}

function findDeleteBooking() {
  let userBookings = user.allUserBookings();
  let date = $('.delete_input').val();
  let dataToDelete = undefined
  userBookings.forEach(booking => {
    if(booking.date === date) {
      dataToDelete = { id: booking.id }
    }
  })
  return dataToDelete
}

function deleteData(data) {
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
}