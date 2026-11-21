import React from 'react';
import { CheckCircle2, Clock, ChefHat, CheckSquare, BellRing, Check } from 'lucide-react';
import './OrderTracker.css';

const STEPS = [
  { key: 'Pending', label: 'Order Received', desc: 'Queued at canteen', icon: Clock },
  { key: 'Accepted', label: 'Confirmed', desc: 'Staff accepted order', icon: CheckCircle2 },
  { key: 'Preparing', label: 'Preparing Food', desc: 'Cooking fresh in kitchen', icon: ChefHat },
  { key: 'Ready', label: 'Ready for Pickup', desc: 'Collect at Counter #1', icon: BellRing },
  { key: 'Completed', label: 'Completed', desc: 'Picked up by student', icon: CheckSquare },
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
          const isPending = idx > currentIndex;

          return (
            <div 
              key={step.key} 
              className={`tracker-step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
            >
              {/* Step indicator circle */}
              <div className="tracker-icon-circle">
                {isDone ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <StepIcon size={18} />
                )}
              </div>

              {/* Step title & description */}
              <div className="tracker-step-info">
                <span className="tracker-step-number">Step {idx + 1}</span>
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
