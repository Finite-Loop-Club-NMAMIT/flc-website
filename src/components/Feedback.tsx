
import { api } from "~/utils/api";
const Feedback = () => {
  const addTemplete = api.feedbackTemplate.createFeedbackTemplate.useMutation({
    onSuccess: () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const addQuestion = api.feedbackTemplate.addQuestionToFeedbackTemplate.useMutation({
    onSuccess: () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const updateQuestion = api.feedbackTemplate.updateQuestionInFeedbackTemplate.useMutation({
    onSuccess: () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="flex flex-col gap-3 rounded-lg ">
      <button
        onClick={async () => {
          await addTemplete.mutateAsync({
            eventId: "clxim942x0000if00bokqv8pl",
          });
        }}
        className="text-md bg-white p-3 font-bold"
      >
        createTemplete
      </button>
      <button
        onClick={async () => {
          await addQuestion .mutateAsync({
            qs: "wts yur name ",
            answerType: "COMMENT",
            feedbackTemplateId: "clxj6ao3j000772gcxve7s39j",
          });
        }}
        className="text-md bg-white p-3 font-bold"
      >
        Add_Qs_TO_Templete
      </button>
      <button
        onClick={async () => {
          await  updateQuestion .mutateAsync({
            questionId:"clxj6hrl4000972gcofg6vopc",
            qs: "wts yur name man ",
            answerType: "COMMENT",
            
          });
        }}
        className="text-md bg-white p-3 font-bold"
      >
        Update_Qs_FO_Templete
      </button>
    </div>
  );
};

export default Feedback;
