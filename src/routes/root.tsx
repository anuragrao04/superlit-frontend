import { Link } from "react-router-dom";
export default function Root() {
  return (
    <div className="">
      <Link to="/test/0">
        <div className="text-2xl text-center font-mono p-10 text-white">
          Hello Superlit!
        </div>
      </Link>
    </div>
  );
}
