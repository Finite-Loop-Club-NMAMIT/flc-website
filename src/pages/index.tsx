import Feedback from "~/components/Feedback";
import { api } from "~/utils/api";

export default function Home() {

  // const a = api.event.getAllEvents.useQuery().data
  // console.log(a);

  const updateEvent = api.event.updateEvent.useMutation(
    {
      onSuccess: async() => {
        console.log("s");
        await refetchAllEvents()
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );
  
  const {data:allEvents,refetch:refetchAllEvents}= api.event.getAllEvents.useQuery()
  

  return (
    <>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
         <div>
          {allEvents?.map((event,index)=>{
            return(
              <div key={index}>
                {event.name}
              </div>
            )
          })}
         </div>
        <button onClick={ async()=>{
          await  updateEvent.mutateAsync(
            {
              eventId:"clxim942x0000if00bokqv8pl",
              name: "Test Event 2",
              imgSrc: "https://example.com/image.jpg",
              deadline: new Date("2024-12-31T23:59:59Z"),
              fromDate: new Date("2024-07-01T10:00:00Z"),
              toDate: new Date("2024-07-01T18:00:00Z"),
              description: "This is a test event.",
              venue: "Test Venue",
              type: "SOLO",
              minTeamSize: 1,
              maxTeamSize: 1,
              maxTeams: 0,
              category: "SPECIAL",
              amount: 1,
              state: "DRAFT",
              isLegacy: false,
            }
           
          );
        }}>
  create
        </button>
        <div>
          <Feedback/>
        </div>
      </main>
    </>
  );
}
