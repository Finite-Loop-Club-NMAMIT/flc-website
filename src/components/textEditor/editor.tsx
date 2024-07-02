import dynamic from "next/dynamic";
import { Helmet } from "react-helmet";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { api } from "~/utils/api";
import { modules, devices } from "./constants";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});


export default function Editor({ eventId }: { eventId?: string }) {
  const [text, setText] = useState("");
  const addEventDescription = api.event.updateEvent.useMutation();

  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);

  const onChange = (text: string) => {
    setText(text);
    console.log(text);
  };
  
  //storing content in db
  const onConfirmEdit = async () => {
    try {
      await addEventDescription.mutateAsync({
        eventId: eventId ?? "cly358cjt0000whuimrz5so25",
        description: text,
      });
      console.log("Event description updated successfully!");
      alert(
        `Event description updated successfully! \n id :${eventId ?? "cly358cjt0000whuimrz5so25"}`,
      );
    } catch (error) {
      console.error("Error updating event description:", error);
    }
  };

  //setting size of display when its changed with mouse
  const setSizeOfDisplay = () => {
    const displayElement = document.getElementById("display");
    if (displayElement) {
      const { width, height } = displayElement.getBoundingClientRect();
      console.log(width, height);
      setDisplayWidth(width);
      setDisplayHeight(height);
    }
  };

  //setting size of display based on device selected
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDevice = event.target.value;
    console.log(`Selected device: ${selectedDevice}`);

    devices.forEach((device) => {
      if (device[0] === selectedDevice) {
        setDisplayWidth(device[1] as number);
        setDisplayHeight(device[2] as number);
        const displayElement = document.getElementById("display");
        if (displayElement) {
          displayElement.style.height = `${device[2]}px`;
          displayElement.style.width = `${device[1]}px`;
        }
      }
    });
  };

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
          onClick={onConfirmEdit}
          className="m-2 content-center rounded-md bg-slate-200 p-3"
        >
          Confirm Edit
        </button>
      </div>

      <div className="m-auto mb-6 flex h-fit w-fit justify-center rounded-md bg-slate-200 p-4">
        <div>
          <select name="device" id="device" onChange={handleChange}>
            {devices.map((device, index) => (
              <option value={device[0]} key={index}>
                {device[0]}
              </option>
            ))}
          </select>
        </div>
        <p className="ms-6">
          w*h = {displayWidth} * {displayHeight}
        </p>
      </div>

      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css"
        />
      </Helmet>

      {true && (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: text }}
            id="display"
            className="ql-editor m-auto mb-16 h-screen w-4/5 resize overflow-auto rounded-sm border border-4"
            onMouseDown={setSizeOfDisplay}
          ></div>
        </div>
      )}
    </>
  );
}
