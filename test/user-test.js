import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/hotel.js';
import data from '../data/test-data.js';
import User from '../src/user.js';

describe('User', function() {
  let hotel;
  let user;
  beforeEach(function() {
    hotel = new Hotel(data.users, data.rooms, data.bookings);
    hotel.findUser(4);
    user = new User(hotel.currentUser, hotel.bookings, hotel.rooms);
  });

  it('Should be able to find total money spent on rooms', function() {
    expect(user.totalSpent()).to.equal('$246.65')
  });

  it('Should be able to find all Users bookings', function() {
    expect(user.allUserBookings()).to.eql([ { userID: 4, date: '2019/10/19', roomNumber: 5 } ])
  });

  it('Should be able to find rooms available for today', function() {
    expect(user.roomsAvailableToday('2019/10/19')).to.eql([
      {
        number: 5,
        roomType: 'junior suite',
        bidet: false,
        bedSize: 'king',
        numBeds: 2,
        costPerNight: 246.65
      }
    ])
  });
});