import React from "react";
import { api } from "~/utils/api";

const Test = () => {
  const submit = api.quiz.submitQuizAnswers.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: async () => [console.log("er")],
  });
  const submitM = api.quiz.addScoreManually.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: async () => [console.log("er")],
  });

  const { data: review } = api.quiz.getTextAnswersForQuiz.useQuery({
    quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
  });
  return (
    <div>
      <div>
        <pre>Review: {JSON.stringify(review, null, 2)}</pre>
      </div>
      <button
        className=" bg-white p-2 text-black"
        onClick={async () => {
          await submit.mutateAsync({
            quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
            answers: [
              {
                questionId: "cly5ja561000fj80zvl8532sd",
                selectedOptionId: "cly5rnyz3000kj80z691kj4bj",
              },
              {
                questionId: "cly5v8xtx000nj80z0488cdty",
                selectedOptionId: "cly5v8xtz000qj80zvrd8ov05",
              },
            ],
          });
        }}
      >
        submit
      </button>{" "}
      <button
        className=" bg-white p-2 text-black"
        onClick={async () => {
          await submitM.mutateAsync({
            userId: "cly5ho8970000j80zfuix51dm",
            quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
            userQuizAnswer: [
              {
                quizQuestionId: "cly5v8xtx000nj80z0488cdty",
                score:1
              },
              
            ],
          });
        }}
      >
        submitM
      </button>
    </div>
  );
};
export default Test;
