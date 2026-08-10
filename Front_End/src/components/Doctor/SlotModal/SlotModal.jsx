import { useState, useEffect } from "react";
import TimeSelect from "../TimeSelect/TimeSelect";
import styles from "./SlotModal.module.css";
import { setSlot, editSlot } from "../../../services/slotService";

const hourOptions = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minuteOptions = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const periodOptions = ["AM", "PM"];

const clampHour = (val) => {
  const n = parseInt(val || "0", 10);
  if (isNaN(n) || n < 1) return "12";
  if (n > 12) return "12";
  return String(n).padStart(2, "0");
};

const clampMinute = (val) => {
  const n = parseInt(val || "0", 10);
  if (isNaN(n)) return "00";
  return String(Math.min(59, Math.max(0, n))).padStart(2, "0");
};

const from24Hour = (value, fallback) => {
  const [hStr, mStr] = (value || fallback).split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return { hour: String(h).padStart(2, "0"), minute: mStr, period };
};

const to24Hour = (hour12, minute, period) => {
  let h = parseInt(hour12, 10) % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
};

const SlotModal = ({ show, mode, initialData, dateKey, onClose, onSave }) => {
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");

  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("AM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setError(null);
      setLoading(false);
      const startParts = from24Hour(initialData?.start, "09:00");
      const endParts = from24Hour(initialData?.end, "10:00");

      setStartHour(startParts.hour);
      setStartMinute(startParts.minute);
      setStartPeriod(startParts.period);

      setEndHour(endParts.hour);
      setEndMinute(endParts.minute);
      setEndPeriod(endParts.period);
    }
  }, [show, initialData]);

  if (!show) return null;

  const handleSave = async () => {
    const start24 = to24Hour(startHour, startMinute, startPeriod);
    const end24 = to24Hour(endHour, endMinute, endPeriod);

    setLoading(true);
    setError(null);

    try {
      let response;
      const slotId = initialData?._id || initialData?.id;
      const isValidMongoId =
        typeof slotId === "string" && /^[0-9a-fA-F]{24}$/.test(slotId);

      if (mode === "edit" && isValidMongoId) {
        // Edit existing DB slot via Axios PATCH /api/doctor/slots/:id
        response = await editSlot(slotId, {
          start: start24,
          end: end24,
          time: `${start24} - ${end24}`,
          day: dateKey,
        });
      } else {
        // Set new slot via Axios POST /api/doctor/slots
        response = await setSlot({
          start: start24,
          end: end24,
          time: `${start24} - ${end24}`,
          day: dateKey,
        });
      }

      const returnedSlots = response?.data?.data;
      const newSlotId =
        response?.data?.data?._id ||
        (Array.isArray(returnedSlots)
          ? returnedSlots[returnedSlots.length - 1]?._id
          : null) ||
        slotId;

      if (onSave) {
        onSave({
          start: start24,
          end: end24,
          slotId: newSlotId,
          responseData: response?.data,
        });
      }

      onClose();
    } catch (err) {
      console.error("Error saving slot:", err);
      const serverMessage =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(", ")
          : null) ||
        err.message ||
        "Failed to save the slot. Please try again.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={loading ? undefined : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h5 className={styles.title}>
          {mode === "edit" ? "Edit Slot" : "Add New Slot"}
        </h5>

        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-3">
          <label className={styles.label}>Start Time</label>
          <div className="d-flex align-items-center gap-2">
            <TimeSelect
              value={startHour}
              options={hourOptions}
              onChange={setStartHour}
              clamp={clampHour}
            />
            <span className={styles.colon}>:</span>
            <TimeSelect
              value={startMinute}
              options={minuteOptions}
              onChange={setStartMinute}
              clamp={clampMinute}
            />
            <TimeSelect
              value={startPeriod}
              options={periodOptions}
              onChange={setStartPeriod}
              editable={false}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className={styles.label}>End Time</label>
          <div className="d-flex align-items-center gap-2">
            <TimeSelect
              value={endHour}
              options={hourOptions}
              onChange={setEndHour}
              clamp={clampHour}
            />
            <span className={styles.colon}>:</span>
            <TimeSelect
              value={endMinute}
              options={minuteOptions}
              onChange={setEndMinute}
              clamp={clampMinute}
            />
            <TimeSelect
              value={endPeriod}
              options={periodOptions}
              onChange={setEndPeriod}
              editable={false}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <i className="fa-solid fa-spinner fa-spin me-1"></i>}
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Slot"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;
