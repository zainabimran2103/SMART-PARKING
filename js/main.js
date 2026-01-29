// Global data
const requests = [];
const occupied = {};

// Initialize classes
const historyManager = new History(requests, occupied);
const table = new Table(requests, occupied, historyManager);
const grid = new Grid(requests, occupied, historyManager, table, historyManager);

// Expose functions to HTML buttons
window.openPopup = () => grid.openPopup();
window.closePopup = () => grid.closePopup();
window.rollback = () => historyManager.rollback();
window.release = (i) => table.release(i);
window.deleteReq = (i) => table.deleteReq(i);
window.updateReq = (i) => table.updateReq(i);
