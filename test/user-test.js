import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/hotel.js';
import data from '../data/test-data.js';
import User from '../src/user.js';

describe('User', function() {
  it('Should be able to find total money spent on rooms', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings);
    hotel.findUser(4);
    let user = new User(hotel.currentUser, hotel.bookings, hotel.rooms);
    expect(user.totalSpent()).to.equal('$246.65')
  });

  it('Should be able to find all Users bookings', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings);
    hotel.findUser(4);
    let user = new User(hotel.currentUser, hotel.bookings, hotel.rooms);
    expect(user.allUserBookings()).to.eql([ { userID: 4, date: '2019/10/19', roomNumber: 5 } ])
  });
});