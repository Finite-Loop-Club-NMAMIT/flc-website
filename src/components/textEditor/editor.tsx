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

  const [preview, setPreview] = useState(false);

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

  const handleToggle = () => {
    setPreview(!preview);
  };

  return (
    <>
      <div className="mt-12 ">
        <ReactQuill
          theme="snow"
          placeholder="Type here"
          value={text}
          onChange={onChange}
          modules={modules}
          className=" md:2/3 m-3 w-full sm:m-3 sm:mx-3   md:m-auto lg:m-auto lg:w-1/2"
        />
        <div className="md:2/3 flex w-full justify-between  mx-3 md:m-auto lg:m-auto  lg:w-1/2 ">
          <form className="md m-3 ml-0 rounded bg-slate-200 p-3">
            <label htmlFor="toggle">Preview content in other devices</label>
            <input
              type="checkbox"
              name="toggle"
              onClick={handleToggle}
              id="toggle"
              className="m-2 bg-slate-800"
            />
          </form>
          <button
            onClick={onConfirmEdit}
            className="m-3 mr-0 content-center rounded-md bg-slate-200 p-3"
          >
            Confirm Edit
          </button>
        </div>
      </div>

      {preview && (
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

          <div>
            <p className="ms-6">
              w*h = {displayWidth} * {displayHeight}
            </p>
          </div>
        </div>
      )}

      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css"
        />
      </Helmet>

      {preview && (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          id="display"
          className="ql-editor m-auto mb-16 h-screen w-4/5 resize overflow-auto rounded-sm border border-4"
          onMouseDown={setSizeOfDisplay}
        ></div>
      )}
    </>
  );
}
