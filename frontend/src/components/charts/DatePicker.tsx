import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ onChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        onChange(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        onChange(startDate, date);
    };

    return (
        <div className="date-range-picker">
            <div className="date-picker">
                <label>Start Date: </label>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
            <div className="date-picker">
                <label>End Date: </label>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                />
            </div>
    </div>
  );
};

export default DateRangePicker;
