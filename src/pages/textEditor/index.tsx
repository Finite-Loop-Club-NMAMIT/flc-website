import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import React, {  useState } from "react";
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

const devices = [
  ["Galaxy S9", 360, 740],
  ["iPhone SE", 375, 667],
  ["iPhone 12 Pro", 390, 844],
  ["Pixel 2", 411, 731],
  ["Galaxy Note 10", 412, 869],
  ["Pixel 3 XL", 412, 847],
  ["iPhone 11", 414, 896],
  ["Surface Duo", 540, 720],
  ["iPad Air", 820, 1180],
  ["iPad Pro 11", 834, 1194],
  ["Surface Pro 7", 912, 1368],
  ["MacBook Pro 13", 1280, 800],
  ["MacBook Air", 1440, 900],
  ["MacBook Pro 16", 1536, 960],
  ["Desktop 1080p", 1920, 1080],
  ["Desktop 4K", 3840, 2160],
];


export default function App() {
  const [text, setText] = React.useState("");
  const addEventDiscription= api.event.updateEvent.useMutation();
  const [displayWidth,setDisplayWidth]= useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);

  
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


  const handleChange = (event: { target: { value: string | number | undefined; }; }) => {
    console.log(`Selected device: ${event.target.value}`);
    
    devices.forEach(device=>{
      if(device[0]==event?.target?.value){
        setDisplayWidth(device[1] as number)
        setDisplayHeight(device[2] as number);
        document.getElementById("display").style.height=`${device[2]}px`
        document.getElementById("display").style.width = `${device[1]}px`;
      }
    })
  }
 
  const displaySize=()=>{
    
 const {width,height} = document.getElementById("display")?.getBoundingClientRect() as {width:number,height:number}
 console.log(width,height)
 setDisplayHeight(height);
 setDisplayWidth(width );
  }
    const throttle = (callback: { (): void; apply?: unknown; }, limit:number) => {
      let waiting = false; 
      return function () {
        if (!waiting) {
          callback.apply(this, arguments);
          waiting = true;
          setTimeout(() => {
            waiting = false;
          }, limit );
        }
      };
    };

const throttledDisplaySize = throttle(displaySize, 1000);




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
          className="m-2 content-center rounded-md bg-slate-200 p-3"
        >
          confirm edit
        </button>
      </div>
      <div className="m-auto flex justify-center bg-slate-200 w-fit p-4 rounded-md mb-6">
        <div>
          <select name="device" id="device" onChange={handleChange}>
            {devices.map((device, index) => (
              <option value={device[0]} key={index}>
                {device[0]}
              </option>
            ))}
          </select>
        </div>
        <p className="ms-6 ">
          {" "}
          w*h = {displayWidth} * {displayHeight}
        </p>
      </div>
      {text && (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          id="display"
          className=" m-auto mb-16 h-screen w-4/5 resize overflow-auto rounded-sm border border-4"
          onMouseDown={throttledDisplaySize}
        ></div>
      )}
    </>
  );
}
