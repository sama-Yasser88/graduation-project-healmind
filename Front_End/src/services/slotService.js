import api from "./api";

/**
 * Set a new slot (or multiple slots) for the doctor
 * Backend endpoint: POST /api/doctor/slots
 * @param {Object|Array} slotOrSlots - Object with { day, time } or { day, start, end } or Array of slots
 * @returns {Promise} Axios response
 */
export const setSlot = async (slotData) => {
  // Normalize payload to { slots: [ { day, time } ] }
  let slotsArray = [];

  if (Array.isArray(slotData)) {
    slotsArray = slotData;
  } else if (slotData.slots && Array.isArray(slotData.slots)) {
    slotsArray = slotData.slots;
  } else {
    const timeString =
      slotData.time || `${slotData.start} - ${slotData.end}`;
    slotsArray = [
      {
        day: slotData.day ? new Date(slotData.day).toISOString() : new Date().toISOString(),
        time: timeString,
      },
    ];
  }

  return await api.post("/doctor/slots", { slots: slotsArray });
};

/**
 * Edit an existing slot by ID
 * Backend endpoint: PATCH /api/doctor/slots/:id
 * @param {string|number} slotId - The slot ID
 * @param {Object} updateData - { time, day, start, end }
 * @returns {Promise} Axios response
 */
export const editSlot = async (slotId, updateData) => {
  const payload = {};

  if (updateData.time) {
    payload.time = updateData.time;
  } else if (updateData.start && updateData.end) {
    payload.time = `${updateData.start} - ${updateData.end}`;
  }

  if (updateData.day) {
    payload.day = new Date(updateData.day).toISOString();
  }

  return await api.patch(`/doctor/slots/${slotId}`, payload);
};

/**
 * Get all doctor slots
 * Backend endpoint: GET /api/doctor/slots
 */
export const getSlots = async () => {
  return await api.get("/doctor/slots");
};

/**
 * Delete / cancel a specific slot
 * Backend endpoint: DELETE /api/doctor/slots/:id
 */
export const deleteSlot = async (slotId) => {
  return await api.delete(`/doctor/slots/${slotId}`);
};
