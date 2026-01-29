class History {
  constructor(requests, occupied) {
    this.requests = requests;
    this.occupied = occupied;
    this.history = [];
  }

  addHistory(entry) {
    this.history.push(entry);
  }

  rollback() {
    if (!this.history.length) return alert("Nothing to rollback");

    const last = this.history.pop();
    if (last.type === "ALLOCATE") {
      delete this.occupied[last.req.slot];
      this.requests.pop();
      table.renderTable();
    }
  }
}
