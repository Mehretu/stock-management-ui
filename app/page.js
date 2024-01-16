import Link from "next/link";

export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen flex-col'>
      <h2 className='text-3xl'>
          Inventory App
      </h2>
      <Link href="inventory-dashboard/home/overview">View Dashboard</Link>
    </div>
  )
}
