import dynamic from "next/dynamic";
// import { useState } from "react";
// import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

// const MyPage = () => {
//   const [value, setValue] = useState("");
//   const [readOnly, setReadOnly] = useState(false);
//   const [showToolbar, setShowToolbar] = useState(true);

//   const modules = {
//     toolbar: [
//       ["bold", "italic", "underline", "strike"],
//       ["link", "image", "video"],
//       ["code-block", "align", "script"],
//       ["clean"],
//     ],
//     clipboard: {
//       matchVisual: false,
//     },
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "link",
//     "image",
//     "video",
//     "code-block",
//     "align",
//     "script",
//     "size",
//     "color",
//     "background",
//     "font",
//   ];

//   const handleTextChange = (content, delta, source, editor) => {
//     setValue(editor.getHTML());
//   };

//   const handleReadOnlyChange = (e) => {
//     setReadOnly(e.target.checked);
//   };

//   const handleShowToolbarChange = (e) => {
//     setShowToolbar(e.target.checked);
//   };

//   return (
//     <div>
//       <h1>Quill Editor in React</h1>
//       <label>
//         Read Only:{" "}
//         <input
//           type="checkbox"
//           checked={readOnly}
//           onChange={handleReadOnlyChange}
//         />
//       </label>
//       <label>
//         Show Toolbar:{" "}
//         <input
//           type="checkbox"
//           checked={showToolbar}
//           onChange={handleShowToolbarChange}
//         />
//       </label>
//       <ReactQuill
//         theme="snow"
//         modules={modules}
//         formats={formats}
//         value={value}
//         onChange={handleTextChange}
//         readOnly={readOnly}
//         toolbar={showToolbar}
//       />
//     </div>
//   );
// };

// export default MyPage;



import React from "react";
import {ReactDOM} from "react"
import "react-quill/dist/quill.snow.css";
import { api } from "~/utils/api";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export default function App() {
  const [text, setText] = React.useState("");
  const addEventDiscription= api.event.updateEvent.useMutation();

  function parseHTML(html:string) {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content;
  }
  const onChange = (text :string) => {
    setText(text);
    console.log(text)
  };

  const onConfirm=()=>{
      void addEventDiscription.mutateAsync({
        eventId: "cly358cjt0000whuimrz5so25",
        description: text,
      });
    
  }
 

  return (
    <>
      <ReactQuill
        theme="snow"
        placeholder="Type here"
        value={text}
        onChange={onChange}
        modules={modules}
      />
      <div className="m-auto">
        <button
          onClick={onConfirm}
          className="m-24 content-center rounded-md bg-slate-200 p-3"
        >
          confirm edit
        </button>
      </div>

      {text && (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          id="container"
          className=" m-auto h-screen w-4/5 resize overflow-auto rounded-sm border border-4"
          // onResize={}
          
        ></div>
      )}
    </>
  );
}
