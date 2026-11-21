import React from 'react';
import './Skeleton.css';

export const FoodCardSkeleton = () => {
  return (
    <div className="skeleton-food-card card">
      <div className="skeleton-box skeleton-food-img" />
      <div className="skeleton-food-body">
        <div className="skeleton-box skeleton-line-title" />
        <div className="skeleton-box skeleton-line-desc" />
        <div className="skeleton-box skeleton-line-desc-short" />
        <div className="skeleton-food-footer">
          <div className="skeleton-box skeleton-price-box" />
          <div className="skeleton-box skeleton-btn-box" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx}>
          <div className="skeleton-box skeleton-table-cell" />
        </td>
      ))}
    </tr>
  );
};
