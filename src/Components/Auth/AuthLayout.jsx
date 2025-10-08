function AuthLayout({ children, image, reverse }) {
  return (
    <div className="flex min-h-screen">
      {!reverse && (
        <div className="hidden md:flex w-1/2 bg-gray-50">
          <img
            src={image}
            alt="auth illustration"
            className="auth-image"
          />
        </div>
      )}

      <div className="w-full md:w-3/5 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-2xl animate-fadeIn">{children}</div>
      </div>

      {reverse && (
        <div className="hidden md:flex w-1/2 bg-gray-50">
          <img
            src={image}
            alt="auth illustration"
            className="auth-image"
          />
        </div>
      )}
    </div>
  );
}

export default AuthLayout;
