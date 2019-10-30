import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png'

let users;
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
  users = allData.users
  rooms = allData.rooms
  bookings = allData.bookings
  console.log(users)
  console.log(rooms)
  console.log(bookings)
  console.log(currentDate)
});



function getDate() {
  var m = new Date();
  var dateString =
    m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2)
    return dateString
}