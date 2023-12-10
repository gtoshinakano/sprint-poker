import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mt-auto">Oops!</h1>
      <p className="mx-auto mt-3 text-lg">
        The page you tried to access does not exist
      </p>
      <p className="mx-auto mb-auto mt-3 text-blue-600">
        <Link to="/">Click here to go to home</Link>
      </p>
    </main>
  );
}
