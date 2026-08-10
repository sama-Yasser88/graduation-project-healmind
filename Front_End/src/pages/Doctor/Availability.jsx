import { useState, useEffect } from "react";
import TimeSlotCard from "../../components/Doctor/TimeSlotCard/TimeSlotCard";
import SlotModal from "../../components/Doctor/SlotModal/SlotModal";
import { getSlots } from "../../services/slotService";
import styles from "./Availability.module.css";

const initialSlots = {
  "2023-10-17": [
    { id: 1, type: "available", start: "09:00", end: "10:30" },
    { id: 2, type: "booked", start: "11:00", end: "12:00" },
  ],
  "2023-10-19": [
    { id: 3, type: "available", start: "14:00", end: "15:00" },
  ],
};

const getWeekDates = (startDate) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
};

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Availability = () => {
  const [weekStart, setWeekStart] = useState(getMonday(new Date("2023-10-16")));
  const [slots, setSlots] = useState(initialSlots);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalDateKey, setModalDateKey] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);

  // Load real slots from backend on mount
  useEffect(() => {
    const loadDoctorSlots = async () => {
      try {
        const response = await getSlots();
        const backendSlots = response?.data?.slots;

        if (Array.isArray(backendSlots) && backendSlots.length > 0) {
          const parsed = {};
          backendSlots.forEach((s) => {
            if (!s.day) return;
            const dateKey = new Date(s.day).toISOString().split("T")[0];
            if (!parsed[dateKey]) parsed[dateKey] = [];

            let start = "09:00";
            let end = "10:00";
            if (s.time) {
              const parts = s.time.includes(" - ")
                ? s.time.split(" - ")
                : s.time.split("-");
              start = parts[0]?.trim() || "09:00";
              end = parts[1]?.trim() || "10:00";
            }

            parsed[dateKey].push({
              id: s._id,
              _id: s._id,
              type: "available",
              start,
              end,
            });
          });

          setSlots((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (err) {
        console.warn("Could not fetch slots from backend:", err.message);
      }
    };

    loadDoctorSlots();
  }, []);

  const weekDates = getWeekDates(weekStart);
  const monthLabel = weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleDeleteSlot = (dateKey, slotId) => {
    setSlots((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(
        (s) => s.id !== slotId && s._id !== slotId
      ),
    }));
  };

  const handleOpenAddModal = (dateKey) => {
    setModalMode("add");
    setModalDateKey(dateKey);
    setModalSlot(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (dateKey, slot) => {
    setModalMode("edit");
    setModalDateKey(dateKey);
    setModalSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveSlot = ({ start, end, slotId }) => {
    setSlots((prev) => {
      const daySlots = prev[modalDateKey] || [];

      if (modalMode === "edit") {
        return {
          ...prev,
          [modalDateKey]: daySlots.map((s) => {
            const isMatch =
              s.id === modalSlot?.id ||
              s._id === modalSlot?._id ||
              s.id === modalSlot?._id ||
              s._id === modalSlot?.id;
            return isMatch
              ? {
                  ...s,
                  id: slotId || s.id || s._id,
                  _id: slotId || s._id || s.id,
                  start,
                  end,
                }
              : s;
          }),
        };
      }

      const newSlot = {
        id: slotId || Date.now(),
        _id: slotId || Date.now(),
        type: "available",
        start,
        end,
      };
      return { ...prev, [modalDateKey]: [...daySlots, newSlot] };
    });
    setModalOpen(false);
  };

  const formatDateKey = (date) => date.toISOString().split("T")[0];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold mb-1">{monthLabel}</h3>
          <p className="text-muted mb-0">Manage your clinical hours and session availability.</p>
        </div>

        <div className="d-flex gap-2">
          <button className={styles.navBtn} onClick={handlePrevWeek}>
            <i className="fa-solid fa-chevron-left me-1"></i> Previous
          </button>
          <button className={styles.navBtn} onClick={handleNextWeek}>
            Next <i className="fa-solid fa-chevron-right ms-1"></i>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const daySlots = slots[dateKey] || [];

          return (
            <div className="col" key={dateKey}>
              <div className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayLabel}>{dayLabels[index]}</span>
                  <span className={styles.dayNumber}>{date.getDate()}</span>
                </div>

                {daySlots.length === 0 ? (
                  <div className={styles.emptyDay}>
                    <i className="fa-regular fa-calendar-xmark"></i>
                    <span>No slots added</span>
                  </div>
                ) : (
                  daySlots.map((slot) => (
                    <TimeSlotCard
                      key={slot._id || slot.id}
                      type={slot.type}
                      start={slot.start}
                      end={slot.end}
                      onDelete={() => handleDeleteSlot(dateKey, slot._id || slot.id)}
                      onEdit={() => handleOpenEditModal(dateKey, slot)}
                    />
                  ))
                )}

                <button className={styles.addSlotBtn} onClick={() => handleOpenAddModal(dateKey)}>
                  <i className="fa-solid fa-plus me-1"></i> Add Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <SlotModal
        show={modalOpen}
        mode={modalMode}
        initialData={modalSlot}
        dateKey={modalDateKey}
        onClose={handleCloseModal}
        onSave={handleSaveSlot}
      />
    </div>
  );
};

export default Availability;