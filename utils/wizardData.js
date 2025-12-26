export const budgetRanges = Array.from({ length: 11 }, (_, i) => {
  const min = i * 50;
  const max = i === 10 ? 550 : min + 50;
  return {
    id: `budget-${i + 1}`,
    value: `${min}-${max}`,
    label: `$${min} - $${max}`,
    description: "Renovation range",
  };
});

export const designStyles = [
  {
    id: "modern",
    value: "Modern",
    label: "Modern",
    description: "Clean lines, minimalist design, and contemporary elements",
    icon: "🏢",
    color: "bg-blue-500",
  },
  {
    id: "traditional",
    value: "Traditional",
    label: "Traditional",
    description: "Classic designs with warm colors and timeless appeal",
    icon: "🏛️",
    color: "bg-amber-500",
  },
  {
    id: "rustic",
    value: "Rustic",
    label: "Rustic",
    description: "Natural materials, earthy tones, and cozy atmosphere",
    icon: "🏔️",
    color: "bg-green-500",
  },
];

export const roomTypes = [
  // Indoor rooms
  {
    id: "kitchen",
    value: "kitchen",
    label: "Kitchen",
    icon: "🍳",
    color: "bg-red-500",
    type: "indoor",
  },
  {
    id: "bathroom",
    value: "bathroom",
    label: "Bathroom",
    icon: "🛁",
    color: "bg-blue-500",
    type: "indoor",
  },
  {
    id: "bedroom",
    value: "bedroom",
    label: "Bedroom",
    icon: "🛏️",
    color: "bg-purple-500",
    type: "indoor",
  },
  {
    id: "living-room",
    value: "living-room",
    label: "Living Room",
    icon: "🛋️",
    color: "bg-orange-500",
    type: "indoor",
  },
  {
    id: "dining-room",
    value: "dining-room",
    label: "Dining Room",
    icon: "🍽️",
    color: "bg-pink-500",
    type: "indoor",
  },

  // Outdoor rooms
  {
    id: "patio",
    value: "patio",
    label: "Patio",
    icon: "🌿",
    color: "bg-green-500",
    type: "outdoor",
  },
  {
    id: "garden",
    value: "garden",
    label: "Garden",
    icon: "🌻",
    color: "bg-yellow-500",
    type: "outdoor",
  },
];

//  steps with new indoor/outdoor step as first step
export const steps = [
  { id: 1, title: "Space Type", description: "Indoor or outdoor" },
  { id: 2, title: "Budget", description: "Select budget range" },
  { id: 3, title: "Style", description: "Choose preferred style" },
  { id: 4, title: "Room Type", description: "Select room to renovate" },
  { id: 5, title: "Location", description: "Enter your location" },
  { id: 6, title: "Confirmation", description: "Review and confirm" },
];
