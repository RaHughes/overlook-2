import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png'
import User from './user';
import Hotel from './hotel';
import Rooms from './rooms';
import Bookings from './bookings';

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
  console.log(currentDate)
});

//  ********** Event Listeners *************
$('.login_username').keyup(function() {
  $('.login_button').attr('disabled', false);
  $('.login_button').addClass('button_active');
})

$('.login_button').on('click', function() {
  if($('.login_username').val().toLowerCase() === 'manager' && $('.login_password').val() === 'overlook2019') {
    doThis();
  } else if ($('.login_username').val().toLowerCase() === '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '10' &&  $('.login_password').val() === 'overlook2019') {
    orThis();
  } else {
    $('.form_p').text('Invalid Username or Password')
    $('.form_p').addClass('error')
  }
});

$('.datepicker_button').on('click', function() {
  displayRoomsAvailable()
})

$('.room_header').on('click', function() {
  let prop = $(this).attr('data-sort');
  let today = $('.datepicker').val()
  let newTable = user.roomsAvailableToday(today);
  let sortTable = sortByType(newTable, prop);
  displayRoomsAvailable(sortTable)
});

$('.roompicker_button').on('click', function() {
  bookRoom();
})


// *********** Functions ************
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
    "userID": user.id,
    "date": $('.datepicker').val(),
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