import Axios from "axios";
import { Component } from "react";
import Input from "./Input";
import Translation from "./Translation";
import Result from "./Result";
import Swal from "sweetalert2";
import "../css/styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: "",
      languageCode: "korean", // default lang
      rawString: "",
      transString: "",
      morpArr: [],
      type: {
        NNG: "일반명사",
        NNP: "고유명사",
        NNB: "의존명사",
        NP: "대명사",
        NR: "수사",
        VV: "동사",
        VA: "형용사",
        VX: "보조용언",
        VCP: "긍정지정사",
        VCN: "부정지정사",
        MMA: "성상 관형사",
        MMD: "지시 관형사",
        MMN: "수 관형사",
        MAG: "일반부사",
        MAJ: "접속부사",
        IC: "감탄사",
        JKS: "주격조사",
        JKC: "보격조사",
        JKG: "관형격조사",
        JKO: "목적격조사",
        JKB: "부사격조사",
        JKV: "호격조사",
        JKQ: "인용격조사",
        JX: "보조사",
        JC: "접속조사",
        EP: "선어말어미",
        EF: "종결어미",
        EC: "연결어미",
        ETN: "명사형전성어미",
        ETM: "관형형전성어미",
        XPN: "체언접두사",
        XSN: "명사파생접미사",
        XSV: "동사파생접미사",
        XSA: "형용사파생접미사",
        XR: "어근",
        SF: "마침표, 물음표, 느낌표",
        SP: "쉼표, 가운뎃점, 콜론, 빗금",
        SS: "따옴표, 괄호표, 줄표",
        SE: "줄임표",
        SO: "붙임표(물결)",
        SW: "기타 기호",
        SL: "외국어",
        SH: "한자",
        SN: "숫자",
        NA: "분석불능범주",
      },
      tag: "문어", // 형태소 분석 문어 or 구어
      defiArr: [],
    };
  }

  handleAudioFile = (e) => {
    this.setState({ audioFile: e.target.files[0] });
  };

  handleSelecting = (e) => {
    let value = e.target.value;
    this.setState({
      languageCode: value,
      transString: "",
      rawString: "",
    });
  };

  handleTag = (e) => {
    let value = e.target.value;
    this.setState({
      tag: value,
    });
    console.log("current selected tag ", value);
  };

  handleText = (e) => {
    let value = e.target.value;
    this.setState({
      rawString: value,
    });
  };

  handleUpload = (e) => {
    e.preventDefault();
    if (this.state.audioFile === "" || this.state.audioFile === undefined) {
      Swal.fire({
        icon: "warning",
        title: "Oopsie",
        text: "Please upload a WAV file before extracting!",
      });
      return false;
    } else {
      const formData = new FormData();
      formData.append("audio", this.state.audioFile);
      Axios({
        method: "post",
        url: `/upload/${this.state.languageCode}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        this.setState((pre) => ({
          rawString: pre.rawString.concat(
            res.data["return_object"]["recognized"]
          ),
        }));
      });
    }
  };

  handleTrans = (e) => {
    e.preventDefault();
    if (this.state.rawString === "") {
      Swal.fire({
        icon: "warning",
        title: "Oopsie",
        text: "There is nothing to translate!",
      });
      return false;
    } else {
      fetch(`/translate/${this.state.languageCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawString: this.state.rawString,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            transString: data["message"]["result"]["translatedText"],
          })
        );
    }
  };

  handleDisAsble = (e) => {
    e.preventDefault();
    if (
      this.state.languageCode === "korean" &&
      this.state.rawString.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oopise",
        text: "There is nothing to disassemble!",
      });
      return false;
    } else if (
      this.state.languageCode !== "korean" &&
      this.state.transString.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oopise",
        text: "There is nothing to disassemble!",
      });
      return false;
    } else {
      const text = (this.state.languageCode === "korean"
        ? this.state.rawString
        : this.state.transString
      )
        .replace(/[.?!。]/g, "")
        .split(/\n/)
        .join(" ");
      fetch(`/disassemble/${this.state.tag}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            morpArr: data.return_object.sentence[0].morp,
          });
        });
    }
  };

  handlePopUp = (e) => {
    const word = e.target.value;
    fetch("/define", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    })
      .then((res) => res.json())
      .then((data) => {
        let filteredArr = [];
        data.return_object["WWN WordInfo"].forEach((obj) => {
          obj["WordInfo"].forEach((obj2) => {
            filteredArr.push(obj2["Definition"]);
          });
        });
        this.setState({
          defiArr: filteredArr,
        });
        if (this.state.defiArr.length !== 0)
          Swal.fire({
            // pop up
            title: word,
            html: `<div>${this.state.defiArr
              .map((text) => `<p>▪ ${text}</p>`.replace(".", ""))
              .join("")}</div>`,
          });
      });
  };

  render() {
    const {
      audioFile,
      rawString,
      languageCode,
      transString,
      morpArr,
      type,
    } = this.state;
    const {
      handleUpload,
      handleSelecting,
      handleAudioFile,
      handleTrans,
      handleText,
      handleDisAsble,
      handleTag,
      handlePopUp,
    } = this;

    return (
      <>
        <h1>ETRI API를 활용한 한국어 분석 및 학습 프로그램</h1>

        <Input
          audioFile={audioFile}
          handleUpload={handleUpload}
          handleSelecting={handleSelecting}
          handleAudioFile={handleAudioFile}
          handleText={handleText}
          rawString={rawString}
        />

        <Translation
          languageCode={languageCode}
          handleTrans={handleTrans}
          handleText={handleText}
          transString={transString}
        />

        <Result
          handleDisAsble={handleDisAsble}
          handleTag={handleTag}
          morpArr={morpArr}
          handlePopUp={handlePopUp}
          type={type}
        />
      </>
    );
  }
}

export default App;
