import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>welcome to index page</p>

      <Link href="/login" className="font-medium text-primary hover:underline"><button className={buttonVariants()}>Get Started</button></Link>
    </div>
  );
}
