const Result = ({ handleDisAsble, handleTag, morpArr, handlePopUp, type }) => (
  <>
    <span className="title" id="resultTitle">
      Result Part
    </span>
    <div className="container" id="resultContainer">
      <form
        id="disForm"
        action="/disassemble"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleDisAsble}
      >
        <select name="select" onChange={handleTag}>
          <option value="문어">문어</option>
          <option value="구어">구어</option>
        </select>
        <input type="submit" value="Disassemble" />
      </form>
      <div>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Part</th>
              <th>Type</th>
              <th>Reliability</th>
            </tr>
          </thead>
          {morpArr.length !== 0 ? (
            <tbody>
              {morpArr.map((id, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <button onClick={handlePopUp} value={morpArr[index].lemma}>
                      {morpArr[index].lemma}
                    </button>
                  </td>
                  <td>{type[morpArr[index].type]}</td>
                  <td>{morpArr[index].weight.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody></tbody>
          )}
        </table>
      </div>
    </div>
  </>
);

export default Result;
