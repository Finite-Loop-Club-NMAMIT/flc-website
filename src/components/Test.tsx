import React, { useState } from "react";
import { api } from "~/utils/api";

const Test = () => {
  const addQuestionMutation = api.quiz.addQuestionToQuizTemplate.useMutation({
    onSuccess: (data) => {
      console.log("Question added successfully:", data);
    },
    onError: (error) => {
      console.error("Error adding question:", error);
    },
  });

  const [questionText, setQuestionText] = useState(
    "What is the capital of France?",
  );
  const [options, setOptions] = useState([
    "Paris",
    "London",
    "Berlin",
    "Berin",
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(""); // State to hold correct option index

  const handleAddQuestion = async () => {
    try {
      // Example input data for MCQ
      const input = {
        quizTemplateId: "cly5hq96a0003j80z4poo7tsd", // Replace with actual quiz template ID
        text: questionText,
        answerType: "MCQ",
        options: options,
        correctOptionIndex:
          correctOptionIndex !== "" ? parseInt(correctOptionIndex) : undefined, // Index of the correct MCQ option
      };

      // Call the mutation function with the input data
      await addQuestionMutation.mutateAsync(input);
    } catch (error) {
      console.error("Error in handleAddQuestion:", error);
    }
  };

  return (
    <div>
      <div className="text-black">
        <div>
          {/* Render input fields or select options for MCQ */}
          <label>Question Text:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div>
          {/* Render MCQ options */}
          <label>MCQ Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {/* Select correct option */}
          <label>Correct Option:</label>
          <select
            value={correctOptionIndex}
            onChange={(e) => setCorrectOptionIndex(e.target.value)}
          >
            <option value="">Select Correct Option</option>
            {options.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-black p-2 text-white" onClick={handleAddQuestion}>
          Add Question
        </button>
      </div>
    </div>
  );
};

export default Test;
// import React, { useState } from "react";
// import { api } from "~/utils/api"; // Adjust the import path based on your project structure

// const Test = () => {
//   const updateQuestionMutation =
//     api.quiz.updateQuestionInQuizTemplate.useMutation({
//       onSuccess: (data) => {
//         console.log("Question updated successfully:", data);
//         // Handle success behavior here, such as updating UI state or showing a success message
//       },
//       onError: (error) => {
//         console.error("Error updating question:", error);
//         // Handle error cases, such as displaying an error message or logging the error
//       },
//     });

//   const [questionId, ] = useState("cly5ja561000fj80zvl8532sd"); // Replace with actual question ID
//   const [questionText, setQuestionText] = useState(
//     "What is the capital of France?",
//   );
//   const [options, setOptions] = useState(["Paris", "London", "Berlin"]); // Initial options for MCQ
//   const [correctOptionIndex, setCorrectOptionIndex] = useState(""); // State to hold correct option index

//   const handleUpdateQuestion = async () => {
//     try {
//       // Example input data for updating MCQ
//       const input = {
//         questionId: questionId,
//         text: questionText,
//         answerType: "MCQ", // Specify MCQ type
//         options: options, // Array of MCQ options
//         correctOptionIndex:
//           correctOptionIndex !== "" ? parseInt(correctOptionIndex) : undefined, // Index of the correct MCQ option
//       };

//       // Call the mutation function with the input data
//       await updateQuestionMutation.mutateAsync(input);
//     } catch (error) {
//       console.error("Error in handleUpdateQuestion:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="text-black">
//         <div>
//           {/* Render input fields or select options for MCQ */}
//           <label>Question Text:</label>
//           <input
//             type="text"
//             value={questionText}
//             onChange={(e) => setQuestionText(e.target.value)}
//           />
//         </div>
//         <div>
//           {/* Render MCQ options */}
//           <label>MCQ Options:</label>
//           {options.map((option, index) => (
//             <div key={index}>
//               <input
//                 type="text"
//                 value={option}
//                 onChange={(e) => {
//                   const newOptions = [...options];
//                   newOptions[index] = e.target.value;
//                   setOptions(newOptions);
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//         <div>
//           {/* Select correct option */}
//           <label>Correct Option:</label>
//           <select
//             value={correctOptionIndex}
//             onChange={(e) => setCorrectOptionIndex(e.target.value)}
//           >
//             <option value="">Select Correct Option</option>
//             {options.map((option, index) => (
//               <option key={index} value={index}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           className="bg-black p-2 text-white"
//           onClick={handleUpdateQuestion}
//         >
//           Update Question
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Test;

// import React from "react";
// import { api } from "~/utils/api";

// const Test = () => {
//   const temp = api.quiz.changeQuizTemplateState.useMutation({
//     onSuccess: async () => {
//       console.log("s");
//     },
//   });

//   const { data } = api.quiz.getQuestionsByQuizTemplateId.useQuery({
//     quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
//   });
//   const { data:live } = api.quiz.getAllLiveQuizTemplates.useQuery();

//   return (
//     <div>
//       {" "}
//       <button
//         className=" "
//         onClick={async () => {
//           await temp.mutateAsync({
//             quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
//             quizState: "LIVE",
//           });
//         }}
//       >
//         set{" "}
//       </button>
//       <pre> {JSON.stringify(data,null,2)}</pre>
//       <pre> {JSON.stringify(live, null, 2)}</pre>
//     </div>
//   );
// };

// export default Test;
