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
  const addQuestion =
    api.feedbackTemplate.addQuestionToFeedbackTemplate.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const updateQuestion =
    api.feedbackTemplate.updateQuestionInFeedbackTemplate.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const deleteQuestion =
    api.feedbackTemplate.deleteQuestionFromFeedbackTemplate.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const publishFeedback =
    api.feedbackTemplate.publishAndDraftFeedbackTemplete.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const deleteFeedback =
    api.feedbackTemplate.deleteFeedbackTemplate.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const answerQuestion =
    api.feedbackTemplate.submitAnswerToQuestion.useMutation({
      onSuccess: () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { data: getallQuestions, refetch: refeatchAllQuestions } =
    api.feedbackTemplate.getQuestionsByFeedbackTemplateId.useQuery({
      feedbackTemplateId: "clxj6ao3j000772gcxve7s39j",
    });
  const { data: getallTemplete } =
    api.feedbackTemplate.getAllPublishedFeedbackTemplatesWithQuestions.useQuery();

  return (
    <main>
      <div className="text-lg  font-bold text-white">
        {getallQuestions?.map((q, index) => {
          return <div key={index}>{q.qs}</div>;
        })}
      </div>
      <div className="text-lg  font-bold text-white">
      <div>
      <h1>All Published Feedback Templates</h1>
      {getallTemplete?.map((template) => (
        <div key={template.id}>
          {template.id}
          <ul>
            {template.Questions.map((question) => (
              <li key={question.id}>{question.qs}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg ">
        <button
          onClick={async () => {
            await addTemplete.mutateAsync({
              eventId: "clxio9cnc000572gcu9jfc44x",
            });
          }}
          className="text-md bg-white p-3 font-bold"
        >
          createTemplete
        </button>
        <button
          onClick={async () => {
            await addQuestion.mutateAsync({
              qs: "wts yur  age ",
              answerType: "COMMENT",
              feedbackTemplateId: "clxj8cb5c000n72gc8n6rb9zt",
            });

            await refeatchAllQuestions();
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Add_Qs_TO_Templete
        </button>
        <button
          onClick={async () => {
            await updateQuestion.mutateAsync({
              questionId: "clxj6hrl4000972gcofg6vopc",
              qs: "wts yur name man ",
              answerType: "COMMENT",
            });
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Update_Qs_FO_Templete
        </button>
        <button
          onClick={async () => {
            await deleteQuestion.mutateAsync("clxj6s5b9000d72gc3hmjytoi");
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Delete_Qs_FO_Templete
        </button>
        <button
          onClick={async () => {
            await publishFeedback.mutateAsync({
              id: "clxj6ao3j000772gcxve7s39j",
              templateState: "DRAFT",
            });
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Publish_Feedback
        </button>
        <button
          onClick={async () => {
            await deleteFeedback.mutateAsync("clxj978u8000v72gc7v5s5qq3");
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Delete_Feedbacke
        </button>
        <button
          onClick={async () => {
            await answerQuestion.mutateAsync({
              ans: "sathwik",
              questionId: "clxj6iegf000b72gcag45lcc7",
              userId: "abcdeggfjiakjion",
            });
          }}
          className="text-md bg-white p-3 font-bold"
        >
          Submit_Answer
        </button>
      </div>
    </main>
  );
};

export default Feedback;
