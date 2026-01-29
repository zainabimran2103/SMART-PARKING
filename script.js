document.addEventListener("DOMContentLoaded", () => {

  const State = {
    OCCUPIED: "OCCUPIED",
    RELEASED: "RELEASED"
  };

  class ParkingSlot {
    constructor(id, zone) {
      this.id = id;
      this.zone = zone;
      this.free = true;
    }
    occupy() { if (!this.free) throw "Slot busy"; this.free = false; }
    release() { this.free = true; }
  }

  class Zone {
    constructor(id) {
      this.id = id;
      this.slots = [];
      this.adj = [];
    }
    addSlot(s) { this.slots.push(s); }
    addAdj(z) { this.adj.push(z); }
    getFreeSlot() { return this.slots.find(s => s.free); }
  }

  class ParkingRequest {
    constructor(vehicle, zone) {
      this.id = Date.now() + Math.random();
      this.vehicle = vehicle;
      this.zone = zone;
      this.slot = null;
      this.state = State.OCCUPIED;
      this.penalty = 0;
    }
  }

  class Rollback {
    constructor() { this.stack = []; }
    save(fn) { this.stack.push(fn); }
    rollback() {
      if (!this.stack.length) return false;
      this.stack.pop()();
      return true;
    }
  }

  class ParkingSystem {
    constructor() {
      this.zones = [];
      this.requests = [];
      this.rollback = new Rollback();
    }

    addZone(z) { this.zones.push(z); }

    addParking(vehicle, zoneId) {
      const req = new ParkingRequest(vehicle, zoneId);
      let z = this.zones.find(x => x.id === zoneId);
      let slot = z.getFreeSlot();

      if (!slot) {
        for (let a of z.adj) {
          const az = this.zones.find(x => x.id === a);
          slot = az.getFreeSlot();
          if (slot) { req.penalty = 10; break; }
        }
      }

      if (!slot) throw "No slot available";

      slot.occupy();
      req.slot = slot;
      this.requests.push(req);

      this.rollback.save(() => {
        slot.release();
        this.requests = this.requests.filter(r => r.id !== req.id);
      });
    }

    updateParking(id, vehicle, zone) {
      const r = this.requests.find(x => x.id == id);
      if (!r || r.state === State.RELEASED) return;
      r.vehicle = vehicle;
      r.zone = zone;
    }

    releaseParking(id) {
      const r = this.requests.find(x => x.id == id);
      if (!r || r.state === State.RELEASED) return;
      r.slot.release();
      r.state = State.RELEASED;
    }

    deleteParking(id) {
      const r = this.requests.find(x => x.id == id);
      if (!r) return;
      if (r.state === State.OCCUPIED) r.slot.release();
      this.requests = this.requests.filter(x => x.id !== id);
    }
  }

  /* ===== SETUP ===== */
  const system = new ParkingSystem();

  const A = new Zone("A");
  A.addSlot(new ParkingSlot("A1", "A"));
  A.addAdj("B");

  const B = new Zone("B");
  B.addSlot(new ParkingSlot("B1", "B"));

  system.addZone(A);
  system.addZone(B);

  const select = document.getElementById("parkingSelect");
  const output = document.getElementById("output");
//dgffgfghfghfg
  function render() {
    select.innerHTML = "";
    system.requests.forEach(r => {
      const o = document.createElement("option");
      o.value = r.id;
      o.textContent =
        `${r.vehicle} | ${r.state} | Slot ${r.slot?.id || "-"}`;
      select.appendChild(o);
    });
    output.textContent = JSON.stringify(system.requests, null, 2);
  }

  document.getElementById("addBtn").onclick = () => {
    system.addParking(
      document.getElementById("vehicleId").value,
      document.getElementById("zoneId").value
    );
    render();
  };

  document.getElementById("updateBtn").onclick = () => {
    system.updateParking(
      select.value,
      document.getElementById("vehicleId").value,
      document.getElementById("zoneId").value
    );
    render();
  };

  document.getElementById("releaseBtn").onclick = () => {
    system.releaseParking(select.value);
    render();
  };

  document.getElementById("deleteBtn").onclick = () => {
    system.deleteParking(select.value);
    render();
  };

  document.getElementById("rollbackBtn").onclick = () => {
    system.rollback.rollback();
    render();
  };

});
