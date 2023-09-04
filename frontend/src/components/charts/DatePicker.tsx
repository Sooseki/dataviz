import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
    onChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        onChange(date, endDate);
    };

    const handleEndDateChange = (date: Date | null) => {
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
