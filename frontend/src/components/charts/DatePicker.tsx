import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
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
            <h3>Filter by date</h3>
            <div className="date-range-duo">
                <div className="date-picker">
                    <label>Start Date: </label>
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
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
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
