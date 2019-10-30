class Bookings {
  constructor(data) {
    this.data = data
    this.id = data.id;
    this.userID = data.userID;
    this.date = data.date;
    this.roomNumber = data.roomNumber;
    this.roomService = data.roomServiceCharges;
  }
}