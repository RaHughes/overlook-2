import Rooms from "./rooms";

class Hotel {
  constructor(userData, roomData, bookingData) {
    this.users = userData
    this.rooms = roomData
    this.bookings = bookingData
    this.currentUser = undefined
  }
  
  findUser(userID) {
    this.users.filter(user => {
      if(user.id === userID) {
      this.currentUser = user;
    }
  });
  return this.currentUser
  }

  findCustomerName(name) {
    return this.users.find(user => user.name === name);
  };

  totalRoomsAvailableToday(date) {
    let takenRooms = []
    this.bookings.forEach(booking => {
      if(date === booking.date) {
        takenRooms.push(booking)
      }
     })
    return (this.rooms.length - (this.rooms.length - takenRooms.length))
  }

  totalRevenueToday(date) {
    let todaysBookings = []
    this.bookings.forEach(booking => {
      if(date === booking.date) {
        todaysBookings.push(booking.roomNumber)
      }
    })
    let cost = 0;
    todaysBookings.forEach(roomID => {
      let roomPrice = this.rooms.find(room => room.number === roomID)
        cost += roomPrice.costPerNight
    })
    return `$${cost.toPrecision(4)}`
  }

  percentRoomsOccupied(date) {
    let todaysBookings = []
    this.bookings.forEach(booking => {
      if(date === booking.date) {
        todaysBookings.push(booking)
      }
    }) 
    return `${(this.rooms.length - todaysBookings.length) / this.rooms.length * 100}%`
  }
}

export default Hotel;