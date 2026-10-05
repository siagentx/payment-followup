function ErrorMessage({
  message = "Something went wrong"
}) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      <p className="font-medium">
        {message}
      </p>
    </div>
  );
}

export default ErrorMessage;