class Rooms {
  constructor(data) {
    this.data = data
    this.number = data.number;
    this.roomType = data.roomType
    this.bidet = data.bidet
    this.bedSize = data.bedSize
    this.numBeds = data.numBeds
    this.cost = data.costPerNight
  }
}