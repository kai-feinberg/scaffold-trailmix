import React, { useState } from 'react';

interface StepperInputProps {
  onGranularityChange: (newGranularity: bigint) => void; // Callback when granularity changes
}

const StepperInput: React.FC<StepperInputProps> = ({ onGranularityChange }) => {
  // State to hold the granularity value as bigint, defaulting to 5n (bigint literal)
  const [granularity, setGranularity] = useState<bigint>(5n);

  const increaseGranularity = () => {
    setGranularity((prev) => {
      const newValue = prev + 1n; // Increment by 1n (bigint)
      onGranularityChange(newValue);
      return newValue;
    });
  };

  const decreaseGranularity = () => {
    setGranularity((prev) => {
      const newValue = prev > 1n ? prev - 1n : 1n; // Decrement by 1n, prevent going below 1n
      onGranularityChange(newValue);
      return newValue;
    });
  };

  return (
    <div className="p-4 flex items-center">
    <h2 className="text-sm mb-1">Update frequency</h2>
      <button className="btn btn-sm m-1" onClick={decreaseGranularity} disabled={granularity <= 1n}>
        -
      </button>
      {/* Convert bigint to string for display */}
      <span className="text-lg mx-2">{granularity.toString()}%</span>
      <button className="btn btn-sm m-1" onClick={increaseGranularity}>
        +
      </button>
    </div>
  );
};

export default StepperInput;
