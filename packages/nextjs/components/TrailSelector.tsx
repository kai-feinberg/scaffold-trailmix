import React, { useState } from 'react';

// Define the props if you need to receive any from the parent component
interface TrailSelectorProps {
  onTrailSelected: (trailPercentage: bigint) => void; // Callback when a trail is selected
}

const TrailSelector: React.FC<TrailSelectorProps> = ({ onTrailSelected }) => {
  // Define the trails available
  const trails: bigint[] = [10n, 15n, 20n];
  const [selectedTrail, setSelectedtrail] = useState<bigint>(0n);

  const handleTrailSelection = (trail: bigint) => {
    setSelectedtrail(trail);
    onTrailSelected(trail); // You can pass the trail value to a parent component if needed
  };

  return (
    <div className="p-2 ">
      <h2 className="text-sm mb-1 text-center">Select Trail </h2>
      <div className="flex space-x-2">
        {trails.map((trail) => (
          <button
            key={trail}
            className={`btn ${selectedTrail === trail ? 'btn-active' : ''}`}
            onClick={() => handleTrailSelection(trail)}
          >
            {trail === 0n ? 'None' : `${trail}%`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailSelector;
