import React from 'react';
import { CheckCircle, Clock, ChefHat, CheckSquare, BellRing } from 'lucide-react';
import './OrderTracker.css';

const STEPS = [
  { key: 'Pending', label: 'Order Received', desc: 'Sent to canteen', icon: Clock },
  { key: 'Accepted', label: 'Accepted', desc: 'Canteen confirmed', icon: CheckCircle },
  { key: 'Preparing', label: 'Preparing Food', desc: 'Chef cooking fresh', icon: ChefHat },
  { key: 'Ready', label: 'Ready for Pickup', desc: 'Collect at counter', icon: BellRing },
  { key: 'Completed', label: 'Order Completed', desc: 'Picked up by student', icon: CheckSquare },
];

const OrderTracker = ({ status }) => {
  const getStepIndex = (curStatus) => {
    switch (curStatus) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="tracker-wrapper">
      <div className="tracker-steps-line-container">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div 
              key={step.key} 
              className={`tracker-step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="tracker-icon-circle">
                <StepIcon size={18} />
              </div>
              <div className="tracker-step-info">
                <span className="tracker-step-title">{step.label}</span>
                <span className="tracker-step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
