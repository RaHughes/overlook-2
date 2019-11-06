import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/hotel.js';
import data from '../data/test-data.js';

describe('Hotel', function() {
  let hotel;
  beforeEach( function() {
    hotel = new Hotel(data.users, data.rooms, data.bookings);
  });
  it('Should have 50 rooms', function() {
    expect(hotel.users.length).to.equal(20);
  });

  it('Should be able to find a User', function() {
    hotel.findUser(1)
    expect(hotel.currentUser).to.eql(
     {
      id: 1,
      name: "Matilde Larson"
     }); 
  });

  it('Should be able to find rooms availbe for todays date', function() {
    expect(hotel.totalRoomsAvailableToday('2019/10/19')).to.equal(1);
  });

  it('Should be able to find total revenue for todays date', function() {
    expect(hotel.totalRevenueToday('2019/10/29')).to.equal('$949.5');
  });

  it('Should be able to find percentage of rooms occupied for todays date', function() {
    expect(hotel.percentRoomsOccupied('2019/10/29')).to.equal('6.0%')
  })
});