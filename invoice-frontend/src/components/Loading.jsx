function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto">
        </div>
        <p className="text-gray-500 mt-3">
          {message}
        </p>
       </div>
    </div>
  );
}

export default Loading;