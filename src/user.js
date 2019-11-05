import Hotel from './hotel'

class User extends Hotel {
  constructor(user, bookings, rooms) {
    super(user, bookings, rooms)
    this.id = user.id;
    this.name = user.name;
    this.bookings = bookings;
    this.rooms = rooms;
  }

  allUserBookings() {
    let myBookings = []
    this.bookings.forEach(booking => {
      if(booking.userID === this.id) {
        myBookings.push(booking)
      }
    })
    return myBookings 
  }

  totalSpent() {
    let myBookings = []
    this.bookings.forEach(booking => {
      if(booking.userID === this.id) {
        myBookings.push(booking)
      }
    }) 
    console.log(myBookings)
    let cost = 0;
    myBookings.forEach(booking => {
      let roomPrice = this.rooms.find(roomID => roomID.number === booking.roomNumber) 
        cost += roomPrice.costPerNight
    })
    return `$${cost.toPrecision(5)}`
  }

  roomsAvailableToday(date) {
    let takenRoomsID = []
    this.bookings.forEach(booking => {
      if(date === booking.date) {
        takenRoomsID.push(booking)
      }
     })
     let takenRooms = []
     takenRoomsID.forEach(roomID => {
      this.rooms.filter(room => {
        if(roomID.roomNumber === room.number) {
          takenRooms.push(room)
        }
      })
      console.log(takenRooms)
     })
     return takenRooms
    }
}

export default User;