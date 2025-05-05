function Divider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-muted-foreground dark:bg-gray-950">
          Or continue with
        </span>
      </div>
    </div>
  );
}
export default Divider