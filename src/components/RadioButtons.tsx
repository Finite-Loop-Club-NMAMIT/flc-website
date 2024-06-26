import React from "react";

const RadioButtons = () => {
  return (
    <div className="flex gap-8">
      <div className="radio-wrapper">
        <input className="input" name="btn" id="value-3" type="radio" />
        <div className="btn">
          2017-2020<p className="hidden sm:inline-block" aria-hidden="true"></p>
        </div>
      </div>
      <div className="radio-wrapper">
        <input className="input" name="btn" id="value-3" type="radio" />
        <div className="btn">
          2020-2021<p className="hidden sm:inline-block" aria-hidden="true"></p>
        </div>
      </div>

      <div className="radio-wrapper">
        <input className="input" name="btn" id="value-3" type="radio" />
        <div className="btn">
          2021-2022<p className="hidden sm:inline-block" aria-hidden="true"></p>
        </div>
      </div>

      <div className="radio-wrapper">
        <input className="input" name="btn" id="value-3" type="radio" />
        <div className="btn">
          2022-2023<p className="hidden sm:inline-block" aria-hidden="true"></p>
        </div>
      </div>

      <div className="radio-wrapper">
        <input className="input" name="btn" id="value-3" type="radio" />
        <div className="btn">
          2023-2024<p className="hidden sm:inline-block" aria-hidden="true"></p>
        </div>
      </div>
    </div>
  );
};

export default RadioButtons;
