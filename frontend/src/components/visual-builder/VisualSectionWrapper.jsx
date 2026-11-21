import { useState } from 'react';
import { Edit3, Plus, Trash2, Sparkles } from 'lucide-react';
import './VisualSectionWrapper.css';

export default function VisualSectionWrapper({ 
  label, 
  sectionKey, 
  onEdit, 
  onAdd, 
  addLabel, 
  onDelete, 
  children,
  badgePosition = 'top-center'
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`visual-section-wrapper ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-section-key={sectionKey}
    >
      {/* Elementor / WordPress Floating Control Badge */}
      <div className={`vsw-controls ${badgePosition}`}>
        <div className="vsw-pill">
          <span className="vsw-pill-label">
            <Sparkles className="w-3 h-3 text-[#C5A46D]" />
            {label}
          </span>

          <button 
            type="button" 
            className="vsw-btn vsw-btn-edit" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title={`Edit ${label}`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Section</span>
          </button>

          {onAdd && (
            <button 
              type="button" 
              className="vsw-btn vsw-btn-add" 
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              title={addLabel || `Add to ${label}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addLabel || 'Add Item'}</span>
            </button>
          )}

          {onDelete && (
            <button 
              type="button" 
              className="vsw-btn vsw-btn-delete" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title={`Remove ${label}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* The Actual Live Section Content */}
      <div className="vsw-content">
        {children}
      </div>
    </div>
  );
}
