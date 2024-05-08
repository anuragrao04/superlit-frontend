import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Root() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Link to="/test/0">
        <Button variant="outline">Go to Test 0</Button>
      </Link>
    </div>
  );
}
