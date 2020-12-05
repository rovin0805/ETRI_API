const Translation = ({
  languageCode,
  handleTrans,
  handleText,
  transString,
}) => {
  if (languageCode !== "korean") {
    return (
      <>
        <span className="title" id="transTitle">
          Translation Part
        </span>
        <div className="container" id="transContainer">
          <form
            id="transForm"
            action="/translate"
            method="post"
            encType="multipart/form-data"
            onSubmit={handleTrans}
          >
            <input type="submit" value="Translate into Korean" />
          </form>
          <textarea
            placeholder="Please translate a foreign language into Korean first before disassembling"
            type="text"
            id="transArea"
            name="text"
            onChange={handleText}
            value={transString}
            readOnly
          ></textarea>
        </div>
      </>
    );
  } else {
    return "";
  }
};

export default Translation;
