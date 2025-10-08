const ModalWrapper = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-gray-100 bg-opacity-90 flex items-center justify-center p-4">
    <div className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  </div>
);
