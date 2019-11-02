import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/hotel.js';
import data from '../data/test-data.js';

describe('Hotel', function() {
  it('Should have 50 rooms', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings);
    expect(hotel.users.length).to.equal(20);
  });

it('Should be able to find a User', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings);
    hotel.findUser(1)
    expect(hotel.currentUser).to.eql(
     {
      id: 1,
      name: "Matilde Larson"
     }); 
  });

  it('Should be able to find rooms availbe for todays date', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings);
    expect(hotel.totalRoomsAvailableToday('2019/10/19')).to.equal(49);
  });

  it('Should be able to find total revenue for todays date', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings)
    expect(hotel.totalRevenueToday('2019/10/29')).to.equal('$949.5');
  });

  it('Should be able to find percentage of rooms occupied for todays date', function() {
    let hotel = new Hotel(data.users, data.rooms, data.bookings)
    expect(hotel.percentRoomsOccupied('2019/10/29')).to.equal('94%')
  })
});