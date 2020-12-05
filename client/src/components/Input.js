const Input = ({
  audioFile,
  handleUpload,
  handleSelecting,
  handleAudioFile,
  handleText,
  rawString,
}) => (
  <>
    <span className="title" id="inputTitle">
      Input Part
    </span>
    <div className="container" id="inputContainer">
      {/* Auido Part */}
      <div className="flexDiv">
        <span className="grey">제공할 오디오/텍스트의 언어 선택</span>
        <span className="grey">
          {audioFile
            ? "WAV 형식의 오디오 파일이 업로드됐습니다"
            : "WAV 형식의 오디오 파일을 업로드해주세요"}
        </span>
      </div>
      <form
        id="audioForm"
        action="/upload"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleUpload}
      >
        <select name="select" onChange={handleSelecting}>
          <option value="korean">한국어</option>
          <option value="english">영어</option>
          <option value="japanese">일본어</option>
          <option value="chinese">중국어</option>
          <option value="spanish">스페인어</option>
          <option value="french">프랑스어</option>
          <option value="german">독일어</option>
          <option value="russian">러시아어</option>
          <option value="vietnam">베트남어</option>
        </select>
        <div>
          <input
            id="inputFile"
            type="file"
            accept="audio/wav"
            name="audio"
            onChange={handleAudioFile}
          />
          <input type="submit" value="Extract" />
        </div>
      </form>
      {/* Text Part */}
      <textarea
        placeholder="You can type or extract sectences from a WAV file"
        type="text"
        id="writingArea"
        name="text"
        onChange={handleText}
        value={rawString}
        required
      ></textarea>
    </div>
  </>
);

export default Input;
