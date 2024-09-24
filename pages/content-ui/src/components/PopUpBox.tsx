import React, { useEffect, useRef, useState } from 'react';

// Define the props for the TextPopup component
interface TextPopupProps {
  position: { top: number; left: number };
  onHighlight: () => void;
  onAddNote: () => void;
}

// Define the TextPopup component
const TextSelectionPopup: React.FC<TextPopupProps> = ({ position, onHighlight, onAddNote }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showCommentBox && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCommentBox]);

  const handleSendComment = () => {
    console.log('Comment sent:', comment);
    // Here you can add logic to send the comment to the server or process it
    setComment(''); // Clear the comment input after sending
    setShowCommentBox(false);
    onAddNote();
  };

  return (
    <div
      className="text-selection-popup absolute bg-white border border-gray-300 shadow-lg p-2 rounded-lg flex space-x-2"
      style={{ top: `${position.top}px`, left: `${position.left}px`, zIndex: 1000 }}>
      {/* Triangle pointer */}
      <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

      {/* If comment box is shown, render it; otherwise, show the buttons */}
      {showCommentBox ? (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            {/* Avatar */}
            <img
              src="https://via.placeholder.com/40" // Replace with actual avatar URL
              alt="User Avatar"
              className="rounded-full w-10 h-10 mr-2"
            />
            <span className="font-semibold">Username</span>
          </div>
          <textarea
            ref={inputRef}
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your comment here..."
            className="border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 focus:outline-none"
            onClick={handleSendComment}>
            Send
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg focus:outline-none"
            onClick={onHighlight}>
            Highlight
          </button>
          <button
            className="text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg focus:outline-none"
            onClick={() => {
              setShowCommentBox(true); // Show comment box on click
            }}>
            Add Note
          </button>
        </div>
      )}
    </div>
  );
};

export default TextSelectionPopup;
