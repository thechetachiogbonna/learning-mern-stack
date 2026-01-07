import useUserStore from "@/store/useUserStore";

function Home() {
  const { user } = useUserStore();
  console.log(user);

  return (
    <div className="underline text-2xl">Home</div>
  )
}

export default Home