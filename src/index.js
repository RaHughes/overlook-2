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
let rooms;
let bookings;
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
  rooms = new Rooms(roomData);
  bookings = new Bookings(bookingData);
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
  console.log(hotel.users)
}

function orThis() {
  $('.login_form').toggle('hidden');
  $('header').toggle('hidden');
  $('.customer_dashboard').toggle('hidden');
  let id = parseInt($('.login_username').val())
  hotel.findUser(id)
  user = new User(hotel.currentUser, hotel.bookings, hotel.rooms)
  console.log(user)
  $('.header_p_span').text(user.name.split(' ')[0])
  $('.customer_total').text(user.totalSpent())
}


