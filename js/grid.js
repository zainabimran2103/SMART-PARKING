class Grid {
  constructor(requests, occupied, history, table, historyManager) {
    this.requests = requests;
    this.occupied = occupied;
    this.history = history;
    this.table = table;
    this.historyManager = historyManager;
  }

  openPopup() {
    if (!Utils.vehicleId().value) return alert("Enter Vehicle ID");
    document.getElementById("popup").classList.remove("hidden");
    this.renderGrid();
  }

  closePopup() {
    document.getElementById("popup").classList.add("hidden");
  }

  renderGrid() {
    const grid = document.getElementById("grid");
    const zone = Utils.zoneSel().value;
    grid.innerHTML = "";

    for (let i = 1; i <= 25; i++) {
      const slot = zone + i;
      const cell = document.createElement("div");
      cell.textContent = i;

      if (this.occupied[slot]) {
        cell.className = "cell taken";
      } else {
        cell.className = "cell free";
        cell.onclick = () => this.allocate(slot);
      }
      grid.appendChild(cell);
    }
  }

  allocate(slot) {
    const req = {
      vehicle: Utils.vehicleId().value,
      zone: Utils.zoneSel().value,
      slot,
      status: "OCCUPIED",
      start: Date.now()
    };

    this.occupied[slot] = true;
    this.requests.push(req);
    this.historyManager.addHistory({ type: "ALLOCATE", req });

    this.closePopup();
    this.table.renderTable();
  }
}
