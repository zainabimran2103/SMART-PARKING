class Table {
  constructor(requests, occupied, historyManager) {
    this.requests = requests;
    this.occupied = occupied;
    this.historyManager = historyManager;
  }

  renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    this.requests.forEach((r, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${r.vehicle}</td>
          <td>${r.zone}</td>
          <td>${r.slot}</td>
          <td>${r.status}</td>
          <td>
            <button onclick="table.release(${i})">Release</button>
            <button onclick="table.updateReq(${i})">Update</button>
            <button onclick="table.deleteReq(${i})">Delete</button>
          </td>
        </tr>`;
    });
  }

  release(i) {
    this.requests[i].status = "RELEASED";
    delete this.occupied[this.requests[i].slot];
    this.renderTable();
  }

  deleteReq(i) {
    delete this.occupied[this.requests[i].slot];
    this.requests.splice(i, 1);
    this.renderTable();
  }

  updateReq(i) {
    const req = this.requests[i];

    const newVehicle = prompt("Enter new Vehicle ID:", req.vehicle);
    if (!newVehicle) return;

    const newZone = prompt("Enter new Zone (A/B):", req.zone);
    if (!newZone || (newZone !== "A" && newZone !== "B")) return alert("Invalid zone");

    const newSlotNum = prompt("Enter new Slot number (1-25):", req.slot.replace(req.zone, ""));
    if (!newSlotNum || isNaN(newSlotNum) || newSlotNum < 1 || newSlotNum > 25) return alert("Invalid slot");

    const newSlot = newZone + newSlotNum;

    if (this.occupied[newSlot] && newSlot !== req.slot) {
      return alert("Slot already occupied. Choose another.");
    }

    delete this.occupied[req.slot];

    req.vehicle = newVehicle;
    req.zone = newZone;
    req.slot = newSlot;
    req.status = "OCCUPIED";
    this.occupied[newSlot] = true;

    this.renderTable();
  }
}
